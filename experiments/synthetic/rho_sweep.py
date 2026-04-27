"""
rho_sweep.py
Main experiment: sweep ρ from 0 to 0.99 and compute SSS for all 4 methods.

This experiment generates:
1. The ΔSSS(ρ) curve — core result of the ρ* theorem
2. The non-monotonic arch shape — Novel Contribution #3
3. CSV results saved to results/tables/rho_sweep_results.csv
4. Plots saved to results/plots/

Theory reference: theory/02_data_model.md, theory/03_rho_star_theorem.md

Authors: Dhanraj Nandurkar, Soumitra Chavan
"""

import sys
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from data_generator import DataConfig, generate_dataset
from sss_metric import compute_delta_sss

# ─── Experiment Configuration ──────────────────────────────────────────────────

RHO_GRID = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]
N_SEEDS  = 5          # average over multiple random seeds for robustness
B_BOOTSTRAPS = 50     # bootstrap samples per SSS computation
LAM      = 0.05       # fixed λ (cross-validated in full experiments)

BASE_CFG = DataConfig(
    n=200, d=50, k=5, s_star=3,
    noise_var=0.1, random_state=42
)

METHODS  = ['lasso', 'ridge', 'elastic_net', 'group_lasso']
COLORS   = {
    'lasso':       '#E74C3C',   # red
    'ridge':       '#3498DB',   # blue
    'elastic_net': '#F39C12',   # orange
    'group_lasso': '#27AE60',   # green
}
LABELS   = {
    'lasso':       'Lasso (L1)',
    'ridge':       'Ridge (L2)',
    'elastic_net': 'Elastic Net',
    'group_lasso': 'Group Lasso',
}

RESULTS_DIR = Path(__file__).parent.parent.parent / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
(RESULTS_DIR / "plots").mkdir(exist_ok=True)
(RESULTS_DIR / "tables").mkdir(exist_ok=True)


# ─── Core Experiment ───────────────────────────────────────────────────────────

def run_rho_sweep(verbose: bool = True) -> pd.DataFrame:
    """
    For each ρ in RHO_GRID:
        - Generate dataset
        - Compute SSS for all 4 methods
        - Average over N_SEEDS seeds
    Returns DataFrame with all results.
    """
    records = []

    for rho in RHO_GRID:
        seed_results = {m: [] for m in METHODS}

        for seed in range(N_SEEDS):
            cfg = DataConfig(
                n=BASE_CFG.n, d=BASE_CFG.d, k=BASE_CFG.k,
                s_star=BASE_CFG.s_star, rho=rho,
                noise_var=BASE_CFG.noise_var,
                random_state=BASE_CFG.random_state + seed * 100
            )
            X, y, w_star, S_star = generate_dataset(cfg)

            delta = compute_delta_sss(X, y, lam=LAM, k=cfg.k,
                                      B=B_BOOTSTRAPS,
                                      random_state=seed)
            for m in METHODS:
                seed_results[m].append(delta[m])

        row = {'rho': rho}
        for m in METHODS:
            vals = seed_results[m]
            row[f'{m}_sss_mean'] = np.mean(vals)
            row[f'{m}_sss_std']  = np.std(vals)

        row['delta_sss_mean'] = (row['group_lasso_sss_mean']
                                  - row['lasso_sss_mean'])
        row['rho_star_theory'] = max(0.0, min(1.0,
                                    np.sqrt(BASE_CFG.n / BASE_CFG.k) - 1))

        records.append(row)

        if verbose:
            print(f"ρ={rho:.2f} | "
                  f"Lasso={row['lasso_sss_mean']:.3f} | "
                  f"GroupLasso={row['group_lasso_sss_mean']:.3f} | "
                  f"ΔSSS={row['delta_sss_mean']:.3f}")

    df = pd.DataFrame(records)
    df.to_csv(RESULTS_DIR / "tables" / "rho_sweep_results.csv", index=False)
    print(f"\n✅ Results saved to results/tables/rho_sweep_results.csv")
    return df


# ─── Plotting ──────────────────────────────────────────────────────────────────

def plot_sss_curves(df: pd.DataFrame):
    """
    Figure 2: SSS vs ρ for all 4 methods.
    The main result figure showing stability curves.
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle("SSS vs Correlation ρ — Stability Comparison",
                 fontsize=14, fontweight='bold', y=1.02)

    # Left: SSS curves for all 4 methods
    ax = axes[0]
    for method in METHODS:
        means = df[f'{method}_sss_mean'].values
        stds  = df[f'{method}_sss_std'].values
        rhos  = df['rho'].values

        ax.plot(rhos, means, color=COLORS[method],
                label=LABELS[method], linewidth=2.5, marker='o', markersize=5)
        ax.fill_between(rhos, means - stds, means + stds,
                        color=COLORS[method], alpha=0.15)

    ax.set_xlabel('Correlation ρ', fontsize=12)
    ax.set_ylabel('SSS (Sparsity Stability Score)', fontsize=12)
    ax.set_title('SSS Curves (all methods)', fontsize=12)
    ax.set_ylim(-0.05, 1.05)
    ax.set_xlim(-0.02, 1.01)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.axhline(y=0.5, color='gray', linestyle='--', alpha=0.5,
               label='Chance level')

    # Right: ΔSSS = Group Lasso − Lasso (the arch curve)
    ax2 = axes[1]
    delta = df['delta_sss_mean'].values
    rhos  = df['rho'].values
    rho_star_theory = df['rho_star_theory'].iloc[0]

    ax2.plot(rhos, delta, color='#8E44AD', linewidth=3,
             marker='D', markersize=6, label='ΔSSS (Group Lasso − Lasso)')
    ax2.fill_between(rhos, 0, delta,
                     where=(delta > 0),
                     color='#8E44AD', alpha=0.2,
                     label='Region where Group Lasso dominates')
    ax2.axhline(y=0, color='black', linewidth=1.5, linestyle='--')
    ax2.axvline(x=rho_star_theory, color='red', linestyle=':',
                linewidth=2, label=f'ρ* (theory) = {rho_star_theory:.2f}')

    ax2.set_xlabel('Correlation ρ', fontsize=12)
    ax2.set_ylabel('ΔSSS = SSS_GL − SSS_Lasso', fontsize=12)
    ax2.set_title('ΔSSS Curve — The Arch (Novel Result)', fontsize=12)
    ax2.set_xlim(-0.02, 1.01)
    ax2.legend(fontsize=9)
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    path = RESULTS_DIR / "plots" / "sss_curves.png"
    plt.savefig(path, dpi=150, bbox_inches='tight')
    print(f"✅ Plot saved: {path}")
    plt.show()


def plot_sparsity_heatmap(df: pd.DataFrame):
    """
    Bonus figure: How many features each method selects at each ρ.
    """
    # This would need per-method n_selected data — placeholder for now
    print("ℹ️  Sparsity heatmap requires n_selected data from full run.")


# ─── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  ρ* THRESHOLD EXPERIMENT — SSS vs Correlation Sweep")
    print(f"  Config: n={BASE_CFG.n}, d={BASE_CFG.d}, k={BASE_CFG.k}")
    print(f"  ρ grid: {RHO_GRID}")
    print(f"  Seeds: {N_SEEDS}, Bootstraps: {B_BOOTSTRAPS}")
    print("=" * 60)

    df = run_rho_sweep(verbose=True)
    plot_sss_curves(df)

    rho_star_theory = max(0.0, min(1.0,
                          np.sqrt(BASE_CFG.n / BASE_CFG.k) - 1))
    print(f"\n📐 Theoretical ρ* = √(n/k) − 1 = "
          f"√({BASE_CFG.n}/{BASE_CFG.k}) − 1 = {rho_star_theory:.4f}")

    # Find empirical ρ* (where ΔSSS first becomes consistently positive)
    delta = df['delta_sss_mean'].values
    rhos  = df['rho'].values
    positive_mask = delta > 0.02  # threshold for "consistently positive"
    if positive_mask.any():
        empirical_rho_star = rhos[positive_mask][0]
        print(f"📊 Empirical  ρ* ≈ {empirical_rho_star:.2f} "
              f"(first ρ where ΔSSS > 0.02)")
    else:
        print("📊 ΔSSS never exceeds 0.02 — Group Lasso shows no advantage")
        print("   (Expected for small n or k — check config)")

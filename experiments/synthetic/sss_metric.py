"""
sss_metric.py
Implementation of the Sparsity Stability Score (SSS) metric.
Formal definition in theory/01_sss_metric.md

Authors: Dhanraj Nandurkar, Soumitra Chavan
"""

import numpy as np
from typing import Callable, List
from models import fit_method, get_support


def symmetric_difference_score(S_b: set, S_star: set) -> float:
    """
    Compute normalized symmetric difference between two support sets.

    Formula: |S_b Δ S*| / max(|S_b|, |S*|, 1)

    Returns value in [0, 1]:
        0.0 → identical sets (perfect agreement)
        1.0 → completely disjoint sets
    """
    sym_diff = len(S_b.symmetric_difference(S_star))
    normalizer = max(len(S_b), len(S_star), 1)
    return sym_diff / normalizer


def compute_sss(X: np.ndarray, y: np.ndarray,
                method: str, lam: float,
                k: int = 5, B: int = 100,
                random_state: int = 42) -> dict:
    """
    Compute the Sparsity Stability Score for a given method and λ.

    SSS(M, λ, D) = 1 - (1/B) · Σ_b |Ŝ_b Δ S*| / max(|Ŝ_b|, |S*|, 1)

    Steps:
    1. Fit on full data → get reference support S*
    2. Draw B bootstrap subsamples of size ⌊n/2⌋
    3. Fit on each subsample → get Ŝ_b
    4. Average symmetric difference scores
    5. SSS = 1 - average

    Args:
        X, y        : full dataset
        method      : 'lasso' | 'ridge' | 'elastic_net' | 'group_lasso'
        lam         : regularization strength λ
        k           : group size (for group_lasso)
        B           : number of bootstrap samples
        random_state: for reproducibility

    Returns:
        dict with keys:
            'sss'         : float, the SSS score ∈ [0,1]
            'sss_std'     : float, std across bootstraps (uncertainty)
            'S_star'      : set, reference support on full data
            'n_selected'  : int, |S*|
            'bootstrap_scores': list of per-bootstrap symmetric diff scores
    """
    n, d = X.shape
    subsample_size = n // 2
    rng = np.random.default_rng(random_state)

    # Step 1: Reference support on full data
    w_full = fit_method(method, X, y, lam, k)
    S_star = get_support(w_full)

    # Step 2-4: Bootstrap
    per_bootstrap_scores = []

    for b in range(B):
        # Draw subsample WITHOUT replacement (following Meinshausen & Bühlmann)
        indices = rng.choice(n, size=subsample_size, replace=False)
        X_b, y_b = X[indices], y[indices]

        w_b = fit_method(method, X_b, y_b, lam, k)
        S_b = get_support(w_b)

        score = symmetric_difference_score(S_b, S_star)
        per_bootstrap_scores.append(score)

    # Step 5: SSS = 1 - mean(symmetric difference scores)
    mean_diff = np.mean(per_bootstrap_scores)
    sss = 1.0 - mean_diff

    return {
        'sss': float(sss),
        'sss_std': float(np.std(per_bootstrap_scores)),
        'S_star': S_star,
        'n_selected': len(S_star),
        'bootstrap_scores': per_bootstrap_scores
    }


def compute_sss_vs_lambda(X: np.ndarray, y: np.ndarray,
                           method: str, lambda_grid: np.ndarray,
                           k: int = 5, B: int = 50,
                           random_state: int = 42) -> dict:
    """
    Compute SSS across a grid of λ values (regularization path).

    Returns:
        dict with keys:
            'lambda_grid' : array of λ values
            'sss_values'  : SSS at each λ
            'sss_stds'    : uncertainty at each λ
            'n_selected'  : number of features selected at each λ
    """
    sss_values, sss_stds, n_selected = [], [], []

    for lam in lambda_grid:
        result = compute_sss(X, y, method, lam, k, B, random_state)
        sss_values.append(result['sss'])
        sss_stds.append(result['sss_std'])
        n_selected.append(result['n_selected'])

    return {
        'lambda_grid': lambda_grid,
        'sss_values': np.array(sss_values),
        'sss_stds': np.array(sss_stds),
        'n_selected': np.array(n_selected)
    }


def compute_delta_sss(X: np.ndarray, y: np.ndarray,
                       lam: float, k: int = 5,
                       B: int = 100, random_state: int = 42) -> dict:
    """
    Compute ΔSSS = SSS_GroupLasso − SSS_Lasso at a fixed λ and ρ.

    This is the key quantity from the ρ* theorem:
        ΔSSS > 0 → Group Lasso is more stable than Lasso
        ΔSSS ≈ 0 → methods are equivalent in stability

    Returns:
        dict with SSS for all 4 methods + ΔSSS
    """
    methods = ['lasso', 'ridge', 'elastic_net', 'group_lasso']
    results = {}

    for method in methods:
        res = compute_sss(X, y, method, lam, k, B, random_state)
        results[method] = res['sss']

    results['delta_sss'] = results['group_lasso'] - results['lasso']
    return results


if __name__ == "__main__":
    import sys
    sys.path.insert(0, '.')
    from data_generator import DataConfig, generate_dataset

    print("Testing SSS metric...")
    cfg = DataConfig(n=100, d=20, k=5, s_star=2, rho=0.8)
    X, y, w_star, S_star = generate_dataset(cfg)
    print(f"True support: {S_star}")

    for method in ['lasso', 'elastic_net', 'group_lasso']:
        result = compute_sss(X, y, method, lam=0.05, k=cfg.k, B=30)
        print(f"{method:15s} → SSS={result['sss']:.4f} ± {result['sss_std']:.4f}, "
              f"n_selected={result['n_selected']}")

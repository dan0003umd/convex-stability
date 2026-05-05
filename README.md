<div align="center">

# 🔬 Sparse Feature Selection via Convex Optimization
### An Empirical Study of Sparsity Stability under Feature Correlation




**Dhanraj Nandurkar · Soumitra Chavan**
University of Maryland — MSML 604: Advanced Machine Learning · Spring 2026

[📄 Paper](#) · [🚀 Live Demo](https://huggingface.co/spaces/Dhanraj003/sss-explorer) · [📊 Results](#results) · [⚡ Quickstart](#quickstart)

</div>

***

## 📌 Overview

This project investigates how **intra-group feature correlation** affects the **stability of sparse feature selection** across four canonical convex regularization methods: Lasso (L1), Ridge (L2), Elastic Net, and Group Lasso.

We introduce:
- The **Sparsity Stability Score (SSS)** — a normalized bootstrap-based metric in  that quantifies how consistently a method recovers the true feature support across resampled data.
- The **ρ\* Threshold Theorem** — a closed-form empirical condition identifying *exactly* when Group Lasso's stability dominates Lasso's.
- The **ΔSSS Arch** — a novel non-monotonic stability phenomenon discovered empirically across the full correlation spectrum ρ ∈ [0, 0.99].

> **Key Result:** Group Lasso achieves a consistent and measurable stability advantage over Lasso above the threshold ρ\*(n, k) = √(n/k − 1). This advantage is non-monotonic — it rises after ρ\*, peaks at intermediate correlation, and collapses as ρ → 1.

***

## 🎯 Novel Contributions

| # | Contribution | Description |
|---|---|---|
| 1 | **SSS Metric** | Normalized Jaccard-based bootstrap stability score for cross-method comparison |
| 2 | **ρ\* Threshold** | Closed-form: ρ\*(n,k) = √(n/k − 1) — identifies Group Lasso dominance regime |
| 3 | **ΔSSS Arch** | Non-monotonic three-regime stability phenomenon — not predicted by prior theory |
| 4 | **Interactive Demo** | Live Streamlit app on HuggingFace for real-time parameter exploration |

***

## 🚀 Quickstart

### 1. Clone the repository

```bash
git clone https://github.com/Dhanraj003/sparse-feature-selection.git
cd sparse-feature-selection
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Reproduce the main results

```bash
# Run the full ρ sweep experiment (generates SSS curves + ΔSSS arch)
python experiments/rho_sweep.py

# Generate the ρ* heatmap
python experiments/rho_star_heatmap.py

# All outputs saved to results/
```

### 4. Run the interactive demo locally

```bash
cd app/
streamlit run app.py
```

Or access the **live deployed demo** directly:
🔗 **[huggingface.co/spaces/Dhanraj003/sss-explorer](https://huggingface.co/spaces/Dhanraj003/sss-explorer)**

***

## 📦 Installation

**Requirements:** Python 3.10+

```bash
pip install -r requirements.txt
```

**Core dependencies:**

```
streamlit==1.32.0
plotly==5.18.0
numpy==1.26.0
pandas==2.2.0
scikit-learn==1.4.0
scipy==1.12.0
cvxpy>=1.4.0
```

All random seeds are fixed via `numpy.random.seed(42)` for full reproducibility.

***

## 📁 Repository Structure

```
sparse-feature-selection/
│
├── app/                    # Streamlit interactive demo
│   └── app.py              # Main demo app (deployed on HuggingFace)
│
├── experiments/            # Core experiment scripts
│   ├── rho_sweep.py        # Main ρ sweep → SSS curves (Fig 2)
│   ├── rho_star_heatmap.py # ρ*(n,k) heatmap (Fig 1)
│   └── delta_sss.py        # ΔSSS arch computation (Fig 3)
│
├── theory/                 # Mathematical definitions and theorems
│   ├── sss_definition.md   # Formal SSS metric definition
│   └── rho_star_theorem.md # ρ* Threshold Theorem + derivation
│
├── notebooks/              # Jupyter notebooks for exploration
│   └── exploration.ipynb   # Interactive parameter sweep notebook
│
├── results/                # Output plots and result tables
│   ├── sss_curves.png      # Figure 2 — SSS vs ρ
│   ├── delta_sss_arch.png  # Figure 3 — ΔSSS arch
│   ├── rho_star_heatmap.png# Figure 1 — ρ* heatmap
│   └── rho_sweep_results.csv
│
├── report/                 # Final paper
│   └── MSML604_report.pdf
│
├── requirements.txt        # Python dependencies
└── README.md
```

***

## 📊 Results

### Baseline Configuration

| Parameter | Symbol | Value |
|---|---|---|
| Samples | n | 200 |
| Feature dimensionality | d | 50 |
| Group size | k | 5 |
| True informative groups | s\* | 3 |
| Correlation sweep | ρ | [0, 0.99] — 40 points |
| Noise variance | σ² | 0.1 |
| Regularization strength | λ | 0.05 |
| Bootstrap iterations | B | 30 |
| Subsample fraction | f | 0.80 |

### Quantitative Summary (Table 4 from paper)

| Method | ρ≈0.10 | ρ≈0.30 | ρ≈0.51 | ρ≈0.71 | ρ≈0.91 |
|---|---|---|---|---|---|
| Lasso (L1) | 0.8106 | 0.8205 | 0.7965 | 0.7851 | 0.7569 |
| Ridge (L2) | 0.6859 | 0.6397 | 0.6070 | 0.6020 | 0.5587 |
| Elastic Net | 0.7770 | 0.7784 | 0.7689 | 0.7771 | 0.7578 |
| Group Lasso | 0.8231 | 0.8301 | 0.8027 | 0.8011 | 0.7589 |
| ΔSSS (GL−L1) | +0.0125 | +0.0095 | +0.0062 | +0.0160 | +0.0020 |

> Full CVXPY solver results and interactive parameter exploration available at the **[live demo](https://huggingface.co/spaces/Dhanraj003/sss-explorer)**.

***

## 🧮 The SSS Metric

Given B bootstrap subsamples {(X_b, y_b)}, with estimated support Ŝ_b and true support S\*:

```
score_b = 1 − |Ŝ_b △ S*| / max(|Ŝ_b|, |S*|, 1)

SSS = (1/B) Σ score_b  ∈ [0, 1]
```

- **SSS = 1** → perfect support recovery on every bootstrap subsample
- **SSS = 0** → complete instability

***

## 📐 The ρ\* Threshold Theorem

**Theorem 1 (Empirical Characterisation):**
Under the data generation model with fixed λ, s\*, σ², and d:

```
SSS_GL(ρ; n, k) − SSS_Lasso(ρ; n, k) > 0  ⟺  ρ > ρ*(n, k)

where  ρ*(n, k) = √(n/k − 1)
```

**Practical rule:** Prefer Group Lasso over Lasso when ρ > ρ\*(n, k). This threshold is meaningful (ρ\* < 1) only when n/k < 4.

> *Note: This is an empirical characterisation. A formal proof via random matrix theory is deferred to future work.*

***

## 🔬 Reproducibility

All experiments are fully reproducible:

- Fixed random seed: `numpy.random.seed(42)`
- All hyperparameters documented in `experiments/rho_sweep.py`
- Results auto-saved to `results/` as `.csv` and `.png`
- Live demo replicates all paper figures interactively

To reproduce **every figure in the paper** in one command:

```bash
python experiments/rho_sweep.py && python experiments/rho_star_heatmap.py && python experiments/delta_sss.py
```

***

## 🛠️ Tech Stack

| Category | Tools |
|---|---|
| Optimization | CVXPY (Clarabel solver), scikit-learn (coordinate descent) |
| Numerics | NumPy, SciPy, Pandas |
| Visualization | Plotly, Matplotlib, Seaborn |
| Demo | Streamlit, HuggingFace Spaces |
| Language | Python 3.10+ |

***

## ⚠️ Limitations

- **Synthetic data only** — real datasets may exhibit irregular correlation structures
- **Known group structure assumed** — Group Lasso requires group assignments a priori
- **Fixed noise variance** — σ² = 0.1 throughout; higher noise may produce different stability orderings
- **Theorem status** — ρ\* characterisation is empirical; formal proof is future work

***

## 🔭 Future Work

1. Formal proof of Theorem 1 via random matrix theory
2. Extension to logistic regression and GLMs
3. Evaluation on real biological and NLP datasets
4. Adaptive Group Lasso for unknown group structure
5. Connection to structured neural network pruning

***

## 📚 Key References

- Tibshirani (1996) — Lasso
- Hoerl & Kennard (1970) — Ridge Regression
- Zou & Hastie (2005) — Elastic Net
- Yuan & Lin (2006) — Group Lasso
- Meinshausen & Bühlmann (2010) — Stability Selection
- Bühlmann & van de Geer (2011) — Statistics for High-Dimensional Data

***

## 👥 Authors

| Name | Email | Affiliation |
|---|---|---|
| Dhanraj Nandurkar | dan0003@umd.edu | University of Maryland, College Park |
| Soumitra Chavan | schavan1@umd.edu | University of Maryland, College Park |

***

## 📄 Citation

```bibtex
@misc{nandurkar2026sparse,
  title     = {Sparse Feature Selection via Convex Optimization:
               An Empirical Study of Sparsity Stability under Feature Correlation},
  author    = {Nandurkar, Dhanraj and Chavan, Soumitra},
  year      = {2026},
  note      = {MSML 604 Final Report, University of Maryland},
  url       = {https://github.com/Dhanraj003/sparse-feature-selection}
}
```

***

<div align="center">

⭐ **Star this repo if you find it useful!**

📧 Reach out at dan0003@umd.edu · schavan1@umd.edu

</div>

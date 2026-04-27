# Sparse Feature Selection via Convex Optimization
**Authors:** Dhanraj Nandurkar, Soumitra Chavan — UMD MSML604

## Project Overview
A research project investigating sparse feature selection through convex optimization,
introducing the Sparsity Stability Score (SSS) metric and the ρ* Threshold Theorem
for principled method selection under correlated features.

## Novel Contributions
1. SSS Metric — unified stability evaluation across Lasso, Ridge, Elastic Net, Group Lasso
2. ρ* Threshold Theorem — formal condition for Group Lasso stability dominance
3. Non-monotonic stability phenomenon — empirical mapping across full ρ ∈ [0,1) spectrum
4. Convex Optimization → LLM Pruning bridge — theoretical discussion

## Folder Structure
- `theory/`        → Mathematical definitions, theorems, proofs (LaTeX + Markdown)
- `experiments/`   → Python experiment scripts (CVXPY + scikit-learn)
- `app/`           → Streamlit live demo
- `report/`        → Final paper (sections + figures)
- `notebooks/`     → Jupyter notebooks for exploration
- `data/`          → Datasets (raw + processed)
- `results/`       → Output plots and result tables
- `docs/`          → Project documentation, literature notes

## Tech Stack
Python, CVXPY, scikit-learn, NumPy, Pandas, Matplotlib, Seaborn, Streamlit

## Deployment
- Live Demo: Hugging Face Spaces (Streamlit)
- Project Page: Vercel
- Code: GitHub

# Experiments Directory

## Subfolders
- `synthetic/`    — Controlled experiments on generated data with known ground truth
- `biomedical/`   — Experiments on scRNA-seq / cancer datasets
- `lasso_vs_group/` — Direct Lasso vs. Group Lasso SSS comparison across ρ spectrum

## Naming Convention
experiment_<method>_<dataset>_<variable>.py
Example: experiment_grouplasso_synthetic_rho_sweep.py

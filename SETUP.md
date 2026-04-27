# Local Setup Guide

## Step 1 — Create Python virtual environment
```powershell
cd D:\sparse-feature-selection
python -m venv venv
venv\Scripts\activate
```

## Step 2 — Install dependencies
```powershell
pip install -r requirements.txt
```

## Step 3 — Run sanity checks
```powershell
cd experiments\synthetic
python data_generator.py     # should print X shape, true support
python models.py             # should print support for all 4 methods
python sss_metric.py         # should print SSS scores
```

## Step 4 — Run main experiment (takes ~10-20 mins)
```powershell
python rho_sweep.py
# Outputs:
#   results/tables/rho_sweep_results.csv
#   results/plots/sss_curves.png
```

## Step 5 — Run the Streamlit app locally
```powershell
cd D:\sparse-feature-selection
streamlit run app/app.py
# Opens at http://localhost:8501
```

## Step 6 — Deploy to Hugging Face Spaces (FREE, permanent)
1. Go to https://huggingface.co/spaces
2. Create new Space → SDK: Streamlit
3. Upload all files OR connect your GitHub repo
4. HF auto-installs requirements.txt and runs app.py
5. Your demo lives at: https://huggingface.co/spaces/YOUR_USERNAME/sparse-feature-selection

## Troubleshooting
- If CVXPY solver fails: `pip install clarabel` or it falls back to SCS automatically
- If Group Lasso is slow: reduce B_bootstraps in the sidebar
- Windows path issues: use `\\` or raw strings `r"D:\..."`

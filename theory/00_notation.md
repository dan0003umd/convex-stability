# 00 — Shared Notation

This file defines every symbol used across all theory documents.
All other theory files reference this. Read this first.

---

## Data

| Symbol | Meaning |
|--------|---------|
| `n` | Number of samples (observations) |
| `d` | Number of features (dimensions) |
| `k` | Number of features per group (group size) |
| `G` | Number of groups: G = d / k |
| `X ∈ ℝⁿˣᵈ` | Design matrix (data) |
| `y ∈ ℝⁿ` | Target vector |
| `Σ ∈ ℝᵈˣᵈ` | Population covariance matrix of features |
| `ρ ∈ [0,1)` | Intra-group correlation coefficient |
| `ρ*` | Threshold correlation — the critical value we derive |

## Model

| Symbol | Meaning |
|--------|---------|
| `w ∈ ℝᵈ` | Model weight vector (what we optimize) |
| `w*` | True ground-truth weight vector (known in synthetic experiments) |
| `Ŝ` | Estimated support (set of selected features: indices where ŵⱼ ≠ 0) |
| `S*` | True support (indices where w*ⱼ ≠ 0) |
| `λ > 0` | Regularization hyperparameter |
| `λ₁, λ₂` | Elastic Net hyperparameters (L1 and L2 respectively) |

## Optimization

| Symbol | Meaning |
|--------|---------|
| `‖w‖₁` | L1 norm: Σⱼ |wⱼ| |
| `‖w‖₂` | L2 norm: √(Σⱼ wⱼ²) |
| `‖w‖₂²` | Squared L2 norm |
| `‖wg‖₂` | L2 norm of group g (used in Group Lasso) |
| `Ω(w)` | Generic regularization penalty |

## Stability (SSS Metric — defined fully in 01_sss_metric.md)

| Symbol | Meaning |
|--------|---------|
| `B` | Number of bootstrap subsamples |
| `Ŝ_b` | Selected feature set on bootstrap sample b |
| `Δ` | Symmetric difference of two sets: A Δ B = (A∪B) \ (A∩B) |
| `SSS(λ, ρ)` | Sparsity Stability Score — our novel metric |
| `ΔSSS(ρ)` | SSS gap: SSS_GroupLasso(ρ) − SSS_Lasso(ρ) |

---

## Correlation Structure (Block Model)

Features are organized into G groups of k features each.
Within each group, all pairs of features have correlation ρ.
Across groups, features are uncorrelated (correlation = 0).

The covariance matrix Σ has block-diagonal structure:

```
Σ = BlockDiag(Σ_block, Σ_block, ..., Σ_block)   [G blocks]

where each Σ_block ∈ ℝᵏˣᵏ is:
     [1   ρ   ρ  ...]
     [ρ   1   ρ  ...]
Σ_block =  [ρ   ρ   1  ...]
     [................]
```

This is the **equicorrelation block model** — standard in high-dimensional statistics literature.

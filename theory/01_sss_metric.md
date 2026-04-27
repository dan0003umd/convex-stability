# 01 — Sparsity Stability Score (SSS Metric)
**Status:** Novel Contribution #1

---

## Motivation

Existing regularization methods are evaluated on:
- Prediction accuracy (MSE, R²)
- Sparsity (number of non-zero coefficients)

But neither metric answers: **"If I run this method again on a slightly different sample
from the same population, will I get the same features?"**

This is the **stability** question — critical in biomedical research where feature selection
directly drives experimental decisions (which genes to study, which biomarkers to validate).

Meinshausen & Bühlmann (2010) introduced stability selection but only for Lasso,
and only as a selection procedure (not as a comparable evaluation metric across methods).

**Our contribution:** A single scalar metric — SSS — that quantifies stability
for ANY regularization method, at any λ, under any correlation level ρ.
This enables direct, fair cross-method comparison.

---

## Formal Definition

### Setup
Let M denote a regularization method (Lasso, Ridge, Elastic Net, or Group Lasso).
Let λ be a fixed regularization strength.
Let D = {(xᵢ, yᵢ)}ⁿᵢ₌₁ be the full dataset of n samples.

### Bootstrap Procedure
Draw B bootstrap subsamples D₁, D₂, ..., D_B, each of size ⌊n/2⌋
(half-sampling, following Meinshausen & Bühlmann 2010).

For each subsample Dᵦ, fit method M with hyperparameter λ to obtain:
   ŵ_b = argmin_{w} L(w; Dᵦ) + λ·Ω_M(w)

Extract the selected support:
   Ŝ_b = { j ∈ {1,...,d} : |ŵ_b,j| > ε }

where ε = 1e-6 is a numerical zero threshold.

### Reference Support
The reference support S* is computed on the FULL dataset D:
   S* = { j ∈ {1,...,d} : |ŵ_full,j| > ε }

### SSS Definition

```
         1      B   |Ŝ_b  Δ  S*|
SSS(M, λ, D) = 1 - ─── · Σ  ────────────────
                     B   b=1  max(|Ŝ_b|, |S*|, 1)
```

Where:
- `Ŝ_b Δ S*` = symmetric difference (features in one but not both sets)
- `|·|` = cardinality (number of elements in a set)
- `max(|Ŝ_b|, |S*|, 1)` = normalizer preventing division by zero

**Range:** SSS ∈ [0, 1]
- SSS = 1.0 → perfect stability (every bootstrap selects exactly S*)
- SSS = 0.0 → complete instability (no bootstrap agrees with S*)

---

## Why This Normalizer?

The denominator `max(|Ŝ_b|, |S*|, 1)` is a deliberate choice over `|S*|` alone.

If |S*| = 0 (the full model selects nothing at high λ), dividing by |S*| = 0 is undefined.
If |Ŝ_b| >> |S*|, penalizing false inclusions proportionally to the larger set is fairer.

This is analogous to the Jaccard distance in set similarity — but inverted and normalized.

---

## Extension: SSS as a Function of ρ

For the ρ* Theorem, we compute SSS across a grid of correlation levels:

   SSS(M, λ, ρ) = E_D[SSS(M, λ, D)]  where D ~ BlockCorr(n, d, k, ρ)

This gives us a **stability curve** for each method M as a function of ρ.

The critical quantity is the **SSS gap**:

   ΔSSS(ρ) = SSS(GroupLasso, λ, ρ) − SSS(Lasso, λ, ρ)

Our theorem characterizes when ΔSSS(ρ) > 0 (Group Lasso dominates in stability).

---

## Distinguishing Properties vs. Prior Work

| Property | Stability Selection (2010) | Our SSS Metric |
|----------|--------------------------|----------------|
| Methods covered | Lasso only | Any regularization method |
| Output | Selection probabilities per feature | Single scalar per method |
| Cross-method comparison | ❌ Not designed for this | ✅ Primary purpose |
| Parameterized by ρ | ❌ | ✅ (enables ρ* theorem) |
| Normalizer handles empty support | ❌ undefined | ✅ via max(..., 1) |

---

## Next: `02_data_model.md`
Formal definition of the block-correlation data generating process used to compute SSS(M, λ, ρ).

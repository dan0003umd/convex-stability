# 04 — Geometry of Regularization Penalties
**Status:** Theoretical Foundation + Paper Figure 1 Source

---

## The Core Geometric Idea

Every regularization method adds a "constraint" on the model weights w.
The *shape* of that constraint determines whether the solution is sparse or not.

Think of it like this:
- The loss function (MSE) is a bowl — the lowest point is the best fit
- The regularization penalty is a shape placed at the origin
- The solution is where the bowl first "touches" the shape

The geometry of that shape determines EVERYTHING.

---

## 1. Ridge Regression — The Sphere (L2)

**Penalty:** Ω(w) = ‖w‖₂² = w₁² + w₂² + ... + wᵈ²

**Shape:** A smooth sphere (circle in 2D) centered at the origin

```
        w₂
         |
         |    ( ( ( 0 ) ) )   ← smooth sphere, no corners
         |
    ─────┼─────── w₁
         |
```

**Why it does NOT produce sparsity:**

The sphere has no corners or edges. When the loss function bowl rolls toward the
constraint, it lands on the curved surface — almost never exactly on an axis.
Landing on an axis would mean one weight = 0 (sparse). But the smooth curve
makes axis-contact a probability-zero event.

**What it does instead:** Shrinks ALL weights toward zero uniformly, but keeps
them all non-zero. Like turning down the volume on every feature equally.

**When to use Ridge:**
- All features genuinely contribute (no true sparsity in the problem)
- Features are highly correlated (Ridge handles multicollinearity gracefully)
- You want numerical stability over interpretability

---

## 2. Lasso — The Diamond (L1)

**Penalty:** Ω(w) = ‖w‖₁ = |w₁| + |w₂| + ... + |wᵈ|

**Shape:** A diamond (hypercube rotated 45°) with sharp corners ON the axes

```
        w₂
         |
         *        ← corners sit exactly on axes
        /|\
       / | \
      /  |  \
─────*───┼───*─── w₁
      \  |  /
       \ | /
        \|/
         *
```

**Why it DOES produce sparsity:**

The diamond has corners exactly on the coordinate axes (where w₁=0 or w₂=0).
When the loss bowl rolls down toward the diamond, it gets "caught" at a corner
— because corners are the pointiest, most protruding part of the shape.

Getting caught at a corner means one or more weights = exactly 0.
That IS sparsity. The non-smooth geometry forces it.

**Mathematically:** The subdifferential of |w| at w=0 is the interval [−1, 1],
not a single value. This means the KKT optimality condition can be satisfied
at w=0 for a range of gradient values — making zero solutions stable.

**The instability problem under high ρ:**
When two features are highly correlated, the loss bowl becomes elongated
(like a narrow valley) along the direction of correlation. The diamond corners
along w₁=0 and w₂=0 are equally close to this narrow valley. Which corner
the solution lands on depends on tiny fluctuations in the data.
→ Instability under high ρ. This is exactly what we proved in `03`.

---

## 3. Elastic Net — The Rounded Diamond (L1 + L2)

**Penalty:** Ω(w) = λ₁‖w‖₁ + λ₂‖w‖₂²

**Shape:** A diamond with rounded edges — keeps the corners (for sparsity)
but softens the faces (for stability under correlation)

```
        w₂
         |
         *        ← corners still exist (sparsity preserved)
        /~\
       /   \
      ~     ~     ← rounded faces (Ridge influence)
─────*───┼───*─── w₁
      ~     ~
       \   /
        \~/
         *
```

**Why it's a compromise:**
- Corners → still produces some sparsity (L1 component)
- Rounded faces → more stable under correlated features (L2 component)
- For perfectly correlated features (ρ→1): Elastic Net keeps both in the model
  with equal weights, rather than randomly picking one

**Limitation:** The weights are never as sparse as pure Lasso.
The trade-off between sparsity and stability is controlled by λ₁/λ₂ ratio.

---

## 4. Group Lasso — The Cylinder (L1 over L2)

**Penalty:** Ω(w) = Σ_g ‖w_g‖₂

**Shape:** For each group g, the constraint is a cylinder oriented along
the group's subspace — smooth within the group, but with a sharp edge
at the group boundary (where the entire group = 0)

```
  Group 1 subspace (w₁, w₂):        Group 2 subspace (w₃, w₄):

       w₂                                  w₄
        |     (smooth circle)               |     (smooth circle)
        |    ( ( center ) )                 |    ( ( center ) )
        |                                   |
   ─────┼──── w₁                       ─────┼──── w₃

  BUT: the boundary between "group active"
  and "group inactive" is a SHARP edge
  → entire group goes to zero together
```

**Two levels of sparsity:**
1. **Between groups (L1-like):** Sharp boundary → entire groups go to zero
   (same mechanism as Lasso's diamond corners, but at the group level)
2. **Within groups (L2-like):** Smooth sphere → individual features within
   an active group are NOT individually zeroed out

**Why this solves the instability problem:**
The decision "does this group matter?" is based on the group's L2 norm —
an average over k features. This average is much more stable across bootstrap
samples than any individual feature's contribution. More features averaged
= more stability (law of large numbers within the group).

**The precision trade-off:**
Group Lasso tells you WHICH GROUPS matter, not which individual features.
For genomics: it says "this gene pathway matters" not "this specific gene."
This is less precise but far more reproducible — which is often more useful
for scientific validation.

---

## Penalty Comparison Table

| Property | Ridge | Lasso | Elastic Net | Group Lasso |
|----------|-------|-------|-------------|-------------|
| Shape | Sphere | Diamond | Rounded Diamond | Cylinder per group |
| Individual sparsity | ❌ | ✅ | ✅ (partial) | ❌ within group |
| Group sparsity | ❌ | ❌ | ❌ | ✅ |
| Stability under high ρ | ✅ | ❌ | ✅ (partial) | ✅ |
| Handles correlated features | ✅ | ❌ | ✅ | ✅ (if grouped) |
| Requires group structure | ❌ | ❌ | ❌ | ✅ |
| Convex? | ✅ | ✅ | ✅ | ✅ |

---

## The Sparsity-Stability Trade-off (Key Insight for Paper)

There is a fundamental tension:

```
MORE SPARSITY  ←────────────────────────→  MORE STABILITY
   (Lasso)        (Elastic Net)    (Group Lasso)    (Ridge)

Picks individual     Middle          Picks groups     Picks nobody
features precisely   ground          reliably         (all included)
but unstably
```

Our SSS metric is the FIRST unified tool to quantify exactly where each method
sits on this trade-off curve — as a function of ρ.

The ρ* theorem tells you exactly when moving RIGHT on this spectrum
(toward Group Lasso) gives you enough stability gain to justify the
loss in individual-feature precision.

---

## Figure 1 Specification (for paper)

This file generates the concept for Figure 1 of the paper:
4-panel figure showing:
- Panel A: Ridge sphere (2D circle)
- Panel B: Lasso diamond (2D)
- Panel C: Elastic Net rounded diamond (2D)
- Panel D: Group Lasso cylinder cross-section (3D view, 2 groups of 2 features)

All panels show the loss contours (ellipses) touching the constraint shape,
with the solution point marked — on axis for Lasso/Group Lasso, off axis for Ridge.

→ Implementation: `experiments/synthetic/figure1_geometry.py`

---

## Next: `05_llm_bridge.md`
How everything we just defined maps formally onto modern LLM pruning.

"""
models.py
Implements all 4 regularization methods used in the project.

Methods:
    - Lasso        (L1 regularization)
    - Ridge        (L2 regularization)
    - Elastic Net  (L1 + L2 regularization)
    - Group Lasso  (Group L2 regularization via CVXPY)

Authors: Dhanraj Nandurkar, Soumitra Chavan
"""

import numpy as np
import cvxpy as cp
from sklearn.linear_model import Lasso, Ridge, ElasticNet
from sklearn.preprocessing import StandardScaler
from typing import Optional


EPSILON = 1e-6  # numerical zero threshold for sparsity


def fit_lasso(X: np.ndarray, y: np.ndarray,
              lam: float, normalize: bool = True) -> np.ndarray:
    """
    Fit Lasso regression.
    min (1/2n)‖y - Xw‖₂² + λ‖w‖₁

    Returns: weight vector w ∈ ℝᵈ
    """
    if normalize:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

    model = Lasso(alpha=lam, fit_intercept=True, max_iter=10000, tol=1e-6)
    model.fit(X, y)
    return model.coef_


def fit_ridge(X: np.ndarray, y: np.ndarray,
              lam: float, normalize: bool = True) -> np.ndarray:
    """
    Fit Ridge regression.
    min (1/2n)‖y - Xw‖₂² + λ‖w‖₂²

    Returns: weight vector w ∈ ℝᵈ
    """
    if normalize:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

    model = Ridge(alpha=lam, fit_intercept=True)
    model.fit(X, y)
    return model.coef_


def fit_elastic_net(X: np.ndarray, y: np.ndarray,
                    lam: float, l1_ratio: float = 0.5,
                    normalize: bool = True) -> np.ndarray:
    """
    Fit Elastic Net regression.
    min (1/2n)‖y - Xw‖₂² + λ·l1_ratio·‖w‖₁ + λ·(1-l1_ratio)/2·‖w‖₂²

    l1_ratio=1.0 → pure Lasso
    l1_ratio=0.0 → pure Ridge
    l1_ratio=0.5 → balanced (default)

    Returns: weight vector w ∈ ℝᵈ
    """
    if normalize:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

    model = ElasticNet(alpha=lam, l1_ratio=l1_ratio,
                       fit_intercept=True, max_iter=10000, tol=1e-6)
    model.fit(X, y)
    return model.coef_


def fit_group_lasso(X: np.ndarray, y: np.ndarray,
                    lam: float, k: int,
                    normalize: bool = True) -> np.ndarray:
    """
    Fit Group Lasso via CVXPY.
    min (1/2n)‖y - Xw‖₂² + λ·Σ_g ‖w_g‖₂

    Groups are contiguous blocks of size k.
    G = d // k groups total.

    Returns: weight vector w ∈ ℝᵈ
    """
    if normalize:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

    n, d = X.shape
    assert d % k == 0, "d must be divisible by k for Group Lasso"
    G = d // k

    w = cp.Variable(d)
    groups = [range(g * k, (g + 1) * k) for g in range(G)]

    loss = (1 / (2 * n)) * cp.sum_squares(y - X @ w)
    group_penalty = lam * cp.sum([cp.norm(w[g], 2) for g in groups])

    problem = cp.Problem(cp.Minimize(loss + group_penalty))
    problem.solve(solver=cp.CLARABEL, verbose=False)

    if w.value is None:
        # Fallback to SCS if CLARABEL fails
        problem.solve(solver=cp.SCS, verbose=False)

    return w.value if w.value is not None else np.zeros(d)


def get_support(w: np.ndarray, epsilon: float = EPSILON) -> set:
    """
    Extract support (set of non-zero feature indices) from weight vector.
    A weight is considered non-zero if |wⱼ| > epsilon.
    """
    return set(np.where(np.abs(w) > epsilon)[0].tolist())


def fit_method(method: str, X: np.ndarray, y: np.ndarray,
               lam: float, k: int = 5) -> np.ndarray:
    """
    Unified dispatcher — call any method by name.

    Args:
        method : 'lasso' | 'ridge' | 'elastic_net' | 'group_lasso'
        X, y   : data
        lam    : regularization strength λ
        k      : group size (only used for group_lasso)

    Returns: weight vector w ∈ ℝᵈ
    """
    method = method.lower()
    if method == 'lasso':
        return fit_lasso(X, y, lam)
    elif method == 'ridge':
        return fit_ridge(X, y, lam)
    elif method in ('elastic_net', 'elasticnet'):
        return fit_elastic_net(X, y, lam)
    elif method in ('group_lasso', 'grouplasso'):
        return fit_group_lasso(X, y, lam, k)
    else:
        raise ValueError(f"Unknown method: {method}. "
                         f"Choose from: lasso, ridge, elastic_net, group_lasso")


if __name__ == "__main__":
    from data_generator import DataConfig, generate_dataset

    cfg = DataConfig(n=100, d=20, k=5, s_star=2, rho=0.7)
    X, y, w_star, S_star = generate_dataset(cfg)
    print(f"True support: {S_star}")

    for method in ['lasso', 'ridge', 'elastic_net', 'group_lasso']:
        w = fit_method(method, X, y, lam=0.1, k=cfg.k)
        support = get_support(w)
        print(f"{method:15s} → support={sorted(support)}, "
              f"n_selected={len(support)}")

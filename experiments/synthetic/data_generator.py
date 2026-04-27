"""
data_generator.py
Direct implementation of the Block-Correlation Data Generating Process
defined in theory/02_data_model.md

Authors: Dhanraj Nandurkar, Soumitra Chavan
"""

import numpy as np
from dataclasses import dataclass
from typing import Tuple


@dataclass
class DataConfig:
    """All parameters that define one experimental setting."""
    n: int = 200          # number of samples
    d: int = 50           # total features
    k: int = 5            # features per group → G = d/k = 10 groups
    s_star: int = 3       # number of relevant groups (truly informative)
    rho: float = 0.5      # intra-group correlation ∈ [0, 1)
    noise_var: float = 0.1  # fraction of signal variance → SNR = 10:1
    random_state: int = 42


def build_covariance(d: int, k: int, rho: float) -> np.ndarray:
    """
    Build the block-diagonal equicorrelation covariance matrix Σ(ρ).

    Each k×k block = (1-ρ)·I_k + ρ·1_k·1_k^T
    Blocks are uncorrelated with each other.

    Returns: Σ ∈ ℝᵈˣᵈ
    """
    assert d % k == 0, "d must be divisible by k"
    G = d // k

    # Build one block
    block = (1 - rho) * np.eye(k) + rho * np.ones((k, k))

    # BlockDiag: place G copies of block along diagonal
    Sigma = np.zeros((d, d))
    for g in range(G):
        start = g * k
        end = start + k
        Sigma[start:end, start:end] = block

    return Sigma


def generate_true_weights(d: int, k: int, s_star: int,
                           rng: np.random.Generator) -> Tuple[np.ndarray, list]:
    """
    Generate sparse ground-truth weight vector w*.

    Only the FIRST feature of each of the first s_star groups is non-zero.
    Weights drawn from Uniform(0.5, 1.5).

    Returns:
        w_star: weight vector ∈ ℝᵈ
        S_star: list of indices of true support
    """
    w_star = np.zeros(d)
    S_star = []

    for g in range(s_star):
        feature_idx = g * k  # first feature of group g
        w_star[feature_idx] = rng.uniform(0.5, 1.5)
        S_star.append(feature_idx)

    return w_star, S_star


def generate_dataset(config: DataConfig) -> Tuple[np.ndarray, np.ndarray,
                                                    np.ndarray, list]:
    """
    Generate one synthetic dataset from the block-correlation model.

    Steps:
    1. Build Σ(ρ) — block diagonal covariance
    2. Draw X ~ MvN(0, Σ(ρ))
    3. Build sparse w* (first feature of first s_star groups)
    4. y = X·w* + ε,  ε ~ N(0, σ²·I)

    Returns:
        X      : (n × d) design matrix
        y      : (n,) target vector
        w_star : (d,) true weights
        S_star : list of true support indices
    """
    rng = np.random.default_rng(config.random_state)

    Sigma = build_covariance(config.d, config.k, config.rho)
    X = rng.multivariate_normal(mean=np.zeros(config.d),
                                 cov=Sigma,
                                 size=config.n)

    w_star, S_star = generate_true_weights(config.d, config.k,
                                            config.s_star, rng)

    signal = X @ w_star
    signal_var = np.var(signal)
    noise_std = np.sqrt(config.noise_var * signal_var)
    epsilon = rng.normal(0, noise_std, size=config.n)
    y = signal + epsilon

    return X, y, w_star, S_star


def generate_rho_grid(rho_values: list, base_config: DataConfig,
                      seed_offset: int = 0):
    """
    Generate datasets for a sweep of ρ values.
    Returns a dict: rho → (X, y, w_star, S_star)
    """
    datasets = {}
    for rho in rho_values:
        cfg = DataConfig(
            n=base_config.n,
            d=base_config.d,
            k=base_config.k,
            s_star=base_config.s_star,
            rho=rho,
            noise_var=base_config.noise_var,
            random_state=base_config.random_state + seed_offset
        )
        datasets[rho] = generate_dataset(cfg)
    return datasets


# Quick sanity check
if __name__ == "__main__":
    cfg = DataConfig(n=200, d=50, k=5, s_star=3, rho=0.7)
    X, y, w_star, S_star = generate_dataset(cfg)
    print(f"X shape      : {X.shape}")
    print(f"y shape      : {y.shape}")
    print(f"True support : {S_star}")
    print(f"True weights : {w_star[S_star]}")
    Sigma = build_covariance(cfg.d, cfg.k, cfg.rho)
    print(f"Σ shape      : {Sigma.shape}")
    print(f"Sample corr (feat 0,1): {np.corrcoef(X[:,0], X[:,1])[0,1]:.3f}  (expected ≈ {cfg.rho})")

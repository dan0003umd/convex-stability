export const RHO_DATA = [
  { rho: 0.0, lasso: 0.267, ridge: 1.0, elastic_net: 0.414, group_lasso: 0.914, delta: 0.646 },
  { rho: 0.1, lasso: 0.257, ridge: 1.0, elastic_net: 0.408, group_lasso: 0.874, delta: 0.616 },
  { rho: 0.2, lasso: 0.264, ridge: 1.0, elastic_net: 0.387, group_lasso: 0.828, delta: 0.565 },
  { rho: 0.3, lasso: 0.304, ridge: 1.0, elastic_net: 0.396, group_lasso: 0.86, delta: 0.557 },
  { rho: 0.4, lasso: 0.293, ridge: 1.0, elastic_net: 0.38, group_lasso: 0.902, delta: 0.608 },
  { rho: 0.5, lasso: 0.26, ridge: 1.0, elastic_net: 0.352, group_lasso: 0.915, delta: 0.655 },
  { rho: 0.6, lasso: 0.287, ridge: 1.0, elastic_net: 0.343, group_lasso: 0.833, delta: 0.546 },
  { rho: 0.7, lasso: 0.249, ridge: 1.0, elastic_net: 0.33, group_lasso: 0.781, delta: 0.532 },
  { rho: 0.8, lasso: 0.282, ridge: 1.0, elastic_net: 0.305, group_lasso: 0.781, delta: 0.5 },
  { rho: 0.9, lasso: 0.298, ridge: 1.0, elastic_net: 0.302, group_lasso: 0.722, delta: 0.423 },
  { rho: 0.95, lasso: 0.328, ridge: 1.0, elastic_net: 0.335, group_lasso: 0.759, delta: 0.431 },
  { rho: 0.99, lasso: 0.314, ridge: 1.0, elastic_net: 0.565, group_lasso: 0.688, delta: 0.374 },
];

export const METHOD_COLORS = {
  lasso: "#c0392b",
  ridge: "#2471a3",
  elastic_net: "#d4860b",
  group_lasso: "#1e8449",
  delta: "#7d3c98",
};

export const METHODS = [
  {
    key: "lasso",
    name: "Lasso",
    sparsity: "Individual",
    insight: "Strong variable pruning, but unstable with increasing feature correlation.",
  },
  {
    key: "ridge",
    name: "Ridge",
    sparsity: "None",
    insight: "Maximal stability comes at the cost of no explicit sparsity structure.",
  },
  {
    key: "elastic_net",
    name: "Elastic Net",
    sparsity: "Partial",
    insight: "Balances shrinkage and sparsity, but correlation resilience remains moderate.",
  },
  {
    key: "group_lasso",
    name: "Group Lasso",
    sparsity: "Group-level",
    insight: "Preserves grouped signal structure and remains robust under higher rho values.",
  },
];

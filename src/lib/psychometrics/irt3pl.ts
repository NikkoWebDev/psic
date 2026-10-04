// Item Response Theory (3PL) & Computerized Adaptive Testing (CAT) Engine
import { MatrixItem, MatrixResponseRecord, MatrixRuleType } from './types';

export const D_SCALING = 1.702;
export const NUM_QUADRATURE_NODES = 61;
export const QUADRATURE_MIN = -4.0;
export const QUADRATURE_MAX = 4.0;
export const MIN_CAT_ITEMS = 8; // Mínimo de reactivos para garantizar estabilidad Bayesiana inicial
export const SEM_STOPPING_THRESHOLD = 0.30; // Confiabilidad clínica r_xx >= 0.91 (estándar CAT de alta eficiencia)
export const MAX_CAT_ITEMS = 15; // Máximo de reactivos (15 ítems adaptativos equivalen a 45 ítems en test estático)


// Quadrature nodes and normal prior weights
export interface QuadratureGrid {
  nodes: number[];
  weights: number[];
}

/**
 * Standard Normal Probability Density Function
 */
export function standardNormalPDF(x: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Standard Normal Cumulative Distribution Function (CDF) using Abramowitz & Stegun approximation
 */
export function standardNormalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

/**
 * Pre-computes 61 Gauss-Hermite / Newton-Cotes nodes in [-4.0, +4.0] with standard normal weights
 */
export function getQuadratureGrid(): QuadratureGrid {
  const nodes: number[] = [];
  const rawWeights: number[] = [];
  const step = (QUADRATURE_MAX - QUADRATURE_MIN) / (NUM_QUADRATURE_NODES - 1);

  for (let i = 0; i < NUM_QUADRATURE_NODES; i++) {
    const x = QUADRATURE_MIN + i * step;
    nodes.push(x);
    rawWeights.push(standardNormalPDF(x) * step);
  }

  // Normalize weights so sum equals 1.0
  const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0);
  const weights = rawWeights.map(w => w / totalWeight);

  return { nodes, weights };
}

export const QUADRATURE = getQuadratureGrid();

/**
 * 3-Parameter Logistic (3PL) IRT probability function:
 * P_i(θ) = c_i + (1 - c_i) / (1 + exp(-1.702 * a_i * (θ - b_i)))
 */
export function calculateProbability3PL(theta: number, a: number, b: number, c: number): number {
  const logit = -D_SCALING * a * (theta - b);
  // Guard against numerical overflow in exp()
  if (logit > 35) return c;
  if (logit < -35) return 1.0;
  const logisticCore = 1.0 / (1.0 + Math.exp(logit));
  return c + (1.0 - c) * logisticCore;
}

/**
 * Fisher Information Function for 3PL model:
 * I_i(θ) = ((1.702 * a_i)^2 * (1 - P_i(θ)) * (P_i(θ) - c_i)^2) / ((1 - c_i)^2 * P_i(θ))
 */
export function calculateFisherInformation(theta: number, a: number, b: number, c: number): number {
  const P = calculateProbability3PL(theta, a, b, c);
  if (P <= c || P >= 1.0) return 0.0001;

  const numerator = Math.pow(D_SCALING * a, 2) * (1.0 - P) * Math.pow(P - c, 2);
  const denominator = Math.pow(1.0 - c, 2) * P;

  if (denominator <= 0) return 0.0001;
  return numerator / denominator;
}

export interface EAPEstimationResult {
  thetaEAP: number;
  posteriorVariance: number;
  semTheta: number;
}

/**
 * Expected A Posteriori (EAP) Bayesian estimation over 61 quadrature nodes
 * Uses log-likelihood transformation to prevent floating-point underflow
 */
export function estimateAbilityEAP(
  responses: MatrixResponseRecord[],
  grid: QuadratureGrid = QUADRATURE
): EAPEstimationResult {
  // If no responses yet, prior is standard normal N(0, 1)
  if (responses.length === 0) {
    return {
      thetaEAP: 0.0,
      posteriorVariance: 1.0,
      semTheta: 1.0
    };
  }

  // Filter out any ADHD impulsive anomalies if flagged
  const validResponses = responses.filter(r => !r.isImpulsiveAnomaly);
  if (validResponses.length === 0) {
    return {
      thetaEAP: 0.0,
      posteriorVariance: 1.0,
      semTheta: 1.0
    };
  }

  const numNodes = grid.nodes.length;
  const logLikelihoods = new Float64Array(numNodes);

  // Compute log likelihood at each node
  for (let q = 0; q < numNodes; q++) {
    const nodeTheta = grid.nodes[q];
    let logL = 0;
    for (let j = 0; j < validResponses.length; j++) {
      const resp = validResponses[j];
      const P = calculateProbability3PL(nodeTheta, resp.a, resp.b, 0.125);
      const boundedP = Math.max(0.0001, Math.min(0.9999, P));
      if (resp.isCorrect) {
        logL += Math.log(boundedP);
      } else {
        logL += Math.log(1.0 - boundedP);
      }
    }
    logLikelihoods[q] = logL;
  }

  // Find max log likelihood for stable numerical scaling
  let maxLogL = -Infinity;
  for (let q = 0; q < numNodes; q++) {
    if (logLikelihoods[q] > maxLogL) maxLogL = logLikelihoods[q];
  }

  // Compute unnormalized posterior weights: exp(logL - maxLogL) * W(X_q)
  const unnormPost = new Float64Array(numNodes);
  let totalPosterior = 0;
  for (let q = 0; q < numNodes; q++) {
    const w = Math.exp(logLikelihoods[q] - maxLogL) * grid.weights[q];
    unnormPost[q] = w;
    totalPosterior += w;
  }

  // Normalize posterior distribution
  if (totalPosterior <= 0) totalPosterior = 1e-12;
  const posterior = new Float64Array(numNodes);
  for (let q = 0; q < numNodes; q++) {
    posterior[q] = unnormPost[q] / totalPosterior;
  }

  // Calculate EAP expectation: E[θ] = Σ X_q * Post(X_q)
  let thetaEAP = 0;
  for (let q = 0; q < numNodes; q++) {
    thetaEAP += grid.nodes[q] * posterior[q];
  }

  // Calculate posterior variance: Var(θ) = Σ (X_q - EAP)^2 * Post(X_q)
  let posteriorVariance = 0;
  for (let q = 0; q < numNodes; q++) {
    const diff = grid.nodes[q] - thetaEAP;
    posteriorVariance += diff * diff * posterior[q];
  }

  // Protect against zero variance
  posteriorVariance = Math.max(0.0025, posteriorVariance);
  const semTheta = Math.sqrt(posteriorVariance);

  return {
    thetaEAP: Number(thetaEAP.toFixed(4)),
    posteriorVariance: Number(posteriorVariance.toFixed(4)),
    semTheta: Number(semTheta.toFixed(4))
  };
}

/**
 * Select the optimal next item from pool maximizing Fisher Information at current θ,
 * with taxonomic content balancing to prevent consecutive rule clustering.
 *
 * References:
 * - Kingsbury, G. G., & Zara, A. R. (1989). Procedures for selecting items for computerized adaptive tests.
 * - van der Linden, W. J., & Pashley, P. J. (2000). Item selection and ability estimation in CAT.
 */
export function selectNextItemFisher(
  currentTheta: number,
  availableItems: MatrixItem[],
  recentRuleTypes?: MatrixRuleType[]
): MatrixItem | null {
  if (availableItems.length === 0) return null;

  let bestItem: MatrixItem | null = null;
  let maxScore = -Infinity;

  const lastRule = recentRuleTypes && recentRuleTypes.length > 0
    ? recentRuleTypes[recentRuleTypes.length - 1]
    : null;
  const secondLastRule = recentRuleTypes && recentRuleTypes.length > 1
    ? recentRuleTypes[recentRuleTypes.length - 2]
    : null;

  for (let i = 0; i < availableItems.length; i++) {
    const item = availableItems[i];
    const rawInfo = calculateFisherInformation(currentTheta, item.a, item.b, item.c);

    let effectiveInfo = rawInfo;
    if (item.ruleType && lastRule) {
      if (item.ruleType === lastRule && item.ruleType === secondLastRule) {
        // Severe penalty (0.35x) for attempting a 3rd consecutive item of the exact same cognitive rule
        effectiveInfo *= 0.35;
      } else if (item.ruleType === lastRule) {
        // Moderate penalty (0.75x) for attempting a 2nd consecutive item of the same rule
        effectiveInfo *= 0.75;
      }
    }

    if (effectiveInfo > maxScore) {
      maxScore = effectiveInfo;
      bestItem = item;
    }
  }

  return bestItem;
}

/**
 * Drasgow's standardized person-fit statistic l_z:
 * l_z = (l_0 - E[l_0]) / sqrt(Var[l_0])
 */
export function calculateDrasgowLz(
  theta: number,
  responses: MatrixResponseRecord[]
): number {
  const valid = responses.filter(r => !r.isImpulsiveAnomaly);
  if (valid.length < 3) return 0.0;

  let l0 = 0;
  let expectedL0 = 0;
  let varL0 = 0;

  for (let i = 0; i < valid.length; i++) {
    const r = valid[i];
    const P = calculateProbability3PL(theta, r.a, r.b, 0.125);
    const boundedP = Math.max(0.001, Math.min(0.999, P));
    const Q = 1.0 - boundedP;

    const u = r.isCorrect ? 1 : 0;
    l0 += u * Math.log(boundedP) + (1 - u) * Math.log(Q);
    expectedL0 += boundedP * Math.log(boundedP) + Q * Math.log(Q);

    const logRatio = Math.log(boundedP / Q);
    varL0 += boundedP * Q * logRatio * logRatio;
  }

  if (varL0 <= 0.0001) return 0.0;
  const lz = (l0 - expectedL0) / Math.sqrt(varL0);
  return Number(lz.toFixed(3));
}

/**
 * ADHD Impulsive Anomaly Detection Rule:
 * If user has estimated theta > 1.0, and fails an easy item (b < -0.8) with latency < 1000ms,
 * flag as an impulsive attention lapse.
 */
export function checkADHDImpulsiveAnomaly(
  currentTheta: number,
  itemDifficulty: number,
  isCorrect: boolean,
  latencyMs: number
): boolean {
  if (currentTheta > 1.0 && !isCorrect && itemDifficulty < -0.8 && latencyMs < 1000) {
    return true;
  }
  return false;
}

/**
 * Convert theta to Wechsler standard scale (Mean = 100, SD = 15)
 */
export function thetaToWechslerIQ(theta: number): number {
  return Math.round(100 + 15 * theta);
}

export function thetaSEMToIQSEM(semTheta: number): number {
  return Number((15 * semTheta).toFixed(2));
}

export function calculateConfidenceInterval95(iq: number, semIQ: number): [number, number] {
  const margin = 1.96 * semIQ;
  return [
    Math.round(Math.max(40, iq - margin)),
    Math.round(Math.min(160, iq + margin))
  ];
}

export function thetaToPercentile(theta: number): number {
  const p = standardNormalCDF(theta) * 100;
  return Number(Math.min(99.9, Math.max(0.1, p)).toFixed(1));
}

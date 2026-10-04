// Ex-Gaussian Reaction Time Decomposition (Mu, Sigma, Tau)
// State of the art in ADHD cognitive chronometry (Kofler et al., 2013; Tamm et al., 2012)
// Decomposes RT into sensory-motor speed (mu), normal variability (sigma), and attentional lapse tail (tau)

export interface ExGaussianParameters {
  mu: number; // Baseline sensory-motor speed (ms)
  sigma: number; // Gaussian trial-to-trial standard deviation (ms)
  tau: number; // Exponential tail parameter representing attentional lapses (ms)
  lapseRatio: number; // Percentage of reaction time attributable to the exponential lapse tail: tau / (mu + tau)
  skewness?: number; // Sample skewness of the latency distribution
  clinicalMarker: 'TYPICAL_STABILITY' | 'MILD_VARIABILITY' | 'ELEVATED_ATTENTIONAL_LAPSES';
  clinicalInterpretation: string;
}

/**
 * Computes Ex-Gaussian parameters from an array of millisecond reaction times
 * using the Method of Moments (Heathcote, 1996; Lacouture & Cousineau, 2008).
 */
export function computeExGaussian(latenciesMs: number[]): ExGaussianParameters {
  const n = latenciesMs.length;

  if (n < 3) {
    const fallbackM = n > 0 ? latenciesMs.reduce((a, b) => a + b, 0) / n : 500;
    return {
      mu: Math.round(fallbackM),
      sigma: 50,
      tau: 50,
      lapseRatio: 0.1,
      skewness: 0,
      clinicalMarker: 'TYPICAL_STABILITY',
      clinicalInterpretation: 'Datos insuficientes para descomposición Ex-Gaussiana.'
    };
  }

  // 1. First moment (Sample Mean)
  const mean = latenciesMs.reduce((sum, x) => sum + x, 0) / n;

  // 2. Second central moment (Sample Variance)
  const variance = latenciesMs.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
  const sd = Math.sqrt(Math.max(1, variance));

  // 3. Third central moment (Sample Skewness with bias correction)
  const m3 = latenciesMs.reduce((sum, x) => sum + Math.pow(x - mean, 3), 0) / n;
  const skewness = (n >= 3 && sd > 0) ? (m3 / Math.pow(sd, 3)) * (Math.sqrt(n * (n - 1)) / (n - 2)) : 0;

  let mu: number;
  let sigma: number;
  let tau: number;

  if (skewness > 0.05 && variance > 0) {
    // Standard Ex-Gaussian moment derivation:
    // Skewness = 2 * (tau / sd)^3  ==> tau = sd * (skewness / 2)^(1/3)
    const rawTau = Math.cbrt((skewness * Math.pow(variance, 1.5)) / 2);

    if (rawTau > 0 && Math.pow(rawTau, 2) < variance) {
      tau = rawTau;
      sigma = Math.sqrt(variance - Math.pow(tau, 2));
      mu = mean - tau;
    } else {
      // Bound constraint when skewness is exceptionally high compared to variance
      tau = sd * 0.85;
      sigma = Math.max(15, sd * 0.52);
      mu = Math.max(30, mean - tau);
    }
  } else {
    // Symmetrical or negative skew: exponential tail is minimal
    tau = Math.max(0, sd * 0.15);
    sigma = Math.max(15, sd * 0.95);
    mu = Math.max(30, mean - tau);
  }

  // Ensure non-negative biological constraints
  mu = Math.round(Math.max(50, mu));
  sigma = Math.round(Math.max(10, sigma));
  tau = Math.round(Math.max(0, tau));

  const totalMean = mu + tau;
  const lapseRatio = totalMean > 0 ? Number((tau / totalMean).toFixed(3)) : 0;

  // Clinical ADHD Cutoffs based on Tamm et al. (2012) and Karalunas et al. (2014)
  let clinicalMarker: 'TYPICAL_STABILITY' | 'MILD_VARIABILITY' | 'ELEVATED_ATTENTIONAL_LAPSES';
  let clinicalInterpretation: string;

  if (tau >= 280) {
    clinicalMarker = 'ELEVATED_ATTENTIONAL_LAPSES';
    clinicalInterpretation = 'Presencia significativa de cola exponencial (lapsos atencionales esporádicos pero extremos), biomarcador neurocognitivo cardinal de fluctuación dopaminérgica en TDAH.';
  } else if (tau >= 170) {
    clinicalMarker = 'MILD_VARIABILITY';
    clinicalInterpretation = 'Variabilidad intraindividual moderada. Pequeñas fluctuaciones atencionales sin pérdida ejecutiva severa.';
  } else {
    clinicalMarker = 'TYPICAL_STABILITY';
    clinicalInterpretation = 'Estabilidad cronométrica armónica con baja incidencia de lapsos atencionales.';
  }

  return {
    mu,
    sigma,
    tau,
    lapseRatio,
    skewness: Number(skewness.toFixed(2)),
    clinicalMarker,
    clinicalInterpretation
  };
}

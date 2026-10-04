import { describe, it, expect } from 'vitest';
import { computeExGaussian } from './exGaussian';

describe('Ex-Gaussian Reaction Time Decomposition Tests', () => {
  it('correctly handles small or empty samples with graceful fallbacks', () => {
    const emptyResult = computeExGaussian([]);
    expect(emptyResult.mu).toBeGreaterThan(0);
    expect(emptyResult.sigma).toBeGreaterThan(0);
    expect(emptyResult.clinicalMarker).toBe('TYPICAL_STABILITY');

    const singleResult = computeExGaussian([450]);
    expect(singleResult.mu).toBe(450);
  });

  it('decomposes typical stable response times with low tau', () => {
    // Symmetrical, tight distribution around 400ms
    const stableRTs = [380, 390, 400, 410, 420, 395, 405, 415, 385, 400];
    const result = computeExGaussian(stableRTs);

    expect(result.mu).toBeGreaterThan(300);
    expect(result.tau).toBeLessThan(150);
    expect(result.clinicalMarker).toBe('TYPICAL_STABILITY');
  });

  it('identifies elevated attentional lapses (high tau) in an ADHD-like skewed distribution', () => {
    // Mostly fast baseline (450ms) but with a pronounced right-skewed tail of attentional lapses (1200ms, 1800ms, 2400ms)
    const adhdRTs = [
      410, 420, 430, 440, 450, 425, 435, 445, 460, 470,
      1200, 1650, 2400, 430, 440
    ];
    const result = computeExGaussian(adhdRTs);

    expect(result.tau).toBeGreaterThanOrEqual(280);
    expect(result.clinicalMarker).toBe('ELEVATED_ATTENTIONAL_LAPSES');
    expect(result.clinicalInterpretation).toContain('cola exponencial');
  });

  it('preserves mathematical relationship: mu + tau is close to sample mean', () => {
    const rts = [500, 520, 510, 530, 750, 540, 900, 510, 600, 1100];
    const sampleMean = rts.reduce((a, b) => a + b, 0) / rts.length;
    const result = computeExGaussian(rts);

    expect(result.mu + result.tau).toBeCloseTo(sampleMean, -1); // within 10ms tolerance due to rounding
  });
});

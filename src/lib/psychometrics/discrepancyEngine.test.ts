import { describe, it, expect } from 'vitest';
import { computeDiscrepancyProfile } from './discrepancyEngine';

describe('2e Clinical Discrepancy Engine Tests', () => {
  it('applies the square root formula correctly in denominator', () => {
    // thetaGf = 2.4, thetaGc = 2.2, thetaGwm = -0.8, thetaGs = -0.6
    const profile = computeDiscrepancyProfile({
      thetaGf: 2.4,
      semThetaGf: 0.22,
      thetaGc: 2.2,
      thetaGwm: -0.8,
      thetaGs: -0.6
    });

    // Z_comp = (2.4 + 2.2) / sqrt(2 + 2 * 0.62) = 4.6 / sqrt(3.24) = 4.6 / 1.8 = 2.5555...
    // IAG = 100 + 15 * 2.5555... = 100 + 38.33 = 138
    expect(profile.gai.score).toBeGreaterThanOrEqual(135);
    expect(profile.gai.score).toBeLessThanOrEqual(142);

    // Z_cpi = (-0.8 + -0.6) / sqrt(2 + 2 * 0.45) = -1.4 / sqrt(2.9) = -1.4 / 1.7029 = -0.822
    // CPI = 100 + 15 * -0.822 = 100 - 12.33 = 88
    expect(profile.cpi.score).toBeLessThanOrEqual(92);
    expect(profile.cpi.score).toBeGreaterThanOrEqual(84);
  });

  it('triggers 2E_AACC_ADHD flag when Delta >= 23 with high GAI and low CPI', () => {
    const profile = computeDiscrepancyProfile({
      thetaGf: 2.5,
      semThetaGf: 0.20,
      thetaGc: 2.1,
      thetaGwm: -1.0,
      thetaGs: -0.8
    });

    expect(profile.discrepancyDelta).toBeGreaterThanOrEqual(23);
    expect(profile.isFsiqValid).toBe(false);
    expect(profile.clinicalSyndromeFlag).toBe('2E_AACC_ADHD');
    expect(profile.certifiedIntelligencePotential).toBe(profile.gai.score);
    expect(profile.populationBaseRate).toContain('< 0.5%');
  });

  it('correctly reports SEM_diff = sqrt(SEM_GAI^2 + SEM_CPI^2)', () => {
    const profile = computeDiscrepancyProfile({
      thetaGf: 1.0,
      semThetaGf: 0.25,
      thetaGc: 1.0,
      thetaGwm: 0.0,
      thetaGs: 0.0
    });

    const expectedSemDiff = Math.sqrt(profile.gai.sem * profile.gai.sem + profile.cpi.sem * profile.cpi.sem);
    expect(profile.semDiff).toBeCloseTo(expectedSemDiff, 1);
  });

  it('maintains valid FSIQ when profile is harmonious (Delta < 23)', () => {
    const profile = computeDiscrepancyProfile({
      thetaGf: 1.0,
      semThetaGf: 0.25,
      thetaGc: 1.1,
      thetaGwm: 0.9,
      thetaGs: 0.8
    });

    expect(profile.discrepancyDelta).toBeLessThan(23);
    expect(profile.isFsiqValid).toBe(true);
    expect(profile.clinicalSyndromeFlag).toBe('HARMONIOUS_AVERAGE');
  });
});

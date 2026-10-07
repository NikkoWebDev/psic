import { describe, it, expect } from 'vitest';
import { computeDiscrepancyProfile } from './discrepancyEngine';

describe('2e Clinical Discrepancy Engine Tests', () => {
  it('applies the square root formula correctly with sqrt(3.0) and sqrt(2.7) divisors', () => {
    // thetaGf = 2.4, thetaGc = 2.2, thetaGwm = -0.8, thetaGs = -0.6
    const profile = computeDiscrepancyProfile({
      thetaGf: 2.4,
      semThetaGf: 0.22,
      thetaGc: 2.2,
      thetaGwm: -0.8,
      thetaGs: -0.6
    });

    // Z_comp = (2.4 + 2.2) / sqrt(2 + 2 * 0.50) = 4.6 / sqrt(3.0) ≈ 4.6 / 1.73205 = 2.6558
    // IAG = round(100 + 15 * 2.6558) = 140
    expect(profile.gai.score).toBe(140);

    // Z_cpi = (-0.8 + -0.6) / sqrt(2 + 2 * 0.35) = -1.4 / sqrt(2.7) ≈ -1.4 / 1.64317 = -0.852
    // CPI = round(100 + 15 * -0.852) = 87
    expect(profile.cpi.score).toBe(87);
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

import { describe, it, expect } from 'vitest';
import { getAgeNormOffsets, AGE_NORM_OFFSETS } from './ageNorms';

describe('Developmental Age-Adjustment Norms (WISC-V / WAIS-IV)', () => {
  it('verifies children 8-11 receive appropriate developmental boosts', () => {
    const offsets = getAgeNormOffsets('8-11');
    expect(offsets.offsetGwm).toBe(1.40);
    expect(offsets.offsetGc).toBe(1.20);
    expect(offsets.offsetGs).toBe(0.80);
  });

  it('verifies adolescents 12-15 receive maturation adjustments', () => {
    const offsets = getAgeNormOffsets('12-15');
    expect(offsets.offsetGwm).toBe(0.50);
    expect(offsets.offsetGc).toBe(0.50);
    expect(offsets.offsetGs).toBe(0.30);
  });

  it('verifies adults 16-25 and 26-45 have zero baseline offsets', () => {
    const youngAdult = getAgeNormOffsets('16-25');
    const adult = getAgeNormOffsets('26-45');
    expect(youngAdult.offsetGwm).toBe(0.0);
    expect(youngAdult.offsetGc).toBe(0.0);
    expect(youngAdult.offsetGs).toBe(0.0);
    expect(adult.offsetGwm).toBe(0.0);
    expect(adult.offsetGc).toBe(0.0);
    expect(adult.offsetGs).toBe(0.0);
  });

  it('verifies older adults receive motor slowing offsets in Gs', () => {
    const mature = getAgeNormOffsets('46-65');
    const senior = getAgeNormOffsets('65+');
    expect(mature.offsetGs).toBe(0.40);
    expect(senior.offsetGs).toBe(0.60);
    expect(mature.offsetGwm).toBe(0.0);
    expect(senior.offsetGc).toBe(0.0);
  });

  it('falls back to default adult baseline when bracket is undefined', () => {
    const fallback = getAgeNormOffsets(undefined);
    expect(fallback).toEqual(AGE_NORM_OFFSETS['26-45']);
  });
});

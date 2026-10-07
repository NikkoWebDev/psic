import { describe, it, expect } from 'vitest';
import { VERBAL_ITEMS_POOL, calculateGcScore } from './verbalItemsPool';

describe('Calibrated Relational Verbal Analogies (Gc)', () => {
  it('contains exactly 16 items symmetrically centered at mean difficulty ~ 0.0', () => {
    expect(VERBAL_ITEMS_POOL.length).toBe(16);
    const meanB = VERBAL_ITEMS_POOL.reduce((acc, item) => acc + item.difficulty, 0) / 16;
    expect(Math.abs(meanB)).toBeLessThan(0.05);
  });

  it('maintains uniform key distribution across options 0, 1, 2, 3 (eliminating position bias)', () => {
    const counts = [0, 0, 0, 0];
    for (const item of VERBAL_ITEMS_POOL) {
      counts[item.correctIndex]++;
    }
    expect(counts).toEqual([4, 4, 4, 4]); // Exactly 25% for every option index
  });

  it('yields theta_Gc in [-0.15, +0.15] for 50% accuracy on adult baseline', () => {
    // Correctly answer exactly 8 out of 16 items
    const answers: Record<string, number> = {};
    for (let i = 0; i < 8; i++) {
      answers[VERBAL_ITEMS_POOL[i].id] = VERBAL_ITEMS_POOL[i].correctIndex;
    }
    // Wrong answers for the remaining 8
    for (let i = 8; i < 16; i++) {
      answers[VERBAL_ITEMS_POOL[i].id] = (VERBAL_ITEMS_POOL[i].correctIndex + 1) % 4;
    }

    const result = calculateGcScore(answers, 0.0);
    expect(result.score).toBe(8);
    expect(result.total).toBe(16);
    expect(result.thetaGc).toBeGreaterThanOrEqual(-0.15);
    expect(result.thetaGc).toBeLessThanOrEqual(0.15);
    expect(result.percentile).toBeCloseTo(50, 0);
  });

  it('applies developmental age offset (+1.20) for children in bracket 8-11', () => {
    const answers: Record<string, number> = {};
    for (let i = 0; i < 8; i++) {
      answers[VERBAL_ITEMS_POOL[i].id] = VERBAL_ITEMS_POOL[i].correctIndex;
    }
    for (let i = 8; i < 16; i++) {
      answers[VERBAL_ITEMS_POOL[i].id] = (VERBAL_ITEMS_POOL[i].correctIndex + 1) % 4;
    }

    const adultResult = calculateGcScore(answers, 0.0);
    const childResult = calculateGcScore(answers, 1.20);
    expect(childResult.thetaGc).toBeCloseTo(adultResult.thetaGc + 1.20, 2);
  });
});

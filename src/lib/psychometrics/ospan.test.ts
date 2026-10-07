import { describe, it, expect } from 'vitest';
import {
  calculateAdaptiveMathTimeout,
  calculateTrialPCU,
  computeAOSpanTheta,
  gradeAOSpanSession
} from './ospan';
import { OSpanRoundResult } from './types';

describe('AOSPAN Engine (Redick & Engle, 2012 Calibration)', () => {
  it('computes individualized math timeout with 2.5 SD padding and 3500ms floor', () => {
    // Fast user: 1200ms, 1400ms, 1300ms -> mean 1300, sd 100 -> 1300 + 250 = 1550 < 3500 floor
    const fast = calculateAdaptiveMathTimeout([1200, 1400, 1300]);
    expect(fast.timeoutMs).toBe(3500);

    // Thoughtful user: 3000ms, 4000ms, 5000ms -> mean 4000, sd 1000 -> 4000 + 2500 = 6500ms
    const thoughtful = calculateAdaptiveMathTimeout([3000, 4000, 5000]);
    expect(thoughtful.timeoutMs).toBe(6500);
  });

  it('calculates Partial-Credit Unit (PCU) score for trials', () => {
    // 3 out of 4 correct in serial order -> 0.75
    const score1 = calculateTrialPCU(['F', 'H', 'J', 'K'], ['F', 'H', 'J', 'R']);
    expect(score1).toBe(0.75);

    // 0 out of 2 -> 0.0
    const score2 = calculateTrialPCU(['S', 'T'], ['A', 'B']);
    expect(score2).toBe(0.0);

    // 7 out of 7 -> 1.0
    const letters = ['F', 'H', 'J', 'K', 'L', 'N', 'P'];
    const score3 = calculateTrialPCU(letters, letters);
    expect(score3).toBe(1.0);
  });

  it('eliminates the +2.27 ceiling: scales theta_Gwm continuously up to +3.00 sigma', () => {
    // High adult performance (PCU = 12.0/12)
    const adultTheta = computeAOSpanTheta(12.0, 0.0);
    expect(adultTheta).toBe(2.50); // Beats the old 2.27 ceiling

    // Near-ceiling adolescent with offset (e.g. PCU = 11.6, offset = +0.50)
    const adolescentTheta = computeAOSpanTheta(11.6, 0.50);
    expect(adolescentTheta).toBeGreaterThan(2.50); // 2.78 sigma
    expect(adolescentTheta).toBe(2.78);

    // Child in bracket 8-11 with offset +1.40
    const childTheta = computeAOSpanTheta(10.0, 1.40);
    expect(childTheta).toBe(2.79);

    // Perfect child reaches bounded ceiling +3.00 sigma
    const maxChildTheta = computeAOSpanTheta(12.0, 1.40);
    expect(maxChildTheta).toBe(3.00);
  });

  it('grades complete 12-round session with PCU and validity rate', () => {
    const mockResults: OSpanRoundResult[] = Array.from({ length: 12 }, (_, i) => ({
      roundIndex: i,
      spanLength: Math.floor(i / 2) + 2, // 2,2, 3,3, 4,4, 5,5, 6,6, 7,7
      isPractice: false,
      mathAccuracyCount: 4,
      mathTotalCount: 4,
      recalledLetters: ['A', 'B'],
      targetLetters: ['A', 'B'],
      correctLetterCount: 2,
      roundCompleteSuccess: true,
      trialScore: 1.0
    }));

    const finalScore = gradeAOSpanSession(mockResults, 0.50, 2200, 4800);
    expect(finalScore.totalRounds).toBe(12);
    expect(finalScore.totalPCUScore).toBe(12.0);
    expect(finalScore.mathAccuracyRate).toBe(100);
    expect(finalScore.thetaGwm).toBe(3.00);
    expect(finalScore.percentile).toBeGreaterThanOrEqual(99.0);
  });
});

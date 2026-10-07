// Automated Operation Span (AOSPAN) Engine based on Redick & Engle (2012)
import { OSpanRound, OSpanFinalScore, OSpanRoundResult } from './types';

export interface MathPracticeTrial {
  equationText: string;
  claimedResult: number;
  isEquationCorrect: boolean;
}

export const MATH_PRACTICE_TRIALS: MathPracticeTrial[] = [
  { equationText: '(3 * 2) - 1 = 5', claimedResult: 5, isEquationCorrect: true },
  { equationText: '(4 * 2) + 3 = 10', claimedResult: 10, isEquationCorrect: false },
  { equationText: '(8 / 2) + 4 = 8', claimedResult: 8, isEquationCorrect: true }
];

export const CANDIDATE_LETTERS = ['F', 'H', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'T', 'Y'];

// 6 sets of increasing span (2, 3, 4, 5, 6, 7), 2 trials each = 12 trials total (54 letters)
export const AOSPAN_SCORED_ROUNDS: OSpanRound[] = [
  // Set 1: Span 2
  {
    spanLength: 2,
    isPractice: false,
    steps: [
      { equationText: '(4 * 2) - 3 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'L' },
      { equationText: '(6 / 2) + 5 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'S' }
    ]
  },
  {
    spanLength: 2,
    isPractice: false,
    steps: [
      { equationText: '(3 * 3) - 4 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'R' },
      { equationText: '(8 / 4) + 6 = 7', claimedResult: 7, isEquationCorrect: false, letter: 'K' }
    ]
  },

  // Set 2: Span 3
  {
    spanLength: 3,
    isPractice: false,
    steps: [
      { equationText: '(3 * 3) - 2 = 7', claimedResult: 7, isEquationCorrect: true, letter: 'F' },
      { equationText: '(10 / 2) + 3 = 9', claimedResult: 9, isEquationCorrect: false, letter: 'N' },
      { equationText: '(4 * 3) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'Q' }
    ]
  },
  {
    spanLength: 3,
    isPractice: false,
    steps: [
      { equationText: '(7 * 2) - 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'J' },
      { equationText: '(12 / 3) + 4 = 7', claimedResult: 7, isEquationCorrect: false, letter: 'H' },
      { equationText: '(5 * 3) - 6 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'P' }
    ]
  },

  // Set 3: Span 4
  {
    spanLength: 4,
    isPractice: false,
    steps: [
      { equationText: '(6 * 2) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'T' },
      { equationText: '(15 / 3) + 2 = 8', claimedResult: 8, isEquationCorrect: false, letter: 'K' },
      { equationText: '(4 * 4) - 5 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'R' },
      { equationText: '(8 / 4) + 6 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'L' }
    ]
  },
  {
    spanLength: 4,
    isPractice: false,
    steps: [
      { equationText: '(5 * 4) - 7 = 13', claimedResult: 13, isEquationCorrect: true, letter: 'Y' },
      { equationText: '(18 / 2) - 3 = 5', claimedResult: 5, isEquationCorrect: false, letter: 'F' },
      { equationText: '(3 * 5) - 6 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'S' },
      { equationText: '(14 / 2) + 2 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'N' }
    ]
  },

  // Set 4: Span 5
  {
    spanLength: 5,
    isPractice: false,
    steps: [
      { equationText: '(9 * 2) - 7 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'S' },
      { equationText: '(16 / 4) + 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'F' },
      { equationText: '(5 * 4) - 8 = 10', claimedResult: 10, isEquationCorrect: false, letter: 'N' },
      { equationText: '(18 / 3) + 3 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'Y' },
      { equationText: '(7 * 3) - 9 = 12', claimedResult: 12, isEquationCorrect: true, letter: 'J' }
    ]
  },
  {
    spanLength: 5,
    isPractice: false,
    steps: [
      { equationText: '(8 * 3) - 5 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'Q' },
      { equationText: '(20 / 4) + 7 = 12', claimedResult: 12, isEquationCorrect: true, letter: 'P' },
      { equationText: '(6 * 3) - 4 = 15', claimedResult: 15, isEquationCorrect: false, letter: 'H' },
      { equationText: '(21 / 3) - 2 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'T' },
      { equationText: '(4 * 5) - 6 = 14', claimedResult: 14, isEquationCorrect: true, letter: 'L' }
    ]
  },

  // Set 5: Span 6
  {
    spanLength: 6,
    isPractice: false,
    steps: [
      { equationText: '(4 * 6) - 5 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'R' },
      { equationText: '(24 / 3) + 3 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'K' },
      { equationText: '(7 * 2) + 4 = 17', claimedResult: 17, isEquationCorrect: false, letter: 'F' },
      { equationText: '(18 / 6) + 8 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'J' },
      { equationText: '(5 * 5) - 7 = 18', claimedResult: 18, isEquationCorrect: true, letter: 'S' },
      { equationText: '(27 / 3) - 4 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'Y' }
    ]
  },
  {
    spanLength: 6,
    isPractice: false,
    steps: [
      { equationText: '(6 * 4) - 8 = 16', claimedResult: 16, isEquationCorrect: true, letter: 'P' },
      { equationText: '(32 / 4) + 2 = 9', claimedResult: 9, isEquationCorrect: false, letter: 'H' },
      { equationText: '(3 * 7) - 6 = 15', claimedResult: 15, isEquationCorrect: true, letter: 'N' },
      { equationText: '(28 / 7) + 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'T' },
      { equationText: '(8 * 2) + 3 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'L' },
      { equationText: '(15 / 5) + 6 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'Q' }
    ]
  },

  // Set 6: Span 7
  {
    spanLength: 7,
    isPractice: false,
    steps: [
      { equationText: '(5 * 6) - 9 = 21', claimedResult: 21, isEquationCorrect: true, letter: 'T' },
      { equationText: '(36 / 6) + 4 = 10', claimedResult: 10, isEquationCorrect: true, letter: 'R' },
      { equationText: '(7 * 4) - 5 = 22', claimedResult: 22, isEquationCorrect: false, letter: 'K' },
      { equationText: '(25 / 5) + 8 = 13', claimedResult: 13, isEquationCorrect: true, letter: 'Y' },
      { equationText: '(4 * 7) - 9 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'F' },
      { equationText: '(30 / 5) + 3 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'S' },
      { equationText: '(6 * 5) - 7 = 23', claimedResult: 23, isEquationCorrect: true, letter: 'N' }
    ]
  },
  {
    spanLength: 7,
    isPractice: false,
    steps: [
      { equationText: '(9 * 3) - 8 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'J' },
      { equationText: '(40 / 5) + 2 = 11', claimedResult: 11, isEquationCorrect: false, letter: 'H' },
      { equationText: '(8 * 4) - 7 = 25', claimedResult: 25, isEquationCorrect: true, letter: 'P' },
      { equationText: '(42 / 6) + 3 = 10', claimedResult: 10, isEquationCorrect: true, letter: 'L' },
      { equationText: '(3 * 8) - 5 = 19', claimedResult: 19, isEquationCorrect: true, letter: 'Q' },
      { equationText: '(45 / 5) - 3 = 6', claimedResult: 6, isEquationCorrect: true, letter: 'K' },
      { equationText: '(7 * 3) + 4 = 25', claimedResult: 25, isEquationCorrect: true, letter: 'R' }
    ]
  }
];

/**
 * Calculates adaptive math timeout from practice latency samples
 * Adaptive Math Timeout = max(3500 ms, mean_math + 2.5 * sd_math)
 */
export function calculateAdaptiveMathTimeout(latenciesMs: number[]): {
  meanLatency: number;
  sdLatency: number;
  timeoutMs: number;
} {
  if (latenciesMs.length === 0) {
    return { meanLatency: 3500, sdLatency: 0, timeoutMs: 3500 };
  }
  const mean = latenciesMs.reduce((a, b) => a + b, 0) / latenciesMs.length;
  const variance =
    latenciesMs.length > 1
      ? latenciesMs.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (latenciesMs.length - 1)
      : 0;
  const sd = Math.sqrt(variance);
  const timeoutMs = Math.max(3500, Math.round(mean + 2.5 * sd));

  return {
    meanLatency: Math.round(mean),
    sdLatency: Math.round(sd),
    timeoutMs
  };
}

/**
 * Partial-Credit Unit Scoring (PCU) for a single trial
 * Trial Score = Correct Letters in Exact Serial Position / Set Size
 */
export function calculateTrialPCU(recalled: string[], target: string[]): number {
  if (target.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < target.length; i++) {
    if (recalled[i] === target[i]) {
      correct++;
    }
  }
  return Number((correct / target.length).toFixed(4));
}

/**
 * Continuous Working Memory Ability Score (theta_Gwm)
 * theta_Gwm = ((Total PCU - 7.5) / 1.8) + AgeOffset_Gwm
 * Bounded continuously in [-3.0, +3.0]
 */
export function computeAOSpanTheta(totalPCU: number, ageOffsetGwm: number = 0): number {
  const rawTheta = (totalPCU - 7.5) / 1.8 + ageOffsetGwm;
  return Number(Math.max(-3.0, Math.min(3.0, rawTheta)).toFixed(2));
}

/**
 * Finalizes AOSPAN score bundle
 */
export function gradeAOSpanSession(
  results: OSpanRoundResult[],
  ageOffsetGwm: number = 0,
  mathBaselineLatencyMs?: number,
  adaptiveMathTimeoutMs?: number
): OSpanFinalScore {
  const totalLettersPresented = results.reduce((sum, r) => sum + r.spanLength, 0);
  const totalLettersCorrect = results.reduce((sum, r) => sum + r.correctLetterCount, 0);

  // Absolute ANU score: only counts span length if 100% correct
  const absoluteOSpanScore = results.reduce(
    (sum, r) => (r.roundCompleteSuccess ? sum + r.spanLength : sum),
    0
  );

  // Partial-Credit Unit (PCU) Score: sum of fractional trial scores (0.0 to 12.0)
  const totalPCUScore = Number(
    results
      .reduce((sum, r) => sum + (r.trialScore ?? calculateTrialPCU(r.recalledLetters, r.targetLetters)), 0)
      .toFixed(2)
  );

  const totalMathEquations = results.reduce((sum, r) => sum + r.mathTotalCount, 0);
  const totalMathCorrect = results.reduce((sum, r) => sum + r.mathAccuracyCount, 0);
  const mathAccuracyRate = Math.round((totalMathCorrect / Math.max(1, totalMathEquations)) * 100);

  const thetaGwm = computeAOSpanTheta(totalPCUScore, ageOffsetGwm);

  // Standard normal percentile
  const percentile = Math.round(
    Math.min(99.9, Math.max(0.1, (1 / (1 + Math.exp(-1.702 * thetaGwm))) * 100))
  );

  return {
    totalRounds: results.length,
    totalLettersPresented,
    totalLettersCorrect,
    absoluteOSpanScore,
    totalPCUScore,
    mathAccuracyRate,
    mathBaselineLatencyMs,
    adaptiveMathTimeoutMs,
    thetaGwm,
    percentile
  };
}

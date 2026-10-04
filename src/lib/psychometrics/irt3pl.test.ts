import { describe, it, expect } from 'vitest';
import {
  calculateProbability3PL,
  calculateFisherInformation,
  estimateAbilityEAP,
  selectNextItemFisher,
  calculateDrasgowLz,
  checkADHDImpulsiveAnomaly,
  thetaToWechslerIQ,
  QUADRATURE
} from './irt3pl';
import { MatrixResponseRecord, MatrixItem } from './types';

describe('IRT 3PL & CAT Engine Tests', () => {
  it('evaluates 3PL probability correctly at theta = b', () => {
    // When theta = b, logistic term is exp(0) = 1, so P = c + (1-c)/2 = (1+c)/2
    const a = 1.5;
    const b = 0.5;
    const c = 0.125;
    const p = calculateProbability3PL(b, a, b, c);
    expect(p).toBeCloseTo((1 + c) / 2, 4);
  });

  it('guarantees probability bounds within [c, 1.0]', () => {
    const c = 0.125;
    expect(calculateProbability3PL(-10, 2.0, 0.0, c)).toBeGreaterThanOrEqual(c);
    expect(calculateProbability3PL(10, 2.0, 0.0, c)).toBeLessThanOrEqual(1.0);
  });

  it('calculates Fisher Information peak near item difficulty', () => {
    const a = 1.8;
    const b = 1.0;
    const c = 0.125;

    const infoAtB = calculateFisherInformation(b, a, b, c);
    const infoFarBelow = calculateFisherInformation(-2.0, a, b, c);
    const infoFarAbove = calculateFisherInformation(4.0, a, b, c);

    expect(infoAtB).toBeGreaterThan(infoFarBelow);
    expect(infoAtB).toBeGreaterThan(infoFarAbove);
  });

  it('verifies 61-node Gauss-Hermite quadrature sums to 1.0', () => {
    expect(QUADRATURE.nodes.length).toBe(61);
    const sumWeights = QUADRATURE.weights.reduce((sum, w) => sum + w, 0);
    expect(sumWeights).toBeCloseTo(1.0, 5);
  });

  it('recovers high theta for consistent correct responses', () => {
    const mockResponses: MatrixResponseRecord[] = [
      { itemId: '1', itemCode: 'C1', selectedOption: 1, isCorrect: true, a: 1.5, b: -1.0, latencyMs: 3000 },
      { itemId: '2', itemCode: 'C2', selectedOption: 1, isCorrect: true, a: 1.8, b: 0.0, latencyMs: 3500 },
      { itemId: '3', itemCode: 'C3', selectedOption: 1, isCorrect: true, a: 2.0, b: 1.2, latencyMs: 4000 },
      { itemId: '4', itemCode: 'C4', selectedOption: 1, isCorrect: true, a: 2.2, b: 2.0, latencyMs: 4500 }
    ];

    const result = estimateAbilityEAP(mockResponses);
    expect(result.thetaEAP).toBeGreaterThan(1.5);
    expect(result.semTheta).toBeLessThan(0.85);

    // Adding more items converges SEM lower
    const longerResponses: MatrixResponseRecord[] = [
      ...mockResponses,
      { itemId: '5', itemCode: 'C5', selectedOption: 1, isCorrect: true, a: 2.3, b: 2.2, latencyMs: 4000 },
      { itemId: '6', itemCode: 'C6', selectedOption: 1, isCorrect: true, a: 2.4, b: 2.4, latencyMs: 4200 },
      { itemId: '7', itemCode: 'C7', selectedOption: 1, isCorrect: true, a: 2.4, b: 2.5, latencyMs: 4500 },
      { itemId: '8', itemCode: 'C8', selectedOption: 1, isCorrect: true, a: 2.5, b: 2.6, latencyMs: 4800 }
    ];
    const converged = estimateAbilityEAP(longerResponses);
    expect(converged.semTheta).toBeLessThan(0.45);
  });

  it('detects ADHD impulsive lapse when high-ability user fails easy item under 1000ms', () => {
    const isAnomaly = checkADHDImpulsiveAnomaly(
      1.5, // current estimated theta > 1.0
      -1.2, // easy item b < -0.8
      false, // failed item
      650 // latency < 1000ms
    );
    expect(isAnomaly).toBe(true);

    // Normal thoughtful failure on hard item should NOT be flagged
    const normalFail = checkADHDImpulsiveAnomaly(1.5, 1.8, false, 8500);
    expect(normalFail).toBe(false);
  });

  it('calculates Drasgow lz person fit correctly', () => {
    const responses: MatrixResponseRecord[] = [
      { itemId: '1', itemCode: 'C1', selectedOption: 1, isCorrect: true, a: 1.5, b: -1.5, latencyMs: 2500 },
      { itemId: '2', itemCode: 'C2', selectedOption: 1, isCorrect: true, a: 1.5, b: -0.5, latencyMs: 3000 },
      { itemId: '3', itemCode: 'C3', selectedOption: 1, isCorrect: true, a: 1.5, b: 0.5, latencyMs: 3500 }
    ];
    const lz = calculateDrasgowLz(0.0, responses);
    expect(typeof lz).toBe('number');
    expect(lz).toBeGreaterThan(-3.0);
  });

  it('converts theta to Wechsler IQ scale correctly', () => {
    expect(thetaToWechslerIQ(0.0)).toBe(100);
    expect(thetaToWechslerIQ(2.0)).toBe(130);
    expect(thetaToWechslerIQ(-1.0)).toBe(85);
  });

  it('selects item with highest Fisher Information when no history provided', () => {
    const itemA: MatrixItem = {
      id: 'item_a',
      code: 'A',
      tier: 2,
      ruleType: 'rotation',
      ruleDescription: 'Rotation test',
      cells: [],
      options: [],
      a: 2.2,
      b: 0.0,
      c: 0.125,
      correctOptionIndex: 0
    };
    const itemB: MatrixItem = {
      id: 'item_b',
      code: 'B',
      tier: 2,
      ruleType: 'progression',
      ruleDescription: 'Progression test',
      cells: [],
      options: [],
      a: 1.2,
      b: 0.0,
      c: 0.125,
      correctOptionIndex: 0
    };

    const selected = selectNextItemFisher(0.0, [itemA, itemB]);
    expect(selected?.id).toBe('item_a');
  });

  it('penalizes consecutive rule repetition to balance taxonomic cognitive variety', () => {
    // itemRotation has higher raw Fisher info at theta=0.0
    const itemRotation: MatrixItem = {
      id: 'item_rot',
      code: 'ROT',
      tier: 2,
      ruleType: 'rotation',
      ruleDescription: 'Rotation test',
      cells: [],
      options: [],
      a: 2.0,
      b: 0.0,
      c: 0.125,
      correctOptionIndex: 0
    };
    // itemProgression has slightly lower raw Fisher info
    const itemProgression: MatrixItem = {
      id: 'item_prog',
      code: 'PROG',
      tier: 2,
      ruleType: 'progression',
      ruleDescription: 'Progression test',
      cells: [],
      options: [],
      a: 1.8,
      b: 0.0,
      c: 0.125,
      correctOptionIndex: 0
    };

    // Without history, rotation wins
    const defaultSelect = selectNextItemFisher(0.0, [itemRotation, itemProgression]);
    expect(defaultSelect?.id).toBe('item_rot');

    // With history of 2 consecutive rotations, rotation is penalized (0.35x), progression wins!
    const balancedSelect = selectNextItemFisher(
      0.0,
      [itemRotation, itemProgression],
      ['rotation', 'rotation']
    );
    expect(balancedSelect?.id).toBe('item_prog');
  });

  it('safely selects the only available item even if penalizing consecutive rule', () => {
    const onlyRotation: MatrixItem = {
      id: 'item_rot_only',
      code: 'ROT_ONLY',
      tier: 3,
      ruleType: 'rotation',
      ruleDescription: 'Rotation only test',
      cells: [],
      options: [],
      a: 2.0,
      b: 1.5,
      c: 0.125,
      correctOptionIndex: 0
    };

    const selected = selectNextItemFisher(1.5, [onlyRotation], ['rotation', 'rotation']);
    expect(selected?.id).toBe('item_rot_only');
  });
});

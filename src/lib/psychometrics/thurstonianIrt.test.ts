import { describe, it, expect } from 'vitest';
import { scoreThurstonianTriads } from './thurstonianIrt';
import { TRIADS_POOL } from './triadsPool';
import { TriadResponse } from './types';

describe('Thurstonian IRT Dynamic Scoring Engine Tests', () => {
  it('returns neutral baseline values (50) when no triads are answered', () => {
    const scores = scoreThurstonianTriads({});
    expect(scores.monotropismMQScore).toBe(50);
    expect(scores.bdefsTimeMyopia).toBe(50);
    expect(scores.bdefsInhibition).toBe(50);
    expect(scores.bdefsActivation).toBe(50);
    expect(scores.bdefsEmotionalRegulation).toBe(50);
    expect(scores.catQScore).toBe(50);
    expect(scores.cb5tPlasticity).toBe(50);
    expect(scores.cb5tStability).toBe(50);
    expect(scores.hexacoHonestyHumility).toBe(50);
    expect(scores.dabrowski.intellectual).toBe(50);
  });

  it('dynamically increases monotropism score when user selects monotropism statements as most like', () => {
    // Find triads containing monotropism statements
    const monotropismTriads = TRIADS_POOL.filter(t =>
      t.statements.some(s => s.trait === 'monotropism_mq')
    );
    expect(monotropismTriads.length).toBeGreaterThan(0);

    const responses: Record<string, TriadResponse> = {};
    for (const t of monotropismTriads) {
      const monoStmt = t.statements.find(s => s.trait === 'monotropism_mq')!;
      const otherStmt = t.statements.find(s => s.trait !== 'monotropism_mq')!;
      responses[t.id] = {
        triadId: t.id,
        mostLikeId: monoStmt.id,
        leastLikeId: otherStmt.id
      };
    }

    const highMonoScores = scoreThurstonianTriads(responses);
    expect(highMonoScores.monotropismMQScore).toBeGreaterThan(50);
    expect(highMonoScores.monotropismProfile).toBe('DEEP_TUNNEL');
  });

  it('dynamically decreases monotropism score when user selects monotropism as least like', () => {
    const monotropismTriads = TRIADS_POOL.filter(t =>
      t.statements.some(s => s.trait === 'monotropism_mq')
    );

    const responses: Record<string, TriadResponse> = {};
    for (const t of monotropismTriads) {
      const monoStmt = t.statements.find(s => s.trait === 'monotropism_mq')!;
      const otherStmts = t.statements.filter(s => s.trait !== 'monotropism_mq');
      responses[t.id] = {
        triadId: t.id,
        mostLikeId: otherStmts[0].id,
        leastLikeId: monoStmt.id
      };
    }

    const lowMonoScores = scoreThurstonianTriads(responses);
    expect(lowMonoScores.monotropismMQScore).toBeLessThan(50);
    expect(lowMonoScores.monotropismProfile).toBe('POLYTROPIC_DIFFUSE');
  });

  it('dynamically computes Barkley BDEFS and Dabrowski overexcitabilities', () => {
    const responses: Record<string, TriadResponse> = {};

    // Answer first 5 triads in Block 4B with deterministic choices
    const block4BTriads = TRIADS_POOL.filter(t => t.block === '4B').slice(0, 5);
    for (const t of block4BTriads) {
      responses[t.id] = {
        triadId: t.id,
        mostLikeId: t.statements[0].id,
        leastLikeId: t.statements[2].id
      };
    }

    const scores = scoreThurstonianTriads(responses);
    // All scores are within valid 0-100 range
    expect(scores.bdefsTimeMyopia).toBeGreaterThanOrEqual(0);
    expect(scores.bdefsTimeMyopia).toBeLessThanOrEqual(100);
    expect(scores.bdefsInhibition).toBeGreaterThanOrEqual(0);
    expect(scores.bdefsInhibition).toBeLessThanOrEqual(100);
    expect(scores.dabrowski.intellectual).toBeGreaterThanOrEqual(0);
    expect(scores.dabrowski.intellectual).toBeLessThanOrEqual(100);
    expect(scores.identifiedLevers.length).toBe(2);
  });

  it('produces continuous sigmoid distributions without static 15-point leaps', () => {
    // Generate several different response patterns
    const patternA: Record<string, TriadResponse> = {};
    const patternB: Record<string, TriadResponse> = {};

    TRIADS_POOL.slice(0, 10).forEach((t, i) => {
      patternA[t.id] = {
        triadId: t.id,
        mostLikeId: t.statements[i % 3].id,
        leastLikeId: t.statements[(i + 1) % 3].id
      };
      patternB[t.id] = {
        triadId: t.id,
        mostLikeId: t.statements[(i + 2) % 3].id,
        leastLikeId: t.statements[i % 3].id
      };
    });

    const scoresA = scoreThurstonianTriads(patternA);
    const scoresB = scoreThurstonianTriads(patternB);

    const values = [
      scoresA.cb5tPlasticity,
      scoresA.cb5tStability,
      scoresA.hexacoHonestyHumility,
      scoresA.cartAOT,
      scoresB.cb5tPlasticity,
      scoresB.cb5tStability,
      scoresB.hexacoHonestyHumility,
      scoresB.cartAOT
    ];

    // Verify scores are not confined to the old discrete set {5, 20, 35, 50, 65, 80, 95}
    const discreteOldSet = new Set([5, 20, 35, 50, 65, 80, 95]);
    const hasContinuousValues = values.some(v => !discreteOldSet.has(v));
    expect(hasContinuousValues).toBe(true);

    // Verify all scores are within [0, 100]
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

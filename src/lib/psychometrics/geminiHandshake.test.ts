import { describe, it, expect } from 'vitest';
import { generateGeminiProfileXML, generateBase64Token } from './geminiHandshake';
import { FullPsychometricReport } from './types';

describe('Gemini Spark Handshake Serializer Tests', () => {
  const mockReport: FullPsychometricReport = {
    metadata: {
      timestamp: '2026-10-01T15:00:00Z',
      appVersion: 'NEUROSYNAPSE_v1.0',
      sessionDurationMinutes: 24.5,
      drasgowFitStatisticLz: 0.42,
      testingIntegrityFlag: 'VALID'
    },
    cognitiveIntelligenceCHC: {
      gai: {
        score: 136,
        sem: 3.6,
        ci95: [129, 143],
        percentile: 99.2,
        classification: 'Muy Superior / Alta Capacidad Intelectual'
      },
      cpi: {
        score: 89,
        sem: 4.1,
        ci95: [81, 97],
        percentile: 23.0,
        classification: 'Promedio Bajo / Disfunción Ejecutiva Relativa'
      },
      discrepancyDelta: 47,
      semDiff: 5.5,
      isFsiqValid: false,
      clinicalSyndromeFlag: '2E_AACC_ADHD',
      populationBaseRate: '< 0.5% (Disociación extrema, p < 0.0001)',
      certifiedIntelligencePotential: 136,
      discrepancyNarrative: 'Discrepancia crítica superior a 1.5 DE (47 puntos). El CI Total global queda formalmente invalidado.',
      broadAbilitiesTheta: {
        gf: 2.41,
        gwm: -0.78,
        gs: -0.65,
        gc: 2.15
      }
    },
    personalityAndPhenotype: {
      cb5tPlasticity: 88,
      cb5tStability: 38,
      hexacoHonestyHumility: 85,
      cartAOT: 82,
      cognitiveMiserlinessResistance: 76,
      monotropismMQScore: 84,
      monotropismProfile: 'DEEP_TUNNEL',
      bdefsTimeMyopia: 78,
      bdefsInhibition: 65,
      bdefsActivation: 82,
      bdefsEmotionalRegulation: 60,
      catQScore: 74,
      maskingBurnoutRisk: 'SEVERE',
      dunnQuadrant: 'SENSORY_SENSITIVITY',
      dunnThreshold: 'LOW',
      dabrowski: {
        intellectual: 92,
        imaginative: 86,
        emotional: 78,
        psychomotor: 70,
        sensual: 64
      },
      primaryBottleneck: 'PSYCHOLOGICAL_CAPABILITY',
      identifiedLevers: [
        'Andamiaje externo de iniciación de tareas y visibilización espacial del tiempo (prótesis ejecutivas Barkley).',
        'Descompresión sensorial activa y reducción de costo metabólico de camuflaje social.'
      ]
    },
    xmlPayload: '',
    compactTokenBase64: ''
  };

  it('generates the exact root tag <gemini_cognitive_profile_v1>', () => {
    const xml = generateGeminiProfileXML(mockReport);
    expect(xml.startsWith('<gemini_cognitive_profile_v1>')).toBe(true);
    expect(xml.endsWith('</gemini_cognitive_profile_v1>')).toBe(true);
  });

  it('contains all required metadata and CHC tags', () => {
    const xml = generateGeminiProfileXML(mockReport);
    expect(xml).toContain('<general_ability_index_gai>');
    expect(xml).toContain('<score>136</score>');
    expect(xml).toContain('<delta_gai_cpi>47</delta_gai_cpi>');
    expect(xml).toContain('<sem_diff_points>5.5</sem_diff_points>');
    expect(xml).toContain('<is_fsiq_valid>false</is_fsiq_valid>');
    expect(xml).toContain('<clinical_syndrome_flag>2E_AACC_ADHD</clinical_syndrome_flag>');
  });

  it('contains all neurodivergent phenotype tags', () => {
    const xml = generateGeminiProfileXML(mockReport);
    expect(xml).toContain('<monotropism_mq_score>84</monotropism_mq_score>');
    expect(xml).toContain('<monotropism_profile>DEEP_TUNNEL</monotropism_profile>');
    expect(xml).toContain('<time_myopia_score>78</time_myopia_score>');
    expect(xml).toContain('<masking_burnout_risk>SEVERE</masking_burnout_risk>');
    expect(xml).toContain('<primary_bottleneck>PSYCHOLOGICAL_CAPABILITY</primary_bottleneck>');
  });

  it('generates a valid Base64 compact token that can be parsed back', () => {
    const token = generateBase64Token(mockReport);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(50);

    // Decode token
    const decodedStr = atob(token);
    const parsed = JSON.parse(decodedStr);
    expect(parsed.gai).toBe(136);
    expect(parsed.flag).toBe('2E_AACC_ADHD');
    expect(parsed.mq).toBe(84);
  });
});

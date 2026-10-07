import { describe, it, expect } from 'vitest';
import { generateGeminiProfileXML, generateBase64Token } from './geminiHandshake';
import { FullPsychometricReport } from './types';

describe('Gemini Spark Handshake Serializer Tests', () => {
  const mockReport: FullPsychometricReport = {
    metadata: {
      timestamp: '2026-10-01T15:00:00Z',
      appVersion: 'NEUROSYNAPSE_v3.0_ULTRA',
      ageBracket: '12-15',
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
    expect(xml).toContain('<app_version>NEUROSYNAPSE_v3.0_ULTRA</app_version>');
    expect(xml).toContain('<age_bracket>12-15</age_bracket>');
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

  it('serializes dynamic neurodivergent phenotype values without hardcoded fallbacks', () => {
    const customReport: FullPsychometricReport = {
      ...mockReport,
      personalityAndPhenotype: {
        ...mockReport.personalityAndPhenotype,
        monotropismMQScore: 93,
        monotropismProfile: 'DEEP_TUNNEL',
        bdefsTimeMyopia: 91,
        bdefsInhibition: 82,
        bdefsActivation: 89,
        bdefsEmotionalRegulation: 73,
        catQScore: 88,
        maskingBurnoutRisk: 'SEVERE',
        dunnQuadrant: 'SENSATION_AVOIDING',
        dunnThreshold: 'HIGH',
        dabrowski: {
          intellectual: 99,
          imaginative: 95,
          emotional: 90,
          psychomotor: 85,
          sensual: 80
        }
      }
    };

    const xml = generateGeminiProfileXML(customReport);
    expect(xml).toContain('<monotropism_mq_score>93</monotropism_mq_score>');
    expect(xml).toContain('<time_myopia_score>91</time_myopia_score>');
    expect(xml).toContain('<inhibition_impulsivity_score>82</inhibition_impulsivity_score>');
    expect(xml).toContain('<activation_initiation_score>89</activation_initiation_score>');
    expect(xml).toContain('<emotional_regulation_score>73</emotional_regulation_score>');
    expect(xml).toContain('<total_score>88</total_score>');
    expect(xml).toContain('<masking_burnout_risk>SEVERE</masking_burnout_risk>');
    expect(xml).toContain('<quadrant>SENSATION_AVOIDING</quadrant>');
    expect(xml).toContain('<neurological_threshold>HIGH</neurological_threshold>');
    expect(xml).toContain('<intellectual>99</intellectual>');
    expect(xml).toContain('<imaginative>95</imaginative>');
    expect(xml).toContain('<emotional>90</emotional>');
    expect(xml).toContain('<psychomotor>85</psychomotor>');
    expect(xml).toContain('<sensual>80</sensual>');
  });

  it('correctly includes evaluation_scope and completed_modules tags in XML', () => {
    const partialReport: FullPsychometricReport = {
      ...mockReport,
      metadata: {
        ...mockReport.metadata,
        evaluationScope: 'COGNITIVE_ONLY',
        completedModules: {
          gfMatrices: true,
          gwmOSpan: true,
          gsSpeed: true,
          gcVerbal: true,
          personality4A: false,
          phenotype4B: false
        }
      }
    };

    const xml = generateGeminiProfileXML(partialReport);
    expect(xml).toContain('<evaluation_scope>COGNITIVE_ONLY</evaluation_scope>');
    expect(xml).toContain('<gf_matrices>true</gf_matrices>');
    expect(xml).toContain('<personality_4a>false</personality_4a>');
    expect(xml).toContain('<phenotype_4b>false</phenotype_4b>');
  });

  it('includes ex_gaussian_chronometry tags when exGaussian parameters are present', () => {
    const reportWithExG: FullPsychometricReport = {
      ...mockReport,
      cognitiveIntelligenceCHC: {
        ...mockReport.cognitiveIntelligenceCHC,
        exGaussian: {
          mu: 412.5,
          sigma: 78.4,
          tau: 295.2,
          lapseRatio: 0.72,
          skewness: 1.84,
          clinicalMarker: 'ELEVATED_ATTENTIONAL_LAPSES',
          clinicalInterpretation: 'Presencia significativa de cola exponencial (lapsos atencionales esporádicos).'
        }
      }
    };

    const xml = generateGeminiProfileXML(reportWithExG);
    expect(xml).toContain('<ex_gaussian_chronometry>');
    expect(xml).toContain('<mu_baseline_speed_ms>412.5</mu_baseline_speed_ms>');
    expect(xml).toContain('<sigma_variability_ms>78.4</sigma_variability_ms>');
    expect(xml).toContain('<tau_attentional_lapse_tail_ms>295.2</tau_attentional_lapse_tail_ms>');
    expect(xml).toContain('<clinical_stability_marker>ELEVATED_ATTENTIONAL_LAPSES</clinical_stability_marker>');

    const token = generateBase64Token(reportWithExG);
    const decoded = JSON.parse(atob(token));
    expect(decoded.exg).toEqual([412.5, 78.4, 295.2]);
  });
});

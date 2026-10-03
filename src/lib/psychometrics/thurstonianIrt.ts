// Thurstonian IRT Utility Scoring Engine (Brown & Maydeu-Olivares, 2011)
// Maps forced-choice triad selections (Most/Least) to normalized normative scale [0 - 100]
import { TriadResponse, PersonalityAndPhenotypeScores, TraitKey } from './types';
import { TRIADS_POOL } from './triadsPool';

export function scoreThurstonianTriads(responses: Record<string, TriadResponse>): PersonalityAndPhenotypeScores {
  // Accumulate raw utility weights per trait
  const traitUtilities: Record<TraitKey, { score: number; count: number }> = {
    cb5t_plasticity: { score: 0, count: 0 },
    cb5t_stability: { score: 0, count: 0 },
    hexaco_honesty_humility: { score: 0, count: 0 },
    cart_aot: { score: 0, count: 0 },
    cart_cognitive_miserliness_resistance: { score: 0, count: 0 },
    monotropism_mq: { score: 0, count: 0 },
    bdefs_time_myopia: { score: 0, count: 0 },
    bdefs_inhibition: { score: 0, count: 0 },
    bdefs_activation: { score: 0, count: 0 },
    bdefs_emotional_regulation: { score: 0, count: 0 },
    cat_q_camouflaging: { score: 0, count: 0 },
    dunn_sensory_sensitivity: { score: 0, count: 0 },
    dabrowski_intellectual: { score: 0, count: 0 },
    dabrowski_imaginative: { score: 0, count: 0 },
    dabrowski_emotional: { score: 0, count: 0 },
    dabrowski_psychomotor: { score: 0, count: 0 },
    dabrowski_sensual: { score: 0, count: 0 }
  };

  // Evaluate each triad
  for (const triad of TRIADS_POOL) {
    const userResp = responses[triad.id];
    if (!userResp) continue;

    for (const stmt of triad.statements) {
      const trait = stmt.trait;
      traitUtilities[trait].count += 1;

      if (stmt.id === userResp.mostLikeId) {
        traitUtilities[trait].score += 1.0 * stmt.weight;
      } else if (stmt.id === userResp.leastLikeId) {
        traitUtilities[trait].score -= 1.0 * stmt.weight;
      } else {
        // Neutral middle item
        traitUtilities[trait].score += 0.0;
      }
    }
  }

  // Convert raw utilities to 0-100 normalized score
  // Since each trait is compared across several triads, max theoretical utility is +count, min is -count
  const getNormScore = (key: TraitKey, defaultVal = 50): number => {
    const entry = traitUtilities[key];
    if (!entry || entry.count === 0) return defaultVal;
    // Map [-count, +count] to [0, 100] with linear/sigmoid scaling
    const meanUtility = entry.score / entry.count; // in [-1.0, +1.0]
    // Normalized score centered at 50, spanning [5, 95] based on preference ratio
    const scaled = 50 + meanUtility * 45;
    return Math.round(Math.max(5, Math.min(98, scaled)));
  };

  const cb5tPlasticity = getNormScore('cb5t_plasticity', 50);
  const cb5tStability = getNormScore('cb5t_stability', 50);
  const hexacoHonestyHumility = getNormScore('hexaco_honesty_humility', 50);
  const cartAOT = getNormScore('cart_aot', 50);
  const cognitiveMiserlinessResistance = getNormScore('cart_cognitive_miserliness_resistance', 50);

  const monotropismMQScore = getNormScore('monotropism_mq', 50);
  const bdefsTimeMyopia = getNormScore('bdefs_time_myopia', 50);
  const bdefsInhibition = getNormScore('bdefs_inhibition', 50);
  const bdefsActivation = getNormScore('bdefs_activation', 50);
  const bdefsEmotionalRegulation = getNormScore('bdefs_emotional_regulation', 50);

  const catQScore = getNormScore('cat_q_camouflaging', 50);
  const sensorySensitivity = getNormScore('dunn_sensory_sensitivity', 50);

  const dabrowski = {
    intellectual: getNormScore('dabrowski_intellectual', 50),
    imaginative: getNormScore('dabrowski_imaginative', 50),
    emotional: getNormScore('dabrowski_emotional', 50),
    psychomotor: getNormScore('dabrowski_psychomotor', 50),
    sensual: getNormScore('dabrowski_sensual', 50)
  };

  // Monotropism profile classification
  let monotropismProfile: PersonalityAndPhenotypeScores['monotropismProfile'] = 'MODERATE_FOCUS';
  if (monotropismMQScore >= 75) {
    monotropismProfile = 'DEEP_TUNNEL';
  } else if (monotropismMQScore < 45) {
    monotropismProfile = 'POLYTROPIC_DIFFUSE';
  }

  // Masking burnout risk
  let maskingBurnoutRisk: PersonalityAndPhenotypeScores['maskingBurnoutRisk'] = 'MODERATE';
  if (catQScore >= 70) {
    maskingBurnoutRisk = 'SEVERE';
  } else if (catQScore < 45) {
    maskingBurnoutRisk = 'MILD';
  }

  // Dunn Quadrant
  let dunnQuadrant: PersonalityAndPhenotypeScores['dunnQuadrant'] = 'SENSORY_SENSITIVITY';
  let dunnThreshold: PersonalityAndPhenotypeScores['dunnThreshold'] = 'LOW';
  if (sensorySensitivity >= 70) {
    dunnQuadrant = 'SENSORY_SENSITIVITY';
    dunnThreshold = 'LOW';
  } else if (sensorySensitivity >= 55) {
    dunnQuadrant = 'SENSATION_AVOIDING';
    dunnThreshold = 'LOW';
  } else {
    dunnQuadrant = 'LOW_REGISTRATION';
    dunnThreshold = 'TYPICAL';
  }

  // COM-B Bottleneck Diagnosis
  let primaryBottleneck: PersonalityAndPhenotypeScores['primaryBottleneck'] = 'PSYCHOLOGICAL_CAPABILITY';
  let levers: [string, string] = [
    'Andamiaje externo de iniciación de tareas y visibilización espacial del tiempo (prótesis ejecutivas Barkley).',
    'Descompresión sensorial activa y reducción de costo metabólico de camuflaje social.'
  ];

  if (bdefsActivation >= 75 && monotropismMQScore >= 70) {
    primaryBottleneck = 'PSYCHOLOGICAL_CAPABILITY';
    levers = [
      'Andamiaje de micro-iniciación de 2 minutos y visibilización espacial del tiempo mediante temporizadores analógicos externos (Barkley).',
      'Blindaje de túneles atencionales monotrópicos con descompresión sensorial en oscuridad/silencio y reducción del costo de camuflaje.'
    ];
  } else if (cb5tPlasticity >= 75 && cb5tStability < 50) {
    primaryBottleneck = 'AUTOMATIC_MOTIVATION';
    levers = [
      'Reestructuración de la arquitectura de decisión e implementación de intenciones de contingencia ("SI ocurre X, ENTONCES haré Y").',
      'Fricción ambiental física sobre distractores de alta saliencia dopaminérgica inmediata.'
    ];
  } else if (sensorySensitivity >= 75 || catQScore >= 70) {
    primaryBottleneck = 'PHYSICAL_OPPORTUNITY';
    levers = [
      'Acondicionamiento ergonómico del ecosistema de trabajo (cancelación activa de ruido, atenuación lumínica y descansos sensoriales).',
      'Permiso explícito de desacoplamiento de enmascaramiento para frenar la espiral de sobrecarga alostática y burnout.'
    ];
  } else if (cartAOT < 60) {
    primaryBottleneck = 'REFLECTIVE_MOTIVATION';
    levers = [
      'Protocolos sistemáticos de búsqueda activa de hipótesis alternativas y desacoplamiento cognitivo reflexivo.',
      'Checklists metacognitivas pre-mortem antes de consolidar decisiones estratégicas.'
    ];
  }

  return {
    cb5tPlasticity,
    cb5tStability,
    hexacoHonestyHumility,
    cartAOT,
    cognitiveMiserlinessResistance,
    monotropismMQScore,
    monotropismProfile,
    bdefsTimeMyopia,
    bdefsInhibition,
    bdefsActivation,
    bdefsEmotionalRegulation,
    catQScore,
    maskingBurnoutRisk,
    dunnQuadrant,
    dunnThreshold,
    dabrowski,
    primaryBottleneck,
    identifiedLevers: levers
  };
}

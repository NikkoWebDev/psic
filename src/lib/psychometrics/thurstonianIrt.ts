// Thurstonian IRT Utility Scoring Engine (Brown & Maydeu-Olivares, 2011)
// Maps forced-choice triad selections (Most/Least) to normalized normative scale [0 - 100]
import { TriadResponse, PersonalityAndPhenotypeScores, TraitKey } from './types';
import { TRIADS_POOL } from './triadsPool';

export function scoreThurstonianTriads(responses: Record<string, TriadResponse>): PersonalityAndPhenotypeScores {
  // Accumulate latent trait utility eta_d across pairwise comparisons
  const traitEta: Record<TraitKey, number> = {
    cb5t_plasticity: 0,
    cb5t_stability: 0,
    hexaco_honesty_humility: 0,
    cart_aot: 0,
    cart_cognitive_miserliness_resistance: 0,
    monotropism_mq: 0,
    bdefs_time_myopia: 0,
    bdefs_inhibition: 0,
    bdefs_activation: 0,
    bdefs_emotional_regulation: 0,
    cat_q_camouflaging: 0,
    dunn_sensory_sensitivity: 0,
    dabrowski_intellectual: 0,
    dabrowski_imaginative: 0,
    dabrowski_emotional: 0,
    dabrowski_psychomotor: 0,
    dabrowski_sensual: 0
  };

  // Evaluate each triad via 3 pairwise comparisons: M > N, M > L, N > L
  for (const triad of TRIADS_POOL) {
    const userResp = responses[triad.id];
    if (!userResp) continue;

    const mostStmt = triad.statements.find(s => s.id === userResp.mostLikeId);
    const leastStmt = triad.statements.find(s => s.id === userResp.leastLikeId);
    const neutralStmt = triad.statements.find(
      s => s.id !== userResp.mostLikeId && s.id !== userResp.leastLikeId
    );

    if (!mostStmt || !leastStmt || !neutralStmt) continue;

    // Pairwise comparison 1: Most > Neutral (y_M>N = 1)
    traitEta[mostStmt.trait] += 0.5 * (mostStmt.weight ?? 1.0);
    traitEta[neutralStmt.trait] -= 0.5 * (neutralStmt.weight ?? 1.0);

    // Pairwise comparison 2: Most > Least (y_M>L = 1)
    traitEta[mostStmt.trait] += 0.5 * (mostStmt.weight ?? 1.0);
    traitEta[leastStmt.trait] -= 0.5 * (leastStmt.weight ?? 1.0);

    // Pairwise comparison 3: Neutral > Least (y_N>L = 1)
    traitEta[neutralStmt.trait] += 0.5 * (neutralStmt.weight ?? 1.0);
    traitEta[leastStmt.trait] -= 0.5 * (leastStmt.weight ?? 1.0);
  }

  // Smooth continuous sigmoid mapping:
  // Score_d = round( 100 / (1 + exp(-0.45 * eta_d)) )
  // Guarantees continuous values (e.g. 44, 56, 61, 71, 83) without discrete 15-point leaps
  const getNormScore = (key: TraitKey, defaultVal = 50): number => {
    const eta = traitEta[key];
    if (eta === undefined || isNaN(eta)) return defaultVal;
    const score = Math.round(100 / (1 + Math.exp(-0.45 * eta)));
    return Math.max(0, Math.min(100, score));
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

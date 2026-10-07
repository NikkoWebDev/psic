// Calibrated Relational Verbal Analogies Pool for Crystallized Ability (Gc) in Spanish
// Symmetrically centered at mean(b) = 0.0, spanning b in [-2.0, +2.0], with uniform key distribution (25% per position)
import { VerbalItem, VerbalResult } from './types';

export const VERBAL_ITEMS_POOL: VerbalItem[] = [
  {
    id: 'gc_01',
    analogyPrompt: 'DÍA es a NOCHE como CLARO es a...',
    options: ['Oscuro', 'Brillante', 'Tarde', 'Sombra'],
    correctIndex: 0,
    difficulty: -2.0,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_02',
    analogyPrompt: 'CALOR es a FRÍO como SECO es a...',
    options: ['Árido', 'Húmedo', 'Cálido', 'Viento'],
    correctIndex: 1,
    difficulty: -1.6,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_03',
    analogyPrompt: 'SEMILLA es a ÁRBOL como HUEVO es a...',
    options: ['Nido', 'Pájaro', 'Cáscara', 'Pluma'],
    correctIndex: 1,
    difficulty: -1.2,
    conceptualDomain: 'scientific'
  },
  {
    id: 'gc_04',
    analogyPrompt: 'BRÚJULA es a DIRECCIÓN como RELOJ es a...',
    options: ['Péndulo', 'Alarma', 'Tiempo', 'Minuto'],
    correctIndex: 2,
    difficulty: -0.9,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_05',
    analogyPrompt: 'EFÍMERO es a DURADERO como PRECARIO es a...',
    options: ['Seguro', 'Escaso', 'Incierto', 'Rápido'],
    correctIndex: 0,
    difficulty: -0.5,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_06',
    analogyPrompt: 'VIGA es a ESTRUCTURA como HUESO es a...',
    options: ['Músculo', 'Esqueleto', 'Calcio', 'Cuerpo'],
    correctIndex: 1,
    difficulty: -0.2,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_07',
    analogyPrompt: 'ANTORCHA es a LUZ como ESTUFA es a...',
    options: ['Leña', 'Gas', 'Calor', 'Cocina'],
    correctIndex: 2,
    difficulty: -0.1,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_08',
    analogyPrompt: 'SED es a AGUA como APETITO es a...',
    options: ['Alimento', 'Hambre', 'Banquete', 'Cocina'],
    correctIndex: 0,
    difficulty: -0.1,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_09',
    analogyPrompt: 'SEQUÍA es a EROSIÓN como DILUVIO es a...',
    options: ['Lluvia', 'Desastre', 'Viento', 'Inundación'],
    correctIndex: 3,
    difficulty: 0.1,
    conceptualDomain: 'scientific'
  },
  {
    id: 'gc_10',
    analogyPrompt: 'PRÓLOGO es a EPÍLOGO como GÉNESIS es a...',
    options: ['Origen', 'Texto', 'Capítulo', 'Consumación'],
    correctIndex: 3,
    difficulty: 0.1,
    conceptualDomain: 'metaphoric'
  },
  {
    id: 'gc_11',
    analogyPrompt: 'ÁTOMO es a MOLÉCULA como CÉLULA es a...',
    options: ['Núcleo', 'Tejido', 'Gen', 'Órgano'],
    correctIndex: 1,
    difficulty: 0.2,
    conceptualDomain: 'scientific'
  },
  {
    id: 'gc_12',
    analogyPrompt: 'MITIGAR es a ATENUAR como EXACERBAR es a...',
    options: ['Calmar', 'Ocultar', 'Desviar', 'Agravar'],
    correctIndex: 3,
    difficulty: 0.5,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_13',
    analogyPrompt: 'BRIZNA es a VENDAVAL como CHISPA es a...',
    options: ['Calor', 'Fuego', 'Conflagración', 'Ceniza'],
    correctIndex: 2,
    difficulty: 0.9,
    conceptualDomain: 'metaphoric'
  },
  {
    id: 'gc_14',
    analogyPrompt: 'AXIOMA es a TEOREMA como PREMISA es a...',
    options: ['Hipótesis', 'Silogismo', 'Conclusión', 'Verdad'],
    correctIndex: 2,
    difficulty: 1.2,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_15',
    analogyPrompt: 'PRÍSTINO es a CONTAMINADO como GENUINO es a...',
    options: ['Espurio', 'Antiguo', 'Puro', 'Frágil'],
    correctIndex: 0,
    difficulty: 1.6,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_16',
    analogyPrompt: 'INMANENTE es a INHERENTE como TRASCENDENTE es a...',
    options: ['Subjetivo', 'Material', 'Terrenal', 'Supraempírico'],
    correctIndex: 3,
    difficulty: 2.0,
    conceptualDomain: 'metaphoric'
  }
];

/**
 * Calculates theta_Gc from verbal analogy responses with normative age offset support.
 * 50% accuracy on this calibrated neutral bank yields theta_Gc in [-0.15, +0.15].
 */
export function calculateGcScore(
  answers: Record<string, number>,
  ageOffsetGc: number = 0
): VerbalResult {
  let correct = 0;
  const total = VERBAL_ITEMS_POOL.length;

  for (const item of VERBAL_ITEMS_POOL) {
    if (answers[item.id] === item.correctIndex) {
      correct++;
    }
  }

  const accuracy = correct / total;
  // Bounded probability to avoid infinite logit
  const boundedP = Math.max(0.05, Math.min(0.95, accuracy));

  // Latent theta Gc centered at 0.0 with slope 0.20, plus developmental norm offset
  const rawTheta = (boundedP - 0.5) / 0.2 + ageOffsetGc;
  const thetaGc = Number(Math.max(-3.0, Math.min(3.0, rawTheta)).toFixed(2));

  // Normal percentile using Abramowitz & Stegun error function approximation
  const z = thetaGc;
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * absZ);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
  const percentile = Number(Math.min(99.9, Math.max(0.1, 0.5 * (1.0 + sign * erf) * 100)).toFixed(1));

  return {
    score: correct,
    total,
    thetaGc,
    percentile
  };
}

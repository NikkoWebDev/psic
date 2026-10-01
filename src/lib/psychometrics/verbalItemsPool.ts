// Verbal-Conceptual Reasoning Item Pool for Crystallized Ability (Gc)
// Used in conjunction with Gf (Matrix Reasoning) to compute the General Ability Index (GAI / IAG)
import { VerbalItem } from './types';

export const VERBAL_ITEMS_POOL: VerbalItem[] = [
  {
    id: 'gc_01',
    analogyPrompt: 'ENTROPÍA es a CAOS como HOMEOSTASIS es a...',
    options: ['Equilibrio', 'Energía', 'Resistencia', 'Metabolismo'],
    correctIndex: 0,
    difficulty: 0.2,
    conceptualDomain: 'scientific'
  },
  {
    id: 'gc_02',
    analogyPrompt: 'AXIOMA es a TEOREMA como PREMISA es a...',
    options: ['Conclusión', 'Hipótesis', 'Silogismo', 'Verdad'],
    correctIndex: 0,
    difficulty: 0.5,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_03',
    analogyPrompt: 'EPIGENÉTICA es a FENOTIPO como PROGRAMACIÓN es a...',
    options: ['Hardware', 'Ejecución de Software', 'Código Binario', 'Memoria'],
    correctIndex: 1,
    difficulty: 0.8,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_04',
    analogyPrompt: 'CATALIZADOR es a REACCIÓN como INCENTIVO es a...',
    options: ['Conducta', 'Deseo', 'Recompensa', 'Meta'],
    correctIndex: 0,
    difficulty: 0.4,
    conceptualDomain: 'scientific'
  },
  {
    id: 'gc_05',
    analogyPrompt: 'HIPÓTESIS es a EMPIRISMO como DOGMA es a...',
    options: ['Fideísmo', 'Teología', 'Ortodoxia', 'Fanatismo'],
    correctIndex: 2,
    difficulty: 1.1,
    conceptualDomain: 'epistemological' as any
  },
  {
    id: 'gc_06',
    analogyPrompt: 'MONOTROPISMO es a TÚNEL ATENCIONAL como POLITROPISMO es a...',
    options: ['Atención Distribuida', 'Distracción Crónica', 'Hiperactividad', 'Foco Láser'],
    correctIndex: 0,
    difficulty: 0.7,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_07',
    analogyPrompt: 'HOLISMO es a REDUCCIONISMO como INTEGRACIÓN es a...',
    options: ['Fragmentación', 'Descomposición', 'Análisis', 'Disolución'],
    correctIndex: 0,
    difficulty: 0.9,
    conceptualDomain: 'relational'
  },
  {
    id: 'gc_08',
    analogyPrompt: 'RETROALIMENTACIÓN NEGATIVA es a ESTABILIDAD como RETROALIMENTACIÓN POSITIVA es a...',
    options: ['Amplificación / Crecimiento', 'Inhibición', 'Oscilación', 'Atenuación'],
    correctIndex: 0,
    difficulty: 1.3,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_09',
    analogyPrompt: 'HEURÍSTICA es a APROXIMACIÓN RÁPIDA como ALGORITMO es a...',
    options: ['Procedimiento Determinista', 'Solución Perfecta', 'Regla Empírica', 'Cálculo Mental'],
    correctIndex: 0,
    difficulty: 1.5,
    conceptualDomain: 'systemic'
  },
  {
    id: 'gc_10',
    analogyPrompt: 'DISRACIONALIDAD es a SESGO COGNITIVO como DISLEXIA es a...',
    options: ['Decodificación Fonológica', 'Inteligencia Fluida', 'Inhibición Prefrontal', 'Memoria de Trabajo'],
    correctIndex: 0,
    difficulty: 1.8,
    conceptualDomain: 'scientific'
  }
];

export function calculateGcScore(answers: Record<string, number>): {
  score: number;
  total: number;
  thetaGc: number;
  percentile: number;
} {
  let correct = 0;
  const total = VERBAL_ITEMS_POOL.length;

  for (const item of VERBAL_ITEMS_POOL) {
    if (answers[item.id] === item.correctIndex) {
      correct++;
    }
  }

  // Linear transformation to latent theta Gc scale
  // Standardized with mean 0, SD 1
  const accuracy = correct / total;
  // Logit transformation bounded between -2.5 and +2.5
  const boundedP = Math.max(0.05, Math.min(0.95, accuracy));
  const thetaGc = Number(((boundedP - 0.5) / 0.2).toFixed(2)); // centered at average 0.0, range ~ [-2.25, 2.25]

  // Normal percentile
  const z = thetaGc;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
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

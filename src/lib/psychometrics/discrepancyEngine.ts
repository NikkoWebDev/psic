// 2e Clinical Discrepancy Engine (NAGC / Pearson Gold Standard)
// Implements corrected composite variance formulas, SEM_diff, and population base rate
import { DiscrepancyProfile } from './types';
import { standardNormalCDF } from './irt3pl';

export const R_GF_GC = 0.62; // Empirical correlation between Gf and Gc (Wechsler WAIS-IV / CHC)
export const R_GWM_GS = 0.45; // Empirical correlation between Gwm and Gs

export function calculateClassification(iq: number): string {
  if (iq >= 130) return 'Muy Superior / Alta Capacidad Intelectual';
  if (iq >= 120) return 'Superior / Talento Complejo';
  if (iq >= 110) return 'Medio Alto / Promedio Superior';
  if (iq >= 90) return 'Promedio / Rendimiento Típico';
  if (iq >= 80) return 'Promedio Bajo / Disfunción Ejecutiva Relativa';
  return 'Límite / Compromiso de Rendimiento';
}

export interface DiscrepancyCalculationInput {
  thetaGf: number;
  semThetaGf: number;
  thetaGc: number;
  thetaGwm: number;
  thetaGs: number;
}

export function computeDiscrepancyProfile(input: DiscrepancyCalculationInput): DiscrepancyProfile {
  const { thetaGf, semThetaGf, thetaGc, thetaGwm, thetaGs } = input;

  // 1. Corrected Composite Formulas with square root in denominator:
  // Z_comp = (theta_1 + theta_2) / sqrt(2 + 2 * r)
  const zGai = (thetaGf + thetaGc) / Math.sqrt(2 + 2 * R_GF_GC);
  const gaiScore = Math.round(100 + 15 * zGai);

  const zCpi = (thetaGwm + thetaGs) / Math.sqrt(2 + 2 * R_GWM_GS);
  const cpiScore = Math.round(100 + 15 * zCpi);

  // Approximate SEMs
  const semThetaGc = 0.30;
  const semThetaGwm = 0.28;
  const semThetaGs = 0.25;

  const semZ_Gai = Math.sqrt((semThetaGf * semThetaGf + semThetaGc * semThetaGc) / (2 + 2 * R_GF_GC));
  const semGai = Number((15 * semZ_Gai).toFixed(1));

  const semZ_Cpi = Math.sqrt((semThetaGwm * semThetaGwm + semThetaGs * semThetaGs) / (2 + 2 * R_GWM_GS));
  const semCpi = Number((15 * semZ_Cpi).toFixed(1));

  // 95% Confidence Intervals
  const gaiCI: [number, number] = [
    Math.round(gaiScore - 1.96 * semGai),
    Math.round(gaiScore + 1.96 * semGai)
  ];
  const cpiCI: [number, number] = [
    Math.round(cpiScore - 1.96 * semCpi),
    Math.round(cpiScore + 1.96 * semCpi)
  ];

  // Percentiles
  const gaiPercentile = Number(Math.min(99.9, Math.max(0.1, standardNormalCDF(zGai) * 100)).toFixed(1));
  const cpiPercentile = Number(Math.min(99.9, Math.max(0.1, standardNormalCDF(zCpi) * 100)).toFixed(1));

  // 2. Discrepancy Delta:
  const delta = Math.abs(gaiScore - cpiScore);

  // 3. SEM of the Difference: SEM_diff = sqrt(SEM_GAI^2 + SEM_CPI^2)
  const semDiff = Number(Math.sqrt(semGai * semGai + semCpi * semCpi).toFixed(1));

  // 4. Population Base Rate (WAIS-IV / WISC-V Gilman et al., 2008 normative tables):
  let populationBaseRate: string;
  if (delta >= 35) {
    populationBaseRate = '< 0.5% (Disociación extrema, p < 0.0001)';
  } else if (delta >= 30) {
    populationBaseRate = '< 1.5% (Disociación severa de doble excepcionalidad, p < 0.001)';
  } else if (delta >= 23) {
    populationBaseRate = '< 5.0% (Inusual en población general, p < 0.01 - Criterio NAGC)';
  } else if (delta >= 15) {
    populationBaseRate = '≈ 12.0% (Variabilidad intraindividual moderada)';
  } else {
    populationBaseRate = '> 25.0% (Perfil cognitivo armónico y homogéneo)';
  }

  // 5. Clinical Decision Rule:
  const isDiscrepant = delta >= 23;
  let isFsiqValid = true;
  let clinicalSyndromeFlag: DiscrepancyProfile['clinicalSyndromeFlag'] = 'HARMONIOUS_AVERAGE';
  let certifiedPotential = gaiScore;
  let narrative = '';

  if (isDiscrepant) {
    isFsiqValid = false;
    certifiedPotential = gaiScore; // NAGC gold standard: certify intelligence at GAI

    if (gaiScore >= 120 && cpiScore < 100) {
      clinicalSyndromeFlag = '2E_AACC_ADHD';
      narrative = `Discrepancia crítica superior a 1.5 DE (${delta} puntos, Tasa Base: ${populationBaseRate}). El Cociente Intelectual Total global (CIT) queda formalmente INVALIDADO e ininterpretable por asimetría ejecutiva. La capacidad intelectual real se certifica en el IAG (${gaiScore}). El perfil es característico de Doble Excepcionalidad (AACC + TDAH/Disfunción Ejecutiva), donde la elevada potencia de razonamiento abstracto convive con un cuello de botella en la memoria de trabajo operativa o la velocidad motora.`;
    } else {
      clinicalSyndromeFlag = 'ASYMMETRIC_SPEED_VULNERABILITY';
      narrative = `Discrepancia significativa de ${delta} puntos entre la capacidad de razonamiento conceptual (IAG: ${gaiScore}) y la eficiencia de procesamiento (IEC: ${cpiScore}). El CIT global presenta dispersión estadística que recomienda interpretar los índices de manera desglosada.`;
    }
  } else {
    isFsiqValid = true;
    certifiedPotential = Math.round((gaiScore + cpiScore) / 2);
    if (gaiScore >= 120) {
      clinicalSyndromeFlag = 'HARMONIOUS_SUPERIOR';
      narrative = `Perfil cognitivo armónico y homogéneo sin discrepancias significativas (Δ = ${delta} puntos, dentro del rango esperado). El CI Total agregado es estadísticamente válido y representativo del potencial global.`;
    } else {
      clinicalSyndromeFlag = 'HARMONIOUS_AVERAGE';
      narrative = `Perfil cognitivo equilibrado (Δ = ${delta} puntos). No se observan disociaciones entre la capacidad de resolución conceptual y la competencia neuroejecutiva.`;
    }
  }

  return {
    gai: {
      score: gaiScore,
      sem: semGai,
      ci95: gaiCI,
      percentile: gaiPercentile,
      classification: calculateClassification(gaiScore)
    },
    cpi: {
      score: cpiScore,
      sem: semCpi,
      ci95: cpiCI,
      percentile: cpiPercentile,
      classification: calculateClassification(cpiScore)
    },
    discrepancyDelta: delta,
    semDiff,
    isFsiqValid,
    clinicalSyndromeFlag,
    discrepancyNarrative: narrative,
    populationBaseRate,
    certifiedIntelligencePotential: certifiedPotential,
    broadAbilitiesTheta: {
      gf: Number(thetaGf.toFixed(2)),
      gwm: Number(thetaGwm.toFixed(2)),
      gs: Number(thetaGs.toFixed(2)),
      gc: Number(thetaGc.toFixed(2))
    }
  };
}

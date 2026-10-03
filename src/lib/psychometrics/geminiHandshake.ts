// Gemini Spark Handshake Contract Generator
// Serializes psychometric profile into standardized <gemini_cognitive_profile_v1> XML + Base64 compact token
import { FullPsychometricReport } from './types';

export function generateGeminiProfileXML(report: FullPsychometricReport): string {
  const { metadata, cognitiveIntelligenceCHC: chc, personalityAndPhenotype: pheno } = report;

  const xml = `<gemini_cognitive_profile_v1>
  <metadata>
    <timestamp>${metadata.timestamp}</timestamp>
    <app_version>${metadata.appVersion}</app_version>
    <session_duration_minutes>${metadata.sessionDurationMinutes}</session_duration_minutes>
    <evaluation_scope>${metadata.evaluationScope || 'FULL'}</evaluation_scope>
    <drasgow_fit_statistic_lz>${metadata.drasgowFitStatisticLz}</drasgow_fit_statistic_lz>
    <testing_integrity_flag>${metadata.testingIntegrityFlag}</testing_integrity_flag>
    ${
      metadata.completedModules
        ? `<completed_modules>
      <gf_matrices>${Boolean(metadata.completedModules.gfMatrices)}</gf_matrices>
      <gwm_ospan>${Boolean(metadata.completedModules.gwmOSpan)}</gwm_ospan>
      <gs_speed>${Boolean(metadata.completedModules.gsSpeed)}</gs_speed>
      <gc_verbal>${Boolean(metadata.completedModules.gcVerbal)}</gc_verbal>
      <personality_4a>${Boolean(metadata.completedModules.personality4A)}</personality_4a>
      <phenotype_4b>${Boolean(metadata.completedModules.phenotype4B)}</phenotype_4b>
    </completed_modules>`
        : ''
    }
  </metadata>

  <cognitive_intelligence_chc>
    <general_ability_index_gai>
      <score>${chc.gai.score}</score>
      <sem_points>${chc.gai.sem}</sem_points>
      <ci_95_percent>[${chc.gai.ci95[0]}, ${chc.gai.ci95[1]}]</ci_95_percent>
      <percentile>${chc.gai.percentile}</percentile>
      <classification>${chc.gai.classification}</classification>
    </general_ability_index_gai>
    <cognitive_proficiency_index_cpi>
      <score>${chc.cpi.score}</score>
      <sem_points>${chc.cpi.sem}</sem_points>
      <ci_95_percent>[${chc.cpi.ci95[0]}, ${chc.cpi.ci95[1]}]</ci_95_percent>
      <percentile>${chc.cpi.percentile}</percentile>
      <classification>${chc.cpi.classification}</classification>
    </cognitive_proficiency_index_cpi>
    <discrepancy_analysis>
      <delta_gai_cpi>${chc.discrepancyDelta}</delta_gai_cpi>
      <sem_diff_points>${chc.semDiff}</sem_diff_points>
      <population_base_rate>${chc.populationBaseRate}</population_base_rate>
      <is_fsiq_valid>${chc.isFsiqValid}</is_fsiq_valid>
      <clinical_syndrome_flag>${chc.clinicalSyndromeFlag}</clinical_syndrome_flag>
      <certified_intelligence_potential>${chc.certifiedIntelligencePotential}</certified_intelligence_potential>
      <discrepancy_narrative>${chc.discrepancyNarrative}</discrepancy_narrative>
    </discrepancy_analysis>
    <broad_abilities_theta>
      <fluid_reasoning_gf>${chc.broadAbilitiesTheta.gf >= 0 ? '+' : ''}${chc.broadAbilitiesTheta.gf}</fluid_reasoning_gf>
      <working_memory_gwm>${chc.broadAbilitiesTheta.gwm >= 0 ? '+' : ''}${chc.broadAbilitiesTheta.gwm}</working_memory_gwm>
      <processing_speed_gs>${chc.broadAbilitiesTheta.gs >= 0 ? '+' : ''}${chc.broadAbilitiesTheta.gs}</processing_speed_gs>
      <crystallized_verbal_gc>${chc.broadAbilitiesTheta.gc >= 0 ? '+' : ''}${chc.broadAbilitiesTheta.gc}</crystallized_verbal_gc>
    </broad_abilities_theta>
  </cognitive_intelligence_chc>

  <neurodivergent_phenotype>
    <monotropism_mq_score>${pheno.monotropismMQScore}</monotropism_mq_score>
    <monotropism_profile>${pheno.monotropismProfile}</monotropism_profile>
    <barkley_bdefs_executive>
      <time_myopia_score>${pheno.bdefsTimeMyopia}</time_myopia_score>
      <inhibition_impulsivity_score>${pheno.bdefsInhibition}</inhibition_impulsivity_score>
      <activation_initiation_score>${pheno.bdefsActivation}</activation_initiation_score>
      <emotional_regulation_score>${pheno.bdefsEmotionalRegulation}</emotional_regulation_score>
    </barkley_bdefs_executive>
    <camouflaging_cat_q>
      <total_score>${pheno.catQScore}</total_score>
      <masking_burnout_risk>${pheno.maskingBurnoutRisk}</masking_burnout_risk>
    </camouflaging_cat_q>
    <sensory_profile_dunn>
      <quadrant>${pheno.dunnQuadrant}</quadrant>
      <neurological_threshold>${pheno.dunnThreshold}</neurological_threshold>
    </sensory_profile_dunn>
    <dabrowski_overexcitabilities>
      <intellectual>${pheno.dabrowski.intellectual}</intellectual>
      <imaginative>${pheno.dabrowski.imaginative}</imaginative>
      <emotional>${pheno.dabrowski.emotional}</emotional>
      <psychomotor>${pheno.dabrowski.psychomotor}</psychomotor>
      <sensual>${pheno.dabrowski.sensual}</sensual>
    </dabrowski_overexcitabilities>
  </neurodivergent_phenotype>

  <personality_and_rationality>
    <cb5t_plasticity_dopaminergic>${pheno.cb5tPlasticity}</cb5t_plasticity_dopaminergic>
    <cb5t_stability_serotonergic>${pheno.cb5tStability}</cb5t_stability_serotonergic>
    <hexaco_honesty_humility>${pheno.hexacoHonestyHumility}</hexaco_honesty_humility>
    <cart_rationality_aot>${pheno.cartAOT}</cart_rationality_aot>
    <cognitive_miserliness_resistance>${pheno.cognitiveMiserlinessResistance}</cognitive_miserliness_resistance>
  </personality_and_rationality>

  <behavioral_comb_bottlenecks>
    <primary_bottleneck>${pheno.primaryBottleneck}</primary_bottleneck>
    <identified_levers>
      <lever_1>${pheno.identifiedLevers[0]}</lever_1>
      <lever_2>${pheno.identifiedLevers[1]}</lever_2>
    </identified_levers>
  </behavioral_comb_bottlenecks>
</gemini_cognitive_profile_v1>`;

  return xml;
}

/**
 * Generate a compact, URL-safe Base64 token encoding the full JSON payload
 * for anti-truncation recovery in LLM prompt copy-pasting.
 */
export function generateBase64Token(report: FullPsychometricReport): string {
  try {
    const compactObj = {
      v: '1.0',
      ts: report.metadata.timestamp,
      scope: report.metadata.evaluationScope || 'FULL',
      gai: report.cognitiveIntelligenceCHC.gai.score,
      cpi: report.cognitiveIntelligenceCHC.cpi.score,
      delta: report.cognitiveIntelligenceCHC.discrepancyDelta,
      flag: report.cognitiveIntelligenceCHC.clinicalSyndromeFlag,
      thetas: report.cognitiveIntelligenceCHC.broadAbilitiesTheta,
      mq: report.personalityAndPhenotype.monotropismMQScore,
      bdefs: [
        report.personalityAndPhenotype.bdefsTimeMyopia,
        report.personalityAndPhenotype.bdefsInhibition,
        report.personalityAndPhenotype.bdefsActivation,
        report.personalityAndPhenotype.bdefsEmotionalRegulation
      ],
      catq: report.personalityAndPhenotype.catQScore,
      dunn: report.personalityAndPhenotype.dunnQuadrant,
      dab: report.personalityAndPhenotype.dabrowski,
      cb5t: [report.personalityAndPhenotype.cb5tPlasticity, report.personalityAndPhenotype.cb5tStability],
      hex: report.personalityAndPhenotype.hexacoHonestyHumility,
      cart: [report.personalityAndPhenotype.cartAOT, report.personalityAndPhenotype.cognitiveMiserlinessResistance]
    };

    const jsonStr = JSON.stringify(compactObj);
    // Encode to UTF-8 Base64
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    return '';
  }
}

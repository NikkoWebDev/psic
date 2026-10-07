// Core types for NEUROSYNAPSE Psychometric Engine
import { ExGaussianParameters } from './exGaussian';

export type MatrixRuleType = 'progression' | 'rotation' | 'boolean' | 'topological';
export type MatrixDifficultyTier = 1 | 2 | 3 | 4;

export interface MatrixItem {
  id: string;
  code: string;
  tier: MatrixDifficultyTier; // 1: Entry [-2.5, -0.8], 2: Mid [-0.7, 0.7], 3: High [0.8, 1.8], 4: Ceiling [1.9, 2.8]
  ruleType: MatrixRuleType;
  a: number; // Discrimination [0.8, 2.4]
  b: number; // Difficulty [-2.8, 2.8]
  c: number; // Guessing parameter (0.125 for 8 options)
  ruleDescription: string;
  // Procedural SVG matrix definition: 8 given cells + 1 target (?)
  cells: string[]; // SVG representation/keys for rows 1..3, cols 1..3 (cell 9 is missing)
  options: string[]; // 8 SVG options
  correctOptionIndex: number; // 0..7
  twinItemId?: string; // If flagged by Drasgow impulsive filter, twin item ID to administer
}

export interface MatrixResponseRecord {
  itemId: string;
  itemCode: string;
  ruleType?: MatrixRuleType;
  selectedOption: number;
  isCorrect: boolean;
  a: number;
  b: number;
  latencyMs: number;
  isImpulsiveAnomaly?: boolean;
}

export interface CATState {
  administeredItems: MatrixResponseRecord[];
  remainingItemIds: string[];
  thetaEAP: number;
  semTheta: number;
  iqScore: number;
  semIQ: number;
  ci95: [number, number];
  percentile: number;
  isTerminated: boolean;
  terminationReason?: 'SEM_CONVERGENCE' | 'MAX_ITEMS_REACHED' | 'POOL_EXHAUSTED';
  drasgowLz: number;
  anomaliesDetected: number;
}

// Complex Operation Span (O-Span) for Working Memory (Gwm)
export interface OSpanStep {
  equationText: string;
  claimedResult: number;
  isEquationCorrect: boolean;
  letter: string;
}

export interface OSpanRound {
  spanLength: number;
  steps: OSpanStep[];
  isPractice?: boolean;
}

export type AgeBracket = '8-11' | '12-15' | '16-25' | '26-45' | '46-65' | '65+';

export interface AgeNormOffsets {
  offsetGwm: number;
  offsetGc: number;
  offsetGs: number;
}

export interface OSpanRoundResult {
  roundIndex: number;
  spanLength: number;
  isPractice: boolean;
  mathAccuracyCount: number;
  mathTotalCount: number;
  recalledLetters: string[];
  targetLetters: string[];
  correctLetterCount: number;
  roundCompleteSuccess: boolean;
  trialScore?: number; // Partial-Credit Unit score for this trial: correctLetterCount / spanLength
}

export interface OSpanFinalScore {
  totalRounds: number;
  totalLettersPresented: number;
  totalLettersCorrect: number;
  absoluteOSpanScore: number; // Sum of letters from rounds with 100% accurate recall
  totalPCUScore: number; // Partial-Credit Unit score (sum of trial fractional scores 0.0 to 12.0)
  mathAccuracyRate: number; // Must be >= 85% for high validity
  mathBaselineLatencyMs?: number;
  adaptiveMathTimeoutMs?: number;
  thetaGwm: number;
  percentile: number;
}

// Symbol Pattern Discrimination for Processing Speed (Gs)
export interface SymbolTrialRecord {
  trialIndex: number;
  targetSymbol: string;
  searchSymbols: string[];
  isMatchPresent: boolean;
  userResponse: boolean;
  isCorrect: boolean;
  decisionTimeMs: number; // Time from display to first interaction touch/pointer
  motorTapTimeMs: number; // Time between touch initiation and pointer completion
  totalLatencyMs: number;
}

export interface SymbolSpeedResult {
  totalTrials: number;
  correctTrials: number;
  accuracyRate: number;
  meanDecisionTimeMs: number;
  meanMotorTapTimeMs: number;
  meanTotalLatencyMs: number;
  thetaGs: number;
  percentile: number;
  exGaussian?: ExGaussianParameters;
}

// Verbal-Conceptual Reasoning for Crystallized Ability (Gc)
export interface VerbalItem {
  id: string;
  analogyPrompt: string; // e.g., "ENTROPÍA es a CAOS como HOMEOSTASIS es a..."
  options: string[];
  correctIndex: number;
  difficulty: number;
  conceptualDomain: 'scientific' | 'relational' | 'systemic' | 'metaphoric';
}

export interface VerbalResult {
  score: number;
  total: number;
  thetaGc: number;
  percentile: number;
}

// 2e Clinical Discrepancy Engine Output
export interface DiscrepancyProfile {
  gai: {
    score: number;
    sem: number;
    ci95: [number, number];
    percentile: number;
    classification: string;
  };
  cpi: {
    score: number;
    sem: number;
    ci95: [number, number];
    percentile: number;
    classification: string;
  };
  discrepancyDelta: number; // |GAI - CPI|
  semDiff: number; // sqrt(SEM_GAI^2 + SEM_CPI^2)
  isFsiqValid: boolean;
  clinicalSyndromeFlag: '2E_AACC_ADHD' | 'HARMONIOUS_SUPERIOR' | 'HARMONIOUS_AVERAGE' | 'ASYMMETRIC_SPEED_VULNERABILITY';
  discrepancyNarrative: string;
  populationBaseRate: string; // e.g. "< 5.0% (p < 0.01)" or "< 1.5% (p < 0.001)"
  certifiedIntelligencePotential: number;
  broadAbilitiesTheta: {
    gf: number;
    gwm: number;
    gs: number;
    gc: number;
  };
  exGaussian?: ExGaussianParameters;
}

// Forced-Choice Triads (Thurstonian IRT)
export type TraitKey =
  | 'cb5t_plasticity'
  | 'cb5t_stability'
  | 'hexaco_honesty_humility'
  | 'cart_aot'
  | 'cart_cognitive_miserliness_resistance'
  | 'monotropism_mq'
  | 'bdefs_time_myopia'
  | 'bdefs_inhibition'
  | 'bdefs_activation'
  | 'bdefs_emotional_regulation'
  | 'cat_q_camouflaging'
  | 'dunn_sensory_sensitivity'
  | 'dabrowski_intellectual'
  | 'dabrowski_imaginative'
  | 'dabrowski_emotional'
  | 'dabrowski_psychomotor'
  | 'dabrowski_sensual';

export interface TriadStatement {
  id: string;
  text: string;
  trait: TraitKey;
  weight: number; // +1 or -1 polarity
}

export interface TriadItem {
  id: string;
  block: '4A' | '4B';
  triadNumber: number;
  statements: [TriadStatement, TriadStatement, TriadStatement];
}

export interface TriadResponse {
  triadId: string;
  mostLikeId: string;
  leastLikeId: string;
}

export interface PersonalityAndPhenotypeScores {
  // 0-100 normalized scores
  cb5tPlasticity: number;
  cb5tStability: number;
  hexacoHonestyHumility: number;
  cartAOT: number;
  cognitiveMiserlinessResistance: number;
  // Neurodivergent phenotype
  monotropismMQScore: number;
  monotropismProfile: 'DEEP_TUNNEL' | 'MODERATE_FOCUS' | 'POLYTROPIC_DIFFUSE';
  bdefsTimeMyopia: number;
  bdefsInhibition: number;
  bdefsActivation: number;
  bdefsEmotionalRegulation: number;
  catQScore: number;
  maskingBurnoutRisk: 'MILD' | 'MODERATE' | 'SEVERE';
  dunnQuadrant: 'SENSORY_SENSITIVITY' | 'SENSATION_AVOIDING' | 'LOW_REGISTRATION' | 'SENSATION_SEEKING';
  dunnThreshold: 'LOW' | 'TYPICAL' | 'HIGH';
  dabrowski: {
    intellectual: number;
    imaginative: number;
    emotional: number;
    psychomotor: number;
    sensual: number;
  };
  primaryBottleneck: 'PSYCHOLOGICAL_CAPABILITY' | 'AUTOMATIC_MOTIVATION' | 'PHYSICAL_OPPORTUNITY' | 'REFLECTIVE_MOTIVATION';
  identifiedLevers: [string, string];
}

export type EvaluationScope = 'FULL' | 'COGNITIVE_ONLY' | 'PHENOTYPE_ONLY' | 'PARTIAL';

export interface FullPsychometricReport {
  metadata: {
    timestamp: string;
    appVersion: string;
    sessionDurationMinutes: number;
    drasgowFitStatisticLz: number;
    testingIntegrityFlag: 'VALID' | 'PROVISIONAL_ATTENTION_SLIPS';
    ageBracket?: AgeBracket;
    evaluationScope?: EvaluationScope;
    completedModules?: {
      gfMatrices: boolean;
      gwmOSpan: boolean;
      gsSpeed: boolean;
      gcVerbal: boolean;
      personality4A: boolean;
      phenotype4B: boolean;
    };
  };
  cognitiveIntelligenceCHC: DiscrepancyProfile;
  personalityAndPhenotype: PersonalityAndPhenotypeScores;
  xmlPayload: string;
  compactTokenBase64: string;
}

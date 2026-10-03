// Global Session State Machine & Context for NEUROSYNAPSE
import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  MatrixItem,
  MatrixResponseRecord,
  CATState,
  OSpanRoundResult,
  OSpanFinalScore,
  SymbolTrialRecord,
  SymbolSpeedResult,
  VerbalResult,
  TriadResponse,
  PersonalityAndPhenotypeScores,
  FullPsychometricReport,
  DiscrepancyProfile,
  EvaluationScope
} from '../psychometrics/types';
import { MATRIX_ITEMS_POOL } from '../psychometrics/matrixItemsPool';
import { VERBAL_ITEMS_POOL, calculateGcScore } from '../psychometrics/verbalItemsPool';
import { TRIADS_POOL } from '../psychometrics/triadsPool';
import { scoreThurstonianTriads } from '../psychometrics/thurstonianIrt';
import { computeDiscrepancyProfile } from '../psychometrics/discrepancyEngine';
import { generateGeminiProfileXML, generateBase64Token } from '../psychometrics/geminiHandshake';
import {
  estimateAbilityEAP,
  selectNextItemFisher,
  calculateDrasgowLz,
  checkADHDImpulsiveAnomaly,
  thetaToWechslerIQ,
  thetaSEMToIQSEM,
  calculateConfidenceInterval95,
  thetaToPercentile,
  SEM_STOPPING_THRESHOLD,
  MAX_CAT_ITEMS
} from '../psychometrics/irt3pl';
import { saveSessionState, loadSessionState, clearSessionState } from './storage';

export type AssessmentStage =
  | 'WELCOME'
  | 'STAGE_1_GF_MATRICES'
  | 'BREATHER_1'
  | 'STAGE_2A_OSPAN'
  | 'STAGE_2B_SYMBOL_MATCH'
  | 'ENERGY_CHECKPOINT'
  | 'STAGE_3_GC_VERBAL'
  | 'BREATHER_2'
  | 'STAGE_4A_TRIADS_PERSONALITY'
  | 'STAGE_4B_TRIADS_PHENOTYPE'
  | 'RESULTS_DASHBOARD';

export type AppTheme = 'dark' | 'light' | 'sepia';
export type AppFont = 'sans' | 'opendyslexic';

interface SessionContextValue {
  // Navigation & stage
  currentStage: AssessmentStage;
  setStage: (stage: AssessmentStage) => void;
  // Module mode selection
  selectedModuleMode: 'FULL' | 'COGNITIVE_ONLY' | 'PHENOTYPE_ONLY';
  setSelectedModuleMode: (mode: 'FULL' | 'COGNITIVE_ONLY' | 'PHENOTYPE_ONLY') => void;
  // Appearance & Accessibility
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  font: AppFont;
  setFont: (font: AppFont) => void;
  // Stage 1: Gf CAT
  catCurrentItem: MatrixItem | null;
  catState: CATState;
  submitMatrixResponse: (selectedOptionIndex: number) => void;
  isProcessingItem: boolean;
  itemPointerDownTime: number;
  setItemPointerDownTime: (t: number) => void;
  // Stage 2A: O-Span
  oSpanFinalScore: OSpanFinalScore | null;
  completeOSpan: (score: OSpanFinalScore) => void;
  // Stage 2B: Symbol Match
  symbolMatchFinal: SymbolSpeedResult | null;
  completeSymbolMatch: (result: SymbolSpeedResult) => void;
  // Stage 3: Gc Verbal
  verbalAnswers: Record<string, number>;
  submitVerbalAnswer: (itemId: string, optionIndex: number) => void;
  completeVerbalStage: () => void;
  verbalResult: VerbalResult | null;
  // Stage 4: Triads
  triadResponses: Record<string, TriadResponse>;
  saveTriadResponse: (triadId: string, mostId: string, leastId: string) => void;
  completeTriadsBlockA: () => void;
  completeTriadsBlockB: (finalResponses?: Record<string, TriadResponse>) => void;
  // Dynamic Phenotype & Personality state values (100% reactive to user responses)
  monotropismScore: number | null;
  bdefsScores: {
    time: number;
    inhibition: number;
    activation: number;
    emotion: number;
  } | null;
  catqScore: number | null;
  maskingBurnoutRisk: 'MILD' | 'MODERATE' | 'SEVERE' | null;
  sensoryQuadrant: 'SENSORY_SENSITIVITY' | 'SENSATION_AVOIDING' | 'LOW_REGISTRATION' | 'SENSATION_SEEKING' | null;
  sensoryThreshold: 'LOW' | 'TYPICAL' | 'HIGH' | null;
  dabrowskiScores: {
    intellectual: number;
    imaginative: number;
    emotional: number;
    psychomotor: number;
    sensual: number;
  } | null;
  cb5tScores: { plasticity: number; stability: number } | null;
  hexacoScore: number | null;
  cartScores: { aot: number; miserliness: number } | null;
  // Final & Partial Results
  fullReport: FullPsychometricReport | null;
  generatePartialReport: (
    scope?: EvaluationScope,
    currentVerbal?: VerbalResult,
    currentTriads?: Record<string, TriadResponse>
  ) => void;
  restartSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accessibility state
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [font, setFont] = useState<AppFont>('sans');

  // Stage & module state
  const [currentStage, setCurrentStage] = useState<AssessmentStage>('WELCOME');
  const [selectedModuleMode, setSelectedModuleMode] = useState<'FULL' | 'COGNITIVE_ONLY' | 'PHENOTYPE_ONLY'>('FULL');
  const [sessionStartTime, setSessionStartTime] = useState<number>(() => Date.now());

  // Dynamic scores stored in state (100% reactive)
  const [monotropismScore, setMonotropismScore] = useState<number | null>(null);
  const [bdefsScores, setBdefsScores] = useState<{
    time: number;
    inhibition: number;
    activation: number;
    emotion: number;
  } | null>(null);
  const [catqScore, setCatqScore] = useState<number | null>(null);
  const [maskingBurnoutRisk, setMaskingBurnoutRisk] = useState<'MILD' | 'MODERATE' | 'SEVERE' | null>(null);
  const [sensoryQuadrant, setSensoryQuadrant] = useState<'SENSORY_SENSITIVITY' | 'SENSATION_AVOIDING' | 'LOW_REGISTRATION' | 'SENSATION_SEEKING' | null>(null);
  const [sensoryThreshold, setSensoryThreshold] = useState<'LOW' | 'TYPICAL' | 'HIGH' | null>(null);
  const [dabrowskiScores, setDabrowskiScores] = useState<{
    intellectual: number;
    imaginative: number;
    emotional: number;
    psychomotor: number;
    sensual: number;
  } | null>(null);
  const [cb5tScores, setCb5tScores] = useState<{ plasticity: number; stability: number } | null>(null);
  const [hexacoScore, setHexacoScore] = useState<number | null>(null);
  const [cartScores, setCartScores] = useState<{ aot: number; miserliness: number } | null>(null);

  // Stage 1: CAT State
  const [catResponses, setCatResponses] = useState<MatrixResponseRecord[]>([]);
  const [catCurrentItem, setCatCurrentItem] = useState<MatrixItem | null>(() => {
    // Initial calibration item (Entry difficulty b ~ -1.3)
    return MATRIX_ITEMS_POOL.find(i => i.id === 'mat_04') || MATRIX_ITEMS_POOL[0];
  });
  const [isProcessingItem, setIsProcessingItem] = useState(false);
  const [itemPointerDownTime, setItemPointerDownTime] = useState<number>(0);
  const currentItemPresentationTime = useRef<number>(performance.now());

  const [catState, setCatState] = useState<CATState>({
    administeredItems: [],
    remainingItemIds: MATRIX_ITEMS_POOL.map(i => i.id),
    thetaEAP: 0.0,
    semTheta: 1.0,
    iqScore: 100,
    semIQ: 15.0,
    ci95: [71, 129],
    percentile: 50.0,
    isTerminated: false,
    drasgowLz: 0.0,
    anomaliesDetected: 0
  });

  // Stage 2A & 2B
  const [oSpanFinalScore, setOSpanFinalScore] = useState<OSpanFinalScore | null>(null);
  const [symbolMatchFinal, setSymbolMatchFinal] = useState<SymbolSpeedResult | null>(null);

  // Stage 3: Verbal
  const [verbalAnswers, setVerbalAnswers] = useState<Record<string, number>>({});
  const [verbalResult, setVerbalResult] = useState<VerbalResult | null>(null);

  // Stage 4: Triads
  const [triadResponses, setTriadResponses] = useState<Record<string, TriadResponse>>({});
  const [personalityAndPhenotype, setPersonalityAndPhenotype] = useState<PersonalityAndPhenotypeScores | null>(null);

  // Full Report
  const [fullReport, setFullReport] = useState<FullPsychometricReport | null>(null);

  // Web Worker ref
  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../psychometrics/irt.worker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (event: MessageEvent) => {
        const { type, result } = event.data;
        if (type === 'PROCESS_STEP_RESULT') {
          handleWorkerStepResult(result);
        }
      };
    } catch (e) {
      console.warn('Worker initialization fallback to synchronous mode', e);
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Update theme & font class on <body>
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-sepia');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('font-sans', 'font-opendyslexic');
    document.body.classList.add(font === 'opendyslexic' ? 'font-opendyslexic' : 'font-sans');
  }, [font]);

  // Load saved state on mount
  useEffect(() => {
    loadSessionState<any>().then(saved => {
      if (saved && saved.currentStage && saved.currentStage !== 'WELCOME') {
        setCurrentStage(saved.currentStage);
        if (saved.selectedModuleMode) setSelectedModuleMode(saved.selectedModuleMode);
        if (saved.theme) setTheme(saved.theme);
        if (saved.font) setFont(saved.font);
        if (saved.catResponses) setCatResponses(saved.catResponses);
        if (saved.catState) setCatState(saved.catState);
        if (saved.catCurrentItem) setCatCurrentItem(saved.catCurrentItem);
        if (saved.oSpanFinalScore) setOSpanFinalScore(saved.oSpanFinalScore);
        if (saved.symbolMatchFinal) setSymbolMatchFinal(saved.symbolMatchFinal);
        if (saved.verbalAnswers) setVerbalAnswers(saved.verbalAnswers);
        if (saved.verbalResult) setVerbalResult(saved.verbalResult);
        if (saved.triadResponses) setTriadResponses(saved.triadResponses);
        if (saved.personalityAndPhenotype) setPersonalityAndPhenotype(saved.personalityAndPhenotype);
        if (saved.monotropismScore !== undefined) setMonotropismScore(saved.monotropismScore);
        if (saved.bdefsScores) setBdefsScores(saved.bdefsScores);
        if (saved.catqScore !== undefined) setCatqScore(saved.catqScore);
        if (saved.maskingBurnoutRisk) setMaskingBurnoutRisk(saved.maskingBurnoutRisk);
        if (saved.sensoryQuadrant) setSensoryQuadrant(saved.sensoryQuadrant);
        if (saved.sensoryThreshold) setSensoryThreshold(saved.sensoryThreshold);
        if (saved.dabrowskiScores) setDabrowskiScores(saved.dabrowskiScores);
        if (saved.cb5tScores) setCb5tScores(saved.cb5tScores);
        if (saved.hexacoScore !== undefined) setHexacoScore(saved.hexacoScore);
        if (saved.cartScores) setCartScores(saved.cartScores);
        if (saved.fullReport) setFullReport(saved.fullReport);
        if (saved.sessionStartTime) setSessionStartTime(saved.sessionStartTime);
      }
    });
  }, []);

  // Auto-save session state
  useEffect(() => {
    if (currentStage !== 'WELCOME') {
      saveSessionState({
        currentStage,
        selectedModuleMode,
        theme,
        font,
        catResponses,
        catState,
        catCurrentItem,
        oSpanFinalScore,
        symbolMatchFinal,
        verbalAnswers,
        verbalResult,
        triadResponses,
        personalityAndPhenotype,
        monotropismScore,
        bdefsScores,
        catqScore,
        maskingBurnoutRisk,
        sensoryQuadrant,
        sensoryThreshold,
        dabrowskiScores,
        cb5tScores,
        hexacoScore,
        cartScores,
        fullReport,
        sessionStartTime
      });
    }
  }, [
    currentStage,
    selectedModuleMode,
    theme,
    font,
    catResponses,
    catState,
    catCurrentItem,
    oSpanFinalScore,
    symbolMatchFinal,
    verbalAnswers,
    verbalResult,
    triadResponses,
    personalityAndPhenotype,
    monotropismScore,
    bdefsScores,
    catqScore,
    maskingBurnoutRisk,
    sensoryQuadrant,
    sensoryThreshold,
    dabrowskiScores,
    cb5tScores,
    hexacoScore,
    cartScores,
    fullReport,
    sessionStartTime
  ]);

  // Handle worker result
  const handleWorkerStepResult = (res: any) => {
    setIsProcessingItem(false);

    setCatState(prev => ({
      ...prev,
      thetaEAP: res.thetaEAP,
      semTheta: res.semTheta,
      iqScore: res.iqScore,
      semIQ: res.semIQ,
      ci95: res.ci95,
      percentile: res.percentile,
      drasgowLz: res.drasgowLz,
      anomaliesDetected: prev.anomaliesDetected + (res.isImpulsiveAnomaly ? 1 : 0),
      isTerminated: res.isTerminated,
      terminationReason: res.terminationReason
    }));

    if (res.isTerminated || !res.nextItem) {
      // Stage 1 finished -> proceed to Breather 1
      setCurrentStage('BREATHER_1');
    } else {
      setCatCurrentItem(res.nextItem);
      currentItemPresentationTime.current = performance.now();
    }
  };

  // Submit Matrix Answer
  const submitMatrixResponse = (selectedOptionIndex: number) => {
    if (!catCurrentItem || isProcessingItem) return;

    const now = performance.now();
    const latencyMs = Math.round(now - currentItemPresentationTime.current);
    const isCorrect = selectedOptionIndex === catCurrentItem.correctOptionIndex;

    const newRecord: MatrixResponseRecord = {
      itemId: catCurrentItem.id,
      itemCode: catCurrentItem.code,
      selectedOption: selectedOptionIndex,
      isCorrect,
      a: catCurrentItem.a,
      b: catCurrentItem.b,
      latencyMs
    };

    const updatedResponses = [...catResponses, newRecord];
    setCatResponses(updatedResponses);
    setIsProcessingItem(true);

    const remainingAvailable = MATRIX_ITEMS_POOL.filter(
      item => !updatedResponses.some(r => r.itemId === item.id)
    );

    // If worker is active, delegate
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'PROCESS_STEP',
        payload: {
          responses: updatedResponses,
          availableItems: remainingAvailable,
          currentTheta: catState.thetaEAP,
          lastResponse: {
            itemId: catCurrentItem.id,
            b: catCurrentItem.b,
            isCorrect,
            latencyMs
          }
        }
      });
    } else {
      // Synchronous fallback
      const isImpulsive = checkADHDImpulsiveAnomaly(
        catState.thetaEAP,
        catCurrentItem.b,
        isCorrect,
        latencyMs
      );
      if (isImpulsive) {
        newRecord.isImpulsiveAnomaly = true;
      }

      const estimation = estimateAbilityEAP(updatedResponses);
      const iq = thetaToWechslerIQ(estimation.thetaEAP);
      const semIQ = thetaSEMToIQSEM(estimation.semTheta);
      const ci95 = calculateConfidenceInterval95(iq, semIQ);
      const percentile = thetaToPercentile(estimation.thetaEAP);
      const drasgowLz = calculateDrasgowLz(estimation.thetaEAP, updatedResponses);

      const isTerminated =
        estimation.semTheta <= SEM_STOPPING_THRESHOLD ||
        updatedResponses.length >= MAX_CAT_ITEMS ||
        remainingAvailable.length === 0;

      const nextItem = isTerminated ? null : selectNextItemFisher(estimation.thetaEAP, remainingAvailable);

      handleWorkerStepResult({
        thetaEAP: estimation.thetaEAP,
        posteriorVariance: estimation.posteriorVariance,
        semTheta: estimation.semTheta,
        iqScore: iq,
        semIQ,
        ci95,
        percentile,
        drasgowLz,
        isImpulsiveAnomaly: isImpulsive,
        isTerminated,
        terminationReason: isTerminated ? 'SEM_CONVERGENCE' : undefined,
        nextItem
      });
    }
  };

  // Complete O-Span
  const completeOSpan = (score: OSpanFinalScore) => {
    setOSpanFinalScore(score);
    setCurrentStage('STAGE_2B_SYMBOL_MATCH');
  };

  // Complete Symbol Match
  const completeSymbolMatch = (result: SymbolSpeedResult) => {
    setSymbolMatchFinal(result);
    setCurrentStage('ENERGY_CHECKPOINT');
  };

  // Verbal Stage
  const submitVerbalAnswer = (itemId: string, optionIndex: number) => {
    setVerbalAnswers(prev => ({ ...prev, [itemId]: optionIndex }));
  };

  const completeVerbalStage = () => {
    const result = calculateGcScore(verbalAnswers);
    setVerbalResult(result);
    if (selectedModuleMode === 'COGNITIVE_ONLY') {
      generatePartialReport('COGNITIVE_ONLY', result);
    } else {
      setCurrentStage('BREATHER_2');
    }
  };

  // Triads Stage
  const saveTriadResponse = (triadId: string, mostId: string, leastId: string) => {
    const updated = {
      ...triadResponses,
      [triadId]: { triadId, mostLikeId: mostId, leastLikeId: leastId }
    };
    setTriadResponses(updated);

    // Compute dynamic scores in real-time directly from user's responses
    const currentScores = scoreThurstonianTriads(updated);
    setPersonalityAndPhenotype(currentScores);
    setMonotropismScore(currentScores.monotropismMQScore);
    setBdefsScores({
      time: currentScores.bdefsTimeMyopia,
      inhibition: currentScores.bdefsInhibition,
      activation: currentScores.bdefsActivation,
      emotion: currentScores.bdefsEmotionalRegulation
    });
    setCatqScore(currentScores.catQScore);
    setMaskingBurnoutRisk(currentScores.maskingBurnoutRisk);
    setSensoryQuadrant(currentScores.dunnQuadrant);
    setSensoryThreshold(currentScores.dunnThreshold);
    setDabrowskiScores(currentScores.dabrowski);
    setCb5tScores({
      plasticity: currentScores.cb5tPlasticity,
      stability: currentScores.cb5tStability
    });
    setHexacoScore(currentScores.hexacoHonestyHumility);
    setCartScores({
      aot: currentScores.cartAOT,
      miserliness: currentScores.cognitiveMiserlinessResistance
    });
  };

  const completeTriadsBlockA = () => {
    setCurrentStage('STAGE_4B_TRIADS_PHENOTYPE');
  };

  const completeTriadsBlockB = (finalResponses?: Record<string, TriadResponse>) => {
    const effectiveResponses = finalResponses || triadResponses;
    const scope: EvaluationScope =
      selectedModuleMode === 'PHENOTYPE_ONLY' || catResponses.length === 0
        ? 'PHENOTYPE_ONLY'
        : 'FULL';
    generatePartialReport(scope, undefined, effectiveResponses);
  };

  // Centralized report generator (supports Full or Partial analysis)
  const generatePartialReport = (
    requestedScope?: EvaluationScope,
    currentVerbal?: VerbalResult,
    currentTriads?: Record<string, TriadResponse>
  ) => {
    const effectiveTriads = currentTriads || triadResponses;
    const effectiveVerbal = currentVerbal || verbalResult || (Object.keys(verbalAnswers).length > 0 ? calculateGcScore(verbalAnswers) : null);

    // Compute dynamic personality and phenotype scores from actual responses
    const scores = scoreThurstonianTriads(effectiveTriads);
    setPersonalityAndPhenotype(scores);
    setMonotropismScore(scores.monotropismMQScore);
    setBdefsScores({
      time: scores.bdefsTimeMyopia,
      inhibition: scores.bdefsInhibition,
      activation: scores.bdefsActivation,
      emotion: scores.bdefsEmotionalRegulation
    });
    setCatqScore(scores.catQScore);
    setMaskingBurnoutRisk(scores.maskingBurnoutRisk);
    setSensoryQuadrant(scores.dunnQuadrant);
    setSensoryThreshold(scores.dunnThreshold);
    setDabrowskiScores(scores.dabrowski);
    setCb5tScores({
      plasticity: scores.cb5tPlasticity,
      stability: scores.cb5tStability
    });
    setHexacoScore(scores.hexacoHonestyHumility);
    setCartScores({
      aot: scores.cartAOT,
      miserliness: scores.cognitiveMiserlinessResistance
    });

    // Compute CHC Discrepancy Profile
    const thetaGf = catState.thetaEAP;
    const semThetaGf = catState.semTheta;
    const thetaGc = effectiveVerbal ? effectiveVerbal.thetaGc : 0.0;
    const thetaGwm = oSpanFinalScore ? oSpanFinalScore.thetaGwm : 0.0;
    const thetaGs = symbolMatchFinal ? symbolMatchFinal.thetaGs : 0.0;

    const discrepancy = computeDiscrepancyProfile({
      thetaGf,
      semThetaGf,
      thetaGc,
      thetaGwm,
      thetaGs
    });

    const elapsedMinutes = Number(((Date.now() - sessionStartTime) / (1000 * 60)).toFixed(1));

    const hasCognitiveData = catResponses.length > 0 || Boolean(oSpanFinalScore) || Boolean(symbolMatchFinal) || Boolean(effectiveVerbal);
    const hasPhenotypeData = Object.keys(effectiveTriads).length > 0;

    let resolvedScope: EvaluationScope = requestedScope || selectedModuleMode;
    if (!requestedScope) {
      if (hasCognitiveData && hasPhenotypeData) {
        resolvedScope = 'FULL';
      } else if (hasCognitiveData && !hasPhenotypeData) {
        resolvedScope = 'COGNITIVE_ONLY';
      } else if (!hasCognitiveData && hasPhenotypeData) {
        resolvedScope = 'PHENOTYPE_ONLY';
      } else {
        resolvedScope = 'PARTIAL';
      }
    }

    const finalReportData: FullPsychometricReport = {
      metadata: {
        timestamp: new Date().toISOString(),
        appVersion: 'NEUROSYNAPSE_v1.0',
        sessionDurationMinutes: Math.max(2, elapsedMinutes),
        drasgowFitStatisticLz: catState.drasgowLz,
        testingIntegrityFlag: catState.anomaliesDetected > 1 ? 'PROVISIONAL_ATTENTION_SLIPS' : 'VALID',
        evaluationScope: resolvedScope,
        completedModules: {
          gfMatrices: catResponses.length > 0,
          gwmOSpan: Boolean(oSpanFinalScore),
          gsSpeed: Boolean(symbolMatchFinal),
          gcVerbal: Boolean(effectiveVerbal),
          personality4A: Object.keys(effectiveTriads).some(k => k.startsWith('triad_4a')),
          phenotype4B: Object.keys(effectiveTriads).some(k => k.startsWith('triad_4b'))
        }
      },
      cognitiveIntelligenceCHC: discrepancy,
      personalityAndPhenotype: scores,
      xmlPayload: '',
      compactTokenBase64: ''
    };

    finalReportData.xmlPayload = generateGeminiProfileXML(finalReportData);
    finalReportData.compactTokenBase64 = generateBase64Token(finalReportData);

    setFullReport(finalReportData);
    setCurrentStage('RESULTS_DASHBOARD');
  };

  const restartSession = async () => {
    await clearSessionState();
    setCatResponses([]);
    setCatCurrentItem(MATRIX_ITEMS_POOL.find(i => i.id === 'mat_04') || MATRIX_ITEMS_POOL[0]);
    setCatState({
      administeredItems: [],
      remainingItemIds: MATRIX_ITEMS_POOL.map(i => i.id),
      thetaEAP: 0.0,
      semTheta: 1.0,
      iqScore: 100,
      semIQ: 15.0,
      ci95: [71, 129],
      percentile: 50.0,
      isTerminated: false,
      drasgowLz: 0.0,
      anomaliesDetected: 0
    });
    setOSpanFinalScore(null);
    setSymbolMatchFinal(null);
    setVerbalAnswers({});
    setVerbalResult(null);
    setTriadResponses({});
    setPersonalityAndPhenotype(null);
    setMonotropismScore(null);
    setBdefsScores(null);
    setCatqScore(null);
    setMaskingBurnoutRisk(null);
    setSensoryQuadrant(null);
    setSensoryThreshold(null);
    setDabrowskiScores(null);
    setCb5tScores(null);
    setHexacoScore(null);
    setCartScores(null);
    setSelectedModuleMode('FULL');
    setFullReport(null);
    setSessionStartTime(Date.now());
    setCurrentStage('WELCOME');
  };

  const value: SessionContextValue = {
    currentStage,
    setStage: setCurrentStage,
    selectedModuleMode,
    setSelectedModuleMode,
    theme,
    setTheme,
    font,
    setFont,
    catCurrentItem,
    catState,
    submitMatrixResponse,
    isProcessingItem,
    itemPointerDownTime,
    setItemPointerDownTime,
    oSpanFinalScore,
    completeOSpan,
    symbolMatchFinal,
    completeSymbolMatch,
    verbalAnswers,
    submitVerbalAnswer,
    completeVerbalStage,
    verbalResult,
    triadResponses,
    saveTriadResponse,
    completeTriadsBlockA,
    completeTriadsBlockB,
    monotropismScore,
    bdefsScores,
    catqScore,
    maskingBurnoutRisk,
    sensoryQuadrant,
    sensoryThreshold,
    dabrowskiScores,
    cb5tScores,
    hexacoScore,
    cartScores,
    fullReport,
    generatePartialReport,
    restartSession
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

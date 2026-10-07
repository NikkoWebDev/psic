// Automated Operation Span (AOSPAN) with Redick & Engle (2012) Calibration & nikko.dev Aesthetics
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { OSpanRound, OSpanFinalScore, OSpanRoundResult } from '../lib/psychometrics/types';
import {
  AOSPAN_SCORED_ROUNDS,
  MATH_PRACTICE_TRIALS,
  CANDIDATE_LETTERS,
  calculateAdaptiveMathTimeout,
  calculateTrialPCU,
  gradeAOSpanSession
} from '../lib/psychometrics/ospan';
import { getAgeNormOffsets } from '../lib/psychometrics/ageNorms';
import { Check, X, RotateCcw, ArrowRight, ShieldAlert, Award, Layers, Calculator, Zap, Clock } from 'lucide-react';
import { sound } from '../lib/audio/soundEngine';

// Pre-defined 2 practice rounds (span 2)
const PRACTICE_ROUNDS: OSpanRound[] = [
  {
    spanLength: 2,
    isPractice: true,
    steps: [
      { equationText: '(2 * 3) + 1 = 7', claimedResult: 7, isEquationCorrect: true, letter: 'K' },
      { equationText: '(8 / 2) - 1 = 2', claimedResult: 2, isEquationCorrect: false, letter: 'R' }
    ]
  },
  {
    spanLength: 2,
    isPractice: true,
    steps: [
      { equationText: '(5 * 2) - 4 = 6', claimedResult: 6, isEquationCorrect: true, letter: 'P' },
      { equationText: '(9 / 3) + 2 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'T' }
    ]
  }
];

export const OSpanTask: React.FC = () => {
  const { completeOSpan, ageBracket } = useSession();

  const [sessionPhase, setSessionPhase] = useState<
    'MATH_CALIBRATION_WELCOME' | 'MATH_CALIBRATION' | 'PRACTICE_WELCOME' | 'PRACTICE' | 'SCORED_TRANSITION' | 'SCORED'
  >('MATH_CALIBRATION_WELCOME');

  // Math Calibration State (3 trials)
  const [mathCalibStep, setMathCalibStep] = useState(0);
  const mathCalibStartRef = useRef<number>(0);
  const [mathLatencies, setMathLatencies] = useState<number[]>([]);
  const [adaptiveTimeoutMs, setAdaptiveTimeoutMs] = useState<number>(3500);
  const [baselineMathLatency, setBaselineMathLatency] = useState<number>(1800);

  // Task navigation state
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [subState, setSubState] = useState<'MATH' | 'LETTER' | 'RECALL' | 'FEEDBACK'>('MATH');

  const [mathAnswers, setMathAnswers] = useState<boolean[]>([]);
  const [recalledLetters, setRecalledLetters] = useState<string[]>([]);

  const [practiceResults, setPracticeResults] = useState<OSpanRoundResult[]>([]);
  const [scoredResults, setScoredResults] = useState<OSpanRoundResult[]>([]);

  // Math timeout countdown timer in scored phase
  const mathTimerStartRef = useRef<number>(0);

  const roundsPool = sessionPhase === 'PRACTICE' ? PRACTICE_ROUNDS : AOSPAN_SCORED_ROUNDS;
  const currentRound = roundsPool[currentRoundIdx];
  const currentStep = currentRound?.steps[currentStepIdx];

  // Auto transition letter display after 1.4s
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (subState === 'LETTER') {
      timer = setTimeout(() => {
        if (currentStepIdx + 1 < currentRound.steps.length) {
          setCurrentStepIdx(prev => prev + 1);
          setSubState('MATH');
        } else {
          setSubState('RECALL');
        }
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [subState, currentStepIdx, currentRound]);

  // Adaptive Math Timeout in Scored Phase
  useEffect(() => {
    let timeoutTimer: ReturnType<typeof setTimeout>;
    if (sessionPhase === 'SCORED' && subState === 'MATH' && currentStep) {
      mathTimerStartRef.current = performance.now();
      timeoutTimer = setTimeout(() => {
        // User exceeded individualized timeout -> mark as failed equation and advance
        sound.playErrorTone();
        setMathAnswers(prev => [...prev, false]);
        setSubState('LETTER');
      }, adaptiveTimeoutMs);
    }
    return () => clearTimeout(timeoutTimer);
  }, [sessionPhase, subState, currentStep, currentStepIdx, currentRoundIdx, adaptiveTimeoutMs]);

  // Keyboard shortcut listener for OSpan (Math & Recall)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionPhase === 'MATH_CALIBRATION') {
        const k = e.key.toLowerCase();
        if (k === 'v' || k === '1' || k === 't' || k === 's') {
          handleCalibrationMathChoice(true);
        } else if (k === 'f' || k === '2' || k === 'n') {
          handleCalibrationMathChoice(false);
        }
        return;
      }

      if (sessionPhase !== 'PRACTICE' && sessionPhase !== 'SCORED') return;

      if (subState === 'MATH') {
        const k = e.key.toLowerCase();
        if (k === 'v' || k === '1' || k === 't' || k === 's') {
          handleMathChoice(true);
        } else if (k === 'f' || k === '2' || k === 'n') {
          handleMathChoice(false);
        }
      } else if (subState === 'RECALL') {
        const char = e.key.toUpperCase();
        if (CANDIDATE_LETTERS.includes(char)) {
          handleLetterSelect(char);
        } else if (e.key === 'Backspace') {
          handleBackspaceLetter();
        } else if (e.key === 'Enter' && recalledLetters.length === currentRound.spanLength) {
          handleSubmitRecall();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subState, sessionPhase, currentStep, recalledLetters, currentRound, mathCalibStep]);

  // Math Calibration Handlers
  const handleStartCalibration = () => {
    setSessionPhase('MATH_CALIBRATION');
    setMathCalibStep(0);
    setMathLatencies([]);
    mathCalibStartRef.current = performance.now();
  };

  const handleCalibrationMathChoice = (isTrue: boolean) => {
    const latency = performance.now() - mathCalibStartRef.current;
    sound.playSoftClick();

    const nextLatencies = [...mathLatencies, latency];
    setMathLatencies(nextLatencies);

    if (mathCalibStep + 1 < MATH_PRACTICE_TRIALS.length) {
      setMathCalibStep(prev => prev + 1);
      mathCalibStartRef.current = performance.now();
    } else {
      // Calculate individual adaptive timeout: max(3500, mean + 2.5 * sd)
      const calib = calculateAdaptiveMathTimeout(nextLatencies);
      setAdaptiveTimeoutMs(calib.timeoutMs);
      setBaselineMathLatency(calib.meanLatency);
      setSessionPhase('PRACTICE_WELCOME');
    }
  };

  const handleMathChoice = (isTrue: boolean) => {
    if (!currentStep) return;
    sound.playSoftClick();
    const isCorrect = isTrue === currentStep.isEquationCorrect;
    setMathAnswers(prev => [...prev, isCorrect]);
    setSubState('LETTER');
  };

  const handleLetterSelect = (letter: string) => {
    if (recalledLetters.length < currentRound.spanLength) {
      sound.playSoftClick();
      setRecalledLetters(prev => [...prev, letter]);
    }
  };

  const handleBackspaceLetter = () => {
    sound.playSoftClick();
    setRecalledLetters(prev => prev.slice(0, -1));
  };

  const handleSubmitRecall = () => {
    sound.playTransitionTone();
    const targetLetters = currentRound.steps.map((s: { letter: string }) => s.letter);
    let correctCount = 0;
    for (let i = 0; i < targetLetters.length; i++) {
      if (recalledLetters[i] === targetLetters[i]) {
        correctCount++;
      }
    }

    const roundCompleteSuccess = correctCount === currentRound.spanLength;
    const mathAccCount = mathAnswers.filter(Boolean).length;
    const trialScore = calculateTrialPCU(recalledLetters, targetLetters);

    const roundResult: OSpanRoundResult = {
      roundIndex: currentRoundIdx,
      spanLength: currentRound.spanLength,
      isPractice: currentRound.isPractice || false,
      mathAccuracyCount: mathAccCount,
      mathTotalCount: currentRound.steps.length,
      recalledLetters,
      targetLetters,
      correctLetterCount: correctCount,
      roundCompleteSuccess,
      trialScore
    };

    if (sessionPhase === 'PRACTICE') {
      setPracticeResults(prev => [...prev, roundResult]);
      setSubState('FEEDBACK');
    } else {
      const nextScored = [...scoredResults, roundResult];
      setScoredResults(nextScored);

      if (currentRoundIdx + 1 < AOSPAN_SCORED_ROUNDS.length) {
        setCurrentRoundIdx(prev => prev + 1);
        setCurrentStepIdx(0);
        setMathAnswers([]);
        setRecalledLetters([]);
        setSubState('MATH');
      } else {
        finalizeOSpan(nextScored);
      }
    }
  };

  const handleNextPractice = () => {
    if (currentRoundIdx + 1 < PRACTICE_ROUNDS.length) {
      setCurrentRoundIdx(prev => prev + 1);
      setCurrentStepIdx(0);
      setMathAnswers([]);
      setRecalledLetters([]);
      setSubState('MATH');
    } else {
      setSessionPhase('SCORED_TRANSITION');
    }
  };

  const handleStartScored = () => {
    setSessionPhase('SCORED');
    setCurrentRoundIdx(0);
    setCurrentStepIdx(0);
    setMathAnswers([]);
    setRecalledLetters([]);
    setSubState('MATH');
  };

  const finalizeOSpan = (results: OSpanRoundResult[]) => {
    const ageOffsetGwm = getAgeNormOffsets(ageBracket).offsetGwm;
    const finalScore: OSpanFinalScore = gradeAOSpanSession(
      results,
      ageOffsetGwm,
      baselineMathLatency,
      adaptiveTimeoutMs
    );
    completeOSpan(finalScore);
  };

  // Phase: Math Calibration Welcome
  if (sessionPhase === 'MATH_CALIBRATION_WELCOME') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="eyebrow">// etapa 2a · calibración aritmética</div>
              <h2 className="text-xl font-bold font-display text-white">
                Calibración de Ritmo Cognitivo (AOSPAN)
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Antes de comenzar la tarea de memoria de trabajo, resolveremos <strong className="text-sky-300">3 operaciones aritméticas simples</strong> para calibrar tu velocidad natural de procesamiento y evitar penalizaciones por tiempo arbitrario.
          </p>

          <div className="bg-black/50 rounded-2xl p-4 sm:p-5 border border-white/5 space-y-3 text-xs text-slate-300 font-mono">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Determina si cada ecuación es <strong className="text-emerald-400">Verdadera</strong> o <strong className="text-rose-400">Falsa</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Responde con tu velocidad cómoda habitual (sin precipitarte ni demorarte artificialmente).</span>
            </div>
          </div>

          <button
            onClick={handleStartCalibration}
            className="btn-nikko-primary w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span>Iniciar Calibración Aritmética</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // Phase: Math Calibration Trials (3 trials)
  if (sessionPhase === 'MATH_CALIBRATION') {
    const calibTrial = MATH_PRACTICE_TRIALS[mathCalibStep];
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="glass-card p-4 flex items-center justify-between">
          <span className="text-xs font-mono text-sky-400 font-bold">
            Calibración de Velocidad Aritmética
          </span>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-slate-300">
            Ensayo {mathCalibStep + 1} / {MATH_PRACTICE_TRIALS.length}
          </span>
        </div>

        <div className="glass-card p-8 sm:p-10 text-center space-y-6">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            ¿Es correcto el resultado de la ecuación?
          </span>
          <div className="py-8 px-4 bg-black/60 rounded-2xl border border-white/10 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-white shadow-inner">
            {calibTrial.equationText}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onPointerDown={() => handleCalibrationMathChoice(true)}
              className="py-4 px-6 rounded-2xl font-bold bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer font-mono"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Verdadero</span>
            </button>
            <button
              onPointerDown={() => handleCalibrationMathChoice(false)}
              className="py-4 px-6 rounded-2xl font-bold bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-300 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer font-mono"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>Falso</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase: Practice Welcome (Letters + Math)
  if (sessionPhase === 'PRACTICE_WELCOME') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="eyebrow">// etapa 2a · memoria operativa</div>
              <h2 className="text-xl font-bold font-display text-white">
                Memoria de Trabajo Operativa (AOSPAN)
              </h2>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-300 flex items-center gap-3">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Ritmo calibrado: Tu ventana adaptativa de cálculo se ha fijado en <strong>{(adaptiveTimeoutMs / 1000).toFixed(1)}s</strong> por operación.</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ahora combinaremos las operaciones aritméticas con la memorización de letras en orden secuencial (norma Engle & Redick 2012).
          </p>

          <div className="bg-black/50 rounded-2xl p-4 sm:p-5 border border-white/5 space-y-3 text-xs text-slate-300 font-mono">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Evalúa la ecuación matemática dentro de tu ventana adaptativa.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Aparecerá una <strong>letra</strong> durante 1.4 segundos. Memorízala en orden exacto.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span>Al finalizar la serie, reconstruye la secuencia en la cuadrícula.</span>
            </div>
          </div>

          <button
            onClick={() => setSessionPhase('PRACTICE')}
            className="btn-nikko-primary w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span>Iniciar 2 Rondas de Práctica</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // Phase: Scored Transition
  if (sessionPhase === 'SCORED_TRANSITION') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="eyebrow">// calibración superada</div>
          <h2 className="text-xl font-bold font-display text-white">¡Mecánica Dominada!</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A continuación realizaremos la batería completa de evaluación oficial (series de 2 a 7 letras, 12 rondas en total con calificación por crédito parcial PCU sin límites de techo).
          </p>
          <button
            onClick={handleStartScored}
            className="btn-nikko-primary w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer mt-4"
          >
            <span>Comenzar Evaluación Oficial</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // Active Rounds (Practice or Scored)
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Terminal Titlebar Container */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="os-dots">
            <span className="os-dot os-dot-red"></span>
            <span className="os-dot os-dot-yellow"></span>
            <span className="os-dot os-dot-green"></span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {sessionPhase === 'PRACTICE' ? 'Modo Práctica' : 'AOSPAN Oficial (PCU)'}
          </span>
          <span className="text-slate-600 font-mono text-xs">/</span>
          <span className="text-xs font-mono text-slate-300">
            Ronda {currentRoundIdx + 1} de {roundsPool.length} ({currentRound.spanLength} letras)
          </span>
        </div>

        <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-slate-400">
          Paso {currentStepIdx + 1} / {currentRound.spanLength}
        </div>
      </div>

      {/* Sub-State: MATH */}
      {subState === 'MATH' && currentStep && (
        <div className="glass-card p-8 sm:p-10 text-center space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">¿Es correcto el resultado de la ecuación?</span>
            {sessionPhase === 'SCORED' && (
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Timeout adaptativo: {(adaptiveTimeoutMs / 1000).toFixed(1)}s</span>
              </span>
            )}
          </div>

          <div className="py-8 px-4 bg-black/60 rounded-2xl border border-white/10 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-white shadow-inner">
            {currentStep.equationText}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onPointerDown={() => handleMathChoice(true)}
              className="py-4 px-6 rounded-2xl font-bold bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer font-mono"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Verdadero</span>
            </button>
            <button
              onPointerDown={() => handleMathChoice(false)}
              className="py-4 px-6 rounded-2xl font-bold bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-300 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer font-mono"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>Falso</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-State: LETTER FLASH */}
      {subState === 'LETTER' && currentStep && (
        <div className="glass-card p-12 text-center space-y-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Memoriza la letra:
          </span>
          <div className="w-32 h-32 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-6xl font-black font-mono text-emerald-300 shadow-xl shadow-emerald-500/15">
            {currentStep.letter}
          </div>
        </div>
      )}

      {/* Sub-State: RECALL */}
      {subState === 'RECALL' && (
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="eyebrow">// recuperación de memoria</div>
            <h4 className="text-lg font-bold font-display text-white">Secuencia de Letras</h4>
            <p className="text-xs text-slate-400">
              Selecciona las {currentRound.spanLength} letras en el orden exacto en que aparecieron.
            </p>
          </div>

          {/* Slots Display */}
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: currentRound.spanLength }).map((_, idx) => (
              <div
                key={`slot-${idx}`}
                className={`w-12 h-14 rounded-2xl border flex items-center justify-center font-mono text-2xl font-bold transition-all ${
                  recalledLetters[idx]
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-black/60 border-white/10 text-slate-600'
                }`}
              >
                {recalledLetters[idx] || '_'}
              </div>
            ))}
          </div>

          {/* Letters Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-w-md mx-auto">
            {CANDIDATE_LETTERS.map(letter => {
              const countUsed = recalledLetters.filter(l => l === letter).length;
              return (
                <button
                  key={letter}
                  onPointerDown={() => handleLetterSelect(letter)}
                  disabled={recalledLetters.length >= currentRound.spanLength}
                  className={`h-12 rounded-2xl border font-mono text-lg font-bold transition-all active:scale-95 cursor-pointer ${
                    countUsed > 0
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                      : 'bg-black/50 border-white/10 hover:border-emerald-500/40 text-slate-200'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto pt-2">
            <button
              onClick={handleBackspaceLetter}
              disabled={recalledLetters.length === 0}
              className="py-2.5 px-4 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-2 disabled:opacity-40 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Borrar</span>
            </button>

            <button
              onClick={handleSubmitRecall}
              disabled={recalledLetters.length !== currentRound.spanLength}
              className="btn-nikko-primary py-2.5 px-6 text-xs font-mono font-bold uppercase disabled:opacity-40 cursor-pointer"
            >
              <span>Confirmar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-State: PRACTICE FEEDBACK */}
      {subState === 'FEEDBACK' && practiceResults.length > 0 && (
        <div className="glass-card p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-white">
            Retroalimentación de Ensayo
          </h3>

          <div className="bg-black/50 rounded-2xl p-4 border border-white/10 max-w-sm mx-auto text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Aciertos matemáticos:</span>
              <span className="text-emerald-400 font-bold">
                {practiceResults[practiceResults.length - 1].mathAccuracyCount} /{' '}
                {practiceResults[practiceResults.length - 1].mathTotalCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Letras recordadas:</span>
              <span className="text-sky-400 font-bold">
                {practiceResults[practiceResults.length - 1].correctLetterCount} /{' '}
                {practiceResults[practiceResults.length - 1].spanLength}
              </span>
            </div>
          </div>

          <button
            onClick={handleNextPractice}
            className="btn-nikko-primary py-3 px-8 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};

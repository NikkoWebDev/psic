// Complex Operation Span (O-Span) for Working Memory (Gwm)
// Features 2 guided practice trials + 5 scored rounds with arithmetic verification and letter recall
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { OSpanStep, OSpanRound, OSpanFinalScore, OSpanRoundResult } from '../lib/psychometrics/types';
import { Check, X, RotateCcw, ArrowRight, ShieldAlert, Award } from 'lucide-react';

const CANDIDATE_LETTERS = ['F', 'H', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'T', 'Y'];

// Pre-defined practice rounds
const PRACTICE_ROUNDS: OSpanRound[] = [
  {
    spanLength: 2,
    isPractice: true,
    steps: [
      { equationText: '(2 * 3) + 1 = 7', claimedResult: 7, isEquationCorrect: true, letter: 'K' },
      { equationText: '(8 / 2) - 1 = 2', claimedResult: 2, isEquationCorrect: false, letter: 'R' } // (4 - 1 = 3 != 2)
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

// Pre-defined 5 scored rounds with increasing cognitive load
const SCORED_ROUNDS: OSpanRound[] = [
  {
    spanLength: 2,
    isPractice: false,
    steps: [
      { equationText: '(4 * 2) - 3 = 5', claimedResult: 5, isEquationCorrect: true, letter: 'L' },
      { equationText: '(6 / 2) + 5 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'S' }
    ]
  },
  {
    spanLength: 3,
    isPractice: false,
    steps: [
      { equationText: '(3 * 3) - 2 = 7', claimedResult: 7, isEquationCorrect: true, letter: 'F' },
      { equationText: '(10 / 2) + 3 = 9', claimedResult: 9, isEquationCorrect: false, letter: 'N' }, // (5 + 3 = 8 != 9)
      { equationText: '(4 * 3) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'Q' }
    ]
  },
  {
    spanLength: 3,
    isPractice: false,
    steps: [
      { equationText: '(7 * 2) - 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'J' },
      { equationText: '(12 / 3) + 4 = 7', claimedResult: 7, isEquationCorrect: false, letter: 'H' }, // (4 + 4 = 8 != 7)
      { equationText: '(5 * 3) - 6 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'P' }
    ]
  },
  {
    spanLength: 4,
    isPractice: false,
    steps: [
      { equationText: '(6 * 2) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'T' },
      { equationText: '(15 / 3) + 2 = 8', claimedResult: 8, isEquationCorrect: false, letter: 'K' }, // (5 + 2 = 7 != 8)
      { equationText: '(4 * 4) - 5 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'R' },
      { equationText: '(8 / 4) + 6 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'L' }
    ]
  },
  {
    spanLength: 5,
    isPractice: false,
    steps: [
      { equationText: '(9 * 2) - 7 = 11', claimedResult: 11, isEquationCorrect: true, letter: 'S' },
      { equationText: '(16 / 4) + 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'F' },
      { equationText: '(5 * 4) - 8 = 10', claimedResult: 10, isEquationCorrect: false, letter: 'N' }, // (20 - 8 = 12 != 10)
      { equationText: '(18 / 3) + 3 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'Y' },
      { equationText: '(7 * 3) - 9 = 12', claimedResult: 12, isEquationCorrect: true, letter: 'J' }
    ]
  }
];

export const OSpanTask: React.FC = () => {
  const { completeOSpan } = useSession();

  // Mode: 'PRACTICE_WELCOME' | 'PRACTICE' | 'SCORED_TRANSITION' | 'SCORED'
  const [sessionPhase, setSessionPhase] = useState<
    'PRACTICE_WELCOME' | 'PRACTICE' | 'SCORED_TRANSITION' | 'SCORED'
  >('PRACTICE_WELCOME');

  // Round tracking
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  // Step state: 'MATH' | 'LETTER' | 'RECALL' | 'FEEDBACK'
  const [subState, setSubState] = useState<'MATH' | 'LETTER' | 'RECALL' | 'FEEDBACK'>('MATH');

  // Math tracking for current round
  const [mathAnswers, setMathAnswers] = useState<boolean[]>([]);
  // Letter recall tracking
  const [recalledLetters, setRecalledLetters] = useState<string[]>([]);

  // Results collectors
  const [practiceResults, setPracticeResults] = useState<OSpanRoundResult[]>([]);
  const [scoredResults, setScoredResults] = useState<OSpanRoundResult[]>([]);

  const roundsPool = sessionPhase === 'PRACTICE' ? PRACTICE_ROUNDS : SCORED_ROUNDS;
  const currentRound = roundsPool[currentRoundIdx];
  const currentStep = currentRound?.steps[currentStepIdx];

  // Auto transition letter display after 1.4s
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (subState === 'LETTER') {
      timer = setTimeout(() => {
        if (currentStepIdx + 1 < currentRound.steps.length) {
          // Next step
          setCurrentStepIdx(prev => prev + 1);
          setSubState('MATH');
        } else {
          // All steps finished -> go to recall grid
          setSubState('RECALL');
        }
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [subState, currentStepIdx, currentRound]);

  // Handle Math Answer
  const handleMathChoice = (isTrue: boolean) => {
    if (!currentStep) return;
    const isCorrect = isTrue === currentStep.isEquationCorrect;
    setMathAnswers(prev => [...prev, isCorrect]);
    setSubState('LETTER');
  };

  // Handle letter recall selection
  const handleLetterSelect = (letter: string) => {
    if (recalledLetters.length < currentRound.spanLength) {
      setRecalledLetters(prev => [...prev, letter]);
    }
  };

  const handleBackspaceLetter = () => {
    setRecalledLetters(prev => prev.slice(0, -1));
  };

  // Submit recall sequence for current round
  const handleSubmitRecall = () => {
    const targetLetters = currentRound.steps.map(s => s.letter);
    let correctCount = 0;
    for (let i = 0; i < targetLetters.length; i++) {
      if (recalledLetters[i] === targetLetters[i]) {
        correctCount++;
      }
    }

    const roundCompleteSuccess = correctCount === currentRound.spanLength;
    const mathAccCount = mathAnswers.filter(Boolean).length;

    const roundResult: OSpanRoundResult = {
      roundIndex: currentRoundIdx,
      spanLength: currentRound.spanLength,
      isPractice: currentRound.isPractice || false,
      mathAccuracyCount: mathAccCount,
      mathTotalCount: currentRound.steps.length,
      recalledLetters,
      targetLetters,
      correctLetterCount: correctCount,
      roundCompleteSuccess
    };

    if (sessionPhase === 'PRACTICE') {
      setPracticeResults(prev => [...prev, roundResult]);
      setSubState('FEEDBACK');
    } else {
      const nextScored = [...scoredResults, roundResult];
      setScoredResults(nextScored);

      if (currentRoundIdx + 1 < SCORED_ROUNDS.length) {
        // Next scored round
        setCurrentRoundIdx(prev => prev + 1);
        setCurrentStepIdx(0);
        setMathAnswers([]);
        setRecalledLetters([]);
        setSubState('MATH');
      } else {
        // All scored rounds completed! Calculate Gwm score
        finalizeOSpan(nextScored);
      }
    }
  };

  // Next Practice Round or Transition to Scored
  const handleNextPractice = () => {
    if (currentRoundIdx + 1 < PRACTICE_ROUNDS.length) {
      setCurrentRoundIdx(prev => prev + 1);
      setCurrentStepIdx(0);
      setMathAnswers([]);
      setRecalledLetters([]);
      setSubState('MATH');
    } else {
      // Done with practice
      setSessionPhase('SCORED_TRANSITION');
    }
  };

  // Start Scored Phase
  const handleStartScored = () => {
    setSessionPhase('SCORED');
    setCurrentRoundIdx(0);
    setCurrentStepIdx(0);
    setMathAnswers([]);
    setRecalledLetters([]);
    setSubState('MATH');
  };

  // Finalize O-Span Scores
  const finalizeOSpan = (results: OSpanRoundResult[]) => {
    const totalLettersPresented = results.reduce((sum, r) => sum + r.spanLength, 0);
    const totalLettersCorrect = results.reduce((sum, r) => sum + r.correctLetterCount, 0);
    // Absolute O-Span score: only letters from perfectly recalled rounds count
    const absoluteOSpanScore = results.reduce(
      (sum, r) => (r.roundCompleteSuccess ? sum + r.spanLength : sum),
      0
    );

    const totalMathEquations = results.reduce((sum, r) => sum + r.mathTotalCount, 0);
    const totalMathCorrect = results.reduce((sum, r) => sum + r.mathAccuracyCount, 0);
    const mathAccuracyRate = Math.round((totalMathCorrect / Math.max(1, totalMathEquations)) * 100);

    // Map absolute score to latent ability theta_Gwm
    // Standard normative mapping: average span ~ 2.5-3.5 letters
    const rawRatio = absoluteOSpanScore / totalLettersPresented; // 0..1
    // Theta Gwm centered at 0.0 with typical range [-2.5, +2.5]
    const thetaGwm = Number(((rawRatio - 0.5) / 0.22).toFixed(2));
    const percentile = Math.round(
      Math.min(99.5, Math.max(1, (1 / (1 + Math.exp(-1.702 * thetaGwm))) * 100))
    );

    const finalScore: OSpanFinalScore = {
      totalRounds: results.length,
      totalLettersPresented,
      totalLettersCorrect,
      absoluteOSpanScore,
      mathAccuracyRate,
      thetaGwm,
      percentile
    };

    completeOSpan(finalScore);
  };

  // Phase 1: Welcome to Practice
  if (sessionPhase === 'PRACTICE_WELCOME') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Etapa 2A • Función Ejecutiva
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Memoria de Trabajo Operativa (O-Span)
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Esta tarea evalúa tu capacidad para mantener información activa en la mente mientras procesas operaciones matemáticas intermedias.
          </p>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-6 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Verás una operación aritmética simple. Indica si el resultado propuesto es <strong>Verdadero</strong> o <strong>Falso</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Inmediatamente aparecerá una <strong>letra</strong> durante 1.4 segundos. Memorízala.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span>Al finalizar la serie, selecciona las letras en el <strong>orden exacto</strong> en que aparecieron.</span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6 text-xs text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Realizaremos <strong>2 ensayos de práctica guiados</strong> con retroalimentación no puntuada para que te familiarices con la interfaz.</span>
          </div>

          <button
            onClick={() => setSessionPhase('PRACTICE')}
            className="w-full py-3.5 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Iniciar Práctica Guiada</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Phase Transition: After Practice -> Scored Phase
  if (sessionPhase === 'SCORED_TRANSITION') {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">¡Práctica Completada!</h2>
          <p className="text-sm text-slate-300 mb-6">
            Ya conoces la dinámica del ejercicio. A continuación iniciaremos la evaluación oficial de 5 rondas con series de longitud creciente.
          </p>
          <button
            onClick={handleStartScored}
            className="w-full py-3.5 px-6 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Comenzar Evaluación Oficial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active Rounds (Practice or Scored)
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-indigo-400">
            {sessionPhase === 'PRACTICE' ? 'Modo Práctica (No Puntuado)' : 'Evaluación Oficial O-Span'}
          </span>
          <h3 className="text-base font-semibold text-slate-100">
            Ronda {currentRoundIdx + 1} de {roundsPool.length} • Serie de {currentRound.spanLength} letras
          </h3>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          Paso {currentStepIdx + 1} / {currentRound.spanLength}
        </div>
      </div>

      {/* Sub-State: MATH VERIFICATION */}
      {subState === 'MATH' && currentStep && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <span className="text-xs text-slate-400 block mb-2 font-mono uppercase">
            ¿Es correcto el resultado de la siguiente ecuación?
          </span>
          <div className="my-8 py-6 px-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-3xl sm:text-4xl font-mono font-bold tracking-wider text-slate-100">
            {currentStep.equationText}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onPointerDown={() => handleMathChoice(true)}
              className="py-4 px-6 rounded-xl font-bold bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 flex items-center justify-center gap-2 text-base transition-all active:scale-95"
            >
              <Check className="w-5 h-5" />
              <span>Verdadero</span>
            </button>
            <button
              onPointerDown={() => handleMathChoice(false)}
              className="py-4 px-6 rounded-xl font-bold bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 flex items-center justify-center gap-2 text-base transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
              <span>Falso</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-State: LETTER MEMORIZATION (1.4s flash) */}
      {subState === 'LETTER' && currentStep && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-12 text-center shadow-xl animate-fade-in">
          <span className="text-xs text-slate-400 block mb-3 font-mono uppercase">
            Memoriza esta letra:
          </span>
          <div className="w-32 h-32 mx-auto rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center text-6xl font-black font-mono text-indigo-300 shadow-inner">
            {currentStep.letter}
          </div>
        </div>
      )}

      {/* Sub-State: RECALL GRID */}
      {subState === 'RECALL' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h4 className="text-base font-bold text-slate-100">Recuperación de Secuencia</h4>
            <p className="text-xs text-slate-400">
              Selecciona las {currentRound.spanLength} letras en el orden exacto en que aparecieron.
            </p>
          </div>

          {/* Slots Display */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            {Array.from({ length: currentRound.spanLength }).map((_, idx) => (
              <div
                key={`slot-${idx}`}
                className={`w-12 h-14 rounded-xl border flex items-center justify-center font-mono text-2xl font-bold transition-all ${
                  recalledLetters[idx]
                    ? 'bg-indigo-600/20 border-indigo-400 text-indigo-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-600'
                }`}
              >
                {recalledLetters[idx] || '_'}
              </div>
            ))}
          </div>

          {/* 12 Candidate Letters Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-w-md mx-auto mb-6">
            {CANDIDATE_LETTERS.map(letter => {
              const countUsed = recalledLetters.filter(l => l === letter).length;
              return (
                <button
                  key={letter}
                  onPointerDown={() => handleLetterSelect(letter)}
                  disabled={recalledLetters.length >= currentRound.spanLength}
                  className={`h-12 rounded-xl border font-mono text-lg font-bold transition-all active:scale-95 ${
                    countUsed > 0
                      ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <button
              onClick={handleBackspaceLetter}
              disabled={recalledLetters.length === 0}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 flex items-center gap-1.5 disabled:opacity-40 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Borrar última</span>
            </button>

            <button
              onClick={handleSubmitRecall}
              disabled={recalledLetters.length !== currentRound.spanLength}
              className="py-2.5 px-6 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Confirmar Serie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-State: PRACTICE FEEDBACK (Only shown during practice rounds) */}
      {subState === 'FEEDBACK' && practiceResults.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            Retroalimentación de la Práctica
          </h3>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 max-w-sm mx-auto mb-6 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Precisión en matemáticas:</span>
              <span className="text-emerald-400 font-bold">
                {practiceResults[practiceResults.length - 1].mathAccuracyCount} /{' '}
                {practiceResults[practiceResults.length - 1].mathTotalCount} correctas
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Letras recordadas correctamente:</span>
              <span className="text-indigo-400 font-bold">
                {practiceResults[practiceResults.length - 1].correctLetterCount} /{' '}
                {practiceResults[practiceResults.length - 1].spanLength}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <span className="text-slate-400">Secuencia objetivo:</span>
              <span className="font-mono text-slate-200">
                {practiceResults[practiceResults.length - 1].targetLetters.join(' - ')}
              </span>
            </div>
          </div>

          <button
            onClick={handleNextPractice}
            className="py-3 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all inline-flex items-center gap-2"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

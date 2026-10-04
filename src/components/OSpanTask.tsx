// Complex Operation Span (O-Span) with nikko.dev Aesthetics
import React, { useState, useEffect } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { OSpanRound, OSpanFinalScore, OSpanRoundResult } from '../lib/psychometrics/types';
import { Check, X, RotateCcw, ArrowRight, ShieldAlert, Award, Layers } from 'lucide-react';

const CANDIDATE_LETTERS = ['F', 'H', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'T', 'Y'];

// Pre-defined practice rounds
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

// Pre-defined 5 scored rounds
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
      { equationText: '(10 / 2) + 3 = 9', claimedResult: 9, isEquationCorrect: false, letter: 'N' },
      { equationText: '(4 * 3) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'Q' }
    ]
  },
  {
    spanLength: 3,
    isPractice: false,
    steps: [
      { equationText: '(7 * 2) - 5 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'J' },
      { equationText: '(12 / 3) + 4 = 7', claimedResult: 7, isEquationCorrect: false, letter: 'H' },
      { equationText: '(5 * 3) - 6 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'P' }
    ]
  },
  {
    spanLength: 4,
    isPractice: false,
    steps: [
      { equationText: '(6 * 2) - 4 = 8', claimedResult: 8, isEquationCorrect: true, letter: 'T' },
      { equationText: '(15 / 3) + 2 = 8', claimedResult: 8, isEquationCorrect: false, letter: 'K' },
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
      { equationText: '(5 * 4) - 8 = 10', claimedResult: 10, isEquationCorrect: false, letter: 'N' },
      { equationText: '(18 / 3) + 3 = 9', claimedResult: 9, isEquationCorrect: true, letter: 'Y' },
      { equationText: '(7 * 3) - 9 = 12', claimedResult: 12, isEquationCorrect: true, letter: 'J' }
    ]
  }
];

export const OSpanTask: React.FC = () => {
  const { completeOSpan } = useSession();

  const [sessionPhase, setSessionPhase] = useState<
    'PRACTICE_WELCOME' | 'PRACTICE' | 'SCORED_TRANSITION' | 'SCORED'
  >('PRACTICE_WELCOME');

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [subState, setSubState] = useState<'MATH' | 'LETTER' | 'RECALL' | 'FEEDBACK'>('MATH');

  const [mathAnswers, setMathAnswers] = useState<boolean[]>([]);
  const [recalledLetters, setRecalledLetters] = useState<string[]>([]);

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
          setCurrentStepIdx(prev => prev + 1);
          setSubState('MATH');
        } else {
          setSubState('RECALL');
        }
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [subState, currentStepIdx, currentRound]);

  // Keyboard shortcut listener for OSpan (Math & Recall)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionPhase !== 'PRACTICE' && sessionPhase !== 'SCORED') return;

      if (subState === 'MATH') {
        const k = e.key.toLowerCase();
        if (k === 'v' || k === '1' || k === 't') {
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
  }, [subState, sessionPhase, currentStep, recalledLetters, currentRound]);


  const handleMathChoice = (isTrue: boolean) => {
    if (!currentStep) return;
    const isCorrect = isTrue === currentStep.isEquationCorrect;
    setMathAnswers(prev => [...prev, isCorrect]);
    setSubState('LETTER');
  };

  const handleLetterSelect = (letter: string) => {
    if (recalledLetters.length < currentRound.spanLength) {
      setRecalledLetters(prev => [...prev, letter]);
    }
  };

  const handleBackspaceLetter = () => {
    setRecalledLetters(prev => prev.slice(0, -1));
  };

  const handleSubmitRecall = () => {
    const targetLetters = currentRound.steps.map((s: { letter: string }) => s.letter);
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
    const totalLettersPresented = results.reduce((sum, r) => sum + r.spanLength, 0);
    const totalLettersCorrect = results.reduce((sum, r) => sum + r.correctLetterCount, 0);
    const absoluteOSpanScore = results.reduce(
      (sum, r) => (r.roundCompleteSuccess ? sum + r.spanLength : sum),
      0
    );

    const totalMathEquations = results.reduce((sum, r) => sum + r.mathTotalCount, 0);
    const totalMathCorrect = results.reduce((sum, r) => sum + r.mathAccuracyCount, 0);
    const mathAccuracyRate = Math.round((totalMathCorrect / Math.max(1, totalMathEquations)) * 100);

    const rawRatio = absoluteOSpanScore / totalLettersPresented;
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
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="eyebrow">// etapa 2a · competencia ejecutiva</div>
              <h2 className="text-xl font-bold font-display text-white">
                Memoria de Trabajo Operativa (O-Span)
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Esta tarea evalúa tu capacidad para mantener y manipular información activa en la mente mientras intercalas operaciones aritméticas intermedias.
          </p>

          <div className="bg-black/50 rounded-2xl p-4 sm:p-5 border border-white/5 space-y-3 text-xs text-slate-300 font-mono">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Evalúa la operación aritmética: pulsa <strong>Verdadero</strong> o <strong>Falso</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Aparecerá una <strong>letra</strong> durante 1.4 segundos. Memorízala en orden.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span>Al terminar la serie, reconstruye la secuencia de letras en el teclado.</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-xs text-amber-300 flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Incluye <strong>2 ensayos de práctica guiados</strong> con retroalimentación para afinar la interfaz sin afectar tus puntuaciones.</span>
          </div>

          <button
            onClick={() => setSessionPhase('PRACTICE')}
            className="btn-nikko-primary w-full py-4 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span>Iniciar Práctica Guiada</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // Phase Transition: After Practice
  if (sessionPhase === 'SCORED_TRANSITION') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="eyebrow">// práctica superada</div>
          <h2 className="text-xl font-bold font-display text-white">¡Mecánica Asimilada!</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A continuación iniciamos las 5 rondas oficiales con series de longitud creciente.
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

  // Active Rounds
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
            {sessionPhase === 'PRACTICE' ? 'Modo Práctica' : 'O-Span Oficial'}
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
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            ¿Es correcto el resultado de la ecuación?
          </span>
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

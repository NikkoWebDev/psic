// Rapid Symbol Pattern Matching Task for Processing Speed (Gs)
// 45-second discrimination task with sub-millisecond chronometry via performance.now() and pointerdown events
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { SymbolTrialRecord, SymbolSpeedResult } from '../lib/psychometrics/types';
import { Zap, Check, X, ArrowRight, Play } from 'lucide-react';

const SYMBOL_SET = ['⬡', '◇', '△', '○', '□', '▽', '✦', '⬢', '⊕', '⊗', '⊛', '⊘'];

function generateRandomTrial(trialIndex: number): {
  target: string;
  searchGroup: string[];
  isMatchPresent: boolean;
} {
  const isMatchPresent = Math.random() > 0.45;
  const target = SYMBOL_SET[Math.floor(Math.random() * SYMBOL_SET.length)];

  const poolWithoutTarget = SYMBOL_SET.filter(s => s !== target);
  // Pick 3 random distractor symbols
  const shuffledDistractors = [...poolWithoutTarget].sort(() => 0.5 - Math.random()).slice(0, 3);

  let searchGroup: string[];
  if (isMatchPresent) {
    const insertPos = Math.floor(Math.random() * 4);
    searchGroup = [...shuffledDistractors];
    searchGroup.splice(insertPos, 0, target);
  } else {
    const fourthDistractor = poolWithoutTarget[Math.floor(Math.random() * poolWithoutTarget.length)];
    searchGroup = [...shuffledDistractors, fourthDistractor].sort(() => 0.5 - Math.random());
  }

  return { target, searchGroup, isMatchPresent };
}

export const SymbolMatchTask: React.FC = () => {
  const { completeSymbolMatch } = useSession();

  const [phase, setPhase] = useState<'INSTRUCTIONS' | 'RUNNING' | 'FINISHED'>('INSTRUCTIONS');
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentTrialIdx, setCurrentTrialIdx] = useState(0);

  const [currentTrialData, setCurrentTrialData] = useState(() => generateRandomTrial(0));
  const trialStartTimeRef = useRef<number>(0);
  const pointerDownTimeRef = useRef<number>(0);

  const trialsLogRef = useRef<SymbolTrialRecord[]>([]);

  // 45-second active test timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'RUNNING') {
      trialStartTimeRef.current = performance.now();
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            finishTask();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Handle pointer down on YES / NO response buttons
  const handlePointerDown = (choice: boolean) => {
    pointerDownTimeRef.current = performance.now();
  };

  const handlePointerUp = (choice: boolean) => {
    if (phase !== 'RUNNING') return;

    const pointerUpTime = performance.now();
    const decisionTimeMs = Number((pointerDownTimeRef.current - trialStartTimeRef.current).toFixed(1));
    const motorTapTimeMs = Number((pointerUpTime - pointerDownTimeRef.current).toFixed(1));
    const totalLatencyMs = Number((pointerUpTime - trialStartTimeRef.current).toFixed(1));

    const isCorrect = choice === currentTrialData.isMatchPresent;

    const trialRecord: SymbolTrialRecord = {
      trialIndex: currentTrialIdx,
      targetSymbol: currentTrialData.target,
      searchSymbols: currentTrialData.searchGroup,
      isMatchPresent: currentTrialData.isMatchPresent,
      userResponse: choice,
      isCorrect,
      decisionTimeMs: Math.max(50, decisionTimeMs),
      motorTapTimeMs: Math.max(20, motorTapTimeMs),
      totalLatencyMs
    };

    trialsLogRef.current.push(trialRecord);

    // Next Trial
    setCurrentTrialIdx(prev => prev + 1);
    setCurrentTrialData(generateRandomTrial(currentTrialIdx + 1));
    trialStartTimeRef.current = performance.now();
  };

  const finishTask = () => {
    setPhase('FINISHED');
    const logs = trialsLogRef.current;
    const totalTrials = logs.length;
    const correctTrials = logs.filter(t => t.isCorrect).length;
    const accuracyRate = totalTrials > 0 ? Number(((correctTrials / totalTrials) * 100).toFixed(1)) : 0;

    const meanDecisionTimeMs =
      totalTrials > 0
        ? Math.round(logs.reduce((sum, t) => sum + t.decisionTimeMs, 0) / totalTrials)
        : 800;

    const meanMotorTapTimeMs =
      totalTrials > 0
        ? Math.round(logs.reduce((sum, t) => sum + t.motorTapTimeMs, 0) / totalTrials)
        : 150;

    const meanTotalLatencyMs = meanDecisionTimeMs + meanMotorTapTimeMs;

    // Psychometric standard score for Gs:
    // Normative expectations: ~ 28-36 trials in 45 seconds
    // Theta Gs centered at 0.0 with typical range [-2.5, +2.5]
    const netCorrectSpeed = correctTrials - (totalTrials - correctTrials);
    const thetaGs = Number(((netCorrectSpeed - 24) / 6.0).toFixed(2));
    const percentile = Math.round(
      Math.min(99.5, Math.max(0.5, (1 / (1 + Math.exp(-1.702 * thetaGs))) * 100))
    );

    const result: SymbolSpeedResult = {
      totalTrials,
      correctTrials,
      accuracyRate,
      meanDecisionTimeMs,
      meanMotorTapTimeMs,
      meanTotalLatencyMs,
      thetaGs,
      percentile
    };

    setTimeout(() => {
      completeSymbolMatch(result);
    }, 1200);
  };

  // Phase: Instructions
  if (phase === 'INSTRUCTIONS') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Etapa 2B • Velocidad Cognitiva
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Discriminación Rápida de Símbolos (Gs)
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Esta tarea evalúa tu velocidad de procesamiento perceptual y motora durante un intervalo activo de <strong>45 segundos</strong>.
          </p>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-6 space-y-3 text-xs text-slate-300">
            <p>1. Verás un <strong>símbolo objetivo</strong> en la parte superior.</p>
            <p>2. En la fila inferior aparecerá un grupo de <strong>4 símbolos</strong>.</p>
            <p>3. Responde lo más rápido y preciso que puedas si el símbolo objetivo está presente: pulsa <strong>SÍ</strong> o <strong>NO</strong>.</p>
          </div>

          <button
            onClick={() => setPhase('RUNNING')}
            className="w-full py-3.5 px-6 rounded-xl font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Comenzar Prueba de Velocidad (45s)</span>
          </button>
        </div>
      </div>
    );
  }

  // Phase: Finished
  if (phase === 'FINISHED') {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">¡Tiempo Concluido!</h3>
          <p className="text-xs text-slate-400">
            Procesando descomposición de latencias cronométricas submilisegundo...
          </p>
        </div>
      </div>
    );
  }

  // Phase: Running
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Timer Bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Ensayos resueltos: {currentTrialIdx}
          </span>
        </div>
        <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
          Tiempo: {timeLeft}s
        </div>
      </div>

      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 45) * 100}%` }}
        />
      </div>

      {/* Symbol Comparison Area */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl mb-6">
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
          Símbolo Objetivo:
        </span>
        <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-4xl text-amber-300 mb-8 shadow-inner">
          {currentTrialData.target}
        </div>

        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-3">
          ¿Aparece en este grupo?
        </span>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {currentTrialData.searchGroup.map((sym, idx) => (
            <div
              key={`search-${idx}`}
              className="w-14 h-14 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-2xl text-slate-100 shadow-sm"
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Pointerdown Touch Buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <button
            onPointerDown={() => handlePointerDown(true)}
            onPointerUp={() => handlePointerUp(true)}
            className="py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 select-none"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>SÍ</span>
          </button>

          <button
            onPointerDown={() => handlePointerDown(false)}
            onPointerUp={() => handlePointerUp(false)}
            className="py-4 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 select-none"
          >
            <X className="w-5 h-5 stroke-[3]" />
            <span>NO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

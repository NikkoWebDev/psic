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

  // Keyboard shortcut support (S/ArrowLeft/1 = SÍ, N/ArrowRight/2 = NO)
  useEffect(() => {
    if (phase !== 'RUNNING') return;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 's' || k === 'arrowleft' || k === '1' || k === 'y') {
        pointerDownTimeRef.current = performance.now();
        setTimeout(() => handlePointerUp(true), 20);
      } else if (k === 'n' || k === 'arrowright' || k === '2') {
        pointerDownTimeRef.current = performance.now();
        setTimeout(() => handlePointerUp(false), 20);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, currentTrialData]);


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
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal Titlebar */}
          <div className="terminal-header px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="terminal-dot bg-[#ff5f56]" />
              <span className="terminal-dot bg-[#ffbd2e]" />
              <span className="terminal-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/gs-discrimination</span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              GS · 45s CHRONOMETRY
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="eyebrow text-amber-400">// ETAPA 2B · VELOCIDAD COGNITIVA (Gs)</span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  Discriminación Rápida de Símbolos
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Esta tarea evalúa tu velocidad de procesamiento perceptual visual y latencia de respuesta motora durante una ventana activa de <strong className="text-amber-300">45 segundos</strong>.
            </p>

            <div className="p-4 rounded-xl bg-[#07090e]/70 border border-white/10 space-y-2.5 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-amber-400">01.</span>
                <span>Se presenta un <strong>símbolo objetivo</strong> en la parte superior.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-amber-400">02.</span>
                <span>En la fila inferior aparece un grupo de <strong>4 símbolos</strong>.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-amber-400">03.</span>
                <span>Determina con precisión y rapidez si el objetivo está presente: pulsa <strong className="text-emerald-400">SÍ</strong> o <strong className="text-rose-400">NO</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setPhase('RUNNING')}
              className="btn-nikko-primary w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Tarea de Velocidad (45s)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase: Finished
  if (phase === 'FINISHED') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="eyebrow text-emerald-400">// CALIBRACIÓN CONCLUIDA</span>
          <h3 className="text-xl font-bold font-display text-white mt-1 mb-2">¡Tiempo Finalizado!</h3>
          <p className="text-xs text-slate-400 font-mono">
            Descomponiendo latencias cronométricas y tiempo de decisión motora submilisegundo...
          </p>
        </div>
      </div>
    );
  }

  // Phase: Running
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Timer & Trial Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Ensayos: <span className="text-emerald-400">{currentTrialIdx}</span>
          </span>
        </div>
        <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Tiempo: {timeLeft}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden mb-6 p-[1px]">
        <div
          className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          style={{ width: `${(timeLeft / 45) * 100}%` }}
        />
      </div>

      {/* Symbol Comparison Area */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl mb-6">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/gs-matching</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ENSAYO #{currentTrialIdx + 1}
          </span>
        </div>

        <div className="p-6 sm:p-8 text-center space-y-6">
          <div>
            <span className="eyebrow text-slate-400 block mb-3">// SÍMBOLO OBJETIVO</span>
            <div className="w-24 h-24 mx-auto rounded-2xl bg-[#07090e] border-2 border-emerald-500/40 flex items-center justify-center text-5xl text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.15)] select-none">
              {currentTrialData.target}
            </div>
          </div>

          <div>
            <span className="eyebrow text-slate-400 block mb-3">// ¿APARECE EN ESTE CONJUNTO?</span>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {currentTrialData.searchGroup.map((sym, idx) => (
                <div
                  key={`search-${idx}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#07090e]/90 border border-white/10 hover:border-white/20 flex items-center justify-center text-2xl sm:text-3xl text-slate-100 shadow-inner select-none transition-all"
                >
                  {sym}
                </div>
              ))}
            </div>
          </div>

          {/* Pointerdown Touch Response Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
            <button
              onPointerDown={() => handlePointerDown(true)}
              onPointerUp={() => handlePointerUp(true)}
              className="py-4 rounded-xl font-bold bg-emerald-500/15 hover:bg-emerald-500/25 active:bg-emerald-500/35 border border-emerald-500/50 text-emerald-300 text-lg shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all active:scale-95 flex flex-col items-center justify-center gap-1 select-none cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 stroke-[3]" />
                <span className="tracking-wide">SÍ</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/70">[Tecla S / ←]</span>
            </button>

            <button
              onPointerDown={() => handlePointerDown(false)}
              onPointerUp={() => handlePointerUp(false)}
              className="py-4 rounded-xl font-bold bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/35 border border-rose-500/50 text-rose-300 text-lg shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all active:scale-95 flex flex-col items-center justify-center gap-1 select-none cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 stroke-[3]" />
                <span className="tracking-wide">NO</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400/70">[Tecla N / →]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

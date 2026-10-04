// Energy Checkpoint Component (Preventing ADHD / AACC Allostatic Overload)
// Allows user to either continue smoothly or safely pause session and resume later
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { BatteryCharging, ArrowRight, PauseCircle, Sparkles, CheckCircle2, BarChart3 } from 'lucide-react';
import { sound } from '../lib/audio/soundEngine';

export const EnergyCheckpoint: React.FC = () => {
  const { setStage, generatePartialReport } = useSession();
  const [isPausedView, setIsPausedView] = useState(false);
  const [isReCalibrating, setIsReCalibrating] = useState(false);
  const [reCalibrationSeconds, setReCalibrationSeconds] = useState(30);

  const handleContinueNow = () => {
    sound.playTransitionTone();
    setStage('STAGE_3_GC_VERBAL');
  };

  const handlePauseSession = () => {
    sound.playSoftClick();
    setIsPausedView(true);
  };


  const handleStartReCalibration = () => {
    setIsReCalibrating(true);
    let sec = 30;
    const interval = setInterval(() => {
      sec -= 1;
      setReCalibrationSeconds(sec);
      if (sec <= 0) {
        clearInterval(interval);
        setStage('STAGE_3_GC_VERBAL');
      }
    }, 1000);
  };

  if (isReCalibrating) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="terminal-header px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="terminal-dot bg-[#ff5f56]" />
              <span className="terminal-dot bg-[#ffbd2e]" />
              <span className="terminal-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/recalibration</span>
            </div>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              RE-SYNC
            </span>
          </div>

          <div className="p-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="eyebrow text-cyan-400">// RE-CALIBRACIÓN ATENCIONAL</span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 mb-2">
                Sintonización Sensorial
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
                Inhala con calma. Tu mente se está estabilizando para iniciar la evaluación de razonamiento verbal y fenotipo.
              </p>
            </div>

            <div className="text-5xl font-mono font-black text-cyan-400 tracking-tight py-2 shadow-inner">
              {reCalibrationSeconds}s
            </div>

            <button
              onClick={() => setStage('STAGE_3_GC_VERBAL')}
              className="text-xs font-mono text-slate-400 hover:text-emerald-400 underline transition-colors"
            >
              // Saltar re-calibración y continuar directamente →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isPausedView) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="terminal-header px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="terminal-dot bg-[#ff5f56]" />
              <span className="terminal-dot bg-[#ffbd2e]" />
              <span className="terminal-dot bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/checkpoint-saved</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SAVED
            </span>
          </div>

          <div className="p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <span className="eyebrow text-emerald-400">// ESTADO PERSISTIDO EN LOCALSTORAGE</span>
              <h2 className="text-xl font-bold font-display text-white mt-1 mb-2">
                Sesión Guardada con Éxito
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Todos tus reactivos y latencias de las Etapas 1 y 2 han quedado registrados. Puedes cerrar el navegador con total tranquilidad y volver cuando desees.
              </p>
            </div>

            <button
              onClick={handleStartReCalibration}
              className="btn-nikko-primary w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2"
            >
              <span>Reanudar Evaluación Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/metabolic-checkpoint</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
            50% COMPLETADO
          </span>
        </div>

        <div className="p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(52,211,153,0.15)]">
            <BatteryCharging className="w-8 h-8" />
          </div>

          <div>
            <span className="eyebrow text-emerald-400">// PUNTO DE CONTROL METABÓLICO</span>
            <h2 className="text-2xl font-bold font-display text-white mt-1 mb-3">
              ¿Cómo está tu nivel de energía cognitiva?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Has completado las dos pruebas de máximo esfuerzo de procesamiento: <strong>Razonamiento Matricial (Gf)</strong> y <strong>Competencia Ejecutiva (Gwm + Gs)</strong>.
              Para proteger la validez psicométrica y evitar fatiga alostática, puedes elegir entre continuar o pausar.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleContinueNow}
              className="btn-nikko-primary w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              <span>Continuar con la Etapa 3 (Razonamiento Verbal Gc)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePauseSession}
              className="w-full py-3.5 px-6 rounded-xl font-medium bg-[#07090e]/80 hover:bg-[#07090e] text-slate-300 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PauseCircle className="w-4 h-4 text-slate-400" />
              <span>Pausar sesión y continuar más tarde</span>
            </button>

            <button
              onClick={() => generatePartialReport('COGNITIVE_ONLY')}
              className="w-full py-3 px-6 rounded-xl font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 text-xs font-mono"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ver Análisis Parcial de CI Ahora (Gf + Gwm + Gs)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

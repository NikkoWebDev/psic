// Energy Checkpoint Component (Preventing ADHD / AACC Allostatic Overload)
// Allows user to either continue smoothly or safely pause session and resume later
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { BatteryCharging, Clock, ArrowRight, PauseCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const EnergyCheckpoint: React.FC = () => {
  const { setStage } = useSession();
  const [isPausedView, setIsPausedView] = useState(false);
  const [isReCalibrating, setIsReCalibrating] = useState(false);
  const [reCalibrationSeconds, setReCalibrationSeconds] = useState(30);

  const handleContinueNow = () => {
    setStage('STAGE_3_GC_VERBAL');
  };

  const handlePauseSession = () => {
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Re-calibración Atencional</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Inhala profundamente. Tu mente se está sintonizando nuevamente para la segunda mitad de la evaluación.
          </p>

          <div className="text-4xl font-mono font-black text-indigo-400 mb-6">
            {reCalibrationSeconds}s
          </div>

          <button
            onClick={() => setStage('STAGE_3_GC_VERBAL')}
            className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            Saltar re-calibración y continuar directamente
          </button>
        </div>
      </div>
    );
  }

  if (isPausedView) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Sesión Guardada con Éxito</h2>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            Todos tus reactivos y latencias de las Etapas 1 y 2 han quedado registrados en tu almacenamiento local.
            Puedes cerrar el navegador con total seguridad y volver cuando desees.
          </p>

          <button
            onClick={handleStartReCalibration}
            className="w-full py-3.5 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Reanudar Evaluación Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <BatteryCharging className="w-7 h-7" />
        </div>

        <span className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider">
          Punto de Chequeo Metabólico • 50% Completado
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1 mb-3">
          ¿Cómo está tu nivel de energía cognitiva?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Has completado las dos pruebas de máximo esfuerzo computacional: Razonamiento Matricial (Gf) y Competencia Ejecutiva (Gwm + Gs).
          Para proteger la validez psicométrica y evitar fatiga alostática en los cuestionarios de personalidad y neurodivergencia, puedes elegir entre continuar o tomar una pausa.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleContinueNow}
            className="w-full py-3.5 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <span>Continuar con la Etapa 3 (Razonamiento Verbal Gc)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handlePauseSession}
            className="w-full py-3.5 px-6 rounded-xl font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <PauseCircle className="w-4 h-4" />
            <span>Pausar sesión y continuar más tarde</span>
          </button>
        </div>
      </div>
    </div>
  );
};

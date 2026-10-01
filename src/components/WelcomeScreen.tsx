// Neuroaffirming Welcome & Onboarding Screen
import React from 'react';
import { useSession } from '../lib/state/testSessionContext';
import {
  Brain,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setStage } = useSession();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MOTOR PSICOMÉTRICO ADAPTATIVO & COGNITIVO</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          NEUROSYNAPSE
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Evaluación multidimensional de alta precisión basada en el modelo jerárquico CHC, Teoría de Respuesta al Ítem (3PL IRT) y Fenotipo Neurodivergente.
        </p>
      </div>

      {/* 4 Assessment Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm">
            <Brain className="w-5 h-5" />
            <span>1. Razonamiento Fluido Adaptativo (Gf)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Banco estratificado de 46 matrices procedimentales SVG (ICAR) administradas con selección de máxima Información de Fisher. Cero cronómetro visible.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sky-400 font-bold text-sm">
            <Layers className="w-5 h-5" />
            <span>2. Eficiencia Neuroejecutiva (Gwm + Gs)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operation Span complejo (O-Span) con ensayos de práctica guiados y prueba de discriminación de símbolos de velocidad con precisión submilisegundo.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm">
            <Zap className="w-5 h-5" />
            <span>3. Discrepancia Clínica 2e (IAG vs. IEC)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Criterio NAGC / Pearson para Doble Excepcionalidad (Altas Capacidades + TDAH). Certificación del potencial en el IAG ante dispersión de subescalas.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>4. Tríadas Forzadas (Thurstonian IRT)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            30 tríadas balanceadas sin deseabilidad social: Monotropismo (MQ), Barkley BDEFS, Camuflaje (CAT-Q), Sensorial Winnie Dunn y Personalidad CB5T.
          </p>
        </div>
      </div>

      {/* Neuroaffirming Safeguards Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Garantías de Diseño Neuroafirmativo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Pruebas de potencia pura:</strong> Sin temporizadores con cuenta regresiva estresante en matrices.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Accesibilidad visual:</strong> Modo Sepia Anti-Irlen y tipografía OpenDyslexic con un solo clic.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Punto de chequeo:</strong> Opción de pausar a la mitad y reanudar cuando recuperes energía.</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => setStage('STAGE_1_GF_MATRICES')}
          className="w-full sm:w-auto min-w-[320px] py-4 px-8 rounded-2xl font-bold text-base bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 mx-auto transform active:scale-95 cursor-pointer"
        >
          <span>Iniciar Evaluación Adaptativa</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <span className="text-[11px] text-slate-500 block mt-2.5">
          Duración estimada: 25 - 35 minutos • Autoguardado local activo
        </span>
      </div>
    </div>
  );
};

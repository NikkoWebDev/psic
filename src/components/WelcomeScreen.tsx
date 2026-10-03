// Neuroaffirming Welcome & Onboarding Screen with nikko.dev Aesthetics
import React from 'react';
import { useSession } from '../lib/state/testSessionContext';
import {
  Brain,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Layers,
  Terminal,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setStage } = useSession();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-14 space-y-12">
      {/* Hero Section */}
      <section className="relative text-center sm:text-left pt-2 pb-6">
        {/* Ghost background watermark text (signature nikko.dev) */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 text-7xl sm:text-9xl font-black font-display tracking-tighter text-white/[0.02] select-none pointer-events-none"
          aria-hidden="true"
        >
          NEURO
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Line Pill (nikko.dev signature) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
              <span className="pulse-dot"></span>
              <span className="text-slate-300">psic.nikko.dev</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">$ neurosynapse --cat-3pl</span>
            </div>

            <div className="space-y-3">
              <div className="eyebrow">// motor psicométrico adaptativo</div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.08]">
                Medición cognitiva sin sesgos.{' '}
                <span className="gradient-green-cyan block mt-1">
                  En producción, no en tests de revista.
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              NEUROSYNAPSE es un motor computarizado adaptativo (CAT) de grado clínico diseñado para evaluar Altas Capacidades (AACC), TDAH y Doble Excepcionalidad (2e). Integra IRT 3PL, O-Span complejo, y 30 tríadas Thurstonianas libres de deseabilidad social.
            </p>

            {/* CTA & Quick Links */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => setStage('STAGE_1_GF_MATRICES')}
                className="btn-nikko-primary px-8 py-4 text-sm uppercase tracking-wider font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Comenzar Evaluación Adaptativa</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href="#especificaciones"
                className="px-6 py-4 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/25 bg-white/5 transition-all text-center"
              >
                Ver especificaciones ↓
              </a>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>25–35 min aprox</span>
              <span className="text-slate-600">·</span>
              <span>Autoguardado IndexedDB</span>
              <span className="text-slate-600">·</span>
              <span>Cero cronómetros estresantes</span>
            </div>
          </div>

          {/* Hero Right: nikko.dev OS Terminal */}
          <div className="lg:col-span-5">
            <div className="os-terminal">
              {/* Terminal Titlebar with macOS dots */}
              <div className="os-titlebar justify-between">
                <div className="flex items-center gap-3">
                  <div className="os-dots">
                    <span className="os-dot os-dot-red"></span>
                    <span className="os-dot os-dot-yellow"></span>
                    <span className="os-dot os-dot-green"></span>
                  </div>
                  <span className="text-slate-300 font-medium">psic@nikko.dev: ~/engine</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="pulse-dot"></span>
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-4 sm:p-5 font-mono text-xs space-y-3 bg-black/40">
                <div className="text-[10px] text-slate-500 tracking-wider">SYSTEM STATUS · CHC BATTERIES</div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Gf · Matrices Procedimentales
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">46 ÍTEMS</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Gwm · Complex O-Span
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">WARM-UP + 5R</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Gs · Symbol Discrimination
                    </span>
                    <span className="text-sky-400 font-bold text-[11px]">SUB-MS TELEMETRY</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Discrepancia 2e
                    </span>
                    <span className="text-purple-400 font-bold text-[11px]">NAGC / PEARSON</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Thurstonian IRT
                    </span>
                    <span className="text-amber-400 font-bold text-[11px]">30 TRÍADAS BIBD</span>
                  </div>
                </div>

                {/* Code snippet inside terminal */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
                  <div><span className="text-emerald-400">const</span> engine = <span className="text-sky-300">"WebWorker · 61 Nodes"</span>;</div>
                  <div><span className="text-emerald-400">const</span> cutoff2e = <span className="text-amber-300">"Δ ≥ 23 pts (1.5 SD)"</span>;</div>
                </div>
              </div>

              {/* Terminal Footer Metrics */}
              <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/10 bg-white/[0.02] text-center py-2.5 text-xs font-mono">
                <div>
                  <div className="text-white font-bold text-sm">46</div>
                  <div className="text-[10px] text-slate-400">Matrices</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-bold text-sm">30</div>
                  <div className="text-[10px] text-slate-400">Tríadas</div>
                </div>
                <div>
                  <div className="text-sky-400 font-bold text-sm">0.25</div>
                  <div className="text-[10px] text-slate-400">SEM Target</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section id="especificaciones" className="space-y-6 pt-4">
        <div className="space-y-1">
          <div className="eyebrow">// estructura psicométrica</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Diseñado para capturar perfiles asimétricos con rigor matemático.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 sm:p-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <span className="nikko-tag">CAT IRT 3PL</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              1. Razonamiento Fluido Adaptativo (Gf)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              46 matrices procedimentales SVG estructuradas bajo la taxonomía ICAR (progresión, rotación, booleanas XOR/AND y permutación topológica). El algoritmo selecciona en tiempo real el reactivo que maximiza la Información de Fisher. Cero cronómetro visible para prevenir el bloqueo por ansiedad.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 sm:p-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="nikko-tag">Gwm + Gs</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              2. Eficiencia Neuroejecutiva
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Operation Span complejo (O-Span) con 2 ensayos guiados de práctica para evitar fallos por impulsividad de inicio, seguido de 5 rondas de carga progresiva. La tarea de discriminación de símbolos de 45 segundos registra eventos <code className="text-emerald-300">pointerdown</code> para aislar tiempo mental de tiempo motor.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 sm:p-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <span className="nikko-tag">NAGC / PEARSON</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              3. Discrepancia Clínica 2e (IAG vs. IEC)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Implementa la fórmula formal de varianza compuesta con divisor <code className="text-emerald-300">√(2 + 2r)</code>. Si la discrepancia entre el potencial intelectual (IAG) y la eficiencia ejecutiva (IEC) supera 1.5 DE (≥ 23 puntos), el CI Total queda formalmente invalidado y se certifica la capacidad real en el IAG.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 sm:p-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="nikko-tag">THURSTONIAN IRT</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              4. Tríadas Forzadas (Fenotipo & Personalidad)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              30 tríadas en dos bloques de 15 reactivos: Bloque 4A (Personalidad Cibernética CB5T, Honestidad-Humildad HEXACO y Racionalidad CART) y Bloque 4B (Monotropismo MQ, Barkley BDEFS, Camuflaje CAT-Q, Sensorial Dunn y Dabrowski). Selección forzada que anula el sesgo de deseabilidad social.
            </p>
          </div>
        </div>
      </section>

      {/* Neuroaffirming Safeguards */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold font-display text-white">
            Garantías de Diseño Neuroafirmativo
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pruebas de Potencia Pura</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sin relojes con cuenta regresiva en resolución matricial. Se evalúa capacidad analítica profunda, no velocidad grafomotora.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Filtro Anti-Irlen / Sepia</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Disponibilidad de modo Cálido Sepia para evitar estrés visual y tipografía OpenDyslexic accesible con un clic.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Energy Checkpoint</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Punto de chequeo al 50%: puedes pausar y continuar mañana con re-calibración de 30 segundos sin penalización.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4 pb-2">
        <button
          onClick={() => setStage('STAGE_1_GF_MATRICES')}
          className="btn-nikko-primary min-w-[280px] sm:min-w-[340px] py-4 px-8 text-base font-bold shadow-2xl shadow-emerald-500/25 cursor-pointer"
        >
          <span>Iniciar Evaluación Adaptativa</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div className="text-xs font-mono text-slate-500 mt-3">
          psic.nikko.dev · Desarrollado por NikkoDev
        </div>
      </div>
    </div>
  );
};

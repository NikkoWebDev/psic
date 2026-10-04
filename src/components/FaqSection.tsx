// Clinical & Psychometric FAQ Section for NEUROSYNAPSE (Awwwards / nikko.dev Aesthetics)
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Brain, ShieldAlert } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  category: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'DOBLE EXCEPCIONALIDAD (2E)',
    question: '¿Por qué un test de CI convencional suele ocultar las Altas Capacidades en personas con TDAH?',
    answer: 'En perfiles 2e, coexiste un potencial cognitivo elevado en deducción abstracta (Gf) y razonamiento verbal (Gc) junto a déficits en memoria de trabajo operativa (Gwm) o velocidad de procesamiento grafomotora (Gs). Cuando un test tradicional promedia estas áreas para arrojar un "CI Total (CIT / FSIQ)", la asimetría colapsa el puntaje hacia la media (~100-115), ocultando la genialidad latente. Siguiendo el protocolo oficial de Pearson y la NAGC, cuando la discrepancia entre el IAG y el IEC supera 1.5 Desviaciones Estándar (≥ 23 puntos), el CI Total queda formalmente invalidado y se certifica la capacidad real en el IAG.'
  },
  {
    id: 'faq-2',
    category: 'ALGORITMO ADAPTATIVO (CAT)',
    question: '¿En qué se diferencia el algoritmo CAT 3PL de un cuestionario de preguntas estáticas?',
    answer: 'Los tests estáticos presentan las mismas preguntas a todos los participantes, lo que genera aburrimiento en reactivos fáciles y frustración o abandono en difíciles. NEUROSYNAPSE ejecuta un Web Worker en segundo plano que calcula en tiempo real tu habilidad latente (θ) mediante aproximación Bayesiana EAP con cuadratura de Gauss-Hermite de 61 nodos. En cada paso, el algoritmo busca y administra el ítem de nuestro banco de 46 matrices procedimentales SVG que maximiza la Función de Información de Fisher en tu nivel exacto de habilidad, alcanzando un error estándar de medición (SEM) clínico en menos de 20 reactivos.'
  },
  {
    id: 'faq-3',
    category: 'FENOTIPO & TRÍADAS',
    question: '¿Por qué se utilizan Tríadas Forzadas (Thurstonianas) en vez de escalas Likert tradicionales?',
    answer: 'Las escalas de tipo "Del 1 al 5" son altamente susceptibles a sesgos de respuesta, efecto de aquiescencia, deseabilidad social y camuflaje (masking). Las 30 tríadas forzadas te obligan a elegir entre tres enunciados cuál es MÁS afín y cuál es MENOS afín. Mediante el modelo Thurstoniano de Ley de Juicio Comparativo, se extrae el vector de utilidad latente sin que el usuario pueda "adivinar" cuál es la respuesta socialmente esperada.'
  },
  {
    id: 'faq-4',
    category: 'NEURODIVERGENCIA & ATENCIÓN',
    question: '¿Qué es el Monotropismo (MQ) y cómo se interpreta en el perfil?',
    answer: 'El monotropismo es una de las teorías contemporáneas más sólidas para explicar el funcionamiento cognitivo autista y TDAH (Murray, Lesser & Lawson). Describe cómo el cerebro destina sus recursos de atención en "túneles de flujo profundo" altamente focalizados en lugar de distribuir la atención ampliamente (politropismo). El puntaje MQ mide tu tendencia natural hacia este estilo cognitivo de hiperfoco.'
  },
  {
    id: 'faq-5',
    category: 'TIEMPO & CONFORT',
    question: '¿Tengo que completar las 4 etapas seguidas?',
    answer: 'No. NEUROSYNAPSE está diseñado desde una perspectiva neuroafirmativa para prevenir la sobrecarga alostática y la fatiga ejecutiva. Puedes seleccionar realizar únicamente el módulo de "Solo Inteligencia Cognitiva (CI / CHC)" (~15 min), "Solo Fenotipo & Personalidad" (~10 min) o pausar la evaluación en el Energy Checkpoint al 50% y retomarla cuando desees, ya que el estado se guarda automáticamente en tu navegador (IndexedDB).'
  },
  {
    id: 'faq-6',
    category: 'INTEGRACIÓN GEMINI SPARK',
    question: '¿Cómo funciona la integración y exportación del perfil a Gemini Spark?',
    answer: 'Al finalizar cualquier módulo, el motor compila un payload estructurado en XML enriquecido (<gemini_cognitive_profile_v1>) que incluye todos tus thetas latentes, índices compuestos, percentiles, clasificación clínica 2e y diagnóstico COM-B. Al copiar este reporte y pegarlo en tu chat con Gemini Spark, la IA actúa como tu neuropsicólogo computacional personalizado, ofreciéndote estrategias de andamiaje a la medida de tu perfil asimétrico.'
  }
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="space-y-6 pt-4">
      <div className="space-y-1">
        <div className="eyebrow text-emerald-400">// RIGOR CIENTÍFICO & METODOLOGÍA</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Preguntas Frecuentes sobre el Motor Psicométrico
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-sans">
          Respuestas técnicas y clínicas basadas en los manuales diagnósticos de CHC, NAGC, Barkley y los estándares de medición por teoría de respuesta al ítem (IRT).
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map(item => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 border ${
                isOpen ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                    // {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold font-display text-white pr-2">
                    {item.question}
                  </h3>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isOpen
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#07090e] border-white/10 text-slate-400'
                  }`}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-white/5 space-y-3">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

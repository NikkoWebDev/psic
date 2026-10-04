// Interactive Clinical Dashboard & Gemini Spark Handshake Exporter
import React, { useState, useEffect } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Download,
  AlertTriangle,
  ShieldCheck,
  Brain,
  Zap,
  Sparkles,
  Compass,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Printer,
  Activity
} from 'lucide-react';
import { sound } from '../lib/audio/soundEngine';

export const Dashboard: React.FC = () => {
  const { fullReport, restartSession, setStage, setSelectedModuleMode } = useSession();
  const [copied, setCopied] = useState(false);
  const [showRawXml, setShowRawXml] = useState(false);
  const [showBase64, setShowBase64] = useState(false);

  useEffect(() => {
    // Neuroaffirming celebration burst
    try {
      sound.playSuccessChime();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#34d399', '#a855f7']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!fullReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-400">
        No se ha generado el reporte aún.
      </div>
    );
  }

  const { metadata, cognitiveIntelligenceCHC: chc, personalityAndPhenotype: pheno, xmlPayload, compactTokenBase64 } = fullReport;
  const scope = metadata.evaluationScope || 'FULL';
  const isCognitiveOnly = scope === 'COGNITIVE_ONLY';
  const isPhenotypeOnly = scope === 'PHENOTYPE_ONLY';
  const isPartial = scope === 'PARTIAL';

  const handleCopyClipboard = async () => {
    try {
      sound.playSuccessChime();
      const fullTextToCopy = `${xmlPayload}\n\n<!-- COMPACT_DATA_TOKEN_BASE64: ${compactTokenBase64} -->`;
      await navigator.clipboard.writeText(fullTextToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  const handleDownloadXml = () => {
    const fullText = `${xmlPayload}\n\n<!-- COMPACT_DATA_TOKEN_BASE64: ${compactTokenBase64} -->`;
    const blob = new Blob([fullText], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gemini_cognitive_profile_${new Date().toISOString().slice(0, 10)}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Call-to-Action for Gemini Spark Handshake */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/cognitive-profile</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">
              {isCognitiveOnly
                ? 'INFORME PARCIAL: INTELIGENCIA COGNITIVA (CI / CHC)'
                : isPhenotypeOnly
                ? 'INFORME PARCIAL: FENOTIPO NEURODIVERGENTE'
                : isPartial
                ? 'INFORME PARCIAL EN PROCESO'
                : `EVALUACIÓN INTEGRAL CONCLUIDA · ${metadata.appVersion}`}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="eyebrow text-emerald-400">
              {isCognitiveOnly
                ? '// MÓDULO 1 · PSICOMETRÍA COGNITIVA CHC'
                : isPhenotypeOnly
                ? '// MÓDULO 2 · FENOTIPO NEURODIVERGENTE'
                : '// PERFIL DE ALTO RENDIMIENTO NEURODIVERGENTE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              {isCognitiveOnly
                ? 'Perfil de Inteligencia Cognitiva (IAG vs. IEC)'
                : isPhenotypeOnly
                ? 'Perfil de Fenotipo Neurodivergente & Personalidad'
                : 'Perfil Neurocognitivo & Fenotipo Conductual'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isCognitiveOnly
                ? 'Resultados calibrados de Razonamiento Fluido, Memoria de Trabajo, Velocidad y Discrepancia 2e. Listo para sincronización con Gemini Spark.'
                : isPhenotypeOnly
                ? 'Resultados calibrados de Monotropismo, Escalas Barkley BDEFS, Camuflaje CAT-Q, Sensorial Dunn y Dabrowski. Listo para Gemini Spark.'
                : 'Tu evaluación ha sido calibrada mediante CAT IRT 3PL, O-Span motor y Tríadas Thurstonianas. Listo para sincronización nativa con Gemini Spark.'}
            </p>
          </div>

          {/* Prominent Action Button: 📋 Copiar Reporte para Asesoría Gemini */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopyClipboard}
              className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all transform active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                  : 'btn-nikko-primary text-white cursor-pointer'
              }`}
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? '¡Reporte Copiado al Portapapeles!' : '📋 Copiar Reporte para Asesoría Gemini'}</span>
            </button>

            <button
              onClick={() => {
                sound.playSoftClick();
                window.print();
              }}
              className="py-3 px-4 rounded-xl font-mono text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Imprimir informe clínico o guardar como PDF"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleDownloadXml}
              className="py-3 px-4 rounded-xl font-mono text-xs bg-[#07090e]/80 hover:bg-[#07090e] text-slate-300 border border-white/10 hover:border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Descargar archivo XML"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>XML</span>
            </button>
          </div>
        </div>

        {/* Copy instruction helper */}
        {copied && (
          <div className="mx-6 sm:mx-8 mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Copia generada con éxito. Pégala directamente en tu chat con Gemini Spark para recibir tu plan de optimización conductual y andamiaje personalizado.
            </span>
          </div>
        )}
      </div>

      {/* Partial Evaluation Callout: Invitation to Complete Next Module */}
      {isCognitiveOnly && (
        <div className="glass-card rounded-2xl p-6 sm:p-7 border-purple-500/30 bg-purple-500/[0.04] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="eyebrow text-purple-400">// MÓDULO 2 PENDIENTE · FENOTIPO NEURODIVERGENTE</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              ¿Deseas completar la evaluación con el perfil de Fenotipo y Personalidad?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-sans">
              Has obtenido tu perfil de Inteligencia Cognitiva (IAG vs. IEC). Ahora puedes responder las 30 tríadas forzadas para calibrar tu Monotropismo (MQ), Escalas Barkley (BDEFS), Camuflaje (CAT-Q) y Sensorial Dunn sin sesgos.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedModuleMode('FULL');
              setStage('STAGE_4A_TRIADS_PERSONALITY');
            }}
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
          >
            <span>Evaluar Fenotipo (Bloque 4A)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {isPhenotypeOnly && (
        <div className="glass-card rounded-2xl p-6 sm:p-7 border-cyan-500/30 bg-cyan-500/[0.04] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="eyebrow text-cyan-400">// MÓDULO 1 PENDIENTE · PSICOMETRÍA COGNITIVA (CI / CHC)</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              ¿Deseas complementar tu perfil evaluando tu Inteligencia Cognitiva?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-sans">
              Has obtenido tu diagnóstico de Fenotipo y Personalidad. Puedes realizar las pruebas computarizadas adaptativas (CAT IRT 3PL) para medir tu Razonamiento Fluido (Gf), Memoria de Trabajo (Gwm), Velocidad (Gs) y Discrepancia 2e.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedModuleMode('FULL');
              setStage('STAGE_1_GF_MATRICES');
            }}
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <span>Evaluar CI (Matrices Gf)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* SECTION 1: 2e CLINICAL DISCREPANCY & ABILITY GAUGES */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/2e-discrepancy-analysis</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            NAGC / PEARSON CRITERIA
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="eyebrow text-cyan-400">// DOBLE EXCEPCIONALIDAD (2E)</span>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  Capacidad General (IAG) vs. Eficiencia Ejecutiva (IEC)
                </h2>
              </div>
            </div>

            {/* Clinical Flag Badge */}
            <div className="self-start sm:self-auto">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                  chc.clinicalSyndromeFlag === '2E_AACC_ADHD'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {chc.clinicalSyndromeFlag === '2E_AACC_ADHD' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                {chc.clinicalSyndromeFlag}
              </span>
            </div>
          </div>

          {/* Unadministered Cognitive Battery Notice */}
          {isPhenotypeOnly && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <span>
                <strong>Módulo cognitivo no evaluado en esta sesión:</strong> Las estimaciones mostradas abajo corresponden a los valores basales predeterminados. Para obtener tus puntuaciones reales de CI, IAG, IEC y Discrepancia 2e, inicia el Módulo 1.
              </span>
              <button
                onClick={() => {
                  setSelectedModuleMode('FULL');
                  setStage('STAGE_1_GF_MATRICES');
                }}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold cursor-pointer"
              >
                Iniciar Módulo CI →
              </button>
            </div>
          )}

          {/* Clinical Narrative Banner */}
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              !chc.isFsiqValid
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="font-bold flex items-center gap-2 mb-1">
              {!chc.isFsiqValid ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="font-mono text-xs">// INVALIDEZ FORMAL DEL CI TOTAL (CIT / FSIQ):</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs">// CI TOTAL VÁLIDO Y ARMÓNICO:</span>
                </>
              )}
            </div>
            <p className="font-sans">{chc.discrepancyNarrative}</p>
          </div>

          {/* Comparative Dual Gauges: IAG vs. IEC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IAG Card */}
            <div className="p-6 rounded-2xl bg-[#07090e]/90 border border-white/10 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-emerald-400">
                  Índice de Capacidad General (IAG / GAI)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Gf + Gc
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black font-mono text-white tracking-tight">
                  {chc.gai.score}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ± {chc.gai.sem} SEM • IC95%: [{chc.gai.ci95[0]} - {chc.gai.ci95[1]}]
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">{chc.gai.classification}</span>
                  <span className="font-bold font-mono text-emerald-400">Percentil {chc.gai.percentile}%</span>
                </div>
                <div className="w-full bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ width: `${Math.min(100, Math.max(10, ((chc.gai.score - 70) / 75) * 100))}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Refleja el potencial latente de deducción abstracta y razonamiento verbal conceptual, sin penalización por velocidad motora o capacidad de memoria de trabajo inmediata.
              </p>
            </div>

            {/* IEC Card */}
            <div className="p-6 rounded-2xl bg-[#07090e]/90 border border-white/10 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-amber-400">
                  Índice de Eficiencia Cognitiva (IEC / CPI)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Gwm + Gs
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black font-mono text-white tracking-tight">
                  {chc.cpi.score}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ± {chc.cpi.sem} SEM • IC95%: [{chc.cpi.ci95[0]} - {chc.cpi.ci95[1]}]
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">{chc.cpi.classification}</span>
                  <span className="font-bold font-mono text-amber-400">Percentil {chc.cpi.percentile}%</span>
                </div>
                <div className="w-full bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-400 h-full rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    style={{ width: `${Math.min(100, Math.max(10, ((chc.cpi.score - 70) / 75) * 100))}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Refleja la disponibilidad de memoria de trabajo operativa (O-Span) y velocidad de respuesta motora visual bajo demandas cronometradas.
              </p>
            </div>
          </div>

          {/* Statistical Rigor Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-3.5 rounded-xl bg-[#07090e]/70 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">// DISCREPANCIA (Δ):</span>
              <span className="text-base font-bold font-mono text-cyan-300">{chc.discrepancyDelta} pts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#07090e]/70 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">// SEM DIFERENCIA:</span>
              <span className="text-base font-bold font-mono text-slate-200">± {chc.semDiff} pts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#07090e]/70 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">// TASA BASE POBLACIONAL:</span>
              <span className="text-xs font-bold text-amber-300">{chc.populationBaseRate}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#07090e]/70 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">// POTENCIAL CERTIFICADO:</span>
              <span className="text-base font-bold font-mono text-emerald-400">CI {chc.certifiedIntelligencePotential}</span>
            </div>
          </div>

          {/* Ex-Gaussian Chronometric Breakdown (Gs) */}
          {chc.exGaussian && (
            <div className="mt-4 p-4 rounded-xl bg-[#07090e]/80 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Cronometría Mental Ex-Gaussiana (Gs / Lapsos TDAH)
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                  chc.exGaussian.clinicalMarker === 'ELEVATED_ATTENTIONAL_LAPSES'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : chc.exGaussian.clinicalMarker === 'MILD_VARIABILITY'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {chc.exGaussian.clinicalMarker === 'ELEVATED_ATTENTIONAL_LAPSES'
                    ? 'Cola Exponencial Elevada (Firma TDAH)'
                    : chc.exGaussian.clinicalMarker === 'MILD_VARIABILITY'
                    ? 'Variabilidad Moderada'
                    : 'Estabilidad Típica'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 block">// μ VELOCIDAD PURA:</span>
                  <span className="text-sm font-bold font-mono text-white">{chc.exGaussian.mu} ms</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Componente motor</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 block">// σ DISPERSIÓN:</span>
                  <span className="text-sm font-bold font-mono text-white">±{chc.exGaussian.sigma} ms</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Ruido sensorial</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 block">// τ COLA EXPONENCIAL:</span>
                  <span className={`text-sm font-bold font-mono ${
                    chc.exGaussian.tau >= 280 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{chc.exGaussian.tau} ms</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Lapsos ejecutivos</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {chc.exGaussian.clinicalMarker === 'ELEVATED_ATTENTIONAL_LAPSES'
                  ? `Se detectaron micro-lapsos periódicos de inhibición atencional (τ = ${chc.exGaussian.tau}ms, ratio de lapse ${(chc.exGaussian.lapseRatio * 100).toFixed(0)}%). La velocidad visuomotora pura (μ = ${chc.exGaussian.mu}ms) opera normalmente, pero la asimetría positiva en la cola de latencias es un biomarcador cognitivo de modulación dopaminérgica típica del TDAH.`
                  : `Cronometría atencional dentro de parámetros estables (τ = ${chc.exGaussian.tau}ms, sesgo = ${chc.exGaussian.skewness}). No se observa un alargamiento patológico de la cola de tiempos de respuesta.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: RADAR & BROAD ABILITIES CHC PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHC Latent Thetas with SVG Radar */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm uppercase font-mono">
                Habilidades Cognitivas CHC (θ Latente)
              </h3>
            </div>
            <span className="nikko-tag">RADAR CHC</span>
          </div>

          {/* SVG Polygonal Radar Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            <div className="relative w-48 h-48 shrink-0">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Background Concentric Grid Diamonds */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
                  const r = level * 65;
                  return (
                    <polygon
                      key={`grid-${i}`}
                      points={`100,${100 - r} ${100 + r},100 100,${100 + r} ${100 - r},100`}
                      fill={level === 0.5 ? 'rgba(52, 211, 153, 0.03)' : 'none'}
                      stroke={level === 0.5 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={level === 0.5 ? '1.5' : '1'}
                      strokeDasharray={level === 0.5 ? '3 3' : 'none'}
                    />
                  );
                })}

                {/* Axes lines */}
                <line x1="100" y1="35" x2="100" y2="165" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <line x1="35" y1="100" x2="165" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                {/* Axis Labels */}
                <text x="100" y="26" textAnchor="middle" className="text-[9px] font-mono fill-emerald-400 font-bold">Gf (Fluido)</text>
                <text x="175" y="103" textAnchor="start" className="text-[9px] font-mono fill-purple-400 font-bold">Gc (Verbal)</text>
                <text x="100" y="180" textAnchor="middle" className="text-[9px] font-mono fill-amber-400 font-bold">Gs (Velocidad)</text>
                <text x="25" y="103" textAnchor="end" className="text-[9px] font-mono fill-cyan-400 font-bold">Gwm (Memoria)</text>

                {/* Population Mean Reference (0 DE) */}
                <circle cx="100" cy="100" r="1.5" fill="rgba(255,255,255,0.5)" />

                {/* User's Computed Ability Polygon */}
                {(() => {
                  const norm = (th: number) => Math.min(1, Math.max(0.12, (th + 2.5) / 5));
                  const rGf = norm(chc.broadAbilitiesTheta.gf) * 65;
                  const rGc = norm(chc.broadAbilitiesTheta.gc) * 65;
                  const rGs = norm(chc.broadAbilitiesTheta.gs) * 65;
                  const rGwm = norm(chc.broadAbilitiesTheta.gwm) * 65;
                  const pts = `100,${100 - rGf} ${100 + rGc},100 100,${100 + rGs} ${100 - rGwm},100`;

                  return (
                    <g>
                      <polygon
                        points={pts}
                        fill="rgba(52, 211, 153, 0.25)"
                        stroke="#34d399"
                        strokeWidth="2"
                        className="transition-all duration-700"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.4))' }}
                      />
                      {/* Vertex Dots */}
                      <circle cx="100" cy={100 - rGf} r="3.5" fill="#34d399" />
                      <circle cx={100 + rGc} cy="100" r="3.5" fill="#c084fc" />
                      <circle cx="100" cy={100 + rGs} r="3.5" fill="#fbbf24" />
                      <circle cx={100 - rGwm} cy="100" r="3.5" fill="#38bdf8" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {[
                { name: 'Razonamiento Fluido (Gf)', theta: chc.broadAbilitiesTheta.gf, color: 'bg-emerald-400', label: 'CAT 3PL' },
                { name: 'Comprensión Cristalizada (Gc)', theta: chc.broadAbilitiesTheta.gc, color: 'bg-purple-400', label: 'Relacional' },
                { name: 'Memoria de Trabajo (Gwm)', theta: chc.broadAbilitiesTheta.gwm, color: 'bg-cyan-400', label: 'O-Span' },
                { name: 'Velocidad de Procesamiento (Gs)', theta: chc.broadAbilitiesTheta.gs, color: 'bg-amber-400', label: 'Sub-ms' }
              ].map(item => (
                <div key={item.name} className="p-2.5 rounded-xl bg-[#07090e]/80 border border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium text-[11px]">{item.name}</span>
                    <span className="font-mono font-bold text-white text-[11px]">
                      {item.theta >= 0 ? `+${item.theta}` : item.theta} DE
                    </span>
                  </div>
                  <div className="w-full bg-[#0d111a] border border-white/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(5, ((item.theta + 3) / 6) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monotropism & Sensory Dunn Profile */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm uppercase font-mono">
              Fenotipo Neurodivergente & Monotropismo
            </h3>
          </div>

          {isCognitiveOnly && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <span>
                <strong>Módulo de fenotipo no administrado:</strong> Las métricas mostradas son neutras basales. Responde las 30 tríadas para calibrar tu Monotropismo y Perfil Sensorial.
              </span>
              <button
                onClick={() => {
                  setSelectedModuleMode('FULL');
                  setStage('STAGE_4A_TRIADS_PERSONALITY');
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold cursor-pointer"
              >
                Completar Tríadas →
              </button>
            </div>
          )}

          <div className="space-y-3 text-xs">
            {/* Monotropism Empirical Distribution Curve (Garau et al. 2023) */}
            <div className="p-3.5 rounded-xl bg-[#07090e]/80 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">// MONOTROPISMO (MQ):</span>
                  <span className="font-bold text-slate-200">
                    {pheno.monotropismProfile === 'DEEP_TUNNEL' ? 'Túnel Profundo de Foco' : 'Atención Distribuida'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-emerald-400">{pheno.monotropismMQScore} / 100</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {pheno.monotropismMQScore >= 80 ? 'Perfil Autista / AuDHD' : pheno.monotropismMQScore >= 68 ? 'Perfil TDAH / Solapamiento' : 'Perfil Basal Normotípico'}
                  </span>
                </div>
              </div>

              {/* Empirical Density SVG */}
              <div className="relative pt-1 pb-1">
                <svg viewBox="0 0 380 95" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="gradAutistic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="gradNT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#64748b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#64748b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal baseline */}
                  <line x1="10" y1="75" x2="370" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Tick labels */}
                  <text x="10" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">20</text>
                  <text x="100" y="88" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">40</text>
                  <text x="190" y="88" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">60</text>
                  <text x="280" y="88" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">80</text>
                  <text x="370" y="88" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">100</text>

                  {/* Neurotypical Gaussian Curve: Mean 59.5, SD 11.5 */}
                  {(() => {
                    const pointsNT: string[] = [];
                    const pointsAut: string[] = [];
                    for (let x = 20; x <= 100; x += 2) {
                      const svgX = ((x - 20) / 80) * 360 + 10;
                      // NT
                      const zNT = (x - 59.5) / 11.5;
                      const yNT = 75 - Math.exp(-0.5 * zNT * zNT) * 45;
                      pointsNT.push(`${svgX.toFixed(1)},${yNT.toFixed(1)}`);
                      // Autistic / AuDHD: Mean 81.0, SD 9.8
                      const zAut = (x - 81.0) / 9.8;
                      const yAut = 75 - Math.exp(-0.5 * zAut * zAut) * 55;
                      pointsAut.push(`${svgX.toFixed(1)},${yAut.toFixed(1)}`);
                    }

                    const pathNT = `M 10,75 L ${pointsNT.join(' L ')} L 370,75 Z`;
                    const lineNT = `M ${pointsNT.join(' L ')}`;
                    const pathAut = `M 10,75 L ${pointsAut.join(' L ')} L 370,75 Z`;
                    const lineAut = `M ${pointsAut.join(' L ')}`;

                    const userX = Math.min(370, Math.max(10, ((pheno.monotropismMQScore - 20) / 80) * 360 + 10));

                    return (
                      <g>
                        {/* NT Area and Line */}
                        <path d={pathNT} fill="url(#gradNT)" />
                        <path d={lineNT} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />

                        {/* Autistic Area and Line */}
                        <path d={pathAut} fill="url(#gradAutistic)" />
                        <path d={lineAut} fill="none" stroke="#34d399" strokeWidth="2" />

                        {/* User Indicator */}
                        <line x1={userX} y1="12" x2={userX} y2="75" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2,2" />
                        <circle cx={userX} cy="14" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.8))' }} />
                        <text
                          x={userX > 320 ? userX - 6 : userX < 50 ? userX + 6 : userX}
                          y="6"
                          fill="#38bdf8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor={userX > 320 ? 'end' : userX < 50 ? 'start' : 'middle'}
                        >
                          Tú ({pheno.monotropismMQScore})
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Distribution Legend & Study Citation */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-slate-500 inline-block border-t border-dashed" /> NT (μ: 59.5)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Autista / AuDHD (μ: 81.0)
                  </span>
                </div>
                <span className="text-slate-500 text-[9px]">Baremos Garau et al. (2023)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">// CAMUFLAJE SOCIAL (CAT-Q):</span>
                <span className="font-bold text-slate-200">Riesgo de Burnout: {pheno.maskingBurnoutRisk}</span>
              </div>
              <span className="text-lg font-mono font-bold text-purple-400">{pheno.catQScore} / 100</span>
            </div>

            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">// CUADRANTE SENSORIAL DE DUNN:</span>
                <span className="font-bold text-slate-200">{pheno.dunnQuadrant}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Umbral {pheno.dunnThreshold}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BARKLEY EXECUTIVE SCALES & DABROWSKI OVEREXCITABILITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Barkley BDEFS */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-3">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400">
            Escalas Ejecutivas Barkley (BDEFS)
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">Miopía Temporal:</span>
              <span className="text-base font-mono font-bold text-amber-300">{pheno.bdefsTimeMyopia}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">Parálisis de Activación:</span>
              <span className="text-base font-mono font-bold text-rose-300">{pheno.bdefsActivation}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">Impulsividad / Inhibición:</span>
              <span className="text-base font-mono font-bold text-cyan-300">{pheno.bdefsInhibition}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090e]/80 border border-white/10">
              <span className="text-slate-400 block text-[10px] font-mono">Autorregulación Emocional:</span>
              <span className="text-base font-mono font-bold text-emerald-300">{pheno.bdefsEmotionalRegulation}</span>
            </div>
          </div>
        </div>

        {/* Dabrowski Overexcitabilities */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-3">
          <span className="text-xs font-mono uppercase font-bold text-purple-400">
            Sobreexcitabilidades de Dabrowski (Intensidad Neurocognitiva)
          </span>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Intelectual', val: pheno.dabrowski.intellectual, color: 'bg-cyan-400' },
              { label: 'Imaginativa', val: pheno.dabrowski.imaginative, color: 'bg-purple-400' },
              { label: 'Emocional', val: pheno.dabrowski.emotional, color: 'bg-rose-400' },
              { label: 'Psicomotora', val: pheno.dabrowski.psychomotor, color: 'bg-amber-400' },
              { label: 'Sensual / Estética', val: pheno.dabrowski.sensual, color: 'bg-emerald-400' }
            ].map(oe => (
              <div key={oe.label} className="flex items-center gap-3">
                <span className="w-32 text-slate-300 shrink-0 font-medium">{oe.label}</span>
                <div className="flex-1 bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden p-[1px]">
                  <div className={`${oe.color} h-full rounded-full`} style={{ width: `${oe.val}%` }} />
                </div>
                <span className="w-8 font-mono text-right text-slate-300 font-bold">{oe.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: COM-B BOTTLENECK & PERSONALIZED ACTIONABLE LEVERS */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow text-emerald-400">// ARQUITECTURA CONDUCTUAL COM-B</span>
            <h3 className="text-base sm:text-lg font-bold font-display text-white">
              Diagnóstico de Cuello de Botella y Palancas de Intervención
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#07090e]/80 border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">// Cuello de Botella Primario:</span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {pheno.primaryBottleneck}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono flex items-center justify-center shrink-0 text-xs border border-emerald-500/30">
                1
              </span>
              <span className="leading-relaxed">{pheno.identifiedLevers[0]}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono flex items-center justify-center shrink-0 text-xs border border-emerald-500/30">
                2
              </span>
              <span className="leading-relaxed">{pheno.identifiedLevers[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: GEMINI HANDSHAKE CONTRACT (XML INSPECTOR & RECOVERY TOKEN) */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl space-y-4">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/gemini-spark-contract.xml</span>
          </div>
          <button
            onClick={() => setShowRawXml(prev => !prev)}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>{showRawXml ? '[ Ocultar XML ]' : '[ Ver XML Completo ]'}</span>
            {showRawXml ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Payload del Handshake Gemini Spark (&lt;gemini_cognitive_profile_v1&gt;)
            </h3>
          </div>

          {showRawXml && (
            <div className="p-4 rounded-xl bg-[#07090e] border border-white/10 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-96 shadow-inner">
              <pre>{xmlPayload}</pre>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Token compacto Base64 disponible para contingencia de copiado.</span>
            <button
              onClick={() => setShowBase64(prev => !prev)}
              className="text-emerald-400 hover:text-emerald-300 underline font-mono text-xs"
            >
              {showBase64 ? 'Ocultar Token' : 'Ver Token Base64'}
            </button>
          </div>

          {showBase64 && (
            <div className="p-3 rounded-xl bg-[#07090e] border border-white/10 text-[10px] font-mono text-slate-400 break-all">
              {compactTokenBase64}
            </div>
          )}
        </div>
      </div>

      {/* Footer Restart & NikkoDev Signature */}
      <div className="pt-6 pb-4 space-y-6">
        <div className="text-center">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar la evaluación? Se iniciará una nueva sesión desde el principio.')) {
                restartSession();
              }
            }}
            className="text-xs font-mono text-slate-500 hover:text-emerald-400 transition-colors underline cursor-pointer"
          >
            // Reiniciar evaluación y comenzar una nueva sesión
          </button>
        </div>

        {/* NikkoDev Author Signature */}
        <footer className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-emerald-400 text-sm">
              N
            </div>
            <div>
              <div className="font-bold text-white font-display flex items-center gap-2">
                <span>NikkoDev</span>
                <span className="text-slate-600">/</span>
                <span className="text-emerald-400 font-mono text-[11px]">psic.nikko.dev</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Desarrollado por Brayan Nikolas Gallo León · Full-Stack & Applied AI Engineer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[11px]">
            <a
              href="https://nikko.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>nikko.dev ↗</span>
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="https://github.com/NikkoWebDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>GitHub ↗</span>
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="https://wa.me/573136638097"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>WhatsApp ↗</span>
            </a>
            <span className="text-slate-700">·</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px]">
              v1.4.0 · CHC CAT-3PL
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};


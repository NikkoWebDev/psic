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
  ChevronUp
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { fullReport, restartSession } = useSession();
  const [copied, setCopied] = useState(false);
  const [showRawXml, setShowRawXml] = useState(false);
  const [showBase64, setShowBase64] = useState(false);

  useEffect(() => {
    // Neuroaffirming celebration burst
    try {
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

  const handleCopyClipboard = async () => {
    try {
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
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                Evaluación Completa • {metadata.appVersion}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Perfil Neurocognitivo & Fenotipo Conductual
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tu evaluación ha sido calibrada mediante IRT 3PL, O-Span y Tríadas Thurstonianas. Listo para sincronización con Gemini Spark.
            </p>
          </div>

          {/* Prominent Action Button: 📋 Copiar Reporte para Asesoría Gemini */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopyClipboard}
              className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all transform active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-2 ring-indigo-400/50 hover:shadow-indigo-500/25'
              }`}
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? '¡Reporte Copiado al Portapapeles!' : '📋 Copiar Reporte para Asesoría Gemini'}</span>
            </button>

            <button
              onClick={handleDownloadXml}
              className="py-3 px-4 rounded-2xl font-medium text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
              title="Descargar archivo XML"
            >
              <Download className="w-4 h-4" />
              <span>XML</span>
            </button>
          </div>
        </div>

        {/* Copy instruction helper */}
        {copied && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Copia pegada con éxito. Pégala directamente en tu chat con Gemini Spark para recibir tu plan de optimización conductual y andamiaje personalizado.
            </span>
          </div>
        )}
      </div>

      {/* SECTION 1: 2e CLINICAL DISCREPANCY & ABILITY GAUGES */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Discrepancia Clínica 2e: Capacidad General vs. Eficiencia Ejecutiva
              </h2>
              <p className="text-xs text-slate-400">
                Criterio Estándar de Oro NAGC / Pearson para Doble Excepcionalidad y Altas Capacidades
              </p>
            </div>
          </div>

          {/* Clinical Flag Badge */}
          <div className="self-start sm:self-auto">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                chc.clinicalSyndromeFlag === '2E_AACC_ADHD'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/50'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
              }`}
            >
              {chc.clinicalSyndromeFlag === '2E_AACC_ADHD' && <AlertTriangle className="w-3.5 h-3.5" />}
              {chc.clinicalSyndromeFlag}
            </span>
          </div>
        </div>

        {/* Clinical Narrative Banner */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
            !chc.isFsiqValid
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              : 'bg-indigo-950/20 border-indigo-500/40 text-indigo-200'
          }`}
        >
          <div className="font-bold flex items-center gap-2 mb-1">
            {!chc.isFsiqValid ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>INVALIDEZ FORMAL DEL CI TOTAL (CIT / FSIQ):</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CI TOTAL VÁLIDO Y ARMÓNICO:</span>
              </>
            )}
          </div>
          <p>{chc.discrepancyNarrative}</p>
        </div>

        {/* Comparative Dual Gauges: IAG vs. IEC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IAG Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-indigo-400">
                Índice de Capacidad General (IAG / GAI)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Gf + Gc
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-white tracking-tight">
                {chc.gai.score}
              </span>
              <span className="text-xs text-slate-400">
                ± {chc.gai.sem} SEM • IC95%: [{chc.gai.ci95[0]} - {chc.gai.ci95[1]}]
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{chc.gai.classification}</span>
                <span className="font-bold font-mono text-indigo-400">Percentil {chc.gai.percentile}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(10, ((chc.gai.score - 70) / 75) * 100))}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Refleja el potencial latente puro de deducción lógica abstracta y comprensión conceptual verbal, sin penalización por memoria o motricidad.
            </p>
          </div>

          {/* IEC Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-amber-400">
                Índice de Eficiencia Cognitiva (IEC / CPI)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Gwm + Gs
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-white tracking-tight">
                {chc.cpi.score}
              </span>
              <span className="text-xs text-slate-400">
                ± {chc.cpi.sem} SEM • IC95%: [{chc.cpi.ci95[0]} - {chc.cpi.ci95[1]}]
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{chc.cpi.classification}</span>
                <span className="font-bold font-mono text-amber-400">Percentil {chc.cpi.percentile}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(10, ((chc.cpi.score - 70) / 75) * 100))}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Refleja la disponibilidad de memoria de trabajo operativa (O-Span) y velocidad de respuesta motora visual bajo demanda externa.
            </p>
          </div>
        </div>

        {/* Statistical Rigor Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] font-mono">Discrepancia Delta (Δ):</span>
            <span className="text-base font-bold font-mono text-indigo-300">{chc.discrepancyDelta} pts</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] font-mono">SEM de la Diferencia:</span>
            <span className="text-base font-bold font-mono text-slate-200">± {chc.semDiff} pts</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] font-mono">Tasa Base Poblacional:</span>
            <span className="text-xs font-bold text-amber-300">{chc.populationBaseRate}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] font-mono">Potencial Certificado:</span>
            <span className="text-base font-bold font-mono text-emerald-400">CI {chc.certifiedIntelligencePotential}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: RADAR & BROAD ABILITIES CHC PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHC Latent Thetas */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-sm uppercase font-mono">
              Habilidades Cognitivas CHC (θ Latente)
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Razonamiento Fluido (Gf)', theta: chc.broadAbilitiesTheta.gf, color: 'bg-indigo-500' },
              { name: 'Comprensión Cristalizada (Gc)', theta: chc.broadAbilitiesTheta.gc, color: 'bg-purple-500' },
              { name: 'Memoria de Trabajo (Gwm)', theta: chc.broadAbilitiesTheta.gwm, color: 'bg-sky-500' },
              { name: 'Velocidad de Procesamiento (Gs)', theta: chc.broadAbilitiesTheta.gs, color: 'bg-amber-500' }
            ].map(item => (
              <div key={item.name} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="font-mono font-bold text-white">
                    {item.theta >= 0 ? `+${item.theta}` : item.theta} DE
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${Math.min(100, Math.max(5, ((item.theta + 3) / 6) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monotropism & Sensory Dunn Profile */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-sm uppercase font-mono">
              Fenotipo Neurodivergente & Monotropismo
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Monotropismo (MQ):</span>
                <span className="font-bold text-slate-200">
                  {pheno.monotropismProfile === 'DEEP_TUNNEL' ? 'Túnel Profundo de Foco' : 'Atención Distribuida'}
                </span>
              </div>
              <span className="text-lg font-mono font-bold text-indigo-400">{pheno.monotropismMQScore} / 100</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Camuflaje Social (CAT-Q):</span>
                <span className="font-bold text-slate-200">Riesgo de Burnout: {pheno.maskingBurnoutRisk}</span>
              </div>
              <span className="text-lg font-mono font-bold text-purple-400">{pheno.catQScore} / 100</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrante Sensorial de Dunn:</span>
                <span className="font-bold text-slate-200">{pheno.dunnQuadrant}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                Umbral {pheno.dunnThreshold}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BARKLEY EXECUTIVE SCALES & DABROWSKI OVEREXCITABILITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Barkley BDEFS */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <span className="text-xs font-mono uppercase font-bold text-indigo-400">
            Escalas Ejecutivas Barkley (BDEFS)
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Miopía Temporal:</span>
              <span className="text-base font-mono font-bold text-amber-300">{pheno.bdefsTimeMyopia}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Parálisis de Inicio / Activación:</span>
              <span className="text-base font-mono font-bold text-rose-300">{pheno.bdefsActivation}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Impulsividad / Inhibición:</span>
              <span className="text-base font-mono font-bold text-indigo-300">{pheno.bdefsInhibition}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Autorregulación Emocional:</span>
              <span className="text-base font-mono font-bold text-emerald-300">{pheno.bdefsEmotionalRegulation}</span>
            </div>
          </div>
        </div>

        {/* Dabrowski Overexcitabilities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <span className="text-xs font-mono uppercase font-bold text-purple-400">
            Sobreexcitabilidades de Dabrowski (Intensidad Neurocognitiva)
          </span>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Intelectual', val: pheno.dabrowski.intellectual, color: 'bg-indigo-500' },
              { label: 'Imaginativa', val: pheno.dabrowski.imaginative, color: 'bg-purple-500' },
              { label: 'Emocional', val: pheno.dabrowski.emotional, color: 'bg-rose-500' },
              { label: 'Psicomotora', val: pheno.dabrowski.psychomotor, color: 'bg-amber-500' },
              { label: 'Sensual / Estética', val: pheno.dabrowski.sensual, color: 'bg-teal-500' }
            ].map(oe => (
              <div key={oe.label} className="flex items-center gap-3">
                <span className="w-32 text-slate-300 shrink-0">{oe.label}</span>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${oe.color} h-full rounded-full`} style={{ width: `${oe.val}%` }} />
                </div>
                <span className="w-8 font-mono text-right text-slate-300 font-bold">{oe.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: COM-B BOTTLENECK & PERSONALIZED ACTIONABLE LEVERS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase font-bold text-emerald-400">
              Arquitectura Conductual COM-B
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Diagnóstico de Cuello de Botella y Palancas de Intervención
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Cuello de Botella Primario:</span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {pheno.primaryBottleneck}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <span>{pheno.identifiedLevers[0]}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <span>{pheno.identifiedLevers[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: GEMINI HANDSHAKE CONTRACT (XML INSPECTOR & RECOVERY TOKEN) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">
              Payload del Handshake Gemini Spark (&lt;gemini_cognitive_profile_v1&gt;)
            </h3>
          </div>
          <button
            onClick={() => setShowRawXml(prev => !prev)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>{showRawXml ? 'Ocultar XML' : 'Ver XML completo'}</span>
            {showRawXml ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showRawXml && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96">
            <pre>{xmlPayload}</pre>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Token compacto Base64 disponible para contingencia de copiado.</span>
          <button
            onClick={() => setShowBase64(prev => !prev)}
            className="text-slate-400 hover:text-slate-200 underline"
          >
            {showBase64 ? 'Ocultar Token' : 'Ver Token'}
          </button>
        </div>

        {showBase64 && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
            {compactTokenBase64}
          </div>
        )}
      </div>

      {/* Footer Restart */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar la evaluación? Se iniciará una nueva sesión desde el principio.')) {
              restartSession();
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors underline"
        >
          Reiniciar prueba y comenzar nueva sesión
        </button>
      </div>
    </div>
  );
};

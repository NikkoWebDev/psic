// Thurstonian IRT Forced-Choice Triad Questionnaire Component
// Administers 15 triads in Block 4A (Personality/Rationality) and 15 in Block 4B (Neurodivergent Phenotype)
import React, { useState, useEffect } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { TRIADS_POOL } from '../lib/psychometrics/triadsPool';
import { Sparkles, ArrowRight, ThumbsUp, ThumbsDown, BarChart2 } from 'lucide-react';

interface TriadCardProps {
  block: '4A' | '4B';
}

export const TriadCard: React.FC<TriadCardProps> = ({ block }) => {
  const {
    triadResponses,
    saveTriadResponse,
    completeTriadsBlockA,
    completeTriadsBlockB,
    generatePartialReport
  } = useSession();

  const blockTriads = TRIADS_POOL.filter(t => t.block === block);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentTriad = blockTriads[currentIdx] || blockTriads[0];
  const currentSaved = triadResponses[currentTriad?.id] || { mostLikeId: '', leastLikeId: '' };

  const [mostSelected, setMostSelected] = useState<string>(currentSaved.mostLikeId);
  const [leastSelected, setLeastSelected] = useState<string>(currentSaved.leastLikeId);

  // Reset index and selections when switching blocks
  useEffect(() => {
    setCurrentIdx(0);
    const firstTriad = blockTriads[0];
    if (firstTriad) {
      const saved = triadResponses[firstTriad.id] || { mostLikeId: '', leastLikeId: '' };
      setMostSelected(saved.mostLikeId);
      setLeastSelected(saved.leastLikeId);
    }
  }, [block]);

  const isBlockA = block === '4A';

  const handleSelectMost = (statementId: string) => {
    if (leastSelected === statementId) {
      setLeastSelected('');
    }
    setMostSelected(statementId);
  };

  const handleSelectLeast = (statementId: string) => {
    if (mostSelected === statementId) {
      setMostSelected('');
    }
    setLeastSelected(statementId);
  };

  const canAdvance = Boolean(mostSelected && leastSelected && mostSelected !== leastSelected);

  const handleNext = () => {
    if (!canAdvance) return;

    // Immediately calculate updated responses dictionary to avoid async state lag
    const updatedResponses = {
      ...triadResponses,
      [currentTriad.id]: {
        triadId: currentTriad.id,
        mostLikeId: mostSelected,
        leastLikeId: leastSelected
      }
    };

    // Save response in context
    saveTriadResponse(currentTriad.id, mostSelected, leastSelected);

    if (currentIdx + 1 < blockTriads.length) {
      const nextTriad = blockTriads[currentIdx + 1];
      const nextSaved = updatedResponses[nextTriad.id] || { mostLikeId: '', leastLikeId: '' };
      setCurrentIdx(prev => prev + 1);
      setMostSelected(nextSaved.mostLikeId);
      setLeastSelected(nextSaved.leastLikeId);
    } else {
      // Completed block
      if (isBlockA) {
        completeTriadsBlockA();
      } else {
        completeTriadsBlockB(updatedResponses);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow text-cyan-400">
              {isBlockA ? '// ETAPA 4A · PERSONALIDAD & RACIONALIDAD' : '// ETAPA 4B · FENOTIPO NEURODIVERGENTE'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {isBlockA ? 'Personalidad Cibernética & Estabilidad' : 'Monotropismo, BDEFS & Perfil Sensorial'}
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#07090e] border border-white/10 text-slate-300">
          Tríada {currentIdx + 1} / {blockTriads.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden mb-6 p-[1px]">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          style={{ width: `${((currentIdx + 1) / blockTriads.length) * 100}%` }}
        />
      </div>

      {/* Instruction Card */}
      <div className="p-3.5 rounded-xl bg-[#07090e]/70 border border-white/10 mb-6 text-center text-xs text-slate-300 font-mono">
        <p>
          Selecciona una afirmación que sea <strong className="text-emerald-400">MÁS afín a ti</strong> (👍) y otra que sea <strong className="text-rose-400">MENOS afín a ti</strong> (👎).
        </p>
      </div>

      {/* 3 Statements Stack */}
      <div className="space-y-4 mb-8">
        {currentTriad.statements.map((stmt, sIdx) => {
          const isMost = mostSelected === stmt.id;
          const isLeast = leastSelected === stmt.id;

          return (
            <div
              key={stmt.id}
              className={`p-5 rounded-2xl border transition-all ${
                isMost
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.15)] ring-1 ring-emerald-500/40'
                  : isLeast
                  ? 'bg-rose-500/10 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/40'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-200 leading-relaxed flex-1">
                  {stmt.text}
                </p>

                {/* Most / Least Selection Pill Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleSelectMost(stmt.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 border transition-all active:scale-95 ${
                      isMost
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                        : 'bg-[#07090e]/80 text-slate-400 border-white/10 hover:text-emerald-300 hover:border-emerald-500/40'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Más afín</span>
                  </button>

                  <button
                    onClick={() => handleSelectLeast(stmt.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 border transition-all active:scale-95 ${
                      isLeast
                        ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-[#07090e]/80 text-slate-400 border-white/10 hover:text-rose-300 hover:border-rose-500/40'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Menos afín</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance Button & Partial Report Option */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono text-center sm:text-left">
            {!canAdvance ? '// Marca 1 afirmación más afín y 1 menos afín para avanzar' : `// Tríada lista para registrar`}
          </span>

          <button
            onClick={handleNext}
            disabled={!canAdvance}
            className={`w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              canAdvance
                ? 'btn-nikko-primary text-white cursor-pointer'
                : 'bg-[#0d111a] text-slate-600 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>
              {currentIdx + 1 < blockTriads.length
                ? 'Siguiente Tríada'
                : isBlockA
                ? 'Completar Bloque 4A'
                : 'Generar Reporte Completo'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Partial Report Shortcut Button */}
        {(Object.keys(triadResponses).length > 0 || canAdvance) && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-500">
              {Object.keys(triadResponses).length + (canAdvance && !triadResponses[currentTriad.id] ? 1 : 0)} / 30 tríadas registradas
            </span>
            <button
              onClick={() => {
                const updated = canAdvance
                  ? {
                      ...triadResponses,
                      [currentTriad.id]: {
                        triadId: currentTriad.id,
                        mostLikeId: mostSelected,
                        leastLikeId: leastSelected
                      }
                    }
                  : triadResponses;
                generatePartialReport('PHENOTYPE_ONLY', undefined, updated);
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline transition-colors flex items-center gap-1.5"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Ver análisis parcial de fenotipo ahora →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

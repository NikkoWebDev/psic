// Thurstonian IRT Forced-Choice Triad Questionnaire Component
// Administers 15 triads in Block 4A (Personality/Rationality) and 15 in Block 4B (Neurodivergent Phenotype)
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { TRIADS_POOL } from '../lib/psychometrics/triadsPool';
import { Sparkles, ArrowRight, ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface TriadCardProps {
  block: '4A' | '4B';
}

export const TriadCard: React.FC<TriadCardProps> = ({ block }) => {
  const { triadResponses, saveTriadResponse, completeTriadsBlockA, completeTriadsBlockB } = useSession();

  const blockTriads = TRIADS_POOL.filter(t => t.block === block);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentTriad = blockTriads[currentIdx];
  const currentSaved = triadResponses[currentTriad.id] || { mostLikeId: '', leastLikeId: '' };

  const [mostSelected, setMostSelected] = useState<string>(currentSaved.mostLikeId);
  const [leastSelected, setLeastSelected] = useState<string>(currentSaved.leastLikeId);

  const isBlockA = block === '4A';

  const handleSelectMost = (statementId: string) => {
    // If it was selected as least, unselect least
    if (leastSelected === statementId) {
      setLeastSelected('');
    }
    setMostSelected(statementId);
  };

  const handleSelectLeast = (statementId: string) => {
    // If it was selected as most, unselect most
    if (mostSelected === statementId) {
      setMostSelected('');
    }
    setLeastSelected(statementId);
  };

  const canAdvance = Boolean(mostSelected && leastSelected && mostSelected !== leastSelected);

  const handleNext = () => {
    if (!canAdvance) return;

    // Save response
    saveTriadResponse(currentTriad.id, mostSelected, leastSelected);

    if (currentIdx + 1 < blockTriads.length) {
      const nextTriad = blockTriads[currentIdx + 1];
      const nextSaved = triadResponses[nextTriad.id] || { mostLikeId: '', leastLikeId: '' };
      setCurrentIdx(prev => prev + 1);
      setMostSelected(nextSaved.mostLikeId);
      setLeastSelected(nextSaved.leastLikeId);
    } else {
      // Completed block
      if (isBlockA) {
        completeTriadsBlockA();
      } else {
        completeTriadsBlockB();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase font-bold text-indigo-400">
              {isBlockA ? 'Etapa 4A • Personalidad y Racionalidad' : 'Etapa 4B • Fenotipo Neurodivergente'}
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              {isBlockA ? 'Personalidad Cibernética & Pensamiento Abierto' : 'Monotropismo, BDEFS & Perfil Sensorial'}
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          Tríada {currentIdx + 1} / {blockTriads.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / blockTriads.length) * 100}%` }}
        />
      </div>

      {/* Instruction Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 mb-6 text-center text-xs text-slate-300">
        <p>
          Selecciona una afirmación que sea <strong>MÁS afín a ti</strong> (👍) y otra que sea <strong>MENOS afín a ti</strong> (👎).
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
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                  : isLeast
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-md ring-1 ring-rose-500/30'
                  : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700/80'
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      isMost
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-emerald-300 hover:border-emerald-500/40'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Más afín</span>
                  </button>

                  <button
                    onClick={() => handleSelectLeast(stmt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      isLeast
                        ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-rose-300 hover:border-rose-500/40'
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

      {/* Advance Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          {!canAdvance && 'Debes marcar una afirmación como más afín y otra como menos afín.'}
        </span>

        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="py-3 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all disabled:opacity-40 flex items-center gap-2 text-sm"
        >
          <span>
            {currentIdx + 1 < blockTriads.length
              ? 'Siguiente Tríada'
              : isBlockA
              ? 'Completar Bloque 4A'
              : 'Generar Reporte Clínico'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

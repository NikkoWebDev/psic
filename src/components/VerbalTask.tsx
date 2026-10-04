// Relational Verbal Reasoning Task for Crystallized Intelligence (Gc)
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { VERBAL_ITEMS_POOL } from '../lib/psychometrics/verbalItemsPool';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export const VerbalTask: React.FC = () => {
  const { verbalAnswers, submitVerbalAnswer, completeVerbalStage } = useSession();
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentItem = VERBAL_ITEMS_POOL[currentIdx];
  const selectedOption = verbalAnswers[currentItem.id];

  const handleSelectOption = (optIdx: number) => {
    submitVerbalAnswer(currentItem.id, optIdx);
  };

  const handleNext = () => {
    if (currentIdx + 1 < VERBAL_ITEMS_POOL.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      completeVerbalStage();
    }
  };

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === '1' || k === 'a') handleSelectOption(0);
      else if (k === '2' || k === 'b') handleSelectOption(1);
      else if (k === '3' || k === 'c') handleSelectOption(2);
      else if (k === '4' || k === 'd') handleSelectOption(3);
      else if (e.key === 'Enter' && selectedOption !== undefined) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, selectedOption]);


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow text-purple-400">// ETAPA 3 · INTELIGENCIA CRISTALIZADA (Gc)</span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Razonamiento Relacional
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#07090e] border border-white/10 text-slate-300">
          {currentIdx + 1} / {VERBAL_ITEMS_POOL.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0d111a] border border-white/10 h-2 rounded-full overflow-hidden mb-6 p-[1px]">
        <div
          className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          style={{ width: `${((currentIdx + 1) / VERBAL_ITEMS_POOL.length) * 100}%` }}
        />
      </div>

      {/* Analogy Prompt Card */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl mb-6">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/gc-analogies</span>
          </div>
          <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
            ANALOGÍA #{currentIdx + 1}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <span className="eyebrow text-slate-400 block">// COMPLETA LA RELACIÓN CONCEPTUAL</span>

          <div className="py-6 px-5 bg-[#07090e]/80 rounded-xl border border-white/10 text-center shadow-inner">
            <p className="text-lg sm:text-xl font-bold font-display text-white tracking-wide">
              {currentItem.analogyPrompt}
            </p>
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3">
            {currentItem.options.map((optionText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              return (
                <button
                  key={`opt-${optIdx}`}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium transition-all flex items-center justify-between active:scale-[0.99] ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.15)] ring-1 ring-emerald-500/50'
                      : 'bg-[#07090e]/60 hover:bg-[#0d111a] border-white/10 text-slate-200 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-[#0d111a] border-white/10 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm sm:text-base">{optionText}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedOption === undefined}
          className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
            selectedOption !== undefined
              ? 'btn-nikko-primary text-white cursor-pointer'
              : 'bg-[#0d111a] text-slate-600 border border-white/5 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>{currentIdx + 1 < VERBAL_ITEMS_POOL.length ? 'Siguiente Pregunta' : 'Finalizar Etapa 3'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Relational Verbal Reasoning Task for Crystallized Intelligence (Gc)
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { VERBAL_ITEMS_POOL } from '../lib/psychometrics/verbalItemsPool';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

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

  const answeredCount = Object.keys(verbalAnswers).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase font-bold text-purple-400">
              Etapa 3 • Inteligencia Cristalizada (Gc)
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              Razonamiento Relacional y Abstracción Conceptual
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          {currentIdx + 1} / {VERBAL_ITEMS_POOL.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-purple-500 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / VERBAL_ITEMS_POOL.length) * 100}%` }}
        />
      </div>

      {/* Analogy Prompt Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-3">
          Completa la analogía conceptual:
        </span>
        <div className="py-6 px-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center mb-8">
          <p className="text-lg sm:text-xl font-bold text-slate-100 tracking-wide">
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
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 ring-2 ring-purple-500/40 shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono flex items-center justify-center text-slate-400">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm">{optionText}</span>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-purple-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedOption === undefined}
          className="py-3 px-6 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all disabled:opacity-40 flex items-center gap-2 text-sm"
        >
          <span>{currentIdx + 1 < VERBAL_ITEMS_POOL.length ? 'Siguiente Pregunta' : 'Finalizar Etapa 3'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

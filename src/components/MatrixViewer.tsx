// Interactive Procedural SVG Matrix Reasoning CAT Interface
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { matrixSvgLib } from '../lib/psychometrics/matrixItemsPool';
import { Brain, HelpCircle, ArrowRight } from 'lucide-react';

export const MatrixViewer: React.FC = () => {
  const {
    catCurrentItem,
    catState,
    submitMatrixResponse,
    isProcessingItem
  } = useSession();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!catCurrentItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-3" />
        <p className="text-slate-400">Calibrando estimación adaptativa Bayesiana...</p>
      </div>
    );
  }

  const handleSelect = (idx: number) => {
    if (isProcessingItem) return;
    setSelectedOption(idx);
    submitMatrixResponse(idx);
    setSelectedOption(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Header Info: Pure Power Testing - ZERO visible countdown clocks */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Etapa 1: Razonamiento Matricial Fluido (Gf)
              <span className="text-[11px] font-mono font-normal text-slate-400">
                • Reactivo {catState.administeredItems.length + 1}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Prueba de potencia pura sin límite de tiempo visible. Tómate el tiempo necesario para deducir la regla.
            </p>
          </div>
        </div>

        {/* Adaptive indicator badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CAT Adaptativo Activo</span>
        </div>
      </div>

      {/* 3x3 Matrix Grid Container */}
      <div className="w-full max-w-md aspect-square bg-slate-900/70 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-xl mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full h-full">
          {/* First 8 Cells */}
          {catCurrentItem.cells.map((cellSvg, idx) => (
            <div
              key={`cell-${idx}`}
              className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden hover:border-slate-700/60 transition-colors"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-slate-200"
                dangerouslySetInnerHTML={{ __html: cellSvg }}
              />
            </div>
          ))}

          {/* Missing 9th Cell (Target Tile ?) */}
          <div className="bg-indigo-950/20 rounded-xl border-2 border-dashed border-indigo-500/50 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden animate-pulse">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-indigo-400"
              dangerouslySetInnerHTML={{ __html: matrixSvgLib.missingTile }}
            />
          </div>
        </div>
      </div>

      {/* Instruction Prompt */}
      <div className="w-full max-w-2xl text-center mb-3">
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          Selecciona cuál de las siguientes 8 opciones completa lógicamente la matriz:
        </p>
      </div>

      {/* 8 Options Grid */}
      <div className="w-full max-w-2xl grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 mb-6">
        {catCurrentItem.options.map((optSvg, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={`opt-${idx}`}
              disabled={isProcessingItem}
              onPointerDown={() => handleSelect(idx)}
              className={`aspect-square rounded-xl p-1.5 flex flex-col items-center justify-between border transition-all duration-150 transform active:scale-95 ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-500 shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700 text-slate-200'
              } ${isProcessingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-[10px] font-mono text-slate-400 font-bold self-start pl-1">
                {idx + 1}
              </span>
              <svg
                viewBox="0 0 100 100"
                className="w-full h-4/5 text-slate-200"
                dangerouslySetInnerHTML={{ __html: optSvg }}
              />
            </button>
          );
        })}
      </div>

      {/* Low-Arousal Calming Reassurance */}
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          Las reglas varían entre progresión de conteo, rotación, operaciones lógicas y ordenamiento espacial.
        </p>
      </div>
    </div>
  );
};

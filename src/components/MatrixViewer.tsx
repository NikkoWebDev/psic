// Interactive Procedural SVG Matrix Reasoning CAT Interface with nikko.dev Aesthetics
import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { matrixSvgLib } from '../lib/psychometrics/matrixItemsPool';
import { Brain, HelpCircle, Activity } from 'lucide-react';

export const MatrixViewer: React.FC = () => {
  const {
    catCurrentItem,
    catState,
    submitMatrixResponse,
    isProcessingItem
  } = useSession();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Keyboard shortcut listener for options 1-8
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProcessingItem) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 8) {
        handleSelect(keyNum - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessingItem, catCurrentItem]);

  if (!catCurrentItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-emerald-400">
          $ worker --recompute-eap --fisher-max
        </p>
        <span className="text-xs text-slate-400">Calibrando estimación Bayesiana...</span>
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
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center space-y-6">
      {/* Terminal Titlebar Container */}
      <div className="w-full glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="os-dots">
            <span className="os-dot os-dot-red"></span>
            <span className="os-dot os-dot-yellow"></span>
            <span className="os-dot os-dot-green"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                Etapa 1 · Razonamiento Fluido (Gf)
              </span>
              <span className="text-slate-600 font-mono text-xs">/</span>
              <span className="text-xs font-mono text-slate-300">
                Reactivo #{catState.administeredItems.length + 1}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prueba de potencia pura sin cronómetro visible. Tómate el tiempo necesario para inferir la regla.
            </p>
          </div>
        </div>

        {/* Live CAT Pulse Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400">
          <span className="pulse-dot"></span>
          <span>CAT Adaptativo Activo</span>
        </div>
      </div>

      {/* 3x3 Matrix Grid Container */}
      <div className="w-full max-w-md aspect-square glass-card p-3 sm:p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full h-full">
          {/* First 8 Stimulus Cells */}
          {catCurrentItem.cells.map((cellSvg, idx) => (
            <div
              key={`cell-${idx}`}
              className="bg-black/60 rounded-2xl border border-white/10 p-2 flex items-center justify-center overflow-hidden hover:border-emerald-500/30 transition-colors shadow-inner"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-slate-200"
                dangerouslySetInnerHTML={{ __html: cellSvg }}
              />
            </div>
          ))}

          {/* Missing 9th Cell (Target Tile ?) */}
          <div className="bg-emerald-950/20 rounded-2xl border-2 border-dashed border-emerald-500/50 p-2 flex items-center justify-center overflow-hidden animate-pulse">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-emerald-400"
              dangerouslySetInnerHTML={{ __html: matrixSvgLib.missingTile }}
            />
          </div>
        </div>
      </div>

      {/* Instruction Prompt */}
      <div className="w-full max-w-2xl text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="eyebrow">// opciones de respuesta</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400">
            [Atajo: teclas 1 - 8]
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          Selecciona la opción que completa lógicamente la matriz:
        </p>
      </div>

      {/* 8 Response Options Grid */}
      <div className="w-full max-w-2xl grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
        {catCurrentItem.options.map((optSvg, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={`opt-${idx}`}
              disabled={isProcessingItem}
              onPointerDown={() => handleSelect(idx)}
              className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-between border transition-all duration-200 transform active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-black/50 hover:bg-white/[0.06] border-white/10 hover:border-emerald-500/40 text-slate-200'
              } ${isProcessingItem ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Low-Arousal Reassurance note */}
      <div className="w-full max-w-md glass-card p-3 rounded-xl text-center">
        <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Las reglas coordinan rotación, progresión, operaciones booleanas y topología.</span>
        </p>
      </div>
    </div>
  );
};

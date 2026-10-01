// Accessibility & Sensory Navigation Bar
import React from 'react';
import { useSession, AppTheme, AppFont } from '../lib/state/testSessionContext';
import { Sun, Moon, Eye, Type, RotateCcw, ShieldCheck } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { theme, setTheme, font, setFont, restartSession, currentStage } = useSession();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-slate-800/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
            <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4z"/>
          </svg>
        </div>
        <div>
          <span className="font-extrabold tracking-tight text-sm uppercase text-slate-100 dark:text-slate-100 flex items-center gap-1.5">
            NEUROSYNAPSE
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CAT 3PL
            </span>
          </span>
          <span className="text-[11px] block text-slate-400">Motor Psicométrico Adaptativo</span>
        </div>
      </div>

      {/* Neuroaffirming Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* OpenDyslexic Toggle */}
        <button
          onClick={() => setFont(font === 'opendyslexic' ? 'sans' : 'opendyslexic')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
            font === 'opendyslexic'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
              : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:bg-slate-800'
          }`}
          title="Alternar entre tipografía de alta legibilidad y OpenDyslexic"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">OpenDyslexic</span>
        </button>

        {/* Theme Selector (Dark, Light, Sepia/Anti-Irlen) */}
        <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Oscuro Profundo (Bajo Arousal)"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('sepia')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
              theme === 'sepia' ? 'bg-amber-700 text-amber-50 font-bold' : 'text-amber-300/80 hover:text-amber-200'
            }`}
            title="Filtro Cálido Sepia Anti-Irlen (Reduce estrés visual)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden md:inline">Sepia</span>
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              theme === 'light' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Claro Suave"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reset Session */}
        {currentStage !== 'WELCOME' && (
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar la sesión desde el inicio? Todos los datos actuales se borrarán.')) {
                restartSession();
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
            title="Reiniciar sesión"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};

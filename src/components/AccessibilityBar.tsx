import React, { useState } from 'react';
import { useSession } from '../lib/state/testSessionContext';
import { Sun, Moon, Eye, Type, RotateCcw, BarChart2, ChevronDown, Brain, Layers, Sparkles } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const {
    theme,
    setTheme,
    font,
    setFont,
    restartSession,
    currentStage,
    setStage,
    setSelectedModuleMode,
    generatePartialReport,
    catState,
    triadResponses
  } = useSession();

  const [showModulesMenu, setShowModulesMenu] = useState(false);

  const hasAnyData = catState.administeredItems.length > 0 || Object.keys(triadResponses).length > 0;

  return (
    <header className="sticky top-4 z-50 px-4 mb-6">
      <nav
        className="max-w-5xl mx-auto glass-card rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 border border-white/10 shadow-2xl backdrop-blur-2xl relative"
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Brand Identity - nikko.dev style */}
        <div className="flex items-center gap-3">
          <a
            href="https://nikko.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 group"
            title="Ir a nikko.dev"
          >
            {/* nikko.dev circular brand mark */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform font-mono">
              N
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white font-display">
                  Nikko<span className="text-emerald-400">Dev</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">/</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  psic
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                psic.nikko.dev
              </span>
            </div>
          </a>

          {/* Live Engine Status Pulse */}
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-[11px] font-mono text-slate-400">
            <span className="pulse-dot"></span>
            <span>CAT 3PL</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400/90 font-medium">LIVE</span>
          </div>
        </div>

        {/* Accessibility & Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Modules & Partial Analysis Menu Button (active during test) */}
          {currentStage !== 'WELCOME' && (
            <div className="relative">
              <button
                onClick={() => setShowModulesMenu(prev => !prev)}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                title="Menú de Módulos y Análisis Parcial"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Módulos</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Floating Dropdown */}
              {showModulesMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-[#0b0f19] border border-white/15 shadow-2xl z-50 text-xs font-mono space-y-1 backdrop-blur-2xl"
                  onMouseLeave={() => setShowModulesMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/10">
                    // Navegación Modular
                  </div>

                  <button
                    onClick={() => {
                      setShowModulesMenu(false);
                      setSelectedModuleMode('COGNITIVE_ONLY');
                      setStage('STAGE_1_GF_MATRICES');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-white/5 flex items-center gap-2 text-slate-200 transition-colors"
                  >
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>Módulo CI / CHC (Matrices)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowModulesMenu(false);
                      setSelectedModuleMode('PHENOTYPE_ONLY');
                      setStage('STAGE_4A_TRIADS_PERSONALITY');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-white/5 flex items-center gap-2 text-slate-200 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Módulo Fenotipo (Tríadas)</span>
                  </button>

                  {hasAnyData && (
                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setShowModulesMenu(false);
                          generatePartialReport();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-2 border border-emerald-500/20 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Ver Análisis Parcial Ahora</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* OpenDyslexic Toggle */}
          <button
            onClick={() => setFont(font === 'opendyslexic' ? 'sans' : 'opendyslexic')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all border ${
              font === 'opendyslexic'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-emerald-500/40 hover:text-white'
            }`}
            title="Alternar tipografía OpenDyslexic / Inter"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dyslexic</span>
          </button>

          {/* Theme Switcher Pill (Dark, Sepia, Light) */}
          <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full text-xs transition-all ${
                theme === 'dark' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Oscuro Profundo (nikko.dev default)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1 ${
                theme === 'sepia' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400/80 hover:text-amber-300'
              }`}
              title="Filtro Cálido Sepia Anti-Irlen"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Sepia</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full text-xs transition-all ${
                theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button if active test */}
          {currentStage !== 'WELCOME' && (
            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar la sesión? Volverás a la pantalla de inicio.')) {
                  restartSession();
                }
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-1"
              title="Reiniciar sesión"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

// Main Application Router & Stage Orchestrator for NEUROSYNAPSE
import React from 'react';
import { SessionProvider, useSession } from './lib/state/testSessionContext';
import { AccessibilityBar } from './components/AccessibilityBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MatrixViewer } from './components/MatrixViewer';
import { OSpanTask } from './components/OSpanTask';
import { SymbolMatchTask } from './components/SymbolMatchTask';
import { EnergyCheckpoint } from './components/EnergyCheckpoint';
import { DecompressionScreen } from './components/DecompressionScreen';
import { VerbalTask } from './components/VerbalTask';
import { TriadCard } from './components/TriadCard';
import { Dashboard } from './components/Dashboard';

const StageRenderer: React.FC = () => {
  const { currentStage, setStage } = useSession();

  switch (currentStage) {
    case 'WELCOME':
      return <WelcomeScreen />;

    case 'STAGE_1_GF_MATRICES':
      return <MatrixViewer />;

    case 'BREATHER_1':
      return (
        <DecompressionScreen
          stageTitle="Descompresión de Razonamiento Matricial"
          nextStageName="Memoria de Trabajo (O-Span)"
          onContinue={() => setStage('STAGE_2A_OSPAN')}
        />
      );

    case 'STAGE_2A_OSPAN':
      return <OSpanTask />;

    case 'STAGE_2B_SYMBOL_MATCH':
      return <SymbolMatchTask />;

    case 'ENERGY_CHECKPOINT':
      return <EnergyCheckpoint />;

    case 'STAGE_3_GC_VERBAL':
      return <VerbalTask />;

    case 'BREATHER_2':
      return (
        <DecompressionScreen
          stageTitle="Descompresión de Razonamiento Verbal"
          nextStageName="Tríadas de Personalidad y Racionalidad (Bloque 4A)"
          onContinue={() => setStage('STAGE_4A_TRIADS_PERSONALITY')}
        />
      );

    case 'STAGE_4A_TRIADS_PERSONALITY':
      return <TriadCard block="4A" />;

    case 'STAGE_4B_TRIADS_PHENOTYPE':
      return <TriadCard block="4B" />;

    case 'RESULTS_DASHBOARD':
      return <Dashboard />;

    default:
      return <WelcomeScreen />;
  }
};

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 transition-colors duration-200">
        <AccessibilityBar />
        <main className="flex-1 w-full pb-12">
          <StageRenderer />
        </main>

        {/* Footer matching nikko.dev aesthetic */}
        <footer className="w-full border-t border-white/10 bg-[#07090e]/80 backdrop-blur-md py-8 px-4 text-xs font-mono text-slate-400">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://nikko.dev"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs hover:border-emerald-400 hover:text-emerald-300 transition-colors"
                title="Ir a nikko.dev"
              >
                N
              </a>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-bold">psic.nikko.dev</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-emerald-400">NikkoDev Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  Plataforma psicométrica adaptativa neuroafirmante (CAT IRT 3PL · CHC · Thurstonian IRT)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d111a] border border-white/10 text-slate-300">
                <span className="pulse-dot" />
                <span>psic.nikko.dev: online</span>
              </div>

              <a
                href="https://nikko.dev"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors underline"
              >
                nikko.dev
              </a>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
};

export default App;

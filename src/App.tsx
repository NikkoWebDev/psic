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
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-200">
        <AccessibilityBar />
        <main className="flex-1 w-full pb-12">
          <StageRenderer />
        </main>
      </div>
    </SessionProvider>
  );
};

export default App;

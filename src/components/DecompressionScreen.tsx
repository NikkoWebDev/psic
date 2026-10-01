// Decompression & Micro-Breather Screen (Sensory Decompression Layer)
import React, { useState, useEffect } from 'react';
import { ArrowRight, Coffee, Heart } from 'lucide-react';

interface DecompressionScreenProps {
  stageTitle: string;
  nextStageName: string;
  onContinue: () => void;
}

export const DecompressionScreen: React.FC<DecompressionScreenProps> = ({
  stageTitle,
  nextStageName,
  onContinue
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhala suavemente' | 'Sostén el aire' | 'Exhala despacio'>('Inhala suavemente');

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 3;
      if (step === 0) setBreathPhase('Inhala suavemente');
      else if (step === 1) setBreathPhase('Sostén el aire');
      else setBreathPhase('Exhala despacio');
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-6 h-6" />
        </div>

        <span className="text-xs font-mono font-bold uppercase text-indigo-400">
          Pausa de Descompresión Neurocognitiva
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1 mb-2">{stageTitle}</h2>
        <p className="text-xs text-slate-400 mb-8">
          Toma un trago de agua, relaja los hombros y parpadea un par de veces para descansar la vista.
        </p>

        {/* Breathing Circle Micro-Interaction */}
        <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping opacity-25" />
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 border border-indigo-500/50 flex flex-col items-center justify-center p-4 transition-all duration-1000 shadow-inner">
            <Heart className="w-5 h-5 text-indigo-300 mb-1" />
            <span className="text-xs font-semibold text-indigo-200">{breathPhase}</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3.5 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Continuar a: {nextStageName}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

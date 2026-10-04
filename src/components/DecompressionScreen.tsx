// Decompression & Micro-Breather Screen (Sensory Decompression Layer)
import React, { useState, useEffect } from 'react';
import { ArrowRight, Coffee, Heart } from 'lucide-react';
import { sound } from '../lib/audio/soundEngine';

interface DecompressionScreenProps {
  stageTitle: string;
  nextStageName: string;
  onContinue: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const DecompressionScreen: React.FC<DecompressionScreenProps> = ({
  stageTitle,
  nextStageName,
  onContinue,
  secondaryAction
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhala suavemente' | 'Sostén el aire' | 'Exhala despacio'>('Inhala suavemente');

  const handleContinueWithSound = () => {
    sound.playTransitionTone();
    onContinue();
  };


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
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot bg-[#ff5f56]" />
            <span className="terminal-dot bg-[#ffbd2e]" />
            <span className="terminal-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">psic@nikko.dev: ~/decompression-zone</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            MINDFUL BREATHER
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <Coffee className="w-7 h-7" />
          </div>

          <div>
            <span className="eyebrow text-emerald-400">// PAUSA DE DESCOMPRESIÓN SENSORIAL</span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 mb-2">
              {stageTitle}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Toma un sorbo de agua, relaja los hombros y parpadea un par de veces para descansar la vista de la pantalla.
            </p>
          </div>

          {/* Breathing Circle Micro-Interaction */}
          <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-500/15 via-cyan-500/10 to-[#07090e] border border-emerald-500/40 flex flex-col items-center justify-center p-4 transition-all duration-1000 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
              <Heart className="w-5 h-5 text-emerald-300 mb-1.5 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-200 text-center tracking-wide">
                {breathPhase}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinueWithSound}
              className="btn-nikko-primary w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              <span>Continuar a: {nextStageName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{secondaryAction.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

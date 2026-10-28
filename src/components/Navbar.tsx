import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import type { BoothStep } from '../types/photobooth';

interface NavbarProps {
  currentStep: BoothStep;
  onReset: () => void;
  onOpenPoseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onReset,
  onOpenPoseGuide,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.setMuted(nextState);
    if (!nextState) {
      sounds.playCountdownBeep(false);
    }
  };

  const stepLabels: Record<BoothStep, string> = {
    setup: '1. Pengaturan',
    capture: '2. Ambil Foto',
    review: '3. Cek Foto',
    customize: '4. Hias Strip',
    export: '5. Unduh',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 flex items-center justify-center shadow-xs text-white font-bold text-lg">
            📸
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 tracking-tight text-base sm:text-lg">
                Photobooth Indonesia
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 rounded-full">
                KOREAN STYLE
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Foto Booth Estetik Online • 4 Foto Strip
            </p>
          </div>
        </div>

        {/* Current Step Badge */}
        <div className="hidden md:flex items-center gap-1.5">
          {(['setup', 'capture', 'review', 'customize', 'export'] as BoothStep[]).map((step, idx) => {
            const isActive = currentStep === step;
            const isDone = ['setup', 'capture', 'review', 'customize', 'export'].indexOf(currentStep) > idx;

            return (
              <div
                key={step}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : isDone
                    ? 'bg-pink-100/70 text-pink-700'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>{stepLabels[step]}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pose Guide Button */}
          <button
            onClick={onOpenPoseGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
            title="Ide Gaya Foto Estetik Korea"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Ide Gaya Foto</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl transition"
            title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-600" />
            )}
          </button>

          {/* Restart Session */}
          {currentStep !== 'setup' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
              title="Mulai Ulang Sesi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulai Ulang</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Camera,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';
import type { CapturedPhoto, FilterOption, SessionMode } from '../types/photobooth';
import { sounds } from '../utils/audio';

interface CaptureStepProps {
  sessionMode: SessionMode;
  countdownSeconds: number;
  selectedFilter: FilterOption;
  isMirrored: boolean;
  isDemoMode: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCapturePhoto: () => string | null;
  onFinishSession: (photos: CapturedPhoto[]) => void;
  onCancel: () => void;
  singleRetakeIndex?: number | null; // If retaking only 1 specific photo
  onFinishSingleRetake?: (photo: CapturedPhoto) => void;
}

const POSE_HINTS = [
  { title: 'Foto Ke-1', pose: 'Senyum Manis & Pose Peace ✌️' },
  { title: 'Foto Ke-2', pose: 'Finger Heart K-Pop 🫰' },
  { title: 'Foto Ke-3', pose: 'Hati di Pipi (Cheek Heart) 🫶' },
  { title: 'Foto Ke-4', pose: 'Kedip Mata Ceria / Gaya Bebas 😉' },
];

export const CaptureStep: React.FC<CaptureStepProps> = ({
  sessionMode,
  countdownSeconds,
  selectedFilter,
  isMirrored,
  isDemoMode,
  videoRef,
  onCapturePhoto,
  onFinishSession,
  onCancel,
  singleRetakeIndex = null,
  onFinishSingleRetake,
}) => {
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(singleRetakeIndex ?? 0);
  const [timerCount, setTimerCount] = useState<number>(countdownSeconds);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Take the snapshot
  const triggerCapture = useCallback(() => {
    sounds.playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 600);

    const dataUrl = onCapturePhoto();
    if (!dataUrl) return;

    const newPhoto: CapturedPhoto = {
      id: singleRetakeIndex !== null ? singleRetakeIndex : currentIndex,
      dataUrl,
      timestamp: Date.now(),
      filterId: selectedFilter.id,
    };

    if (singleRetakeIndex !== null && onFinishSingleRetake) {
      onFinishSingleRetake(newPhoto);
      return;
    }

    const nextPhotos = [...capturedPhotos, newPhoto];
    setCapturedPhotos(nextPhotos);

    if (currentIndex < 3) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setTimerCount(countdownSeconds);
      }, 1200);
    } else {
      sounds.playSuccessChime();
      setTimeout(() => {
        onFinishSession(nextPhotos);
      }, 1400);
    }
  }, [
    capturedPhotos,
    currentIndex,
    countdownSeconds,
    onCapturePhoto,
    onFinishSession,
    onFinishSingleRetake,
    selectedFilter.id,
    singleRetakeIndex,
  ]);

  // Timer loop
  useEffect(() => {
    if (isPaused) return;

    if (timerCount > 0) {
      timerRef.current = window.setTimeout(() => {
        sounds.playCountdownBeep(timerCount === 1);
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      triggerCapture();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerCount, isPaused, triggerCapture]);

  const currentHint = singleRetakeIndex !== null
    ? { title: `Foto Ulang Ke-${singleRetakeIndex + 1}`, pose: 'Siapkan pose terbaikmu!' }
    : POSE_HINTS[currentIndex] || POSE_HINTS[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Session Progress Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            {singleRetakeIndex !== null
              ? `Mengulang Foto #${singleRetakeIndex + 1}`
              : `Foto ${currentIndex + 1} dari 4 (4컷 중 ${currentIndex + 1}번째)`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Lanjutkan' : 'Jeda'}</span>
          </button>

          <button
            onClick={onCancel}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-medium transition"
          >
            Batal
          </button>
        </div>
      </div>

      {/* Camera Live View Box with Flash */}
      <div className="relative w-full aspect-4/3 max-w-lg bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        {/* Live Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ filter: selectedFilter.cssFilter }}
          className={`w-full h-full object-cover transition-transform ${
            isMirrored ? 'scale-x-[-1]' : ''
          } ${!isDemoMode ? 'block' : 'hidden'}`}
        />

        {/* Demo Mode Animation Screen */}
        {isDemoMode && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200">
            <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl mb-3 animate-pulse">
              📸
            </div>
            <div className="px-3 py-1 rounded-full bg-white/90 text-pink-700 font-bold text-xs mb-1">
              PRATINJAU MODE DEMO
            </div>
            <p className="text-xs text-stone-600">Bersiap untuk foto #{currentIndex + 1}!</p>
          </div>
        )}

        {/* Shutter Screen Flash Effect */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-30 animate-flash pointer-events-none" />
        )}

        {/* Solo / Duo Guide Silhouettes */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {sessionMode === 'solo' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-32 h-44 border-2 border-dashed border-white rounded-full mt-4" />
              <div className="w-56 h-28 border-2 border-dashed border-white rounded-t-full -mt-2" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-around px-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-32 border-2 border-dashed border-white rounded-full" />
                <div className="w-36 h-20 border-2 border-dashed border-white rounded-t-full -mt-2" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-32 border-2 border-dashed border-white rounded-full" />
                <div className="w-36 h-20 border-2 border-dashed border-white rounded-t-full -mt-2" />
              </div>
            </div>
          )}
        </div>

        {/* Big Korean Countdown Timer Badge */}
        {!isFlashing && timerCount > 0 && !isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 rounded-full bg-stone-900/60 backdrop-blur-md border-4 border-pink-400 flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-6xl font-black text-white font-mono drop-shadow-md">
                {timerCount}
              </span>
            </div>
          </div>
        )}

        {/* Pause Banner */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
            <Pause className="w-12 h-12 text-pink-400 mb-2" />
            <p className="font-bold text-lg">Sesi Dijeda (Paused)</p>
            <p className="text-xs text-stone-300 mt-1 mb-4">Rapikan rambut atau siapkan gayamu!</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-2xl font-bold text-sm shadow-lg transition"
            >
              Lanjutkan Hitung Mundur ▶
            </button>
          </div>
        )}

        {/* Top Pose Recommendation Badge */}
        <div className="absolute top-3 inset-x-3 flex justify-center pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{currentHint.title}:</span>
            <span className="text-pink-300 font-bold">{currentHint.pose}</span>
          </div>
        </div>

        {/* Bottom Shutter Button (Manual Override) */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
          <div className="text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-xl">
            Filter: {selectedFilter.indoName || selectedFilter.name}
          </div>

          <button
            onClick={triggerCapture}
            className="w-14 h-14 rounded-full bg-white border-4 border-pink-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition"
            title="Ambil Foto Sekarang (Manual Shutter)"
          >
            <Camera className="w-6 h-6 text-pink-600" />
          </button>

          <div className="text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-xl">
            {sessionMode === 'solo' ? '👤 Sendiri' : '👯 Berdua'}
          </div>
        </div>
      </div>

      {/* Progress Thumbnails Bar (4 Slots) */}
      <div className="w-full max-w-lg mt-5 bg-white p-4 rounded-3xl border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Progres 4 Foto Strip
          </span>
          <span className="text-xs text-pink-600 font-bold">
            {capturedPhotos.length} / 4 Selesai
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((slotIdx) => {
            const photo = capturedPhotos.find((p) => p.id === slotIdx);
            const isCurrent = slotIdx === currentIndex && !photo;

            return (
              <div
                key={slotIdx}
                className={`relative aspect-4/3 rounded-2xl overflow-hidden border-2 transition flex items-center justify-center bg-stone-50 ${
                  isCurrent
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : photo
                    ? 'border-emerald-400'
                    : 'border-dashed border-stone-200'
                }`}
              >
                {photo ? (
                  <>
                    <img
                      src={photo.dataUrl}
                      alt={`Foto ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 p-0.5 bg-emerald-500 text-white rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </>
                ) : isCurrent ? (
                  <div className="flex flex-col items-center gap-1 text-pink-500 animate-pulse">
                    <Camera className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Mengambil...</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-stone-300">#{slotIdx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

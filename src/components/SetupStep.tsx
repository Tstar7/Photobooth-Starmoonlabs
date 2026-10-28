import React from 'react';
import {
  Camera,
  Users,
  User,
  Timer,
  FlipHorizontal,
  Sparkles,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import type { FilterOption, SessionMode } from '../types/photobooth';
import { FILTERS } from '../utils/constants';

interface SetupStepProps {
  sessionMode: SessionMode;
  onSetSessionMode: (mode: SessionMode) => void;
  countdownSeconds: number;
  onSetCountdownSeconds: (sec: number) => void;
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  isMirrored: boolean;
  isDemoMode: boolean;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onStartCamera: () => void;
  onStartDemoMode: () => void;
  onSwitchDevice: (deviceId: string) => void;
  onToggleMirror: () => void;
  onStartSession: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  sessionMode,
  onSetSessionMode,
  countdownSeconds,
  onSetCountdownSeconds,
  selectedFilter,
  onSelectFilter,
  isStreaming,
  isLoading,
  error,
  isMirrored,
  isDemoMode,
  devices,
  selectedDeviceId,
  onStartCamera,
  onStartDemoMode,
  onSwitchDevice,
  onToggleMirror,
  onStartSession,
  videoRef,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Pengalaman Photobooth Korea Estetik
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Buat Strip Foto 4-Cut Kamu Sendiri
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
          Ambil 4 foto ceria bersama teman atau sendiri, pilih bingkai pastel, tambahkan stiker lucu, dan unduh langsung!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Camera Preview & Permissions */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full relative aspect-4/3 max-w-md bg-stone-900 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex items-center justify-center">
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ filter: selectedFilter.cssFilter }}
              className={`w-full h-full object-cover transition-transform ${
                isMirrored ? 'scale-x-[-1]' : ''
              } ${isStreaming && !isDemoMode ? 'block' : 'hidden'}`}
            />

            {/* Demo Animation Screen */}
            {isDemoMode && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100">
                <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-4xl mb-3 animate-bounce">
                  ✨
                </div>
                <div className="px-3 py-1 rounded-full bg-white/80 text-pink-700 font-bold text-xs mb-2">
                  MODE DEMO AKTIF
                </div>
                <p className="text-xs text-stone-600 max-w-xs">
                  Kamera simulasi aktif. Anda dapat mencoba seluruh alur 4 foto, hitung mundur, edit stiker, dan langsung mengunduh hasil fotonya!
                </p>
              </div>
            )}

            {/* Placeholder / Permission Request */}
            {!isStreaming && !isDemoMode && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-300">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-stone-200">Menghubungkan kamera...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <AlertCircle className="w-12 h-12 text-rose-400" />
                    <p className="text-xs text-rose-200 max-w-xs">{error}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      <button
                        onClick={onStartCamera}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition shadow-md"
                      >
                        Coba Lagi
                      </button>
                      <button
                        onClick={onStartDemoMode}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition"
                      >
                        Gunakan Mode Demo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/10 rounded-full text-pink-400">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Izin Akses Kamera Diperlukan</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs">
                        Klik tombol di bawah untuk mengizinkan akses webcam browser Anda.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <button
                        onClick={onStartCamera}
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-bold transition shadow-lg flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" /> Izinkan Kamera
                      </button>
                      <button
                        onClick={onStartDemoMode}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-medium transition flex items-center gap-2"
                      >
                        <Wand2 className="w-4 h-4" /> Mode Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Overlays / Guide Silhouettes */}
            {isStreaming && (
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-3xl m-2">
                {sessionMode === 'solo' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                    <div className="w-32 h-44 border-2 border-dashed border-white rounded-full mt-4" />
                    <div className="w-56 h-28 border-2 border-dashed border-white rounded-t-full -mt-2" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-around opacity-30 px-6">
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
            )}

            {/* Camera Floating Toolbar */}
            {isStreaming && !isDemoMode && (
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={onToggleMirror}
                  className={`p-2 rounded-xl text-xs font-medium transition backdrop-blur-md ${
                    isMirrored
                      ? 'bg-pink-500/90 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title="Cerminkan Kamera (Flip Mirror)"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>

                {devices.length > 1 && (
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => onSwitchDevice(e.target.value)}
                    className="text-xs bg-black/60 text-white rounded-xl px-2.5 py-1.5 backdrop-blur-md border border-white/20 focus:outline-none max-w-[160px] truncate"
                  >
                    {devices.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId} className="bg-stone-900 text-white">
                        {d.label || `Kamera ${i + 1}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          {/* Quick Helper Label */}
          <p className="text-xs text-stone-500 mt-3 text-center">
            {sessionMode === 'solo'
              ? '👤 Mode Sendiri: Posisikan diri Anda tepat di tengah bingkai'
              : '👯 Mode Berdua: Dekatkan posisi bersama teman atau pasangan Anda!'}
          </p>
        </div>

        {/* Right Column: Settings (Session Mode, Timer, Filters) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Session Mode (Solo vs Duo) */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-xs">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
              Mode Sesi Foto
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSetSessionMode('solo')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border-2 transition text-center ${
                  sessionMode === 'solo'
                    ? 'border-pink-500 bg-pink-50/70 text-pink-700 shadow-xs'
                    : 'border-stone-100 hover:border-stone-200 text-stone-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${sessionMode === 'solo' ? 'bg-pink-200' : 'bg-stone-100'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">Foto Sendiri</span>
                  <span className="text-[11px] text-stone-400">Solo (1 Orang)</span>
                </div>
              </button>

              <button
                onClick={() => onSetSessionMode('duo')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border-2 transition text-center ${
                  sessionMode === 'duo'
                    ? 'border-pink-500 bg-pink-50/70 text-pink-700 shadow-xs'
                    : 'border-stone-100 hover:border-stone-200 text-stone-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${sessionMode === 'duo' ? 'bg-pink-200' : 'bg-stone-100'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">Foto Berdua</span>
                  <span className="text-[11px] text-stone-400">Duo (2 Orang)</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Countdown Timer */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Hitung Mundur (Timer)
              </label>
              <span className="text-xs text-pink-600 font-bold">{countdownSeconds} Detik</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onSetCountdownSeconds(sec)}
                  className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 transition ${
                    countdownSeconds === sec
                      ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-xs'
                      : 'border-stone-100 hover:border-stone-200 text-stone-600'
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>{sec} Detik</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Photo Filters */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Pilih Filter Awal
              </label>
              <span className="text-xs text-stone-600 font-medium">{selectedFilter.name}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {FILTERS.map((f) => {
                const isSelected = selectedFilter.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onSelectFilter(f)}
                    className={`p-2 rounded-2xl flex flex-col items-center gap-1 border-2 transition ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/70 text-pink-700 scale-102'
                        : 'border-stone-100 hover:border-stone-200 text-stone-600'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-inner border border-stone-200"
                      style={{ backgroundColor: f.previewColor }}
                    />
                    <span className="text-[11px] font-bold truncate max-w-full">{f.indoName || f.name}</span>
                    <span className="text-[9px] text-stone-400">{f.koreanName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA: Start Session Button */}
          <button
            onClick={() => {
              if (!isStreaming && !isDemoMode) {
                onStartCamera();
              } else {
                onStartSession();
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-pink-200 hover:shadow-xl transition flex items-center justify-center gap-2 transform active:scale-98"
          >
            <Camera className="w-5 h-5" />
            <span>Mulai Foto Sekarang (4-Cut Session)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

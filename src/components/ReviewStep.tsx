import React from 'react';
import { RotateCcw, ArrowRight, RefreshCw, CheckCircle2, Sparkles, ArrowLeftRight, Download } from 'lucide-react';
import type { CapturedPhoto } from '../types/photobooth';

interface ReviewStepProps {
  photos: CapturedPhoto[];
  onRetakeSingle: (index: number) => void;
  onRetakeAll: () => void;
  onProceedToCustomize: () => void;
  onSwapPhotos: (index1: number, index2: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  photos,
  onRetakeSingle,
  onRetakeAll,
  onProceedToCustomize,
  onSwapPhotos,
}) => {
  // Download single raw photo directly
  const downloadSinglePhoto = (photo: CapturedPhoto, index: number) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `foto-booth-shot-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all 4 photos directly
  const downloadAllSinglePhotos = () => {
    photos.forEach((photo, idx) => {
      setTimeout(() => {
        downloadSinglePhoto(photo, idx);
      }, idx * 250);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> 4 Foto Berhasil Diambil!
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Periksa Hasil Foto & Ulangi Jika Kurang Pas
        </h2>
        <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
          Kamu bisa mengunduh foto satuan langsung, mengulang salah satu foto jika berkedip, atau lanjut menghias strip!
        </p>

        {/* Quick Action: Download all raw photos */}
        <div className="mt-3">
          <button
            onClick={downloadAllSinglePhotos}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Unduh Langsung Ke-4 Foto Satuan (.jpg)</span>
          </button>
        </div>
      </div>

      {/* 4 Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative bg-white p-2.5 rounded-3xl border border-pink-100 shadow-xs hover:shadow-md transition flex flex-col items-center"
          >
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 mb-2.5 border border-stone-100">
              <img
                src={photo.dataUrl}
                alt={`Foto #${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                #{index + 1}
              </div>

              {/* Direct download button overlay */}
              <button
                onClick={() => downloadSinglePhoto(photo, index)}
                className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white transition shadow-sm"
                title="Unduh foto ini sekarang"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions for this individual photo */}
            <div className="w-full flex items-center justify-between gap-1 pt-1">
              <button
                onClick={() => onRetakeSingle(index)}
                className="flex-1 py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                title={`Foto ulang foto ke-${index + 1}`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>Foto Ulang</span>
              </button>

              {/* Quick shift/swap left if not first */}
              {index > 0 && (
                <button
                  onClick={() => onSwapPhotos(index, index - 1)}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs transition"
                  title="Tukar posisi ke kiri"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-pink-100">
        <button
          onClick={onRetakeAll}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Ulangi Semua 4 Foto</span>
        </button>

        <button
          onClick={onProceedToCustomize}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-extrabold shadow-lg shadow-pink-200 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lanjut Hias & Desain Strip Foto</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

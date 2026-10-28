import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  Copy,
  Sparkles,
  RotateCcw,
  Check,
  FileImage,
  Printer,
  Images,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type {
  CapturedPhoto,
  FilterOption,
  StickerItem,
  TemplateType,
  ThemeOption,
} from '../types/photobooth';
import { renderPhotoStrip } from '../utils/canvasRenderer';
import { PhotoStripCanvas } from './PhotoStripCanvas';

interface ExportStepProps {
  photos: CapturedPhoto[];
  template: TemplateType;
  theme: ThemeOption;
  customFrameColor: string;
  filter: FilterOption;
  caption: string;
  showDate: boolean;
  dateText: string;
  showBarcode: boolean;
  stickers: StickerItem[];
  onStartNewSession: () => void;
  onBackToCustomize: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  photos,
  template,
  theme,
  customFrameColor,
  filter,
  caption,
  showDate,
  dateText,
  showBarcode,
  stickers,
  onStartNewSession,
  onBackToCustomize,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');

  // Trigger celebration confetti on page load
  useEffect(() => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#38bdf8', '#facc15', '#a78bfa', '#fb923c'],
      });
    } catch {}
  }, []);

  // Generate high-resolution canvas blob or dataUrl
  const generateFullResCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    await renderPhotoStrip(canvas, {
      photos,
      template,
      theme,
      customFrameColor,
      filter,
      caption,
      showDate,
      dateText,
      showBarcode,
      stickers,
      outputScale: 1,
    });
    return canvas;
  };

  // Download high quality PNG or JPEG photo strip directly
  const handleDownload = async (format: 'png' | 'jpeg' = downloadFormat) => {
    setIsExporting(true);
    try {
      const canvas = await generateFullResCanvas();
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 0.95 : undefined;

      const dataUrl = canvas.toDataURL(mimeType, quality);
      const filename = `strip-photobooth-${dateText.replace(/[^0-9]/g, '-') || Date.now()}.${format}`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Gagal membuat gambar untuk diunduh.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download all 4 raw photos directly
  const handleDownloadRawPhotos = () => {
    photos.forEach((photo, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = photo.dataUrl;
        link.download = `foto-shot-${idx + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 250);
    });
  };

  // Native Web Share with fallback
  const handleShare = async () => {
    setIsExporting(true);
    try {
      const canvas = await generateFullResCanvas();

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsExporting(false);
          handleDownload();
          return;
        }

        const file = new File([blob], `strip-photobooth-${Date.now()}.png`, {
          type: 'image/png',
        });

        if (
          navigator.canShare &&
          navigator.canShare({ files: [file] }) &&
          navigator.share
        ) {
          try {
            await navigator.share({
              title: 'Strip Photobooth Estetik',
              text: 'Lihat hasil strip photo booth kita! 📸✨',
              files: [file],
            });
            setIsExporting(false);
            return;
          } catch (err: unknown) {
            if ((err as Error)?.name === 'AbortError') {
              setIsExporting(false);
              return;
            }
          }
        }

        handleCopyToClipboard();
        setIsExporting(false);
      }, 'image/png');
    } catch {
      setIsExporting(false);
      handleDownload();
    }
  };

  // Copy Image to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      const canvas = await generateFullResCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.clipboard && window.ClipboardItem) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            setCopiedToast(true);
            setTimeout(() => setCopiedToast(false), 3000);
            return;
          } catch {}
        }

        handleDownload();
      }, 'image/png');
    } catch {
      handleDownload();
    }
  };

  // Print directly
  const handlePrint = async () => {
    try {
      const canvas = await generateFullResCanvas();
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const dataUrl = canvas.toDataURL('image/png');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Strip Foto</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
              img { max-height: 95vh; max-width: 95vw; object-fit: contain; }
              @media print {
                body { margin: 0; }
                img { width: 100%; height: auto; max-height: none; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Strip Foto Kamu Sudah Siap!
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Simpan & Bagikan Kenangan Indah Ini
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
          Strip foto bergaya Korea siap diunduh dengan kualitas cetak ultra-tajam tanpa pecah!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: High-Res Photo Strip Preview */}
        <div className="md:col-span-6 flex flex-col items-center">
          <PhotoStripCanvas
            photos={photos}
            template={template}
            theme={theme}
            customFrameColor={customFrameColor}
            filter={filter}
            caption={caption}
            showDate={showDate}
            dateText={dateText}
            showBarcode={showBarcode}
            stickers={stickers}
            className="shadow-2xl ring-4 ring-pink-100 rounded-3xl"
          />

          <p className="text-[11px] text-stone-400 mt-3 text-center">
            Format Resmi Cetak Foto Booth • Kualitas HD Siap Cetak
          </p>
        </div>

        {/* Right: Download, Share & Actions */}
        <div className="md:col-span-6 space-y-4">
          {/* Format Selector Card */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Pilih Format Gambar
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setDownloadFormat('png')}
                className={`p-3 rounded-2xl border-2 transition text-left flex items-center gap-2.5 ${
                  downloadFormat === 'png'
                    ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold'
                    : 'border-stone-100 hover:border-stone-200 text-stone-600'
                }`}
              >
                <FileImage className="w-4 h-4 text-pink-500" />
                <div>
                  <div className="text-xs font-bold">PNG (Sangat Tajam)</div>
                  <div className="text-[10px] text-stone-400">Rekomendasi Terbaik</div>
                </div>
              </button>

              <button
                onClick={() => setDownloadFormat('jpeg')}
                className={`p-3 rounded-2xl border-2 transition text-left flex items-center gap-2.5 ${
                  downloadFormat === 'jpeg'
                    ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold'
                    : 'border-stone-100 hover:border-stone-200 text-stone-600'
                }`}
              >
                <FileImage className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold">JPEG (Ringan)</div>
                  <div className="text-[10px] text-stone-400">Ukuran File Kecil</div>
                </div>
              </button>
            </div>
          </div>

          {/* Primary Download CTA */}
          <button
            onClick={() => handleDownload()}
            disabled={isExporting}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-pink-200 hover:shadow-xl transition flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Unduh Strip Foto ({downloadFormat.toUpperCase()}) Langsung</span>
          </button>

          {/* Download 4 Raw Photos Button */}
          <button
            onClick={handleDownloadRawPhotos}
            className="w-full py-3 px-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-xs font-bold transition flex items-center justify-center gap-2 border border-pink-200"
          >
            <Images className="w-4 h-4 text-pink-600" />
            <span>Unduh Ke-4 Foto Satuan (.jpg) Terpisah</span>
          </button>

          {/* Share & Copy Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleShare}
              disabled={isExporting}
              className="py-3 px-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              <span>Bagikan (Share)</span>
            </button>

            <button
              onClick={handleCopyToClipboard}
              className="py-3 px-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              {copiedToast ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-purple-500" />
              )}
              <span>{copiedToast ? 'Tersalin!' : 'Salin Gambar'}</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Cetak Foto Fisik (Print)</span>
          </button>

          {/* Back & New Session */}
          <div className="pt-4 border-t border-pink-100 flex items-center justify-between gap-3">
            <button
              onClick={onBackToCustomize}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold px-2 py-1"
            >
              ← Ubah Desain Strip
            </button>

            <button
              onClick={onStartNewSession}
              className="px-4 py-2.5 rounded-2xl bg-pink-100/70 hover:bg-pink-200/80 text-pink-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Sesi Foto Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  LayoutGrid,
  Palette,
  Type,
  Smile,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Barcode,
  Trash2,
  Check,
} from 'lucide-react';
import type {
  CapturedPhoto,
  FilterOption,
  StickerItem,
  TemplateType,
  ThemeOption,
} from '../types/photobooth';
import { FILTERS, PRESET_STICKERS, THEMES } from '../utils/constants';
import { PhotoStripCanvas } from './PhotoStripCanvas';

interface CustomizeStepProps {
  photos: CapturedPhoto[];
  template: TemplateType;
  onSetTemplate: (t: TemplateType) => void;
  theme: ThemeOption;
  onSetTheme: (th: ThemeOption) => void;
  customFrameColor: string;
  onSetCustomFrameColor: (color: string) => void;
  filter: FilterOption;
  onSetFilter: (f: FilterOption) => void;
  caption: string;
  onSetCaption: (c: string) => void;
  showDate: boolean;
  onSetShowDate: (v: boolean) => void;
  dateText: string;
  onSetDateText: (d: string) => void;
  showBarcode: boolean;
  onSetShowBarcode: (v: boolean) => void;
  stickers: StickerItem[];
  onSetStickers: React.Dispatch<React.SetStateAction<StickerItem[]>>;
  onBackToReview: () => void;
  onProceedToExport: () => void;
}

const TEMPLATES = [
  {
    id: 'strip-4x1' as TemplateType,
    name: 'Strip Vertikal 4x1',
    sub: 'Format Klasik 4-Cut Korea',
    icon: (
      <div className="w-6 h-12 border-2 border-stone-800 rounded flex flex-col gap-0.5 p-0.5 justify-between">
        <div className="w-full h-2 bg-stone-300 rounded-xs" />
        <div className="w-full h-2 bg-stone-300 rounded-xs" />
        <div className="w-full h-2 bg-stone-300 rounded-xs" />
        <div className="w-full h-2 bg-stone-300 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'grid-2x2' as TemplateType,
    name: 'Kotak Grid 2x2',
    sub: 'Gaya Modern Photoism',
    icon: (
      <div className="w-10 h-10 border-2 border-stone-800 rounded grid grid-cols-2 gap-0.5 p-0.5">
        <div className="w-full h-full bg-stone-300 rounded-xs" />
        <div className="w-full h-full bg-stone-300 rounded-xs" />
        <div className="w-full h-full bg-stone-300 rounded-xs" />
        <div className="w-full h-full bg-stone-300 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'twin-4x1' as TemplateType,
    name: 'Strip Kembar 2 Lembar',
    sub: 'Dua Strip + Garis Gunting',
    icon: (
      <div className="w-12 h-12 border-2 border-stone-800 rounded flex gap-1 p-0.5 justify-around items-center">
        <div className="w-4 h-10 border border-stone-400 rounded-xs flex flex-col gap-0.5 p-0.5">
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
        </div>
        <div className="h-full border-r border-dashed border-stone-400" />
        <div className="w-4 h-10 border border-stone-400 rounded-xs flex flex-col gap-0.5 p-0.5">
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
          <div className="w-full h-1.5 bg-stone-300" />
        </div>
      </div>
    ),
  },
  {
    id: 'strip-1x4' as TemplateType,
    name: 'Horizontal 1x4',
    sub: 'Gaya Sinematik Memanjang',
    icon: (
      <div className="w-14 h-7 border-2 border-stone-800 rounded flex gap-0.5 p-0.5 items-center">
        <div className="w-2.5 h-full bg-stone-300 rounded-xs" />
        <div className="w-2.5 h-full bg-stone-300 rounded-xs" />
        <div className="w-2.5 h-full bg-stone-300 rounded-xs" />
        <div className="w-2.5 h-full bg-stone-300 rounded-xs" />
      </div>
    ),
  },
];

const PRESET_COLORS = [
  { name: 'Putih Bersih', hex: '#FFFFFF' },
  { name: 'Biru Haru', hex: '#D6EEF8' },
  { name: 'Pink Stroberi', hex: '#FFE2EC' },
  { name: 'Jeruk Segar', hex: '#FFE8D6' },
  { name: 'Kuning Mentega', hex: '#FEF9C3' },
  { name: 'Hijau Sage', hex: '#DCFCE7' },
  { name: 'Ungu Lilac', hex: '#EDE9FE' },
  { name: 'Hitam Gelap', hex: '#18181B' },
];

const QUICK_CAPTIONS = [
  'Kenangan Hari Ini 💖',
  'Momen Terbaik ✨',
  'Sahabat Selamanya 🌸',
  'Kencan Romantis ♥',
  'Senyum Ceria 📸',
  '인생네컷 (Life 4 Cuts)',
  'KEREN BANGET!',
];

export const CustomizeStep: React.FC<CustomizeStepProps> = ({
  photos,
  template,
  onSetTemplate,
  theme,
  onSetTheme,
  customFrameColor,
  onSetCustomFrameColor,
  filter,
  onSetFilter,
  caption,
  onSetCaption,
  showDate,
  onSetShowDate,
  dateText,
  onSetDateText,
  showBarcode,
  onSetShowBarcode,
  stickers,
  onSetStickers,
  onBackToReview,
  onProceedToExport,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'theme' | 'filter' | 'text' | 'stickers'>('template');
  const [selectedStickerEmoji, setSelectedStickerEmoji] = useState<string>(PRESET_STICKERS[0]);

  // Handle stamping sticker on canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== 'stickers') return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newSticker: StickerItem = {
      id: `${Date.now()}-${Math.random()}`,
      emoji: selectedStickerEmoji,
      x,
      y,
      size: 90,
      rotation: Math.floor(Math.random() * 30) - 15,
    };

    onSetStickers((prev) => [...prev, newSticker]);
  };

  const removeSticker = (id: string) => {
    onSetStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const clearStickers = () => {
    onSetStickers([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Hias & Personalisasi Strip Foto
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Pilih tata letak template, tema warna pastel, tulisan manis, dan tempelkan stiker kesukaanmu!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 flex flex-col items-center w-full">
            <div className="w-full flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Pratinjau Langsung (Live Preview)
              </span>
              {activeTab === 'stickers' && (
                <span className="text-xs text-pink-600 font-bold animate-pulse">
                  👉 Klik strip foto untuk tempel stiker!
                </span>
              )}
            </div>

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
              onCanvasClick={handleCanvasClick}
            />

            {stickers.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-xs text-stone-500">
                <span>{stickers.length} stiker ditempel</span>
                <button
                  onClick={clearStickers}
                  className="text-rose-500 hover:text-rose-700 underline font-medium"
                >
                  Hapus Semua
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls & Tabs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('template')}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'template'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tata Letak</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'theme'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Tema</span>
            </button>

            <button
              onClick={() => setActiveTab('filter')}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'filter'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Warna/Filter</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-blue-500" />
              <span>Teks/Tanggal</span>
            </button>

            <button
              onClick={() => setActiveTab('stickers')}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'stickers'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-rose-500" />
              <span>Stiker</span>
            </button>
          </div>

          {/* TAB 1: Template Selection */}
          {activeTab === 'template' && (
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800">Pilih Bentuk Strip Foto</h3>
                <p className="text-xs text-stone-500">Pilih susunan 4 foto yang paling kamu sukai</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = template === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => onSetTemplate(tmpl.id)}
                      className={`p-3.5 rounded-2xl border-2 transition flex items-center gap-3 text-left ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/70 text-pink-900 shadow-xs'
                          : 'border-stone-100 hover:border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="shrink-0">{tmpl.icon}</div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm">{tmpl.name}</div>
                        <div className="text-[11px] text-stone-500">{tmpl.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Theme Selection */}
          {activeTab === 'theme' && (
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800">Tema Estetik Khas Korea</h3>
                <p className="text-xs text-stone-500">Kombinasi warna bingkai dan ornamen khas booth Korea</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((th) => {
                  const isSelected = theme.id === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        onSetTheme(th);
                        onSetCustomFrameColor(th.frameColor);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition flex items-center gap-3 text-left ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/70 shadow-xs ring-1 ring-pink-300'
                          : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-2xl shadow-inner border border-black/10 shrink-0 flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: th.frameColor, color: th.textColor }}
                      >
                        {isSelected ? <Check className="w-5 h-5 text-pink-600" /> : '4Cut'}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-stone-900">
                          {th.indoName || th.name}
                        </div>
                        <div className="text-[11px] text-stone-500 leading-tight">
                          {th.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Colors & Photo Filter */}
          {activeTab === 'filter' && (
            <div className="space-y-4">
              {/* Frame Colors */}
              <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-800">Warna Latar Bingkai</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400">Pilih Bebas:</span>
                    <input
                      type="color"
                      value={customFrameColor}
                      onChange={(e) => onSetCustomFrameColor(e.target.value)}
                      className="w-6 h-6 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((col) => {
                    const isSelected = customFrameColor.toLowerCase() === col.hex.toLowerCase();
                    return (
                      <button
                        key={col.hex}
                        onClick={() => onSetCustomFrameColor(col.hex)}
                        className={`w-9 h-9 rounded-2xl border-2 shadow-xs transition flex items-center justify-center ${
                          isSelected ? 'border-pink-500 scale-110 shadow-sm' : 'border-stone-200'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {isSelected && (
                          <div className={`w-2 h-2 rounded-full ${col.hex === '#18181B' ? 'bg-white' : 'bg-pink-600'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-stone-800">Filter Warna Foto</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FILTERS.map((f) => {
                    const isSelected = filter.id === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => onSetFilter(f)}
                        className={`p-2.5 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold'
                            : 'border-stone-100 hover:border-stone-200 text-stone-600 font-medium'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full mx-auto mb-1.5 shadow-inner border border-stone-200"
                          style={{ backgroundColor: f.previewColor }}
                        />
                        <div className="text-xs">{f.indoName || f.name}</div>
                        <div className="text-[10px] text-stone-400">{f.koreanName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Caption & Date */}
          {activeTab === 'text' && (
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800">Tulisan & Tanggal Kenangan</h3>
                <p className="text-xs text-stone-500">Tuliskan pesan atau nama kalian di bagian bawah foto strip</p>
              </div>

              {/* Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600">Tulisan Bawah (Caption)</label>
                <input
                  type="text"
                  maxLength={40}
                  value={caption}
                  onChange={(e) => onSetCaption(e.target.value)}
                  placeholder="Contoh: Sahabat Selamanya 💖"
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              {/* Quick Caption Chips */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CAPTIONS.map((qc) => (
                  <button
                    key={qc}
                    onClick={() => onSetCaption(qc)}
                    className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-medium transition"
                  >
                    {qc}
                  </button>
                ))}
              </div>

              {/* Date Toggle & Input */}
              <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => onSetShowDate(e.target.checked)}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Tampilkan Tanggal</span>
                  </span>
                </label>

                {showDate && (
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => onSetDateText(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono text-stone-700 w-36"
                  />
                )}
              </div>

              {/* Barcode / Booth Tag Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBarcode}
                    onChange={(e) => onSetShowBarcode(e.target.checked)}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Barcode className="w-3.5 h-3.5 text-stone-400" />
                    <span>Tampilkan Barcode Estetik & Nomor Seri Booth</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: Stickers */}
          {activeTab === 'stickers' && (
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800">Koleksi Stiker Imut</h3>
                <p className="text-xs text-stone-500">
                  Pilih stiker di bawah, lalu <strong>klik di atas gambar strip foto</strong> untuk menempelkannya!
                </p>
              </div>

              {/* Preset Stickers Palette */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {PRESET_STICKERS.map((stk) => {
                  const isSelected = selectedStickerEmoji === stk;
                  return (
                    <button
                      key={stk}
                      onClick={() => setSelectedStickerEmoji(stk)}
                      className={`h-11 rounded-2xl flex items-center justify-center text-xl transition border ${
                        isSelected
                          ? 'border-pink-500 bg-pink-100 scale-110 shadow-xs'
                          : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {stk}
                    </button>
                  );
                })}
              </div>

              {/* Placed Stickers List */}
              {stickers.length > 0 && (
                <div className="pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-600">
                      Stiker yang Ditempel ({stickers.length})
                    </span>
                    <button
                      onClick={clearStickers}
                      className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Semua
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {stickers.map((stk) => (
                      <span
                        key={stk.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      >
                        <span>{stk.emoji}</span>
                        <button
                          onClick={() => removeSticker(stk.id)}
                          className="text-stone-400 hover:text-rose-500 text-xs ml-1 font-bold"
                          title="Hapus stiker ini"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              onClick={onBackToReview}
              className="px-5 py-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali Cek Foto</span>
            </button>

            <button
              onClick={onProceedToExport}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-extrabold shadow-lg shadow-pink-200 transition flex items-center gap-2"
            >
              <span>Selesai & Unduh Foto (Download)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

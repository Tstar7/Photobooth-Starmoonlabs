import React, { useEffect, useRef } from 'react';
import type { CapturedPhoto, FilterOption, StickerItem, TemplateType, ThemeOption } from '../types/photobooth';
import { renderPhotoStrip } from '../utils/canvasRenderer';

interface PhotoStripCanvasProps {
  photos: CapturedPhoto[];
  template: TemplateType;
  theme: ThemeOption;
  customFrameColor?: string;
  filter: FilterOption;
  caption: string;
  showDate: boolean;
  dateText: string;
  showBarcode: boolean;
  stickers: StickerItem[];
  onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  className?: string;
}

export const PhotoStripCanvas: React.FC<PhotoStripCanvasProps> = ({
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
  onCanvasClick,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPhotoStrip(canvas, {
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
    }).catch(() => {});
  }, [
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
  ]);

  return (
    <div className="relative inline-block select-none shadow-2xl rounded-2xl overflow-hidden border border-stone-200/60 bg-white">
      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className={`w-full max-h-[70vh] object-contain cursor-crosshair ${className}`}
      />
    </div>
  );
};

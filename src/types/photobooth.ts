export type SessionMode = 'solo' | 'duo';

export type TemplateType = 'strip-4x1' | 'grid-2x2' | 'twin-4x1' | 'strip-1x4';

export interface FilterOption {
  id: string;
  name: string;
  indoName?: string;
  koreanName: string;
  cssFilter: string;
  canvasFilter: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  previewColor: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  indoName?: string;
  koreanName: string;
  bgClass: string;
  frameColor: string;
  textColor: string;
  accentColor: string;
  borderStyle?: string;
  fontFamily: string;
  description: string;
  stampText?: string;
  decorations?: 'film' | 'hearts' | 'korean' | 'orange' | 'retro' | 'classic';
}

export interface StickerItem {
  id: string;
  emoji: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size: number; // scale px
  rotation: number; // degrees
}

export interface CapturedPhoto {
  id: number;
  dataUrl: string;
  timestamp: number;
  filterId: string;
}

export type BoothStep = 'setup' | 'capture' | 'review' | 'customize' | 'export';

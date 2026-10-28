import type { FilterOption, ThemeOption } from '../types/photobooth';

export const FILTERS: FilterOption[] = [
  {
    id: 'natural',
    name: 'Alami (Natural)',
    indoName: 'Alami',
    koreanName: '자연스러운',
    cssFilter: 'contrast(1.04) brightness(1.02)',
    canvasFilter: () => {},
    previewColor: '#e2e8f0',
  },
  {
    id: 'soft',
    name: 'Kilau Lembut (Soft Glow)',
    indoName: 'Kilau Lembut',
    koreanName: '소프트 글로우',
    cssFilter: 'brightness(1.08) contrast(0.96) saturate(1.08)',
    canvasFilter: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(255, 240, 245, 0.08)';
      ctx.fillRect(0, 0, width, height);
    },
    previewColor: '#fed7e2',
  },
  {
    id: 'warm',
    name: 'Nuansa Hangat (Warm Peach)',
    indoName: 'Nuansa Hangat',
    koreanName: '웜톤 피치',
    cssFilter: 'sepia(0.2) saturate(1.25) brightness(1.04) contrast(1.05)',
    canvasFilter: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(254, 215, 170, 0.07)';
      ctx.fillRect(0, 0, width, height);
    },
    previewColor: '#fbd38d',
  },
  {
    id: 'vintage',
    name: 'Film Jadul (Vintage Film)',
    indoName: 'Film Jadul',
    koreanName: '빈티지 필름',
    cssFilter: 'sepia(0.35) contrast(1.15) brightness(0.98) saturate(1.15)',
    canvasFilter: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.06)';
      ctx.fillRect(0, 0, width, height);
    },
    previewColor: '#d69e2e',
  },
  {
    id: 'noir',
    name: 'Noir Gelap (Noir Contrast)',
    indoName: 'Noir Gelap',
    koreanName: '느와르 콘트라스트',
    cssFilter: 'grayscale(1) contrast(1.4) brightness(0.95)',
    canvasFilter: () => {},
    previewColor: '#2d3748',
  },
  {
    id: 'grayscale',
    name: 'Hitam Putih (Classic B&W)',
    indoName: 'Hitam Putih',
    koreanName: '흑백 클래식',
    cssFilter: 'grayscale(1) contrast(1.08) brightness(1.02)',
    canvasFilter: () => {},
    previewColor: '#718096',
  },
  {
    id: 'cool',
    name: 'Biru Sejuk (Haru Sky Cool)',
    indoName: 'Biru Sejuk',
    koreanName: '쿨톤 스카이',
    cssFilter: 'hue-rotate(10deg) saturate(1.1) brightness(1.05) contrast(1.02)',
    canvasFilter: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.08)';
      ctx.fillRect(0, 0, width, height);
    },
    previewColor: '#bae6fd',
  },
];

export const THEMES: ThemeOption[] = [
  {
    id: 'classic',
    name: 'Putih Bersih (Classic Pure)',
    indoName: 'Putih Bersih',
    koreanName: '클래식 화이트',
    bgClass: 'bg-white',
    frameColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#9CA3AF',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    description: 'Bingkai putih minimalis modern yang bersih dan elegan',
    stampText: 'PHOTOBOOTH MEMORY',
    decorations: 'classic',
  },
  {
    id: 'korean',
    name: 'Haru Film Biru (Korean Aesthetic)',
    indoName: 'Haru Film Biru',
    koreanName: '하루 필름 블루',
    bgClass: 'bg-[#D6EEF8]',
    frameColor: '#D6EEF8',
    textColor: '#1E3A8A',
    accentColor: '#60A5FA',
    fontFamily: "'Noto Sans KR', sans-serif",
    description: 'Warna biru langit pastel khas photo booth Korea dengan aksen Hangul',
    stampText: '인생네컷 • 오늘의 우리',
    decorations: 'korean',
  },
  {
    id: 'heart',
    name: 'Susu Stroberi (Strawberry Milk)',
    indoName: 'Susu Stroberi',
    koreanName: '딸기 우유 하트',
    bgClass: 'bg-[#FFE2EC]',
    frameColor: '#FFE2EC',
    textColor: '#9D174D',
    accentColor: '#F472B6',
    fontFamily: "'Gaegu', cursive, sans-serif",
    description: 'Warna merah muda pastel manis bertabur hati untuk momen romantis',
    stampText: '♥ KITA HARI INI ♥',
    decorations: 'hearts',
  },
  {
    id: 'film',
    name: 'Roll Film 35mm (Vintage Film)',
    indoName: 'Roll Film 35mm',
    koreanName: '35mm 필름 롤',
    bgClass: 'bg-[#18181B]',
    frameColor: '#18181B',
    textColor: '#E4E4E7',
    accentColor: '#EAB308',
    fontFamily: "'Courier New', monospace",
    description: 'Gaya klise film 35mm asli lengkap dengan lubang gerigi dan nomor frame',
    stampText: 'KODAK 400TX • FRAME 24-27',
    decorations: 'film',
  },
  {
    id: 'orange',
    name: 'Jeruk Manis (Creamsicle Sunset)',
    indoName: 'Jeruk Manis',
    koreanName: '크림시클 오렌지',
    bgClass: 'bg-[#FFE8D6]',
    frameColor: '#FFE8D6',
    textColor: '#9A3412',
    accentColor: '#FB923C',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    description: 'Nuansa aprikot dan jeruk hangat penuh energi dan keceriaan',
    stampText: 'SENYUM CERIA ✨',
    decorations: 'orange',
  },
  {
    id: 'retro',
    name: 'Ungu Lilac Y2K (Retro 90s)',
    indoName: 'Ungu Lilac Y2K',
    koreanName: 'Y2K 레트로 퍼플',
    bgClass: 'bg-[#EDE9FE]',
    frameColor: '#EDE9FE',
    textColor: '#5B21B6',
    accentColor: '#A78BFA',
    fontFamily: "'Gaegu', cursive, sans-serif",
    description: 'Warna lavender estetik era 90-an dengan ornamen bintang retro',
    stampText: '★ KENANGAN SELAMANYA ★',
    decorations: 'retro',
  },
];

export const PRESET_STICKERS = [
  '💖', '🫰', '✌️', '✨', '🎀', '🍒', '⭐', '🐻', 
  '🐱', '🍓', '🍀', '🌸', '🪄', '☁️', '🎈', '🐾',
  'KEREN!', 'CANTIK', 'LUCU', 'BESTIE', 'SENYUM', 'LOVE',
  '대박', '인생샷', '귀여워',
];

export const POSING_TIPS = [
  { pose: 'Pose Peace', title: 'Pose Peace Klasik ✌️', tip: 'Angkat dua jari di dekat pipi sambil tersenyum manis!' },
  { pose: 'Finger Heart', title: 'Finger Heart K-Pop 🫰', tip: 'Silangkan jempol dan jari telunjuk di dekat dagu atau dada.' },
  { pose: 'Cheek Heart', title: 'Hati di Pipi (Cheek Heart) 🫶', tip: 'Bentuk setengah hati dengan telapak tangan dan tempelkan di pipi.' },
  { pose: 'Wink Ceria', title: 'Kedip Mata Ceria 😉', tip: 'Kedipkan satu mata, miringkan kepala sedikit dengan senyum ceria.' },
  { pose: 'Cakar Kucing / Beruang', title: 'Pose Kucing / Beruang Lucu 🐾', tip: 'Bentuk tangan seperti cakar gemas di samping pipi atau telinga.' },
  { pose: 'Peluk Pipi Berdua', title: 'Tempel Pipi Berdua (Duo) 👯', tip: 'Rapatkan kepala dengan pasangan atau sahabat, tatap kamera bersama!' },
];

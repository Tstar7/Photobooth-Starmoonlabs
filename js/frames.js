// Frame layouts (2 - 6 kotak) and cute themes
const LAYOUT_CONFIGS = {
  // 2 Kotak
  '2-vertical': {
    id: '2-vertical',
    count: 2,
    name: '2 Foto (Vertical Strip)',
    icon: '┃',
    cols: 1,
    rows: 2,
    aspectRatio: 3 / 4,
    containerClass: 'layout-grid-1x2',
    stripWidth: 400,
    stripHeight: 760,
    photoAspect: '4/3' // standard landscape or portrait
  },
  '2-horizontal': {
    id: '2-horizontal',
    count: 2,
    name: '2 Foto (Duo Grid)',
    icon: '〓',
    cols: 2,
    rows: 1,
    aspectRatio: 4 / 3,
    containerClass: 'layout-grid-2x1',
    stripWidth: 640,
    stripHeight: 450,
    photoAspect: '3/4'
  },

  // 3 Kotak
  '3-vertical': {
    id: '3-vertical',
    count: 3,
    name: '3 Foto (Chic Strip)',
    icon: '⦀',
    cols: 1,
    rows: 3,
    aspectRatio: 3 / 4,
    containerClass: 'layout-grid-1x3',
    stripWidth: 400,
    stripHeight: 960,
    photoAspect: '4/3'
  },

  // 4 Kotak
  '4-vertical': {
    id: '4-vertical',
    count: 4,
    name: '4 Foto (Classic 4-Cuts Strip)',
    icon: '🀰',
    cols: 1,
    rows: 4,
    aspectRatio: 3 / 4,
    containerClass: 'layout-grid-1x4',
    stripWidth: 400,
    stripHeight: 1180,
    photoAspect: '4/3'
  },
  '4-grid': {
    id: '4-grid',
    count: 4,
    name: '4 Foto (2x2 Square Grid)',
    icon: '⊞',
    cols: 2,
    rows: 2,
    aspectRatio: 4 / 3,
    containerClass: 'layout-grid-2x2',
    stripWidth: 600,
    stripHeight: 700,
    photoAspect: '4/3'
  },

  // 5 Kotak
  '5-collage': {
    id: '5-collage',
    count: 5,
    name: '5 Foto (1 Hero + 4 Mini)',
    icon: '☵',
    special: 'hero-4mini',
    aspectRatio: 4 / 3,
    containerClass: 'layout-grid-5-hero',
    stripWidth: 600,
    stripHeight: 880,
    photoAspect: '4/3'
  },
  '5-vertical': {
    id: '5-vertical',
    count: 5,
    name: '5 Foto (Long Strip)',
    icon: '☰',
    cols: 1,
    rows: 5,
    aspectRatio: 3 / 4,
    containerClass: 'layout-grid-1x5',
    stripWidth: 380,
    stripHeight: 1350,
    photoAspect: '4/3'
  },

  // 6 Kotak
  '6-grid': {
    id: '6-grid',
    count: 6,
    name: '6 Foto (2x3 Double Strip)',
    icon: '⚏',
    cols: 2,
    rows: 3,
    aspectRatio: 4 / 3,
    containerClass: 'layout-grid-2x3',
    stripWidth: 620,
    stripHeight: 960,
    photoAspect: '4/3'
  },
  '6-horizontal': {
    id: '6-horizontal',
    count: 6,
    name: '6 Foto (3x2 Wide Grid)',
    icon: '▦',
    cols: 3,
    rows: 2,
    aspectRatio: 4 / 3,
    containerClass: 'layout-grid-3x2',
    stripWidth: 720,
    stripHeight: 620,
    photoAspect: '4/3'
  },
  '6-vertical': {
    id: '6-vertical',
    count: 6,
    name: '6 Foto (Mega Strip)',
    icon: '🝰',
    cols: 1,
    rows: 6,
    aspectRatio: 3 / 4,
    containerClass: 'layout-grid-1x6',
    stripWidth: 380,
    stripHeight: 1550,
    photoAspect: '4/3'
  }
};

// Cute Frame Themes
const FRAME_THEMES = [
  {
    id: 'coquette-pink',
    name: '🎀 Coquette Pink',
    category: 'cute',
    bg: '#ffe4ec',
    border: '#f472b6',
    textColor: '#be185d',
    subTextColor: '#ec4899',
    badge: 'Trending',
    cardStyle: 'background: linear-gradient(135deg, #fff0f5 0%, #fed7e2 100%); border: 3px solid #f9a8d4;',
    doodles: [
      { text: '🎀', x: '8%', y: '2%', size: '26px' },
      { text: '♡', x: '90%', y: '3%', size: '20px' },
      { text: '✨', x: '4%', y: '95%', size: '18px' },
      { text: '🎀', x: '88%', y: '94%', size: '24px' }
    ],
    footerIcon: '୨୧ Starmon Sweetheart ୨୧'
  },
  {
    id: 'y2k-cyber',
    name: '⭐ Y2K Silver Star',
    category: 'retro',
    bg: '#181829',
    border: '#a78bfa',
    textColor: '#c084fc',
    subTextColor: '#818cf8',
    badge: 'Popular',
    cardStyle: 'background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); border: 3px solid #818cf8; box-shadow: 0 0 15px rgba(167, 139, 250, 0.4);',
    doodles: [
      { text: '★', x: '8%', y: '2%', size: '24px' },
      { text: '✧', x: '90%', y: '2.5%', size: '22px' },
      { text: '˚₊‧', x: '10%', y: '95%', size: '18px' },
      { text: '★', x: '90%', y: '95%', size: '22px' }
    ],
    footerIcon: '★ 2000s CYBER ANGEL ★'
  },
  {
    id: 'teddy-bear',
    name: '🧸 Warm Teddy',
    category: 'cute',
    bg: '#fdf6ec',
    border: '#d4a373',
    textColor: '#78350f',
    subTextColor: '#a16207',
    badge: 'Cute',
    cardStyle: 'background: #faedcd; border: 3px dashed #bc6c25;',
    doodles: [
      { text: '🧸', x: '8%', y: '2%', size: '26px' },
      { text: '🐾', x: '88%', y: '3%', size: '20px' },
      { text: '☕', x: '6%', y: '95%', size: '20px' },
      { text: '🧸', x: '88%', y: '94%', size: '24px' }
    ],
    footerIcon: 'ʕ•ᴥ•ʔ fluffy teddy days'
  },
  {
    id: 'neko-kawaii',
    name: '🐱 Neko Kitty',
    category: 'cute',
    bg: '#fff1f2',
    border: '#fb7185',
    textColor: '#e11d48',
    subTextColor: '#f43f5e',
    badge: 'Bestie',
    cardStyle: 'background: linear-gradient(180deg, #fff5f5 0%, #fed7aa 100%); border: 3px solid #fb7185;',
    doodles: [
      { text: '🐱', x: '7%', y: '2%', size: '26px' },
      { text: '🐾', x: '90%', y: '2%', size: '20px' },
      { text: '🐟', x: '8%', y: '95%', size: '20px' },
      { text: 'ฅ^•ﻌ•^ฅ', x: '84%', y: '95%', size: '16px' }
    ],
    footerIcon: '₍ᐢ. ̫.ᐢ₎ nya~ meow meow ♡'
  },
  {
    id: 'sakura-blossom',
    name: '🌸 Sakura Dream',
    category: 'aesthetic',
    bg: '#fdf2f8',
    border: '#f472b6',
    textColor: '#db2777',
    subTextColor: '#f472b6',
    badge: 'Pastel',
    cardStyle: 'background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%); border: 3px solid #f9a8d4;',
    doodles: [
      { text: '🌸', x: '8%', y: '2%', size: '24px' },
      { text: '🍡', x: '90%', y: '2%', size: '22px' },
      { text: '🌸', x: '6%', y: '95%', size: '22px' },
      { text: '💮', x: '90%', y: '95%', size: '20px' }
    ],
    footerIcon: '🌸 SAKURA HARU FILM 🌸'
  },
  {
    id: 'korean-minimal-black',
    name: '🖤 Korean Chic Noir',
    category: 'minimal',
    bg: '#111827',
    border: '#374151',
    textColor: '#f9fafb',
    subTextColor: '#9ca3af',
    badge: 'Classy',
    cardStyle: 'background: #0f172a; border: 2px solid #334155; color: #fff;',
    doodles: [
      { text: '///', x: '8%', y: '2%', size: '18px' },
      { text: '№ 028', x: '84%', y: '2.5%', size: '14px' },
      { text: '❚█║▌║', x: '8%', y: '95%', size: '16px' },
      { text: '4-CUTS', x: '82%', y: '95%', size: '13px' }
    ],
    footerIcon: 'PHOTOISM STUDIO · SEOUL'
  },
  {
    id: 'retro-analog-film',
    name: '🎞️ Vintage Kodak Film',
    category: 'retro',
    bg: '#27201c',
    border: '#d97706',
    textColor: '#f59e0b',
    subTextColor: '#b45309',
    badge: 'Retro',
    cardStyle: 'background: #1c1917; border: 3px solid #b45309;',
    doodles: [
      { text: '▶ KODAK 400', x: '6%', y: '2%', size: '12px' },
      { text: 'ISO 200', x: '82%', y: '2%', size: '12px' },
      { text: '28·10·26', x: '6%', y: '95%', size: '14px' },
      { text: '36 EXP', x: '84%', y: '95%', size: '12px' }
    ],
    footerIcon: 'ANALOG FILM ARCHIVE · 1998'
  },
  {
    id: 'strawberry-milk',
    name: '🍓 Strawberry Milk',
    category: 'cute',
    bg: '#ffe4e6',
    border: '#e11d48',
    textColor: '#be123c',
    subTextColor: '#fb7185',
    badge: 'Sweet',
    cardStyle: 'background: radial-gradient(circle, #fff1f2 10%, #fecdd3 90%); border: 3px solid #fda4af;',
    doodles: [
      { text: '🍓', x: '8%', y: '2%', size: '24px' },
      { text: '🥛', x: '88%', y: '2%', size: '22px' },
      { text: '🍓', x: '7%', y: '95%', size: '22px' },
      { text: '🍓', x: '89%', y: '95%', size: '24px' }
    ],
    footerIcon: '🍓 100% Sweet Strawberry Milk'
  },
  {
    id: 'midnight-starlight',
    name: '🌌 Starlight Galaxy',
    category: 'aesthetic',
    bg: '#0c0a27',
    border: '#6366f1',
    textColor: '#e0e7ff',
    subTextColor: '#a5b4fc',
    badge: 'Dreamy',
    cardStyle: 'background: linear-gradient(180deg, #0b092b 0%, #1e1b4b 60%, #312e81 100%); border: 3px solid #818cf8;',
    doodles: [
      { text: '🌙', x: '8%', y: '2%', size: '22px' },
      { text: '✨', x: '88%', y: '2%', size: '20px' },
      { text: '🪐', x: '7%', y: '95%', size: '22px' },
      { text: '⭐', x: '90%', y: '95%', size: '20px' }
    ],
    footerIcon: '✧.* You are my Universe *.✧'
  },
  {
    id: 'pastel-cloud',
    name: '☁️ Cloud & Rainbow',
    category: 'cute',
    bg: '#e0f2fe',
    border: '#38bdf8',
    textColor: '#0369a1',
    subTextColor: '#38bdf8',
    badge: 'Pastel',
    cardStyle: 'background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #fef08a 100%); border: 3px solid #7dd3fc;',
    doodles: [
      { text: '☁️', x: '8%', y: '2%', size: '24px' },
      { text: '🌈', x: '88%', y: '2%', size: '22px' },
      { text: '🌻', x: '7%', y: '95%', size: '20px' },
      { text: '☁️', x: '88%', y: '95%', size: '24px' }
    ],
    footerIcon: '☁️ dreaming in pastel skies ☁️'
  },
  {
    id: 'matcha-latte',
    name: '🍵 Matcha Mint',
    category: 'aesthetic',
    bg: '#f0fdf4',
    border: '#86efac',
    textColor: '#166534',
    subTextColor: '#4ade80',
    badge: 'Fresh',
    cardStyle: 'background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 3px solid #86efac;',
    doodles: [
      { text: '🌿', x: '8%', y: '2%', size: '22px' },
      { text: '🍵', x: '88%', y: '2%', size: '22px' },
      { text: '🌱', x: '7%', y: '95%', size: '20px' },
      { text: '🍀', x: '88%', y: '95%', size: '22px' }
    ],
    footerIcon: '🍵 sweet matcha moment 🍵'
  },
  {
    id: 'lavender-dream',
    name: '💜 Lavender Bliss',
    category: 'aesthetic',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    textColor: '#6b21a8',
    subTextColor: '#a855f7',
    badge: 'Sweet',
    cardStyle: 'background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%); border: 3px solid #c4b5fd;',
    doodles: [
      { text: '🦋', x: '8%', y: '2%', size: '22px' },
      { text: '💜', x: '88%', y: '2%', size: '20px' },
      { text: '✨', x: '7%', y: '95%', size: '20px' },
      { text: '🦋', x: '88%', y: '95%', size: '22px' }
    ],
    footerIcon: '🦋 purple haze & sweet dreams'
  },
  {
    id: 'sunset-peach',
    name: '🍑 Peach Sunset',
    category: 'aesthetic',
    bg: '#fff7ed',
    border: '#fdba74',
    textColor: '#c2410c',
    subTextColor: '#f97316',
    badge: 'Warm',
    cardStyle: 'background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fecdd3 100%); border: 3px solid #fdba74;',
    doodles: [
      { text: '🍑', x: '8%', y: '2%', size: '24px' },
      { text: '🌅', x: '88%', y: '2%', size: '22px' },
      { text: '🧡', x: '7%', y: '95%', size: '20px' },
      { text: '🍑', x: '88%', y: '95%', size: '24px' }
    ],
    footerIcon: '🍑 golden hour glow 🍑'
  },
  {
    id: 'pixel-arcade',
    name: '👾 Pixel 8-Bit',
    category: 'retro',
    bg: '#1e1b4b',
    border: '#ec4899',
    textColor: '#f43f5e',
    subTextColor: '#38bdf8',
    badge: '8-Bit',
    cardStyle: 'background: #0f172a; border: 4px solid #f43f5e; box-shadow: 4px 4px 0 #38bdf8;',
    doodles: [
      { text: '👾', x: '8%', y: '2%', size: '22px' },
      { text: '❤️', x: '88%', y: '2%', size: '20px' },
      { text: '🕹️', x: '7%', y: '95%', size: '22px' },
      { text: 'LVL.99', x: '80%', y: '95%', size: '14px' }
    ],
    footerIcon: '🎮 PRESS START · STARMON LABS'
  },
  {
    id: 'clean-polaroid',
    name: '🤍 Minimal Polaroid',
    category: 'minimal',
    bg: '#ffffff',
    border: '#e5e7eb',
    textColor: '#374151',
    subTextColor: '#9ca3af',
    badge: 'Clean',
    cardStyle: 'background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,0.06);',
    doodles: [
      { text: '♡', x: '8%', y: '2%', size: '18px' },
      { text: '★', x: '90%', y: '2%', size: '16px' },
      { text: 'smile!', x: '6%', y: '95%', size: '14px' },
      { text: '♡', x: '90%', y: '95%', size: '18px' }
    ],
    footerIcon: 'MEMORIES ARE FOREVER ♡'
  },
  {
    id: 'custom-color',
    name: '🎨 Warna Custom',
    category: 'custom',
    bg: '#ffb5a7',
    border: '#f38375',
    textColor: '#333333',
    subTextColor: '#666666',
    badge: 'DIY',
    cardStyle: 'background: #ffb5a7; border: 3px solid #f38375;',
    doodles: [],
    footerIcon: 'STARMON PHOTOBOOTH'
  },

  // ──────────────── 7 FRAME SPESIAL SCRAPBOOK KAMU ────────────────
  {
    id: 'custom-maruko',
    name: '🍭 Chibi Maruko Scrapbook',
    category: 'custom-user',
    bg: '#fff8eb',
    border: '#fb923c',
    textColor: '#c2410c',
    subTextColor: '#ea580c',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/chibi-maruko-scrapbook.png',
    originalDimensions: { w: 887, h: 1774 },
    aspectRatio: 887 / 1774,
    slotCount: 3,
    cardStyle: "background: linear-gradient(rgba(255,248,235,0.85), rgba(255,248,235,0.85)), url('frames/chibi-maruko-scrapbook.png') center/cover; border: 3px solid #f97316; box-shadow: 0 4px 12px rgba(249,115,22,0.25);",
    slots: [
      { x: 20.74, y: 11.95, w: 58.62, h: 24.35 },
      { x: 20.74, y: 39.23, w: 58.62, h: 23.22 },
      { x: 21.20, y: 65.61, w: 57.72, h: 23.90 }
    ],
    doodles: [],
    footerIcon: 'ちびまる子ちゃん ♡ Maruko Scrapbook'
  },
  {
    id: 'custom-haechan',
    name: '☀️ Haechan HBD Scrapbook',
    category: 'custom-user',
    bg: '#0f0c29',
    border: '#facc15',
    textColor: '#fef08a',
    subTextColor: '#fde047',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/haechan-hbd-scrapbook.png',
    originalDimensions: { w: 1024, h: 1536 },
    aspectRatio: 1024 / 1536,
    slotCount: 4,
    cardStyle: "background: linear-gradient(rgba(15,12,41,0.8), rgba(15,12,41,0.8)), url('frames/haechan-hbd-scrapbook.png') center/cover; border: 3px solid #facc15; box-shadow: 0 4px 12px rgba(250,204,21,0.3);",
    slots: [
      { x: 30.47, y: 12.50, w: 39.45, h: 18.75 },
      { x: 32.03, y: 31.77, w: 38.67, h: 19.01 },
      { x: 32.42, y: 51.56, w: 38.28, h: 17.97 },
      { x: 33.20, y: 74.74, w: 39.45, h: 16.67 }
    ],
    doodles: [],
    footerIcon: '☀️ HAPPY HAECHAN DAY · FULL SUN'
  },
  {
    id: 'custom-kawaii-hbd-1',
    name: '🎂 Pastel Memories 4-Cut',
    category: 'custom-user',
    bg: '#fff5f8',
    border: '#f472b6',
    textColor: '#be185d',
    subTextColor: '#ec4899',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/kawaii-pastel-hbd-1.png',
    originalDimensions: { w: 550, h: 1024 },
    aspectRatio: 550 / 1024,
    slotCount: 4,
    cardStyle: "background: linear-gradient(rgba(255,245,248,0.85), rgba(255,245,248,0.85)), url('frames/kawaii-pastel-hbd-1.png') center/cover; border: 3px solid #f472b6; box-shadow: 0 4px 12px rgba(244,114,182,0.25);",
    slots: [
      { x: 18.18, y: 6.25, w: 46.55, h: 19.53 },
      { x: 22.55, y: 26.56, w: 48.73, h: 17.19 },
      { x: 25.45, y: 45.31, w: 48.00, h: 19.14 },
      { x: 27.64, y: 65.62, w: 39.27, h: 12.11 }
    ],
    doodles: [],
    footerIcon: '🎂 Happy Birthday Sweet Memories ♡'
  },
  {
    id: 'custom-kawaii-hbd-2',
    name: '💖 Pastel Sweet 3-Cut',
    category: 'custom-user',
    bg: '#fff5f8',
    border: '#fb7185',
    textColor: '#be185d',
    subTextColor: '#ec4899',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/kawaii-pastel-hbd-2.png',
    originalDimensions: { w: 545, h: 1024 },
    aspectRatio: 545 / 1024,
    slotCount: 3,
    cardStyle: "background: linear-gradient(rgba(255,245,248,0.85), rgba(255,245,248,0.85)), url('frames/kawaii-pastel-hbd-2.png') center/cover; border: 3px solid #fb7185; box-shadow: 0 4px 12px rgba(251,113,133,0.25);",
    slots: [
      { x: 16.88, y: 7.42, w: 51.38, h: 24.61 },
      { x: 19.82, y: 33.20, w: 54.31, h: 28.12 },
      { x: 23.49, y: 62.50, w: 53.58, h: 22.66 }
    ],
    doodles: [],
    footerIcon: '💖 Kawaii Sweet Memories ♡'
  },
  {
    id: 'custom-gemini-strip-1',
    name: '✨ Aesthetic Pastel 4-Cut',
    category: 'custom-user',
    bg: '#fdf2f8',
    border: '#fb7185',
    textColor: '#9f1239',
    subTextColor: '#e11d48',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/gemini-aesthetic-strip-1.png',
    originalDimensions: { w: 592, h: 1792 },
    aspectRatio: 592 / 1792,
    slotCount: 4,
    cardStyle: "background: linear-gradient(rgba(253,242,248,0.85), rgba(253,242,248,0.85)), url('frames/gemini-aesthetic-strip-1.png') center/cover; border: 3px solid #fb7185; box-shadow: 0 4px 12px rgba(251,113,133,0.25);",
    slots: [
      { x: 12.84, y: 12.00, w: 73.82, h: 17.30 },
      { x: 12.84, y: 32.37, w: 73.82, h: 17.30 },
      { x: 12.84, y: 52.96, w: 73.82, h: 17.30 },
      { x: 12.84, y: 73.55, w: 73.82, h: 17.30 }
    ],
    doodles: [],
    footerIcon: '✨ Aesthetic Moments · Life4Cuts'
  },
  {
    id: 'custom-gemini-strip-2',
    name: '🌸 Cutie Strip 3-Cut',
    category: 'custom-user',
    bg: '#f0fdfa',
    border: '#2dd4bf',
    textColor: '#115e59',
    subTextColor: '#0d9488',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/gemini-aesthetic-strip-2.png',
    originalDimensions: { w: 624, h: 1678 },
    aspectRatio: 624 / 1678,
    slotCount: 3,
    cardStyle: "background: linear-gradient(rgba(240,253,250,0.85), rgba(240,253,250,0.85)), url('frames/gemini-aesthetic-strip-2.png') center/cover; border: 3px solid #2dd4bf; box-shadow: 0 4px 12px rgba(45,212,191,0.25);",
    slots: [
      { x: 16.35, y: 16.57, w: 65.71, h: 17.16 },
      { x: 16.35, y: 38.80, w: 65.71, h: 15.97 },
      { x: 16.35, y: 59.06, w: 65.71, h: 16.15 }
    ],
    doodles: [],
    footerIcon: '🌸 Soft & Cute Photobooth Day'
  },
  {
    id: 'custom-gemini-strip-3',
    name: '🧸 Lovely Ribbon 4-Cut',
    category: 'custom-user',
    bg: '#fefce8',
    border: '#facc15',
    textColor: '#854d0e',
    subTextColor: '#ca8a04',
    badge: 'Koleksi Kamu ✨',
    isOverlayImage: true,
    overlaySrc: 'frames/gemini-aesthetic-strip-3.png',
    originalDimensions: { w: 592, h: 1792 },
    aspectRatio: 592 / 1792,
    slotCount: 4,
    cardStyle: "background: linear-gradient(rgba(254,252,232,0.85), rgba(254,252,232,0.85)), url('frames/gemini-aesthetic-strip-3.png') center/cover; border: 3px solid #facc15; box-shadow: 0 4px 12px rgba(250,204,21,0.25);",
    slots: [
      { x: 12.84, y: 19.98, w: 73.82, h: 16.46 },
      { x: 12.84, y: 38.95, w: 73.82, h: 16.46 },
      { x: 12.84, y: 57.98, w: 73.82, h: 16.46 },
      { x: 12.84, y: 75.95, w: 73.82, h: 16.46 }
    ],
    doodles: [],
    footerIcon: '🧸 Sweet Love & Precious Memories'
  },

  // ──────────────── THEMED FRAMES ────────────────
  {
    id: 'chibi-maruko',
    name: '🍭 Chibi Maruko Classic',
    category: 'anime',
    bg: '#fffbf0',
    border: '#f97316',
    textColor: '#c2410c',
    subTextColor: '#ea580c',
    badge: 'Anime',
    cardStyle: 'background: linear-gradient(160deg, #fffbf0 0%, #fef3c7 40%, #fed7aa 100%); border: 4px solid #fb923c;',
    doodles: [
      { text: '🌸', x: '7%',  y: '2%',  size: '22px' },
      { text: '⭐', x: '91%', y: '2%',  size: '20px' },
      { text: '🌼', x: '5%',  y: '95%', size: '20px' },
      { text: '🍭', x: '91%', y: '95%', size: '22px' }
    ],
    footerIcon: '✿ Chibi Maruko-chan · いつも笑顔で ✿'
  },
  {
    id: 'haechan-nct',
    name: '🌙 Haechan NCT Full Sun',
    category: 'kpop',
    bg: '#0a0a1a',
    border: '#facc15',
    textColor: '#fef9c3',
    subTextColor: '#fde047',
    badge: 'K-Pop',
    cardStyle: 'background: linear-gradient(160deg, #0f0f2e 0%, #1a0a3e 50%, #0f172a 100%); border: 3px solid #facc15; box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);',
    doodles: [
      { text: '🌙', x: '7%',  y: '2%',  size: '22px' },
      { text: '✦',  x: '91%', y: '2%',  size: '20px' },
      { text: '★',  x: '6%',  y: '95%', size: '20px' },
      { text: 'NCT✧', x: '82%', y: '95%', size: '13px' }
    ],
    footerIcon: '🌙 NCT DREAM · 천사야 · HAECHAN ✧'
  },
  {
    id: 'sanrio-hello',
    name: '🎀 Sanrio Kawaii',
    category: 'anime',
    bg: '#fff0f8',
    border: '#f9a8d4',
    textColor: '#be185d',
    subTextColor: '#ec4899',
    badge: 'Sanrio',
    cardStyle: 'background: linear-gradient(135deg, #fff0f8 0%, #ffe4f0 50%, #fce7f3 100%); border: 3px dashed #f9a8d4;',
    doodles: [
      { text: '🎀', x: '7%',  y: '2%',  size: '24px' },
      { text: '★',  x: '91%', y: '2%',  size: '18px' },
      { text: '♡',  x: '6%',  y: '95%', size: '20px' },
      { text: '🌟', x: '91%', y: '95%', size: '20px' }
    ],
    footerIcon: '˚ₓ。 SANRIO UNIVERSE ·₊˚⊹♡'
  },
  {
    id: 'summer-beach',
    name: '🌊 Summer Beach',
    category: 'aesthetic',
    bg: '#ecfeff',
    border: '#22d3ee',
    textColor: '#0e7490',
    subTextColor: '#06b6d4',
    badge: 'Vibe',
    cardStyle: 'background: linear-gradient(180deg, #ecfeff 0%, #cffafe 40%, #a5f3fc 100%); border: 3px solid #67e8f9;',
    doodles: [
      { text: '🌊', x: '7%',  y: '2%',  size: '24px' },
      { text: '☀️', x: '91%', y: '2%',  size: '22px' },
      { text: '🐚', x: '6%',  y: '95%', size: '22px' },
      { text: '🌴', x: '90%', y: '95%', size: '22px' }
    ],
    footerIcon: '🌊 summer memories never fade 🌴'
  },
  {
    id: 'kpop-idol',
    name: '💿 K-Pop Idol Card',
    category: 'kpop',
    bg: '#1a1a2e',
    border: '#e879f9',
    textColor: '#fdf4ff',
    subTextColor: '#e879f9',
    badge: 'K-Pop',
    cardStyle: 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border: 3px solid #c026d3; box-shadow: 0 0 18px rgba(192,38,211,0.35);',
    doodles: [
      { text: '💿', x: '7%',  y: '2%',  size: '22px' },
      { text: '✦',  x: '91%', y: '2%',  size: '20px' },
      { text: '♡',  x: '6%',  y: '95%', size: '20px' },
      { text: 'IDOL', x: '82%', y: '95%', size: '13px' }
    ],
    footerIcon: '💿 YOUR PERSONAL IDOL PHOTOCARD ♡'
  },
  {
    id: 'doraemon-blue',
    name: '🔵 Doraemon Blue',
    category: 'anime',
    bg: '#eff6ff',
    border: '#3b82f6',
    textColor: '#1d4ed8',
    subTextColor: '#3b82f6',
    badge: 'Anime',
    cardStyle: 'background: linear-gradient(160deg, #eff6ff 0%, #dbeafe 60%, #bfdbfe 100%); border: 4px solid #60a5fa;',
    doodles: [
      { text: '🔔', x: '7%',  y: '2%',  size: '22px' },
      { text: '⭐', x: '91%', y: '2%',  size: '20px' },
      { text: '🐟', x: '6%',  y: '95%', size: '20px' },
      { text: '🎵', x: '90%', y: '95%', size: '20px' }
    ],
    footerIcon: '🔵 DOKODEMO DOOR · どこでもドア 🚪'
  }
];

// Photo Filters
const PHOTO_FILTERS = [
  { id: 'normal', name: 'Original', css: 'none', canvasFilter: 'none' },
  { id: 'iphone16', name: '📱 iPhone 16 Pro', css: 'contrast(1.09) brightness(1.04) saturate(1.15)', canvasFilter: 'contrast(1.09) brightness(1.04) saturate(1.15)' },
  { id: 'blue-sky', name: '🩵 Blue Sky Air', css: 'brightness(1.09) contrast(1.05) saturate(1.18) hue-rotate(-6deg)', canvasFilter: 'brightness(1.09) contrast(1.05) saturate(1.18)' },
  { id: 'haru-blue', name: '☁️ Haru Signature', css: 'brightness(1.14) contrast(1.03) saturate(1.08) hue-rotate(-5deg)', canvasFilter: 'brightness(1.14) contrast(1.03) saturate(1.08)' },
  { id: 'peach-mochi', name: '🍑 Peach Mochi', css: 'brightness(1.08) contrast(1.02) saturate(1.24) hue-rotate(-12deg)', canvasFilter: 'brightness(1.08) contrast(1.02) saturate(1.24)' },
  { id: 'life4cuts', name: '🎞️ Life4Cuts Warm', css: 'sepia(0.2) contrast(1.08) brightness(1.03) saturate(1.18)', canvasFilter: 'sepia(0.2) contrast(1.08) brightness(1.03) saturate(1.18)' },
  { id: 'photoism-mono', name: '🖤 Photoism Noir', css: 'grayscale(1) contrast(1.3) brightness(0.96)', canvasFilter: 'grayscale(1) contrast(1.3) brightness(0.96)' },
  { id: 'kawaii-glow', name: '✨ Kawaii Glow', css: 'brightness(1.1) contrast(1.04) saturate(1.2) hue-rotate(-3deg)', canvasFilter: 'brightness(1.1) contrast(1.04) saturate(1.2)' },
  { id: 'y2k-flash', name: '⚡ Y2K Flash', css: 'contrast(1.24) brightness(1.1) saturate(1.2)', canvasFilter: 'contrast(1.24) brightness(1.1) saturate(1.2)' },
  { id: 'fuji-1998', name: '📷 Fuji 1998 Film', css: 'sepia(0.22) contrast(1.12) saturate(1.1) hue-rotate(8deg)', canvasFilter: 'sepia(0.22) contrast(1.12) saturate(1.1)' },
  { id: 'cyber-cool', name: '❄️ Cool Ice Blue', css: 'hue-rotate(20deg) saturate(1.2) contrast(1.1) brightness(1.04)', canvasFilter: 'hue-rotate(20deg) saturate(1.2) contrast(1.1)' },
  { id: 'sunset-drama', name: '🌅 Golden Hour', css: 'sepia(0.35) saturate(1.35) brightness(1.05) contrast(1.05)', canvasFilter: 'sepia(0.35) saturate(1.35) brightness(1.05) contrast(1.05)' }
];

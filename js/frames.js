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
  }
];

// Photo Filters
const PHOTO_FILTERS = [
  { id: 'normal', name: 'Original', css: 'none', canvasFilter: 'none' },
  { id: 'kawaii-glow', name: '✨ Kawaii Glow', css: 'brightness(1.08) contrast(1.05) saturate(1.2) hue-rotate(-5deg)', canvasFilter: 'brightness(1.08) contrast(1.05) saturate(1.2)' },
  { id: 'warm-vintage', name: '🎞️ 90s Vintage', css: 'sepia(0.25) contrast(1.1) brightness(1.02) saturate(1.15)', canvasFilter: 'sepia(0.25) contrast(1.1) brightness(1.02) saturate(1.15)' },
  { id: 'korean-bw', name: '🖤 Noir B&W', css: 'grayscale(1) contrast(1.25) brightness(0.95)', canvasFilter: 'grayscale(1) contrast(1.25) brightness(0.95)' },
  { id: 'fairy-pink', name: '🌸 Fairy Pink', css: 'hue-rotate(-15deg) saturate(1.3) brightness(1.06) contrast(1.05)', canvasFilter: 'saturate(1.3) brightness(1.06) contrast(1.05)' },
  { id: 'golden-hour', name: '🌅 Golden Hour', css: 'sepia(0.35) saturate(1.4) brightness(1.05) contrast(1.05)', canvasFilter: 'sepia(0.35) saturate(1.4) brightness(1.05) contrast(1.05)' },
  { id: 'cyber-cool', name: '❄️ Cool Blue', css: 'hue-rotate(25deg) saturate(1.15) contrast(1.1) brightness(1.04)', canvasFilter: 'hue-rotate(25deg) saturate(1.15) contrast(1.1)' }
];

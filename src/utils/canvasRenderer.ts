import type { CapturedPhoto, FilterOption, StickerItem, TemplateType, ThemeOption } from '../types/photobooth';

export interface RenderOptions {
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
  outputScale?: number; // 1 for high-res export (e.g. 1200w), 0.35 for quick canvas preview
}

// Helper to load image
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

// Rounded rectangle helper
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Draw barcode graphic
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  const bars = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 3, 1, 4, 2];
  let curX = x;
  const totalWeight = bars.reduce((a, b) => a + b, 0);
  const unit = width / totalWeight;

  for (let i = 0; i < bars.length; i++) {
    const w = bars[i] * unit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, w, height);
    }
    curX += w;
  }
  ctx.restore();
}

// Helper to draw an image covering target rect
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number = 0
) {
  ctx.save();
  if (radius > 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }

  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  ctx.restore();
}

export async function renderPhotoStrip(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const {
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
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Pre-load all photo images
  const loadedImages: HTMLImageElement[] = [];
  for (const photo of photos) {
    try {
      const img = await loadImage(photo.dataUrl);
      loadedImages.push(img);
    } catch {
      // Create fallback dummy canvas if image fails to load
      const fallback = document.createElement('canvas');
      fallback.width = 800;
      fallback.height = 600;
      const fCtx = fallback.getContext('2d');
      if (fCtx) {
        fCtx.fillStyle = '#fce7f3';
        fCtx.fillRect(0, 0, 800, 600);
      }
      const dummyImg = await loadImage(fallback.toDataURL());
      loadedImages.push(dummyImg);
    }
  }

  // Dimensions setup based on template
  let width = 1200;
  let height = 3800;
  if (template === 'grid-2x2') {
    width = 2400;
    height = 2800;
  } else if (template === 'twin-4x1') {
    width = 2400;
    height = 3800;
  } else if (template === 'strip-1x4') {
    width = 3800;
    height = 1200;
  }

  canvas.width = width;
  canvas.height = height;

  const frameColor = customFrameColor || theme.frameColor;
  const textColor = theme.textColor;
  const accentColor = theme.accentColor;

  // 1. Draw Background
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, width, height);

  // Background pattern/decorations
  if (theme.decorations === 'film') {
    // 35mm film perforations / sprocket holes
    ctx.fillStyle = '#FFFFFF';
    const holeW = 40;
    const holeH = 60;
    const holeRadius = 10;
    const spacing = 110;
    
    // Left & right sprockets for vertical strip
    if (template !== 'strip-1x4') {
      const xPositions = template === 'twin-4x1' 
        ? [30, width / 2 - 70, width / 2 + 30, width - 70]
        : [30, width - 70];

      for (const hx of xPositions) {
        for (let hy = 40; hy < height - 50; hy += spacing) {
          roundRect(ctx, hx, hy, holeW, holeH, holeRadius);
          ctx.fill();
        }
      }
    }
  } else if (theme.decorations === 'hearts') {
    // Soft floating heart doodles in background corners
    ctx.save();
    ctx.font = '36px "Gaegu", cursive, sans-serif';
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    const heartDoodles = [
      { x: 50, y: 80, text: '♥' },
      { x: width - 80, y: 90, text: '♡' },
      { x: 70, y: height - 120, text: '♡' },
      { x: width - 90, y: height - 140, text: '♥' },
    ];
    for (const h of heartDoodles) {
      ctx.fillText(h.text, h.x, h.y);
    }
    ctx.restore();
  } else if (theme.decorations === 'retro') {
    // Y2K Retro sparkles
    ctx.save();
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = 'rgba(167, 139, 250, 0.45)';
    ctx.fillText('✦', 60, 90);
    ctx.fillText('✧', width - 90, 110);
    ctx.fillText('⋆', 80, height - 100);
    ctx.fillText('✦', width - 80, height - 120);
    ctx.restore();
  }

  // 2. Draw Photos according to template
  const photoRadius = theme.decorations === 'film' ? 6 : 28;

  // Setup CSS filter on canvas context
  if (filter.cssFilter && filter.cssFilter !== 'none') {
    ctx.filter = filter.cssFilter;
  } else {
    ctx.filter = 'none';
  }

  if (template === 'strip-4x1') {
    // Single 4x1 Vertical Strip
    const marginSide = 80;
    const marginTop = 120;
    const gap = 45;
    const photoWidth = width - marginSide * 2;
    const photoHeight = Math.floor(photoWidth * 0.72); // 4:3 or standard booth ratio

    for (let i = 0; i < 4; i++) {
      const img = loadedImages[i];
      const py = marginTop + i * (photoHeight + gap);

      if (img) {
        drawImageCover(ctx, img, marginSide, py, photoWidth, photoHeight, photoRadius);
      } else {
        // Placeholder
        ctx.fillStyle = '#f3f4f6';
        roundRect(ctx, marginSide, py, photoWidth, photoHeight, photoRadius);
        ctx.fill();
      }

      // If film theme, add frame number
      if (theme.decorations === 'film') {
        ctx.save();
        ctx.filter = 'none';
        ctx.fillStyle = '#EAB308';
        ctx.font = '24px "Courier New", monospace';
        ctx.fillText(`▶ 2${4 + i}A`, marginSide, py - 12);
        ctx.restore();
      }
    }

    // Reset filter for text & overlays
    ctx.filter = 'none';

    // Footer info
    const footerY = marginTop + 4 * (photoHeight + gap) + 60;
    drawVerticalFooter(ctx, width / 2, footerY, {
      textColor,
      accentColor,
      theme,
      caption,
      showDate,
      dateText,
      showBarcode,
    });

  } else if (template === 'twin-4x1') {
    // Twin 4x1 Strip: 2 copies side-by-side with scissors cutting line
    const halfW = width / 2;
    const marginSide = 70;
    const marginTop = 120;
    const gap = 45;
    const photoWidth = halfW - marginSide * 2;
    const photoHeight = Math.floor(photoWidth * 0.72);

    for (let col = 0; col < 2; col++) {
      const offsetX = col * halfW;
      for (let i = 0; i < 4; i++) {
        const img = loadedImages[i];
        const px = offsetX + marginSide;
        const py = marginTop + i * (photoHeight + gap);

        if (img) {
          drawImageCover(ctx, img, px, py, photoWidth, photoHeight, photoRadius);
        } else {
          ctx.fillStyle = '#f3f4f6';
          roundRect(ctx, px, py, photoWidth, photoHeight, photoRadius);
          ctx.fill();
        }
      }

      // Footer for each strip
      const footerY = marginTop + 4 * (photoHeight + gap) + 60;
      ctx.save();
      ctx.filter = 'none';
      drawVerticalFooter(ctx, offsetX + halfW / 2, footerY, {
        textColor,
        accentColor,
        theme,
        caption,
        showDate,
        dateText,
        showBarcode,
      });
      ctx.restore();
    }

    // Draw dashed cut line in center
    ctx.save();
    ctx.filter = 'none';
    ctx.strokeStyle = theme.decorations === 'film' ? '#52525B' : '#D1D5DB';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 14]);
    ctx.beginPath();
    ctx.moveTo(halfW, 40);
    ctx.lineTo(halfW, height - 40);
    ctx.stroke();

    // Cute scissors icon text
    ctx.font = '30px sans-serif';
    ctx.fillStyle = theme.decorations === 'film' ? '#A1A1AA' : '#9CA3AF';
    ctx.textAlign = 'center';
    ctx.fillText('✂', halfW, 90);
    ctx.fillText('✂', halfW, height / 2);
    ctx.fillText('✂', halfW, height - 70);
    ctx.restore();

  } else if (template === 'grid-2x2') {
    // 2x2 Grid (Photoism / Haru Film square block style)
    const marginSide = 100;
    const marginTop = 120;
    const gap = 50;
    const photoWidth = (width - marginSide * 2 - gap) / 2;
    const photoHeight = Math.floor(photoWidth * 0.82);

    const positions = [
      { x: marginSide, y: marginTop },
      { x: marginSide + photoWidth + gap, y: marginTop },
      { x: marginSide, y: marginTop + photoHeight + gap },
      { x: marginSide + photoWidth + gap, y: marginTop + photoHeight + gap },
    ];

    for (let i = 0; i < 4; i++) {
      const pos = positions[i];
      const img = loadedImages[i];

      if (img) {
        drawImageCover(ctx, img, pos.x, pos.y, photoWidth, photoHeight, photoRadius);
      } else {
        ctx.fillStyle = '#f3f4f6';
        roundRect(ctx, pos.x, pos.y, photoWidth, photoHeight, photoRadius);
        ctx.fill();
      }
    }

    ctx.filter = 'none';

    // 2x2 Grid Footer Banner
    const footerY = marginTop + (photoHeight + gap) * 2 + 70;
    drawGridFooter(ctx, width, footerY, {
      textColor,
      accentColor,
      theme,
      caption,
      showDate,
      dateText,
      showBarcode,
    });

  } else if (template === 'strip-1x4') {
    // 1x4 Horizontal Strip (Landscape)
    const margin = 80;
    const gap = 40;
    const photoHeight = height - margin * 2 - 180;
    const photoWidth = (width - margin * 2 - gap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      const px = margin + i * (photoWidth + gap);
      const py = margin;
      const img = loadedImages[i];

      if (img) {
        drawImageCover(ctx, img, px, py, photoWidth, photoHeight, photoRadius);
      } else {
        ctx.fillStyle = '#f3f4f6';
        roundRect(ctx, px, py, photoWidth, photoHeight, photoRadius);
        ctx.fill();
      }
    }

    ctx.filter = 'none';

    // Horizontal footer
    const footerY = margin + photoHeight + 70;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px ' + theme.fontFamily;
    ctx.fillText(caption || theme.stampText || 'HARU PHOTOBOOTH', width / 2, footerY);

    if (showDate) {
      ctx.font = '24px monospace';
      ctx.fillStyle = accentColor;
      ctx.fillText(dateText, width / 2, footerY + 45);
    }
    ctx.restore();
  }

  // 3. Render Stickers
  ctx.save();
  ctx.filter = 'none';
  for (const sticker of stickers) {
    const sx = (sticker.x / 100) * width;
    const sy = (sticker.y / 100) * height;
    const size = sticker.size || 80;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawVerticalFooter(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  startY: number,
  opts: {
    textColor: string;
    accentColor: string;
    theme: ThemeOption;
    caption: string;
    showDate: boolean;
    dateText: string;
    showBarcode: boolean;
  }
) {
  ctx.save();
  ctx.textAlign = 'center';

  // Korean / Theme Branding Stamp
  ctx.fillStyle = opts.accentColor;
  ctx.font = 'bold 26px "Noto Sans KR", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('인생네컷  •  HARU STUDIO', centerX, startY);

  // Main User Caption
  ctx.fillStyle = opts.textColor;
  ctx.font = 'bold 44px ' + opts.theme.fontFamily;
  const displayCaption = opts.caption.trim() || opts.theme.stampText || 'OUR MEMORY';
  ctx.fillText(displayCaption, centerX, startY + 58);

  // Date and session info
  if (opts.showDate) {
    ctx.fillStyle = opts.textColor;
    ctx.font = '500 24px monospace';
    ctx.fillText(opts.dateText, centerX, startY + 104);
  }

  // Authentic Barcode / QR touch
  if (opts.showBarcode) {
    drawBarcode(ctx, centerX - 120, startY + 124, 240, 42, opts.textColor);
    ctx.font = '18px monospace';
    ctx.fillStyle = opts.textColor;
    ctx.fillText('NO. 2026-HARU-0428', centerX, startY + 185);
  }

  ctx.restore();
}

function drawGridFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  startY: number,
  opts: {
    textColor: string;
    accentColor: string;
    theme: ThemeOption;
    caption: string;
    showDate: boolean;
    dateText: string;
    showBarcode: boolean;
  }
) {
  ctx.save();

  // Left side: Korean brand & user caption
  ctx.textAlign = 'left';
  const leftX = 120;
  
  ctx.fillStyle = opts.accentColor;
  ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
  ctx.fillText('인생네컷  •  PHOTOISM STYLE', leftX, startY);

  ctx.fillStyle = opts.textColor;
  ctx.font = 'bold 50px ' + opts.theme.fontFamily;
  const displayCaption = opts.caption.trim() || opts.theme.stampText || 'OUR MEMORIES';
  ctx.fillText(displayCaption, leftX, startY + 65);

  if (opts.showDate) {
    ctx.font = '500 28px monospace';
    ctx.fillText(opts.dateText, leftX, startY + 115);
  }

  // Right side: Barcode & booth stamp
  if (opts.showBarcode) {
    const rightX = width - 420;
    drawBarcode(ctx, rightX, startY + 10, 300, 50, opts.textColor);
    ctx.textAlign = 'center';
    ctx.font = '20px monospace';
    ctx.fillStyle = opts.textColor;
    ctx.fillText('HARU BOOTH #04  •  ORIGINAL', rightX + 150, startY + 84);
  }

  ctx.restore();
}

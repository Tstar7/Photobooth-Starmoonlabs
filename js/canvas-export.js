// High-resolution Canvas Renderer & Exporter for Starmonlabs Photobooth
class CanvasExporter {
  constructor() {
    this.scale = 2.5; // High-DPI for crisp printing and social sharing
  }

  // Generate complete photo strip canvas
  async renderToCanvas(options) {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const {
      layout,
      theme,
      photos, // Array of dataURLs or Image objects
      filter,
      headerText = 'STARMON LABS',
      subText = '',
      dateText = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
      stickers = [],
      customBgColor = null,
      doubleStrip = false
    } = options;

    const baseWidth = layout.stripWidth;
    const baseHeight = layout.stripHeight;
    const finalStripWidth = baseWidth * this.scale;
    const finalStripHeight = baseHeight * this.scale;

    // Total canvas width (if double strip, 2 strips side-by-side with cutting line)
    const totalWidth = doubleStrip ? (finalStripWidth * 2 + 40 * this.scale) : finalStripWidth;
    const totalHeight = finalStripHeight;

    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // Fill whole sheet with clean white base for printing
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Pre-load photo images
    const loadedImages = await Promise.all(
      photos.map(p => this.loadImage(p))
    );

    // Draw single strip function
    const drawStrip = async (offsetX, offsetY) => {
      ctx.save();
      ctx.translate(offsetX, offsetY);

      // 1. Draw Frame Background
      const bgColor = (theme.id === 'custom-color' && customBgColor) ? customBgColor : theme.bg;
      ctx.fillStyle = bgColor;
      
      // If theme has gradient or special styling
      if (theme.id === 'sakura-blossom') {
        const grad = ctx.createLinearGradient(0, 0, finalStripWidth, finalStripHeight);
        grad.addColorStop(0, '#fdf2f8');
        grad.addColorStop(0.5, '#fce7f3');
        grad.addColorStop(1, '#fbcfe8');
        ctx.fillStyle = grad;
      } else if (theme.id === 'y2k-cyber') {
        const grad = ctx.createLinearGradient(0, 0, finalStripWidth, finalStripHeight);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#312e81');
        grad.addColorStop(1, '#4c1d95');
        ctx.fillStyle = grad;
      } else if (theme.id === 'pastel-cloud') {
        const grad = ctx.createLinearGradient(0, 0, finalStripWidth, finalStripHeight);
        grad.addColorStop(0, '#e0f2fe');
        grad.addColorStop(0.5, '#bae6fd');
        grad.addColorStop(1, '#fef08a');
        ctx.fillStyle = grad;
      } else if (theme.id === 'coquette-pink') {
        const grad = ctx.createLinearGradient(0, 0, finalStripWidth, finalStripHeight);
        grad.addColorStop(0, '#fff0f5');
        grad.addColorStop(1, '#fed7e2');
        ctx.fillStyle = grad;
      } else if (theme.id === 'strawberry-milk') {
        const grad = ctx.createRadialGradient(
          finalStripWidth / 2, finalStripHeight / 2, 50,
          finalStripWidth / 2, finalStripHeight / 2, finalStripHeight
        );
        grad.addColorStop(0, '#fff1f2');
        grad.addColorStop(1, '#fecdd3');
        ctx.fillStyle = grad;
      }

      ctx.fillRect(0, 0, finalStripWidth, finalStripHeight);

      // Frame outer border
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 6 * this.scale;
      ctx.strokeRect(3 * this.scale, 3 * this.scale, finalStripWidth - 6 * this.scale, finalStripHeight - 6 * this.scale);

      // 2. Compute slots for photos
      const slotRects = this.calculateSlotRects(layout, finalStripWidth, finalStripHeight);

      // 3. Render Photo Slots
      for (let i = 0; i < slotRects.length; i++) {
        const rect = slotRects[i];
        const img = loadedImages[i];

        // Slot background / border
        ctx.save();
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

        // Draw image clipped inside slot with chosen filter
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.w, rect.h);
          ctx.clip();

          // Apply filter
          if (filter && filter.canvasFilter && filter.canvasFilter !== 'none') {
            ctx.filter = filter.canvasFilter;
          }

          // Cover fit image
          this.drawImageCover(ctx, img, rect.x, rect.y, rect.w, rect.h);
          ctx.restore();
        } else {
          // Placeholder cute icon
          ctx.fillStyle = '#9ca3af';
          ctx.font = `${16 * this.scale}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(`Foto ${i + 1}`, rect.x + rect.w / 2, rect.y + rect.h / 2);
        }

        // Inner photo border
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 2 * this.scale;
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx.restore();
      }

      // 4. Header text & decorations
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textColor;
      ctx.font = `bold ${16 * this.scale}px 'Fredoka', 'Plus Jakarta Sans', sans-serif`;
      
      const headerY = 32 * this.scale;
      ctx.fillText(headerText.toUpperCase(), finalStripWidth / 2, headerY);

      if (theme.footerIcon) {
        ctx.fillStyle = theme.subTextColor;
        ctx.font = `italic ${10 * this.scale}px 'Gaegu', cursive, sans-serif`;
        ctx.fillText(theme.footerIcon, finalStripWidth / 2, headerY + 16 * this.scale);
      }
      ctx.restore();

      // 5. Footer text & Date & Barcode
      ctx.save();
      const footerY = finalStripHeight - 24 * this.scale;
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textColor;
      ctx.font = `bold ${11 * this.scale}px 'Courier New', monospace`;

      const displaySub = subText ? `${subText} · ${dateText}` : `STARMON · ${dateText}`;
      ctx.fillText(displaySub, finalStripWidth / 2, footerY - 14 * this.scale);

      // Cute simulated barcode in footer
      this.drawBarcode(ctx, finalStripWidth / 2 - (60 * this.scale), footerY, 120 * this.scale, 14 * this.scale, theme.subTextColor);
      ctx.restore();

      // 6. Theme Doodles
      if (theme.doodles && theme.doodles.length > 0) {
        ctx.save();
        theme.doodles.forEach(d => {
          const posX = (parseFloat(d.x) / 100) * finalStripWidth;
          const posY = (parseFloat(d.y) / 100) * finalStripHeight;
          const sizePx = (parseFloat(d.size) || 18) * this.scale;
          ctx.font = `${sizePx}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(d.text, posX, posY);
        });
        ctx.restore();
      }

      // 7. Placed Stickers
      if (stickers && stickers.length > 0) {
        ctx.save();
        stickers.forEach(s => {
          const posX = (s.x / 100) * finalStripWidth;
          const posY = (s.y / 100) * finalStripHeight;
          ctx.save();
          ctx.translate(posX, posY);
          ctx.rotate((s.rotation * Math.PI) / 180);
          ctx.scale(s.scale, s.scale);

          if (s.content.length > 2) {
            // Text badge sticker
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2 * this.scale;
            const text = s.content;
            ctx.font = `bold ${12 * this.scale}px sans-serif`;
            const textWidth = ctx.measureText(text).width;
            const padX = 10 * this.scale;
            const padY = 6 * this.scale;
            
            this.roundRect(ctx, -textWidth / 2 - padX, -10 * this.scale - padY, textWidth + padX * 2, 20 * this.scale + padY * 2, 10 * this.scale);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#db2777';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);
          } else {
            // Emoji sticker
            ctx.font = `${28 * this.scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.content, 0, 0);
          }
          ctx.restore();
        });
        ctx.restore();
      }

      ctx.restore();
    };

    // Draw first strip
    await drawStrip(0, 0);

    // If double strip is requested
    if (doubleStrip) {
      const secondStripX = finalStripWidth + 40 * this.scale;

      // Draw dashed cutting guide line between strips
      ctx.save();
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2 * this.scale;
      ctx.setLineDash([8 * this.scale, 8 * this.scale]);
      const cutLineX = finalStripWidth + 20 * this.scale;
      ctx.beginPath();
      ctx.moveTo(cutLineX, 10 * this.scale);
      ctx.lineTo(cutLineX, finalStripHeight - 10 * this.scale);
      ctx.stroke();

      // Scissor icon at top of cutting guide
      ctx.font = `${14 * this.scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('✂', cutLineX, 25 * this.scale);
      ctx.restore();

      // Draw second identical strip
      await drawStrip(secondStripX, 0);
    }

    return canvas;
  }

  // Calculate coordinates of each photo frame inside strip
  calculateSlotRects(layout, stripW, stripH) {
    const padX = 24 * this.scale;
    const headerH = 58 * this.scale;
    const footerH = 65 * this.scale;
    const availableW = stripW - padX * 2;
    const availableH = stripH - headerH - footerH;

    const rects = [];

    // Special layout: 5 Hero (1 big top + 4 2x2 grid bottom)
    if (layout.special === 'hero-4mini') {
      const gap = 12 * this.scale;
      const heroH = availableH * 0.44;
      // Hero top photo
      rects.push({
        x: padX,
        y: headerH,
        w: availableW,
        h: heroH
      });
      // 4 mini photos below (2x2)
      const miniY = headerH + heroH + gap;
      const miniW = (availableW - gap) / 2;
      const miniH = (availableH - heroH - gap * 2) / 2;

      rects.push({ x: padX, y: miniY, w: miniW, h: miniH });
      rects.push({ x: padX + miniW + gap, y: miniY, w: miniW, h: miniH });
      rects.push({ x: padX, y: miniY + miniH + gap, w: miniW, h: miniH });
      rects.push({ x: padX + miniW + gap, y: miniY + miniH + gap, w: miniW, h: miniH });
      return rects;
    }

    const cols = layout.cols || 1;
    const rows = layout.rows || layout.count;
    const gap = 12 * this.scale;

    const cellW = (availableW - (cols - 1) * gap) / cols;
    const cellH = (availableH - (rows - 1) * gap) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rects.length < layout.count) {
          rects.push({
            x: padX + c * (cellW + gap),
            y: headerH + r * (cellH + gap),
            w: cellW,
            h: cellH
          });
        }
      }
    }

    return rects;
  }

  // Draw simulated barcode
  drawBarcode(ctx, x, y, width, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    const barCount = 30;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      if ((i * 7 + 3) % 4 !== 0) {
        const thickness = (i % 3 === 0) ? barWidth * 0.7 : barWidth * 0.4;
        ctx.fillRect(x + i * barWidth, y, thickness, height);
      }
    }
    ctx.restore();
  }

  // Rounded rectangle helper
  roundRect(ctx, x, y, width, height, radius) {
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

  // Aspect cover draw
  drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let sw, sh, sx, sy;

    if (imgRatio > targetRatio) {
      sh = img.height;
      sw = img.height * targetRatio;
      sy = 0;
      sx = (img.width - sw) / 2;
    } else {
      sw = img.width;
      sh = img.width / targetRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      if (src instanceof HTMLImageElement) return resolve(src);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Download canvas image
  downloadImage(canvas, filename = 'photobooth-starmonlabs.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }
}

window.CanvasExporter = CanvasExporter;

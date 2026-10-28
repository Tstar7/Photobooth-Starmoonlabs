// Cute stickers catalog and sticker management
const STICKER_CATEGORIES = [
  {
    category: '🎀 Ribbons & Cute',
    items: ['🎀', '🩰', '🧸', '💖', '💗', '💓', '🧁', '🍰', '🌸', '🌷', '🍒', '🍓']
  },
  {
    category: '⭐ Y2K & Sparkles',
    items: ['★', '✧', '✦', '✨', '💫', '⚡', '🪩', '💿', '🕶️', '👑', '💄', '🪄']
  },
  {
    category: '🐱 Cats & Animals',
    items: ['🐱', '🐾', '🐰', '🐻', '🐼', '🐥', '🐶', '🦊', '🐸', '🐹', '🦋', '🐝']
  },
  {
    category: '💬 Korean & Kawaii Words',
    items: ['대박', '하트♡', 'Chu~', 'Love', 'Besties', 'OMG', 'Sweet', 'Cutie', 'Meow', 'Haru', 'Aesthetic', 'Smile:)']
  },
  {
    category: '🎉 Fun & Party',
    items: ['🥳', '🎂', '🎈', '🍾', '🍩', '🍕', '🍿', '🍉', '🍭', '🧃', '🧋', '🌺']
  }
];

class StickerManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.stickers = [];
    this.activeSticker = null;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  addSticker(content, isEmoji = true) {
    const id = 'sticker_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const stickerData = {
      id,
      content,
      isEmoji,
      x: 40 + Math.random() * 30, // percent
      y: 40 + Math.random() * 20, // percent
      rotation: (Math.random() * 20) - 10,
      scale: 1.0
    };

    this.stickers.push(stickerData);
    this.renderStickerDOM(stickerData);
    if (window.soundEngine) window.soundEngine.playPop();
  }

  renderStickerDOM(data) {
    const el = document.createElement('div');
    el.id = data.id;
    el.className = 'photobooth-placed-sticker absolute cursor-move select-none touch-none pointer-events-auto';
    el.style.left = `${data.x}%`;
    el.style.top = `${data.y}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${data.rotation}deg) scale(${data.scale})`;
    el.style.zIndex = 30;

    const inner = document.createElement('div');
    inner.className = 'sticker-content-wrapper relative group';
    
    // Sticker visual
    const badge = document.createElement('div');
    badge.className = data.content.length > 2 
      ? 'px-3 py-1 bg-white/90 backdrop-blur-sm border-2 border-pink-400 text-pink-600 font-bold rounded-full text-sm shadow-md whitespace-nowrap'
      : 'text-3xl filter drop-shadow-md select-none transform transition-transform hover:scale-110';
    badge.innerText = data.content;
    inner.appendChild(badge);

    // Delete button (visible on hover and touch friendly)
    const delBtn = document.createElement('button');
    delBtn.className = 'absolute -top-3.5 -right-3.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity shadow-md pointer-events-auto touch-manipulation z-30';
    delBtn.innerHTML = '×';
    delBtn.title = 'Hapus Stiker';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeSticker(data.id);
    };
    inner.appendChild(delBtn);

    // Rotate/Scale button (touch friendly)
    const rotBtn = document.createElement('button');
    rotBtn.className = 'absolute -bottom-3.5 -right-3.5 w-6 h-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity shadow-md pointer-events-auto touch-manipulation z-30';
    rotBtn.innerHTML = '↻';
    rotBtn.title = 'Putar Stiker';
    rotBtn.onclick = (e) => {
      e.stopPropagation();
      data.rotation = (data.rotation + 30) % 360;
      el.style.transform = `translate(-50%, -50%) rotate(${data.rotation}deg) scale(${data.scale})`;
      if (window.soundEngine) window.soundEngine.playPop();
    };
    inner.appendChild(rotBtn);

    el.appendChild(inner);

    // Drag events for mouse and touch
    let startX = 0;
    let startY = 0;
    let initLeft = data.x;
    let initTop = data.y;

    const onPointerDown = (e) => {
      if (e.target === delBtn || e.target === rotBtn) return;
      const pointer = e.touches ? e.touches[0] : e;
      startX = pointer.clientX;
      startY = pointer.clientY;
      initLeft = data.x;
      initTop = data.y;

      const onPointerMove = (moveEvt) => {
        if (moveEvt.cancelable) moveEvt.preventDefault();
        const movePointer = moveEvt.touches ? moveEvt.touches[0] : moveEvt;
        const rect = this.container.getBoundingClientRect();
        const deltaX = ((movePointer.clientX - startX) / rect.width) * 100;
        const deltaY = ((movePointer.clientY - startY) / rect.height) * 100;

        data.x = Math.max(5, Math.min(95, initLeft + deltaX));
        data.y = Math.max(5, Math.min(95, initTop + deltaY));

        el.style.left = `${data.x}%`;
        el.style.top = `${data.y}%`;
      };

      const onPointerUp = () => {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      };

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    };

    el.addEventListener('mousedown', onPointerDown);
    el.addEventListener('touchstart', onPointerDown, { passive: true });

    this.container.appendChild(el);
  }

  removeSticker(id) {
    this.stickers = this.stickers.filter(s => s.id !== id);
    const el = document.getElementById(id);
    if (el) el.remove();
    if (window.soundEngine) window.soundEngine.playPop();
  }

  clearAll() {
    this.stickers.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) el.remove();
    });
    this.stickers = [];
  }

  getStickersData() {
    return this.stickers;
  }
}

window.StickerManager = StickerManager;
window.STICKER_CATEGORIES = STICKER_CATEGORIES;

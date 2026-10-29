// Core Application Controller for Starmonlabs Photobooth
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentLayoutId: '4-vertical',
    currentThemeId: 'coquette-pink',
    currentFilterId: 'normal',
    photos: [], // Array of dataURLs for each slot
    activeSlotIndex: 0,
    countdownSeconds: 3,
    isCountingDown: false,
    autoSequence: true,
    doubleStrip: false,
    customBgColor: '#ffb5a7',
    headerText: 'STARMOON LABS',
    subText: 'BESTIES ♡',
    dateText: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
    stream: null,
    isMirrored: true,
    facingMode: 'user',
    availableDevices: [],
    selectedDeviceId: null
  };

  // Helper modules
  const exporter = new CanvasExporter();
  const placedStickersLayer = document.getElementById('placed-stickers-layer');
  const stickerManager = new StickerManager(placedStickersLayer);

  // DOM Elements
  const video = document.getElementById('webcam-video');
  const flashOverlay = document.getElementById('camera-flash-overlay');
  const countdownDisplay = document.getElementById('countdown-display');
  const countdownNumber = document.getElementById('countdown-number');
  const shutterBtn = document.getElementById('btn-shutter');
  const shutterLabel = document.getElementById('shutter-label');
  const fileUploadInput = document.getElementById('file-upload-input');
  const stripContainer = document.getElementById('photobooth-strip-container');
  const photoSlotsGrid = document.getElementById('photo-slots-grid');
  const stripHeaderText = document.getElementById('strip-header-text');
  const stripThemeIcon = document.getElementById('strip-theme-icon');
  const stripFooterText = document.getElementById('strip-footer-text');
  const stripDoodlesContainer = document.getElementById('strip-doodles-container');
  const previewLayoutBadge = document.getElementById('preview-layout-badge');
  const currentSlotIndicator = document.getElementById('current-slot-indicator');
  const camStatusText = document.getElementById('cam-status-text');
  const camDot = document.getElementById('cam-dot');
  const camPing = document.getElementById('cam-ping');
  const cameraFallback = document.getElementById('camera-fallback');

  // Input elements
  const inputHeader = document.getElementById('input-strip-header');
  const inputSub = document.getElementById('input-strip-sub');
  const inputDate = document.getElementById('input-strip-date');
  const inputCustomBg = document.getElementById('input-custom-bg');
  const chkAutoSequence = document.getElementById('chk-auto-sequence');
  const doubleStripStatus = document.getElementById('double-strip-status');

  // ----------------------------------------------------------------
  // 1. WEBCAM MANAGEMENT
  // ----------------------------------------------------------------
  async function initWebcam() {
    try {
      if (state.stream) {
        state.stream.getTracks().forEach(t => t.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: state.facingMode
        },
        audio: false
      };

      if (state.selectedDeviceId) {
        constraints.video = { deviceId: { exact: state.selectedDeviceId } };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      state.stream = stream;
      video.srcObject = stream;
      cameraFallback.classList.add('hidden');

      camStatusText.innerText = 'Kamera Aktif';
      camDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500';
      camPing.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75';

      // Enumerate devices for switching
      const devices = await navigator.mediaDevices.enumerateDevices();
      state.availableDevices = devices.filter(d => d.kind === 'videoinput');
    } catch (err) {
      console.warn('Webcam access error:', err);
      camStatusText.innerText = 'Kamera Terputus';
      camDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500';
      camPing.className = 'hidden';
      cameraFallback.classList.remove('hidden');
    }
  }

  // Camera flip / mirror toggle
  document.getElementById('btn-flip-camera').addEventListener('click', () => {
    state.isMirrored = !state.isMirrored;
    video.style.transform = state.isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    if (window.soundEngine) window.soundEngine.playPop();
  });

  // Switch camera device
  document.getElementById('btn-switch-device').addEventListener('click', async () => {
    if (state.availableDevices.length > 1) {
      const currentIndex = state.availableDevices.findIndex(d => d.deviceId === state.selectedDeviceId);
      const nextIndex = (currentIndex + 1) % state.availableDevices.length;
      state.selectedDeviceId = state.availableDevices[nextIndex].deviceId;
      await initWebcam();
    } else {
      state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
      await initWebcam();
    }
    if (window.soundEngine) window.soundEngine.playPop();
  });

  document.getElementById('btn-request-cam').addEventListener('click', initWebcam);

  // Live clock on camera overlay
  setInterval(() => {
    const d = new Date();
    const timeEl = document.getElementById('live-time');
    if (timeEl) {
      timeEl.innerText = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    }
  }, 1000);

  // ----------------------------------------------------------------
  // 2. LAYOUT INITIALIZATION & RENDERING
  // ----------------------------------------------------------------
  function initLayoutsUI() {
    const container = document.getElementById('layout-options-container');
    container.innerHTML = '';

    Object.values(LAYOUT_CONFIGS).forEach(cfg => {
      const card = document.createElement('div');
      const isSelected = cfg.id === state.currentLayoutId;
      card.className = `layout-card cursor-pointer p-3 rounded-2xl border-2 transition cute-btn flex flex-col items-center text-center ${
        isSelected ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-pink-100 bg-white hover:border-pink-300'
      }`;
      card.dataset.id = cfg.id;
      card.dataset.count = cfg.count;

      card.innerHTML = `
        <div class="text-xl font-bold mb-1 text-rose-500">${cfg.icon}</div>
        <p class="text-xs font-bold text-slate-700">${cfg.name.split('(')[0]}</p>
        <span class="text-[10px] text-slate-400">(${cfg.name.split('(')[1] || ''}</span>
      `;

      card.addEventListener('click', () => {
        selectLayout(cfg.id);
        if (window.soundEngine) window.soundEngine.playPop();
      });

      container.appendChild(card);
    });

    // Slot filter buttons (2, 3, 4, 5, 6)
    document.querySelectorAll('.slot-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-filter-btn').forEach(b => {
          b.className = 'slot-filter-btn px-2.5 py-1 text-xs font-medium rounded-lg bg-pink-50 text-slate-600 hover:bg-pink-100';
        });
        btn.className = 'slot-filter-btn px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white';

        const filter = btn.dataset.filter;
        document.querySelectorAll('.layout-card').forEach(card => {
          if (filter === 'all' || card.dataset.count === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        if (window.soundEngine) window.soundEngine.playPop();
      });
    });
  }

  function selectLayout(layoutId) {
    state.currentLayoutId = layoutId;
    const cfg = LAYOUT_CONFIGS[layoutId];
    
    // Update active UI cards
    document.querySelectorAll('.layout-card').forEach(c => {
      if (c.dataset.id === layoutId) {
        c.className = 'layout-card cursor-pointer p-3 rounded-2xl border-2 border-rose-500 bg-rose-50 shadow-sm flex flex-col items-center text-center';
      } else {
        c.className = 'layout-card cursor-pointer p-3 rounded-2xl border-2 border-pink-100 bg-white hover:border-pink-300 flex flex-col items-center text-center';
      }
    });

    document.getElementById('current-layout-label').innerText = cfg.name;
    previewLayoutBadge.innerText = `${cfg.count} Kotak`;

    // Ensure state photos array fits the new count
    if (state.photos.length > cfg.count) {
      state.photos = state.photos.slice(0, cfg.count);
    }
    if (state.activeSlotIndex >= cfg.count) {
      state.activeSlotIndex = 0;
    }

    renderPhotoSlots();
    applyTheme();
  }

  // Render individual photo slots inside the strip preview
  function renderPhotoSlots() {
    const theme = getActiveTheme();
    const cfg = LAYOUT_CONFIGS[state.currentLayoutId];
    const isOverlay = theme.isOverlayImage && theme.slots;
    const totalSlots = isOverlay ? theme.slots.length : cfg.count;

    if (isOverlay) {
      // Custom scrapbook frame with exact cutouts
      const aspect = theme.aspectRatio || (1/2);
      stripContainer.style.aspectRatio = `${aspect}`;
      stripContainer.style.maxWidth = aspect > 1 ? '420px' : '320px';
      photoSlotsGrid.className = 'relative z-10 w-full h-full';
      previewLayoutBadge.innerText = `${totalSlots} Kotak (${theme.badge})`;
    } else {
      // Standard layout
      photoSlotsGrid.className = `${cfg.containerClass} relative z-10`;
      stripContainer.style.aspectRatio = 'auto';
      stripContainer.style.width = '100%';
      if (cfg.cols >= 3) {
        stripContainer.style.maxWidth = '400px';
      } else if (cfg.cols >= 2 && cfg.rows <= 2) {
        stripContainer.style.maxWidth = '360px';
      } else {
        stripContainer.style.maxWidth = '315px';
      }
      previewLayoutBadge.innerText = `${cfg.count} Kotak`;
    }

    photoSlotsGrid.innerHTML = '';

    for (let i = 0; i < totalSlots; i++) {
      const slot = document.createElement('div');
      
      if (isOverlay) {
        const s = theme.slots[i];
        slot.className = `photo-slot absolute cursor-pointer group slot-${i} ${
          i === state.activeSlotIndex ? 'active-slot ring-2 ring-rose-400' : ''
        }`;
        slot.style.left = `${s.x}%`;
        slot.style.top = `${s.y}%`;
        slot.style.width = `${s.w}%`;
        slot.style.height = `${s.h}%`;
        slot.style.minHeight = '0';
        slot.style.aspectRatio = 'auto';
        slot.style.border = 'none';
        slot.style.borderRadius = '6px';
      } else {
        slot.className = `photo-slot rounded-xl border-2 relative cursor-pointer group slot-${i} ${
          i === state.activeSlotIndex ? 'active-slot ring-2 ring-rose-400' : ''
        }`;
        slot.style.borderColor = theme.border;
        slot.style.minHeight = (cfg.count >= 5 && cfg.cols === 1) ? '100px' : (cfg.cols >= 2 ? '115px' : '135px');
        slot.style.aspectRatio = cfg.photoAspect || '4/3';
      }

      const photoData = state.photos[i];

      if (photoData) {
        // Has captured photo - filter is ALREADY baked into photoData, do not override!
        slot.innerHTML = `
          <img src="${photoData}" class="w-full h-full object-cover rounded-md" />
          <div class="slot-actions absolute inset-0 bg-black/40 rounded-md flex items-center justify-center gap-2">
            <button class="btn-slot-retake p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full text-xs font-bold shadow cute-btn" title="Ambil Ulang Foto Ini">
              <i data-lucide="refresh-ccw" class="w-3.5 h-3.5"></i>
            </button>
            <button class="btn-slot-delete p-2 bg-white/90 hover:bg-white text-red-500 rounded-full text-xs font-bold shadow cute-btn" title="Hapus Foto">
              <i data-lucide="trash" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;

        slot.querySelector('.btn-slot-retake').addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveSlot(i);
        });

        slot.querySelector('.btn-slot-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          state.photos[i] = null;
          renderPhotoSlots();
          if (window.soundEngine) window.soundEngine.playPop();
        });
      } else {
        // Empty slot placeholder
        slot.innerHTML = `
          <div class="flex flex-col items-center justify-center text-slate-300 group-hover:text-rose-400 transition py-4">
            <span class="w-6 h-6 rounded-full border border-dashed border-current flex items-center justify-center text-xs font-bold mb-0.5">
              ${i + 1}
            </span>
            <span class="text-[10px] font-medium">Klik utk Pilih</span>
          </div>
        `;
      }

      slot.addEventListener('click', () => {
        setActiveSlot(i);
        if (window.soundEngine) window.soundEngine.playPop();
      });

      photoSlotsGrid.appendChild(slot);
    }

    currentSlotIndicator.innerText = `Mengisi Foto #${state.activeSlotIndex + 1}`;
    updatePhotoCountBadge();
    lucide.createIcons();
  }

  function setActiveSlot(index) {
    state.activeSlotIndex = index;
    currentSlotIndicator.innerText = `Mengisi Foto #${state.activeSlotIndex + 1}`;
    document.querySelectorAll('.photo-slot').forEach((slot, i) => {
      if (i === index) {
        slot.classList.add('active-slot', 'ring-2', 'ring-rose-400');
      } else {
        slot.classList.remove('active-slot', 'ring-2', 'ring-rose-400');
      }
    });
  }

  // ----------------------------------------------------------------
  // 3. THEME & FRAME MANAGEMENT
  // ----------------------------------------------------------------
  function initThemesUI() {
    const container = document.getElementById('theme-options-container');
    container.innerHTML = '';

    FRAME_THEMES.forEach(t => {
      const card = document.createElement('div');
      const isSelected = t.id === state.currentThemeId;
      card.className = `theme-card cursor-pointer p-2.5 rounded-2xl border-2 transition cute-btn flex flex-col justify-between ${
        isSelected ? 'border-rose-500 shadow-md ring-2 ring-rose-200' : 'border-slate-100 hover:border-pink-200'
      }`;
      card.dataset.id = t.id;
      card.dataset.cat = t.category;

      card.innerHTML = `
        <div class="h-12 rounded-xl mb-2 flex items-center justify-center text-sm shadow-inner" style="${t.cardStyle}">
          <span class="font-bold text-xs" style="color: ${t.textColor}">${t.doodles[0]?.text || '♡'}</span>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold text-slate-700 truncate">${t.name}</p>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-pink-100 text-pink-600">${t.badge}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectTheme(t.id);
        if (window.soundEngine) window.soundEngine.playPop();
      });

      container.appendChild(card);
    });

    // Theme category filter
    document.querySelectorAll('.frame-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.frame-filter-btn').forEach(b => {
          b.className = 'frame-filter-btn px-2.5 py-1 text-xs font-medium rounded-lg bg-pink-50 text-slate-600 hover:bg-pink-100';
        });
        btn.className = 'frame-filter-btn px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white';

        const cat = btn.dataset.cat;
        document.querySelectorAll('.theme-card').forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        if (window.soundEngine) window.soundEngine.playPop();
      });
    });

    // Custom background color picker
    inputCustomBg.addEventListener('input', (e) => {
      state.customBgColor = e.target.value;
      if (state.currentThemeId === 'custom-color') {
        applyTheme();
      }
    });
  }

  function selectTheme(themeId) {
    state.currentThemeId = themeId;
    const theme = getActiveTheme();

    document.querySelectorAll('.theme-card').forEach(c => {
      if (c.dataset.id === themeId) {
        c.className = 'theme-card cursor-pointer p-2.5 rounded-2xl border-2 border-rose-500 shadow-md ring-2 ring-rose-200 flex flex-col justify-between';
      } else {
        c.className = 'theme-card cursor-pointer p-2.5 rounded-2xl border-2 border-slate-100 hover:border-pink-200 flex flex-col justify-between';
      }
    });

    document.getElementById('current-theme-label').innerText = theme.name;
    applyTheme();
    renderPhotoSlots();
  }

  function getActiveTheme() {
    return FRAME_THEMES.find(t => t.id === state.currentThemeId) || FRAME_THEMES[0];
  }

  function applyTheme() {
    const theme = getActiveTheme();
    let overlayEl = document.getElementById('frame-overlay-img');

    if (theme.isOverlayImage) {
      if (!overlayEl) {
        overlayEl = document.createElement('img');
        overlayEl.id = 'frame-overlay-img';
        overlayEl.className = 'absolute inset-0 w-full h-full object-fill pointer-events-none z-20 select-none';
        stripContainer.appendChild(overlayEl);
      }
      overlayEl.src = theme.overlaySrc;
      overlayEl.style.display = 'block';

      // Hide text & doodles for scrapbook overlay frames
      stripHeaderText.parentElement.style.display = 'none';
      stripFooterText.parentElement.style.display = 'none';
      stripDoodlesContainer.style.display = 'none';
      stripContainer.style.background = theme.bg || '#ffffff';
      stripContainer.style.border = 'none';
      stripContainer.style.padding = '0';
      stripContainer.style.overflow = 'hidden';
      stripContainer.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
    } else {
      if (overlayEl) overlayEl.style.display = 'none';
      stripHeaderText.parentElement.style.display = 'block';
      stripFooterText.parentElement.style.display = 'block';
      stripDoodlesContainer.style.display = 'block';
      stripContainer.style.padding = '1.25rem';
      stripContainer.style.aspectRatio = 'auto';

      // Background and border styling
      if (theme.id === 'custom-color') {
        stripContainer.style.background = state.customBgColor;
        stripContainer.style.borderColor = '#ffffff';
        stripContainer.style.borderWidth = '4px';
        stripContainer.style.borderStyle = 'solid';
      } else {
        stripContainer.style.background = theme.bg;
        stripContainer.style.borderColor = theme.border;
        stripContainer.style.borderWidth = '4px';
        stripContainer.style.borderStyle = 'solid';
      }

      // Texts color
      stripHeaderText.style.color = theme.textColor;
      stripThemeIcon.style.color = theme.subTextColor;
      stripThemeIcon.innerText = theme.footerIcon || '';
      stripFooterText.style.color = theme.textColor;

      // Slots border color
      document.querySelectorAll('.photo-slot').forEach(slot => {
        slot.style.borderColor = theme.border;
      });

      // Doodles injection
      stripDoodlesContainer.innerHTML = '';
      if (theme.doodles && theme.doodles.length > 0) {
        theme.doodles.forEach(d => {
          const span = document.createElement('span');
          span.className = 'absolute pointer-events-none select-none';
          span.style.left = d.x;
          span.style.top = d.y;
          span.style.fontSize = d.size;
          span.style.transform = 'translate(-50%, -50%)';
          span.innerText = d.text;
          stripDoodlesContainer.appendChild(span);
        });
      }
    }
  }

  // ----------------------------------------------------------------
  // 4. PHOTO FILTERS
  // ----------------------------------------------------------------
  function initFiltersUI() {
    const photoContainer = document.getElementById('filter-pill-container');
    if (!photoContainer) return;
    photoContainer.innerHTML = '';

    // Render photo filter buttons
    PHOTO_FILTERS.forEach(f => {
      const btn = document.createElement('button');
      const isSelected = f.id === state.currentFilterId;
      btn.className = `filter-pill py-2 px-2.5 rounded-xl text-xs font-semibold border transition cute-btn truncate ${
        isSelected ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-pink-50/70 hover:bg-pink-100 text-slate-700 border-pink-200'
      }`;
      btn.dataset.id = f.id;
      btn.innerText = f.name;
      btn.addEventListener('click', () => {
        selectFilter(f.id);
        if (window.soundEngine) window.soundEngine.playPop();
      });
      photoContainer.appendChild(btn);
    });
  }

  function selectFilter(filterId) {
    state.currentFilterId = filterId;
    const filter = getActiveFilter();

    document.querySelectorAll('.filter-pill').forEach(b => {
      if (b.dataset.id === filterId) {
        b.className = 'filter-pill py-2 px-2.5 rounded-xl text-xs font-bold border border-rose-500 bg-rose-500 text-white shadow-sm truncate';
      } else {
        b.className = 'filter-pill py-2 px-2.5 rounded-xl text-xs font-semibold border border-pink-200 bg-pink-50/70 hover:bg-pink-100 text-slate-700 truncate';
      }
    });

    const activeLabel = document.getElementById('active-filter-label');
    if (activeLabel) activeLabel.innerText = filter.name;

    // Apply live CSS filter to viewfinder
    video.style.filter = filter.css;
  }

  function getActiveFilter() {
    return PHOTO_FILTERS.find(f => f.id === state.currentFilterId) || PHOTO_FILTERS[0];
  }

  // ----------------------------------------------------------------
  // 5. STICKERS & TEXT CUSTOMIZATION
  // ----------------------------------------------------------------
  function initStickersUI() {
    const container = document.getElementById('stickers-palette-container');
    container.innerHTML = '';

    STICKER_CATEGORIES.forEach(cat => {
      const group = document.createElement('div');
      group.className = 'bg-pink-50/40 p-2.5 rounded-2xl border border-pink-100';

      const title = document.createElement('p');
      title.className = 'text-[11px] font-bold text-slate-600 mb-2';
      title.innerText = cat.category;
      group.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'flex flex-wrap gap-1.5';

      cat.items.forEach(item => {
        const stickerBtn = document.createElement('button');
        stickerBtn.className = item.length > 2 
          ? 'px-2.5 py-1 bg-white hover:bg-rose-50 border border-pink-200 text-rose-500 font-bold rounded-lg text-xs cute-btn shadow-xs'
          : 'w-9 h-9 bg-white hover:bg-pink-100 rounded-xl border border-pink-200 text-lg flex items-center justify-center cute-btn shadow-xs';
        stickerBtn.innerText = item;

        stickerBtn.addEventListener('click', () => {
          stickerManager.addSticker(item, item.length <= 2);
        });

        grid.appendChild(stickerBtn);
      });

      group.appendChild(grid);
      container.appendChild(group);
    });

    document.getElementById('btn-clear-stickers').addEventListener('click', () => {
      stickerManager.clearAll();
    });

    // Custom Text Listeners
    inputHeader.addEventListener('input', (e) => {
      state.headerText = e.target.value;
      stripHeaderText.innerText = e.target.value.toUpperCase();
    });

    inputSub.addEventListener('input', (e) => {
      state.subText = e.target.value;
      updateFooterDisplay();
    });

    inputDate.addEventListener('input', (e) => {
      state.dateText = e.target.value;
      updateFooterDisplay();
    });

    function updateFooterDisplay() {
      stripFooterText.innerText = state.subText ? `${state.subText} · ${state.dateText}` : `STARMON · ${state.dateText}`;
    }
  }

  // ----------------------------------------------------------------
  // 6. PHOTO CAPTURE & AUTO SEQUENCE
  // ----------------------------------------------------------------
  // Countdown Timer selection
  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-btn').forEach(b => {
        b.className = 'timer-btn px-2.5 py-1 text-xs font-semibold rounded-xl transition text-slate-600 hover:bg-pink-100';
      });
      btn.className = 'timer-btn px-2.5 py-1 text-xs font-bold rounded-xl transition bg-white text-rose-500 shadow-sm border border-pink-200';
      state.countdownSeconds = parseInt(btn.dataset.seconds, 10);
      if (window.soundEngine) window.soundEngine.playPop();
    });
  });

  chkAutoSequence.addEventListener('change', (e) => {
    state.autoSequence = e.target.checked;
  });

  // Main shutter click handler
  shutterBtn.addEventListener('click', () => {
    if (state.isCountingDown) return;
    if (state.autoSequence) {
      startAutoSequence();
    } else {
      triggerCountdownAndSnap(state.activeSlotIndex);
    }
  });

  // Spacebar keyboard trigger
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      shutterBtn.click();
    }
  });

  // Auto-Sequence capture: Takes photos 1..N automatically!
  async function startAutoSequence() {
    const theme = getActiveTheme();
    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    const totalSlots = (theme.isOverlayImage && theme.slots) ? theme.slots.length : layout.count;
    state.isCountingDown = true;
    shutterBtn.disabled = true;
    shutterLabel.innerText = 'Sesi Photobooth Berjalan...';

    for (let slotIdx = 0; slotIdx < totalSlots; slotIdx++) {
      setActiveSlot(slotIdx);
      await runCountdown(state.countdownSeconds);
      takeSinglePhoto(slotIdx);

      // Flash & sound
      triggerFlashAndShutter();

      // Pause briefly between shots for poses
      if (slotIdx < totalSlots - 1) {
        await new Promise(r => setTimeout(r, state.countdownSeconds === 0 ? 1200 : 1800));
      }
    }

    state.isCountingDown = false;
    shutterBtn.disabled = false;
    shutterLabel.innerText = 'Ambil Foto (Snap!)';
    if (window.soundEngine) window.soundEngine.playSuccess();

    // Auto transition to preview on mobile screen after sequence finishes
    if (window.innerWidth < 1024) {
      setTimeout(() => switchMobileSection('section-preview'), 600);
    }
  }

  // Single shot with countdown
  async function triggerCountdownAndSnap(slotIdx) {
    state.isCountingDown = true;
    shutterBtn.disabled = true;
    shutterLabel.innerText = 'Siap-siap pose!';

    await runCountdown(state.countdownSeconds);
    takeSinglePhoto(slotIdx);
    triggerFlashAndShutter();

    // Advance to next slot automatically if available
    const theme = getActiveTheme();
    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    const totalSlots = (theme.isOverlayImage && theme.slots) ? theme.slots.length : layout.count;
    if (slotIdx + 1 < totalSlots) {
      setActiveSlot(slotIdx + 1);
    }

    state.isCountingDown = false;
    shutterBtn.disabled = false;
    shutterLabel.innerText = 'Ambil Foto (Snap!)';
  }

  // Visual countdown (instant if seconds is 0)
  function runCountdown(seconds) {
    if (seconds <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let current = seconds;
      countdownDisplay.classList.remove('hidden');
      countdownNumber.innerText = current;
      if (window.soundEngine) window.soundEngine.playBeep(false);

      const interval = setInterval(() => {
        current--;
        if (current > 0) {
          countdownNumber.innerText = current;
          countdownNumber.classList.remove('animate-countdown-pop');
          void countdownNumber.offsetWidth; // retrigger animation
          countdownNumber.classList.add('animate-countdown-pop');
          if (window.soundEngine) window.soundEngine.playBeep(false);
        } else {
          clearInterval(interval);
          countdownDisplay.classList.add('hidden');
          if (window.soundEngine) window.soundEngine.playBeep(true);
          resolve();
        }
      }, 1000);
    });
  }

  // Grab snapshot from video element
  function takeSinglePhoto(slotIdx) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Handle horizontal flip if mirrored
    if (state.isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply photo filter via canvas
    const activeFilter = getActiveFilter();
    if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
      const filtered = document.createElement('canvas');
      filtered.width = canvas.width;
      filtered.height = canvas.height;
      const fCtx = filtered.getContext('2d');
      fCtx.filter = activeFilter.canvasFilter;
      fCtx.drawImage(canvas, 0, 0);
      const dataUrl = filtered.toDataURL('image/jpeg', 0.95);
      state.photos[slotIdx] = dataUrl;
    } else {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      state.photos[slotIdx] = dataUrl;
    }

    renderPhotoSlots();
  }

  // Screen Flash & Sound
  function triggerFlashAndShutter() {
    if (window.soundEngine) window.soundEngine.playShutter();
    flashOverlay.classList.add('flashing');
    setTimeout(() => {
      flashOverlay.classList.remove('flashing');
    }, 120);
  }

  // File Upload fallback / alternative
  fileUploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    let startIdx = state.activeSlotIndex;

    files.forEach((file, i) => {
      const targetSlot = (startIdx + i) % layout.count;
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        state.photos[targetSlot] = uploadEvt.target.result;
        renderPhotoSlots();
      };
      reader.readAsDataURL(file);
    });

    if (window.soundEngine) window.soundEngine.playPop();
  });

  // Clear all photos
  document.getElementById('btn-clear-photos').addEventListener('click', () => {
    if (confirm('Hapus semua foto di frame ini?')) {
      state.photos = [];
      renderPhotoSlots();
      if (window.soundEngine) window.soundEngine.playPop();
    }
  });

  // Load Demo Photos
  document.getElementById('btn-load-demo').addEventListener('click', () => {
    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    for (let i = 0; i < layout.count; i++) {
      state.photos[i] = generateDemoPhoto(i);
    }
    renderPhotoSlots();
    if (window.soundEngine) window.soundEngine.playSuccess();
  });

  function generateDemoPhoto(index) {
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 800;
    const ctx = c.getContext('2d');

    const palettes = [
      ['#ffd1dc', '#ffb6c1'],
      ['#e0f2fe', '#bae6fd'],
      ['#fef3c7', '#fde68a'],
      ['#ede9fe', '#ddd6fe'],
      ['#dcfce7', '#bbf7d0'],
      ['#fed7aa', '#fdba74']
    ];
    const p = palettes[index % palettes.length];
    const grad = ctx.createLinearGradient(0, 0, 600, 800);
    grad.addColorStop(0, p[0]);
    grad.addColorStop(1, p[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 800);

    // Decorative stars in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '24px sans-serif';
    ctx.fillText('★', 80, 100);
    ctx.fillText('✦', 500, 140);
    ctx.fillText('✧', 100, 700);
    ctx.fillText('★', 520, 680);

    // Cute face / avatar
    const emojis = ['(✿◠‿◠)', '(｡♥‿♥｡)', '( ˶ˆ꒳ˆ˵ )', 'ʕ•ᴥ•ʔ', '( ˘ ³˘)♥', '٩(◕‿◕｡)۶'];
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 58px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojis[index % emojis.length], 300, 390);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#ec4899';
    ctx.fillText(`STARMOON POSE #${index + 1} ♡`, 300, 480);

    return c.toDataURL('image/jpeg', 0.95);
  }

  // ----------------------------------------------------------------
  // 7. EXPORT, DOWNLOAD & PRINT
  // ----------------------------------------------------------------
  // Double strip print mode toggle
  document.getElementById('btn-toggle-double-strip').addEventListener('click', () => {
    state.doubleStrip = !state.doubleStrip;
    doubleStripStatus.innerText = state.doubleStrip ? '2 Strip (✓)' : '2 Strip';
    if (window.soundEngine) window.soundEngine.playPop();
  });

  // ────────────────────────────────────────────────────────────────
  // SweetAlert2 helper – aesthetic Starmon-themed toasts & popups
  // ────────────────────────────────────────────────────────────────
  const StarmonToast = typeof Swal !== 'undefined' ? Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'starmon-toast',
      timerProgressBar: 'starmon-toast-bar'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  }) : null;

  function showSuccess(title, text) {
    if (StarmonToast) {
      StarmonToast.fire({ icon: 'success', title, text });
    }
  }

  function showError(title, text) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'Coba Lagi 🔄',
        confirmButtonColor: '#f43f5e',
        background: '#fff5f8',
        color: '#4b2038',
        customClass: {
          popup: 'starmon-popup',
          confirmButton: 'starmon-confirm-btn'
        }
      });
    } else {
      alert(`${title}\n${text || ''}`);
    }
  }

  function showInfo(title, text) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonText: 'Oke ♡',
        confirmButtonColor: '#f43f5e',
        background: '#fff5f8',
        color: '#4b2038',
        customClass: { popup: 'starmon-popup', confirmButton: 'starmon-confirm-btn' }
      });
    }
  }

  // Download high-res PNG
  async function downloadPhotostrip() {
    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    const theme = getActiveTheme();
    const filter = getActiveFilter();

    // Check that we have at least 1 photo
    const filledPhotos = state.photos.filter(p => !!p);
    if (filledPhotos.length === 0) {
      showInfo('Belum Ada Foto 📷', 'Ambil dulu beberapa foto sebelum mengunduh ya!');
      return;
    }

    // Visual feedback – both buttons
    const btnBottom = document.getElementById('btn-download-bottom');
    const btnTop = document.getElementById('btn-download-top');
    const prevBottom = btnBottom.innerHTML;
    const prevTop = btnTop ? btnTop.innerHTML : '';
    const loadingHtml = `<span class="flex items-center gap-1.5"><svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"/></svg>Menyiapkan...</span>`;
    btnBottom.innerHTML = loadingHtml;
    btnBottom.disabled = true;
    if (btnTop) { btnTop.innerHTML = loadingHtml; btnTop.disabled = true; }

    try {
      const renderedCanvas = await exporter.renderToCanvas({
        layout,
        theme,
        photos: state.photos,
        filter,
        headerText: state.headerText,
        subText: state.subText,
        dateText: state.dateText,
        stickers: stickerManager.getStickersData(),
        customBgColor: state.customBgColor,
        doubleStrip: state.doubleStrip
      });

      const fileName = `starmon-${theme.id}-${Date.now()}.png`;
      await exporter.downloadImage(renderedCanvas, fileName);

      if (window.soundEngine) window.soundEngine.playSuccess();
      showSuccess('Foto Siap!', 'Strip foto kamu berhasil diunduh ✨');
    } catch (err) {
      console.error('Download error:', err);
      showError('Gagal Mengunduh', 'Terjadi kesalahan saat ekspor foto. Coba lagi ya!');
    } finally {
      btnBottom.innerHTML = prevBottom;
      btnBottom.disabled = false;
      if (btnTop) { btnTop.innerHTML = prevTop; btnTop.disabled = false; }
      lucide.createIcons();
    }
  }

  document.getElementById('btn-download-top').addEventListener('click', downloadPhotostrip);
  document.getElementById('btn-download-bottom').addEventListener('click', downloadPhotostrip);

  // Print button
  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });

  // ----------------------------------------------------------------
  // 8. TAB NAVIGATION & UTILITIES
  // ----------------------------------------------------------------
  document.querySelectorAll('.custom-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.custom-tab-btn').forEach(b => {
        b.className = 'custom-tab-btn flex-1 py-2 text-xs font-semibold rounded-xl transition text-slate-600 hover:text-rose-500';
      });
      btn.className = 'custom-tab-btn flex-1 py-2 text-xs font-bold rounded-xl transition text-white bg-rose-500 shadow-sm';

      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      const activeTabId = btn.dataset.tab;
      document.getElementById(activeTabId).classList.remove('hidden');

      if (window.soundEngine) window.soundEngine.playPop();
    });
  });

  // Sound toggle button
  const soundBtn = document.getElementById('btn-sound-toggle');
  soundBtn.addEventListener('click', () => {
    const isMuted = window.soundEngine.toggleMute();
    soundBtn.innerHTML = isMuted 
      ? '<i data-lucide="volume-x" class="w-4 h-4 text-slate-400"></i>'
      : '<i data-lucide="volume-2" class="w-4 h-4 text-rose-600"></i>';
    lucide.createIcons();
  });

  // Fullscreen toggle
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // ----------------------------------------------------------------
  // 9. RESPONSIVE MOBILE NAVIGATION
  // ----------------------------------------------------------------
  function switchMobileSection(targetSectionId) {
    document.querySelectorAll('.mobile-section-btn').forEach(btn => {
      if (btn.dataset.section === targetSectionId) {
        btn.className = 'mobile-section-btn flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-rose-500 text-white shadow-sm';
      } else {
        btn.className = 'mobile-section-btn flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 bg-pink-50 text-slate-600 hover:text-rose-500';
      }
    });

    document.querySelectorAll('.app-col-section').forEach(sec => {
      if (sec.id === targetSectionId) {
        sec.classList.add('mobile-active-section');
      } else {
        sec.classList.remove('mobile-active-section');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.soundEngine) window.soundEngine.playPop();
  }

  function initMobileNavigation() {
    document.querySelectorAll('.mobile-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchMobileSection(btn.dataset.section);
      });
    });

    // Quick jump cross-navigation buttons
    const btnGotoPreview = document.getElementById('btn-goto-preview');
    if (btnGotoPreview) {
      btnGotoPreview.addEventListener('click', () => switchMobileSection('section-preview'));
    }

    const btnPreviewToCam = document.getElementById('btn-preview-to-cam');
    if (btnPreviewToCam) {
      btnPreviewToCam.addEventListener('click', () => switchMobileSection('section-camera'));
    }

    const btnPreviewToEdit = document.getElementById('btn-preview-to-edit');
    if (btnPreviewToEdit) {
      btnPreviewToEdit.addEventListener('click', () => switchMobileSection('section-customize'));
    }

    const btnCustomizeToPreview = document.getElementById('btn-customize-to-preview');
    if (btnCustomizeToPreview) {
      btnCustomizeToPreview.addEventListener('click', () => switchMobileSection('section-preview'));
    }
  }

  function updatePhotoCountBadge() {
    const theme = getActiveTheme();
    const layout = LAYOUT_CONFIGS[state.currentLayoutId];
    const totalSlots = (theme.isOverlayImage && theme.slots) ? theme.slots.length : layout.count;
    const filledCount = state.photos.filter(p => !!p).length;
    const badge = document.getElementById('mobile-photo-count');
    if (badge) {
      badge.innerText = `${filledCount}/${totalSlots}`;
    }
  }

  // ----------------------------------------------------------------
  // 10. BOOTSTRAP APP
  // ----------------------------------------------------------------
  initLayoutsUI();
  initThemesUI();
  initFiltersUI();
  initStickersUI();
  initMobileNavigation();
  inputDate.value = state.dateText;
  stripFooterText.innerText = state.subText ? `${state.subText} · ${state.dateText}` : `STARMON · ${state.dateText}`;
  selectLayout('4-vertical');
  // Pre-load demo photos for immediate visual charm
  const initialLayout = LAYOUT_CONFIGS['4-vertical'];
  for (let i = 0; i < initialLayout.count; i++) {
    state.photos[i] = generateDemoPhoto(i);
  }
  renderPhotoSlots();
  selectTheme('coquette-pink');
  selectFilter('normal');
  setTimeout(() => {
    stickerManager.addSticker('🎀');
    stickerManager.addSticker('✨');
  }, 200);
  initWebcam();
});

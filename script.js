import { SITE_CONFIG, GALLERY_PHOTOS, COPY } from './js/content.js';
import {
  normalizeScriptMode,
  resolvePersonalization,
  formatLetterSalutation,
  getNextGalleryIndex,
  formatGalleryCounter,
  evaluateSwipeGesture,
  transitionLetterState,
  calculateReadingProgress,
  buildYouTubeEmbedUrl,
  getSyncedLyricIndex,
  transitionMusicPanelState,
} from './js/experience-core.js';
import { GentleAudioController } from './js/ambient-audio.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  script: normalizeScriptMode(SITE_CONFIG.defaultScript, 'hinglish'),
  letterState: 'closed',
  letterSongPlaying: false,
  letterSongStartedAt: 0,
  letterLyricTimerId: null,
  activeLyricIndex: 0,
  musicPanelState: 'closed',
  activePhotoIndex: -1,
  lastFocusedTrigger: null,
  swipeStart: null,
  audio: new GentleAudioController(SITE_CONFIG.music),
  letterAudioEl: null,
};

/* DOM References */
const els = {
  body: document.body,
  progressBar: document.getElementById('reading-progress-bar'),
  brandMark: document.getElementById('brand-mark'),
  audioToggle: document.getElementById('audio-toggle'),
  audioToggleText: document.getElementById('audio-toggle-text'),
  beginBtn: document.getElementById('begin-btn'),
  scriptSwitcher: document.getElementById('script-switcher'),
  scriptBtns: Array.from(document.querySelectorAll('[data-script-btn]')),
  heroName: document.getElementById('hero-name'),
  heroPortrait: document.getElementById('hero-portrait'),
  messageParagraphs: document.getElementById('message-paragraphs'),
  galleryGrid: document.getElementById('gallery-grid'),
  qualitiesList: document.getElementById('qualities-list'),
  envelopeCard: document.getElementById('envelope-card'),
  envelopeRecipient: document.getElementById('envelope-recipient'),
  openLetterBtn: document.getElementById('open-letter-btn'),
  closeLetterBtn: document.getElementById('close-letter-btn'),
  letterPaper: document.getElementById('letter-paper'),
  letterMetaRecipient: document.getElementById('letter-meta-recipient'),
  letterSalutation: document.getElementById('letter-salutation'),
  letterParagraphs: document.getElementById('letter-paragraphs'),
  letterSender: document.getElementById('letter-sender'),
  wishName: document.getElementById('wish-name'),
  lightbox: document.getElementById('photo-lightbox'),
  lightboxStage: document.getElementById('lightbox-stage'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxFallback: document.getElementById('lightbox-fallback'),
  lightboxFallbackText: document.getElementById('lightbox-fallback-text'),
  lightboxCounter: document.getElementById('lightbox-counter'),
  lightboxNote: document.getElementById('lightbox-note'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  lightboxClose: document.getElementById('lightbox-close'),
  lightboxPrev: document.getElementById('lightbox-prev'),
  lightboxNext: document.getElementById('lightbox-next'),
  musicPlayer: document.getElementById('music-player'),
  musicTitle: document.getElementById('music-title'),
  musicArtist: document.getElementById('music-artist'),
  musicMinimize: document.getElementById('music-minimize'),
  musicClose: document.getElementById('music-close'),
  musicEmbedSlot: document.getElementById('music-embed-slot'),
  letterSongTitle: document.getElementById('letter-song-title'),
  letterSongArtist: document.getElementById('letter-song-artist'),
  letterSongToggle: document.getElementById('letter-song-toggle'),
  letterSongToggleText: document.getElementById('letter-song-toggle-text'),
  letterLyricLines: document.getElementById('letter-lyric-lines'),
  letterSongEmbed: document.getElementById('letter-song-embed'),
  letterSongHint: document.getElementById('letter-song-hint'),
};

function getCopy() {
  return COPY[state.script] || COPY.hinglish;
}

function getPersonalization() {
  return resolvePersonalization(window.location.search, SITE_CONFIG, state.script);
}

/**
 * Helper to look up nested translation keys like 'intro.greeting'
 */
function lookupKey(obj, path) {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Renders all text, gallery items, qualities, letter copy, and accessible labels
 * in the active script ('hinglish' or 'hindi').
 */
function renderContent() {
  const copy = getCopy();
  const person = getPersonalization();

  els.body.dataset.script = state.script;
  document.documentElement.lang = state.script === 'hindi' ? 'hi' : 'hi-Latn';
  document.title = copy.pageTitle;

  if (els.brandMark) {
    els.brandMark.textContent = copy.brandMark;
  }

  // Update all static data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const text = key ? lookupKey(copy, key) : undefined;
    if (typeof text === 'string') {
      node.textContent = text;
    }
  });

  // Update recipient & sender names
  els.heroName.textContent = person.recipient;
  els.envelopeRecipient.textContent = person.recipient;
  els.letterMetaRecipient.textContent = person.recipient;
  els.letterSalutation.textContent = formatLetterSalutation(
    person.recipient,
    person.isCustomRecipient,
    state.script
  );
  els.letterSender.textContent = person.sender;
  els.wishName.textContent = person.recipient;

  // Update hero portrait alt text
  if (els.heroPortrait && GALLERY_PHOTOS[0]) {
    els.heroPortrait.alt = GALLERY_PHOTOS[0].alt[state.script];
  }

  // Update script switcher accessible states
  if (els.scriptSwitcher) {
    els.scriptSwitcher.setAttribute('aria-label', copy.scriptToggleLabel);
  }
  els.scriptBtns.forEach((btn) => {
    const active = btn.dataset.scriptBtn === state.script;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Update audio toggle label
  updateAudioButtonUI();

  // Render Section 02 paragraphs
  els.messageParagraphs.innerHTML = '';
  copy.message.paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    els.messageParagraphs.appendChild(p);
  });

  // Render Section 03 curated gallery
  renderGallery(copy);

  // Render Section 04 qualities
  els.qualitiesList.innerHTML = '';
  copy.qualities.items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'quality-item reveal is-visible';

    const head = document.createElement('div');
    head.className = 'quality-item__head';

    const num = document.createElement('span');
    num.className = 'quality-item__num';
    num.textContent = item.number;

    const title = document.createElement('h3');
    title.className = 'quality-item__title';
    title.textContent = item.title;

    const body = document.createElement('p');
    body.className = 'quality-item__body';
    body.textContent = item.body;

    head.append(num, title);
    li.append(head, body);
    els.qualitiesList.appendChild(li);
  });

  // Render Section 05 letter paragraphs & synced 3-line lyric excerpt
  els.letterParagraphs.innerHTML = '';
  copy.letter.paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    els.letterParagraphs.appendChild(p);
  });

  renderLetterSongUI();

  // Update lightbox labels if open or closed
  els.lightboxClose.setAttribute('aria-label', copy.gallery.closeLabel);
  els.lightboxPrev.setAttribute('aria-label', copy.gallery.prevLabel);
  els.lightboxNext.setAttribute('aria-label', copy.gallery.nextLabel);
  els.lightboxFallbackText.textContent = copy.gallery.fallbackTitle;

  if (state.activePhotoIndex >= 0 && els.lightbox.open) {
    renderLightboxPhoto(state.activePhotoIndex);
  }
}

/**
 * Renders the 6 supplied photographs preserving natural aspect ratios
 * (zero face cropping) and graceful missing-image fallbacks.
 */
function renderGallery(copy) {
  els.galleryGrid.innerHTML = '';

  GALLERY_PHOTOS.forEach((photo, index) => {
    const figure = document.createElement('figure');
    const isWideOnMobile = photo.layout === 'lead' || photo.layout === 'feature';
    figure.className = `gallery-card${isWideOnMobile ? ' gallery-card--wide' : ''}`;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'gallery-card__trigger';
    trigger.setAttribute(
      'aria-label',
      `${photo.note[state.script]} — ${copy.gallery.openLabel}`
    );
    trigger.addEventListener('click', () => openLightbox(index, trigger));

    const frame = document.createElement('div');
    frame.className = 'gallery-card__frame';

    const img = document.createElement('img');
    img.className = 'gallery-card__img';
    img.src = photo.src;
    img.alt = photo.alt[state.script];
    img.width = photo.width;
    img.height = photo.height;
    img.loading = index < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';

    img.addEventListener('error', () => {
      img.remove();
      const fallback = document.createElement('div');
      fallback.className = 'gallery-card__fallback';
      fallback.textContent = copy.gallery.fallbackTitle;
      frame.appendChild(fallback);
    });

    frame.appendChild(img);

    const meta = document.createElement('figcaption');
    meta.className = 'gallery-card__meta';

    const note = document.createElement('p');
    note.className = 'gallery-card__note';
    note.textContent = photo.note[state.script];

    const caption = document.createElement('p');
    caption.className = 'gallery-card__caption';
    caption.textContent = photo.caption[state.script];

    meta.append(note, caption);
    trigger.append(frame, meta);
    figure.appendChild(trigger);
    els.galleryGrid.appendChild(figure);
  });
}

/* ==========================================================================
   LIGHTBOX INTERACTIONS (TAP, SWIPE, KEYBOARD)
   ========================================================================== */
function openLightbox(index, triggerEl) {
  state.lastFocusedTrigger = triggerEl || document.activeElement;
  state.activePhotoIndex = index;
  renderLightboxPhoto(index);

  if (!els.lightbox.open) {
    els.lightbox.showModal();
  }
  els.body.style.overflow = 'hidden';
  els.lightboxClose.focus();
}

function closeLightbox() {
  if (els.lightbox.open) {
    els.lightbox.close();
  }
  els.body.style.overflow = '';
  state.activePhotoIndex = -1;
  if (state.lastFocusedTrigger && typeof state.lastFocusedTrigger.focus === 'function') {
    state.lastFocusedTrigger.focus();
  }
}

function stepLightbox(delta) {
  if (state.activePhotoIndex < 0) return;
  const nextIndex = getNextGalleryIndex(
    state.activePhotoIndex,
    delta,
    GALLERY_PHOTOS.length
  );
  if (nextIndex >= 0) {
    state.activePhotoIndex = nextIndex;
    renderLightboxPhoto(nextIndex);
  }
}

function renderLightboxPhoto(index) {
  const photo = GALLERY_PHOTOS[index];
  if (!photo) return;

  els.lightboxFallback.hidden = true;
  els.lightboxImg.hidden = false;
  els.lightboxImg.src = photo.src;
  els.lightboxImg.alt = photo.alt[state.script];
  els.lightboxCounter.textContent = formatGalleryCounter(
    index,
    GALLERY_PHOTOS.length,
    state.script
  );
  els.lightboxNote.textContent = photo.note[state.script];
  els.lightboxCaption.textContent = photo.caption[state.script];
}

function wireLightbox() {
  els.lightboxImg.addEventListener('error', () => {
    els.lightboxImg.hidden = true;
    els.lightboxFallback.hidden = false;
  });

  els.lightboxClose.addEventListener('click', closeLightbox);
  els.lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  els.lightboxNext.addEventListener('click', () => stepLightbox(1));

  els.lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });

  els.lightbox.addEventListener('click', (event) => {
    if (event.target === els.lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (!els.lightbox.open) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepLightbox(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepLightbox(-1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    }
  });

  // Mobile Android touch swipe support
  els.lightboxStage.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      state.swipeStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true }
  );

  els.lightboxStage.addEventListener(
    'touchend',
    (event) => {
      if (!state.swipeStart || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const gesture = evaluateSwipeGesture({
        startX: state.swipeStart.x,
        startY: state.swipeStart.y,
        endX: touch.clientX,
        endY: touch.clientY,
      });
      state.swipeStart = null;

      if (gesture === 'next') stepLightbox(1);
      if (gesture === 'prev') stepLightbox(-1);
    },
    { passive: true }
  );
}

/* ==========================================================================
   INTERACTIVE ENVELOPE, LETTER & SYNCED LETTER SONG MOMENT
   ========================================================================== */
function renderLetterSongUI() {
  const copy = getCopy();
  const cfg = SITE_CONFIG.letterSong;
  if (!cfg) return;

  if (els.letterSongTitle) {
    els.letterSongTitle.textContent = cfg.title[state.script];
  }
  if (els.letterSongArtist) {
    els.letterSongArtist.textContent = cfg.artist[state.script];
  }
  if (els.letterSongToggle && els.letterSongToggleText) {
    els.letterSongToggle.setAttribute('aria-pressed', String(state.letterSongPlaying));
    els.letterSongToggleText.textContent = state.letterSongPlaying
      ? copy.letter.songStop
      : copy.letter.songPlay;
  }

  if (els.letterLyricLines) {
    els.letterLyricLines.innerHTML = '';
    cfg.cues.forEach((cue, idx) => {
      const p = document.createElement('p');
      p.className = `letter-song__line${idx === state.activeLyricIndex ? ' is-active' : ''}`;
      p.textContent = cue[state.script];
      els.letterLyricLines.appendChild(p);
    });
  }
}

function updateActiveLyricHighlight() {
  const cfg = SITE_CONFIG.letterSong;
  if (!cfg || !els.letterLyricLines) return;
  const elapsed = Date.now() - state.letterSongStartedAt;
  const nextIdx = getSyncedLyricIndex(elapsed, cfg.cues);
  if (nextIdx !== state.activeLyricIndex) {
    state.activeLyricIndex = nextIdx;
    const lines = els.letterLyricLines.querySelectorAll('.letter-song__line');
    lines.forEach((line, idx) => {
      line.classList.toggle('is-active', idx === nextIdx);
    });
  }
}

function startLetterSong() {
  const cfg = SITE_CONFIG.letterSong;
  if (!cfg) return;

  // Never overlap two songs: stop Vaaroon if currently playing
  if (state.audio.isPlaying) {
    state.audio.pause();
  }
  if (state.musicPanelState !== 'closed') {
    applyMusicPanelState('closed');
  }

  stopLetterSong();

  state.letterSongPlaying = true;
  state.letterSongStartedAt = Date.now();
  state.activeLyricIndex = 0;

  if (cfg.src && cfg.src.trim()) {
    try {
      state.letterAudioEl = new Audio(cfg.src.trim());
      state.letterAudioEl.volume = 0.5;
      state.letterAudioEl.play().catch(() => {});
    } catch {
      // Ignore audio constructor failure
    }
  } else if (els.letterSongEmbed) {
    const embedUrl = buildYouTubeEmbedUrl(cfg.youtubeId, {
      autoplay: true,
      start: cfg.startSeconds || 0,
    });
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = cfg.title[state.script];
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = false;
      els.letterSongEmbed.innerHTML = '';
      els.letterSongEmbed.appendChild(iframe);
      els.letterSongEmbed.hidden = false;
      if (els.letterSongHint) els.letterSongHint.hidden = false;
    }
  }

  if (!prefersReducedMotion()) {
    state.letterLyricTimerId = window.setInterval(updateActiveLyricHighlight, 500);
  }

  renderLetterSongUI();
}

function stopLetterSong() {
  state.letterSongPlaying = false;
  if (state.letterLyricTimerId !== null) {
    window.clearInterval(state.letterLyricTimerId);
    state.letterLyricTimerId = null;
  }
  if (state.letterAudioEl) {
    state.letterAudioEl.pause();
    state.letterAudioEl = null;
  }
  if (els.letterSongEmbed) {
    els.letterSongEmbed.innerHTML = '';
    els.letterSongEmbed.hidden = true;
  }
  if (els.letterSongHint) {
    els.letterSongHint.hidden = true;
  }
  state.activeLyricIndex = 0;
  renderLetterSongUI();
}

function setLetterState(nextState) {
  state.letterState = nextState;
  els.body.dataset.letterState = nextState;

  const isOpen = nextState === 'open';
  els.openLetterBtn.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    els.envelopeCard.hidden = true;
    els.letterPaper.hidden = false;
    els.letterPaper.focus({ preventScroll: true });
    startLetterSong();
  } else if (nextState === 'closed') {
    stopLetterSong();
    els.letterPaper.hidden = true;
    els.envelopeCard.hidden = false;
  }
}

function wireLetter() {
  els.openLetterBtn.addEventListener('click', () => {
    const reduced = prefersReducedMotion();
    const next = transitionLetterState(state.letterState, 'open', reduced);
    setLetterState(next);

    if (next === 'opening') {
      window.setTimeout(() => {
        const finalState = transitionLetterState(
          state.letterState,
          'animation_done',
          false
        );
        setLetterState(finalState);
      }, 480);
    }
  });

  els.closeLetterBtn.addEventListener('click', () => {
    const next = transitionLetterState(state.letterState, 'close', true);
    setLetterState(next);
    els.openLetterBtn.focus();
  });

  if (els.letterSongToggle) {
    els.letterSongToggle.addEventListener('click', () => {
      if (state.letterSongPlaying) {
        stopLetterSong();
      } else {
        startLetterSong();
      }
    });
  }
}

/* ==========================================================================
   OPTIONAL USER-INITIATED SONG PLAYER (VAAROON — MIRZAPUR)
   ========================================================================== */
function hasLocalAudioFile() {
  return Boolean(SITE_CONFIG.music?.src && SITE_CONFIG.music.src.trim());
}

function isMusicActive() {
  return hasLocalAudioFile()
    ? state.audio.isPlaying
    : state.musicPanelState !== 'closed';
}

function mountYouTubeSong() {
  if (!els.musicEmbedSlot || els.musicEmbedSlot.querySelector('iframe')) return;
  const embedUrl = buildYouTubeEmbedUrl(SITE_CONFIG.music?.youtubeId, {
    autoplay: true,
  });
  if (!embedUrl) return;

  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.title =
    SITE_CONFIG.music?.title?.[state.script] || 'Vaaroon — Mirzapur';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = false;
  els.musicEmbedSlot.appendChild(iframe);
}

function unmountYouTubeSong() {
  if (els.musicEmbedSlot) {
    els.musicEmbedSlot.innerHTML = '';
  }
}

function applyMusicPanelState(nextState) {
  state.musicPanelState = nextState;
  els.body.dataset.musicState = nextState;

  if (!els.musicPlayer) return;

  if (nextState === 'closed') {
    unmountYouTubeSong();
    els.musicPlayer.hidden = true;
    els.musicPlayer.classList.remove('is-minimized');
  } else {
    els.musicPlayer.hidden = false;
    els.musicPlayer.classList.toggle('is-minimized', nextState === 'minimized');
    mountYouTubeSong();
  }

  updateAudioButtonUI();
}

function updateAudioButtonUI() {
  const copy = getCopy();
  const active = isMusicActive();

  els.audioToggle.setAttribute('aria-pressed', String(active));
  els.audioToggle.setAttribute(
    'aria-expanded',
    String(!hasLocalAudioFile() && state.musicPanelState !== 'closed')
  );
  els.audioToggle.setAttribute(
    'aria-label',
    active ? copy.audio.ariaPause : copy.audio.ariaPlay
  );
  els.audioToggleText.textContent = active ? copy.audio.pause : copy.audio.play;

  if (els.musicTitle && SITE_CONFIG.music?.title) {
    els.musicTitle.textContent = SITE_CONFIG.music.title[state.script];
  }
  if (els.musicArtist && SITE_CONFIG.music?.artist) {
    els.musicArtist.textContent = SITE_CONFIG.music.artist[state.script];
  }
  if (els.musicMinimize) {
    const isMin = state.musicPanelState === 'minimized';
    els.musicMinimize.setAttribute(
      'aria-label',
      isMin ? copy.audio.expand : copy.audio.minimize
    );
  }
  if (els.musicClose) {
    els.musicClose.setAttribute('aria-label', copy.audio.close);
  }
}

function wireAudio() {
  els.audioToggle.addEventListener('click', async () => {
    if (state.letterSongPlaying) {
      stopLetterSong();
    }
    if (hasLocalAudioFile()) {
      await state.audio.toggle();
      updateAudioButtonUI();
      return;
    }
    const next = transitionMusicPanelState(state.musicPanelState, 'toggle');
    applyMusicPanelState(next);
  });

  if (els.musicMinimize) {
    els.musicMinimize.addEventListener('click', () => {
      const action =
        state.musicPanelState === 'minimized' ? 'expand' : 'minimize';
      const next = transitionMusicPanelState(state.musicPanelState, action);
      applyMusicPanelState(next);
    });
  }

  if (els.musicClose) {
    els.musicClose.addEventListener('click', () => {
      const next = transitionMusicPanelState(state.musicPanelState, 'close');
      applyMusicPanelState(next);
      els.audioToggle.focus();
    });
  }
}

/* ==========================================================================
   NAVIGATION, READING PROGRESS & SUBTLE REVEALS
   ========================================================================== */
function wireNavigationAndScroll() {
  els.beginBtn.addEventListener('click', () => {
    const target = document.getElementById('message');
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  });

  els.scriptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextScript = normalizeScriptMode(btn.dataset.scriptBtn, state.script);
      if (nextScript !== state.script) {
        state.script = nextScript;
        renderContent();
      }
    });
  });

  let ticking = false;
  const syncProgress = () => {
    const progress = calculateReadingProgress(
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight
    );
    if (els.progressBar) {
      els.progressBar.style.transform = `scaleX(${progress})`;
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(syncProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  syncProgress();

  // Subtle intersection reveal (respects reduced motion and keeps content immediately accessible)
  if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        node.classList.add('is-visible');
      } else {
        observer.observe(node);
      }
    });
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function init() {
  renderContent();
  wireLightbox();
  wireLetter();
  wireAudio();
  wireNavigationAndScroll();

  // Optional ?autostart=1 support to jump directly into the story
  const person = getPersonalization();
  if (person.autostart) {
    const target = document.getElementById('message');
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}

init();

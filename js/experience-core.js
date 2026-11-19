/**
 * Pure, decoupled application logic for the birthday experience.
 * Zero DOM dependencies so every state transition and calculation
 * can be deterministically unit-tested.
 */

export const VALID_SCRIPTS = ['hinglish', 'hindi'];

/**
 * Normalizes script mode to 'hinglish' or 'hindi'.
 */
export function normalizeScriptMode(value, fallback = 'hinglish') {
  if (typeof value === 'string') {
    const cleaned = value.trim().toLowerCase();
    if (VALID_SCRIPTS.includes(cleaned)) {
      return cleaned;
    }
  }
  return VALID_SCRIPTS.includes(fallback) ? fallback : 'hinglish';
}

/**
 * Sanitizes an optional URL personalization parameter (e.g. ?name=Anjali).
 */
export function sanitizePersonName(raw, maxLength = 32) {
  if (typeof raw !== 'string') return '';
  const cleaned = raw
    .replace(/[<>"'`{}[\]\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  return cleaned.slice(0, maxLength);
}

/**
 * Resolves recipient and sender names from URL query params or defaults.
 */
export function resolvePersonalization(searchString, defaults, scriptMode) {
  const mode = normalizeScriptMode(scriptMode);
  const params = new URLSearchParams(searchString || '');

  const queryName = sanitizePersonName(params.get('name'));
  const queryFrom = sanitizePersonName(params.get('from'));
  const autostart = params.get('autostart') === '1';

  const defaultRecipient = mode === 'hindi' ? 'मेरा सुकून' : 'Mera Sukoon';
  const configRecipient = sanitizePersonName(defaults?.recipientName?.[mode] || '');
  const recipient = queryName || configRecipient || defaultRecipient;

  const isCustomRecipient = Boolean(
    queryName || (configRecipient && configRecipient !== defaultRecipient)
  );

  const sender =
    queryFrom ||
    (defaults?.senderName && defaults.senderName[mode]) ||
    (mode === 'hindi' ? 'हमेशा तुम्हारा' : 'Hamesha Tumhara');

  return {
    recipient,
    sender,
    isCustomRecipient,
    autostart,
  };
}

/**
 * Formats a grammatically natural Hindi/Hinglish letter salutation.
 * Avoids awkward phrasing like "Meri pyaari Mera Sukoon," when using the default endearment.
 */
export function formatLetterSalutation(recipient, isCustomRecipient, scriptMode = 'hinglish') {
  const mode = normalizeScriptMode(scriptMode);
  if (!isCustomRecipient) {
    return mode === 'hindi' ? 'मेरे सुकून,' : 'Mere sukoon,';
  }
  return mode === 'hindi' ? `मेरी प्यारी ${recipient},` : `Meri pyaari ${recipient},`;
}

/**
 * Cycles gallery index safely in either direction (+1 or -1).
 */
export function getNextGalleryIndex(currentIndex, delta, totalItems) {
  if (!Number.isInteger(totalItems) || totalItems <= 0) {
    return -1;
  }
  const safeCurrent =
    Number.isInteger(currentIndex) && currentIndex >= 0
      ? currentIndex % totalItems
      : 0;
  const step = Number.isInteger(delta) ? delta : 0;
  return (((safeCurrent + step) % totalItems) + totalItems) % totalItems;
}

/**
 * Formats 1-based gallery counter in Latin or Devanagari numerals.
 */
export function formatGalleryCounter(index, total, scriptMode = 'hinglish') {
  if (total <= 0 || index < 0) return '';
  const current = index + 1;
  if (normalizeScriptMode(scriptMode) === 'hindi') {
    return `${toDevanagariDigits(current)} / ${toDevanagariDigits(total)}`;
  }
  return `${current} / ${total}`;
}

/**
 * Converts ASCII digits 0-9 into Devanagari numerals ०-९.
 */
export function toDevanagariDigits(value) {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(value).replace(/\d/g, (d) => digits[Number(d)]);
}

/**
 * Evaluates a touch swipe gesture inside the photo lightbox.
 * Returns 'next' (swiped left), 'prev' (swiped right), or null (ignore).
 */
export function evaluateSwipeGesture(
  { startX, startY, endX, endY },
  { minDistance = 42, maxVerticalRatio = 0.85 } = {}
) {
  const dx = endX - startX;
  const dy = endY - startY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (absX < minDistance) return null;
  if (absY > absX * maxVerticalRatio) return null;

  return dx < 0 ? 'next' : 'prev';
}

/**
 * Pure state machine for the interactive letter envelope.
 * States: 'closed' | 'opening' | 'open'
 */
export function transitionLetterState(currentState, action, reducedMotion = false) {
  if (action === 'open') {
    if (currentState === 'open') return 'open';
    return reducedMotion ? 'open' : 'opening';
  }
  if (action === 'animation_done') {
    return currentState === 'opening' ? 'open' : currentState;
  }
  if (action === 'close') {
    return 'closed';
  }
  return currentState;
}

/**
 * Clamps scroll reading progress to [0, 1].
 */
export function calculateReadingProgress(scrollY, scrollHeight, viewportHeight) {
  const scrollable = scrollHeight - viewportHeight;
  if (scrollable <= 0) return 0;
  const ratio = scrollY / scrollable;
  if (ratio <= 0) return 0;
  if (ratio >= 1) return 1;
  return Number(ratio.toFixed(4));
}

/**
 * Builds a clean, privacy-enhanced YouTube embed URL for a validated video ID,
 * with optional start timestamp in whole seconds.
 */
export function buildYouTubeEmbedUrl(videoId, { autoplay = true, start = 0 } = {}) {
  if (typeof videoId !== 'string') return '';
  const cleaned = videoId.trim();
  if (!/^[A-Za-z0-9_-]{11}$/.test(cleaned)) return '';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  const startSec = Number.isFinite(start) ? Math.floor(start) : 0;
  if (startSec > 0) {
    params.set('start', String(startSec));
  }
  return `https://www.youtube-nocookie.com/embed/${cleaned}?${params.toString()}`;
}

/**
 * Resolves which lyric line index should be highlighted for a given elapsed time (ms).
 * Each cue has an `atMs` offset relative to the synced clip start.
 */
export function getSyncedLyricIndex(elapsedMs, cues) {
  if (!Array.isArray(cues) || cues.length === 0) return -1;
  const safeElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  let active = 0;
  for (let i = 0; i < cues.length; i += 1) {
    if (safeElapsed >= (cues[i]?.atMs ?? 0)) {
      active = i;
    }
  }
  return active;
}

/**
 * Pure state machine for the optional song player drawer.
 * States: 'closed' | 'open' | 'minimized'
 */
export function transitionMusicPanelState(currentState, action) {
  if (action === 'toggle') {
    return currentState === 'closed' ? 'open' : 'closed';
  }
  if (action === 'open') {
    return 'open';
  }
  if (action === 'minimize') {
    return currentState === 'open' ? 'minimized' : currentState;
  }
  if (action === 'expand') {
    return currentState === 'minimized' ? 'open' : currentState;
  }
  if (action === 'close') {
    return 'closed';
  }
  return currentState;
}

/**
 * Returns an ordered, deduplicated list of image sources to try for a photo.
 * Prioritizes guaranteed embedded data URIs so GitHub Pages never breaks if
 * binary files are missing, while honoring explicit customSrc overrides first.
 */
export function resolvePhotoSourceList(photo, embeddedMap = {}) {
  if (!photo || typeof photo !== 'object') return [];
  const candidates = [];

  if (typeof photo.customSrc === 'string' && photo.customSrc.trim()) {
    candidates.push(photo.customSrc.trim());
  }
  if (photo.id && embeddedMap && typeof embeddedMap[photo.id] === 'string' && embeddedMap[photo.id]) {
    candidates.push(embeddedMap[photo.id]);
  }
  if (typeof photo.src === 'string' && photo.src.trim()) {
    candidates.push(photo.src.trim());
  }
  if (typeof photo.fileSrc === 'string' && photo.fileSrc.trim()) {
    candidates.push(photo.fileSrc.trim());
  }

  return Array.from(new Set(candidates));
}

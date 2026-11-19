import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeScriptMode,
  sanitizePersonName,
  resolvePersonalization,
  formatLetterSalutation,
  getNextGalleryIndex,
  formatGalleryCounter,
  toDevanagariDigits,
  evaluateSwipeGesture,
  transitionLetterState,
  calculateReadingProgress,
  buildYouTubeEmbedUrl,
  getSyncedLyricIndex,
  transitionMusicPanelState,
} from './experience-core.js';

test('normalizeScriptMode returns valid modes and falls back safely', () => {
  assert.equal(normalizeScriptMode('hindi'), 'hindi');
  assert.equal(normalizeScriptMode(' HINGLISH '), 'hinglish');
  assert.equal(normalizeScriptMode('english', 'hinglish'), 'hinglish');
  assert.equal(normalizeScriptMode(undefined, 'hindi'), 'hindi');
});

test('sanitizePersonName strips unsafe characters and clamps length', () => {
  assert.equal(sanitizePersonName('  Anjali  '), 'Anjali');
  assert.equal(sanitizePersonName('<script>Riya</script>'), 'scriptRiya/script');
  assert.equal(sanitizePersonName('   '), '');
  assert.equal(sanitizePersonName('A'.repeat(50), 10).length, 10);
});

test('resolvePersonalization reads URL params and falls back to defaults', () => {
  const defaults = {
    recipientName: { hinglish: 'Mera Sukoon', hindi: 'मेरा सुकून' },
    senderName: { hinglish: 'Hamesha Tumhara', hindi: 'हमेशा तुम्हारा' },
  };

  const fallbackHindi = resolvePersonalization('', defaults, 'hindi');
  assert.equal(fallbackHindi.recipient, 'मेरा सुकून');
  assert.equal(fallbackHindi.sender, 'हमेशा तुम्हारा');
  assert.equal(fallbackHindi.isCustomRecipient, false);
  assert.equal(fallbackHindi.autostart, false);

  const custom = resolvePersonalization('?name=Anjali&from=Kabir&autostart=1', defaults, 'hinglish');
  assert.equal(custom.recipient, 'Anjali');
  assert.equal(custom.sender, 'Kabir');
  assert.equal(custom.isCustomRecipient, true);
  assert.equal(custom.autostart, true);
});

test('formatLetterSalutation produces natural Hindi and Hinglish greetings', () => {
  assert.equal(formatLetterSalutation('Mera Sukoon', false, 'hinglish'), 'Mere sukoon,');
  assert.equal(formatLetterSalutation('मेरा सुकून', false, 'hindi'), 'मेरे सुकून,');
  assert.equal(formatLetterSalutation('Anjali', true, 'hinglish'), 'Meri pyaari Anjali,');
  assert.equal(formatLetterSalutation('अंजलि', true, 'hindi'), 'मेरी प्यारी अंजलि,');
});

test('getNextGalleryIndex wraps forward and backward cleanly across 6 photos', () => {
  assert.equal(getNextGalleryIndex(0, 1, 6), 1);
  assert.equal(getNextGalleryIndex(5, 1, 6), 0);
  assert.equal(getNextGalleryIndex(0, -1, 6), 5);
  assert.equal(getNextGalleryIndex(2, -1, 6), 1);
  assert.equal(getNextGalleryIndex(0, 1, 0), -1);
});

test('formatGalleryCounter formats Latin and Devanagari numerals accurately', () => {
  assert.equal(toDevanagariDigits(16), '१६');
  assert.equal(formatGalleryCounter(0, 6, 'hinglish'), '1 / 6');
  assert.equal(formatGalleryCounter(0, 6, 'hindi'), '१ / ६');
  assert.equal(formatGalleryCounter(5, 6, 'hindi'), '६ / ६');
});

test('evaluateSwipeGesture detects deliberate horizontal swipes and ignores vertical scroll', () => {
  assert.equal(
    evaluateSwipeGesture({ startX: 280, startY: 400, endX: 160, endY: 412 }),
    'next'
  );
  assert.equal(
    evaluateSwipeGesture({ startX: 120, startY: 400, endX: 230, endY: 390 }),
    'prev'
  );
  assert.equal(
    evaluateSwipeGesture({ startX: 200, startY: 300, endX: 215, endY: 305 }),
    null
  );
  assert.equal(
    evaluateSwipeGesture({ startX: 200, startY: 300, endX: 140, endY: 450 }),
    null
  );
});

test('transitionLetterState follows envelope opening and reduced-motion rules', () => {
  assert.equal(transitionLetterState('closed', 'open', false), 'opening');
  assert.equal(transitionLetterState('opening', 'animation_done', false), 'open');
  assert.equal(transitionLetterState('open', 'close', false), 'closed');
  assert.equal(transitionLetterState('closed', 'open', true), 'open');
});

test('calculateReadingProgress clamps scroll progress between 0 and 1', () => {
  assert.equal(calculateReadingProgress(0, 2000, 800), 0);
  assert.equal(calculateReadingProgress(600, 2000, 800), 0.5);
  assert.equal(calculateReadingProgress(1500, 2000, 800), 1);
  assert.equal(calculateReadingProgress(-40, 2000, 800), 0);
  assert.equal(calculateReadingProgress(100, 800, 800), 0);
});

test('buildYouTubeEmbedUrl validates IDs and formats privacy-enhanced embed URL with optional start time', () => {
  const url = buildYouTubeEmbedUrl('s_WCm5PMzmk', { autoplay: true });
  assert.equal(
    url,
    'https://www.youtube-nocookie.com/embed/s_WCm5PMzmk?autoplay=1&rel=0&modestbranding=1&playsinline=1'
  );
  const syncedUrl = buildYouTubeEmbedUrl('Cb6wuzOurPc', { autoplay: true, start: 47 });
  assert.equal(
    syncedUrl,
    'https://www.youtube-nocookie.com/embed/Cb6wuzOurPc?autoplay=1&rel=0&modestbranding=1&playsinline=1&start=47'
  );
  assert.equal(buildYouTubeEmbedUrl('invalid-id'), '');
  assert.equal(buildYouTubeEmbedUrl(''), '');
});

test('getSyncedLyricIndex tracks active chorus line by elapsed milliseconds', () => {
  const cues = [{ atMs: 0 }, { atMs: 6500 }, { atMs: 13500 }];
  assert.equal(getSyncedLyricIndex(0, cues), 0);
  assert.equal(getSyncedLyricIndex(4200, cues), 0);
  assert.equal(getSyncedLyricIndex(6500, cues), 1);
  assert.equal(getSyncedLyricIndex(14000, cues), 2);
  assert.equal(getSyncedLyricIndex(-500, cues), 0);
  assert.equal(getSyncedLyricIndex(1000, []), -1);
});

test('transitionMusicPanelState manages closed, open, and minimized states cleanly', () => {
  assert.equal(transitionMusicPanelState('closed', 'toggle'), 'open');
  assert.equal(transitionMusicPanelState('open', 'minimize'), 'minimized');
  assert.equal(transitionMusicPanelState('minimized', 'expand'), 'open');
  assert.equal(transitionMusicPanelState('minimized', 'toggle'), 'closed');
  assert.equal(transitionMusicPanelState('open', 'close'), 'closed');
});

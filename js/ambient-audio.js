/**
 * Optional, user-initiated ambient audio controller.
 * - Never autoplays. Starts ONLY when the user explicitly taps Play.
 * - If SITE_CONFIG.music.src points to an MP3/audio file, plays that file.
 * - Otherwise synthesizes a delicate, warm, low-volume pentatonic piano/celesta
 *   arpeggio via Web Audio API so the control is genuinely functional out of the box.
 */

export class GentleAudioController {
  constructor({ src = '', volume = 0.4 } = {}) {
    this.src = src ? src.trim() : '';
    this.volume = volume;
    this.isPlaying = false;
    this.audioEl = null;
    this.ctx = null;
    this.masterGain = null;
    this.timerId = null;
    this.step = 0;

    // Warm, calm Raag Bhupali / major pentatonic notes (Hz)
    this.melody = [
      261.63, // C4
      329.63, // E4
      392.0,  // G4
      440.0,  // A4
      523.25, // C5
      440.0,  // A4
      392.0,  // G4
      329.63, // E4
      293.66, // D4
      392.0,  // G4
      440.0,  // A4
      329.63, // E4
    ];
  }

  async toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    }
    await this.play();
    return this.isPlaying;
  }

  async play() {
    if (this.isPlaying) return;

    if (this.src) {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio(this.src);
          this.audioEl.loop = true;
          this.audioEl.volume = this.volume;
        }
        await this.audioEl.play();
        this.isPlaying = true;
        return;
      } catch {
        // If custom file isn't present yet, fall back cleanly to gentle synth
      }
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.14, now, 0.35);

      this.isPlaying = true;
      this.playNextNote();
      this.timerId = window.setInterval(() => this.playNextNote(), 1650);
    } catch {
      this.isPlaying = false;
    }
  }

  playNextNote() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freq = this.melody[this.step % this.melody.length];
    this.step += 1;

    // Warm soft sine + subtle overtone harmonic
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.08, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.45, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 2.5);
    overtone.stop(now + 2.5);
  }

  pause() {
    this.isPlaying = false;

    if (this.audioEl) {
      this.audioEl.pause();
    }

    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.18);
    }
  }
}

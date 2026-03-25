/** Lightweight Web Audio API sound manager – lazy AudioContext init. */

import { STORAGE_KEYS } from "@/constants/storageKeys";

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean;

  constructor() {
    try {
      this.muted = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === "true";
    } catch {
      this.muted = false;
    }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.4,
  ) {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
    osc.start(start);
    osc.stop(start + dur);
  }

  isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(this.muted));
    } catch { /* silent fail */ }
    return this.muted;
  }

  /** 3-note ascending arpeggio: F#4 → A#4 → C#5 */
  playCorrect() {
    if (this.muted) return;
    try {
      const now = this.getCtx().currentTime;
      this.tone(370, now, 0.12);
      this.tone(466, now + 0.08, 0.12);
      this.tone(554, now + 0.16, 0.15);
    } catch { /* silent fail */ }
  }

  /** Descending E4 → C4, triangle wave */
  playIncorrect() {
    if (this.muted) return;
    try {
      const now = this.getCtx().currentTime;
      this.tone(330, now, 0.15, "triangle");
      this.tone(262, now + 0.1, 0.2, "triangle");
    } catch { /* silent fail */ }
  }

  playTap() {
    if (this.muted) return;
    try {
      this.tone(600, this.getCtx().currentTime, 0.05, "sine", 0.3);
    } catch { /* silent fail */ }
  }

  playCelebration() {
    if (this.muted) return;
    try {
      const now = this.getCtx().currentTime;
      [523, 659, 784, 1047].forEach((f, i) => this.tone(f, now + i * 0.1, 0.2));
    } catch { /* silent fail */ }
  }

  /** 5-note fanfare: C5-E5-G5-C6-E6 */
  playLessonComplete() {
    if (this.muted) return;
    try {
      const now = this.getCtx().currentTime;
      const notes = [523, 659, 784, 1047, 1319];
      notes.forEach((f, i) => {
        const dur = i === notes.length - 1 ? 0.3 : 0.12;
        this.tone(f, now + i * 0.05, dur);
      });
    } catch { /* silent fail */ }
  }

  /** Deeper celebratory: G4-B4-D5-G5 */
  playStreakMilestone() {
    if (this.muted) return;
    try {
      const now = this.getCtx().currentTime;
      [392, 494, 587, 784].forEach((f, i) => this.tone(f, now + i * 0.15, 0.25));
    } catch { /* silent fail */ }
  }
}

export const sounds = new SoundManager();

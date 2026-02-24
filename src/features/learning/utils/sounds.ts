/** Lightweight Web Audio API sound manager – lazy AudioContext init. */

class SoundManager {
  private ctx: AudioContext | null = null;

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

  playCorrect() {
    try {
      const now = this.getCtx().currentTime;
      this.tone(370, now, 0.1);
      this.tone(466, now + 0.1, 0.15);
    } catch { /* silent fail */ }
  }

  playIncorrect() {
    try {
      const now = this.getCtx().currentTime;
      this.tone(330, now, 0.15, "triangle");
    } catch { /* silent fail */ }
  }

  playTap() {
    try {
      this.tone(600, this.getCtx().currentTime, 0.05, "sine", 0.3);
    } catch { /* silent fail */ }
  }

  playCelebration() {
    try {
      const now = this.getCtx().currentTime;
      [523, 659, 784, 1047].forEach((f, i) => this.tone(f, now + i * 0.1, 0.2));
    } catch { /* silent fail */ }
  }
}

export const sounds = new SoundManager();

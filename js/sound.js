/**
 * Web Audio API Sound Synthesizer
 * Provides authentic Among Us-themed SFX with zero external audio assets.
 * Respects user mute preference stored in localStorage.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem("pdeu_sound_muted") === "true";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("pdeu_sound_muted", this.isMuted);
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Soft interface click
  click() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext might be blocked until user gesture
    }
  }

  // Task / Puzzle Success Chime
  success() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  // Puzzle Wrong Answer Buzz
  error() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch (e) {}
  }

  // Impostor Sabotage Alarm Klaxon
  sabotageAlarm() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Two-pulse siren
      [0, 0.28].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        const t = this.ctx.currentTime + offset;
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.24);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  }

  // Rogue AI Glitch Zap / Electronic Static
  glitch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.setValueAtTime(780, now + 0.05);
      osc.frequency.setValueAtTime(200, now + 0.1);
      osc.frequency.setValueAtTime(950, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // Dramatic Role Reveal chord
  roleReveal(isImpostor) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = isImpostor ? [180, 214, 254, 360] : [261.63, 329.63, 392.00, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isImpostor ? "sawtooth" : "triangle";
        osc.frequency.value = freq;
        const t = this.ctx.currentTime + (idx * 0.04);
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.3);
      });
    } catch (e) {}
  }
}

export const sound = new SoundController();

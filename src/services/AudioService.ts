/**
 * Audio service for the ABC Junior game.
 * Uses Web Speech API for teacher voice and Web Audio for sound effects.
 */

class AudioService {
  private synth = window.speechSynthesis;
  private isEnabled = true;
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying = false;

  private isMusicMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.bgMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'); // Mellow, softer track
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.01; // Extremely soft background music
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.synth.cancel();
    }
  }

  isMusicOn() {
    return !this.isMusicMuted;
  }

  toggleMusic() {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.isMusicMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  startMusic() {
    if (this.isMusicMuted || !this.bgMusic) return;
    this.bgMusic.play().catch(e => console.log('Music play blocked', e));
  }

  stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  speak(text: string, rate: number = 0.82, pitch: number = 1.05) {
    if (!this.isEnabled) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch; // Slightly higher but natural pitch for clear guidance
    utterance.rate = rate; // Gentle pace, not too slow
    utterance.volume = 1.0; 
    
    // Find a friendly female voice if possible
    const voices = this.synth.getVoices();
    const friendlyVoice = voices.find(v => 
      v.name.includes('Premium') || 
      v.name.includes('Natural') || 
      v.name.includes('Female') || 
      v.name.includes('Microsoft Maria') || // Common high-quality Windows voice
      v.name.includes('Google US English') || 
      v.lang.startsWith('en-GB')
    );
    if (friendlyVoice) utterance.voice = friendlyVoice;
    
    this.synth.speak(utterance);
  }

  playEffect(type: 'click' | 'correct' | 'wrong' | 'pop' | 'match' | 'fanfare' | 'trace' | 'brush' | 'sparkle' | 'boing' | 'pageTurn' | 'pencil' | 'blocks') {
    if (!this.isEnabled) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'pageTurn':
        // Soft white noise sweep
        const pSize = ctx.sampleRate * 0.2;
        const pBuffer = ctx.createBuffer(1, pSize, ctx.sampleRate);
        const pData = pBuffer.getChannelData(0);
        for (let i = 0; i < pSize; i++) pData[i] = (Math.random() * 2 - 1) * (1 - i / pSize);
        const pSource = ctx.createBufferSource();
        pSource.buffer = pBuffer;
        const pGain = ctx.createGain();
        pSource.connect(pGain);
        pGain.connect(ctx.destination);
        pGain.gain.setValueAtTime(0.05, now);
        pGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        pSource.start(now);
        pSource.stop(now + 0.2);
        break;
      case 'pencil':
        // High pitch scratchy noise
        const penSize = ctx.sampleRate * 0.1;
        const penBuffer = ctx.createBuffer(1, penSize, ctx.sampleRate);
        const penData = penBuffer.getChannelData(0);
        for (let i = 0; i < penSize; i++) {
          penData[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.1);
        }
        const penSource = ctx.createBufferSource();
        penSource.buffer = penBuffer;
        const penGain = ctx.createGain();
        penSource.connect(penGain);
        penGain.connect(ctx.destination);
        penGain.gain.setValueAtTime(0.02, now);
        penGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        penSource.start(now);
        penSource.stop(now + 0.1);
        break;
      case 'blocks':
        // Short, high-frequency impact
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'boing':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now); // Slightly louder effect
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'trace':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'brush':
        // White noise like sound for brush
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        noise.start(now);
        noise.stop(now + 0.1);
        break;
      case 'sparkle':
        for(let i=0; i<3; i++) {
          const t = now + i * 0.05;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(1000 + i * 500, t);
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.1, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          o.start(t);
          o.stop(t + 0.1);
        }
        break;
      case 'correct':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2);
        gain.gain.setValueAtTime(0.2, now); // Slightly louder
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'wrong':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'pop':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.3, now); // Much clearer POP sound
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'fanfare':
        this.playChord(ctx, [523.25, 659.25, 783.99], now, 0.5);
        break;
    }
  }

  private playChord(ctx: AudioContext, freqs: number[], start: number, duration: number) {
    freqs.forEach(f => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, start);
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.05, start);
      g.gain.exponentialRampToValueAtTime(0.001, start + duration);
      o.start(start);
      o.stop(start + duration);
    });
  }
}

export const audioService = new AudioService();

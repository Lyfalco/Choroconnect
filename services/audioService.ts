
class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Browsers handle AudioContext lazily
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  // Must be called on first user interaction (e.g., Play button)
  public async initialize() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  public getMuteState() {
    return this.isMuted;
  }

  // --- SOUND GENERATORS ---

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 1) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration + 0.1);
  }

  // 1. Rotation Sound (High-tech Tick)
  public playRotate() {
    if (this.isMuted) return;
    // Quick pitch slide for a mechanical feel
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // 2. Victory / Level Complete Sound (Theme Aware)
  public playWin(levelId: number) {
    if (this.isMuted) return;

    // Determine Sound Theme based on Level ID categories
    // 1-5: Nature/Organic (Soft Sine/Triangle)
    // 6-12: Tech/Digital (Square/Sawtooth, Arpeggios)
    // 13+: General/Abstract (Chimes)
    
    let type: OscillatorType = 'sine';
    let melody = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
    let speed = 0.1;

    if (levelId === 6 || levelId === 7 || levelId === 8 || levelId === 10) {
      // Tech theme
      type = 'square';
      melody = [440, 554, 659, 880, 1108]; // A Majorish
      speed = 0.08;
    } else if (levelId >= 20) {
      // Abstract/Space
      type = 'triangle';
      melody = [392, 523, 659, 784, 1046, 1318]; 
      speed = 0.12;
    }

    melody.forEach((freq, index) => {
      this.playTone(freq, type, 0.4, index * speed, 0.2);
    });

    // Add a bass root note for fullness
    this.playTone(melody[0] / 2, type, 1.5, 0, 0.3);
  }

  // 3. Sequence Ready (When all pieces connect correctly before pressing finish)
  public playReady() {
    if (this.isMuted) return;
    // A magical shimmer (C Major Triad rapid)
    this.playTone(523.25, 'sine', 0.3, 0.0, 0.2); // C
    this.playTone(659.25, 'sine', 0.3, 0.1, 0.2); // E
    this.playTone(783.99, 'sine', 0.6, 0.2, 0.2); // G
  }

  // 4. UI Click
  public playClick() {
    if (this.isMuted) return;
    this.playTone(1200, 'sine', 0.05, 0, 0.05);
  }
}

export const audioService = new AudioService();

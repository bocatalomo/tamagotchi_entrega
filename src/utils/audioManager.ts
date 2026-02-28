import * as Tone from 'tone';

interface SoundConfig {
  type: 'synth' | 'membrane' | 'metal' | 'noise';
  frequency?: string;
  envelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  modulation?: {
    frequency: string;
    type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  };
}

class AudioManager {
  private static instance: AudioManager;
  private synth: Tone.PolySynth | null = null;
  private membrane: Tone.MembraneSynth | null = null;
  private metal: Tone.MetalSynth | null = null;
  private noise: Tone.NoiseSynth | null = null;
  private masterVolume: Tone.Volume | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();

    this.masterVolume = new Tone.Volume(-6).toDestination();

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' as const },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.4,
      },
    }).connect(this.masterVolume);

    this.membrane = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' as const },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.01,
        release: 0.4,
      },
    }).connect(this.masterVolume);

    this.metal = new Tone.MetalSynth({
      envelope: {
        attack: 0.001,
        decay: 0.4,
        release: 0.2,
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(this.masterVolume);

    this.noise = new Tone.NoiseSynth({
      noise: { type: 'white' as const },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      },
    }).connect(this.masterVolume);

    this.isInitialized = true;
  }

  private playNote(frequency: string, duration: string = '8n', type: 'square' | 'sine' | 'triangle' = 'square'): void {
    if (!this.synth || this.isMuted) return;
    this.synth.set({ oscillator: { type } });
    this.synth.triggerAttackRelease(frequency, duration);
  }

  private playMembrane(frequency: string, duration: string = '8n'): void {
    if (!this.membrane || this.isMuted) return;
    this.membrane.triggerAttackRelease(frequency, duration);
  }

  private playMetal(duration: string = '8n', frequency: number = 200): void {
    if (!this.metal || this.isMuted) return;
    this.metal.triggerAttackRelease(frequency, duration);
  }

  private playNoise(): void {
    if (!this.noise || this.isMuted) return;
    this.noise.triggerAttackRelease('8n');
  }

  playHover(): void {
    this.playNote('C5', '32n', 'square');
  }

  playClick(): void {
    this.playNote('C4', '32n', 'square');
  }

  playFeed(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('C4', '16n', now);
    this.synth.triggerAttackRelease('E4', '16n', now + 0.08);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.16);
  }

  playPlay(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('G4', '16n', now);
    this.synth.triggerAttackRelease('C5', '16n', now + 0.08);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.16);
    this.synth.triggerAttackRelease('C5', '8n', now + 0.24);
  }

  playClean(): void {
    this.playMembrane('C2', '4n');
    this.playMembrane('G2', '4n');
  }

  playSleep(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('C3', '4n', now);
    this.synth.triggerAttackRelease('G3', '4n', now + 0.4);
    this.synth.triggerAttackRelease('C3', '2n', now + 0.8);
  }

  playWake(): void {
    this.playMembrane('C3', '8n');
    this.playMembrane('E3', '8n');
  }

  playMedicine(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('A4', '8n', now);
    this.synth.triggerAttackRelease('C5', '8n', now + 0.1);
    this.synth.triggerAttackRelease('E5', '8n', now + 0.2);
    this.synth.triggerAttackRelease('A5', '4n', now + 0.3);
  }

  playTreat(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('E4', '16n', now);
    this.synth.triggerAttackRelease('G4', '16n', now + 0.06);
    this.synth.triggerAttackRelease('E5', '16n', now + 0.12);
    this.synth.triggerAttackRelease('G5', '8n', now + 0.18);
  }

  playHappy(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('C4', '8n', now);
    this.synth.triggerAttackRelease('E4', '8n', now + 0.12);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.24);
    this.synth.triggerAttackRelease('C5', '4n', now + 0.36);
  }

  playSad(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('G3', '4n', now);
    this.synth.triggerAttackRelease('E3', '4n', now + 0.4);
    this.synth.triggerAttackRelease('C3', '2n', now + 0.8);
  }

  playCritical(): void {
    if (!this.metal || this.isMuted) return;
    const now = Tone.now();
    this.metal.triggerAttackRelease('8n', now);
    this.metal.triggerAttackRelease('8n', now + 0.15);
    this.metal.triggerAttackRelease('8n', now + 0.3);
  }

  playEvolution(): void {
    if (!this.synth || !this.membrane || this.isMuted) return;
    const now = Tone.now();
    this.membrane.triggerAttackRelease('C2', '4n', now);
    this.synth.triggerAttackRelease('E4', '4n', now + 0.3);
    this.synth.triggerAttackRelease('G4', '4n', now + 0.6);
    this.synth.triggerAttackRelease('C5', '2n', now + 0.9);
    this.synth.triggerAttackRelease('E5', '2n', now + 1.2);
    this.synth.triggerAttackRelease('G5', '2n', now + 1.5);
    this.synth.triggerAttackRelease('C6', '1n', now + 1.8);
  }

  playLevelUp(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('C4', '8n', now);
    this.synth.triggerAttackRelease('E4', '8n', now + 0.1);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.2);
    this.synth.triggerAttackRelease('C5', '8n', now + 0.3);
    this.synth.triggerAttackRelease('E5', '8n', now + 0.4);
    this.synth.triggerAttackRelease('G5', '4n', now + 0.5);
    this.synth.triggerAttackRelease('C6', '2n', now + 0.7);
  }

  playPoop(): void {
    this.playNoise();
    this.playMembrane('A1', '16n');
  }

  playCoin(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('E5', '32n', now);
    this.synth.triggerAttackRelease('G5', '32n', now + 0.05);
    this.synth.triggerAttackRelease('C6', '16n', now + 0.1);
  }

  playDeath(): void {
    if (!this.synth || !this.noise || this.isMuted) return;
    const now = Tone.now();
    this.noise.triggerAttackRelease('2n', now);
    this.synth.triggerAttackRelease('C3', '4n', now + 0.2);
    this.synth.triggerAttackRelease('G2', '4n', now + 0.5);
    this.synth.triggerAttackRelease('C2', '2n', now + 0.8);
  }

  playEggHatch(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('C4', '8n', now);
    this.synth.triggerAttackRelease('E4', '8n', now + 0.1);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.2);
    this.synth.triggerAttackRelease('C5', '8n', now + 0.3);
    this.synth.triggerAttackRelease('G4', '8n', now + 0.4);
    this.synth.triggerAttackRelease('E4', '8n', now + 0.5);
    this.synth.triggerAttackRelease('C4', '4n', now + 0.6);
  }

  // ========================================
  // SLOT MACHINE SOUNDS
  // ========================================

  playSlotLever(): void {
    if (!this.metal || !this.membrane || this.isMuted) return;
    const now = Tone.now();
    this.metal.triggerAttackRelease('16n', now);
    this.membrane.triggerAttackRelease('C2', '32n', now + 0.05);
  }

  playSlotSpin(): void {
    if (!this.noise || this.isMuted) return;
    if (!this.noise) return;
    this.noise.triggerAttackRelease('2n');
  }

  playReelStop(): void {
    if (!this.metal || this.isMuted) return;
    this.metal.triggerAttackRelease('32n', 150);
  }

  playSlotWin(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('E5', '16n', now);
    this.synth.triggerAttackRelease('G5', '16n', now + 0.08);
    this.synth.triggerAttackRelease('B5', '16n', now + 0.16);
    this.synth.triggerAttackRelease('E6', '8n', now + 0.24);
  }

  playSlotJackpot(): void {
    if (!this.synth || !this.membrane || this.isMuted) return;
    const now = Tone.now();
    
    // Fanfarria épica
    this.synth.triggerAttackRelease('C5', '8n', now);
    this.synth.triggerAttackRelease('E5', '8n', now + 0.1);
    this.synth.triggerAttackRelease('G5', '8n', now + 0.2);
    this.synth.triggerAttackRelease('C6', '8n', now + 0.3);
    
    this.membrane.triggerAttackRelease('C2', '4n', now);
    
    // Segunda ola
    this.synth.triggerAttackRelease('E6', '8n', now + 0.5);
    this.synth.triggerAttackRelease('G6', '8n', now + 0.6);
    this.synth.triggerAttackRelease('C7', '4n', now + 0.7);
    
    // Campanas continuas
    for (let i = 0; i < 8; i++) {
      this.synth.triggerAttackRelease('E6', '32n', now + 0.9 + (i * 0.1));
      this.synth.triggerAttackRelease('G6', '32n', now + 0.95 + (i * 0.1));
    }
  }

  playSlotLose(): void {
    if (!this.synth || this.isMuted) return;
    const now = Tone.now();
    this.synth.triggerAttackRelease('G3', '8n', now);
    this.synth.triggerAttackRelease('E3', '8n', now + 0.15);
    this.synth.triggerAttackRelease('C3', '4n', now + 0.3);
  }

  playSlotTick(): void {
    if (!this.synth || this.isMuted) return;
    this.synth.triggerAttackRelease('C6', '64n');
  }

  playSlotCoinDrop(): void {
    if (!this.metal || this.isMuted) return;
    const now = Tone.now();
    for (let i = 0; i < 5; i++) {
      this.metal.triggerAttackRelease('64n', 100 + (i * 50), now + (i * 0.05));
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterVolume) {
      this.masterVolume.mute = muted;
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  setMasterVolume(db: number): void {
    if (this.masterVolume) {
      this.masterVolume.volume.value = db;
    }
  }

  async resume(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    } else {
      await Tone.start();
    }
  }

  dispose(): void {
    this.synth?.dispose();
    this.membrane?.dispose();
    this.metal?.dispose();
    this.noise?.dispose();
    this.masterVolume?.dispose();
    this.isInitialized = false;
  }
}

export const audioManager = AudioManager.getInstance();
export default audioManager;

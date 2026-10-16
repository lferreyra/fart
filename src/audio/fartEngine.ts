/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FartSoundProfile {
  id: string;
  name: string;
  subtitle: string;
  onomatopoeia: string;
  emoji: string;
  color: string;
  badgeBg: string;
  borderCol: string;
  dangerLevel: number; // 1-5
  category: 'clasicos' | 'explosivos' | 'bizarros' | 'humedos';
  basePitch: number; // Hz (fundamental)
  pitchEnd: number; // Hz (target pitch)
  duration: number; // seconds
  flutterRate: number; // Hz (oscillation flutter)
  noiseLevel: number; // 0 - 1
  wetness: number; // 0 - 1
  bassGain: number; // 1 - 4
  harmonicType: OscillatorType;
  bursts?: number; // For machine gun staccato
  burstInterval?: number; // seconds
}

export interface FartMixerSettings {
  pitch: number; // 0.5 to 2.0 (default: 1.0)
  duration: number; // 0.5 to 2.5 (default: 1.0)
  wetness: number; // 0 to 1 (default: 0.3)
  bassBoost: boolean; // default: true
  volume: number; // 0 to 1 (default: 0.9)
}

export const FART_PRESETS: FartSoundProfile[] = [
  {
    id: 'clasico',
    name: 'El Clásico',
    subtitle: 'El pedo de toda la vida',
    onomatopoeia: '¡PRRRRRRRT!',
    emoji: '💨',
    color: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-yellow-400 text-yellow-950',
    borderCol: 'border-yellow-600',
    dangerLevel: 3,
    category: 'clasicos',
    basePitch: 85,
    pitchEnd: 55,
    duration: 0.85,
    flutterRate: 26,
    noiseLevel: 0.65,
    wetness: 0.3,
    bassGain: 2.2,
    harmonicType: 'sawtooth',
  },
  {
    id: 'bombazo',
    name: 'El Bombazo Atómico',
    subtitle: 'Sacude las paredes de la casa',
    onomatopoeia: '¡KABOOOOM!',
    emoji: '💣',
    color: 'from-red-500 to-orange-600',
    badgeBg: 'bg-red-500 text-white',
    borderCol: 'border-red-700',
    dangerLevel: 5,
    category: 'explosivos',
    basePitch: 120,
    pitchEnd: 32,
    duration: 1.3,
    flutterRate: 18,
    noiseLevel: 0.9,
    wetness: 0.15,
    bassGain: 3.8,
    harmonicType: 'sawtooth',
  },
  {
    id: 'silencioso',
    name: 'Silencioso Mortal',
    subtitle: 'No suena... pero vacía la sala',
    onomatopoeia: '¡PSSSSSSST!',
    emoji: '☣️',
    color: 'from-lime-400 to-green-600',
    badgeBg: 'bg-lime-400 text-lime-950',
    borderCol: 'border-lime-700',
    dangerLevel: 5,
    category: 'clasicos',
    basePitch: 42,
    pitchEnd: 36,
    duration: 2.2,
    flutterRate: 12,
    noiseLevel: 0.95,
    wetness: 0.1,
    bassGain: 1.8,
    harmonicType: 'triangle',
  },
  {
    id: 'metralleta',
    name: 'La Metralleta',
    subtitle: 'Ráfaga de 7 disparos tácticos',
    onomatopoeia: '¡BRRR-BR-BRRT!',
    emoji: '🔫',
    color: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-500 text-white',
    borderCol: 'border-purple-700',
    dangerLevel: 4,
    category: 'explosivos',
    basePitch: 95,
    pitchEnd: 70,
    duration: 1.4,
    flutterRate: 35,
    noiseLevel: 0.7,
    wetness: 0.2,
    bassGain: 2.0,
    harmonicType: 'sawtooth',
    bursts: 6,
    burstInterval: 0.14,
  },
  {
    id: 'chillon',
    name: 'El Chillón Agudo',
    subtitle: 'El globo desinflándose a presión',
    onomatopoeia: '¡FIIIIII-PIP!',
    emoji: '🎈',
    color: 'from-pink-400 to-rose-500',
    badgeBg: 'bg-pink-400 text-pink-950',
    borderCol: 'border-pink-600',
    dangerLevel: 2,
    category: 'clasicos',
    basePitch: 290,
    pitchEnd: 460,
    duration: 0.75,
    flutterRate: 38,
    noiseLevel: 0.35,
    wetness: 0.05,
    bassGain: 0.8,
    harmonicType: 'sawtooth',
  },
  {
    id: 'humedo',
    name: 'Húmedo Peligroso',
    subtitle: '¡Momento de revisar los pantalones!',
    onomatopoeia: '¡SPLOOOOOSH!',
    emoji: '💦',
    color: 'from-teal-400 to-emerald-600',
    badgeBg: 'bg-teal-400 text-teal-950',
    borderCol: 'border-teal-700',
    dangerLevel: 5,
    category: 'humedos',
    basePitch: 70,
    pitchEnd: 48,
    duration: 1.1,
    flutterRate: 20,
    noiseLevel: 0.8,
    wetness: 0.95,
    bassGain: 2.4,
    harmonicType: 'sawtooth',
  },
  {
    id: 'trompeta',
    name: 'La Trompeta Real',
    subtitle: 'Digno de la realeza británica',
    onomatopoeia: '¡TOOOOOOOT!',
    emoji: '🎺',
    color: 'from-amber-300 to-orange-400',
    badgeBg: 'bg-amber-400 text-amber-950',
    borderCol: 'border-amber-600',
    dangerLevel: 3,
    category: 'clasicos',
    basePitch: 140,
    pitchEnd: 120,
    duration: 1.25,
    flutterRate: 15,
    noiseLevel: 0.25,
    wetness: 0.1,
    bassGain: 1.9,
    harmonicType: 'sawtooth',
  },
  {
    id: 'laser',
    name: 'Fart Alienígena',
    subtitle: 'Tecnología de propulsión marciana',
    onomatopoeia: '¡PEW-PEW-PFFT!',
    emoji: '👽',
    color: 'from-cyan-400 to-blue-600',
    badgeBg: 'bg-cyan-400 text-cyan-950',
    borderCol: 'border-cyan-700',
    dangerLevel: 3,
    category: 'bizarros',
    basePitch: 350,
    pitchEnd: 45,
    duration: 0.9,
    flutterRate: 48,
    noiseLevel: 0.5,
    wetness: 0.4,
    bassGain: 2.0,
    harmonicType: 'sine',
  },
  {
    id: 'subterraneo',
    name: 'Trueno Subterráneo',
    subtitle: 'Grieta tectónica en el sofá',
    onomatopoeia: '¡BRRRRRRRUM!',
    emoji: '🌋',
    color: 'from-stone-600 to-zinc-800',
    badgeBg: 'bg-stone-500 text-white',
    borderCol: 'border-stone-800',
    dangerLevel: 4,
    category: 'explosivos',
    basePitch: 52,
    pitchEnd: 30,
    duration: 2.5,
    flutterRate: 14,
    noiseLevel: 0.7,
    wetness: 0.2,
    bassGain: 4.0,
    harmonicType: 'sawtooth',
  },
  {
    id: 'seco',
    name: 'El Corcho Seco',
    subtitle: 'Rápido, seco e imprevisto',
    onomatopoeia: '¡PLOP-POP!',
    emoji: '🍾',
    color: 'from-yellow-300 to-amber-500',
    badgeBg: 'bg-amber-300 text-amber-950',
    borderCol: 'border-amber-500',
    dangerLevel: 1,
    category: 'clasicos',
    basePitch: 160,
    pitchEnd: 60,
    duration: 0.25,
    flutterRate: 40,
    noiseLevel: 0.4,
    wetness: 0.05,
    bassGain: 1.5,
    harmonicType: 'triangle',
  },
  {
    id: 'tractor',
    name: 'El Tractor Viejo',
    subtitle: 'Motor diésel arrancando en frío',
    onomatopoeia: '¡CHUG-POOT-CHUG!',
    emoji: '🚜',
    color: 'from-emerald-500 to-green-700',
    badgeBg: 'bg-emerald-500 text-white',
    borderCol: 'border-emerald-800',
    dangerLevel: 4,
    category: 'bizarros',
    basePitch: 75,
    pitchEnd: 55,
    duration: 1.8,
    flutterRate: 8,
    noiseLevel: 0.6,
    wetness: 0.35,
    bassGain: 2.8,
    harmonicType: 'sawtooth',
    bursts: 5,
    burstInterval: 0.25,
  },
  {
    id: 'burbuja',
    name: 'Jacuzzi Caliente',
    subtitle: 'Burbujas subiendo a la superficie',
    onomatopoeia: '¡BLUB-GLUB-POP!',
    emoji: '🛁',
    color: 'from-sky-400 to-cyan-500',
    badgeBg: 'bg-sky-400 text-sky-950',
    borderCol: 'border-sky-600',
    dangerLevel: 3,
    category: 'humedos',
    basePitch: 110,
    pitchEnd: 80,
    duration: 1.3,
    flutterRate: 22,
    noiseLevel: 0.5,
    wetness: 0.88,
    bassGain: 1.8,
    harmonicType: 'sine',
  },
];

class FartAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Pre-generate 3 seconds of white/pink noise buffer for gas simulation
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      // Pinkish noise filter (natural gas turbulence)
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  // Soft distortion curve for organic fleshy flapping distortion
  private makeDistortionCurve(amount: number = 25): Float32Array<ArrayBuffer> {
    const k = amount;
    const nSamples = 44100;
    const buffer = new ArrayBuffer(nSamples * 4);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve as Float32Array<ArrayBuffer>;
  }

  /**
   * Synthesize and play a realistic comic fart sound!
   */
  public play(profile: FartSoundProfile, mixer: FartMixerSettings = {
    pitch: 1.0,
    duration: 1.0,
    wetness: 0.3,
    bassBoost: true,
    volume: 0.9,
  }): number {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Calculate modified parameters from mixer
      const pitchMod = mixer.pitch || 1.0;
      const durationMod = mixer.duration || 1.0;
      const totalDuration = Math.max(0.2, profile.duration * durationMod);
      const wetnessLevel = Math.min(1.0, Math.max(0.0, (profile.wetness + (mixer.wetness - 0.3))));
      const masterVol = Math.max(0, Math.min(1, mixer.volume));

      // Trigger device vibration if available for tactile fart feedback!
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          if (profile.dangerLevel >= 4) {
            navigator.vibrate([40, 20, 60, 30, 80]);
          } else {
            navigator.vibrate([30, 15, 30]);
          }
        } catch {
          // Ignore vibration permission errors
        }
      }

      // If preset has multiple bursts (machine gun)
      if (profile.bursts && profile.bursts > 1) {
        const count = profile.bursts;
        const interval = (profile.burstInterval || 0.15) * durationMod;
        for (let b = 0; b < count; b++) {
          const burstStart = now + b * interval;
          const burstDur = interval * 0.85;
          const burstPitch = profile.basePitch * (0.95 + Math.random() * 0.15);
          this.synthesizeSingleBurst(ctx, burstStart, burstDur, burstPitch, profile.pitchEnd, profile, wetnessLevel, masterVol, mixer.bassBoost, pitchMod);
        }
        return totalDuration;
      }

      // Single continuous fart
      this.synthesizeSingleBurst(
        ctx,
        now,
        totalDuration,
        profile.basePitch * pitchMod,
        profile.pitchEnd * pitchMod,
        profile,
        wetnessLevel,
        masterVol,
        mixer.bassBoost,
        pitchMod
      );

      return totalDuration;
    } catch (e) {
      console.error('Audio engine playback error:', e);
      return 1.0;
    }
  }

  private synthesizeSingleBurst(
    ctx: AudioContext,
    startTime: number,
    duration: number,
    startPitch: number,
    endPitch: number,
    profile: FartSoundProfile,
    wetness: number,
    masterVolume: number,
    bassBoost: boolean,
    pitchMod: number
  ) {
    // Master Compressor & Limiter to prevent clipping and pack punch
    const masterCompressor = ctx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-14, startTime);
    masterCompressor.knee.setValueAtTime(10, startTime);
    masterCompressor.ratio.setValueAtTime(6, startTime);
    masterCompressor.attack.setValueAtTime(0.003, startTime);
    masterCompressor.release.setValueAtTime(0.15, startTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(masterVolume * 0.9, startTime);

    masterCompressor.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Distortion / Saturation
    const waveshaper = ctx.createWaveShaper();
    waveshaper.curve = this.makeDistortionCurve(18);
    waveshaper.oversample = '2x';
    waveshaper.connect(masterCompressor);

    // 1. FLUTTER LFO (Simulates the sphincter oscillation)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const flutterFreq = profile.flutterRate * (0.85 + Math.random() * 0.3) * pitchMod;
    lfo.frequency.setValueAtTime(flutterFreq, startTime);
    // Slow down flutter as gas pressure releases
    lfo.frequency.exponentialRampToValueAtTime(Math.max(10, flutterFreq * 0.65), startTime + duration);
    lfoGain.gain.setValueAtTime(0.45, startTime);
    lfo.connect(lfoGain.gain);

    // 2. PRIMARY BODY OSCILLATOR (Fundamental tone + harmonic slide)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = profile.harmonicType;
    osc.frequency.setValueAtTime(startPitch, startTime);
    // Pitch drop curve
    osc.frequency.exponentialRampToValueAtTime(Math.max(25, endPitch), startTime + duration * 0.95);

    // Amplitude envelope
    oscGain.gain.setValueAtTime(0.01, startTime);
    oscGain.gain.linearRampToValueAtTime(0.7, startTime + 0.04);
    oscGain.gain.setValueAtTime(0.65, startTime + duration * 0.6);
    oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Connect flutter to oscillator amplitude
    const flutterModGain = ctx.createGain();
    flutterModGain.gain.setValueAtTime(0.55, startTime);
    lfo.connect(flutterModGain.gain);

    osc.connect(flutterModGain);
    flutterModGain.connect(oscGain);
    oscGain.connect(waveshaper);

    // 3. SUB-BASS RUMBLE (Body vibration)
    if (bassBoost || profile.bassGain > 1.5) {
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(Math.min(75, startPitch * 0.6), startTime);
      subOsc.frequency.exponentialRampToValueAtTime(Math.max(28, endPitch * 0.5), startTime + duration);

      const bassMult = bassBoost ? profile.bassGain * 1.4 : profile.bassGain;
      subGain.gain.setValueAtTime(0.01, startTime);
      subGain.gain.linearRampToValueAtTime(0.5 * bassMult, startTime + 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      subOsc.connect(subGain);
      subGain.connect(masterCompressor); // Bypass waveshaper for ultra clean sub rumble
      subOsc.start(startTime);
      subOsc.stop(startTime + duration + 0.05);
    }

    // 4. TURBULENT GAS NOISE (Resonant bandpass filtered hiss/flutter)
    if (profile.noiseLevel > 0.05) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = this.getNoiseBuffer(ctx);
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(Math.min(1800, startPitch * 4.5), startTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(Math.max(120, endPitch * 3), startTime + duration);
      noiseFilter.Q.setValueAtTime(4.5, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, startTime);
      noiseGain.gain.linearRampToValueAtTime(profile.noiseLevel * 0.6, startTime + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      // Connect LFO to noise filter frequency for ripping texture
      const lfoNoiseMod = ctx.createGain();
      lfoNoiseMod.gain.setValueAtTime(150, startTime);
      lfo.connect(lfoNoiseMod);
      lfoNoiseMod.connect(noiseFilter.frequency);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(waveshaper);

      noiseSource.start(startTime);
      noiseSource.stop(startTime + duration + 0.05);
    }

    // 5. WET / SQUELCH EFFECT (Liquid bubble pops)
    if (wetness > 0.25) {
      const popCount = Math.floor(wetness * 6) + 2;
      for (let i = 0; i < popCount; i++) {
        const popTime = startTime + 0.05 + Math.random() * (duration * 0.8);
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        const popFilter = ctx.createBiquadFilter();

        popOsc.type = 'sine';
        const pFreq = 220 + Math.random() * 450;
        popOsc.frequency.setValueAtTime(pFreq, popTime);
        popOsc.frequency.exponentialRampToValueAtTime(pFreq * 0.4, popTime + 0.06);

        popFilter.type = 'bandpass';
        popFilter.frequency.setValueAtTime(pFreq * 1.2, popTime);
        popFilter.Q.setValueAtTime(7, popTime);

        popGain.gain.setValueAtTime(0.01, popTime);
        popGain.gain.linearRampToValueAtTime(wetness * 0.5, popTime + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.05);

        popOsc.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(masterCompressor);

        popOsc.start(popTime);
        popOsc.stop(popTime + 0.06);
      }
    }

    // Start primary oscillators
    lfo.start(startTime);
    osc.start(startTime);

    lfo.stop(startTime + duration + 0.05);
    osc.stop(startTime + duration + 0.05);
  }
}

// Global singleton instance
export const fartAudio = new FartAudioEngine();

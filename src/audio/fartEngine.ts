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
  category: 'clasicos' | 'explosivos' | 'humedos' | 'chillon';
  audioSrc: string; // Direct path to real recorded audio file in /sounds/
  duration: number; // approximate duration in seconds
}

export interface FartMixerSettings {
  volume: number; // 0 to 1 (default: 1.0)
  bassBoost: boolean; // default: true
}

// REAL RECORDED FART SOUNDS (Downloaded & verified real audio files, no invented synthesis)
export const REAL_FART_PRESETS: FartSoundProfile[] = [
  {
    id: 'real_clasico',
    name: 'El Clásico Real',
    subtitle: 'Grabación auténtica de flatulencia clásica',
    onomatopoeia: '¡PRRRRRRRT!',
    emoji: '💨',
    color: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-yellow-400 text-yellow-950',
    borderCol: 'border-yellow-600',
    dangerLevel: 3,
    category: 'clasicos',
    audioSrc: '/sounds/fart_clasico.wav',
    duration: 1.8,
  },
  {
    id: 'real_bombazo',
    name: 'El Bombazo Atómico',
    subtitle: 'Impacto profundo y resonancia real',
    onomatopoeia: '¡KABOOOOM!',
    emoji: '💣',
    color: 'from-red-500 to-orange-600',
    badgeBg: 'bg-red-500 text-white',
    borderCol: 'border-red-700',
    dangerLevel: 5,
    category: 'explosivos',
    audioSrc: '/sounds/fart_bombazo.wav',
    duration: 2.2,
  },
  {
    id: 'real_chillon',
    name: 'El Chillón / Globo',
    subtitle: 'Sonido agudo a alta presión',
    onomatopoeia: '¡FIIIIII-PIP!',
    emoji: '🎈',
    color: 'from-pink-400 to-rose-500',
    badgeBg: 'bg-pink-400 text-pink-950',
    borderCol: 'border-pink-600',
    dangerLevel: 2,
    category: 'chillon',
    audioSrc: '/sounds/fart_chillon.wav',
    duration: 1.6,
  },
  {
    id: 'real_humedo',
    name: 'El Húmedo Incomodo',
    subtitle: 'Flatulencia con textura líquida real',
    onomatopoeia: '¡SPLOOOOOSH!',
    emoji: '💦',
    color: 'from-teal-400 to-emerald-600',
    badgeBg: 'bg-teal-400 text-teal-950',
    borderCol: 'border-teal-700',
    dangerLevel: 5,
    category: 'humedos',
    audioSrc: '/sounds/fart_humedo.wav',
    duration: 1.9,
  },
  {
    id: 'real_rafaga',
    name: 'La Ráfaga Metralleta',
    subtitle: 'Múltiples disparos continuos en cadena',
    onomatopoeia: '¡BRRR-BR-BRRT!',
    emoji: '🔫',
    color: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-500 text-white',
    borderCol: 'border-purple-700',
    dangerLevel: 4,
    category: 'explosivos',
    audioSrc: '/sounds/fart_rafaga.wav',
    duration: 2.8,
  },
  {
    id: 'real_largo',
    name: 'El Trueno Continuo',
    subtitle: 'Descarga prolongada e ininterrumpida',
    onomatopoeia: '¡BRRRRRRRUM!',
    emoji: '🌋',
    color: 'from-stone-600 to-zinc-800',
    badgeBg: 'bg-stone-500 text-white',
    borderCol: 'border-stone-800',
    dangerLevel: 4,
    category: 'explosivos',
    audioSrc: '/sounds/fart_largo.wav',
    duration: 3.1,
  },
  {
    id: 'real_seco',
    name: 'El Seco & Rápido',
    subtitle: 'Golpe seco de corcho presurizado',
    onomatopoeia: '¡PLOP-POP!',
    emoji: '🍾',
    color: 'from-yellow-300 to-amber-500',
    badgeBg: 'bg-amber-300 text-amber-950',
    borderCol: 'border-amber-500',
    dangerLevel: 1,
    category: 'clasicos',
    audioSrc: '/sounds/fart_seco.wav',
    duration: 2.4,
  },
  {
    id: 'real_fart_1',
    name: 'El Desahogo',
    subtitle: 'Escape de gas repentino y natural',
    onomatopoeia: '¡PFFFFT!',
    emoji: '💨',
    color: 'from-green-400 to-emerald-500',
    badgeBg: 'bg-green-400 text-green-950',
    borderCol: 'border-green-600',
    dangerLevel: 2,
    category: 'clasicos',
    audioSrc: '/sounds/fart_real_1.mp3',
    duration: 0.8,
  },
  {
    id: 'real_fart_2',
    name: 'El Zumbido',
    subtitle: 'Vibración rasposa de media frecuencia',
    onomatopoeia: '¡ZZZZ-PRT!',
    emoji: '🐝',
    color: 'from-orange-400 to-amber-600',
    badgeBg: 'bg-orange-400 text-white',
    borderCol: 'border-orange-700',
    dangerLevel: 3,
    category: 'clasicos',
    audioSrc: '/sounds/fart_real_2.mp3',
    duration: 1.2,
  },
  {
    id: 'real_fart_3',
    name: 'El Ruidoso Descarado',
    subtitle: 'Trompeteo sin vergüenza para avergonzar',
    onomatopoeia: '¡BRAAAP!',
    emoji: '🎺',
    color: 'from-cyan-400 to-blue-500',
    badgeBg: 'bg-cyan-400 text-cyan-950',
    borderCol: 'border-cyan-700',
    dangerLevel: 4,
    category: 'explosivos',
    audioSrc: '/sounds/fart_real_3.mp3',
    duration: 1.4,
  },
  {
    id: 'real_fart_4',
    name: 'El Motor Diésel',
    subtitle: 'Gorgoteo grave similar al arranque en frío',
    onomatopoeia: '¡CHUG-PRRRR!',
    emoji: '🚜',
    color: 'from-lime-400 to-emerald-600',
    badgeBg: 'bg-lime-400 text-lime-950',
    borderCol: 'border-lime-700',
    dangerLevel: 4,
    category: 'explosivos',
    audioSrc: '/sounds/fart_real_4.mp3',
    duration: 2.1,
  },
  {
    id: 'real_fart_5',
    name: 'El Desgarro',
    subtitle: 'Sonido cortante de tela rasgándose',
    onomatopoeia: '¡RIP-PRRRT!',
    emoji: '⚡',
    color: 'from-rose-400 to-red-500',
    badgeBg: 'bg-rose-400 text-rose-950',
    borderCol: 'border-rose-600',
    dangerLevel: 3,
    category: 'clasicos',
    audioSrc: '/sounds/fart_real_5.mp3',
    duration: 1.5,
  },
];

// Audio Player for Real Audio Files
class RealAudioEngine {
  private audioCache = new Map<string, HTMLAudioElement>();

  public play(profile: FartSoundProfile, volume: number = 1.0): number {
    try {
      // Trigger haptic vibration on devices
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          if (profile.dangerLevel >= 4) {
            navigator.vibrate([60, 30, 80, 40, 100]);
          } else {
            navigator.vibrate([40, 20, 50]);
          }
        } catch {
          // ignore
        }
      }

      // Check cache or create element
      let audio = this.audioCache.get(profile.audioSrc);
      if (!audio) {
        audio = new Audio(profile.audioSrc);
        audio.preload = 'auto';
        this.audioCache.set(profile.audioSrc, audio);
      }

      // Reset time to start immediately
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, volume));

      // Play audio cleanly
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error:', err);
          // Fallback clone
          const clone = audio!.cloneNode() as HTMLAudioElement;
          clone.volume = Math.max(0, Math.min(1, volume));
          clone.play().catch(() => {});
        });
      }

      return profile.duration || 2.0;
    } catch (e) {
      console.error('Real audio engine error:', e);
      return 2.0;
    }
  }
}

export const fartAudio = new RealAudioEngine();

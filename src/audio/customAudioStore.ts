/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FartSoundProfile } from './fartEngine';

const STORAGE_KEY = 'fartblaster_custom_sounds_v1';

export interface CustomFartRecord {
  id: string;
  name: string;
  subtitle: string;
  onomatopoeia: string;
  emoji: string;
  color: string;
  badgeBg: string;
  borderCol: string;
  dangerLevel: number;
  dataUrl: string; // Base64 audio/wav or audio/mp3 data
  duration: number;
  createdAt: number;
}

export const loadCustomSounds = (): CustomFartRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading custom sounds:', e);
    return [];
  }
};

export const saveCustomSound = (record: CustomFartRecord): void => {
  try {
    const current = loadCustomSounds();
    const updated = [record, ...current.filter((s) => s.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom sound:', e);
  }
};

export const deleteCustomSound = (id: string): void => {
  try {
    const current = loadCustomSounds();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting custom sound:', e);
  }
};

export const customRecordToProfile = (record: CustomFartRecord): FartSoundProfile => {
  return {
    id: record.id,
    name: record.name,
    subtitle: record.subtitle,
    onomatopoeia: record.onomatopoeia,
    emoji: record.emoji,
    color: record.color,
    badgeBg: record.badgeBg,
    borderCol: record.borderCol,
    dangerLevel: record.dangerLevel,
    category: 'bizarros',
    basePitch: 100,
    pitchEnd: 100,
    duration: record.duration,
    flutterRate: 20,
    noiseLevel: 0,
    wetness: 0,
    bassGain: 1,
    harmonicType: 'sine',
  };
};

export const playAudioDataUrl = (dataUrl: string, volume: number = 1.0): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(dataUrl);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.onended = () => resolve();
      audio.onerror = (err) => reject(err);
      audio.play().catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

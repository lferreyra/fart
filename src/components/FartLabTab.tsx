/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FartMixerSettings, FartSoundProfile, fartAudio } from '../audio/fartEngine';
import { Sliders, Play, Sparkles, Volume2, Timer, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FartLabTabProps {
  mixerSettings: FartMixerSettings;
  onUpdateMixer: (settings: FartMixerSettings) => void;
  onSendToTimer: (customProfile: FartSoundProfile) => void;
}

export const FartLabTab: React.FC<FartLabTabProps> = ({
  mixerSettings,
  onUpdateMixer,
  onSendToTimer,
}) => {
  const [pitch, setPitch] = useState(mixerSettings.pitch);
  const [duration, setDuration] = useState(mixerSettings.duration);
  const [wetness, setWetness] = useState(mixerSettings.wetness);
  const [bassBoost, setBassBoost] = useState(mixerSettings.bassBoost);
  const [flutterRate, setFlutterRate] = useState<number>(24);

  // Generate dynamic funny comic name based on acoustic parameters
  const generateFunnyName = () => {
    let prefix = 'El Fart';
    if (pitch > 1.4) prefix = 'El Chillido';
    else if (pitch < 0.7) prefix = 'El Trueno';
    else if (duration > 1.8) prefix = 'El Apocalipsis';
    else if (duration < 0.7) prefix = 'El Corcho';

    let suffix = 'Mortal';
    if (wetness > 0.7) suffix = 'Pantanoso Hidráulico';
    else if (wetness > 0.4) suffix = 'Viscoso';
    else if (bassBoost && pitch < 0.9) suffix = 'Subterráneo Sísmico';
    else if (pitch > 1.3) suffix = 'de Pato Marciano';

    return `${prefix} ${suffix}`;
  };

  const currentCustomProfile: FartSoundProfile = {
    id: 'custom_lab_fart',
    name: generateFunnyName(),
    subtitle: 'Mezclado a mano en el laboratorio',
    onomatopoeia: pitch > 1.3 ? '¡FIII-POP!' : wetness > 0.6 ? '¡SPLOOSH-PRT!' : '¡BRRRRR-BOOM!',
    emoji: wetness > 0.6 ? '💦' : pitch > 1.3 ? '🎈' : '💣',
    color: 'from-lime-400 to-emerald-500',
    badgeBg: 'bg-lime-400 text-lime-950',
    borderCol: 'border-lime-700',
    dangerLevel: wetness > 0.7 || bassBoost ? 5 : 3,
    category: 'bizarros',
    basePitch: Math.round(90 * pitch),
    pitchEnd: Math.round(55 * pitch),
    duration: Math.round(1.1 * duration * 10) / 10,
    flutterRate: flutterRate,
    noiseLevel: 0.65,
    wetness: wetness,
    bassGain: bassBoost ? 3.5 : 1.5,
    harmonicType: pitch > 1.3 ? 'sawtooth' : 'triangle',
  };

  const handleTestPlay = () => {
    const updated: FartMixerSettings = {
      pitch,
      duration,
      wetness,
      bassBoost,
      volume: mixerSettings.volume,
    };
    onUpdateMixer(updated);

    fartAudio.play(currentCustomProfile, updated);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#84cc16', '#22c55e', '#facc15'],
    });
  };

  const handleReset = () => {
    setPitch(1.0);
    setDuration(1.0);
    setWetness(0.3);
    setBassBoost(true);
    setFlutterRate(24);
    onUpdateMixer({
      pitch: 1.0,
      duration: 1.0,
      wetness: 0.3,
      bassBoost: true,
      volume: 0.9,
    });
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lime-400 via-emerald-300 to-green-400 border-4 border-black comic-shadow rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black text-lime-300 px-3 py-0.5 rounded-full text-xs font-black tracking-wide uppercase mb-1">
            <Sliders className="w-3.5 h-3.5 text-lime-400" />
            Sintetizador Acústico
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black comic-font tracking-tight">
            LABORATORIO DE PEDOS
          </h2>
          <p className="text-sm font-medium text-emerald-950">
            Ajusta tono, humedad, graves y vibración para diseñar tu propio pedo personalizado.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-black comic-shadow-sm whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* Main Mixer Controls Panel */}
      <div className="bg-white border-4 border-black comic-shadow rounded-2xl p-5 sm:p-6 space-y-6">
        {/* Dynamic Name Card */}
        <div className="bg-yellow-200 border-3 border-black rounded-xl p-3.5 text-center comic-shadow-sm">
          <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
            Resultado de la fórmula:
          </span>
          <div className="text-xl sm:text-2xl font-black text-black comic-font tracking-wide mt-0.5">
            {generateFunnyName()}
          </div>
          <div className="text-xs font-extrabold text-red-600 mt-0.5">
            {currentCustomProfile.onomatopoeia}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-5">
          {/* Pitch Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black uppercase text-zinc-700 mb-1.5">
              <span>Tono / Frecuencia</span>
              <span className="text-amber-700 font-mono">
                {pitch < 0.8 ? 'Grave Subterráneo' : pitch > 1.3 ? 'Pito Agudo' : 'Normal'} ({pitch.toFixed(1)}x)
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-lime-600 h-3 bg-zinc-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-1">
              <span>Camión Diésel 🚜</span>
              <span>Voz de Pito 🎈</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black uppercase text-zinc-700 mb-1.5">
              <span>Duración del Pedo</span>
              <span className="text-amber-700 font-mono">
                {(1.1 * duration).toFixed(1)} segundos
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.8"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full accent-lime-600 h-3 bg-zinc-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-1">
              <span>Seco y cortito 🍾</span>
              <span>Interminable Épico ⏳</span>
            </div>
          </div>

          {/* Wetness Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-black uppercase text-zinc-700 mb-1.5">
              <span>Nivel de Humedad / Squelch</span>
              <span className="text-teal-700 font-mono">
                {wetness < 0.2 ? '100% Seco' : wetness > 0.7 ? '¡Peligro de Pantalón!' : 'Húmedo normal'} ({Math.round(wetness * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={wetness}
              onChange={(e) => setWetness(parseFloat(e.target.value))}
              className="w-full accent-teal-500 h-3 bg-zinc-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-1">
              <span>Seco como el desierto 🏜️</span>
              <span>Pantano viscoso 💦</span>
            </div>
          </div>

          {/* Flutter Vibration Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-black uppercase text-zinc-700 mb-1.5">
              <span>Velocidad de Aleteo (Flap)</span>
              <span className="text-purple-700 font-mono">{flutterRate} Hz</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={flutterRate}
              onChange={(e) => setFlutterRate(parseInt(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-zinc-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-1">
              <span>Ondulación Lenta 〰️</span>
              <span>Ametralladora Rápida ⚡</span>
            </div>
          </div>

          {/* Bass Boost Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-50 border-2 border-black rounded-xl">
            <div>
              <span className="text-xs font-black uppercase text-zinc-800 block">
                Subwoofer Bass Boost (Vibrador Háptico)
              </span>
              <span className="text-[11px] text-zinc-500">
                Añade frecuencias sub-graves de 35Hz para hacer temblar el móvil.
              </span>
            </div>
            <button
              onClick={() => setBassBoost(!bassBoost)}
              className={`px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs transition-all ${
                bassBoost
                  ? 'bg-red-500 text-white comic-shadow-sm'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {bassBoost ? 'ACTIVADO' : 'APAGADO'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleTestPlay}
            className="w-full flex-1 py-3.5 px-4 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-base rounded-xl border-3 border-black comic-shadow comic-button flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>¡PROBAR MI SONIDO!</span>
          </button>

          <button
            onClick={() => onSendToTimer(currentCustomProfile)}
            className="w-full sm:w-auto py-3.5 px-5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-sm rounded-xl border-3 border-black comic-shadow comic-button flex items-center justify-center gap-2 uppercase tracking-wider whitespace-nowrap"
          >
            <Timer className="w-4 h-4" />
            <span>Usar en Temporizador</span>
          </button>
        </div>
      </div>
    </div>
  );
};

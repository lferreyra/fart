/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FART_PRESETS, FartSoundProfile, FartMixerSettings } from '../audio/fartEngine';
import { CustomFartRecord, customRecordToProfile } from '../audio/customAudioStore';
import { Play, Timer, Skull, Search, Flame, Shuffle, Sparkles, PlusCircle, Trash2, Mic, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SoundboardTabProps {
  onPlayFart: (fart: FartSoundProfile) => void;
  onSetTimerForFart: (fart: FartSoundProfile) => void;
  mixerSettings: FartMixerSettings;
  activeFartId: string | null;
  lastPlayedOnomatopoeia: string | null;
  customSounds: CustomFartRecord[];
  onOpenImportModal: () => void;
  onDeleteCustomSound: (id: string) => void;
}

export const SoundboardTab: React.FC<SoundboardTabProps> = ({
  onPlayFart,
  onSetTimerForFart,
  activeFartId,
  lastPlayedOnomatopoeia,
  customSounds,
  onOpenImportModal,
  onDeleteCustomSound,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const customProfiles: FartSoundProfile[] = customSounds.map(customRecordToProfile);
  const allAvailableFarts = [...customProfiles, ...FART_PRESETS];

  const categories = [
    { id: 'todos', label: '🔥 Todos', count: allAvailableFarts.length },
    ...(customSounds.length > 0 ? [{ id: 'mis_sonidos', label: '⭐ Mis Sonidos', count: customSounds.length }] : []),
    { id: 'clasicos', label: '💨 Clásicos', count: FART_PRESETS.filter(f => f.category === 'clasicos').length },
    { id: 'explosivos', label: '💣 Explosivos', count: FART_PRESETS.filter(f => f.category === 'explosivos').length },
    { id: 'humedos', label: '💦 Húmedos', count: FART_PRESETS.filter(f => f.category === 'humedos').length },
    { id: 'bizarros', label: '👽 Bizarros', count: FART_PRESETS.filter(f => f.category === 'bizarros').length },
  ];

  const filteredFarts = allAvailableFarts.filter((fart) => {
    const isCustom = fart.id.startsWith('custom_');
    const matchesCat =
      selectedCategory === 'todos' ||
      (selectedCategory === 'mis_sonidos' && isCustom) ||
      (!isCustom && fart.category === selectedCategory);

    const matchesSearch =
      fart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fart.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fart.onomatopoeia.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCardClick = (fart: FartSoundProfile, e: React.MouseEvent) => {
    // Pop comic confetti stars/stink
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 22,
      spread: 60,
      origin: { x, y },
      colors: ['#a3e635', '#facc15', '#fb923c', '#22c55e', '#ffffff'],
      shapes: ['circle', 'square'],
      scalar: 1.1,
      ticks: 120,
    });

    onPlayFart(fart);
  };

  const handleRandomFart = () => {
    const random = allAvailableFarts[Math.floor(Math.random() * allAvailableFarts.length)];
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#facc15', '#ef4444', '#84cc16'],
    });
    onPlayFart(random);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Onomatopoeia Banner Pop (Shows when any fart triggers) */}
      {lastPlayedOnomatopoeia && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce">
          <div className="bg-yellow-400 border-4 border-black comic-shadow-lg px-6 py-2.5 rounded-2xl transform -rotate-3 text-2xl sm:text-4xl font-black text-black comic-font comic-text-stroke text-white tracking-widest uppercase shadow-2xl flex items-center gap-2">
            <span>💨</span>
            <span>{lastPlayedOnomatopoeia}</span>
            <span>💥</span>
          </div>
        </div>
      )}

      {/* Top Banner / Hero Info */}
      <div className="bg-white border-4 border-black comic-shadow rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-lime-300 text-lime-950 px-3 py-0.5 rounded-full border-2 border-black text-xs font-black tracking-wide mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> 100% Acústica Fiel & Cero Retardo
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 comic-font tracking-tight leading-tight">
            TABLERO DE PEDOS & SONIDOS
          </h2>
          <p className="text-sm font-medium text-zinc-600 max-w-lg mt-0.5">
            Toca cualquier botón para disparar el sonido inmediatamente, o pulsa el icono de reloj para programarlo como broma sorpresa.
          </p>
        </div>

        {/* Buttons: Random & Import */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto z-10">
          <button
            onClick={onOpenImportModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-lime-400 hover:bg-lime-300 text-lime-950 font-black px-4 py-3 rounded-2xl border-3 border-black comic-shadow comic-button text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>+ Subir MP3 / Grabar</span>
          </button>

          <button
            onClick={handleRandomFart}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-4 py-3 rounded-2xl border-3 border-black comic-shadow comic-button text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
          >
            <Shuffle className="w-4 h-4 text-zinc-950" />
            <span>Aleatorio</span>
          </button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap border-2 border-black transition-all ${
                selectedCategory === cat.id
                  ? 'bg-black text-yellow-300 comic-shadow-sm scale-105'
                  : 'bg-white hover:bg-yellow-100 text-black'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sonido..."
            className="w-full bg-white border-2 border-black rounded-xl pl-9 pr-3 py-1.5 text-sm font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 comic-shadow-sm"
          />
        </div>
      </div>

      {/* Soundboard Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filteredFarts.map((fart) => {
          const isActive = activeFartId === fart.id;
          const isCustom = fart.id.startsWith('custom_');

          return (
            <div
              key={fart.id}
              className={`relative group bg-white border-3 sm:border-4 border-black rounded-2xl p-3.5 sm:p-4 comic-shadow transition-all flex flex-col justify-between select-none overflow-hidden ${
                isActive
                  ? 'scale-95 ring-4 ring-red-500 shadow-none translate-x-1 translate-y-1 bg-yellow-50'
                  : 'hover:-translate-y-1 hover:comic-shadow-lg'
              }`}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${fart.color}`}
              />

              {/* Header inside card: Onomatopoeia + Danger Skulls / Delete */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-black ${fart.badgeBg}`}
                  >
                    {fart.onomatopoeia}
                  </span>

                  {isCustom ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomSound(fart.id);
                      }}
                      className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                      title="Eliminar sonido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div
                      className="flex items-center text-xs font-bold text-zinc-700"
                      title={`Nivel de Peligro: ${fart.dangerLevel}/5`}
                    >
                      {Array.from({ length: fart.dangerLevel }).map((_, i) => (
                        <Skull key={i} className="w-3 h-3 text-red-600 fill-red-500" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Trigger Button */}
                <button
                  onClick={(e) => handleCardClick(fart, e)}
                  className={`w-full py-4 sm:py-5 px-2 rounded-xl border-3 border-black bg-gradient-to-br ${fart.color} text-black font-black comic-button relative flex flex-col items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-md transform transition-transform group-hover:scale-110">
                    {fart.emoji}
                  </span>
                  <div className="flex items-center gap-1 text-black font-black text-xs sm:text-sm tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded-md border border-black/40">
                    <Play className="w-3 h-3 fill-black text-black" />
                    <span>¡SONAR!</span>
                  </div>
                </button>

                {/* Sound Name & Info */}
                <div className="mt-2.5 text-center">
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 tracking-tight leading-tight line-clamp-1">
                    {fart.name}
                  </h3>
                  <p className="text-[11px] font-medium text-zinc-500 line-clamp-1 mt-0.5">
                    {fart.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-3 pt-2.5 border-t-2 border-zinc-200 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">
                  {fart.duration}s
                </span>

                {/* Program into Timer Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetTimerForFart(fart);
                  }}
                  className="flex items-center gap-1 text-[11px] font-extrabold bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-950 px-2.5 py-1 rounded-lg border border-black transition-colors"
                  title="Configurar temporizador con este fart"
                >
                  <Timer className="w-3 h-3 text-amber-700" />
                  <span>Programar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFarts.length === 0 && (
        <div className="bg-white border-3 border-black rounded-2xl p-8 text-center comic-shadow max-w-md mx-auto">
          <p className="text-3xl mb-2">💨</p>
          <p className="font-extrabold text-lg text-zinc-800">No encontramos ningún pedo con ese nombre</p>
          <p className="text-sm text-zinc-500 mt-1">Prueba con otra palabra o limpia el buscador.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="mt-4 px-4 py-2 bg-yellow-400 font-extrabold border-2 border-black rounded-xl text-sm"
          >
            Ver todos los sonidos
          </button>
        </div>
      )}

      {/* Emergency Bottom Mega Button */}
      <div className="pt-4">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 border-4 border-black comic-shadow-lg rounded-2xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-black bg-yellow-400 text-black px-2 py-0.5 rounded border border-black uppercase mb-1">
              🚨 MÁXIMA POTENCIA
            </div>
            <h3 className="text-xl sm:text-2xl font-black comic-font tracking-wide">
              ¿SITUACIÓN DE EMERGENCIA?
            </h3>
            <p className="text-xs sm:text-sm text-red-100 font-medium">
              Dispara una explosión sónica devastadora para romper el hielo o desatar risas instantáneas.
            </p>
          </div>
          <button
            onClick={() => {
              const bomb = FART_PRESETS.find(f => f.id === 'bombazo') || FART_PRESETS[0];
              onPlayFart(bomb);
              confetti({
                particleCount: 70,
                spread: 100,
                origin: { y: 0.8 },
                colors: ['#ef4444', '#f59e0b', '#84cc16'],
              });
            }}
            className="w-full sm:w-auto whitespace-nowrap bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-black text-base sm:text-lg px-6 py-3.5 rounded-2xl border-3 border-black comic-shadow comic-button flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Flame className="w-6 h-6 fill-red-600 text-red-600 animate-bounce" />
            <span>¡DETONAR BOMBAZO!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

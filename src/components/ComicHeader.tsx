/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';

interface ComicHeaderProps {
  volume: number;
  onVolumeChange: (vol: number) => void;
  onQuickPrank: () => void;
}

export const ComicHeader: React.FC<ComicHeaderProps> = ({
  volume,
  onVolumeChange,
  onQuickPrank,
}) => {
  return (
    <header className="relative w-full pt-4 pb-3 px-4">
      {/* Decorative comic dots and background bar */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-yellow-300 border-4 border-black comic-shadow rounded-2xl p-3.5 relative overflow-hidden">
        {/* Comic background burst */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400 rounded-full opacity-40 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-400 rounded-full opacity-30 pointer-events-none" />

        {/* Title & Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-12 h-12 bg-red-500 rounded-xl border-3 border-black flex items-center justify-center text-2xl comic-shadow-sm transform -rotate-3 hover:rotate-3 transition-transform cursor-pointer">
            💨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                V 3.0 TURBO
              </span>
              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" style={{ animationDuration: '4s' }} />
                Edición Broma
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-none comic-font comic-text-stroke-sm text-yellow-400 mt-0.5">
              FART BLASTER 3000
            </h1>
          </div>
        </div>

        {/* Controls: Volume & Panic Button */}
        <div className="flex items-center gap-2.5 z-10 w-full sm:w-auto justify-end">
          {/* Quick Volume Slider */}
          <div className="flex items-center gap-2 bg-white/90 border-2 border-black rounded-xl px-2.5 py-1.5 comic-shadow-sm">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 0.9 : 0)}
              className="text-black hover:text-red-600 transition-colors"
              title={volume === 0 ? 'Activar sonido' : 'Silenciar'}
            >
              {volume === 0 ? (
                <VolumeX className="w-5 h-5 text-red-600" />
              ) : (
                <Volume2 className="w-5 h-5 text-zinc-900" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-red-500 cursor-pointer h-2 bg-yellow-200 rounded-lg"
              title="Volumen Maestro"
            />
            <span className="text-xs font-bold font-mono text-zinc-800 min-w-[28px]">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Quick Panic Prank Button */}
          <button
            onClick={onQuickPrank}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-xl border-2 border-black comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs tracking-wider uppercase"
          >
            <Flame className="w-4 h-4 fill-amber-300 text-amber-200 animate-pulse" />
            <span>¡PEDO YA!</span>
          </button>
        </div>
      </div>
    </header>
  );
};

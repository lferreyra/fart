/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { REAL_FART_PRESETS, FartSoundProfile } from '../audio/fartEngine';
import { Smartphone, Activity, ShieldAlert, Sparkles, Volume2, RotateCcw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhoopeeCushionTabProps {
  onPlayFart: (fart: FartSoundProfile) => void;
  selectedFart: FartSoundProfile;
  onSelectFart: (fart: FartSoundProfile) => void;
}

export const WhoopeeCushionTab: React.FC<WhoopeeCushionTabProps> = ({
  onPlayFart,
  selectedFart,
  onSelectFart,
}) => {
  const [isArmed, setIsArmed] = useState(false);
  const [armingCountdown, setArmingCountdown] = useState<number | null>(null);
  const [sensitivity, setSensitivity] = useState<'alta' | 'media' | 'baja'>('media');
  const [motionTriggered, setMotionTriggered] = useState(false);
  const [isCushionPressed, setIsCushionPressed] = useState(false);
  const [motionSupported, setMotionSupported] = useState<boolean | null>(null);

  const lastAccelRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const triggerCooldownRef = useRef(false);

  // Trigger threshold based on sensitivity
  const threshold = sensitivity === 'alta' ? 4 : sensitivity === 'media' ? 9 : 16;

  // Handle motion detection
  useEffect(() => {
    if (!isArmed) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      setMotionSupported(true);
      if (triggerCooldownRef.current) return;

      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      if (!lastAccelRef.current) {
        lastAccelRef.current = { x: acc.x, y: acc.y, z: acc.z };
        return;
      }

      const dx = Math.abs(acc.x - lastAccelRef.current.x);
      const dy = Math.abs(acc.y - lastAccelRef.current.y);
      const dz = Math.abs(acc.z - lastAccelRef.current.z);
      const totalDelta = dx + dy + dz;

      lastAccelRef.current = { x: acc.x, y: acc.y, z: acc.z };

      if (totalDelta > threshold) {
        triggerFartEvent();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isArmed, threshold]);

  const triggerFartEvent = () => {
    if (triggerCooldownRef.current) return;
    triggerCooldownRef.current = true;
    setMotionTriggered(true);
    setIsCushionPressed(true);

    onPlayFart(selectedFart);

    confetti({
      particleCount: 70,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b', '#84cc16'],
    });

    setTimeout(() => {
      setIsCushionPressed(false);
    }, 700);

    setTimeout(() => {
      triggerCooldownRef.current = false;
    }, 2500);
  };

  const startArming = () => {
    // Check permission for iOS 13+ devices if needed
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      // @ts-expect-error - iOS specific permission request
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      // @ts-expect-error - iOS specific
      DeviceMotionEvent.requestPermission().catch(() => {});
    }

    setMotionTriggered(false);
    setArmingCountdown(4);

    let count = 4;
    const interval = setInterval(() => {
      count -= 1;
      setArmingCountdown(count);

      if (count <= 0) {
        clearInterval(interval);
        setArmingCountdown(null);
        setIsArmed(true);
        lastAccelRef.current = null;
      }
    }, 1000);
  };

  const disarm = () => {
    setIsArmed(false);
    setArmingCountdown(null);
    setMotionTriggered(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 border-4 border-black comic-shadow rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black text-pink-300 px-3 py-0.5 rounded-full text-xs font-black tracking-wide uppercase mb-1">
            <Activity className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            Detector de Movimiento & Asiento
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black comic-font tracking-tight">
            COJÍN DE PEDOS TÁCTICO
          </h2>
          <p className="text-sm font-medium text-pink-950">
            Deja el móvil sobre la silla o sofá. Cuando la víctima se siente o lo mueva, ¡estallará al instante!
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-2.5 comic-shadow-sm text-xs font-bold text-zinc-800 text-center">
          <Smartphone className="w-6 h-6 mx-auto text-pink-600 mb-0.5" />
          <span>Acelerómetro Activo</span>
        </div>
      </div>

      {/* Main Interactive Whoopee Cushion Arena */}
      <div className="bg-white border-4 border-black comic-shadow rounded-2xl p-6 text-center relative overflow-hidden">
        {/* Arming Countdown state */}
        {armingCountdown !== null ? (
          <div className="py-8">
            <div className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-black comic-shadow mx-auto flex items-center justify-center text-5xl font-black font-mono text-black animate-pulse">
              {armingCountdown}
            </div>
            <h3 className="text-xl font-black text-zinc-900 comic-font mt-4">
              ¡COLOCA EL MÓVIL EN LA SILLA AHORA!
            </h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
              Tienes {armingCountdown} segundos para dejar el móvil quieto en el cojín antes de que el sensor se active.
            </p>
          </div>
        ) : isArmed ? (
          /* Armed Waiting for victim state */
          <div className="py-6 space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white font-black text-sm uppercase px-4 py-1.5 rounded-full border-2 border-black animate-pulse">
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              <span>SENSOR ARMADO Y VIGILANDO</span>
            </div>

            {/* Giant cushion waiting */}
            <div
              onClick={triggerFartEvent}
              className={`cursor-pointer mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 border-4 border-black comic-shadow-lg flex flex-col items-center justify-center text-white transition-transform ${
                isCushionPressed ? 'scale-75 translate-y-3' : 'animate-wiggle hover:scale-105'
              }`}
            >
              <span className="text-6xl sm:text-7xl">💨</span>
              <span className="comic-font text-lg font-black tracking-wider uppercase mt-1">
                {isCushionPressed ? '¡¡¡BOOM!!!' : 'Tócame o Muéveme'}
              </span>
            </div>

            {motionTriggered && (
              <div className="bg-yellow-300 border-2 border-black rounded-xl p-3 max-w-sm mx-auto font-black text-black text-sm animate-bounce">
                ¡MOVIMIENTO DETECTADO! Pedo disparado con éxito.
              </div>
            )}

            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Cualquier vibración, toque en la pantalla o movimiento activará el sonido de {selectedFart.name}.
            </p>

            <button
              onClick={disarm}
              className="mt-4 bg-zinc-800 hover:bg-black text-white font-extrabold px-6 py-2.5 rounded-xl border-2 border-black comic-shadow-sm inline-flex items-center gap-2 text-sm uppercase"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>Desarmar Sensor</span>
            </button>
          </div>
        ) : (
          /* Idle / Setup Screen */
          <div className="space-y-6">
            {/* Interactive Giant Cushion (Can be tapped for instant fun) */}
            <div
              onClick={triggerFartEvent}
              className={`cursor-pointer mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 border-4 border-black comic-shadow flex flex-col items-center justify-center text-white transition-all active:scale-90 active:translate-y-2`}
              title="Toca para probar el cojín"
            >
              <span className="text-5xl sm:text-6xl">💨</span>
              <span className="comic-font text-sm sm:text-base font-black tracking-wider uppercase mt-1">
                Toca para probar
              </span>
            </div>

            {/* Sound Selector */}
            <div>
              <label className="block text-xs font-black uppercase text-zinc-500 mb-2">
                Sonido al sentarse / moverse:
              </label>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {REAL_FART_PRESETS.slice(0, 6).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onSelectFart(f)}
                    className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-extrabold ${
                      selectedFart.id === f.id
                        ? 'bg-pink-400 text-pink-950 comic-shadow-sm scale-105'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {f.emoji} {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity Setting */}
            <div>
              <label className="block text-xs font-black uppercase text-zinc-500 mb-2">
                Sensibilidad del Acelerómetro:
              </label>
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {(['alta', 'media', 'baja'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSensitivity(s)}
                    className={`py-1.5 rounded-xl border-2 border-black text-xs font-black capitalize transition-all ${
                      sensitivity === s
                        ? 'bg-yellow-400 text-black comic-shadow-sm scale-105'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {sensitivity === 'alta'
                  ? 'Detecta el más mínimo roce o roce de tela.'
                  : sensitivity === 'media'
                  ? 'Recomendado para sillas y sofás.'
                  : 'Requiere que levanten o muevan claramente el móvil.'}
              </p>
            </div>

            {/* Arm Button */}
            <button
              onClick={startArming}
              className="w-full max-w-md mx-auto py-3.5 px-6 bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white font-black text-base sm:text-lg rounded-2xl border-3 border-black comic-shadow comic-button flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Activity className="w-5 h-5 text-yellow-300" />
              <span>ARMAR SENSOR (4s para colocar)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

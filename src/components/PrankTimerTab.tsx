/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { REAL_FART_PRESETS, FartSoundProfile } from '../audio/fartEngine';
import {
  Timer,
  Bomb,
  Play,
  RotateCcw,
  EyeOff,
  Calculator,
  Laptop,
  Volume2,
  AlertTriangle,
  Sparkles,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrankTimerTabProps {
  selectedFart: FartSoundProfile;
  onSelectFart: (fart: FartSoundProfile) => void;
  onDetonate: (fart: FartSoundProfile) => void;
  onActivateStealth: (
    mode: 'blackout' | 'calculator' | 'system_update',
    seconds: number,
    fart: FartSoundProfile
  ) => void;
}

export const PrankTimerTab: React.FC<PrankTimerTabProps> = ({
  selectedFart,
  onSelectFart,
  onDetonate,
  onActivateStealth,
}) => {
  const [seconds, setSeconds] = useState<number>(10);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(10);
  const [stealthMode, setStealthMode] = useState<'none' | 'blackout' | 'calculator' | 'system_update'>('none');
  const [useRandomFart, setUseRandomFart] = useState<boolean>(false);
  const [gracePeriod, setGracePeriod] = useState<boolean>(true); // 3 sec delay to place phone
  const [graceRemaining, setGraceRemaining] = useState<number>(3);
  const [hasDetonated, setHasDetonated] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [
    { label: '5s', value: 5, tip: 'Rápido' },
    { label: '10s', value: 10, tip: 'Ideal' },
    { label: '15s', value: 15, tip: 'Distracción' },
    { label: '30s', value: 30, tip: 'Sal de la sala' },
    { label: '1m', value: 60, tip: 'Emboscarda' },
    { label: '2m', value: 120, tip: 'Inesperado' },
  ];

  // Stop countdown on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startPrank = () => {
    setHasDetonated(false);

    // If stealth mode is active, send to stealth overlay right away
    if (stealthMode !== 'none') {
      const chosenFart = useRandomFart
        ? REAL_FART_PRESETS[Math.floor(Math.random() * REAL_FART_PRESETS.length)]
        : selectedFart;
      onActivateStealth(stealthMode, seconds, chosenFart);
      return;
    }

    // Standard in-app comic countdown
    setIsCountingDown(true);
    setRemainingTime(seconds);

    let current = seconds;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      current -= 1;
      setRemainingTime(current);

      if (current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCountingDown(false);
        setHasDetonated(true);

        const chosenFart = useRandomFart
          ? REAL_FART_PRESETS[Math.floor(Math.random() * REAL_FART_PRESETS.length)]
          : selectedFart;
        onDetonate(chosenFart);

        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#84cc16', '#eab308', '#ef4444', '#06b6d4'],
        });
      }
    }, 1000);
  };

  const cancelPrank = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCountingDown(false);
    setHasDetonated(false);
    setRemainingTime(seconds);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Comic Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 border-4 border-black comic-shadow rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black text-yellow-300 px-3 py-0.5 rounded-full text-xs font-black tracking-wide uppercase mb-1">
            <Bomb className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Modo Broma Táctica
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black comic-font tracking-tight">
            TEMPORIZADOR DE PEDOS
          </h2>
          <p className="text-sm font-medium text-amber-950">
            Programa el tiempo, activa el camuflaje si quieres, pon tu móvil cerca de la víctima y aléjate con disimulo.
          </p>
        </div>

        {/* Volume notice badge */}
        <div className="flex items-center gap-2 bg-white/90 border-2 border-black rounded-xl p-2.5 comic-shadow-sm text-xs font-extrabold text-zinc-800">
          <Volume2 className="w-5 h-5 text-red-600 animate-bounce" />
          <span>¡Sube el volumen de tu móvil al 100%!</span>
        </div>
      </div>

      {/* Main Countdown Visualizer / Bomb Station */}
      <div className="bg-white border-4 border-black comic-shadow rounded-2xl p-6 relative overflow-hidden text-center">
        {/* Background Comic Halftone */}
        <div className="absolute inset-0 halftone-dots-dark pointer-events-none opacity-40" />

        {isCountingDown ? (
          /* Active Countdown Screen */
          <div className="relative z-10 py-4">
            <div className="inline-block bg-red-600 text-white font-black text-xs uppercase px-4 py-1 rounded-full border-2 border-black mb-3 animate-pulse">
              💣 ¡MECHA ENCENDIDA! BOMBA ACTIVA
            </div>

            <div className="relative my-4 inline-flex items-center justify-center">
              <div className="w-44 h-44 rounded-full bg-yellow-100 border-4 border-black comic-shadow flex flex-col items-center justify-center">
                <span className="text-6xl sm:text-7xl font-black font-mono text-red-600 animate-pulse-fast">
                  {remainingTime}
                </span>
                <span className="text-xs font-extrabold text-zinc-600 uppercase tracking-wider">
                  segundos
                </span>
              </div>
            </div>

            <p className="text-base font-extrabold text-zinc-900 mt-2">
              Sonido programado: <span className="text-red-600 font-black">{useRandomFart ? '🎲 Ruleta Aleatoria' : selectedFart.name}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Coloca el móvil boca abajo o cerca de tu víctima. En {remainingTime} segundos estallará por sorpresa.
            </p>

            {/* Cancel Button */}
            <div className="mt-6">
              <button
                onClick={cancelPrank}
                className="bg-zinc-800 hover:bg-black active:bg-zinc-900 text-white font-extrabold px-6 py-2.5 rounded-xl border-2 border-black comic-shadow-sm flex items-center gap-2 mx-auto text-sm uppercase tracking-wider"
              >
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Desactivar Bomba</span>
              </button>
            </div>
          </div>
        ) : hasDetonated ? (
          /* Post-Detonation Screen */
          <div className="relative z-10 py-6 animate-bounce">
            <span className="text-7xl sm:text-8xl">💥</span>
            <h3 className="text-3xl sm:text-4xl font-black text-black comic-font comic-text-stroke text-yellow-400 mt-2 uppercase">
              ¡¡¡¡KRAKATOAAA!!!!
            </h3>
            <p className="text-lg font-black text-red-600 mt-1">
              ¡El pedo ha estallado con éxito en el momento exacto!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setHasDetonated(false);
                  startPrank();
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-xl border-3 border-black comic-shadow comic-button text-sm uppercase tracking-wider"
              >
                Repetir Broma ({seconds}s)
              </button>
              <button
                onClick={() => setHasDetonated(false)}
                className="bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold px-5 py-3 rounded-xl border-2 border-black comic-shadow-sm text-sm"
              >
                Modificar Configuración
              </button>
            </div>
          </div>
        ) : (
          /* Configuration Mode */
          <div className="relative z-10 space-y-6">
            {/* Countdown Duration Picker */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-2">
                1. Elige el tiempo de retardo para alejarte
              </label>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-lg mx-auto">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setSeconds(p.value)}
                    className={`py-2.5 px-2 rounded-xl border-2 border-black font-black text-center transition-all ${
                      seconds === p.value
                        ? 'bg-yellow-400 text-black comic-shadow-sm scale-105'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    }`}
                  >
                    <div className="text-base sm:text-lg leading-none">{p.label}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5 font-medium">{p.tip}</div>
                  </button>
                ))}
              </div>

              {/* Slider for precision custom seconds */}
              <div className="max-w-md mx-auto mt-4 px-4 flex items-center gap-4">
                <input
                  type="range"
                  min="3"
                  max="180"
                  step="1"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-3 bg-zinc-200 rounded-lg cursor-pointer"
                />
                <div className="bg-yellow-300 border-2 border-black rounded-lg px-2.5 py-1 text-sm font-black font-mono whitespace-nowrap comic-shadow-sm">
                  {seconds} seg
                </div>
              </div>
            </div>

            {/* Sound Selector */}
            <div className="pt-2 border-t-2 border-zinc-100">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-2">
                2. Selecciona qué sonido estallará
              </label>

              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                {/* Random Surprise Button */}
                <button
                  onClick={() => setUseRandomFart(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-extrabold transition-all ${
                    useRandomFart
                      ? 'bg-red-500 text-white comic-shadow-sm scale-105'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>🎲 Fart Sorpresa (Aleatorio)</span>
                </button>

                {/* Real Recorded Farts */}
                {REAL_FART_PRESETS.map((fart) => (
                  <button
                    key={fart.id}
                    onClick={() => {
                      setUseRandomFart(false);
                      onSelectFart(fart);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-extrabold transition-all ${
                      !useRandomFart && selectedFart.id === fart.id
                        ? 'bg-yellow-400 text-black comic-shadow-sm scale-105'
                        : 'bg-white hover:bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    <span>{fart.emoji}</span>
                    <span>{fart.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Camouflage Mode (Stealth mode requested by user) */}
            <div className="pt-2 border-t-2 border-zinc-100">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-700">
                  3. Modo Camuflaje de Pantalla (Sigilo)
                </span>
                <span className="bg-lime-400 text-lime-950 font-black text-[10px] px-2 py-0.2 rounded-full border border-black">
                  RECOMENDADO
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-3 max-w-md mx-auto">
                Disfraza la pantalla para que nadie sospeche si miran el móvil en la mesa.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto">
                <button
                  onClick={() => setStealthMode('blackout')}
                  className={`p-2.5 rounded-xl border-2 border-black text-center transition-all ${
                    stealthMode === 'blackout'
                      ? 'bg-black text-yellow-300 comic-shadow-sm scale-105'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <EyeOff className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                  <div className="text-xs font-extrabold">Pantalla Apagada</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Totalmente negra</div>
                </button>

                <button
                  onClick={() => setStealthMode('calculator')}
                  className={`p-2.5 rounded-xl border-2 border-black text-center transition-all ${
                    stealthMode === 'calculator'
                      ? 'bg-amber-500 text-white comic-shadow-sm scale-105'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <Calculator className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <div className="text-xs font-extrabold">Calculadora Real</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Funcional e interactiva</div>
                </button>

                <button
                  onClick={() => setStealthMode('system_update')}
                  className={`p-2.5 rounded-xl border-2 border-black text-center transition-all ${
                    stealthMode === 'system_update'
                      ? 'bg-blue-600 text-white comic-shadow-sm scale-105'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <Laptop className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-xs font-extrabold">Actualización</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Pantalla de sistema</div>
                </button>

                <button
                  onClick={() => setStealthMode('none')}
                  className={`p-2.5 rounded-xl border-2 border-black text-center transition-all ${
                    stealthMode === 'none'
                      ? 'bg-yellow-400 text-black comic-shadow-sm scale-105'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <Bomb className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <div className="text-xs font-extrabold">Bomba Cómic</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Reloj en pantalla</div>
                </button>
              </div>
            </div>

            {/* Arm Button */}
            <div className="pt-2">
              <button
                onClick={startPrank}
                className="w-full max-w-md mx-auto py-4 px-6 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:to-red-500 active:from-red-600 active:to-red-700 text-white font-black text-lg sm:text-xl rounded-2xl border-4 border-black comic-shadow comic-button flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <Bomb className="w-6 h-6 fill-yellow-300 text-yellow-300 animate-bounce" />
                <span>¡ARMAR BROMA ({seconds} SEGUNDOS)!</span>
              </button>
              <p className="text-[11px] text-zinc-500 font-medium mt-2">
                💡 Consejo: Pulsa armar, deja el móvil casualmente junto a tu amigo/familiar y espera la explosión.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prank Step-by-Step Comic Instructions Card */}
      <div className="bg-white border-3 border-black comic-shadow rounded-2xl p-4 sm:p-5">
        <h3 className="font-extrabold text-base text-zinc-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          ¿Cómo funciona la broma perfecta?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-yellow-50 border-2 border-black rounded-xl p-3">
            <span className="font-black text-yellow-900 text-sm block mb-1">1. Programa</span>
            <p className="text-zinc-600">
              Escoge 10 o 15 segundos y activa el modo &quot;Pantalla Apagada&quot; o &quot;Calculadora&quot;.
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-black rounded-xl p-3">
            <span className="font-black text-yellow-900 text-sm block mb-1">2. Coloca el Móvil</span>
            <p className="text-zinc-600">
              Pon el móvil discretamente en la mesa, al lado del plato, en el sofá o debajo de un cojín.
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-black rounded-xl p-3">
            <span className="font-black text-yellow-900 text-sm block mb-1">3. ¡Sorpresa!</span>
            <p className="text-zinc-600">
              El pedo estallará a todo volumen y todos mirarán a la persona más cercana con cara de asombro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

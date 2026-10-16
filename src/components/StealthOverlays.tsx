/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface StealthOverlayProps {
  mode: 'blackout' | 'calculator' | 'system_update';
  remainingSeconds: number;
  onCancel: () => void;
  fartName: string;
}

export const StealthOverlay: React.FC<StealthOverlayProps> = ({
  mode,
  remainingSeconds,
  onCancel,
  fartName,
}) => {
  // Fake calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  // Hidden cancel hint timer (shows tiny hint if user taps screen 3 times in blackout)
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  // Calculator logic so it behaves like a real phone calculator if someone touches it
  const handleCalcNumber = (num: string) => {
    if (calcDisplay === '0' || waitingForNext) {
      setCalcDisplay(num);
      setWaitingForNext(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOperator = (op: string) => {
    const val = parseFloat(calcDisplay);
    if (prevValue !== null && operator && !waitingForNext) {
      let result = val;
      if (operator === '+') result = prevValue + val;
      if (operator === '-') result = prevValue - val;
      if (operator === '×') result = prevValue * val;
      if (operator === '÷') result = val !== 0 ? prevValue / val : 0;
      setCalcDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(val);
    }
    setOperator(op);
    setWaitingForNext(true);
  };

  const handleCalcEquals = () => {
    if (operator && prevValue !== null) {
      const val = parseFloat(calcDisplay);
      let result = val;
      if (operator === '+') result = prevValue + val;
      if (operator === '-') result = prevValue - val;
      if (operator === '×') result = prevValue * val;
      if (operator === '÷') result = val !== 0 ? prevValue / val : 0;
      setCalcDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForNext(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNext(false);
  };

  // 1. Blackout Mode (Fake turned-off screen)
  if (mode === 'blackout') {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 select-none cursor-pointer"
        onClick={() => setTapCount((c) => c + 1)}
      >
        <div className="flex justify-between items-center text-zinc-900 opacity-60">
          <span className="text-xs">··</span>
          <span className="text-xs">{remainingSeconds}s</span>
        </div>

        {/* Secret tap hint */}
        <div className="text-center">
          {tapCount >= 2 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 max-w-xs mx-auto animate-fade-in text-white shadow-2xl">
              <p className="text-sm font-bold text-amber-400">⏳ Broma Armada ({fartName})</p>
              <p className="text-xs text-zinc-400 mt-1">Explosión en: {remainingSeconds} segundos</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm"
              >
                Desactivar Broma
              </button>
            </div>
          ) : (
            <div className="opacity-0 hover:opacity-20 transition-opacity text-zinc-800 text-[10px]">
              Toca dos veces para ver estado o cancelar
            </div>
          )}
        </div>

        <div className="flex justify-between text-zinc-900 opacity-40 text-[9px]">
          <span>Pantalla en reposo</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="text-zinc-800 hover:text-zinc-600 p-2"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // 2. Fake Calculator Mode
  if (mode === 'calculator') {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-end p-4 font-sans select-none">
        {/* Subtle top indicator with secret cancel button */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-zinc-500 text-xs">
          <span>14:28</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-950/80 text-red-400 px-2 py-0.5 rounded font-mono border border-red-800/40">
              💣 {remainingSeconds}s
            </span>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              title="Cancelar Broma"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calculator Display */}
        <div className="mb-4 text-right pr-2">
          <div className="text-6xl font-light tracking-tight truncate max-w-full">
            {calcDisplay}
          </div>
        </div>

        {/* Calculator Keypad */}
        <div className="grid grid-cols-4 gap-3 mb-6 max-w-sm mx-auto w-full">
          <button
            onClick={handleCalcClear}
            className="aspect-square rounded-full bg-zinc-400 text-black text-2xl font-medium active:bg-zinc-300"
          >
            AC
          </button>
          <button
            onClick={() => {
              const val = parseFloat(calcDisplay) * -1;
              setCalcDisplay(String(val));
            }}
            className="aspect-square rounded-full bg-zinc-400 text-black text-2xl font-medium active:bg-zinc-300"
          >
            ±
          </button>
          <button
            onClick={() => {
              const val = parseFloat(calcDisplay) / 100;
              setCalcDisplay(String(val));
            }}
            className="aspect-square rounded-full bg-zinc-400 text-black text-2xl font-medium active:bg-zinc-300"
          >
            %
          </button>
          <button
            onClick={() => handleCalcOperator('÷')}
            className={`aspect-square rounded-full text-2xl font-medium transition-colors ${
              operator === '÷' ? 'bg-white text-amber-500' : 'bg-amber-500 text-white active:bg-amber-400'
            }`}
          >
            ÷
          </button>

          {['7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="aspect-square rounded-full bg-zinc-800 text-white text-3xl font-normal active:bg-zinc-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleCalcOperator('×')}
            className={`aspect-square rounded-full text-2xl font-medium transition-colors ${
              operator === '×' ? 'bg-white text-amber-500' : 'bg-amber-500 text-white active:bg-amber-400'
            }`}
          >
            ×
          </button>

          {['4', '5', '6'].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="aspect-square rounded-full bg-zinc-800 text-white text-3xl font-normal active:bg-zinc-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleCalcOperator('-')}
            className={`aspect-square rounded-full text-2xl font-medium transition-colors ${
              operator === '-' ? 'bg-white text-amber-500' : 'bg-amber-500 text-white active:bg-amber-400'
            }`}
          >
            -
          </button>

          {['1', '2', '3'].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="aspect-square rounded-full bg-zinc-800 text-white text-3xl font-normal active:bg-zinc-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleCalcOperator('+')}
            className={`aspect-square rounded-full text-2xl font-medium transition-colors ${
              operator === '+' ? 'bg-white text-amber-500' : 'bg-amber-500 text-white active:bg-amber-400'
            }`}
          >
            +
          </button>

          <button
            onClick={() => handleCalcNumber('0')}
            className="col-span-2 rounded-full bg-zinc-800 text-white text-3xl font-normal pl-8 text-left active:bg-zinc-700 h-16"
          >
            0
          </button>
          <button
            onClick={() => {
              if (!calcDisplay.includes('.')) setCalcDisplay(calcDisplay + '.');
            }}
            className="aspect-square rounded-full bg-zinc-800 text-white text-3xl font-normal active:bg-zinc-700"
          >
            ,
          </button>
          <button
            onClick={handleCalcEquals}
            className="aspect-square rounded-full bg-amber-500 text-white text-2xl font-medium active:bg-amber-400"
          >
            =
          </button>
        </div>
      </div>
    );
  }

  // 3. Fake System Update Screen
  return (
    <div className="fixed inset-0 z-50 bg-black text-zinc-100 flex flex-col items-center justify-center p-8 select-none">
      <div className="w-16 h-16 rounded-full border-4 border-zinc-700 border-t-blue-500 animate-spin mb-8" />
      <h2 className="text-xl font-medium mb-2">Instalando actualización crítica del sistema</h2>
      <p className="text-zinc-400 text-sm mb-6 text-center max-w-xs">
        No apague el teléfono ni desconecte la alimentación mientras se completa la instalación.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-zinc-800 rounded-full h-2 overflow-hidden mb-2">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${Math.min(96, Math.max(15, 100 - remainingSeconds * 5))}%` }}
        />
      </div>
      <div className="flex justify-between w-full max-w-xs text-xs text-zinc-500">
        <span>Paso 2 de 3</span>
        <span className="font-mono text-zinc-400">Detonación: {remainingSeconds}s</span>
      </div>

      <button
        onClick={onCancel}
        className="mt-12 text-xs text-zinc-600 hover:text-zinc-300 border border-zinc-800 rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Cancelar Broma Secreta
      </button>
    </div>
  );
};

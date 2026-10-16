/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ComicHeader } from './components/ComicHeader';
import { SoundboardTab } from './components/SoundboardTab';
import { PrankTimerTab } from './components/PrankTimerTab';
import { WhoopeeCushionTab } from './components/WhoopeeCushionTab';
import { FartLabTab } from './components/FartLabTab';
import { StealthOverlay } from './components/StealthOverlays';
import { AudioImportModal } from './components/AudioImportModal';
import {
  FART_PRESETS,
  FartSoundProfile,
  FartMixerSettings,
  fartAudio,
} from './audio/fartEngine';
import {
  CustomFartRecord,
  loadCustomSounds,
  deleteCustomSound,
  playAudioDataUrl,
  customRecordToProfile,
} from './audio/customAudioStore';
import {
  LayoutGrid,
  Timer,
  Activity,
  Sliders,
  Sparkles,
  BookOpen,
  X,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'soundboard' | 'timer' | 'cushion' | 'lab'>('soundboard');
  const [selectedFartForTimer, setSelectedFartForTimer] = useState<FartSoundProfile>(FART_PRESETS[0]);
  const [activePlayingFartId, setActivePlayingFartId] = useState<string | null>(null);
  const [lastOnomatopoeia, setLastOnomatopoeia] = useState<string | null>(null);

  // Custom user-uploaded sounds
  const [customSounds, setCustomSounds] = useState<CustomFartRecord[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Load custom sounds from local storage
  useEffect(() => {
    setCustomSounds(loadCustomSounds());
  }, []);

  // Mixer settings
  const [mixerSettings, setMixerSettings] = useState<FartMixerSettings>({
    pitch: 1.0,
    duration: 1.0,
    wetness: 0.3,
    bassBoost: true,
    volume: 0.9,
  });

  // Stealth mode overlay state
  const [stealthActive, setStealthActive] = useState<{
    mode: 'blackout' | 'calculator' | 'system_update';
    seconds: number;
    fart: FartSoundProfile;
  } | null>(null);
  const [stealthRemainingSeconds, setStealthRemainingSeconds] = useState<number>(0);

  // Play a fart sound directly (either synthesized or user custom file)
  const playFartSound = (fart: FartSoundProfile, customMixer?: FartMixerSettings) => {
    setActivePlayingFartId(fart.id);
    setLastOnomatopoeia(fart.onomatopoeia);

    // If it's a custom uploaded/recorded sound
    const customRec = customSounds.find((c) => c.id === fart.id);
    if (customRec) {
      playAudioDataUrl(customRec.dataUrl, mixerSettings.volume)
        .catch((e) => console.error('Audio play error:', e))
        .finally(() => setActivePlayingFartId(null));

      setTimeout(() => {
        setLastOnomatopoeia(null);
      }, 2000);
      return;
    }

    // Synthesized Web Audio Fart
    const dur = fartAudio.play(fart, customMixer || mixerSettings);

    setTimeout(() => {
      setActivePlayingFartId(null);
    }, dur * 1000);

    setTimeout(() => {
      setLastOnomatopoeia(null);
    }, 2200);
  };

  const handleCustomSoundAdded = (record: CustomFartRecord) => {
    setCustomSounds((prev) => [record, ...prev]);
  };

  const handleDeleteCustomSound = (id: string) => {
    deleteCustomSound(id);
    setCustomSounds((prev) => prev.filter((s) => s.id !== id));
  };

  // Quick panic fart
  const handleQuickPanic = () => {
    const all = [...customSounds.map(customRecordToProfile), ...FART_PRESETS];
    const random = all[Math.floor(Math.random() * all.length)];
    playFartSound(random);
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b', '#84cc16'],
    });
  };

  // Send fart from soundboard or lab to timer tab
  const handleSetTimerForFart = (fart: FartSoundProfile) => {
    setSelectedFartForTimer(fart);
    setActiveTab('timer');
  };

  // Start stealth mode with countdown
  const handleActivateStealth = (
    mode: 'blackout' | 'calculator' | 'system_update',
    seconds: number,
    fart: FartSoundProfile
  ) => {
    setStealthActive({ mode, seconds, fart });
    setStealthRemainingSeconds(seconds);

    let rem = seconds;
    const interval = setInterval(() => {
      rem -= 1;
      setStealthRemainingSeconds(rem);

      if (rem <= 0) {
        clearInterval(interval);
        setStealthActive(null);
        playFartSound(fart);

        confetti({
          particleCount: 100,
          spread: 140,
          origin: { y: 0.5 },
          colors: ['#84cc16', '#eab308', '#ef4444'],
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col font-sans select-none text-zinc-900">
      {/* Active Stealth Fullscreen Overlay (if armed) */}
      {stealthActive && (
        <StealthOverlay
          mode={stealthActive.mode}
          remainingSeconds={stealthRemainingSeconds}
          fartName={stealthActive.fart.name}
          onCancel={() => setStealthActive(null)}
        />
      )}

      {/* Audio Import & Recorder Modal */}
      <AudioImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSoundAdded={handleCustomSoundAdded}
      />

      {/* Sound Libraries Info Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black comic-shadow-lg rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-yellow-300 border-b-3 border-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-black text-black comic-font">
                  BANCOS DE SONIDOS & HERRAMIENTAS
                </h3>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1 rounded-xl bg-white border-2 border-black hover:bg-red-100"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-700">
              {/* ElevenLabs */}
              <div className="bg-purple-50 border-2 border-black rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-purple-950 flex items-center gap-1.5">
                    🤖 ElevenLabs Sound Effects (IA)
                  </span>
                  <a
                    href="https://elevenlabs.io/sound-effects/farts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-zinc-600 mb-2">
                  Genera cualquier efecto con inteligencia artificial a partir de texto (ej. <em>&quot;pedo húmedo con eco en ascensor&quot;</em>). Tienen una sección dedicada a farts con muestras gratuitas para descargar en MP3 y subir a esta app.
                </p>
                <span className="inline-block bg-purple-200 text-purple-950 font-bold px-2 py-0.5 rounded text-[10px]">
                  Generación por IA • Créditos mensuales gratis
                </span>
              </div>

              {/* Artlist SFX & Epidemic Sound */}
              <div className="bg-amber-50 border-2 border-black rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-amber-950 flex items-center gap-1.5">
                    🎵 Artlist & Epidemic Sound
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://artlist.io/sfx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      Artlist <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.epidemicsound.com/sound-effects/categories/farts/designed/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      Epidemic <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-zinc-600 mb-2">
                  Son las plataformas de pago líderes para cineastas y creadores de contenido. Tienen secciones completas de <em>&quot;Designed Farts&quot;</em> producidas en estudio. Si tienes cuenta activa, descarga tus clips favoritos y cárgalos en el botón <strong>&quot;+ Subir MP3&quot;</strong>.
                </p>
                <span className="inline-block bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px]">
                  Calidad de Estudio • Requieren suscripción de pago
                </span>
              </div>

              {/* Gratuitos: Pixabay & Freesound */}
              <div className="bg-lime-50 border-2 border-black rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-lime-950 flex items-center gap-1.5">
                    🎁 Pixabay & Freesound.org (100% Gratis)
                  </span>
                  <a
                    href="https://pixabay.com/sound-effects/search/fart/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-800 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Pixabay Farts</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-zinc-600 mb-2">
                  Alternativas totalmente gratuitas y sin suscripción para descargar sonidos MP3 listos para usar en tus bromas o proyectos.
                </p>
                <span className="inline-block bg-lime-200 text-lime-950 font-bold px-2 py-0.5 rounded text-[10px]">
                  100% Gratis • Sin suscripción • Descarga en 1 clic
                </span>
              </div>
            </div>

            <div className="bg-zinc-100 border-t-2 border-black p-3.5 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2 bg-yellow-400 font-black text-xs uppercase rounded-xl border-2 border-black comic-shadow"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Comic Header */}
      <ComicHeader
        volume={mixerSettings.volume}
        onVolumeChange={(vol) => setMixerSettings({ ...mixerSettings, volume: vol })}
        onQuickPrank={handleQuickPanic}
      />

      {/* Navigation Comic Tabs */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-1 pb-4">
        <nav className="bg-white border-3 sm:border-4 border-black comic-shadow rounded-2xl p-1.5 flex items-center justify-between gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('soundboard')}
            className={`flex-1 min-w-[75px] py-2.5 px-2 rounded-xl border-2 font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
              activeTab === 'soundboard'
                ? 'bg-yellow-400 text-black border-black comic-shadow-sm scale-102'
                : 'bg-transparent hover:bg-yellow-50 text-zinc-700 border-transparent'
            }`}
          >
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
            <span className="uppercase tracking-wider">Tablero</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 min-w-[75px] py-2.5 px-2 rounded-xl border-2 font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all relative ${
              activeTab === 'timer'
                ? 'bg-red-500 text-white border-black comic-shadow-sm scale-102'
                : 'bg-transparent hover:bg-red-50 text-zinc-700 border-transparent'
            }`}
          >
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            <span className="uppercase tracking-wider">Temporizador</span>
            <span className="hidden sm:inline-block bg-yellow-300 text-black text-[9px] font-black px-1.5 py-0.2 rounded border border-black ml-0.5">
              BROMA
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cushion')}
            className={`flex-1 min-w-[75px] py-2.5 px-2 rounded-xl border-2 font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
              activeTab === 'cushion'
                ? 'bg-pink-400 text-pink-950 border-black comic-shadow-sm scale-102'
                : 'bg-transparent hover:bg-pink-50 text-zinc-700 border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            <span className="uppercase tracking-wider">Cojín Sensor</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex-1 min-w-[75px] py-2.5 px-2 rounded-xl border-2 font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
              activeTab === 'lab'
                ? 'bg-lime-400 text-lime-950 border-black comic-shadow-sm scale-102'
                : 'bg-transparent hover:bg-lime-50 text-zinc-700 border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            <span className="uppercase tracking-wider">Laboratorio</span>
          </button>
        </nav>
      </div>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto w-full px-4 flex-1">
        {activeTab === 'soundboard' && (
          <SoundboardTab
            onPlayFart={playFartSound}
            onSetTimerForFart={handleSetTimerForFart}
            mixerSettings={mixerSettings}
            activeFartId={activePlayingFartId}
            lastPlayedOnomatopoeia={lastOnomatopoeia}
            customSounds={customSounds}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onDeleteCustomSound={handleDeleteCustomSound}
          />
        )}

        {activeTab === 'timer' && (
          <PrankTimerTab
            selectedFart={selectedFartForTimer}
            onSelectFart={setSelectedFartForTimer}
            onDetonate={playFartSound}
            onActivateStealth={handleActivateStealth}
          />
        )}

        {activeTab === 'cushion' && (
          <WhoopeeCushionTab
            onPlayFart={playFartSound}
            selectedFart={selectedFartForTimer}
            onSelectFart={setSelectedFartForTimer}
          />
        )}

        {activeTab === 'lab' && (
          <FartLabTab
            mixerSettings={mixerSettings}
            onUpdateMixer={setMixerSettings}
            onSendToTimer={handleSetTimerForFart}
          />
        )}
      </main>

      {/* Bottom Comic Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t-3 border-black bg-yellow-300">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-amber-950">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">💨</span>
            <span className="comic-font text-base text-black">FART BLASTER 3000</span>
            <span>— Compatible con sonidos de Artlist, Epidemic Sound & ElevenLabs</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="bg-white hover:bg-yellow-100 text-zinc-900 border-2 border-black rounded-lg px-2.5 py-1 text-[11px] font-extrabold flex items-center gap-1 comic-shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>Info Bancos de Sonido</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-lime-400 hover:bg-lime-300 text-lime-950 border-2 border-black rounded-lg px-2.5 py-1 text-[11px] font-extrabold flex items-center gap-1 comic-shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Subir Audio MP3</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Mic, Square, Play, X, Sparkles, Check, Music2, ExternalLink } from 'lucide-react';
import { CustomFartRecord, saveCustomSound } from '../audio/customAudioStore';
import confetti from 'canvas-confetti';

interface AudioImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSoundAdded: (record: CustomFartRecord) => void;
}

export const AudioImportModal: React.FC<AudioImportModalProps> = ({
  isOpen,
  onClose,
  onSoundAdded,
}) => {
  const [tab, setTab] = useState<'upload' | 'record' | 'links'>('upload');
  const [soundName, setSoundName] = useState('');
  const [onomatopoeia, setOnomatopoeia] = useState('¡PRRRRRRT!');
  const [emoji, setEmoji] = useState('💨');
  const [dangerLevel, setDangerLevel] = useState<number>(4);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(1.2);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!soundName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setSoundName(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAudioDataUrl(result);

      // Measure duration
      const audio = new Audio(result);
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.round((audio.duration || 1.2) * 10) / 10);
      };
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setAudioDataUrl(result);
          if (!soundName) setSoundName('Mi Grabación Secreta');
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono. Por favor permite los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      setAudioDuration(Math.max(1, recordDuration));
    }
  };

  const playPreview = () => {
    if (!audioDataUrl) return;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    const audio = new Audio(audioDataUrl);
    previewAudioRef.current = audio;
    setIsPlayingPreview(true);
    audio.onended = () => setIsPlayingPreview(false);
    audio.play();
  };

  const handleSave = () => {
    if (!audioDataUrl) return;

    const newRecord: CustomFartRecord = {
      id: `custom_${Date.now()}`,
      name: soundName.trim() || 'Fart Epidemic Special',
      subtitle: 'Audio importado / personalizado',
      onomatopoeia: onomatopoeia || '¡BOOOM!',
      emoji: emoji || '💨',
      color: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-400 text-amber-950',
      borderCol: 'border-amber-600',
      dangerLevel: dangerLevel,
      dataUrl: audioDataUrl,
      duration: audioDuration,
      createdAt: Date.now(),
    };

    saveCustomSound(newRecord);
    onSoundAdded(newRecord);

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#ef4444', '#22c55e'],
    });

    onClose();
  };

  const emojisList = ['💨', '💣', '💩', '🎺', '💦', '💥', '🦆', '🦖', '🎈', '⚡'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white border-4 border-black comic-shadow-lg rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-yellow-300 border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <div>
              <h3 className="text-xl font-black text-black comic-font leading-none">
                IMPORTAR / GRABAR SONIDO
              </h3>
              <p className="text-xs text-amber-950 font-medium">
                Usa audios descargados de Epidemic Sound, Pixabay o graba tu voz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white border-2 border-black hover:bg-red-100 text-black comic-shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b-2 border-black bg-yellow-50 text-xs font-black">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-r border-black transition-colors ${
              tab === 'upload' ? 'bg-black text-yellow-300' : 'hover:bg-yellow-100 text-zinc-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Subir MP3 / WAV</span>
          </button>
          <button
            onClick={() => setTab('record')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-r border-black transition-colors ${
              tab === 'record' ? 'bg-black text-yellow-300' : 'hover:bg-yellow-100 text-zinc-700'
            }`}
          >
            <Mic className="w-4 h-4 text-red-400" />
            <span>Grabar Micrófono</span>
          </button>
          <button
            onClick={() => setTab('links')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'links' ? 'bg-black text-yellow-300' : 'hover:bg-yellow-100 text-zinc-700'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Bancos Gratuitos</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {tab === 'upload' && (
            <div className="space-y-4">
              <label className="border-3 border-dashed border-zinc-400 hover:border-black rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-50 hover:bg-yellow-50 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-xl">
                  📁
                </div>
                <span className="font-black text-sm text-zinc-900">
                  {audioDataUrl ? '✅ Archivo de audio cargado con éxito' : 'Toca para seleccionar un archivo MP3 o WAV'}
                </span>
                <span className="text-xs text-zinc-500 text-center">
                  Cualquier audio descargado de Epidemic Sound, Freesound, WhatsApp o tu móvil.
                </span>
              </label>
            </div>
          )}

          {tab === 'record' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-4 border-black flex items-center justify-center comic-shadow">
                {isRecording ? (
                  <span className="text-red-600 font-mono text-xl font-black animate-pulse">
                    {recordDuration}s
                  </span>
                ) : (
                  <Mic className="w-8 h-8 text-zinc-700" />
                )}
              </div>

              <div>
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-2xl border-3 border-black comic-shadow flex items-center gap-2 mx-auto uppercase text-sm"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Detener Grabación</span>
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl border-3 border-black comic-shadow comic-button flex items-center gap-2 mx-auto uppercase text-sm"
                  >
                    <Mic className="w-4 h-4 text-red-600" />
                    <span>Iniciar Grabación</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                Haz el sonido con la boca, un globo o una flatulencia real y se agregará a tu tablero.
              </p>
            </div>
          )}

          {tab === 'links' && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-zinc-600">
                Si buscas archivos de sonido de flatulencias listos para descargar y subir aquí sin pagar la suscripción de Epidemic Sound:
              </p>
              <div className="space-y-2">
                <a
                  href="https://pixabay.com/sound-effects/search/fart/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-lime-50 hover:bg-lime-100 transition-colors"
                >
                  <div>
                    <div className="font-extrabold text-sm text-zinc-900">Pixabay Farts (Gratis 100%)</div>
                    <div className="text-xs text-zinc-500">Descarga MP3 directa sin registro ni suscripción</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600" />
                </a>

                <a
                  href="https://freesound.org/search/?q=fart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <div>
                    <div className="font-extrabold text-sm text-zinc-900">Freesound.org (Comunidad)</div>
                    <div className="text-xs text-zinc-500">Miles de grabaciones reales y diseñadas (filtra por CC0)</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600" />
                </a>

                <div className="p-3 rounded-xl border-2 border-zinc-300 bg-zinc-50 text-xs text-zinc-600">
                  <span className="font-bold text-zinc-800 block mb-0.5">Nota sobre Epidemic Sound:</span>
                  Si ya tienes una cuenta de Epidemic Sound, descarga cualquier clip de su categoría &quot;Designed Farts&quot; y cárgalo en la pestaña &quot;Subir MP3/WAV&quot;.
                </div>
              </div>
            </div>
          )}

          {/* Audio Preview & Customization (Visible once audio is ready) */}
          {audioDataUrl && (
            <div className="bg-yellow-100/70 border-2 border-black rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900">Vista Previa de Audio</span>
                <button
                  onClick={playPreview}
                  className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-3 py-1 rounded-lg border border-black text-xs comic-shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{isPlayingPreview ? 'Reproduciendo...' : 'Escuchar Audio'}</span>
                </button>
              </div>

              {/* Name & Onomatopoeia input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-600 block mb-0.5">
                    Nombre del sonido:
                  </label>
                  <input
                    type="text"
                    value={soundName}
                    onChange={(e) => setSoundName(e.target.value)}
                    placeholder="Ej. Fart Epidemic Súper"
                    className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-600 block mb-0.5">
                    Onomatopeya (Grito cómic):
                  </label>
                  <input
                    type="text"
                    value={onomatopoeia}
                    onChange={(e) => setOnomatopoeia(e.target.value)}
                    placeholder="Ej. ¡KABOOOOOM!"
                    className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-900"
                  />
                </div>
              </div>

              {/* Emoji selector */}
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 block mb-1">
                  Elige un icono cómic:
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {emojisList.map((em) => (
                    <button
                      key={em}
                      onClick={() => setEmoji(em)}
                      className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center text-base transition-transform ${
                        emoji === em ? 'bg-yellow-400 scale-110' : 'bg-white hover:bg-zinc-100'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-100 border-t-2 border-black p-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-800 font-extrabold text-xs rounded-xl border-2 border-black"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!audioDataUrl}
            className={`px-5 py-2 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black comic-shadow flex items-center gap-1.5 ${
              audioDataUrl
                ? 'bg-red-500 hover:bg-red-400 text-white cursor-pointer comic-button'
                : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Guardar en mi Tablero</span>
          </button>
        </div>
      </div>
    </div>
  );
};

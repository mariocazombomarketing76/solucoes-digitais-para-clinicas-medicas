import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  Play,
  Pause,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Mic
} from 'lucide-react';
import heroReceptionistBg from '../src/assets/images/hero_receptionist_left_1795526882438.jpg';

interface HeroProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const WAVE_BARS = [
  24, 48, 72, 38, 86, 62, 95, 44, 78, 56, 92, 68,
  40, 84, 52, 90, 36, 70, 58, 82, 46, 66, 34, 50
];

const SAMPLE_LINES = [
  {
    speaker: 'Joana (IA de Voz)',
    role: 'joana',
    text: 'Boa tarde, ligou para a Clínica em Luanda. Fala a Joana. Em que especialidade deseja marcar a sua consulta?'
  },
  {
    speaker: 'Paciente',
    role: 'patient',
    text: 'Boa tarde Joana, queria marcar consulta de Cardiologia para amanhã de manhã.'
  },
  {
    speaker: 'Joana (IA de Voz)',
    role: 'joana',
    text: 'Com certeza! Tenho disponibilidade amanhã às 09h30 com o Dr. Manuel. Já confirmei no calendário e enviei o lembrete.'
  }
];

const Hero: React.FC<HeroProps> = () => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToDiagnostic = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleVoiceSample = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      if (audio.currentTime >= audio.duration - 0.1) {
        audio.currentTime = 0;
      }
      await audio.play();
    } catch {
      setIsPlayingSample(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlayingSample(true);
    const onPause = () => setIsPlayingSample(false);
    const onEnded = () => {
      setIsPlayingSample(false);
      setActiveLineIndex(0);
      setElapsedSeconds(0);
    };
    const onLoadedMetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDurationSeconds(Math.round(audio.duration));
      }
    };
    const onTimeUpdate = () => {
      const t = audio.currentTime;
      setElapsedSeconds(Math.floor(t));
      if (t < 5) {
        setActiveLineIndex(0);
      } else if (t < 9.5) {
        setActiveLineIndex(1);
      } else {
        setActiveLineIndex(2);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
    };
  }, []);

  const formatTimer = (sec: number) => {
    const s = String(Math.max(0, sec)).padStart(2, '0');
    return `00:${s}`;
  };

  return (
    <section className="relative bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      {/* Blurred Clinic Receptionist Background Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <img
          src={heroReceptionistBg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[25%_25%] scale-105 blur-[2.5px] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/62 via-white/50 to-white/25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 xl:gap-12">
          {/* Left Column: Value Proposition, Audio CTA & Primary Green CTA */}
          <motion.div
            className="lg:col-span-7 min-w-0 flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-bold text-[#004494] tracking-wide mb-4 [text-shadow:0_1px_6px_rgba(255,255,255,0.95)]">
              <span>Recepcionista Virtual de Voz com IA</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-[#196f2c]">Sotaque Natural em Português</span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display text-[2.25rem] sm:text-5xl lg:text-[3.35rem] font-extrabold text-slate-950 leading-[1.1] tracking-tight mb-5 text-balance [text-shadow:0_1px_12px_rgba(255,255,255,0.95)]">
              A sua Clínica nunca mais perde uma chamada.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 [text-shadow:0_1px_10px_rgba(255,255,255,0.95)]">
              A Joana, a nossa recepcionista virtual de Voz com IA, atende os seus pacientes 24/7, marca consultas diretamente no seu calendário e fala em português com a simpatia de Angola.
            </p>

            {/* Primary Green CTA + Elegant Audio Sample Button */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <button
                type="button"
                onClick={scrollToDiagnostic}
                className="w-full sm:w-auto max-w-full inline-flex items-center justify-center px-5 xl:px-6 py-3.5 bg-[#28a745] hover:bg-[#218838] text-white text-sm sm:text-base font-bold rounded-xl shadow-md shadow-[#28a745]/25 transition-all duration-150 gap-2 whitespace-nowrap cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 shrink-0" />
                <span>Agendar Demonstração Gratuita</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoiceSample}
                aria-pressed={isPlayingSample}
                className={`w-full sm:w-auto max-w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold border transition-all duration-150 gap-2 whitespace-nowrap cursor-pointer ${
                  isPlayingSample
                    ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-md'
                    : 'bg-white/95 backdrop-blur-sm text-[#0056b3] border-[#bfdbfe] hover:border-[#0056b3] hover:bg-[#eff6ff] shadow-sm'
                }`}
              >
                {isPlayingSample ? (
                  <>
                    <Pause className="w-4 h-4 fill-current shrink-0" />
                    <span>Pausar amostra da Joana</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>🔊 Ouvir amostra da Joana (15s)</span>
                  </>
                )}
              </button>
            </div>

            {/* Clean Typographic Proof Strip */}
            <div className="pt-5 border-t border-white/40 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs sm:text-sm text-white font-semibold [text-shadow:0_1px_6px_rgba(15,23,42,0.9),0_0_2px_rgba(15,23,42,0.85)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-200 shrink-0 drop-shadow-[0_1px_3px_rgba(15,23,42,0.9)]" />
                <span>Atendimento 24/7 por Voz</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-300 shrink-0 drop-shadow-[0_1px_3px_rgba(15,23,42,0.9)]" />
                <span>Sincronização Google Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-200 shrink-0 drop-shadow-[0_1px_3px_rgba(15,23,42,0.9)]" />
                <span>Voz Neural PT-AO</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Voice Call Console & Real HTML5 Audio Player */}
          <motion.div
            className="lg:col-span-5 min-w-0 flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between">
              <div>
                {/* Call Top Metadata */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0056b3]/25 border border-[#0056b3]/50 flex items-center justify-center text-blue-300 shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white leading-tight">
                        Joana · Recepcionista de Voz
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isPlayingSample ? 'A reproduzir amostra de voz (15s)' : 'Amostra de atendimento telefónico'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#28a745] font-semibold">
                    {formatTimer(elapsedSeconds)} / {formatTimer(durationSeconds)}
                  </span>
                </div>

                {/* Audio Waveform + Real HTML5 <audio> Player */}
                <div className="my-5 bg-slate-950/85 border border-slate-800 rounded-xl px-4 py-4 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Áudio Neural da Joana (PT-AO)</span>
                    <button
                      type="button"
                      onClick={handleToggleVoiceSample}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      {isPlayingSample ? 'Pausar' : 'Reproduzir'}
                    </button>
                  </div>

                  <div
                    className="h-12 flex items-center justify-between gap-1"
                    aria-label="Ondas sonoras da voz da Joana"
                  >
                    {WAVE_BARS.map((heightPct, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 rounded-full origin-center ${
                          isPlayingSample
                            ? i % 3 === 0
                              ? 'bg-[#28a745]'
                              : 'bg-blue-400'
                            : 'bg-blue-500/45'
                        }`}
                        style={{ height: `${heightPct}%` }}
                        animate={
                          isPlayingSample
                            ? {
                                scaleY: [0.35, 1.05, 0.45, 0.9, 0.35],
                                opacity: [0.7, 1, 0.75, 1, 0.7]
                              }
                            : {
                                scaleY: [0.65, 0.85, 0.65],
                                opacity: 0.55
                              }
                        }
                        transition={{
                          duration: isPlayingSample ? 0.8 + (i % 5) * 0.14 : 2.6,
                          repeat: Infinity,
                          delay: i * 0.05,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>

                  <audio
                    ref={audioRef}
                    controls
                    preload="metadata"
                    src="/amostra_joana.mp3"
                    aria-label="Ouvir amostra da Joana (15s)"
                    className="w-full h-9 rounded-lg"
                  >
                    O seu navegador não suporta a reprodução de áudio HTML5.
                  </audio>
                </div>

                {/* Synchronized Call Transcript */}
                <div className="space-y-2.5 text-xs">
                  {SAMPLE_LINES.map((line, idx) => {
                    const isActive = isPlayingSample && activeLineIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-colors duration-200 ${
                          isActive
                            ? 'bg-slate-800 border-[#28a745] text-white'
                            : line.role === 'joana'
                              ? 'bg-slate-800/50 border-slate-800 text-slate-200'
                              : 'bg-slate-900 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <span
                          className={`block text-[11px] font-semibold mb-1 ${
                            line.role === 'joana' ? 'text-emerald-400' : 'text-blue-300'
                          }`}
                        >
                          {line.speaker}
                        </span>
                        <p className="leading-relaxed">"{line.text}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Google Calendar Sync Confirmation Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Marcado no Google Calendar</span>
                </div>
                <span className="font-mono tabular-nums text-slate-400">
                  Amanhã · 09:30
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
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
  Bot
} from 'lucide-react';
import heroReceptionistBg from '../src/assets/images/hero_receptionist_left_1795526882438.jpg';

interface HeroProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const WAVE_BAR_HEIGHTS = [
  'h-3', 'h-6', 'h-9', 'h-5', 'h-11', 'h-8', 'h-12', 'h-6',
  'h-10', 'h-7', 'h-12', 'h-8', 'h-5', 'h-10', 'h-7', 'h-11',
  'h-4', 'h-9', 'h-7', 'h-10', 'h-6', 'h-8', 'h-4', 'h-6'
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

          {/* Right Column: Futuristic Metallic Robotic Voice Console */}
          <motion.div
            className="lg:col-span-5 min-w-0 flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Outer Machined Chrome / Anodized Titanium Bezel */}
            <div className="h-full rounded-3xl p-[2px] bg-gradient-to-br from-slate-200 via-slate-500 to-slate-800 shadow-[0_24px_60px_-14px_rgba(0,86,179,0.42),0_0_28px_rgba(34,211,238,0.16)]">
              <div className="relative h-full rounded-[22px] bg-gradient-to-b from-[#1e293b] via-[#0b1322] to-[#050912] text-white p-5 sm:p-6 flex flex-col justify-between overflow-hidden border-t border-white/25">
                {/* Brushed Metal Specular Sheen & Subtle Circuit Grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.08)_0%,transparent_38%,rgba(56,189,248,0.05)_65%,transparent_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-cyan-400/10 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-[#28a745]/10 blur-3xl"
                />

                {/* 4 Precision Machined Metallic Corner Rivets */}
                <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-inner" />

                <div className="relative z-10">
                  {/* Robotic Core Top Header */}
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-600/45">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Animated Robotic Acoustic Core Medallion */}
                      <div className="relative w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-br from-slate-100 via-cyan-400/80 to-slate-700 shadow-[0_0_20px_rgba(34,211,238,0.28)] shrink-0">
                        <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            aria-hidden="true"
                            className="absolute inset-1 rounded-xl border border-dashed border-cyan-400/45"
                            animate={isPlayingSample ? { rotate: 360 } : { rotate: 0 }}
                            transition={
                              isPlayingSample
                                ? { duration: 8, repeat: Infinity, ease: 'linear' }
                                : { duration: 0.4 }
                            }
                          />
                          <Bot className={`w-5 h-5 relative z-10 transition-colors duration-200 ${isPlayingSample ? 'text-cyan-300' : 'text-blue-200'}`} />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                          Joana · Recepcionista de Voz
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5 truncate">
                          {isPlayingSample ? 'A reproduzir amostra de voz (15s)' : 'Amostra de atendimento telefónico'}
                        </p>
                      </div>
                    </div>

                    {/* Machined Steel Timer Plate */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-500/50 shadow-[inset_0_1px_4px_rgba(0,0,0,0.85)] shrink-0">
                      <span className="font-mono text-xs tabular-nums text-emerald-400 font-semibold tracking-wider">
                        {formatTimer(elapsedSeconds)} / {formatTimer(durationSeconds)}
                      </span>
                    </div>
                  </div>

                  {/* Recessed Metallic Acoustic Chamber + HTML5 <audio> Player */}
                  <div className="my-5 rounded-2xl p-[1px] bg-gradient-to-b from-slate-500/50 via-slate-700/40 to-slate-800/80 shadow-lg">
                    <div className="relative rounded-[15px] bg-gradient-to-b from-[#040812] via-[#091224] to-[#0c182d] px-4 py-4 space-y-4 overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)]">
                      {/* Precision Acoustic Grid */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:18px_18px]"
                      />

                      <div className="relative z-10 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-cyan-200/90 tracking-wide">
                          Áudio Neural da Joana (PT-AO)
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleVoiceSample}
                          className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-500/50 text-emerald-300 hover:text-emerald-200 font-semibold transition-colors cursor-pointer"
                        >
                          {isPlayingSample ? 'Pausar' : 'Reproduzir'}
                        </button>
                      </div>

                      {/* Glowing Metallic Equalizer Bars */}
                      <div
                        className="relative z-10 h-14 flex items-center justify-between gap-1 px-1"
                        aria-label="Ondas sonoras da voz da Joana"
                      >
                        {WAVE_BAR_HEIGHTS.map((heightClass, i) => (
                          <motion.div
                            key={i}
                            className={`flex-1 rounded-full origin-center ${heightClass} ${
                              isPlayingSample
                                ? i % 3 === 0
                                  ? 'bg-gradient-to-t from-emerald-600 via-[#28a745] to-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.55)]'
                                  : 'bg-gradient-to-t from-[#0056b3] via-cyan-400 to-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                                : 'bg-gradient-to-t from-slate-700 via-cyan-500/45 to-blue-300/60'
                            }`}
                            animate={
                              isPlayingSample
                                ? {
                                    scaleY: [0.35, 1.08, 0.45, 0.92, 0.35],
                                    opacity: [0.75, 1, 0.8, 1, 0.75]
                                  }
                                : {
                                    scaleY: [0.65, 0.88, 0.65],
                                    opacity: 0.6
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

                      {/* Recessed Brushed-Alloy Deck for HTML5 Audio */}
                      <div className="relative z-10 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-950/90 border border-slate-500/45 p-1.5 shadow-inner">
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
                    </div>
                  </div>

                  {/* Brushed-Metal Robotic Transcript Plates */}
                  <div className="space-y-2.5 text-xs">
                    {SAMPLE_LINES.map((line, idx) => {
                      const isActive = isPlayingSample && activeLineIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border border-l-2 transition-all duration-200 shadow-sm ${
                            isActive
                              ? 'bg-gradient-to-r from-slate-800/95 via-slate-800/85 to-emerald-950/60 border-slate-500/60 border-l-[#28a745] text-white shadow-[0_0_18px_rgba(40,167,69,0.22)]'
                              : line.role === 'joana'
                                ? 'bg-gradient-to-r from-slate-800/75 to-slate-900/85 border-slate-600/45 border-l-cyan-400/70 text-slate-200'
                                : 'bg-slate-900/85 border-slate-700/55 border-l-blue-400/60 text-slate-300'
                          }`}
                        >
                          <span
                            className={`block text-[11px] font-semibold tracking-wide mb-1 ${
                              line.role === 'joana' ? 'text-cyan-300' : 'text-blue-300'
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

                {/* Brushed Titanium Confirmation Plate */}
                <div className="relative z-10 mt-5 rounded-xl px-4 py-3 bg-gradient-to-r from-slate-800/90 via-slate-900/95 to-slate-800/90 border border-slate-500/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.45)]" />
                    <span>Marcado no Google Calendar</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-600/50">
                    Amanhã · 09:30
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
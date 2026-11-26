import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PhoneCall,
  Play,
  Pause,
  Calendar,
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
    text: 'Boa tarde, ligou para a Clínica Saúde e Vida. Fala a Joana de Sousa. Em que especialidade deseja marcar a sua consulta?'
  },
  {
    speaker: 'Paciente',
    role: 'patient',
    text: 'Boa tarde, Joana. Queria marcar uma consulta de Cardiologia para amanhã de manhã.'
  },
  {
    speaker: 'Joana (IA de Voz)',
    role: 'joana',
    text: 'Com certeza! Tenho disponibilidade amanhã às 09h30. Vou confirmar já a sua marcação no calendário da clínica.'
  }
];

const RESTING_3D_TILT = { x: 4, y: -8 };

const Hero: React.FC<HeroProps> = () => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [tilt, setTilt] = useState(RESTING_3D_TILT);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      x: Number((-ny * 7.5).toFixed(2)),
      y: Number((nx * 9.5 - 2).toFixed(2))
    });
  };

  const handleCardMouseLeave = () => {
    setTilt(RESTING_3D_TILT);
  };

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

    if (widgetRef.current) {
      widgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    try {
      if (audio.duration && Number.isFinite(audio.duration) && audio.currentTime >= audio.duration - 0.1) {
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

    const syncDuration = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDurationSeconds(Math.round(audio.duration));
      }
    };
    const onPlay = () => setIsPlayingSample(true);
    const onPause = () => setIsPlayingSample(false);
    const onEnded = () => {
      setIsPlayingSample(false);
      setActiveLineIndex(0);
      setElapsedSeconds(0);
    };
    const onTimeUpdate = () => {
      const t = audio.currentTime;
      const total = audio.duration && Number.isFinite(audio.duration) ? audio.duration : durationSeconds;
      setElapsedSeconds(Math.floor(t));
      const ratio = total > 0 ? t / total : 0;
      if (ratio < 0.38) {
        setActiveLineIndex(0);
      } else if (ratio < 0.66) {
        setActiveLineIndex(1);
      } else {
        setActiveLineIndex(2);
      }
    };

    if (audio.readyState >= 1) {
      syncDuration();
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('durationchange', syncDuration);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', syncDuration);
      audio.removeEventListener('durationchange', syncDuration);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
    };
  }, []);

  const formatTimer = (sec: number) => {
    const safeSec = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(safeSec / 60)).padStart(2, '0');
    const s = String(safeSec % 60).padStart(2, '0');
    return `${m}:${s}`;
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
                className={`w-full sm:w-auto max-w-full inline-flex items-center justify-center px-4 sm:px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold border transition-all duration-150 gap-2 whitespace-nowrap cursor-pointer ${
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
                    <span>🔊 Ouvir amostra da Joana (30s)</span>
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

          {/* Right Column: 3D Volumetric Futuristic Metallic Robotic Voice Console */}
          <motion.div
            id="joana-audio-widget"
            ref={widgetRef}
            className="lg:col-span-5 min-w-0 flex flex-col [perspective:1400px] py-2 lg:pr-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Interactive 3D Preserved Chassis */}
            <motion.div
              className="relative h-full [transform-style:preserve-3d]"
              animate={{
                rotateX: shouldReduceMotion ? 3 : tilt.x,
                rotateY: shouldReduceMotion ? -6 : tilt.y
              }}
              transition={{ type: 'spring', stiffness: 210, damping: 24, mass: 0.9 }}
            >
              {/* 3D Floating Floor Cast Shadow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 rounded-3xl bg-slate-950/60 blur-2xl [transform:translateZ(-36px)_translateX(18px)_translateY(26px)]"
              />

              {/* 3D Extruded Back Titanium Slab (Deep Hardware Thickness) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-500 via-slate-700 to-slate-950 border-r-2 border-b-2 border-slate-950 shadow-2xl [transform:translateZ(-16px)_translateX(11px)_translateY(12px)]"
              />

              {/* 3D Mid-Step Milled Steel Bevel */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 border-r border-b border-slate-900 [transform:translateZ(-8px)_translateX(5.5px)_translateY(6px)]"
              />

              {/* Front Machined Chrome / Anodized Titanium Bezel (z=0) */}
              <div className="relative h-full rounded-3xl p-[2.5px] bg-gradient-to-br from-white via-slate-400 to-slate-800 border-t border-l border-white/80 shadow-[0_24px_50px_-14px_rgba(0,86,179,0.45),0_0_28px_rgba(34,211,238,0.18)] [transform-style:preserve-3d]">
                <div className="relative h-full rounded-[21.5px] bg-gradient-to-b from-[#1e293b] via-[#0b1322] to-[#050912] text-white p-5 sm:p-6 flex flex-col justify-between [transform-style:preserve-3d]">
                  {/* Clipped Metallic Sheen & Ambient Glow Background Layer (kept separate so preserve-3d stays active) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[21.5px] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_36%,rgba(56,189,248,0.06)_65%,transparent_100%)]" />
                    <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-[#28a745]/15 blur-3xl" />
                    <div className="absolute inset-0 border-t border-white/25 rounded-[21.5px]" />
                  </div>

                  {/* 4 Precision Machined Metallic Corner Rivets (Raised on Z-axis) */}
                  <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-md [transform:translateZ(10px)]" />
                  <span aria-hidden="true" className="pointer-events-none absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-md [transform:translateZ(10px)]" />
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-md [transform:translateZ(10px)]" />
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-700 ring-1 ring-slate-950/90 shadow-md [transform:translateZ(10px)]" />

                  <div className="relative z-10 [transform-style:preserve-3d]">
                    {/* Robotic Core Top Header (Elevated in 3D) */}
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-600/45 [transform:translateZ(20px)]">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Animated Robotic Acoustic Core Medallion (Popped Higher) */}
                        <div className="relative w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-br from-white via-cyan-300/85 to-slate-700 shadow-[0_10px_22px_rgba(0,0,0,0.6),0_0_20px_rgba(34,211,238,0.3)] shrink-0 [transform:translateZ(10px)]">
                          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center relative overflow-hidden">
                            <motion.div
                              aria-hidden="true"
                              className="absolute inset-1 rounded-xl border border-dashed border-cyan-400/50"
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

                        <div className="min-w-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)]">
                          <p className="font-display font-bold text-sm sm:text-[15px] text-white tracking-tight leading-snug">
                            Joana de Sousa · Recepcionista Virtual
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
                            Amostra de atendimento telefónico · Clínica Saúde e Vida
                          </p>
                        </div>
                      </div>

                      {/* Machined Steel Timer Plate */}
                      <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-500/60 shadow-[0_8px_16px_rgba(0,0,0,0.55),inset_0_1px_4px_rgba(0,0,0,0.85)] shrink-0">
                        <span className="font-mono text-[11px] sm:text-xs tabular-nums text-emerald-400 font-semibold tracking-wider">
                          {formatTimer(elapsedSeconds)} / {formatTimer(durationSeconds)}
                        </span>
                      </div>
                    </div>

                    {/* 3D Floating Metallic Acoustic Chamber + HTML5 <audio> Player */}
                    <div className="my-5 rounded-2xl p-[1.5px] bg-gradient-to-b from-slate-300/65 via-slate-600/50 to-slate-900 shadow-[0_18px_30px_-8px_rgba(0,0,0,0.82)] [transform:translateZ(28px)]">
                      <div className="relative rounded-[14.5px] bg-gradient-to-b from-[#040812] via-[#091224] to-[#0c182d] px-4 py-4 space-y-4 overflow-hidden shadow-[inset_0_3px_14px_rgba(0,0,0,0.9)]">
                        {/* Precision Acoustic Grid */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.07)_1px,transparent_1px)] bg-[size:18px_18px]"
                        />

                        <div className="relative z-10 flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-medium text-cyan-200/95 tracking-wide">
                            Áudio Neural de Joana (PT-AO)
                          </span>
                          <button
                            type="button"
                            onClick={handleToggleVoiceSample}
                            className="px-2.5 py-1 rounded-md bg-slate-800/95 hover:bg-slate-700 border border-slate-500/60 text-emerald-300 hover:text-emerald-200 font-semibold transition-colors shadow-sm cursor-pointer"
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
                        <div className="relative z-10 rounded-xl bg-gradient-to-b from-slate-800/85 to-slate-950/95 border border-slate-500/50 p-1.5 shadow-inner">
                          <audio
                            ref={audioRef}
                            controls
                            preload="metadata"
                            src="/amostra_joana.mp3"
                            aria-label="Ouvir amostra da Joana (30s)"
                            className="w-full h-9 rounded-lg"
                          >
                            O seu navegador não suporta a reprodução de áudio HTML5.
                          </audio>
                        </div>
                      </div>
                    </div>

                    {/* 3D Layered Brushed-Metal Transcript Plates */}
                    <div className="space-y-2.5 text-[11.5px] sm:text-xs [transform-style:preserve-3d]">
                      {SAMPLE_LINES.map((line, idx) => {
                        const isActive = isPlayingSample && activeLineIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border border-l-2 transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-slate-800/95 via-slate-800/85 to-emerald-950/60 border-slate-400/70 border-l-[#28a745] text-white shadow-[0_14px_24px_-6px_rgba(0,0,0,0.75),0_0_20px_rgba(40,167,69,0.28)] [transform:translateZ(26px)]'
                                : line.role === 'joana'
                                  ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/90 border-slate-600/50 border-l-cyan-400/75 text-slate-200 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.65)] [transform:translateZ(14px)]'
                                  : 'bg-slate-900/90 border-slate-700/60 border-l-blue-400/65 text-slate-300 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.65)] [transform:translateZ(14px)]'
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

                  {/* Discrete Transparency Line */}
                  <p className="relative z-10 mt-4 pt-3 border-t border-slate-700/45 text-center text-[10.5px] text-slate-400/90 leading-snug [transform:translateZ(12px)]">
                    Demonstração do fluxo de marcação com IA de voz.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
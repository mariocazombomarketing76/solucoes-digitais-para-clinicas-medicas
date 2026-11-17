import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  Volume2,
  Square,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Mic
} from 'lucide-react';

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
    text: 'Boa tarde, ligou para a Clínica Vida Mais em Luanda. Fala a Joana. Em que especialidade deseja marcar a sua consulta?'
  },
  {
    speaker: 'Paciente',
    role: 'patient',
    text: 'Boa tarde Joana, queria marcar consulta de Cardiologia para amanhã de manhã.'
  },
  {
    speaker: 'Joana (IA de Voz)',
    role: 'joana',
    text: 'Com certeza! Tenho disponibilidade amanhã às 09h30 com o Dr. Manuel. Já confirmei no calendário e enviei o seu lembrete automático.'
  }
];

const Hero: React.FC<HeroProps> = () => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scrollToDiagnostic = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stopSample = () => {
    setIsPlayingSample(false);
    setActiveLineIndex(0);
    setElapsedSeconds(0);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.14);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const speakSequence = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('pt-pt')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('pt')) ||
      null;

    SAMPLE_LINES.forEach((line, idx) => {
      const utterance = new SpeechSynthesisUtterance(line.text);
      if (ptVoice) utterance.voice = ptVoice;
      utterance.lang = 'pt-PT';
      utterance.rate = line.role === 'joana' ? 1.02 : 0.96;
      utterance.pitch = line.role === 'joana' ? 1.08 : 0.9;
      utterance.onstart = () => {
        setActiveLineIndex(idx);
      };
      if (idx === SAMPLE_LINES.length - 1) {
        utterance.onend = () => {
          stopSample();
        };
      }
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleToggleVoiceSample = () => {
    if (isPlayingSample) {
      stopSample();
      return;
    }

    playChime();
    setIsPlayingSample(true);
    setActiveLineIndex(0);
    setElapsedSeconds(1);

    speakSequence();

    // Backup timer so visual waveform & dialogue stay synchronized even if speechSynthesis voices aren't installed
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next === 7) setActiveLineIndex(1);
        if (next === 12) setActiveLineIndex(2);
        if (next >= 20) {
          stopSample();
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTimer = (sec: number) => {
    const s = String(sec).padStart(2, '0');
    return `00:${s}`;
  };

  return (
    <section className="bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-10 lg:gap-12">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Clean Unboxed Kicker (Zero-Pill Discipline) */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold text-blue-700 tracking-wide mb-4">
              <span>Recepcionista Virtual de Voz com IA</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700">Sotaque Natural PT-AO</span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display text-[2.25rem] sm:text-5xl lg:text-[3.35rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5 text-balance">
              A sua Clínica nunca mais perde uma chamada.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              A Joana, a nossa recepcionista virtual de Voz com IA, atende os seus pacientes 24/7, marca consultas diretamente no seu calendário e fala com o sotaque e a simpatia de Angola. Sem faltas, sem esperas, sem custos de funcionário extra.
            </p>

            {/* Primary & Voice Sample Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-8">
              <button
                type="button"
                onClick={scrollToDiagnostic}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-150 gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 shrink-0" />
                <span>Agendar Demonstração de Voz Gratuita</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoiceSample}
                aria-pressed={isPlayingSample}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold border transition-all duration-150 gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  isPlayingSample
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-blue-600 hover:text-blue-700'
                }`}
              >
                {isPlayingSample ? (
                  <>
                    <Square className="w-4 h-4 fill-current text-emerald-400 shrink-0" />
                    <span>Parar Amostra da Joana</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-blue-700 shrink-0" />
                    <span>Ouvir Amostra da Joana</span>
                  </>
                )}
              </button>
            </div>

            {/* Clean Typographic Proof Strip */}
            <div className="pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Atendimento Telefónico 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Integração Google Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Voz Neural PT-AO</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Voice Call Console & Audio Waveform */}
          <motion.div
            className="lg:col-span-5 flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between">
              {/* Call Top Metadata */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white leading-tight">
                        Joana · Recepcionista de Voz
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isPlayingSample ? 'Chamada em reprodução' : 'Simulação de atendimento real'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-emerald-400 font-medium">
                    {isPlayingSample ? formatTimer(elapsedSeconds) : '00:20'}
                  </span>
                </div>

                {/* Audio Waveform Visualizer */}
                <div className="my-5 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                    <span>Canal de Voz Neural (PT-AO)</span>
                    <button
                      type="button"
                      onClick={handleToggleVoiceSample}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      {isPlayingSample ? 'Pausar áudio' : 'Reproduzir chamada'}
                    </button>
                  </div>

                  <div
                    className="h-16 flex items-center justify-between gap-1"
                    aria-label="Ondas sonoras da voz da Joana"
                  >
                    {WAVE_BARS.map((heightPct, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 rounded-full origin-center ${
                          isPlayingSample
                            ? i % 3 === 0
                              ? 'bg-emerald-400'
                              : 'bg-blue-400'
                            : 'bg-blue-500/50'
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
                            ? 'bg-slate-800 border-emerald-500/60 text-white'
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
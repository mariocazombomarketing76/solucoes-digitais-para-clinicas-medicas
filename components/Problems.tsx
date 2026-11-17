import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  PhoneMissed,
  PhoneIncoming,
  CalendarX2,
  BellRing,
  UserX,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

const comparisons = [
  {
    problemTitle: 'Chamadas perdidas no horário de almoço?',
    solutionTitle: 'A Joana atende 24 horas por dia, 7 dias por semana.',
    solutionDetail:
      'Atendimento telefónico imediato mesmo fora de horas, fins de semana e picos na receção — sem espera e com sotaque natural de Angola.',
    problemIcon: PhoneMissed,
    solutionIcon: PhoneIncoming
  },
  {
    problemTitle: 'Pacientes que marcam e não aparecem?',
    solutionTitle: 'Lembretes automáticos por voz e WhatsApp 24h e 2h antes da consulta.',
    solutionDetail:
      'Confirmação ativa antes da consulta para libertar vagas a tempo e eliminar horas vazias na agenda dos médicos.',
    problemIcon: CalendarX2,
    solutionIcon: BellRing
  },
  {
    problemTitle: 'Falta de follow-up?',
    solutionTitle: 'A Joana liga 24h depois para saber se o paciente foi bem atendido e pedir feedback.',
    solutionDetail:
      'Acompanhamento humanizado pós-consulta que fideliza o paciente e fortalece a reputação da sua clínica.',
    problemIcon: UserX,
    solutionIcon: HeartHandshake
  }
];

const Problems: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="solucao-voz"
      ref={ref}
      className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-3">
            O Problema vs A Nossa Solução de Voz
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Da chamada perdida à consulta confirmada no calendário
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Substituímos filas de espera telefónicas e faltas por atendimento de voz contínuo integrado à agenda da clínica.
          </p>
        </motion.div>

        {/* Problem -> Voice Solution Pairs */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {comparisons.map((item, index) => {
            const ProblemIcon = item.problemIcon;
            const SolutionIcon = item.solutionIcon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch"
              >
                {/* Problem Side */}
                <div className="md:col-span-5 p-6 bg-slate-50/90 border-b md:border-b-0 md:border-r border-slate-200/80 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                    <ProblemIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 block mb-1">
                      Problema Atual
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.problemTitle}
                    </h3>
                  </div>
                </div>

                {/* Middle Connector */}
                <div className="hidden md:flex md:col-span-1 items-center justify-center bg-white text-blue-600">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Voice Solution Side */}
                <div className="md:col-span-6 p-6 bg-white flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <SolutionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
                      Solução Joana IA de Voz
                    </span>
                    <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1.5">
                      {item.solutionTitle}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.solutionDetail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problems;
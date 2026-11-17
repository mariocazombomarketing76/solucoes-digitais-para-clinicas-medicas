import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PhoneIncoming, CalendarCheck2, HeartHandshake } from 'lucide-react';

const lifecycleCards = [
  {
    title: 'Atendimento 24/7 por Voz',
    description: 'A Joana atende, identifica a especialidade e marca em tempo real.',
    icon: PhoneIncoming,
    iconWrap: 'bg-[#eff6ff] text-[#0056b3] border-[#bfdbfe]'
  },
  {
    title: "Fim dos 'No-Shows'",
    description: 'Lembretes automáticos por voz e WhatsApp 24h e 2h antes da consulta.',
    icon: CalendarCheck2,
    iconWrap: 'bg-[#ecfdf5] text-[#28a745] border-[#bbf7d0]'
  },
  {
    title: 'Follow-up e Fidelização',
    description: 'A Joana contacta 24h depois para saber se o paciente foi bem atendido e pedir feedback.',
    icon: HeartHandshake,
    iconWrap: 'bg-[#eff6ff] text-[#0056b3] border-[#bfdbfe]'
  }
];

const Problems: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="ciclo-vida"
      ref={ref}
      className="py-16 md:py-24 bg-[#f8fafc] border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0056b3] mb-3">
            Automação Completa da Clínica
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            O Ciclo de Vida do Paciente
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Do primeiro toque do telefone até ao acompanhamento pós-consulta, a Joana garante uma experiência clínica sem falhas.
          </p>
        </motion.div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {lifecycleCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-7 flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${card.iconWrap}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5 leading-snug">
                  {card.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problems;
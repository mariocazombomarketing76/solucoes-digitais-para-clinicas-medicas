import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AudioLines, CalendarClock, ShieldCheck } from 'lucide-react';

const techPillars = [
  {
    title: 'Voz Neural Natural (PT-AO)',
    description:
      'Entoação fluida, pausas naturais e compreensão imediata com o sotaque e a simpatia de Angola e Portugal — sem soar robótico.',
    icon: AudioLines,
    color: 'text-blue-700 bg-blue-50 border-blue-100'
  },
  {
    title: 'Sincronização em Tempo Real com Google Calendar',
    description:
      'Cada marcação, remarcação ou cancelamento feito por chamada aparece instantaneamente no calendário oficial dos médicos.',
    icon: CalendarClock,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-100'
  },
  {
    title: 'Segurança de Dados de Saúde',
    description:
      'Ligações encriptadas, acesso restrito aos dados de agendamento e conformidade institucional com contrato formal em Angola.',
    icon: ShieldCheck,
    color: 'text-blue-700 bg-blue-50 border-blue-100'
  }
];

const WhyChooseUs: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="tecnologia"
      ref={ref}
      className="py-16 md:py-24 bg-white border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Highlighted Trust & Technology Block */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-slate-900 text-white rounded-2xl p-8 md:p-10 mb-10 border border-slate-800 shadow-lg"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            Confiança e Tecnologia
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug text-white text-balance">
            Tecnologia de Ponta: Voz Neural Natural (PT-AO), Sincronização em Tempo Real com Google Calendar, e Segurança de Dados de Saúde.
          </h2>
        </motion.div>

        {/* 3 Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {techPillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-slate-50/80 p-7 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${pillar.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

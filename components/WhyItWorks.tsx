import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PhoneCall, AudioWaveform, CalendarCheck2 } from 'lucide-react';

const processSteps = [
  {
    step: '01',
    title: 'O paciente liga para o número habitual da sua clínica.',
    desc: 'Sem necessidade de mudar o número de telefone existente ou alterar os hábitos dos seus pacientes.',
    icon: PhoneCall
  },
  {
    step: '02',
    title: 'A Joana (IA de Voz) conversa naturalmente, identifica a especialidade e consulta a agenda em tempo real.',
    desc: 'Compreende o pedido em português natural de Angola, verifica disponibilidade imediata e propõe os melhores horários.',
    icon: AudioWaveform
  },
  {
    step: '03',
    title: 'A consulta fica marcada no Google Calendar da clínica e o paciente recebe um lembrete automático.',
    desc: 'A receção acompanha tudo em tempo real no calendário e o paciente recebe confirmação e lembretes por voz e WhatsApp.',
    icon: CalendarCheck2
  }
];

const WhyItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="processo"
      ref={ref}
      className="py-16 md:py-24 bg-white overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0056b3] mb-3">
            Como Funciona
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Do toque do telefone ao agendamento confirmado em segundos
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Integração direta com o número da sua clínica e com o Google Calendar em três passos simples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-[#f8fafc] p-7 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0056b3] text-white flex items-center justify-center shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      Passo {step.step}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
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

export default WhyItWorks;
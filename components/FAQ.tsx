import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 'preco',
    question: 'Quanto custa e o que inclui cada plano?',
    answer:
      'Temos três planos em Kwanza: o Plano STARTER por 49.900 Kz/mês (1 especialidade, agendamento de voz 24/7 e lembretes automáticos), o Plano CLÍNICA por 99.900 Kz/mês (até 5 especialidades, follow-up pós-consulta e gestão automática de faltas) e o Plano ENTERPRISE por 189.900 Kz/mês (redes de clínicas, campanhas voz/SMS, API dedicada e gestor de conta). Aplicamos uma taxa única de configuração e onboarding de 75.000 Kz.'
  },
  {
    id: 'sotaque',
    question: 'A voz da Joana parece robótica ou fala naturalmente português de Angola?',
    answer:
      'A Joana utiliza tecnologia de Voz Neural Natural (PT-AO) treinada para conversar com entoação natural, simpatia e expressões habituais de Angola e Portugal, conduzindo o agendamento como uma recepcionista experiente.'
  },
  {
    id: 'calendario',
    question: 'Como funciona a ligação com o calendário da clínica?',
    answer:
      'A Joana sincroniza em tempo real com o Google Calendar dos médicos e especialidades da clínica. Quando um paciente liga e escolhe um horário livre, o evento fica imediatamente registado no calendário sem duplicações.'
  },
  {
    id: 'numero',
    question: 'Preciso de mudar o número de telefone habitual da clínica?',
    answer:
      'Não. O paciente continua a ligar para o número habitual da sua clínica. Configuramos o encaminhamento inteligente para que a Joana atenda chamadas fora de horas, no horário de almoço ou quando todas as linhas da receção estiverem ocupadas — ou 24/7.'
  },
  {
    id: 'faltas',
    question: 'Como a Joana reduz as faltas e faz o acompanhamento?',
    answer:
      'Além de confirmar a consulta na chamada, o sistema envia lembretes automáticos por voz e WhatsApp 24h e 2h antes da consulta. Nos planos Clínica e Enterprise, a Joana também liga 24h após o atendimento para recolher feedback de satisfação.'
  },
  {
    id: 'seguranca',
    question: 'Os dados dos pacientes e das chamadas estão seguros?',
    answer:
      'Sim. Todas as comunicações utilizam encriptação segura, recolhendo apenas o necessário para a marcação clínica (nome, contacto, especialidade e horário), em conformidade com o contrato formal celebrado pela Mario Cazombo e Filhos, Lda.'
  }
];

interface FAQProps {
  contactLink?: string;
}

const FAQ: React.FC<FAQProps> = ({
  contactLink = 'https://wa.me/message/5LQTAOWAHBXLG1'
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      id="perguntas"
      ref={ref}
      className="bg-slate-50/70 py-16 md:py-24 border-t border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-3">
            Perguntas Frequentes
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Dúvidas sobre a Recepcionista Virtual de Voz
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Respostas claras sobre o funcionamento da Joana, integração com o calendário e contratação.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndices.includes(index);
            const questionNumber = (index + 1).toString().padStart(2, '0');

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-150 border ${
                  isOpen
                    ? 'bg-white border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between text-left p-5 sm:p-6 gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums px-2 py-1 rounded ${
                        isOpen
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {questionNumber}
                    </span>
                    <span
                      className={`font-display text-base sm:text-lg font-bold ${
                        isOpen ? 'text-slate-900' : 'text-slate-800'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isOpen
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 border-t border-slate-100">
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed pl-10">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Direct Contact Box */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Prefere falar diretamente com a nossa equipa em Luanda?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Esclarecemos dúvidas sobre implantação, encaminhamento de chamadas e Google Calendar.
              </p>
            </div>
          </div>

          <a
            href={`${contactLink}?text=${encodeURIComponent(
              'Olá! Tenho uma dúvida sobre a Recepcionista Virtual de Voz (Joana) para a minha clínica.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm shrink-0"
          >
            <WhatsAppLogo className="w-4 h-4 shrink-0" />
            <span>Falar no WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
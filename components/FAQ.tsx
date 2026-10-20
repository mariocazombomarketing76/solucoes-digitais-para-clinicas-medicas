import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    id: "preco",
    question: "Quanto custa?",
    answer: "Temos planos a partir de 120.000 Kz/mês para a Secretária Digital no WhatsApp, sem fidelização obrigatória. Para planos que incluem website profissional e presença no Google, consulte a nossa secção de planos. Todas as adesões começam com o teste inicial de 30 dias grátis."
  },
  {
    id: "prazo",
    question: "Quanto tempo demora?",
    answer: "A Secretária Digital no WhatsApp fica configurada e a funcionar em poucos dias (normalmente entre 3 a 5 dias úteis com as suas especialidades e horários). Nos planos com criação de website novo, o lançamento completo ocorre em cerca de 15 dias úteis."
  },
  {
    id: "dominio",
    question: "Preciso comprar domínio?",
    answer: "Não precisa de se preocupar com isso. Nos planos que incluem website, tratamos do registo do domínio corporativo (.com ou .co.ao) e da configuração de ligação segura HTTPS sem custos adicionais."
  },
  {
    id: "manter-site",
    question: "Posso manter o meu website atual?",
    answer: "Sim. Se já tem um website e só pretende a Secretária Digital no WhatsApp com lembretes automáticos e recuperação de pacientes, integramos diretamente. Se quiser modernizar o website ou reforçar a presença no Google, temos o plano Secretária + Presença Digital."
  },
  {
    id: "equipa-tecnica",
    question: "Preciso de equipa técnica?",
    answer: "Absolutamente não. Cuidamos de toda a configuração, manutenção técnica e suporte por WhatsApp em dias úteis. A sua equipa de receção só precisa de consultar a agenda e receber os pacientes no consultório."
  },
  {
    id: "fidelizacao",
    question: "Existe fidelização mínima?",
    answer: "O plano de entrada da Secretária Digital não tem qualquer período de fidelização obrigatória — pode cancelar quando desejar. Trabalhamos com total transparência, contrato formal e fatura legal emitida por empresa angolana legalizada."
  },
  {
    id: "pacientes-ligam",
    question: "Os meus pacientes preferem ligar. Serve?",
    answer: "Sim! Os seus pacientes continuam a poder ligar normalmente para a clínica. A Sofia entra em ação para enviar o lembrete automático 24h e 2h antes da consulta, pedir confirmação e fazer o acompanhamento posterior por WhatsApp — o canal onde quase todos leem e respondem de imediato."
  },
  {
    id: "seguranca-dados",
    question: "Os dados dos pacientes estão seguros?",
    answer: "Sim. Cumprimos regras rigorosas de privacidade e proteção contra acessos indevidos. Todas as ligações utilizam protocolos seguros HTTPS. Os dados recolhidos limitam-se ao estritamente necessário para a triagem e marcação (nome, telefone e especialidade), e nunca são partilhados nem vendidos a terceiros."
  },
  {
    id: "mudar-numero",
    question: "Preciso de mudar de número ou de sistema?",
    answer: "Não. Pode utilizar o número de WhatsApp habitual da clínica ou um número novo dedicado, conforme preferir. E não precisa de trocar o seu software de gestão atual: a Sofia envia a ficha do paciente diretamente para o WhatsApp da receção ou para o canal que definir."
  },
  {
    id: "fim-30-dias",
    question: "O que acontece no fim dos 30 dias?",
    answer: "No final dos 30 dias de teste gratuito, reunimos 15 minutos para lhe mostrar os números reais da sua clínica: mensagens atendidas, faltas evitadas e consultas confirmadas. Se gostar dos resultados, escolhe o seu plano e continua. Se decidir não avançar, não paga nada e não há qualquer compromisso."
  }
];

interface FAQProps {
  contactLink?: string;
}

const FAQ: React.FC<FAQProps> = ({ contactLink = "https://wa.me/message/5LQTAOWAHBXLG1" }) => {
  // Abre por defeito as 3 primeiras perguntas (índices 0, 1 e 2)
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const toggleAccordion = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const expandAll = () => {
    if (openIndices.length === faqData.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(faqData.map((_, i) => i));
    }
  };

  return (
    <section id="perguntas" ref={ref} className="bg-slate-50 py-16 md:py-24 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 25 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-4 border border-blue-200/60 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Tire Todas as Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Respostas curtas, claras e honestas sobre a Secretária Digital, implementação, segurança e o período de teste.
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={expandAll}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
            >
              {openIndices.length === faqData.length ? 'Fechar todas' : 'Expandir todas as perguntas'}
            </button>
          </div>
        </motion.div>

        {/* Accordion List */}
        <motion.div 
          className="space-y-3.5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {faqData.map((item, index) => {
            const isOpen = openIndices.includes(index);
            const questionNumber = (index + 1).toString().padStart(2, '0');

            return (
              <div 
                key={item.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen 
                    ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-start sm:items-center justify-between text-left p-5 sm:p-6 gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                      isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {questionNumber}
                    </span>
                    <span className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen ? 'text-blue-950' : 'text-slate-800 hover:text-blue-900'
                    }`}>
                      {item.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
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
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 border-t border-slate-100">
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed pl-9 sm:pl-10">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Support Help Box */}
        <motion.div
          className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Tem outra pergunta sobre a sua clínica?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Respondemos em poucos minutos pelo WhatsApp oficial da ClinicasDigitais.
              </p>
            </div>
          </div>

          <a
            href={`${contactLink}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre a Secretária Digital para a minha clínica.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex-shrink-0"
          >
            <span>Perguntar no WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
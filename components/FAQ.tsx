import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDownIcon } from './Icons';

const faqData = [
  {
    question: "Quanto custa?",
    answer: "Oferecemos soluções modulares sob consulta. Dependendo do plano selecionado (Presença Digital, Crescimento ou Premium), apresentamos uma proposta sob medida com excelente relação custo-benefício e foco no retorno do investimento real da sua clínica."
  },
  {
    question: "Quanto tempo demora?",
    answer: "O planeamento, desenvolvimento, configuração técnica e lançamento completo do seu sistema digital costumam demorar entre 15 a 30 dias úteis, dependendo da complexidade das integrações e do plano escolhido."
  },
  {
    question: "Preciso comprar domínio?",
    answer: "Não precisa de se preocupar com isso. No âmbito do nosso serviço recorrente completo, nós tratamos de todo o processo de registo do domínio corporativo (ex: .com ou .co.ao) e ativação do certificado de segurança SSL de forma gratuita."
  },
  {
    question: "Posso manter o meu website atual?",
    answer: "Sim, se preferir manter o design atual do seu site, realizamos uma auditoria de conversão para reestruturá-lo tecnicamente. Caso seja mais vantajoso, criamos uma nova versão do zero com altíssima performance integrada aos nossos sistemas de triagem."
  },
  {
    question: "Preciso de equipa técnica?",
    answer: "Absolutamente não. O nosso serviço é do tipo chave-na-mão com suporte local permanente em Angola. Cuidamos de toda a manutenção, backups diários, segurança cibernética e atualizações de conteúdo, deixando a sua equipa livre para se focar no atendimento."
  },
  {
    question: "Existe fidelização mínima?",
    answer: "Para garantir a sustentabilidade do trabalho de SEO, otimização de campanhas e suporte local especializado, trabalhamos com contratos anuais ou semestrais, mas sem rasteiras contratuais. O nosso foco é mantê-lo connosco pelos resultados gerados."
  }
];

interface AccordionItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-5 px-2 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 rounded-md"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-800">{item.question}</span>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <ChevronDownIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-2">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });


  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
            transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">PERGUNTAS FREQUENTES</h2>
        </motion.div>
        <motion.div 
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              item={item} 
              isOpen={openIndex === index} 
              onClick={() => handleClick(index)} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
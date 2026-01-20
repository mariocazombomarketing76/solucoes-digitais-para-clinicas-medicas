import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDownIcon } from './Icons';

const faqData = [
  {
    question: "Isto funciona para qualquer especialidade médica?",
    answer: "Sim. A metodologia foi desenhada para clínicas médicas privadas de diferentes especialidades, como clínicas gerais, odontologia, ginecologia, pediatria, oftalmologia, análises clínicas, entre outras. O sistema é adaptado à realidade e ao público de cada clínica, respeitando as boas práticas da comunicação médica e as particularidades de cada serviço."
  },
  {
    question: "Preciso de investir em anúncios?",
    answer: "Não obrigatoriamente. A solução foi pensada para funcionar mesmo sem anúncios pagos, através de uma presença digital bem estruturada, WhatsApp organizado e um funil simples de captação. Caso a clínica opte por investir em anúncios no futuro, a base já estará preparada para aproveitar melhor esse investimento."
  },
  {
    question: "Em quanto tempo começo a ver resultados?",
    answer: "Normalmente, os primeiros resultados começam a surgir poucas semanas após a implementação, especialmente na melhoria do atendimento e no aumento de contactos qualificados. O crescimento consistente depende também do envolvimento da clínica, da rapidez no atendimento e da qualidade do serviço prestado aos pacientes."
  },
  {
    question: "A minha equipa precisa de formação técnica?",
    answer: "Não. A solução foi criada para ser simples e prática. A equipa recebe orientações claras sobre como utilizar o WhatsApp e atender os pacientes de forma mais organizada, sem necessidade de conhecimentos técnicos ou ferramentas complexas."
  },
  {
    question: "O WhatsApp fica sob controlo da clínica?",
    answer: "Sim. O WhatsApp Business pertence totalmente à clínica. Todo o sistema é configurado para apoiar o atendimento, mas o controlo dos contactos, mensagens e dados dos pacientes permanece sempre com a clínica."
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
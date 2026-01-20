import React, { useRef } from 'react';
import { CheckCircleIcon, ClockIcon } from './Icons';
import { motion, useInView } from 'framer-motion';

const solutionFeatures = [
  "Website de alta performance, focado em conversão.",
  "WhatsApp Business estruturado e com automações inteligentes.",
  "Funil simples e eficaz de captação de pacientes.",
  "Atendimento inicial assistido por IA para resposta imediata.",
  "Orientação prática para a sua equipa de atendimento."
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const listItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  },
};

const Solution: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="solucao" ref={ref} className="py-16 md:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-blue-600 uppercase">A Solução Completa</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Sistema Digital de Captação de Pacientes para Clínicas Médicas</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Não são ferramentas isoladas, mas um sistema integrado pensado para atrair, responder e converter pacientes.</p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <motion.ul 
              className="space-y-4"
              variants={listVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {solutionFeatures.map((feature, index) => (
                <motion.li key={index} className="flex items-start" variants={listItemVariants}>
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  </div>
                  <span className="text-gray-700 text-lg">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center text-center bg-blue-50 p-4 rounded-lg">
               <ClockIcon className="w-8 h-8 text-blue-600 mr-4"/>
               <p className="text-lg font-semibold text-blue-800">
                 Implementação rápida e sem complicações: <span className="font-bold">em até 15 dias.</span>
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
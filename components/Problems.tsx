import React, { useRef } from 'react';
import { SadFaceIcon } from './Icons';
import { motion, useInView } from 'framer-motion';

const problems = [
  "Falta de novos pacientes de forma consistente",
  "WhatsApp desorganizado e sem controlo",
  "Site que não gera marcações nem contactos",
  "Perda de potenciais pacientes por demora no atendimento"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const Problems: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A sua clínica enfrenta estes desafios?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Muitas clínicas de excelência perdem oportunidades por não terem uma presença digital estruturada.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => (
            <motion.div 
              key={index} 
              className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 flex items-center"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 bg-red-500 text-white rounded-full p-2 mr-4">
                <SadFaceIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{problem}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Problems;
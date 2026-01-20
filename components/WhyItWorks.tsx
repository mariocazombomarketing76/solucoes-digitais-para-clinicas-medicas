import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const processSteps = [
  "Análise rápida da clínica e dos canais atuais",
  "Estruturação do website e WhatsApp para conversão",
  "Implementação do funil de captação",
  "Orientação prática da equipa",
  "Clínica pronta para receber mais marcações"
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const WhyItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Como funciona na prática?</h2>
        </motion.div>
        
        <motion.div 
          className="relative max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Vertical line for the timeline */}
          <div className="absolute left-5 top-2 h-full w-0.5 bg-blue-200"></div>

          {processSteps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative pl-16 pb-12 last:pb-0"
              variants={itemVariants}
            >
              {/* Circle for the step number */}
              <div className="absolute left-5 top-0 flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white font-bold text-lg ring-8 ring-white transform -translate-x-1/2">
                {index + 1}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800">{step}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyItWorks;
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';


const Authority: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-gray-50 overflow-hidden">
      <motion.div 
        className="container mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-3xl mx-auto">
           <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300 shadow-lg mx-auto mb-6">
               <img src="https://i.imgur.com/oTgNEGC.jpg" alt="Foto profissional de Mario Cazombo" className="w-full h-full object-cover object-[center_25%]" />
            </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sobre o Especialista</h2>
          <p className="text-xl text-gray-700 italic leading-relaxed">
            “Sou Mario Cazombo, Especialista em Marketing e Soluções Digitais focadas em ajudar Clínicas Médicas a estruturar uma presença online que gera pacientes reais e mensuráveis.”
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Authority;
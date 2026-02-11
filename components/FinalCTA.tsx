import React from 'react';
import { TelegramIcon } from './Icons';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  contactLink: string;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ contactLink }) => {
  return (
    <section className="bg-blue-600 text-white overflow-hidden">
      <div className="container mx-auto px-6 py-16 md:py-24 text-center">
        <motion.h2 
          className="text-2xl md:text-4xl font-extrabold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Pronto para captar mais pacientes?
        </motion.h2>
        <motion.p 
          className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Vamos analisar a sua clínica, identificar falhas no processo digital atual e verificar se este sistema faz sentido para si. Sem compromisso.
        </motion.p>
        <motion.div
          className="flex justify-center"
        >
          <motion.a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-base md:text-xl font-bold rounded-lg shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <TelegramIcon className="w-6 h-6 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0" />
            <span className="leading-tight">Analisar a minha clínica no Telegram</span>
          </motion.a>
        </motion.div>
        <motion.p 
          className="mt-6 text-xs md:text-sm text-blue-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          (sem compromisso · resposta em até 24h)
        </motion.p>
      </div>
    </section>
  );
};

export default FinalCTA;
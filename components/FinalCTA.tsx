import React from 'react';
import { WhatsAppIcon } from './Icons';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  whatsappLink: string;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ whatsappLink }) => {
  return (
    <section className="bg-blue-600 text-white overflow-hidden">
      <div className="container mx-auto px-6 py-16 md:py-24 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-extrabold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Pronto para captar mais pacientes?
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Vamos analisar a sua clínica, identificar falhas no processo digital atual e verificar se este sistema faz sentido para si. Sem compromisso.
        </motion.p>
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-10 py-5 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg shadow-xl"
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
          <WhatsAppIcon className="w-7 h-7 mr-4" />
          Analisar a minha clínica gratuitamente no WhatsApp
        </motion.a>
        <motion.p 
          className="mt-4 text-sm text-blue-200"
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
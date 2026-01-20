import React from 'react';
import { WhatsAppIcon } from './Icons';
import { motion } from 'framer-motion';

interface HeroProps {
  whatsappLink: string;
}

const Hero: React.FC<HeroProps> = ({ whatsappLink }) => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container mx-auto px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="https://i.imgur.com/e1EiP3w.png" alt="Clínica Digital Logo" className="h-10 md:h-12" />
        </motion.div>
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 lg:w-3/5 text-center md:text-left mb-10 md:mb-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {},
            }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Captação consistente de pacientes para clínicas médicas em Angola e CPLP
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto md:mx-0"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Sistema digital simples que transforma visitas online em marcações reais, usando website estratégico, WhatsApp organizado e automação inteligente.
            </motion.p>
            <motion.p
              className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto md:mx-0"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Mais de 2 anos a estruturar soluções digitais focadas em resultados reais, adaptadas à realidade das clínicas privadas em Angola.
            </motion.p>
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-lg shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WhatsAppIcon className="w-6 h-6 mr-3" />
              Analisar a minha clínica gratuitamente no WhatsApp
            </motion.a>
            <motion.p
              className="text-sm text-gray-500 mt-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              (sem compromisso · resposta em até 24h)
            </motion.p>
          </motion.div>
          <div className="md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center mt-10 md:mt-0">
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-500 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src="https://i.imgur.com/oTgNEGC.jpg" alt="Foto profissional de Mario Cazombo" className="w-full h-full object-cover object-[center_25%]" />
            </motion.div>
            <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <h2 className="text-2xl font-bold text-gray-900">Mário Cazombo</h2>
                <p className="text-gray-600 max-w-xs">Especialista em Marketing e Soluções Digitais para Clínicas Médicas | Projetos executados por empresa legal em Angola.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
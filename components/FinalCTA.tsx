import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface FinalCTAProps {
  contactLink: string;
}

const FinalCTA: React.FC<FinalCTAProps> = () => {
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#0056b3] text-white overflow-hidden border-t border-[#004494]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold mb-5 tracking-tight text-balance"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          A sua Clínica nunca mais perde uma chamada.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-9 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Experimente uma chamada real com a Joana configurada para as especialidades da sua clínica e veja as consultas entrarem automaticamente no seu calendário.
        </motion.p>

        <button
          type="button"
          onClick={scrollToDiagnostic}
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#28a745] hover:bg-[#218838] text-white text-base md:text-lg font-bold rounded-xl shadow-lg transition-colors duration-150 gap-2.5 cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 shrink-0" />
          <span>Agendar Demonstração Gratuita</span>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </button>

        <p className="mt-6 text-xs text-blue-100">
          Voz Neural Natural (PT-AO) · Sincronização Google Calendar · Luanda, Angola
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
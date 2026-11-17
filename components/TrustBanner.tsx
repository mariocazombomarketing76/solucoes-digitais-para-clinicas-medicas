import React from 'react';
import { motion } from 'framer-motion';
import { PhoneForwarded } from 'lucide-react';

const TrustBanner: React.FC = () => {
  return (
    <section
      aria-label="Informação sobre encaminhamento de chamadas"
      className="bg-[#eff6ff] border-b border-[#bfdbfe] py-5 sm:py-6"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="bg-white/85 backdrop-blur-sm border border-[#bfdbfe] rounded-2xl px-5 py-4 sm:px-7 sm:py-5 shadow-sm flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3.5 sm:gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-[#0056b3] text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneForwarded className="w-5 h-5" />
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
            ℹ️ Não precisa de mudar o seu número de telefone. Nós encaminhamos as chamadas da sua linha atual para a Joana automaticamente.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBanner;

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  contactLink: string;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ contactLink }) => {
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white overflow-hidden border-t border-blue-800">
      <div className="container mx-auto px-6 py-20 md:py-28 text-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        
        <motion.h2 
          className="text-3xl md:text-5xl font-extrabold mb-6 font-display tracking-tight max-w-3xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Está a perder pacientes por falta de presença digital?
        </motion.h2>

        <motion.p 
          className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Solicite gratuitamente uma análise da sua clínica e descubra oportunidades para melhorar a experiência dos pacientes e aumentar pedidos de consulta.
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={scrollToDiagnostic}
            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-lg md:text-xl font-bold rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all duration-300 gap-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: ["0 10px 30px -10px rgba(16,185,129,0.3)", "0 10px 30px 10px rgba(16,185,129,0.5)", "0 10px 30px -10px rgba(16,185,129,0.3)"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FileText className="w-6 h-6 flex-shrink-0" />
            <span className="leading-tight">Solicitar Diagnóstico Gratuito</span>
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </motion.button>
        </motion.div>

        <motion.p 
          className="mt-6 text-xs md:text-sm text-blue-200 uppercase tracking-wider font-semibold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Empresa registada em Angola • Resposta garantida em até 24h úteis
        </motion.p>
      </div>
    </section>
  );
};

export default FinalCTA;
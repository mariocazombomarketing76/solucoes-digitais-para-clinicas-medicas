import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Stethoscope, 
  MessageSquare, 
  Building2, 
  Zap
} from 'lucide-react';

const reasons = [
  {
    title: "Focados em clínicas",
    description: "Não somos uma agência genérica de marketing. Desenvolvemos soluções pensadas exclusivamente para a rotina de saúde, médicos e pacientes.",
    icon: Stethoscope,
    color: "text-blue-600 bg-blue-50 border-blue-100"
  },
  {
    title: "Suporte em Angola por WhatsApp",
    description: "Atendimento direto em português por WhatsApp em dias úteis, com equipa local que compreende o contexto e a realidade de Angola.",
    icon: MessageSquare,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100"
  },
  {
    title: "Empresa legalizada, com contrato e fatura",
    description: "Operamos formalmente através da Mario Cazombo e Filhos, Lda (NIF: 5417437034), com garantia de contrato comercial e emissão de fatura.",
    icon: Building2,
    color: "text-purple-600 bg-purple-50 border-purple-100"
  },
  {
    title: "Implementação rápida",
    description: "Configuramos a Sofia, as especialidades e os horários da sua clínica em poucos dias, sem complexidade nem paragem na sua receção.",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 border-amber-100"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const WhyChooseUs: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="diferenciais" ref={ref} className="py-16 md:py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3.5 py-1 rounded-full">
            Diferenciais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4 font-display">
            Porque escolher a ClinicasDigitais?
          </h2>
          <p className="text-lg text-gray-600">
            Segurança jurídica, especialização em saúde e suporte próximo para a sua clínica crescer sem atritos.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div 
                key={index}
                className="bg-white p-7 rounded-2xl shadow-sm border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${reason.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2.5 leading-snug">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

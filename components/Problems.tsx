import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CalendarOff, 
  MessageSquareOff, 
  UserMinus, 
  FileText 
} from 'lucide-react';

const problems = [
  {
    title: "Consultas marcadas a que o paciente não vem",
    description: "Cada falta é uma hora de médico sem receita.",
    icon: CalendarOff
  },
  {
    title: "Mensagens e chamadas sem resposta fora de horas",
    description: "O paciente sem resposta marca noutra clínica.",
    icon: MessageSquareOff
  },
  {
    title: "Pacientes que vieram uma vez e nunca mais voltaram",
    description: "Já são seus pacientes. Falta só lembrá-los.",
    icon: UserMinus
  },
  {
    title: "WhatsApp desorganizado e agenda em caderno",
    description: "Conversas misturadas e marcações esquecidas.",
    icon: FileText
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Problems: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="problemas" ref={ref} className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100 px-3 py-1 rounded-full">
            Diagnóstico
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4 tracking-tight">
            Onde a sua clínica perde pacientes hoje
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Pequenos desvios no fluxo diário de atendimento geram grandes perdas financeiras ao fim do mês.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-red-50/50 p-6 md:p-7 rounded-2xl border border-red-100 hover:border-red-200 shadow-sm transition-all duration-300 flex items-start gap-4"
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="flex-shrink-0 bg-red-600 text-white rounded-xl p-3 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug">{problem.title}</h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">{problem.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Problems;
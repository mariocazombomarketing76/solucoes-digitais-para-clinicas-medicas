import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CalendarCheck2, 
  MessageSquareCheck, 
  RotateCcw, 
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

const results = [
  {
    title: "Menos faltas",
    description: "Lembrete automático 24h e 2h antes, com confirmação direta do paciente.",
    highlight: "Confirmação ativa",
    icon: CalendarCheck2,
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    title: "Nenhuma mensagem perdida",
    description: "A Sofia responde, recolhe nome, especialidade e horário e entrega a ficha pronta.",
    highlight: "Atendimento imediato",
    icon: MessageSquareCheck,
    badgeColor: "bg-blue-100 text-blue-800"
  },
  {
    title: "Pacientes de volta",
    description: "Mensagem aos pacientes sem consulta há 6 meses ou mais, apenas a quem já é paciente da clínica e com opção de parar (\"Responda PARAR\").",
    highlight: "Recuperação ética",
    icon: RotateCcw,
    badgeColor: "bg-purple-100 text-purple-800"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Results: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="resultados" ref={ref} className="py-16 md:py-24 bg-gray-50/70 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Impacto no Dia a Dia
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4 tracking-tight">
            O que a Secretária Digital faz pela sua clínica
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Automatização inteligente e humanizada que liberta a sua equipa e protege a receita da clínica.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {results.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-white p-7 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 shadow-inner">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                      {item.highlight}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Ativo 24/7 sem interrupções</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Nota por baixo */}
        <motion.div 
          className="mt-10 max-w-3xl mx-auto bg-white border border-blue-150 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-shrink-0 bg-blue-50 text-blue-600 p-3 rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              Flexibilidade no Atendimento
            </span>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
              Os seus pacientes preferem ligar? Continuam a poder ligar. A Sofia trata do lembrete, da confirmação e do acompanhamento.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Results;

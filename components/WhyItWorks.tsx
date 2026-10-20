import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  PhoneCall, 
  Settings, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

const processSteps = [
  {
    step: "01",
    title: "Conversa de 15 minutos",
    desc: "Alinhamos os desafios da sua clínica, as especialidades médicas atendidas e como o agendamento funciona hoje na sua receção.",
    icon: PhoneCall,
    color: "bg-blue-600",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    step: "02",
    title: "Configuramos a Sofia com as suas especialidades e horários",
    desc: "Personalizamos as respostas, os médicos, os turnos de consulta e as mensagens de lembrete com a identidade e o tom da sua clínica.",
    icon: Settings,
    color: "bg-indigo-600",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    step: "03",
    title: "Teste de 30 dias grátis",
    desc: "A Sofia começa a atender pacientes reais no WhatsApp, a confirmar presenças e a recolher dados prontos para a sua equipa.",
    icon: Sparkles,
    color: "bg-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    step: "04",
    title: "Decide se continua",
    desc: "No final dos 30 dias, analisamos os números juntos. Sem contrato de fidelização: só continua se fizer sentido para a sua clínica.",
    icon: CheckCircle2,
    color: "bg-teal-600",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200"
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const WhyItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="processo" ref={ref} className="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3.5 py-1 rounded-full">
            Passo a Passo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3 font-display">
            Como funciona
          </h2>
          <p className="text-lg text-gray-600">
            Sem complicações técnicas. Em poucos dias a sua clínica tem a secretária ativa no WhatsApp.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className="bg-gray-50/80 p-7 rounded-2xl border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm ${step.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-full border bg-white text-slate-700">
                      PASSO {step.step}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyItWorks;
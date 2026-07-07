import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FileText, 
  Map, 
  Code, 
  Settings, 
  Rocket, 
  HeartHandshake, 
  TrendingUp 
} from 'lucide-react';

const processSteps = [
  {
    title: "Diagnóstico gratuito",
    desc: "Analisamos detalhadamente os seus canais atuais para detetar gargalos de conversão, velocidade e posicionamento no Google Angola.",
    icon: FileText,
    color: "bg-blue-600"
  },
  {
    title: "Planeamento digital",
    desc: "Estruturamos o mapeamento das especialidades médicas, arquitetura de páginas e funil de comunicação ideais para a sua clínica.",
    icon: Map,
    color: "bg-indigo-600"
  },
  {
    title: "Desenvolvimento do website",
    desc: "Desenhamos e programamos o seu website institucional premium, focado em UX/UI médica de alta performance e carregamento rápido.",
    icon: Code,
    color: "bg-sky-600"
  },
  {
    title: "Configuração do sistema",
    desc: "Ativamos o seu domínio corporativo personalizado, criamos as contas de e-mail profissionais e configuramos as triagens de WhatsApp.",
    icon: Settings,
    color: "bg-purple-600"
  },
  {
    title: "Lançamento",
    desc: "Colocamos o sistema no ar de forma blindada, indexando a sua marca de saúde nos motores de pesquisa Google Angola.",
    icon: Rocket,
    color: "bg-emerald-600"
  },
  {
    title: "Suporte contínuo",
    desc: "Monitorizamos a sua presença 24/7. Tratamos de backups diários, segurança de dados, suporte em Angola e atualizações de conteúdos.",
    icon: HeartHandshake,
    color: "bg-teal-600"
  },
  {
    title: "Captação de pacientes",
    desc: "A sua clínica passa a ter um ecossistema completo e automatizado que converte cliques online em consultas médicas agendadas de verdade.",
    icon: TrendingUp,
    color: "bg-blue-700"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const WhyItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="processo" ref={ref} className="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Fluxo de Trabalho
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3 font-display">
            Como funciona na prática?
          </h2>
          <p className="text-lg text-gray-600">
            Um processo consultivo transparente e ágil do diagnóstico inicial até o acompanhamento contínuo dos resultados.
          </p>
        </div>
        
        <motion.div 
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Vertical line for the timeline */}
          <div className="absolute left-6 md:left-1/2 top-4 h-[90%] w-0.5 bg-blue-100 transform md:-translate-x-1/2"></div>

          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={index} 
                className={`relative flex flex-col md:flex-row items-stretch mb-12 md:mb-16 last:mb-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
                variants={itemVariants}
              >
                {/* Timeline Circle with Icon */}
                <div className="absolute left-6 md:left-1/2 top-0 flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ring-8 ring-white transform -translate-x-1/2 shadow-md z-10 bg-slate-900">
                  <IconComponent className="w-5 h-5 text-blue-400" />
                </div>

                {/* Left/Right Card Spacer for Desktop */}
                <div className="hidden md:block w-1/2 px-12"></div>

                {/* Content Card */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                  <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 relative group">
                    <span className="absolute top-4 right-4 text-xs font-bold text-gray-400">
                      PASSO 0{index + 1}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 font-display">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
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
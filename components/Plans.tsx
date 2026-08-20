import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Sparkles, Building, BarChart3, ShieldAlert } from 'lucide-react';

const plans = [
  {
    name: "Secretária Digital Start",
    description: "Ideal para clínicas que desejam posicionar-se profissionalmente e transmitir credibilidade imediata aos pacientes na internet.",
    icon: Building,
    features: [
      "Website Premium Institucional",
      "Hospedagem de Alta Performance",
      "Certificado de Segurança SSL",
      "E-mail Profissional Corporativo",
      "Integração direta com WhatsApp",
      "Formulário básico de contacto",
      "Backups automáticos semanais",
      "Suporte técnico especializado"
    ],
    highlight: false,
    badge: "Essencial"
  },
  {
    name: "Secretária Digital Pro",
    description: "O sistema perfeito para clínicas em expansão que querem atrair mais pacientes de forma consistente e organizada.",
    icon: BarChart3,
    features: [
      "Tudo do plano Secretária Digital Start",
      "Páginas dedicadas por Especialidade",
      "SEO Local estruturado",
      "Otimização completa do Google Business",
      "Formulários Inteligentes de Pedido de Consulta",
      "WhatsApp integrado com filtros de triagem",
      "Relatórios Mensais de Desempenho",
      "Atualizações de conteúdo incluídas",
      "Suporte técnico prioritário"
    ],
    highlight: true,
    badge: "Mais Procurado"
  },
  {
    name: "Secretária Digital Elite",
    description: "Transformação digital completa com inteligência artificial para clínicas de referência que buscam o mais alto nível de eficiência.",
    icon: Sparkles,
    features: [
      "Tudo do plano Secretária Digital Pro",
      "Atendimento inicial inteligente com IA (WhatsApp)",
      "Automação completa do fluxo de pedidos",
      "Sistemas avançados de captação de pacientes",
      "Consultoria de posicionamento digital",
      "Relatórios de métricas e conversões em tempo real",
      "Backups diários e redundantes",
      "Segurança cibernética corporativa",
      "Suporte técnico 24/7 com canal VIP de emergência"
    ],
    highlight: false,
    badge: "Exclusivo"
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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

interface PlansProps {
  onSelectPlan?: (planName: string) => void;
}

const Plans: React.FC<PlansProps> = ({ onSelectPlan }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const handlePropostaClick = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="planos" ref={ref} className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Níveis de Serviço
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Planos de Solução Digital
          </h2>
          <p className="text-lg text-gray-600">
            Trabalhamos com base recorrente para garantir que a sua clínica tem suporte local permanente, atualizações constantes e uma presença online blindada.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => {
            const IconComp = plan.icon;
            return (
              <motion.div 
                key={index}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight 
                    ? "bg-slate-900 text-white shadow-xl ring-4 ring-blue-500 scale-100 lg:scale-105 z-10" 
                    : "bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                variants={cardVariants}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1 shadow">
                    <Sparkles className="w-3.5 h-3.5" /> {plan.badge}
                  </div>
                )}
                {!plan.highlight && (
                  <span className="absolute top-6 right-6 text-xs font-bold uppercase tracking-widest bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${plan.highlight ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>

                  <p className={`text-sm mb-8 leading-relaxed ${plan.highlight ? "text-slate-300" : "text-gray-600"}`}>
                    {plan.description}
                  </p>

                  <hr className={`my-6 ${plan.highlight ? "border-slate-800" : "border-gray-200"}`} />

                  <p className="text-xs font-bold uppercase tracking-wider mb-4 opacity-75">O que está incluído:</p>
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-blue-400" : "text-green-500"}`} />
                        <span className={`text-sm leading-snug ${plan.highlight ? "text-slate-200" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePropostaClick(plan.name)}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 text-center tracking-wide text-base ${
                    plan.highlight
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                      : "bg-white hover:bg-gray-100 text-slate-900 border border-gray-300 shadow-sm hover:scale-[1.02]"
                  }`}
                >
                  Solicitar Proposta
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 text-center text-sm text-gray-500 max-w-lg mx-auto">
          * Todas as nossas soluções são acompanhadas por contrato legal em Angola de prestação de serviços tecnológicos emitido por <strong>Mario Cazombo e Filhos, Lda</strong>.
        </div>
      </div>
    </section>
  );
};

export default Plans;

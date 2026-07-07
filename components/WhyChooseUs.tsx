import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Stethoscope, 
  Zap, 
  UserCheck, 
  MapPin, 
  Building2, 
  RefreshCw, 
  Cpu, 
  ShieldCheck, 
  Infinity,
  Sparkles
} from 'lucide-react';

const reasons = [
  {
    title: "Especialização exclusiva em clínicas",
    description: "Não somos uma agência genérica. O nosso foco absoluto é no setor da saúde, conhecendo a fundo as necessidades dos médicos e pacientes.",
    icon: Stethoscope,
    color: "text-blue-600 bg-blue-50"
  },
  {
    title: "Implementação rápida",
    description: "Estruturamos e lançamos o seu website e automações inteligentes em tempo recorde (normalmente entre 15 a 30 dias).",
    icon: Zap,
    color: "text-amber-600 bg-amber-50"
  },
  {
    title: "Sem necessidade de equipa técnica",
    description: "Tratamos de toda a complexidade técnica: infraestrutura, segurança, backups e domínio. A sua clínica foca-se apenas no paciente.",
    icon: UserCheck,
    color: "text-green-600 bg-green-50"
  },
  {
    title: "Suporte local e contínuo",
    description: "Estamos em Angola. Oferecemos suporte rápido, direto e humanizado por WhatsApp ou chamada, sem lidar com robôs estrangeiros.",
    icon: MapPin,
    color: "text-red-600 bg-red-50"
  },
  {
    title: "Empresa legalizada em Angola",
    description: "Operamos de forma 100% legal através da Mario Cazombo e Filhos, Lda (NIF: 5417437034), garantindo total idoneidade e emissão de faturas.",
    icon: Building2,
    color: "text-purple-600 bg-purple-50"
  },
  {
    title: "Soluções recorrentes integradas",
    description: "Não entregamos um site e desaparecemos. Fornecemos um ecossistema recorrente com manutenção diária e melhoria contínua.",
    icon: RefreshCw,
    color: "text-indigo-600 bg-indigo-50"
  },
  {
    title: "Tecnologia moderna",
    description: "Websites ultra-rápidos de alta performance, perfeitamente otimizados para telemóveis e conexões em Angola.",
    icon: Cpu,
    color: "text-sky-600 bg-sky-50"
  },
  {
    title: "Automação inteligente",
    description: "Sistemas automáticos que organizam as mensagens do WhatsApp, agilizando as respostas iniciais para reduzir a perda de leads.",
    icon: Sparkles,
    color: "text-yellow-600 bg-yellow-50"
  },
  {
    title: "Atualizações contínuas",
    description: "Acompanhamos as novidades digitais. O seu website nunca ficará desatualizado ou obsoleto no mercado.",
    icon: Infinity,
    color: "text-teal-600 bg-teal-50"
  },
  {
    title: "Segurança e backups incluídos",
    description: "Proteção contra invasões com certificados SSL avançados e cópias de segurança automáticas de todas as interações.",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50"
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
    <section ref={ref} className="py-16 md:py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Diferenciais de Valor
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Porque escolher a ClinicasDigitais?
          </h2>
          <p className="text-lg text-gray-600">
            A união perfeita de especialização em saúde, infraestrutura profissional de ponta e suporte 100% focado no crescimento da sua clínica.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${reason.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{reason.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-blue-600 font-semibold uppercase tracking-wider">
                  Garantia de Qualidade
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

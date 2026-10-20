import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  MessageSquare, 
  CalendarCheck2, 
  RotateCcw, 
  Globe, 
  Search, 
  BarChart2, 
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';

interface SolutionProps {
  onOpenDemo?: () => void;
}

const systemFeatures = [
  { 
    title: "Secretária no WhatsApp", 
    desc: "Atendimento imediato para responder a dúvidas frequentes, recolher dados de identificação e encaminhar as marcações com prontidão.", 
    icon: MessageSquare, 
    color: "text-emerald-600 bg-emerald-50 border-emerald-100" 
  },
  { 
    title: "Lembretes e confirmações", 
    desc: "Lembrete automático 24h e 2h antes da consulta com pedido de confirmação. Reduz as faltas e liberta horários atempadamente.", 
    icon: CalendarCheck2, 
    color: "text-blue-600 bg-blue-50 border-blue-100" 
  },
  { 
    title: "Recuperação de pacientes", 
    desc: "Mensagens cuidadas a pacientes sem consulta há 6 meses ou mais, apenas a quem já é paciente e com opção simples de parar.", 
    icon: RotateCcw, 
    color: "text-purple-600 bg-purple-50 border-purple-100" 
  },
  { 
    title: "Website profissional", 
    desc: "Páginas modernas, institucionais e ultra-rápidas para telemóveis com ligação segura HTTPS e apresentação de especialidades.", 
    icon: Globe, 
    color: "text-sky-600 bg-sky-50 border-sky-100" 
  },
  { 
    title: "Google e SEO local", 
    desc: "Otimização no Google Maps e pesquisas locais para a sua clínica aparecer a quem procura consultas na sua cidade ou bairro.", 
    icon: Search, 
    color: "text-amber-600 bg-amber-50 border-amber-100" 
  },
  { 
    title: "Relatórios mensais", 
    desc: "Métricas claras de mensagens recebidas, consultas confirmadas e pacientes reativados para acompanhar o retorno do investimento.", 
    icon: BarChart2, 
    color: "text-rose-600 bg-rose-50 border-rose-100" 
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
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

const Solution: React.FC<SolutionProps> = ({ onOpenDemo }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="solucoes" ref={ref} className="py-16 md:py-24 bg-gray-50 overflow-hidden border-b border-gray-100">
      {/* SEO Tag */}
      <h2 className="sr-only">Secretária Digital e Presença Web para Clínicas</h2>

      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3.5 py-1 rounded-full">
            Solução Completa
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3 font-display">
            Tudo o que a sua clínica precisa para não perder pacientes
          </h3>
          <p className="text-lg text-gray-600">
            A secretária no WhatsApp que atende e confirma, complementada por uma presença digital com autoridade médica.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {systemFeatures.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-white p-7 rounded-2xl border border-gray-200/80 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${feat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2.5 leading-snug group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Strategic Trigger Banner in Solution Section */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Tecnologia em Ação
              </span>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                Quer ver a Secretária Digital a atender um paciente agora?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Abra o simulador e teste o atendimento com a ficha do paciente gerada em tempo real.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDemo ? onOpenDemo() : null}
            className="whitespace-nowrap px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105 flex-shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ver demonstração da Sofia</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Solution;
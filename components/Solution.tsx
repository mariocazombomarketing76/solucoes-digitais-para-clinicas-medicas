import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Globe, 
  Server, 
  Lock, 
  Mail, 
  MapPin, 
  Search, 
  MessageSquare, 
  ClipboardList, 
  Calendar, 
  Database, 
  ShieldCheck, 
  LifeBuoy, 
  BarChart2, 
  RefreshCw, 
  Cpu, 
  Sparkles 
} from 'lucide-react';

const systemFeatures = [
  { title: "Website Premium", desc: "Design exclusivo e focado em conversão, otimizado para prender a atenção do paciente e gerar marcações.", icon: Globe, color: "text-blue-600 bg-blue-50" },
  { title: "Hospedagem", desc: "Servidores rápidos com baixíssima latência para garantir carregamento instantâneo em Luanda e no resto de Angola.", icon: Server, color: "text-indigo-600 bg-indigo-50" },
  { title: "SSL de Segurança", desc: "Protocolo HTTPS ativo com criptografia de ponta a ponta para proteger dados e dar credibilidade ao navegador.", icon: Lock, color: "text-emerald-600 bg-emerald-50" },
  { title: "Email Profissional", desc: "Contas de e-mail corporativas com o nome da sua clínica (ex: contacto@suaclinica.com) para comunicações formais.", icon: Mail, color: "text-sky-600 bg-sky-50" },
  { title: "SEO Local", desc: "Otimização técnica para fazer a sua clínica aparecer no topo das pesquisas geográficas do Google Angola.", icon: MapPin, color: "text-rose-600 bg-rose-50" },
  { title: "Google Business", desc: "Configuração profissional e posicionamento da ficha no mapa do Google para gerar chamadas diretas.", icon: Search, color: "text-amber-600 bg-amber-50" },
  { title: "WhatsApp Integrado", desc: "Ligações e botões flutuantes inteligentes para direcionar os visitantes ao atendimento correto sem fricção.", icon: MessageSquare, color: "text-emerald-600 bg-emerald-50" },
  { title: "Formulários Inteligentes", desc: "Campos validados de triagem prévia para qualificar o paciente antes mesmo do primeiro contacto humano.", icon: ClipboardList, color: "text-purple-600 bg-purple-50" },
  { title: "Pedidos de Consulta", desc: "Sistemas simples de agendamento online que permitem ao paciente escolher horários de forma digital.", icon: Calendar, color: "text-teal-600 bg-teal-50" },
  { title: "Backups Automatizados", desc: "Cópias de segurança regulares para garantir que o seu website e histórico de dados nunca se percam.", icon: Database, color: "text-blue-600 bg-blue-50" },
  { title: "Segurança Blindada", desc: "Proteção avançada contra tentativas de invasão e spam nos formulários de contacto.", icon: ShieldCheck, color: "text-green-600 bg-green-50" },
  { title: "Suporte Técnico", desc: "Suporte técnico contínuo em Angola para ajustes, resolução de problemas e assessoria completa.", icon: LifeBuoy, color: "text-violet-600 bg-violet-50" },
  { title: "Relatórios Mensais", desc: "Métricas transparentes de visitas, cliques no WhatsApp e preenchimento de diagnósticos para acompanhar o ROI.", icon: BarChart2, color: "text-yellow-600 bg-yellow-50" },
  { title: "Atualizações", desc: "Manutenção técnica constante com atualizações de segurança e conteúdo sempre que a clínica necessitar.", icon: RefreshCw, color: "text-pink-600 bg-pink-50" },
  { title: "Automação", desc: "Fluxos inteligentes de encaminhamento que otimizam o tempo da sua receção ou equipa comercial.", icon: Cpu, color: "text-cyan-600 bg-cyan-50" },
  { title: "Inteligência Artificial", desc: "Configuração de IA aplicada ao atendimento para respostas e qualificações imediatas fora do horário comercial.", icon: Sparkles, color: "text-purple-600 bg-purple-50" }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
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

const Solution: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="sistema" ref={ref} className="py-16 md:py-24 bg-gray-50 overflow-hidden border-b border-gray-100">
      {/* SEO Tag */}
      <h2 className="sr-only">Websites para Clínicas em Angola</h2>

      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Sistema Clínicas Digitais™
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3 font-display">
            Muito mais do que um website
          </h3>
          <p className="text-lg text-gray-600">
            Uma solução digital completa para clínicas privadas.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {systemFeatures.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-2xl border border-gray-150 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{feat.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>CLINICASDIGITAIS</span>
                  <span>v2.6</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
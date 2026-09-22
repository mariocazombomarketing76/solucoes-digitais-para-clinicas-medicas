import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Building, 
  BarChart3, 
  Crown, 
  Lightbulb, 
  ArrowRight, 
  Activity, 
  CreditCard, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  setupFee: string;
  monthlyFee: string;
  contract: string;
  icon: React.ElementType;
  badge?: string;
  isPopular?: boolean;
  featuresPrefix?: string;
  features: string[];
  salesTrigger: string;
  ctaText: string;
  ctaStyle: "start" | "pro" | "elite";
}

const plansData: PlanItem[] = [
  {
    id: "start",
    name: "Secretária Digital Start",
    subtitle: "Ideal para consultórios individuais, clínicas pequenas ou recém-abertas que precisam de credibilidade imediata.",
    setupFee: "A partir de 150.000 Kz",
    monthlyFee: "55.000 Kz",
    contract: "6 meses",
    icon: Building,
    badge: "Entrada",
    isPopular: false,
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
    salesTrigger: "Por menos de 2.500 Kz por dia, a sua clínica tem um website profissional, e-mail corporativo e suporte técnico, custando uma fração do salário mínimo de um funcionário.",
    ctaText: "Solicitar Proposta Start",
    ctaStyle: "start"
  },
  {
    id: "pro",
    name: "Secretária Digital Pro",
    subtitle: "Ideal para clínicas em expansão, com 2 ou mais especialidades, que precisam organizar o WhatsApp e aparecer no Google.",
    setupFee: "A partir de 300.000 Kz",
    monthlyFee: "120.000 Kz",
    contract: "6 a 12 meses",
    icon: BarChart3,
    badge: "MAIS POPULAR",
    isPopular: true,
    featuresPrefix: "Tudo do plano Secretária Digital Start, MAIS:",
    features: [
      "Páginas dedicadas por Especialidade",
      "SEO Local estruturado",
      "Otimização completa do Google Business",
      "Formulários Inteligentes de Pedido de Consulta",
      "WhatsApp integrado com filtros de triagem",
      "Relatórios Mensais de Desempenho",
      "Atualizações de conteúdo incluídas",
      "Suporte técnico prioritário"
    ],
    salesTrigger: "Uma secretária humana custa, no mínimo, 150.000 Kz/mês (sem contar INSS/IRT). A Secretária Digital Pro custa menos que isso, trabalha 24 horas por dia, 7 dias por semana, não falta, e ainda otimiza o seu Google para atrair pacientes novos todos os meses.",
    ctaText: "Solicitar Proposta Pro",
    ctaStyle: "pro"
  },
  {
    id: "elite",
    name: "Secretária Digital Elite",
    subtitle: "Ideal para clínicas de referência, hospitais privados ou grupos médicos que querem automação total com IA e relatórios de alta gestão.",
    setupFee: "A partir de 600.000 Kz",
    monthlyFee: "250.000 Kz",
    contract: "12 meses",
    icon: Crown,
    badge: "Premium 👑",
    isPopular: false,
    featuresPrefix: "Tudo do plano Secretária Digital Pro, MAIS:",
    features: [
      "Atendimento inicial inteligente com IA (WhatsApp)",
      "Automação completa do fluxo de pedidos",
      "Sistemas avançados de captação de pacientes",
      "Consultoria de posicionamento digital",
      "Relatórios de métricas e conversões em tempo real",
      "Backups diários e redundantes",
      "Segurança cibernética corporativa",
      "Suporte técnico 24/7 com canal VIP de emergência"
    ],
    salesTrigger: "Transforme o seu atendimento. Enquanto a sua equipa dorme, a nossa IA qualifica o paciente, agenda a consulta e entrega a ficha pronta no seu CRM. É como ter uma equipa de receção completa a custo de estagiário, com tecnologia de multinacional.",
    ctaText: "Solicitar Proposta Elite",
    ctaStyle: "elite"
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
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.55, ease: "easeOut" } 
  }
};

interface PlansProps {
  onSelectPlan?: (planName: string) => void;
  onOpenDemo?: () => void;
  contactLink?: string;
}

const Plans: React.FC<PlansProps> = ({ 
  onSelectPlan, 
  onOpenDemo,
  contactLink = "https://wa.me/message/5LQTAOWAHBXLG1" 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const handlePropostaClick = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDuvidasLink = `${contactLink}?text=${encodeURIComponent(
    "Olá! Estive a ver os Planos de Solução Digital na vossa página e gostaria de tirar algumas dúvidas para escolher o melhor plano para a minha clínica."
  )}`;

  return (
    <section id="planos" ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/90 border border-blue-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Tabela de Investimento Transparente
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 mb-4 tracking-tight">
            Planos de Solução Digital
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Soluções completas com suporte técnico permanente em Angola, servidores de alto tráfego e retorno mensurável em captação de pacientes.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plansData.map((plan) => {
            const IconComp = plan.icon;
            const isPro = plan.isPopular;

            return (
              <motion.div 
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPro 
                    ? "bg-slate-900 text-white shadow-2xl ring-4 ring-blue-500 scale-100 lg:scale-105 z-10 border border-blue-400/40" 
                    : "bg-white text-gray-800 border border-gray-200/90 hover:border-blue-300 hover:shadow-xl shadow-sm"
                }`}
                variants={cardVariants}
              >
                {/* Badge Top Right */}
                {isPro ? (
                  <div className="absolute -top-4 right-6 sm:right-8 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                    <span>{plan.badge}</span>
                    <span className="text-xs">⭐</span>
                  </div>
                ) : (
                  <span className={`absolute top-6 right-6 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    plan.id === 'elite' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                {/* Plan Header & Subtitle */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pr-16">
                    <div className={`p-2.5 rounded-2xl ${
                      isPro 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                        : plan.id === 'elite'
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm mb-6 leading-relaxed min-h-[42px] ${
                    isPro ? "text-slate-300" : "text-gray-600"
                  }`}>
                    {plan.subtitle}
                  </p>

                  {/* Pricing Block with Strict Visual Hierarchy */}
                  <div className={`p-4 rounded-2xl mb-6 border ${
                    isPro 
                      ? "bg-slate-800/90 border-slate-700/80" 
                      : "bg-gray-50/90 border-gray-200/70"
                  }`}>
                    {/* Setup Fee (Above Monthly) */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium ${isPro ? "text-slate-400" : "text-gray-500"}`}>
                        Setup Único:
                      </span>
                      <span className={`text-xs font-semibold ${isPro ? "text-blue-300" : "text-slate-700"}`}>
                        {plan.setupFee}
                      </span>
                    </div>

                    {/* Monthly Fee (Biggest & Boldest) */}
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                        isPro ? "text-white" : "text-slate-900"
                      }`}>
                        {plan.monthlyFee}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isPro ? "text-slate-400" : "text-gray-500"
                      }`}>
                        /mês
                      </span>
                    </div>

                    {/* Minimum Contract (Discreet) */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-dashed border-gray-300/30">
                      <span className={`text-[11px] ${isPro ? "text-slate-400" : "text-gray-500"}`}>
                        Período de Compromisso:
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isPro ? "bg-slate-700 text-slate-300" : "bg-gray-200/80 text-gray-700"
                      }`}>
                        Contrato: {plan.contract}
                      </span>
                    </div>
                  </div>

                  {/* Features List Header */}
                  <div className="mb-3">
                    {plan.featuresPrefix ? (
                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                        isPro ? "text-blue-400" : "text-blue-700"
                      }`}>
                        {plan.featuresPrefix}
                      </p>
                    ) : (
                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                        isPro ? "text-slate-400" : "text-gray-500"
                      }`}>
                        Recursos Incluídos:
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 mt-0.5 text-base leading-none">
                          ✅
                        </span>
                        <span className={`text-xs sm:text-sm leading-snug font-medium ${
                          isPro ? "text-slate-200" : "text-gray-700"
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Gatilho de Venda (Highlighted Box with Lightbulb) */}
                  <div className={`p-4 rounded-2xl mb-6 border transition-all ${
                    isPro 
                      ? "bg-blue-950/80 border-blue-500/50 text-blue-100 shadow-inner" 
                      : plan.id === 'elite'
                        ? "bg-amber-50/90 border-amber-300 text-amber-950"
                        : "bg-amber-50/90 border-amber-200 text-amber-900"
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-md flex-shrink-0 mt-0.5">
                        <Lightbulb className={`w-4 h-4 ${
                          isPro ? "text-amber-400" : "text-amber-600"
                        }`} />
                      </div>
                      <p className="text-xs italic leading-relaxed font-normal">
                        "{plan.salesTrigger}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 mt-auto pt-2">
                  {/* Shortcut to Live Demo for Pro plan */}
                  {isPro && (
                    <button
                      type="button"
                      onClick={() => onOpenDemo ? onOpenDemo() : null}
                      className="w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 text-center tracking-wide text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>Testar Secretária 24/7 (Demonstração)</span>
                    </button>
                  )}

                  {/* Primary Plan CTA Button */}
                  <button
                    onClick={() => handlePropostaClick(plan.name)}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 text-center tracking-wide text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer ${
                      plan.ctaStyle === 'pro'
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-xl shadow-blue-500/30 hover:scale-[1.02] border border-blue-400/50"
                        : plan.ctaStyle === 'elite'
                          ? "bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-900 hover:border-amber-600 hover:text-amber-950 shadow-sm hover:scale-[1.02]"
                          : "bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-600 shadow-sm hover:scale-[1.02]"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment & Invoicing Guarantees Box */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                💳 Facilitamos o pagamento: Aceitamos Transferência Bancária, Multicaixa Express e emitimos fatura oficial (NIF: 5417437034)
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Processo formalizado, sem burocracia excessiva e com comprovativo fiscal imediato.
              </p>
            </div>
          </div>

          <a
            href={whatsappDuvidasLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Dúvidas sobre qual plano escolher? Fale connosco no WhatsApp</span>
          </a>
        </div>

        {/* Strategic Callout Banner to Convert Leads to the Live Demo */}
        <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Activity className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Simulação Interativa
                </span>
                <span className="text-xs text-slate-400">Acesso para Diretores</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Deseja ver a Secretária Digital a funcionar antes de contratar?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Interaja com o chat inteligente com visual WhatsApp Business e veja os dados da triagem a preencher a ficha médica ao vivo em tempo real.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDemo ? onOpenDemo() : null}
            className="whitespace-nowrap px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 flex-shrink-0 cursor-pointer w-full md:w-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Testar Secretária 24/7</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Regulatory & Legal Notes */}
        <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto space-y-1.5">
          <p>
            * Todos os valores estão sujeitos a IVA conforme a legislação angolana em vigor. Os preços de setup podem variar consoante a complexidade do projeto.
          </p>
          <p>
            Todas as nossas soluções são acompanhadas por contrato legal em Angola de prestação de serviços tecnológicos emitido por <strong>Mario Cazombo e Filhos, Lda</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Plans;

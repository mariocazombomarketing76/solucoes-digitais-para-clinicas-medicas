import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight, PhoneCall, Building2, Stethoscope, CreditCard } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

export interface PlanItem {
  id: string;
  name: string;
  selectLabel: string;
  subtitle: string;
  monthlyFee: string;
  implementationFee: string;
  icon: React.ElementType;
  popularLabel?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

const plansData: PlanItem[] = [
  {
    id: 'starter',
    name: 'Starter',
    selectLabel: 'Plano Starter',
    subtitle: 'Ideal para consultórios individuais e clínicas pequenas.',
    monthlyFee: '89.900 Kz',
    implementationFee: 'Taxa de Implementação: 150.000 Kz (pagamento único)',
    icon: Stethoscope,
    isPopular: false,
    features: [
      'Até 150 interações/mês incluídas',
      '1 especialidade',
      'Recepcionista de voz 24/7',
      'Lembretes automáticos',
      'Sincronização Google Calendar'
    ],
    ctaText: 'Começar Agora'
  },
  {
    id: 'clinica',
    name: 'Clínica',
    selectLabel: 'Plano Clínica',
    subtitle: 'A solução completa para clínicas em crescimento.',
    monthlyFee: '179.900 Kz',
    implementationFee: 'Taxa de Implementação: 300.000 Kz (pagamento único)',
    icon: PhoneCall,
    popularLabel: '⭐ Mais Popular',
    isPopular: true,
    features: [
      'Até 400 interações/mês incluídas',
      'Até 5 especialidades',
      'Follow-up pós-consulta (pesquisa de satisfação NPS)',
      'Gestão automática de "No-Shows" (faltas)',
      'Suporte prioritário'
    ],
    ctaText: 'Escolher Plano Clínica'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    selectLabel: 'Plano Enterprise',
    subtitle: 'Para redes de clínicas e hospitais com necessidades avançadas.',
    monthlyFee: '349.900 Kz',
    implementationFee: 'Taxa de Implementação: 600.000 Kz (pagamento único, sob orçamento)',
    icon: Building2,
    isPopular: false,
    features: [
      'Até 1.000 interações/mês incluídas',
      'Especialidades ilimitadas',
      'Campanhas de reativação (Voz/SMS)',
      'API dedicada',
      'Gestor de conta com SLA'
    ],
    ctaText: 'Falar com Vendas'
  }
];

interface PlansProps {
  onSelectPlan?: (planName: string) => void;
  onOpenDemo?: () => void;
  contactLink?: string;
}

const Plans: React.FC<PlansProps> = ({
  onSelectPlan,
  contactLink = 'https://wa.me/message/5LQTAOWAHBXLG1'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const handlePlanSelect = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDuvidasLink = `${contactLink}?text=${encodeURIComponent(
    'Olá! Gostaria de agendar uma demonstração gratuita da Joana e tirar dúvidas sobre os planos Starter, Clínica e Enterprise.'
  )}`;

  return (
    <section
      id="planos"
      ref={ref}
      className="py-16 md:py-24 bg-[#f8fafc] border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0056b3] mb-3">
            Preços e Planos
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Investimento transparente para a sua clínica
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Receba atendimento telefónico 24/7 com a Joana em Angola e elimine chamadas perdidas na recepção.
          </p>
        </div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch max-w-6xl mx-auto pt-3">
          {plansData.map((plan, idx) => {
            const IconComp = plan.icon;
            const isPopular = Boolean(plan.isPopular);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className={`relative rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#eff6ff] via-white to-white text-slate-900 border-[2.5px] border-[#0056b3] shadow-2xl shadow-[#0056b3]/15 lg:-translate-y-2'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Selo no topo do card em destaque */}
                {plan.popularLabel && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold tracking-wide bg-[#0056b3] text-white shadow-md whitespace-nowrap">
                      {plan.popularLabel}
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4 mt-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isPopular
                          ? 'bg-[#0056b3] text-white shadow-sm'
                          : 'bg-[#eff6ff] text-[#0056b3] border border-[#bfdbfe]'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 min-h-[42px]">
                    {plan.subtitle}
                  </p>

                  {/* Monthly Price & Implementation Fee Block */}
                  <div
                    className={`py-5 border-y mb-6 ${
                      isPopular ? 'border-[#bfdbfe]' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-slate-900">
                        {plan.monthlyFee}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        /mês
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium tabular-nums ${
                        isPopular ? 'text-[#0056b3]' : 'text-slate-500'
                      }`}
                    >
                      {plan.implementationFee}
                    </p>
                  </div>

                  {/* Included Features */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, fIdx) => {
                      const isContinuationHeading =
                        isPopular && fIdx === 0 && feature.startsWith('Tudo do plano');
                      return (
                        <li key={fIdx} className="flex items-start gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPopular
                                ? 'bg-[#ecfdf5] text-[#28a745]'
                                : 'bg-[#eff6ff] text-[#0056b3]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                          <span
                            className={`text-sm leading-snug ${
                              isContinuationHeading
                                ? 'font-semibold text-slate-900'
                                : 'text-slate-700'
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan.selectLabel)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                    isPopular
                      ? 'bg-[#28a745] hover:bg-[#218838] text-white shadow-lg shadow-[#28a745]/25'
                      : 'bg-[#0056b3] hover:bg-[#004494] text-white shadow-sm'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Nota de Transparência Obrigatória */}
        <p className="mt-9 text-center text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed italic">
          *A Taxa de Implementação é um investimento único que cobre o mapeamento personalizado das suas especialidades, configuração de horários, integração de calendários e a sessão de treino da sua equipa. Garantimos um arranque a 100% desde o primeiro dia. Interações excedentes: 2.000 Kz/unidade. Contrato mínimo: 3 meses.
        </p>

        {/* Payment & Direct WhatsApp Clarification */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-[#0056b3] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Pagamento por Transferência Bancária ou Multicaixa Express com fatura oficial (NIF: 5417437034)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Contrato formal através da Mario Cazombo e Filhos, Lda · Luanda, Angola.
              </p>
            </div>
          </div>

          <a
            href={whatsappDuvidasLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#28a745] hover:text-white bg-[#ecfdf5] hover:bg-[#28a745] px-4 py-2.5 rounded-xl border border-[#bbf7d0] transition-colors shrink-0"
          >
            <WhatsAppLogo className="w-4 h-4 shrink-0" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Plans;

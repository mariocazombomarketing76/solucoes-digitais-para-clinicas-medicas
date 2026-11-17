import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight, PhoneCall, Building2, Stethoscope, CreditCard } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

export interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  monthlyFee: string;
  icon: React.ElementType;
  popularLabel?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

const plansData: PlanItem[] = [
  {
    id: 'starter',
    name: 'Plano STARTER',
    subtitle: 'Consultórios individuais. Agendamento de Voz 24/7, 1 Especialidade, Lembretes.',
    monthlyFee: '49.900 Kz',
    icon: Stethoscope,
    isPopular: false,
    features: [
      'Agendamento de Voz 24/7',
      '1 Especialidade',
      'Lembretes automáticos'
    ],
    ctaText: 'Agendar Demonstração Gratuita'
  },
  {
    id: 'clinica',
    name: 'Plano CLÍNICA',
    subtitle: 'Multi-especialidades até 5, Follow-up pós-consulta, Gestão automática de faltas.',
    monthlyFee: '99.900 Kz',
    icon: PhoneCall,
    popularLabel: 'Mais Popular',
    isPopular: true,
    features: [
      'Tudo do Starter',
      'Multi-especialidades até 5',
      'Follow-up pós-consulta',
      'Gestão automática de faltas'
    ],
    ctaText: 'Agendar Demonstração Gratuita'
  },
  {
    id: 'enterprise',
    name: 'Plano ENTERPRISE',
    subtitle: 'Redes de clínicas. Especialidades ilimitadas, Campanhas de marketing, API dedicada.',
    monthlyFee: '189.900 Kz',
    icon: Building2,
    isPopular: false,
    features: [
      'Especialidades ilimitadas',
      'Campanhas de marketing',
      'API dedicada',
      'Gestor de Conta dedicado'
    ],
    ctaText: 'Falar com Consultor'
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
            Receba atendimento telefónico 24/7 por uma fração do custo de uma recepção adicional.
          </p>
        </div>

        {/* 3-Column Pricing Grid (Middle highlighted with #0056b3 + "Mais Popular") */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch max-w-6xl mx-auto">
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
                    ? 'bg-[#0056b3] text-white border-2 border-[#004494] shadow-2xl lg:-translate-y-2'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isPopular
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'bg-[#eff6ff] text-[#0056b3] border border-[#bfdbfe]'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    {plan.popularLabel && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#28a745] text-white shadow-sm">
                        {plan.popularLabel}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
                      isPopular ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-6 min-h-[44px] ${
                      isPopular ? 'text-blue-100' : 'text-slate-600'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price Block */}
                  <div
                    className={`py-5 border-y mb-6 ${
                      isPopular ? 'border-white/20' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                          isPopular ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {plan.monthlyFee}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isPopular ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        /mês
                      </span>
                    </div>
                  </div>

                  {/* Included Features */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check
                          className={`w-4 h-4 mt-1 shrink-0 ${
                            isPopular ? 'text-emerald-300' : 'text-[#28a745]'
                          }`}
                        />
                        <span
                          className={`text-sm leading-snug ${
                            isPopular ? 'text-white/95' : 'text-slate-700'
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
                    isPopular
                      ? 'bg-[#28a745] hover:bg-[#218838] text-white shadow-md'
                      : 'bg-[#0056b3] hover:bg-[#004494] text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Transparency Note */}
        <p className="mt-8 text-center text-sm text-slate-600 italic tabular-nums">
          *Taxa única de configuração, mapeamento de especialidades e onboarding: 75.000 Kz*
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

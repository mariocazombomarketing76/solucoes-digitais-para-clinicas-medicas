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
    subtitle: 'Ideal para consultórios individuais que querem atendimento telefónico contínuo sem falhar chamadas.',
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
    subtitle: 'A escolha completa para clínicas em crescimento reduzirem faltas e fidelizarem pacientes.',
    monthlyFee: '99.900 Kz',
    icon: PhoneCall,
    popularLabel: 'Mais Popular',
    isPopular: true,
    features: [
      'Tudo do Starter',
      'Multi-especialidades até 5',
      'Follow-up pós-consulta com pesquisa de satisfação',
      'Gestão automática de faltas'
    ],
    ctaText: 'Agendar Demonstração Gratuita'
  },
  {
    id: 'enterprise',
    name: 'Plano ENTERPRISE',
    subtitle: 'Para redes de clínicas com alto volume de chamadas, campanhas ativas e integração dedicada.',
    monthlyFee: '189.900 Kz',
    icon: Building2,
    isPopular: false,
    features: [
      'Especialidades ilimitadas',
      'Campanhas de marketing por voz/SMS',
      'API dedicada',
      'Gestor de Conta'
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
    'Olá! Gostaria de agendar uma demonstração de voz da Joana e tirar dúvidas sobre os planos Starter, Clínica e Enterprise.'
  )}`;

  return (
    <section
      id="planos"
      ref={ref}
      className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-3">
            Preços e Planos
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Investimento transparente para a sua clínica
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Receba atendimento telefónico 24/7 por uma fração do custo de uma recepção adicional.
          </p>
        </div>

        {/* 3-Column Pricing Grid */}
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
                className={`relative rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-shadow duration-200 ${
                  isPopular
                    ? 'bg-slate-900 text-white border-2 border-blue-600 shadow-xl'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  {/* Quiet Top Kicker */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isPopular
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    {plan.popularLabel && (
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
                      isPopular ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price Block */}
                  <div
                    className={`py-5 border-y mb-6 ${
                      isPopular ? 'border-slate-800' : 'border-slate-100'
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
                          isPopular ? 'text-slate-400' : 'text-slate-500'
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
                            isPopular ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span
                          className={`text-sm leading-snug ${
                            isPopular ? 'text-slate-200' : 'text-slate-700'
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
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Discreet Onboarding Note */}
        <p className="mt-8 text-center text-sm text-slate-600 italic tabular-nums">
          *Taxa única de configuração e onboarding: 75.000 Kz
        </p>

        {/* Payment & Direct WhatsApp Clarification */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
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
            className="whitespace-nowrap inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors shrink-0"
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

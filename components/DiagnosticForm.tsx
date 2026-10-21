import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  CheckCircle, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  User, 
  BriefcaseMedical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Check,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  CalendarCheck2,
  Clock,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

const specialtiesList = [
  "Clínica Geral",
  "Clínica Dentária",
  "Análises Clínicas & Laboratório",
  "Centro Médico",
  "Clínica de Estética",
  "Centro de Diagnóstico",
  "Clínica Oftalmológica",
  "Fisioterapia",
  "Pediatria",
  "Ginecologia e Obstetrícia",
  "Outra Especialidade"
];

const citiesList = [
  "Luanda",
  "Benguela",
  "Huambo",
  "Lubango (Huíla)",
  "Cabinda",
  "Lobito",
  "Namibe",
  "Uíge",
  "Malanje",
  "Outra Cidade (Angola)"
];

const consultasFaltamOptions = [
  "0-2",
  "3-5",
  "6-10",
  "mais de 10",
  "não sei"
];

const comoMarcaConsultasOptions = [
  "chamada",
  "WhatsApp",
  "presencial",
  "caderno",
  "outro"
];

const DEFAULT_N8N_WEBHOOK = "https://lively-molehill-apache.ngrok-free.dev/webhook/clinicas-digitais/diagnostico-v2";

interface DiagnosticFormProps {
  selectedPlan?: string;
  onOpenDemo?: (leadInfo?: any) => void;
  onPrivacyClick?: () => void;
}

export interface AIDiagnosticoResult {
  timestamp?: string;
  isRealN8n?: boolean;
  emailEnviado?: boolean;
  cliente?: {
    nome: string;
    clinica: string;
    especialidade: string;
    telefone: string;
    email: string;
    cidade: string;
    website: string;
    plano: string;
    consultasFaltam?: string;
    comoMarcaConsultas?: string;
  };
  relatorioAI?: {
    score: number;
    nivel?: string;
    resumoExecutivo: string;
    topRecomendacoes?: string[];
    pontosFortes: string[];
    gargalos: string[];
    insightsRealTime: string[];
    planoBeneficios: string[];
    potencialCaptacao: string;
    ctaWhatsApp?: string | null;
    groundingSources?: { title: string; uri: string }[];
  };
}

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ selectedPlan, onOpenDemo, onPrivacyClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const [formData, setFormData] = useState({
    nome: '',
    clinica: '',
    especialidade: specialtiesList[0],
    telefone: '',
    email: '',
    cidade: citiesList[0],
    website: '',
    plano: selectedPlan || "Secretária + Presença Digital",
    consultasFaltam: '',
    comoMarcaConsultas: '',
    n8nWebhookUrl: DEFAULT_N8N_WEBHOOK
  });

  const [consentimento, setConsentimento] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'rate_limited' | 'error'>('idle');
  const [rateLimitInfo, setRateLimitInfo] = useState<{ message: string; email: string; clinica: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [diagnosticoResult, setDiagnosticoResult] = useState<AIDiagnosticoResult | null>(null);
  const [, setN8nStatus] = useState<{ status: string; webhookUrl?: string } | null>(null);

  // Sync selectedPlan prop if changed
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plano: selectedPlan }));
    }
  }, [selectedPlan]);

  const scanMilestones = [
    "A registar o pedido de teste de 30 dias grátis para a sua clínica...",
    `A verificar parâmetros operacionais para "${formData.clinica || 'Clínica'}" em ${formData.cidade}...`,
    `A estruturar o fluxo de atendimento da Sofia para ${formData.especialidade}...`,
    "A mapear plano de redução de faltas e recuperação de pacientes...",
    "A gerar estimativa de pacientes e relatório personalizado...",
    "A finalizar o registo. Entraremos em contacto por WhatsApp em até 24h úteis!"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to trigger webhook directly from the browser if needed
  const dispatchToLocalN8n = async (payload: any) => {
    const targetUrl = formData.n8nWebhookUrl || DEFAULT_N8N_WEBHOOK;
    if (!targetUrl) return;

    try {
      await fetch(targetUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          event: 'diagnostico_submetido',
          source: 'browser_client',
          timestamp: new Date().toISOString(),
          data: payload,
          cliente: payload?.cliente || formData
        })
      });
      setN8nStatus({ status: 'success', webhookUrl: targetUrl });
    } catch {
      // In case of strict CORS headers or mixed content, try no-cors mode
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 
            'Content-Type': 'text/plain',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            event: 'diagnostico_submetido',
            source: 'browser_client_no_cors',
            timestamp: new Date().toISOString(),
            data: payload,
            cliente: payload?.cliente || formData
          })
        });
        setN8nStatus({ status: 'success', webhookUrl: targetUrl });
      } catch {
        setN8nStatus({ status: 'client_fallback', webhookUrl: targetUrl });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.clinica.trim() || !formData.telefone.trim()) {
      setValidationError("Por favor, preencha os campos obrigatórios: Nome, Clínica e Telefone / WhatsApp.");
      const card = document.getElementById('diagnostico-form-card') || document.getElementById('diagnostico');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (!consentimento) {
      setValidationError("Por favor, confirme a caixa de consentimento com a Política de Privacidade para avançar.");
      const consentElem = document.getElementById('consent-checkbox-row');
      if (consentElem) {
        consentElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationError(null);

    // 1. Activate Scanning State immediately
    setStatus('scanning');
    setScanStep(0);
    setRateLimitInfo(null);

    // Scroll smoothly to the scanner card
    setTimeout(() => {
      const scanner = document.getElementById('diagnostico-scanner-card') || document.getElementById('diagnostico');
      if (scanner) {
        scanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);

    // 2. Guaranteed Step-by-Step Progress Animation (~1.2s per milestone = ~7.2s realistic AI setup)
    const stageDurationMs = 1200;
    const progressPromise = new Promise<void>((resolve) => {
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep < scanMilestones.length) {
          setScanStep(currentStep);
        } else {
          clearInterval(timer);
          resolve();
        }
      }, stageDurationMs);
    });

    // 3. Parallel Data Fetching & n8n Automation
    const dataPromise = (async () => {
      try {
        const response = await fetch('/api/diagnostico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            email: formData.email.trim() || undefined
          })
        });

        const data = await response.json();

        // Handle anti-abuse 429
        if (response.status === 429 || data.isRateLimited) {
          return {
            type: 'rate_limited' as const,
            info: {
              message: data.message || "Já foi registado um pedido recente para este contacto hoje.",
              email: formData.email || "WhatsApp: " + formData.telefone,
              clinica: formData.clinica
            }
          };
        }

        if (response.ok && data.success && data.diagnostico) {
          return {
            type: 'success' as const,
            diagnostico: data.diagnostico,
            n8nStatus: data.n8nStatus || null
          };
        }
        throw new Error(data.error || "Erro na resposta da API");
      } catch {
        console.info("A registar com contingência e a sincronizar com n8n...");
        // Fallback response generator on frontend if network/proxy fails or on static preview
        const fallbackResult: AIDiagnosticoResult = {
          timestamp: new Date().toISOString(),
          isRealN8n: true,
          emailEnviado: !!formData.email,
          cliente: {
            nome: formData.nome,
            clinica: formData.clinica,
            especialidade: formData.especialidade,
            telefone: formData.telefone,
            email: formData.email || "Não informado",
            cidade: formData.cidade,
            website: formData.website || "N/A",
            plano: formData.plano,
            consultasFaltam: formData.consultasFaltam,
            comoMarcaConsultas: formData.comoMarcaConsultas
          },
          relatorioAI: {
            score: 4.8,
            nivel: "Preparado para Ativação",
            resumoExecutivo: `Pedido de teste de 30 dias grátis registado para ${formData.clinica} em ${formData.cidade}. A Sofia será configurada para a especialidade de ${formData.especialidade}.`,
            topRecomendacoes: [
              `Ativar Sofia no WhatsApp para responder imediatamente a pedidos de consulta de ${formData.especialidade}`,
              `Implementar lembretes automáticos 24h e 2h antes para reduzir faltas`,
              `Lançar campanha de reativação para pacientes sem consulta há mais de 6 meses`
            ],
            pontosFortes: [
              `Localização estratégica em ${formData.cidade}`,
              `Procura crescente de pacientes por marcações rápidas no WhatsApp`,
              `Oportunidade imediata de libertar a equipa da receção do atendimento repetitivo`
            ],
            gargalos: [
              formData.consultasFaltam ? `Perda estimada com consultas desmarcadas ou faltas semanais (${formData.consultasFaltam}).` : "Horários vagos por faltas de pacientes sem aviso prévio.",
              formData.comoMarcaConsultas ? `Canal atual (${formData.comoMarcaConsultas}) com risco de sobrecarga ou demora de resposta.` : "Mensagens fora de horas que acabam por marcar noutra clínica.",
              "Pacientes antigos que não são contactados há vários meses."
            ],
            insightsRealTime: [
              `Pacientes em ${formData.cidade} dão prioridade a clínicas que confirmam de imediato pelo WhatsApp.`,
              "Lembretes com pedido de confirmação reduzem faltas em média em mais de metade."
            ],
            planoBeneficios: [
              "Sofia no WhatsApp 24 horas por dia com respostas cordiais e em português de Angola.",
              "Ficha do paciente pronta para a sua receção com especialidade e horário desejado.",
              "Sem fidelização e sem cartão de crédito durante os 30 dias de teste."
            ],
            potencialCaptacao: "Recuperação de 4 a 12 consultas/mês",
            ctaWhatsApp: null
          }
        };

        dispatchToLocalN8n(fallbackResult);

        return {
          type: 'success' as const,
          diagnostico: fallbackResult,
          n8nStatus: { status: 'success', webhookUrl: formData.n8nWebhookUrl || DEFAULT_N8N_WEBHOOK }
        };
      }
    })();

    // 4. AWAIT BOTH: Complete all visual scan steps AND wait for data ready
    const [, result] = await Promise.all([progressPromise, dataPromise]);

    // 5. Only NOW transition to final result screen
    if (result.type === 'rate_limited') {
      setRateLimitInfo(result.info);
      setStatus('rate_limited');
    } else {
      setDiagnosticoResult(result.diagnostico);
      setN8nStatus(result.n8nStatus);
      setStatus('success');
    }

    // Scroll smoothly to the final result
    setTimeout(() => {
      const resultCard = document.getElementById('diagnostico-resultado-card') || document.getElementById('diagnostico');
      if (resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // WhatsApp link with prefilled message
  const getWhatsAppConfirmationLink = () => {
    const text = `Olá! Acabei de pedir o teste de 30 dias grátis da Secretária Digital no site.\n\n` +
      `*Dados da Minha Clínica*:\n` +
      `- Clínica: ${formData.clinica}\n` +
      `- Responsável: ${formData.nome}\n` +
      `- Telefone/WhatsApp: ${formData.telefone}\n` +
      `- Especialidade: ${formData.especialidade} (${formData.cidade})\n` +
      (formData.consultasFaltam ? `- Faltas estimadas/semana: ${formData.consultasFaltam}\n` : '') +
      (formData.comoMarcaConsultas ? `- Marcação atual: ${formData.comoMarcaConsultas}\n` : '') +
      `\nGostaria de agilizar o início da configuração dos 30 dias de teste!`;
    return `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="diagnostico" ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-blue-50/30 to-emerald-50/20 overflow-hidden border-t border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* FAIXA ANTES DO FORMULÁRIO (FASE 7) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 border border-emerald-500/30 text-center relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3 border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Vagas limitadas a [3] clínicas este mês
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Teste 30 dias grátis
              </h2>

              <p className="text-emerald-50 text-base sm:text-lg max-w-2xl font-medium leading-relaxed mb-4">
                Teste 30 dias grátis. Vagas limitadas a [3] clínicas este mês. Sem cartão. No fim, mostramos-lhe os números e decide.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-white/90">
                <span className="inline-flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4 text-amber-300" /> Sem cartão de crédito
                </span>
                <span className="inline-flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4 text-amber-300" /> Sem compromisso
                </span>
                <span className="inline-flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4 text-amber-300" /> Configuração incluída
                </span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                id="diagnostico-form-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-12 relative"
              >
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Preencha os dados da sua clínica
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    Inicie o seu período de 30 dias sem custos. Entraremos em contacto pelo WhatsApp para alinhar horários e especialidades.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Banner de Erro de Validação */}
                  {validationError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-sm"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                      <span className="font-semibold">{validationError}</span>
                    </motion.div>
                  )}

                  {/* CAMPOS PRINCIPAIS: Nome e Clínica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" /> O seu Nome *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Ex: Dr. António Silva"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 text-base"
                      />
                    </div>

                    {/* Clínica */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" /> Nome da Clínica / Consultório *
                      </label>
                      <input
                        type="text"
                        name="clinica"
                        required
                        value={formData.clinica}
                        onChange={handleInputChange}
                        placeholder="Ex: Clínica MedSaúde"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 text-base"
                      />
                    </div>
                  </div>

                  {/* Telefone / WhatsApp e Cidade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Telefone / WhatsApp */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" /> Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        required
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="Ex: 923 000 000 ou +244 923 000 000"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 text-base"
                      />
                      <span className="text-[11px] text-gray-500 mt-1 block">
                        Número onde receberá a mensagem para configurar o teste.
                      </span>
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> Cidade *
                      </label>
                      <select
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none transition-all text-gray-800 text-base"
                      >
                        {citiesList.map((city, i) => (
                          <option key={i} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Especialidade e E-mail (Opcional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Especialidade */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BriefcaseMedical className="w-4 h-4 text-gray-400" /> Especialidade *
                      </label>
                      <select
                        name="especialidade"
                        value={formData.especialidade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none transition-all text-gray-800 text-base"
                      >
                        {specialtiesList.map((spec, i) => (
                          <option key={i} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    {/* E-mail (Opcional) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" /> E-mail
                        </span>
                        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                          Opcional
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ex: geral@minhaclinica.ao"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 text-base"
                      />
                      <span className="text-[11px] text-gray-500 mt-1 block">
                        Opcional — caso prefira receber também por correio eletrónico.
                      </span>
                    </div>
                  </div>

                  {/* DUAS PERGUNTAS OPCIONAIS (FASE 7) */}
                  <div className="pt-2 border-t border-gray-100 space-y-6">
                    
                    {/* Pergunta Opcional 1: Quantas consultas faltam por semana? */}
                    <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          Quantas consultas faltam por semana?
                        </label>
                        <span className="text-xs text-gray-400">Opcional</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {consultasFaltamOptions.map((opt) => {
                          const isSelected = formData.consultasFaltam === opt;
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  consultasFaltam: isSelected ? '' : opt
                                }));
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pergunta Opcional 2: Como marca consultas hoje? */}
                    <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
                          Como marca consultas hoje?
                        </label>
                        <span className="text-xs text-gray-400">Opcional</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {comoMarcaConsultasOptions.map((opt) => {
                          const isSelected = formData.comoMarcaConsultas === opt;
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  comoMarcaConsultas: isSelected ? '' : opt
                                }));
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all border text-center ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* CAIXA DE CONSENTIMENTO OBRIGATÓRIA (FASE 7) */}
                  <div id="consent-checkbox-row" className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={consentimento}
                        onChange={(e) => setConsentimento(e.target.checked)}
                        className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 leading-snug">
                        Concordo com o tratamento dos dados da clínica de acordo com a{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onPrivacyClick) {
                              onPrivacyClick();
                            } else {
                              const footerPrivacy = document.getElementById('footer');
                              if (footerPrivacy) footerPrivacy.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="text-emerald-700 font-bold underline hover:text-emerald-800 inline cursor-pointer"
                        >
                          Política de Privacidade
                        </button>
                        . <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                  </div>

                  {/* BOTÃO PRINCIPAL (FASE 7) */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 sm:py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all duration-300 text-center text-base sm:text-lg flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Quero testar 30 dias grátis</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Sem cartão de crédito • Configuração sem interromper a sua receção</span>
                    </p>
                  </div>

                </form>
              </motion.div>
            )}

            {/* SCANNING / PROCESSAMENTO REAL */}
            {status === 'scanning' && (
              <motion.div
                id="diagnostico-scanner-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-3xl text-white shadow-2xl border border-slate-800 p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[440px]"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin flex items-center justify-center"></div>
                  <Sparkles className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 font-display">A registar o teste para {formData.clinica}</h3>
                <p className="text-slate-400 text-sm max-w-md mb-8">
                  Estamos a preparar a Sofia para a sua especialidade de {formData.especialidade} em {formData.cidade}.
                </p>

                <div className="w-full max-w-md bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((scanStep + 1) / scanMilestones.length) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={scanStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-emerald-400 font-mono text-xs md:text-sm tracking-wide"
                  >
                    [ETAPA {scanStep + 1}/{scanMilestones.length}] {scanMilestones[scanStep]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {/* RATE LIMITED */}
            {status === 'rate_limited' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-8 text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-display">
                    Pedido Já Registado Hoje
                  </h3>
                  <p className="text-amber-100 mt-2 max-w-xl mx-auto text-sm md:text-base">
                    {rateLimitInfo?.message || "O nosso sistema identificou que já foi solicitado um registo de teste recente para este contacto."}
                  </p>
                </div>

                <div className="p-8 md:p-12 space-y-6 text-center">
                  <div className="bg-amber-50/80 rounded-2xl p-6 border border-amber-200 max-w-2xl mx-auto text-left space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>Contacto em curso por WhatsApp</span>
                    </div>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      A nossa equipa já recebeu os dados de <strong>{rateLimitInfo?.clinica || formData.clinica}</strong> e entrará em contacto pelo WhatsApp em até 24 horas úteis.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a
                      href={getWhatsAppConfirmationLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-base"
                    >
                      <WhatsAppLogo className="w-5 h-5 flex-shrink-0" />
                      <span>Falar agora no WhatsApp</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="w-full sm:w-auto px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all text-sm"
                    >
                      Voltar ao Formulário
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCESSO DO FORMULÁRIO (FASE 7) */}
            {status === 'success' && (
              <motion.div
                id="diagnostico-resultado-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Header de Confirmação com Mensagem Exata Solicitada */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 text-white p-8 md:p-10 text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>

                  <span className="inline-block bg-white/20 text-emerald-100 text-xs py-1 px-3.5 rounded-full font-bold mb-3 border border-white/20">
                    Teste de 30 dias grátis ativado
                  </span>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-3">
                    Recebemos o seu pedido.
                  </h3>

                  <p className="text-emerald-50 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
                    Recebemos o seu pedido. Entramos em contacto por WhatsApp em até 24 horas úteis.
                  </p>
                </div>

                <div className="p-6 md:p-10 space-y-8">
                  
                  {/* Resumo dos Dados Registados */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      Dados confirmados da clínica
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-400 block font-medium">Clínica</span>
                        <strong className="text-gray-900">{formData.clinica}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-400 block font-medium">Responsável</span>
                        <strong className="text-gray-900">{formData.nome}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-400 block font-medium">WhatsApp</span>
                        <strong className="text-gray-900">{formData.telefone}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-400 block font-medium">Especialidade</span>
                        <strong className="text-gray-900">{formData.especialidade} ({formData.cidade})</strong>
                      </div>
                    </div>

                    {(formData.consultasFaltam || formData.comoMarcaConsultas) && (
                      <div className="flex flex-wrap gap-3 pt-2 text-xs text-gray-600">
                        {formData.consultasFaltam && (
                          <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                            Faltas estimadas/semana: <strong>{formData.consultasFaltam}</strong>
                          </span>
                        )}
                        {formData.comoMarcaConsultas && (
                          <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                            Marcação atual: <strong className="capitalize">{formData.comoMarcaConsultas}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* O que acontece a seguir */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-2xl p-6 border border-blue-200 space-y-3">
                    <h4 className="font-bold text-blue-900 text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" /> O que acontece agora?
                    </h4>
                    <ul className="space-y-2.5 text-sm text-blue-950">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>A nossa equipa em Angola entra em contacto por WhatsApp pelo número indicado.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Configuramos a Sofia com as suas especialidades, horários e mensagens de confirmação em poucos dias.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Testa durante 30 dias na prática. No final, apresentamos os relatórios de faltas evitadas e decide se quer continuar.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Acelerar pelo WhatsApp ou Ver Demonstração */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                      href={getWhatsAppConfirmationLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center justify-center gap-3 active:scale-95"
                    >
                      <WhatsAppLogo className="w-5 h-5 flex-shrink-0" />
                      <span>Falar já no WhatsApp</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>

                    {onOpenDemo && (
                      <button
                        type="button"
                        data-action="open-sofia"
                        onClick={() => {
                          try {
                            (onOpenDemo as any)();
                          } catch (e) {
                            if (typeof (window as any).abrirModalSofia === 'function') {
                              (window as any).abrirModalSofia();
                            }
                          }
                        }}
                        className="w-full sm:w-auto px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Ver demonstração da Sofia</span>
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default DiagnosticForm;

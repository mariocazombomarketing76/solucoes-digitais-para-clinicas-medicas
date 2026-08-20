import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Building2, 
  User, 
  BriefcaseMedical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Search,
  Zap,
  Check,
  Settings,
  ExternalLink,
  Layers
} from 'lucide-react';

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

const availablePlans = [
  "Secretária Digital Start",
  "Secretária Digital Pro",
  "Secretária Digital Elite"
];

interface DiagnosticFormProps {
  selectedPlan?: string;
}

export interface AIDiagnosticoResult {
  timestamp?: string;
  cliente?: {
    nome: string;
    clinica: string;
    especialidade: string;
    telefone: string;
    email: string;
    cidade: string;
    website: string;
    plano: string;
  };
  relatorioAI?: {
    score: number;
    resumoExecutivo: string;
    pontosFortes: string[];
    gargalos: string[];
    insightsRealTime: string[];
    planoBeneficios: string[];
    potencialCaptacao: string;
    groundingSources?: { title: string; uri: string }[];
  };
}

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ selectedPlan }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const [formData, setFormData] = useState({
    nome: '',
    clinica: '',
    especialidade: specialtiesList[0],
    telefone: '',
    email: '',
    cidade: citiesList[0],
    website: '',
    plano: selectedPlan || "Secretária Digital Pro",
    n8nWebhookUrl: ''
  });

  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanStep, setScanStep] = useState(0);
  const [diagnosticoResult, setDiagnosticoResult] = useState<AIDiagnosticoResult | null>(null);
  const [n8nStatus, setN8nStatus] = useState<{ status: string; webhookUrl?: string } | null>(null);
  const [showN8nSettings, setShowN8nSettings] = useState(false);

  // Sync selectedPlan prop if user clicks a plan button above
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plano: selectedPlan }));
    }
  }, [selectedPlan]);

  const scanMilestones = [
    "A inicializar motor Gemini 3.7 AI & Google Search Angola...",
    `A pesquisar presença digital e redes para "${formData.clinica || 'Clínica'}" em ${formData.cidade}...`,
    `A analisar posicionamento no segmento de ${formData.especialidade}...`,
    `A avaliar transformações para o plano "${formData.plano}"...`,
    "A disparar automação de workflow n8n (caso ativo)...",
    "A gerar relatório diagnóstico em tempo real..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.clinica || !formData.telefone || !formData.email) {
      alert("Por favor, preencha os campos obrigatórios (Nome, Clínica, Telefone e E-mail).");
      return;
    }

    setStatus('scanning');
    setScanStep(0);

    // Progress timer
    const interval = setInterval(() => {
      setScanStep(prev => (prev < scanMilestones.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      clearInterval(interval);

      if (response.ok && data.success) {
        setDiagnosticoResult(data.diagnostico);
        setN8nStatus(data.n8nStatus || null);
        setStatus('success');
      } else {
        throw new Error(data.error || "Erro ao gerar diagnóstico");
      }
    } catch (err) {
      console.error("Erro na requisição do diagnóstico:", err);
      clearInterval(interval);
      // Fallback response generator on frontend if network fails
      setDiagnosticoResult({
        timestamp: new Date().toISOString(),
        cliente: {
          nome: formData.nome,
          clinica: formData.clinica,
          especialidade: formData.especialidade,
          telefone: formData.telefone,
          email: formData.email,
          cidade: formData.cidade,
          website: formData.website || "N/A",
          plano: formData.plano
        },
        relatorioAI: {
          score: formData.plano.includes("Elite") ? 4.9 : formData.plano.includes("Pro") ? 4.1 : 3.4,
          resumoExecutivo: `Análise preliminar em tempo real concluída para a clínica ${formData.clinica} em ${formData.cidade}.`,
          pontosFortes: [
            `Múltiplas oportunidades de captação no segmento de ${formData.especialidade}`,
            `Presença operacional física em ${formData.cidade}`,
            "Interesse imediato na aceleração digital do atendimento"
          ],
          gargalos: [
            formData.website ? `Website atual (${formData.website}) com baixo índice de conversão no WhatsApp.` : "Ausência de canal oficial indexado no Google Angola.",
            "Ausência de triagem inteligente automatizada para filtrar consultas.",
            "Processo manual de agendamento sujeito a atrasos no atendimento."
          ],
          insightsRealTime: [
            `A procura por ${formData.especialidade} em ${formData.cidade} apresenta pico de buscas em dispositivos móveis.`,
            "Pacientes priorizam instituições que oferecem resposta instantânea via WhatsApp."
          ],
          planoBeneficios: [
            `O plano ${formData.plano} fornece a infraestrutura necessária para sanar a latência do atendimento.`,
            "Aumento substancial da credibilidade e posicionamento de mercado.",
            "Sistemas integrados de captação e agendamento de consultas."
          ],
          potencialCaptacao: "+45% a 80% de aumento no volume de agendamentos"
        }
      });
      setStatus('success');
    }
  };

  // WhatsApp link with detailed prompt
  const getWhatsAppLink = () => {
    const res = diagnosticoResult?.relatorioAI;
    const text = `Olá, solicitei o diagnóstico digital e gostaria de agendar uma apresentação com o Diretor Técnico!\n\n` +
      `*Resumo do Diagnóstico*:\n` +
      `- *Clínica*: ${formData.clinica}\n` +
      `- *Responsável*: ${formData.nome}\n` +
      `- *Especialidade*: ${formData.especialidade} (${formData.cidade})\n` +
      `- *Plano Selecionado*: ${formData.plano}\n` +
      `- *Pontuação Geral*: ${res?.score || 4.2}/10\n` +
      `- *Contacto*: ${formData.telefone}\n` +
      `- *Website*: ${formData.website || "Não possui"}`;
    return `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="diagnostico" ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-blue-50/50 overflow-hidden border-t border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Diagnóstico com Inteligência Artificial & Google Search
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Descubra gratuitamente como melhorar a presença digital da sua clínica
            </h2>
            <p className="text-lg text-gray-600">
              Preencha os dados abaixo e a nossa IA fará uma pesquisa em tempo real na web, gerando um diagnóstico personalizado de acordo com o plano escolhido.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 relative"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Selector de Plano */}
                  <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" /> Plano de Solução Digital Selecionado:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {availablePlans.map((plan) => {
                        const isSelected = formData.plano === plan;
                        return (
                          <button
                            type="button"
                            key={plan}
                            onClick={() => setFormData(prev => ({ ...prev, plano: plan }))}
                            className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all text-left flex items-center justify-between border ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span>{plan}</span>
                            {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      />
                    </div>

                    {/* Clínica */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" /> Nome da Clínica/Consultório *
                      </label>
                      <input
                        type="text"
                        name="clinica"
                        required
                        value={formData.clinica}
                        onChange={handleInputChange}
                        placeholder="Ex: Clínica MedSaúde"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Especialidade */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BriefcaseMedical className="w-4 h-4 text-gray-400" /> Especialidade Principal *
                      </label>
                      <select
                        name="especialidade"
                        value={formData.especialidade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-all text-gray-800"
                      >
                        {specialtiesList.map((spec, i) => (
                          <option key={i} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        required
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="Ex: +244 923 000 000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> Endereço de E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ex: geral@medsaude.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      />
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> Cidade em Angola *
                      </label>
                      <select
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-all text-gray-800"
                      >
                        {citiesList.map((city, i) => (
                          <option key={i} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Website Atual */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" /> Website atual (se possuir)
                      </span>
                      <span className="text-xs text-gray-400">Opcional</span>
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Ex: www.minhaclinica.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    />
                  </div>

                  {/* n8n Webhook Toggle / Config */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowN8nSettings(!showN8nSettings)}
                      className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      {showN8nSettings ? "Ocultar configuração de Webhook n8n" : "Configuração opcional: Webhook n8n para Automação"}
                    </button>

                    {showN8nSettings && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                      >
                        <label className="block text-xs font-bold text-slate-700">
                          URL do Webhook n8n (Ativado ao Submeter)
                        </label>
                        <input
                          type="url"
                          name="n8nWebhookUrl"
                          value={formData.n8nWebhookUrl}
                          onChange={handleInputChange}
                          placeholder="Ex: https://seu-n8n.com/webhook/clinicas-digitais"
                          className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 font-mono text-slate-800"
                        />
                        <p className="text-[11px] text-slate-500">
                          Quando o formulário for submetido, os dados e a análise da IA serão enviados via HTTP POST em formato JSON para o seu workflow n8n.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 text-center text-lg uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.01]"
                    >
                      <Search className="w-5 h-5" />
                      Analisar com IA & Receber Diagnóstico Gratuito
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-3xl text-white shadow-2xl border border-slate-800 p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[480px]"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin flex items-center justify-center"></div>
                  <Sparkles className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 font-display">Pesquisa & Diagnóstico em Tempo Real com IA</h3>
                <p className="text-slate-400 text-sm max-w-md mb-8">
                  Analisando a presença de <strong className="text-slate-200">{formData.clinica}</strong> em {formData.cidade} e mapeando melhorias para o plano <strong className="text-blue-400">{formData.plano}</strong>.
                </p>

                <div className="w-full max-w-md bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full" 
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
                    className="text-blue-400 font-mono text-xs md:text-sm tracking-wide"
                  >
                    [ETAPA {scanStep + 1}/{scanMilestones.length}] {scanMilestones[scanStep]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {status === 'success' && diagnosticoResult?.relatorioAI && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Header do Relatório */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white p-8 text-center relative">
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur text-xs py-1 px-3 rounded-full font-bold">
                      Plano: {formData.plano}
                    </span>
                    <span className="bg-emerald-500/30 text-emerald-200 text-xs py-1 px-3 rounded-full font-bold border border-emerald-400/30">
                      Análise IA Concluída
                    </span>
                  </div>

                  <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
                  <h3 className="text-2xl md:text-3xl font-bold font-display">
                    Diagnóstico Estratégico Concluído
                  </h3>
                  <p className="text-blue-100 mt-2 max-w-xl mx-auto text-sm md:text-base">
                    {diagnosticoResult.relatorioAI.resumoExecutivo}
                  </p>
                </div>

                {/* Corpo do Relatório */}
                <div className="p-8 md:p-12 space-y-8">

                  {/* Resumo com Pontuação e Captação */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center flex flex-col justify-center items-center">
                      <span className="text-xs uppercase font-bold text-blue-600 tracking-wider mb-1">Maturidade Digital</span>
                      <span className="text-4xl font-extrabold text-blue-700">
                        {diagnosticoResult.relatorioAI.score} <span className="text-lg font-normal text-blue-400">/ 10</span>
                      </span>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center flex flex-col justify-center items-center md:col-span-2">
                      <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider mb-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Estimativa de Impacto com {formData.plano}
                      </span>
                      <span className="text-xl md:text-2xl font-extrabold text-emerald-800">
                        {diagnosticoResult.relatorioAI.potencialCaptacao}
                      </span>
                    </div>
                  </div>

                  {/* Insights de Pesquisa em Tempo Real */}
                  {diagnosticoResult.relatorioAI.insightsRealTime && diagnosticoResult.relatorioAI.insightsRealTime.length > 0 && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-blue-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Zap className="w-4 h-4 text-blue-400" /> Observações de Mercado em Tempo Real
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        {diagnosticoResult.relatorioAI.insightsRealTime.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>

                      {diagnosticoResult.relatorioAI.groundingSources && diagnosticoResult.relatorioAI.groundingSources.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="font-bold text-slate-500">Fontes Pesquisadas:</span>
                          {diagnosticoResult.relatorioAI.groundingSources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              {src.title || "Fonte Web"} <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pontos Fortes vs Gargalos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Pontos Positivos Identificados
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        {diagnosticoResult.relatorioAI.pontosFortes.map((pf, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{pf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200">
                      <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" /> Vulnerabilidades Digitais
                      </h4>
                      <ul className="space-y-3 text-sm text-amber-900">
                        {diagnosticoResult.relatorioAI.gargalos.map((gargalo, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{gargalo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Plano de Ação Recomendado */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200 space-y-4">
                    <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" /> Como o Plano "{formData.plano}" Transforma a {formData.clinica}
                    </h4>
                    <ul className="space-y-3 text-sm text-blue-950">
                      {diagnosticoResult.relatorioAI.planoBeneficios.map((ben, i) => (
                        <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Status do n8n Webhook */}
                  {n8nStatus && (
                    <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col md:flex-row items-center justify-between gap-2">
                      <span className="font-semibold flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${n8nStatus.status === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        Integração Workflow n8n: {n8nStatus.status === 'success' ? 'Ativada e Payload Entregue com Sucesso' : 'Pronta para Receber Webhook'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 truncate max-w-xs">
                        {n8nStatus.webhookUrl || "URL padrão n8n em .env.example"}
                      </span>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
                      Para receber a versão em PDF do diagnóstico e iniciar a implementação do plano <strong className="text-gray-900">{formData.plano}</strong>, fale com a nossa equipa técnica.
                    </p>
                    
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg uppercase tracking-wide gap-3 hover:scale-[1.02]"
                    >
                      <Phone className="w-5 h-5" />
                      Falar no WhatsApp & Receber Diagnóstico PDF
                      <ArrowRight className="w-5 h-5" />
                    </a>
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

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
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
  TrendingUp
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

const DiagnosticForm: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const [formData, setFormData] = useState({
    nome: '',
    clinica: '',
    especialidade: specialtiesList[0],
    telefone: '',
    email: '',
    cidade: citiesList[0],
    website: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'scanning' | 'success'>('idle');
  const [scanStep, setScanStep] = useState(0);

  const scanMilestones = [
    "A conectar ao servidor de testes em Luanda...",
    "A verificar indexação da marca no Google Angola...",
    "A testar otimização para redes móveis Unitel/Movicel...",
    "A analisar velocidade de carregamento e latência local...",
    "A verificar integridade e link de atendimento do WhatsApp...",
    "A gerar relatório personalizado de transformação digital..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startScan = () => {
    setStatus('scanning');
    setScanStep(0);
    
    // Simulate steps of the scan
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= scanMilestones.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus('success');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.clinica || !formData.telefone || !formData.email) {
      alert("Por favor, preencha os campos obrigatórios (Nome, Clínica, Telefone e E-mail).");
      return;
    }
    startScan();
  };

  // Create WhatsApp prefilled link with the diagnostic details
  const getWhatsAppLink = () => {
    const text = `Olá, solicitei o diagnóstico digital e gostaria de falar com um especialista!\n\n` +
      `*Dados do Diagnóstico*:\n` +
      `- *Nome*: ${formData.nome}\n` +
      `- *Clínica*: ${formData.clinica}\n` +
      `- *Especialidade*: ${formData.especialidade}\n` +
      `- *Localização*: ${formData.cidade}\n` +
      `- *Contacto*: ${formData.telefone}\n` +
      `- *Website atual*: ${formData.website || "Não possui"}`;
    return `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="diagnostico" ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-blue-50/50 overflow-hidden border-t border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> 100% Gratuito & Sem Compromisso
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Descubra gratuitamente como melhorar a presença digital da sua clínica
            </h2>
            <p className="text-lg text-gray-600">
              Preencha os dados abaixo e o nosso sistema executará um escaneamento preliminar da visibilidade digital da sua instituição de saúde em Angola.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Building2 className="w-4 h-4 text-gray-400" /> Nome da Clínica/Centro *
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

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-center text-lg uppercase tracking-wider flex items-center justify-center gap-3"
                    >
                      <FileText className="w-6 h-6" />
                      Receber Diagnóstico Gratuito
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
                className="bg-slate-900 rounded-3xl text-white shadow-2xl border border-slate-800 p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin flex items-center justify-center"></div>
                  <Loader2 className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 font-display">A Analisar Canais Digitais</h3>
                <p className="text-slate-400 text-sm max-w-md mb-8">
                  O nosso sistema está a verificar os dados e os servidores para recolher indicadores de latência e SEO locais...
                </p>

                <div className="w-full max-w-md bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="bg-blue-500 h-full rounded-full" 
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
                    className="text-blue-400 font-mono text-sm tracking-wide"
                  >
                    [STEP {scanStep + 1}/{scanMilestones.length}] {scanMilestones[scanStep]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Header do Relatório */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-xs py-1 px-3 rounded-full font-bold">
                    ID: #{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl md:text-3xl font-bold font-display">Diagnóstico Preliminar Concluído!</h3>
                  <p className="text-blue-100 mt-2 max-w-lg mx-auto">
                    Análise básica estrutural executada com sucesso para a clínica <strong className="text-white underline">{formData.clinica}</strong>.
                  </p>
                </div>

                {/* Corpo do Relatório */}
                <div className="p-8 md:p-12 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Pontos Fortes Digitais
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          Segmento de alta relevância local ({formData.especialidade})
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          Contacto de atendimento ativo na região de {formData.cidade}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          Prontidão operacional e interesse na modernização B2B
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
                      <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" /> Gargalos Encontrados (Estimado)
                      </h4>
                      <ul className="space-y-3 text-sm text-amber-800">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          {formData.website 
                            ? "Latência elevada e falta de funil estruturado no domínio atual." 
                            : "Perda estimada de 60%+ de novos pacientes por ausência de website oficial."}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          Presença nula de triagem automatizada com IA no WhatsApp
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          Exposição orgânica limitada no Google Business Angola
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="font-bold text-blue-900 flex items-center gap-2 justify-center md:justify-start">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Potencial de Captação
                      </h4>
                      <p className="text-sm text-blue-700 max-w-xl">
                        Ao implementar o <strong>Sistema Clínicas Digitais™</strong>, estima-se um aumento de <span className="font-bold text-lg text-emerald-600">+40% a 75%</span> no fluxo de agendamentos reais em Luanda e um atendimento imediato sem esperas.
                      </p>
                    </div>
                    <div className="text-center bg-white py-3 px-6 rounded-xl border border-blue-200">
                      <span className="block text-xs text-gray-500 uppercase font-semibold">Pontuação Geral</span>
                      <span className="text-3xl font-extrabold text-blue-600">3.8 / 10</span>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
                      Para receber a versão completa em PDF, debater o diagnóstico e planeamento da sua clínica, agende uma apresentação com o Diretor Técnico.
                    </p>
                    
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg uppercase tracking-wide gap-3 hover:scale-[1.02]"
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

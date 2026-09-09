import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  CheckCircle2, 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  MessageSquare,
  Lock,
  Building2,
  Check,
  Stethoscope,
  ChevronRight,
  RefreshCw,
  Zap
} from 'lucide-react';

export interface LeadInfo {
  nome: string;
  clinica: string;
  telefone: string;
  email?: string;
  volumeAtendimento?: string;
}

export interface PatientData {
  nomePaciente?: string;
  especialidade?: string;
  medicoPretendido?: string;
  sintomasOuMotivo?: string;
  dataSugerida?: string;
  horarioSugerido?: string;
  tipoAtendimento?: string;
  seguroNome?: string;
  statusAgendamento?: string;
  nivelUrgencia?: string;
  percentualConcluido?: number;
  proximoPasso?: string;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface DemoSecretariaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadInfo?: LeadInfo | null;
  contactLink: string;
}

const DemoSecretariaModal: React.FC<DemoSecretariaModalProps> = ({
  isOpen,
  onClose,
  initialLeadInfo,
  contactLink
}) => {
  // Gatekeeper: Qualified Access State
  const [isQualified, setIsQualified] = useState(false);
  const [lead, setLead] = useState<LeadInfo>({
    nome: '',
    clinica: '',
    telefone: '',
    email: '',
    volumeAtendimento: 'Entre 15 e 40 consultas/dia'
  });
  const [gateError, setGateError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dados'>('chat'); // For mobile responsive toggle
  const [msgCount, setMsgCount] = useState(0);
  const maxMessages = 10;

  // Compiled Patient Data State (Side-by-side CRM panel)
  const [patientData, setPatientData] = useState<PatientData>({
    nomePaciente: '',
    especialidade: 'Aguardando identificação...',
    medicoPretendido: 'Equipa Médica',
    sintomasOuMotivo: 'Não especificado',
    dataSugerida: 'Pendente',
    horarioSugerido: 'Pendente',
    tipoAtendimento: 'A definir',
    seguroNome: '',
    statusAgendamento: 'Triagem Inicial',
    nivelUrgencia: 'Rotina',
    percentualConcluido: 15,
    proximoPasso: 'Aguardando a primeira mensagem do paciente para iniciar a triagem.'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check if user is already qualified from Diagnosis form or localStorage
  useEffect(() => {
    if (initialLeadInfo && initialLeadInfo.nome && initialLeadInfo.clinica) {
      setLead(initialLeadInfo);
      setIsQualified(true);
    } else {
      const saved = localStorage.getItem('demo_secretaria_lead');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nome && parsed.clinica) {
            setLead(parsed);
            setIsQualified(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [initialLeadInfo, isOpen]);

  // Initial welcome message once qualified
  useEffect(() => {
    if (isOpen && isQualified && messages.length === 0) {
      const clinicaNome = lead.clinica || 'Clínica Médica';
      const welcomeMsg: Message = {
        id: 'welcome-1',
        role: 'assistant',
        content: `Olá! Bem-vindo(a) à **${clinicaNome}**. Sou a Secretária Digital inteligente de plantão 24 horas por dia.\n\nComo posso ajudar hoje? Caso deseje marcar uma consulta, pode indicar-me a especialidade médica ou os sintomas que apresenta.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, isQualified, lead.clinica, messages.length]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.nome.trim() || !lead.clinica.trim() || !lead.telefone.trim()) {
      setGateError('Por favor preencha o seu nome, nome da clínica e WhatsApp para ter acesso.');
      return;
    }
    setGateError(null);
    localStorage.setItem('demo_secretaria_lead', JSON.stringify(lead));
    setIsQualified(true);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    if (msgCount >= maxMessages) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);
    setMsgCount(prev => prev + 1);

    try {
      const response = await fetch('/api/demo-secretaria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: messageText,
          history: newHistory.map(m => ({ role: m.role, content: m.content })),
          leadInfo: lead,
          currentPatientData: patientData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, assistantMsg]);
        }
        if (data && data.patientData) {
          setPatientData(prev => ({
            ...prev,
            ...data.patientData,
            percentualConcluido: Math.min(100, Math.max(prev.percentualConcluido || 20, data.patientData.percentualConcluido || 50))
          }));
        }
      } else {
        // Fallback response
        const fallbackMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Com certeza! Registamos a sua preferência na nossa agenda digital da ${lead.clinica}. Gostaria de confirmar se prefere horário pela manhã ou no período da tarde?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch {
      const fallbackMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Recebido com sucesso! A nossa secretária digital registou os seus dados e está a organizar a agenda médica para si.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const resetDemo = () => {
    setMessages([]);
    setMsgCount(0);
    setPatientData({
      nomePaciente: '',
      especialidade: 'Aguardando identificação...',
      medicoPretendido: 'Equipa Médica',
      sintomasOuMotivo: 'Não especificado',
      dataSugerida: 'Pendente',
      horarioSugerido: 'Pendente',
      tipoAtendimento: 'A definir',
      seguroNome: '',
      statusAgendamento: 'Triagem Inicial',
      nivelUrgencia: 'Rotina',
      percentualConcluido: 15,
      proximoPasso: 'Aguardando a primeira mensagem do paciente para iniciar a triagem.'
    });
  };

  const getWhatsAppHiringLink = () => {
    const text = `Olá Mário Cazombo! Testei a Demonstração da Secretária Digital 24/7 para a ${lead.clinica || 'minha clínica'} e gostei muito da triagem e da compilação de dados do paciente em tempo real. Gostaria de agendar uma reunião para implementar este sistema!`;
    return `${contactLink}?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="demo-secretaria-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      >
        <motion.div
          id="demo-secretaria-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh] h-[850px]"
        >
          {/* Top Bar Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Secretária Digital 24/7
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ao Vivo
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {isQualified ? `Simulação interativa para: ${lead.clinica}` : 'Demonstração Interativa da Automação de Agendamento'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isQualified && (
                <button
                  type="button"
                  onClick={resetDemo}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                  title="Reiniciar Simulação"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* GATEKEEPER VIEW: Access Qualification for Directors & Managers */}
          {!isQualified ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-12 flex items-center justify-center bg-slate-50">
              <div className="max-w-xl w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Acesso Restrito & Qualificado
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3 mb-2">
                  Demonstração Exclusiva para Diretores & Gestores de Clínicas
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Para garantir a segurança da infraestrutura de IA e personalizar a simulação em tempo real para a sua unidade de saúde, confirme a sua credenciação rápida:
                </p>

                {gateError && (
                  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{gateError}</span>
                  </div>
                )}

                <form onSubmit={handleGateSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Seu Nome e Função *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dr. António Ferreira (Diretor Clínico)"
                      value={lead.nome}
                      onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nome da Sua Clínica Médica *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Centro Médico São Paulo de Luanda"
                      value={lead.clinica}
                      onChange={(e) => setLead({ ...lead, clinica: e.target.value })}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+244 9..."
                        value={lead.telefone}
                        onChange={(e) => setLead({ ...lead, telefone: e.target.value })}
                        className="w-full text-sm px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Volume Diário de Consultas
                      </label>
                      <select
                        value={lead.volumeAtendimento}
                        onChange={(e) => setLead({ ...lead, volumeAtendimento: e.target.value })}
                        className="w-full text-sm px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white text-gray-800"
                      >
                        <option value="Menos de 15 consultas/dia">Menos de 15 consultas/dia</option>
                        <option value="Entre 15 e 40 consultas/dia">Entre 15 e 40 consultas/dia</option>
                        <option value="Mais de 40 consultas/dia">Mais de 40 consultas/dia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Testar Secretária 24/7</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Acesso confidencial. Os seus dados não serão partilhados com terceiros.
                  </p>
                </form>
              </div>
            </div>
          ) : (
            /* SIDE-BY-SIDE MAIN WORKSPACE (Chat Left + Data Panel Right) */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
              
              {/* Mobile Tab Switcher */}
              <div className="md:hidden flex border-b border-gray-200 bg-white px-2 py-1.5 text-xs font-bold flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'chat' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-500'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat da Secretária</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('dados')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'dados' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ficha Compilada ({patientData.percentualConcluido || 15}%)</span>
                </button>
              </div>

              {/* LEFT COLUMN: Interactive Chat (Secretária 24/7) */}
              <div className={`w-full md:w-[54%] lg:w-[56%] flex flex-col bg-white border-r border-slate-200 h-full overflow-hidden ${
                activeTab === 'chat' ? 'flex' : 'hidden md:flex'
              }`}>
                {/* Chat Header Sub-bar */}
                <div className="p-3.5 sm:px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        SD
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                        Secretária Médica ({lead.clinica})
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Atendimento inteligente 24/7 com linguagem natural
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    Interação {msgCount}/{maxMessages}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/60">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm shadow-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                          msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {msg.role === 'user' && <Check className="w-3 h-3 text-blue-200" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none w-fit shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px] font-medium text-gray-600">Secretária a analisar e a compilar dados...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick 1-Click Suggestions for Quick Testing */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-thin">
                  <span className="text-gray-400 font-semibold flex-shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                    <Zap className="w-3 h-3 text-amber-500" /> Teste rápido:
                  </span>
                  {[
                    "Quero agendar consulta de Cardiologia para quinta-feira à tarde",
                    "Quais especialidades e horários têm disponíveis amanhã?",
                    "Aceitam seguro de saúde (ex: ENSA) ou apenas particular?",
                    "Tenho tonturas frequentes há 2 dias e procuro avaliação"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickPrompt(sug)}
                      className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-full transition-all text-[11px] flex-shrink-0 disabled:opacity-50"
                    >
                      {sug.slice(0, 36)}...
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      disabled={isLoading || msgCount >= maxMessages}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        msgCount >= maxMessages
                          ? "Limite de teste atingido nesta sessão de demonstração."
                          : "Escreva uma mensagem simulando um paciente..."
                      }
                      className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                    />

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading || msgCount >= maxMessages}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[10px] text-gray-400 mt-1.5 flex items-center justify-between">
                    <span>💡 Escreva como um paciente real: peça consultas, exames, pergunte sobre médicos ou preços.</span>
                    <span className="text-slate-500 font-mono">IA Médica Ativa</span>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Real-Time Patient Data Compilation Panel (CRM / Backend view) */}
              <div className={`w-full md:w-[46%] lg:w-[44%] flex flex-col bg-slate-900 text-white h-full overflow-y-auto ${
                activeTab === 'dados' ? 'flex' : 'hidden md:flex'
              }`}>
                {/* Panel Header */}
                <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/40 px-2.5 py-0.5 rounded-full border border-blue-700/50 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" /> CRM da Clínica em Tempo Real
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {patientData.percentualConcluido || 15}% Preenchido
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Ficha do Paciente Compilada Automaticamente
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Os dados são extraídos da conversa sem intervenção humana da receção.
                  </p>

                  {/* Completion Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3 border border-slate-700/60">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                      initial={{ width: '15%' }}
                      animate={{ width: `${patientData.percentualConcluido || 15}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Structured Fields Grid */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 overflow-y-auto">
                  
                  {/* Status do Agendamento */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status do Agendamento</p>
                      <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        {patientData.statusAgendamento || 'Em Triagem Inicial'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Prioridade</p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        patientData.nivelUrgencia === 'Urgência Médica'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : patientData.nivelUrgencia === 'Prioritária'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {patientData.nivelUrgencia || 'Rotina'}
                      </span>
                    </div>
                  </div>

                  {/* Nome e Especialidade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Nome do Paciente</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                        {patientData.nomePaciente || <span className="text-slate-500 italic">Aguardando no chat...</span>}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Especialidade</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-300 truncate">
                        {patientData.especialidade || <span className="text-slate-500 italic">Identificando...</span>}
                      </p>
                    </div>
                  </div>

                  {/* Data & Horário Preferencial */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Data Preferencial</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">
                        {patientData.dataSugerida || <span className="text-slate-500 italic">Pendente</span>}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Horário / Turno</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">
                        {patientData.horarioSugerido || <span className="text-slate-500 italic">Pendente</span>}
                      </p>
                    </div>
                  </div>

                  {/* Modalidade de Pagamento / Seguro */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Tipo de Atendimento</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-100">
                      <span>{patientData.tipoAtendimento || 'A definir com o paciente'}</span>
                      {patientData.seguroNome && patientData.seguroNome !== 'Nenhum' && (
                        <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                          {patientData.seguroNome}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Motivo da Consulta / Sintomas */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                      Sintomas / Motivo do Contacto
                    </p>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {patientData.sintomasOuMotivo || <span className="text-slate-500 italic">Aguardando relato do paciente...</span>}
                    </p>
                  </div>

                  {/* Próxima Ação do Sistema */}
                  <div className="bg-blue-950/60 border border-blue-800/60 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span>Próxima Ação Automatizada</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {patientData.proximoPasso || 'Aguardando interação no chat.'}
                    </p>
                  </div>

                  {/* Checkbox de Automações Conectadas */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Triagem 24/7 ativa sem intervenção humana</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Envio de lembretes automáticos pré-programado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Integração com WhatsApp Oficial da Clínica</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Call to Action for the Clinic Director */}
                <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex-shrink-0 space-y-2.5">
                  <a
                    href={getWhatsAppHiringLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wide hover:scale-[1.02] text-center"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Quero Esta Secretária na Minha Clínica</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] text-slate-400 text-center">
                    Disponível no plano <strong>Secretária Digital Pro & Elite</strong> com contrato legal em Angola.
                  </p>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoSecretariaModal;

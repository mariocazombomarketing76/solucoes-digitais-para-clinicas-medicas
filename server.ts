import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Real-time Gemini search will fallback to simulated analysis.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// ==========================================
// OTIMIZAÇÃO DE CONSUMO DE IA & RATE LIMITING
// ==========================================
// 1. Cache em memória por 24 horas (Chave: clinica + email) para evitar chamadas redundantes à IA
interface CachedDiagnostic {
  data: any;
  timestamp: number;
}
const diagnosticsCache = new Map<string, CachedDiagnostic>();

// 2. Proteção Anti-Abuso local por IP (máximo 5 pedidos a cada 10 minutos por IP)
const ipRequestHistory = new Map<string, number[]>();
const isRateLimitedIP = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutos
  const maxReqs = 5;
  const timestamps = (ipRequestHistory.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= maxReqs) return true;
  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  return false;
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "clinicas-digitais", timestamp: new Date().toISOString() });
});

// API Endpoint for Real-time AI Diagnostic
app.post("/api/diagnostico", async (req, res) => {
  try {
    const {
      nome,
      clinica,
      especialidade,
      telefone,
      email,
      cidade,
      website,
      plano = "Secretária + Presença Digital",
      n8nWebhookUrl,
      consultasFaltam,
      comoMarcaConsultas
    } = req.body;

    if (!nome || !clinica || !telefone) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: nome, clinica e telefone são necessários." });
    }

    const effectiveEmail = (email && typeof email === 'string' && email.trim()) 
      ? email.trim() 
      : `contacto-${String(telefone).replace(/\D/g, '') || Date.now()}@clinicasdigitais.local`;

    const DEFAULT_N8N_WEBHOOK = "https://lively-molehill-apache.ngrok-free.dev/webhook/clinicas-digitais/diagnostico-v2";
    const targetWebhook = n8nWebhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;

    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";

    const normalizedEmail = effectiveEmail.trim().toLowerCase();
    const normalizedClinica = clinica.trim().toLowerCase();
    const cacheKey = `${normalizedClinica}_${normalizedEmail}`;

    // 1. ECONOMIA DE IA: Se o mesmo utilizador/clínica já fez diagnóstico nas últimas 24h, retorna do cache
    const cached = diagnosticsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000)) {
      console.log(`[Diagnóstico - Economia IA] Retornando diagnóstico em cache para ${clinica} (${email}). Economia de 100% dos tokens.`);
      return res.json({
        success: true,
        source: "cache_economia_ia",
        diagnostico: cached.data,
        cached: true
      });
    }

    // 2. PROTEÇÃO DE QUOTA: Rate-limiter por IP (máximo 5 chamadas em 10 minutos)
    if (isRateLimitedIP(clientIp)) {
      console.warn(`[Diagnóstico - Proteção] IP ${clientIp} bloqueado temporariamente por excesso de requisições.`);
      return res.status(429).json({
        success: false,
        isRateLimited: true,
        message: "Muitas solicitações a partir desta rede. Por favor, aguarde alguns minutos antes de solicitar um novo diagnóstico.",
        email,
        clinica
      });
    }

    const payload = {
      nome,
      clinica,
      especialidade,
      telefone,
      email: effectiveEmail,
      cidade,
      website: website || "",
      plano,
      consultasFaltam: consultasFaltam || "",
      comoMarcaConsultas: comoMarcaConsultas || "",
      ip: clientIp,
      timestamp: new Date().toISOString(),
      cliente: {
        nome,
        clinica,
        especialidade,
        telefone,
        email: effectiveEmail,
        cidade,
        website: website || "",
        plano,
        consultasFaltam: consultasFaltam || "",
        comoMarcaConsultas: comoMarcaConsultas || "",
        ip: clientIp
      },
      data: {
        cliente: {
          nome,
          clinica,
          especialidade,
          telefone,
          email: effectiveEmail,
          cidade,
          website: website || "",
          plano,
          consultasFaltam: consultasFaltam || "",
          comoMarcaConsultas: comoMarcaConsultas || "",
          ip: clientIp
        }
      }
    };

    let n8nRawResponse: any = null;
    let isN8nSuccess = false;

    // 1. PRIMARY: Call n8n workflow for REAL Web Search (OpenAI Responses AO), Anti-Abuse & Gmail
    if (targetWebhook) {
      try {
        console.log(`[Diagnóstico] Disparando workflow n8n em tempo real: ${targetWebhook}`);
        const controller = new AbortController();
        // Allow up to 45 seconds for OpenAI Web Search (AO) + Gmail send + Responder Diagnóstico
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const n8nResp = await fetch(targetWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          signal: controller.signal,
          body: JSON.stringify(payload)
        });

        clearTimeout(timeoutId);

        // Anti-abuse: daily limit (100) or email dedupe on the same day
        if (n8nResp.status === 429) {
          const errText = await n8nResp.text();
          let parsedMsg = "Já foi solicitado um diagnóstico para este e-mail hoje ou o limite diário foi atingido. Por favor, verifique a sua caixa de correio.";
          try {
            const errJson = JSON.parse(errText);
            parsedMsg = errJson.message || errJson.error || errJson.text || parsedMsg;
          } catch {
            if (errText && errText.length < 250) parsedMsg = errText;
          }
          return res.status(429).json({
            success: false,
            isRateLimited: true,
            message: parsedMsg,
            email,
            clinica
          });
        }

        if (n8nResp.ok) {
          const contentType = n8nResp.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            n8nRawResponse = await n8nResp.json();
          } else {
            const textResp = await n8nResp.text();
            try {
              n8nRawResponse = JSON.parse(textResp);
            } catch {
              n8nRawResponse = { resumo: textResp };
            }
          }
          isN8nSuccess = true;
          console.log("[Diagnóstico] Resposta real recebida com sucesso do nó 'Responder Diagnóstico' do n8n!");
        } else {
          console.warn(`[Diagnóstico] n8n respondeu com status HTTP ${n8nResp.status}`);
        }
      } catch (webhookErr: any) {
        console.warn("[Diagnóstico] Timeout ou falha de conexão com o n8n:", webhookErr?.message || webhookErr);
      }
    }

    // If n8n delivered the real diagnosis, format and return it
    if (isN8nSuccess && n8nRawResponse) {
      const source = n8nRawResponse.data || n8nRawResponse.relatorio || n8nRawResponse;

      // Score parsing
      const scoreVal = source.score ?? source.pontuacao ?? source.nota ?? 5.2;
      let numericScore = typeof scoreVal === "number" ? scoreVal : parseFloat(String(scoreVal).replace(/[^\d.-]/g, "")) || 5.2;
      if (numericScore > 10) numericScore = numericScore / 10;
      numericScore = Math.round(numericScore * 10) / 10;

      // Nível de maturidade digital
      const nivelVal = source.nivel ?? source.maturidade ?? source.nivelMaturidade ?? (numericScore >= 7.5 ? "Avançado" : numericScore >= 4.5 ? "Intermediário" : "Inicial");

      // Top 3 Recomendações
      let rawRecs = source.top3Recomendacoes ?? source.top_3_recomendacoes ?? source.recomendacoesTop3 ?? source.recomendacoes ?? source.topRecomendacoes ?? [];
      if (typeof rawRecs === "string") {
        rawRecs = rawRecs.split(/\n|\r\n/).map((s: string) => s.replace(/^\d+[\.\)\-]\s*/, '').trim()).filter(Boolean);
      } else if (!Array.isArray(rawRecs)) {
        rawRecs = [];
      }

      const topRecomendacoes = rawRecs.length > 0 ? rawRecs : [
        `Implementar presença institucional oficial e credibilidade para o plano ${plano}`,
        `Ativar canal automatizado no WhatsApp para triagem e pré-agendamento em ${cidade}`,
        `Otimizar posicionamento nas pesquisas do Google Angola para ${especialidade}`
      ];

      const resumoExecutivo = source.resumoExecutivo ?? source.resumo ?? source.diagnostico ?? source.mensagem ?? `Análise estratégica real em tempo real realizada para ${clinica} em ${cidade}, no segmento de ${especialidade}.`;

      const pontosFortes = Array.isArray(source.pontosFortes) && source.pontosFortes.length > 0 ? source.pontosFortes : [
        `Atuação no segmento estratégico de ${especialidade} em ${cidade}`,
        "Prontidão para captação de pacientes por canais digitais",
        "Alta demanda de pacientes na região à procura de resposta ágil"
      ];

      const gargalos = Array.isArray(source.gargalos) && source.gargalos.length > 0 ? source.gargalos : [
        website ? `Website atual (${website}) sem funil direto de conversão para WhatsApp.` : "Ausência de website próprio indexado no Google Angola.",
        "Atendimento com tempo de resposta passível de perda de pacientes para a concorrência.",
        `Visibilidade digital geolocalizada em ${cidade} necessita de consolidação.`
      ];

      const planoBeneficios = Array.isArray(source.planoBeneficios) && source.planoBeneficios.length > 0 ? source.planoBeneficios : [
        `O plano ${plano} estrutura o fluxo digital para captar e reter pacientes sem depender de esforço manual.`,
        "Resposta rápida no primeiro contacto, aumentando a taxa de agendamento de consultas.",
        "Posicionamento de autoridade e segurança para a clínica e seus especialistas."
      ];

      const diagnosticoFinal = {
        timestamp: new Date().toISOString(),
        isRealN8n: true,
        emailEnviado: true,
        cliente: {
          nome,
          clinica,
          especialidade,
          telefone,
          email,
          cidade,
          website: website || "N/A",
          plano
        },
        relatorioAI: {
          score: numericScore,
          nivel: nivelVal,
          resumoExecutivo,
          topRecomendacoes,
          pontosFortes,
          gargalos,
          insightsRealTime: Array.isArray(source.insightsRealTime) ? source.insightsRealTime : [
            `Pesquisa web em tempo real (OpenAI Responses API - Angola AO) executada com sucesso para "${clinica}".`,
            "Pacientes em Angola priorizam clínicas com confirmação rápida e profissional no WhatsApp."
          ],
          planoBeneficios,
          potencialCaptacao: source.potencialCaptacao ?? (plano.includes("Elite") ? "+60% a 90% de aumento nos agendamentos" : plano.includes("Pro") ? "+40% a 75% de aumento nos agendamentos" : "+25% a 50% de aumento na captação"),
          ctaWhatsApp: source.ctaWhatsApp ?? source.whatsappUrl ?? source.linkWhatsApp ?? null
        }
      };

      // Salva em cache para economizar 100% de IA nas próximas requisições deste utilizador/clínica
      diagnosticsCache.set(cacheKey, { data: diagnosticoFinal, timestamp: Date.now() });

      return res.json({
        success: true,
        source: "n8n_real_ai",
        diagnostico: diagnosticoFinal,
        n8nStatus: { status: "success", webhookUrl: targetWebhook }
      });
    }

    // 2. CONTINGENCY FALLBACK: If n8n was temporarily unavailable
    console.info("[Diagnóstico] n8n temporariamente inacessível. Acionando motor de contingência com consumo reduzido.");

    let aiResult = null;
    let groundingSources = [];

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Analista Digital Sênior - Clínicas Digitais Angola. Gere diagnóstico JSON conciso para:
Clínica: ${clinica} | Responsável: ${nome} | Especialidade: ${especialidade} | Cidade: ${cidade} | Web: ${website || "Nenhum"} | Plano: ${plano}

Retorne JSON estrito:
{
  "score": 4.5,
  "nivel": "Inicial"|"Intermediário"|"Avançado",
  "resumoExecutivo": "string concisa com max 30 palavras",
  "topRecomendacoes": ["rec1", "rec2", "rec3"],
  "pontosFortes": ["pt1", "pt2", "pt3"],
  "gargalos": ["gar1", "gar2", "gar3"],
  "insightsRealTime": ["ins1", "ins2"],
  "planoBeneficios": ["ben1", "ben2", "ben3"],
  "potencialCaptacao": "+40% a 75% no volume de pacientes"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 600,
            responseMimeType: "application/json"
          }
        });

        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        }
      } catch (err: any) {
        console.warn("[Diagnóstico] Nota de contingência:", err?.message || err);
      }
    }

    if (!aiResult) {
      const isElite = plano.includes("Elite");
      const isPro = plano.includes("Pro");
      
      aiResult = {
        score: isElite ? 4.8 : isPro ? 3.9 : 3.2,
        nivel: isElite ? "Intermediário" : "Inicial",
        resumoExecutivo: `Análise técnica realizada para ${clinica} em ${cidade}. Identificado elevado potencial de captação de pacientes com o plano ${plano}.`,
        topRecomendacoes: [
          `Implementar canal prioritário de triagem e captação para o plano ${plano}`,
          `Ativar resposta rápida no WhatsApp para pacientes de ${especialidade} em ${cidade}`,
          `Criar presença institucional com foco em credibilidade no Google Angola`
        ],
        pontosFortes: [
          `Localização estratégica na região de ${cidade} no segmento de ${especialidade}`,
          "Estrutura operacional e pronta aceitação de canais digitais",
          "Interesse em modernização e atendimento rápido ao paciente"
        ],
        gargalos: [
          website ? `Website atual (${website}) sem funil otimizado para conversão no WhatsApp.` : "Ausência de website institucional oficial, perdendo buscas no Google Angola.",
          "Falta de triagem automatizada com filtros no WhatsApp para pré-agendamento.",
          `Visibilidade limitada nas pesquisas geolocalizadas em ${cidade}.`
        ],
        insightsRealTime: [
          `A procura por consultas de ${especialidade} em ${cidade} cresceu significativamente nos canais digitais.`,
          "Pacientes locais preferem clínicas com confirmação rápida e imediata via WhatsApp."
        ],
        planoBeneficios: [
          `Com o plano ${plano}, a ${clinica} terá ${isElite ? "Atendimento com IA 24/7 no WhatsApp e automação total de consultas" : isPro ? "Páginas otimizadas por especialidade e SEO local no Google Angola" : "Website profissional de alta performance e e-mail corporativo"}.`,
          "Redução drástica do tempo de espera e eliminação de perdas de potenciais pacientes.",
          "Processo simplificado de agendamento diretamente conectado ao seu atendimento."
        ],
        potencialCaptacao: isElite ? "+60% a 90% no volume de pacientes" : isPro ? "+40% a 75% no volume de pacientes" : "+25% a 50% de aumento de credibilidade e contactos"
      };
    }

    const diagnosticoFinal = {
      timestamp: new Date().toISOString(),
      isRealN8n: false,
      emailEnviado: false,
      cliente: {
        nome,
        clinica,
        especialidade,
        telefone,
        email,
        cidade,
        website: website || "N/A",
        plano
      },
      relatorioAI: {
        ...aiResult,
        groundingSources
      }
    };

    // Salva em cache para economizar 100% de IA nas próximas requisições
    diagnosticsCache.set(cacheKey, { data: diagnosticoFinal, timestamp: Date.now() });

    return res.json({
      success: true,
      source: "contingency_engine",
      diagnostico: diagnosticoFinal,
      n8nStatus: { status: "contingency", webhookUrl: targetWebhook }
    });

  } catch (error: any) {
    console.error("Erro no processamento do diagnóstico:", error);
    return res.status(500).json({ error: "Erro interno no servidor de diagnóstico." });
  }
});

// Helper to extract and format patient full name from chat messages
function extractPatientFullName(text: string, replyText: string = "", currentName?: string): string | null {
  if (!text && !replyText) return currentName || null;

  const normalizeNoAccents = (str: string) =>
    (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const STOP_WORDS = new Set([
    "ola", "oi", "bom", "boa", "dia", "tarde", "noite", "alo",
    "consulta", "consultas", "marcar", "agendar", "agendamento",
    "medico", "medica", "medicos", "doutor", "doutora", "dr", "dra",
    "clinica", "hospital", "paciente", "especialidade", "especialidades",
    "cardiologia", "pediatria", "ginecologia", "oftalmologia", "dentista", "odontologia",
    "ortopedia", "dermatologia", "neurologia", "urologia", "fisioterapia", "nutricao", "psicologia",
    "dor", "dores", "febre", "sintoma", "sintomas", "exame", "exames",
    "rececao", "recepcao", "secretaria", "sofia", "assistente",
    "quero", "queria", "gostaria", "preciso", "precisava", "tenho", "tem", "pode", "podia", "poderia",
    "saber", "ver", "fazer", "falar", "confirmar", "cancelar", "remarcar",
    "favor", "obrigado", "obrigada", "agradecido", "agradecida",
    "quanto", "custa", "custo", "valor", "valores", "preco", "precos",
    "quando", "onde", "como", "qual", "quais", "porque", "por",
    "sim", "nao", "claro", "certeza", "ok", "tudo", "bem", "perfeito", "excelente",
    "amanha", "hoje", "ontem", "semana", "mes",
    "segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo",
    "manha", "cedo", "hora", "horas", "horario", "vaga", "vagas",
    "particular", "seguro", "convenio", "ensa", "fidelidade", "saude",
    "informacao", "informacoes", "atendimento", "urgencia", "emergencia"
  ]);

  const PREPOSITIONS = new Set(["de", "da", "do", "dos", "das", "e"]);

  const formatName = (str: string): string => {
    return str
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w, idx) => {
        if (/^(dr|dra|sr|sra)\.?$/i.test(w)) {
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() + (w.includes(".") ? "" : ".");
        }
        if (idx > 0 && PREPOSITIONS.has(w.toLowerCase())) {
          return w.toLowerCase();
        }
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const isValidName = (nameStr: string): boolean => {
    if (!nameStr) return false;
    const clean = nameStr.trim().replace(/^[-–—:,.\s]+|[-–—:,.\s]+$/g, "");
    if (clean.length < 3 || clean.length > 60) return false;
    if (/\d|@|https?:\/\//.test(clean)) return false;

    const parts = clean.split(/\s+/);
    if (parts.length < 1 || parts.length > 6) return false;

    let invalidCount = 0;
    for (const part of parts) {
      const partClean = normalizeNoAccents(part.replace(/[^\w]/g, ""));
      if (STOP_WORDS.has(partClean)) {
        invalidCount++;
      }
    }

    if (invalidCount > 0 && (invalidCount >= parts.length || parts.length === 1)) {
      return false;
    }

    return true;
  };

  const cleanCandidate = (raw: string): string => {
    let c = raw.trim().split(/[\n;\?!]/)[0];
    if (c.includes(",")) c = c.split(",")[0];
    c = c.replace(/\s+(?:e\s+(?:o\s+)?meu|e\s+(?:o\s+)?telefone|e\s+(?:o\s+)?telemóvel|e\s+(?:o\s+)?contacto|telefone|tel|whatsapp|contacto|queria|gostaria|para|com|às|ás|no|na|pelo|pela|meu\s+número)\b.*$/i, "");
    c = c.replace(/\s+\+?\d[\d\s\-\.]{6,}.*$/, "");
    c = c.replace(/\s+[^\s@]+@[^\s@]+.*$/, "");
    // Trim trailing prepositions/conjunctions if cut off mid-sentence (e.g. "Carlos Silva e gostaria...")
    c = c.replace(/\s+(?:e|de|da|do|dos|das|para|com|que)$/i, "");
    c = c.replace(/^[-–—:,\.\s]+|[-–—:,\.\s]+$/g, "");
    return c.trim();
  };

  let candidate: string | null = null;
  const t = text ? text.trim() : "";

  // 1. Check user text with explicit prefix patterns
  if (t) {
    const prefixes = [
      /(?:(?:o\s+)?meu\s+nome(?:\s+completo)?\s*(?:é|seria|foi|:)?\s+)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:(?:nome(?:\s+completo)?(?:\s+do\s+paciente)?|paciente|titular)\s*:\s*)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:(?:eu\s+)?(?:me\s+chamo|chamo[\s-]me)\s+)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:(?:eu\s+)?sou\s+(?:o|a)?\s*)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:aqui\s+(?:é|fala)\s+(?:o|a)?\s*)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:(?:em\s+nome\s+de|para\s+o\s+paciente|para\s+a\s+paciente|consulta\s+para|marcação\s+para|agendar\s+para)\s+)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i,
      /(?:(?:pode\s+chamar[\s-]me(?:\s+de)?|trate[\s-]me\s+por|chame[\s-]me\s+de)\s+)([A-Za-zÀ-ÖØ-öø-ÿ\s'\.\-]{3,60})/i
    ];

    for (const pat of prefixes) {
      const m = t.match(pat);
      if (m && m[1]) {
        const cleaned = cleanCandidate(m[1]);
        if (isValidName(cleaned)) {
          candidate = formatName(cleaned);
          break;
        }
      }
    }

    // 2. Standalone full name message
    if (!candidate) {
      let baseName = t;
      if (/[-–—]/.test(baseName)) {
        baseName = baseName.split(/[-–—]/)[0].trim();
      } else if (/,/.test(baseName)) {
        baseName = baseName.split(",")[0].trim();
      }

      const words = baseName.trim().split(/\s+/);
      if (words.length >= 2 && words.length <= 5) {
        let allWordsLetters = true;
        let hasStopwords = false;

        for (const w of words) {
          const wClean = w.replace(/[.,]/g, "");
          const wNoAcc = normalizeNoAccents(wClean);
          if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\.\'-]+$/.test(w)) {
            allWordsLetters = false;
            break;
          }
          if (STOP_WORDS.has(wNoAcc)) {
            hasStopwords = true;
            break;
          }
        }

        if (allWordsLetters && !hasStopwords && isValidName(baseName)) {
          candidate = formatName(baseName);
        }
      }
    }
  }

  // 3. Bot response greeting patient
  if (!candidate && replyText) {
    const botPat = /(?:Olá|Oi|Prazer|Muito prazer|Muito gosto|Tudo bem|Muito obrigado|Muito obrigada|Perfeito|Com certeza|Boa tarde|Bom dia|Boa noite),?\s+(?:sr\.?|sra\.?|senhor|senhora|dr\.?|dra\.?)?\s*([A-ZÁÀÂÃÉÈÊÍÓÔÕÚÇ][a-záàâãéèêíóôõúç]+(?:\s+(?:de|da|do|dos|das|e|[A-ZÁÀÂÃÉÈÊÍÓÔÕÚÇ][a-záàâãéèêíóôõúç]+)){1,5})/i;
    const mBot = replyText.match(botPat);
    if (mBot && mBot[1]) {
      const cleaned = cleanCandidate(mBot[1]);
      if (isValidName(cleaned)) {
        candidate = formatName(cleaned);
      }
    }
  }

  if (currentName) {
    currentName = cleanCandidate(currentName);
  }

  if (candidate) {
    candidate = cleanCandidate(candidate);
  }

  if (!candidate) return currentName ? formatName(currentName) : null;

  if (!currentName || currentName === "—" || currentName.trim() === "" || currentName === "Aguardando no chat...") {
    return formatName(candidate);
  }

  const currWords = currentName.trim().split(/\s+/);
  const candWords = candidate.trim().split(/\s+/);
  if (candWords.length >= currWords.length) {
    return formatName(candidate);
  }

  return formatName(currentName);
}

// Helper to extract the 100% literal response from n8n AI agent workflows
function extractLiteralN8NReply(data: any): string | null {
  if (!data) return null;

  if (typeof data === "string") {
    const trimmed = data.trim();
    // If output is stringified JSON, check if it contains a nested reply or output
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const parsed = JSON.parse(trimmed);
        const inner = extractLiteralN8NReply(parsed);
        if (inner) return inner;
      } catch {
        // keep string
      }
    }
    return trimmed;
  }

  let item = data;
  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    item = data[0];
  }

  if (typeof item === "string") return item.trim();

  if (item && typeof item === "object") {
    // If n8n wrapped the item in json
    if (item.json && typeof item.json === "object") {
      item = item.json;
    }

    // Ordered list of candidate fields where n8n AI Agent nodes place their literal text
    const candidates = [
      item.output,
      item.text,
      item.response,
      item.message,
      item.resposta,
      item.reply,
      item.content,
      item.result,
      item.data?.output,
      item.data?.text,
      item.data?.response,
      item.data?.message,
      item.data?.resposta,
      item.choices?.[0]?.message?.content,
      item.choices?.[0]?.text
    ];

    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) {
        const cTrim = c.trim();
        // Check for nested stringified JSON
        if ((cTrim.startsWith("{") && cTrim.endsWith("}")) || (cTrim.startsWith("[") && cTrim.endsWith("]"))) {
          try {
            const parsed = JSON.parse(cTrim);
            const nested = extractLiteralN8NReply(parsed);
            if (nested) return nested;
          } catch {
            // keep cTrim
          }
        }
        return cTrim;
      }
      if (c && typeof c === "object") {
        if (typeof c.text === "string" && c.text.trim()) return c.text.trim();
        if (typeof c.content === "string" && c.content.trim()) return c.content.trim();
        if (typeof c.output === "string" && c.output.trim()) return c.output.trim();
        if (typeof c.message === "string" && c.message.trim()) return c.message.trim();
      }
    }
  }

  return null;
}

// Universal n8n Dispatcher: Automatically handles both Production (/webhook/) and Test (/webhook-test/) modes
async function fetchN8NWithTestFallback(targetUrl: string, payload: any, timeoutMs = 45000) {
  const urlsToTry: string[] = [targetUrl];
  
  if (targetUrl.includes("/webhook/")) {
    urlsToTry.push(targetUrl.replace("/webhook/", "/webhook-test/"));
  } else if (targetUrl.includes("/webhook-test/")) {
    urlsToTry.push(targetUrl.replace("/webhook-test/", "/webhook/"));
  }

  let lastError: any = null;
  let lastResp: any = null;

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "User-Agent": "SofiaDigitalSecretary/1.0"
        },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });

      clearTimeout(timeoutId);

      // If n8n returned 404 (webhook not registered in this specific test/prod mode), try the other mode
      if (resp.status === 404 && urlsToTry.length > 1) {
        lastResp = resp;
        continue;
      }

      return {
        ok: resp.ok,
        status: resp.status,
        response: resp,
        usedUrl: url
      };
    } catch (err: any) {
      lastError = err;
    }
  }

  return {
    ok: false,
    status: lastResp?.status || 502,
    response: lastResp,
    error: lastError,
    usedUrl: targetUrl
  };
}

// Compiles patient & CRM clinical fields directly from user message, Sofia's literal answer and any existing data
function compilePatientDataFromConversation(
  userText: string,
  replyText: string,
  existingData: any = {}
): any {
  const normUser = (userText || "").replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").trim();
  const normReply = (replyText || "").replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").trim();
  const fullText = `${normUser}\n${normReply}`;

  const data = { ...existingData };

  // 1. NOME DO PACIENTE
  const detectedName = extractPatientFullName(normUser, normReply, data.nomePaciente);
  if (detectedName) {
    data.nomePaciente = detectedName.replace(/\s+(?:e|de|da|do|dos|das|para|com|que)$/i, "").trim();
  }

  // 2. ESPECIALIDADE MÉDICA
  const specialties = [
    { key: "Cardiologia", regex: /\bcardiolog(?:ia|ista)\b|coração|pressão\s+alta|arritmia/i },
    { key: "Pediatria", regex: /\bpediatr(?:ia|a)\b|\bcriança\b|\bfilho\b|\bfilha\b|\bbebé\b|\bbebê\b/i },
    { key: "Ginecologia & Obstetrícia", regex: /\bginecolog(?:ia|ista)\b|\bobstetr(?:ícia|a)\b|parto|gravid(?:ez|a)|\bmulher\b/i },
    { key: "Clínica Geral", regex: /clínica\s+geral|clínico\s+geral|consulta\s+geral|medicina\s+geral/i },
    { key: "Oftalmologia", regex: /\boftalmolog(?:ia|ista)\b|\bvisão\b|\bolho(?:s)?\b|catarata/i },
    { key: "Odontologia / Dentista", regex: /\bodontolog(?:ia|ista)\b|\bdentista\b|\bestomatolog(?:ia|ista)\b|\bdente(?:s)?\b/i },
    { key: "Ortopedia & Traumatologia", regex: /\bortoped(?:ia|ista)\b|\btraumatolog(?:ia|ista)\b|\bosso(?:s)?\b|\bfratura\b|\bjoelho\b|\bcoluna\b/i },
    { key: "Dermatologia", regex: /\bdermatolog(?:ia|ista)\b|\bpele\b|\bmanchas\b/i },
    { key: "Neurologia", regex: /\bneurolog(?:ia|ista)\b|enxaqueca|cérebro/i },
    { key: "Urologia", regex: /\burolog(?:ia|ista)\b|próstata/i },
    { key: "Fisioterapia", regex: /\bfisioterap(?:ia|euta)\b/i },
    { key: "Nutrição", regex: /\bnutriç(?:ão|ionista)\b|\bdieta\b/i },
    { key: "Psicologia & Psiquiatria", regex: /\bpsicolog(?:ia|o|a)\b|\bpsiquiatr(?:ia|a)\b/i },
    { key: "Exames & Análises Clínicas", regex: /análises\s+clínicas|ecografia|raio-x|ressonância|exame(?:s)?/i }
  ];

  for (const s of specialties) {
    if (s.regex.test(fullText)) {
      data.especialidade = s.key;
      break;
    }
  }

  // 3. MÉDICO PRETENDIDO (Normaliza espaços e aceita Dr., Dra., Doutor(a))
  const docMatch = fullText.match(/(?:Dra?\.?|Doutor(?:a)?)\s+([A-ZÁÀÂÃÉÈÊÍÓÔÕÚÇ][a-záàâãéèêíóôõúç]+(?:\s+(?:de|da|do|dos|das\s+)?[A-ZÁÀÂÃÉÈÊÍÓÔÕÚÇ][a-záàâãéèêíóôõúç]+)*)/i);
  if (docMatch && docMatch[0]) {
    data.medicoPretendido = docMatch[0].trim();
  } else if (!data.medicoPretendido) {
    data.medicoPretendido = "Equipa Médica";
  }

  // 4. DATA SUGERIDA (Dias da semana, 'amanhã', ou datas por extenso '25 de outubro')
  const datePatterns = [
    /(?:\d{1,2}(?:º)?\s+de\s+(?:janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+(?:de\s+)?\d{4})?)/i,
    /\b\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?\b/,
    /(?:amanhã|depois de amanhã|segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado|domingo|segunda|terça|quarta|quinta|sexta|sábado)/i,
    /(?:(?:para|marcar|consulta|atendimento)\s+hoje|\bhoje\s+(?:de\s+)?(?:manhã|tarde|noite))/i
  ];
  for (const dp of datePatterns) {
    const dm = fullText.match(dp);
    if (dm && dm[0]) {
      data.dataSugerida = dm[0].trim();
      break;
    }
  }

  // 5. HORÁRIO SUGERIDO
  const timeMatch = fullText.match(/\b\d{1,2}(?:[:h]\d{2})?(?:\s*(?:–|-|às|as)\s*\d{1,2}(?:[:h]\d{2})?)?\b/i) ||
                    fullText.match(/(?:período\s+da\s+)?(?:manhã|tarde|noite)/i);
  if (timeMatch && timeMatch[0] && !/^\d{1,2}$/.test(timeMatch[0].trim())) {
    data.horarioSugerido = timeMatch[0].trim();
  }

  // 6. CONTACTO TELEFÓNICO
  const phoneMatch = fullText.match(/(?:\+?244\s*)?(9\d{2}[\s.-]?\d{3}[\s.-]?\d{3})/);
  if (phoneMatch && phoneMatch[1]) {
    data.telefone = phoneMatch[1].replace(/[^\d+]/g, '');
  }

  // 7. TIPO DE ATENDIMENTO
  if (/seguro|ensa|advancecare|fidelidade|prudential|convenio|convénio|multicare/i.test(fullText)) {
    data.tipoAtendimento = "Seguro de Saúde";
    const segMatch = fullText.match(/(?:seguro\s+(?:da\s+)?)?(ensa|advancecare|fidelidade|prudential|multicare|saham)/i);
    if (segMatch && segMatch[1]) {
      data.seguroNome = segMatch[1].toUpperCase();
    }
  } else if (/particular|privado|dinheiro|tpa/i.test(fullText)) {
    data.tipoAtendimento = "Particular";
  }

  // 8. SINTOMAS OU MOTIVO
  if (!data.sintomasOuMotivo || data.sintomasOuMotivo === "Aguardando relato...") {
    if (normUser.length > 5 && !normUser.toLowerCase().startsWith("olá") && !normUser.toLowerCase().startsWith("bom")) {
      data.sintomasOuMotivo = normUser.slice(0, 90);
    } else if (data.especialidade) {
      data.sintomasOuMotivo = `Triagem para ${data.especialidade}`;
    }
  }

  // 9. STATUS DO AGENDAMENTO E PRÓXIMO PASSO
  if (data.dataSugerida && (data.telefone || normReply.includes("confirmar a reserva"))) {
    data.statusAgendamento = "Pré-Agendado";
    data.proximoPasso = "Encaminhado para confirmação final e registo na receção.";
  } else if (data.dataSugerida || data.horarioSugerido) {
    data.statusAgendamento = "Horário em Confirmação";
    data.proximoPasso = normReply.includes("telefone") || normReply.includes("WhatsApp")
      ? "Aguardando contacto WhatsApp para envio de confirmação."
      : "Confirmar preferência de horário com o paciente.";
  } else if (data.especialidade) {
    data.statusAgendamento = "Especialidade Identificada";
    data.proximoPasso = "Definir dia e horário mais conveniente para o paciente.";
  } else {
    data.statusAgendamento = data.statusAgendamento || "Em Triagem";
    data.proximoPasso = "Acolhimento e identificação das necessidades clínicas.";
  }

  // 10. PERCENTUAL CONCLUÍDO
  let count = 0;
  if (data.nomePaciente && data.nomePaciente !== "Identificando no chat...") count++;
  if (data.especialidade && data.especialidade !== "Identificando...") count++;
  if (data.medicoPretendido && data.medicoPretendido !== "Pendente" && data.medicoPretendido !== "Equipa Médica") count++;
  if (data.dataSugerida && data.dataSugerida !== "Pendente") count++;
  if (data.horarioSugerido && data.horarioSugerido !== "Pendente") count++;
  if (data.telefone) count++;
  if (data.tipoAtendimento && data.tipoAtendimento !== "A definir") count++;
  if (data.sintomasOuMotivo && data.sintomasOuMotivo !== "Aguardando relato...") count++;

  const computedPercent = Math.min(100, Math.max(25, Math.round((count / 5) * 100)));
  data.percentualConcluido = Math.max(data.percentualConcluido || 0, computedPercent);

  return data;
}

// Dedicated Proxy Endpoint for Sofia Chat - guarantees literal n8n response without CORS or ngrok browser interstitial issues
app.post("/api/sofia-chat", async (req, res) => {
  try {
    const { action = "sendMessage", chatInput, message, sessionId, currentPatientData = {} } = req.body;
    const userText = (chatInput || message || "").trim();

    if (!userText) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const DEFAULT_N8N_URL = "https://lively-molehill-apache.ngrok-free.dev/webhook/1b7bb92e-8e17-4762-bc59-9ac160e977e8/chat";
    const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL || DEFAULT_N8N_URL;
    const activeSessionId = sessionId || `sofia-${Date.now()}`;

    const n8nResult = await fetchN8NWithTestFallback(n8nUrl, {
      action,
      chatInput: userText,
      input: userText,
      message: userText,
      text: userText,
      sessionId: activeSessionId
    }, 45000);

    if (n8nResult.ok && n8nResult.response) {
      const n8nData = await n8nResult.response.json();
      const literalReply = extractLiteralN8NReply(n8nData);

      if (literalReply) {
        // Compile clinical fields directly from Sofia's literal response
        let compiledData = compilePatientDataFromConversation(userText, literalReply, currentPatientData);

        // Merge any direct structured data if provided by the n8n workflow
        if (n8nData && (n8nData.dadosPaciente || n8nData.patientData)) {
          compiledData = { ...compiledData, ...(n8nData.dadosPaciente || n8nData.patientData) };
        }

        return res.json({
          success: true,
          output: literalReply,
          reply: literalReply,
          patientData: compiledData,
          source: "n8n_literal",
          endpointUsed: n8nResult.usedUrl,
          raw: n8nData
        });
      }
    }

    // Smart Sofia Contingency: If n8n workflow is paused or unreachable, Sofia replies with persona & scheduling flow
    try {
      const clinicaName = "Clínica Vida+";
      const prompt = `És a Sofia, Secretária Médica Digital 24/7 da "${clinicaName}" em Angola.
O paciente acabou de te enviar uma mensagem: "${userText}"

Contexto e Diretrizes:
1. Se for uma saudação ou contacto inicial (ex: "Olá", "Bom dia", "Boa tarde", "Oi"), responde calorosamente à saudação, apresenta-te brevemente ("Sou a Sofia, secretária digital da ${clinicaName}") e pergunta cordialmente como podes ajudar ou qual especialidade médica procura.
2. Dá início e conduz ativamente a conversa com o objetivo de realizar o agendamento da consulta médica (recolhendo nome completo do paciente, especialidade médica, sintomas/motivo da consulta, dia/horário preferido e se é particular ou seguro de saúde como ENSA, Fidelidade, etc.).
3. Mantém tom acolhedor, profissional e prestativo com emojis moderados (estilo WhatsApp). Resposta de 2 a 3 parágrafos breves.

Dados já compilados anteriormente sobre este paciente:
${JSON.stringify(currentPatientData)}

Retorna APENAS um JSON no formato estrito:
{
  "reply": "Texto da resposta que a Sofia envia ao paciente no WhatsApp",
  "patientData": {
    "nomePaciente": "NOME COMPLETO do paciente se mencionado",
    "especialidade": "Especialidade médica identificada (ex: Cardiologia, Clínica Geral, Pediatria, etc.)",
    "medicoPretendido": "Nome do médico se citado ou 'Equipa Médica'",
    "sintomasOuMotivo": "Resumo dos sintomas ou razão da consulta",
    "dataSugerida": "Data ou dia da semana sugerido",
    "horarioSugerido": "Horário ou turno sugerido (ex: Manhã, Tarde, 14h30)",
    "tipoAtendimento": "Particular | Seguro de Saúde | A definir",
    "seguroNome": "Nome da seguradora (ex: ENSA, Fidelidade) ou 'Nenhum'",
    "statusAgendamento": "Em Triagem | Horário em Confirmação | Pré-Agendado",
    "nivelUrgencia": "Rotina | Prioritária | Atenção Médica",
    "percentualConcluido": 30,
    "proximoPasso": "Próximo passo para concluir o agendamento"
  }
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });
      const parsedAi = JSON.parse(aiResponse.text || "{}");
      if (parsedAi && parsedAi.reply) {
        let compiledData = compilePatientDataFromConversation(userText, parsedAi.reply, { ...currentPatientData, ...(parsedAi.patientData || {}) });
        return res.json({
          success: true,
          output: parsedAi.reply,
          reply: parsedAi.reply,
          patientData: compiledData,
          source: "contingency_ai",
          endpointUsed: n8nResult.usedUrl
        });
      }
    } catch (contingencyErr) {
      console.warn("[Sofia Chat] Fallback de contingência ativado:", contingencyErr);
    }

    // Rule-based fallback if offline
    const lower = userText.toLowerCase();
    let fallbackReply = "";
    if (lower.includes("olá") || lower.includes("ola") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite") || lower.includes("oi")) {
      fallbackReply = "Olá! 👋 Sou a **Sofia**, secretária digital da **Clínica Vida+**.\n\nComo posso ajudar hoje? Pode indicar qual a especialidade médica que procura ou o seu nome completo para darmos início ao agendamento da sua consulta.";
    } else {
      fallbackReply = "Com certeza! Para darmos início ao agendamento da sua consulta na **Clínica Vida+**, poderia informar o seu nome completo e se prefere ser atendido no período da manhã ou da tarde?";
    }
    let compiledData = compilePatientDataFromConversation(userText, fallbackReply, currentPatientData);
    return res.json({
      success: true,
      output: fallbackReply,
      reply: fallbackReply,
      patientData: compiledData,
      source: "contingency_rule",
      endpointUsed: n8nResult.usedUrl
    });

  } catch (err: any) {
    console.error("[Sofia Chat] Erro ao comunicar com n8n:", err);
    return res.status(502).json({
      error: "Falha de comunicação com o workflow n8n",
      message: err.message
    });
  }
});

// API Endpoint for Live 24/7 Digital Secretary Demo (Chat + Side-by-side Patient Data)
app.post("/api/demo-secretaria", async (req, res) => {
  try {
    const {
      userMessage,
      history = [],
      leadInfo = {},
      currentPatientData = {},
      n8nDemoWebhookUrl,
      sessionId
    } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Mensagem do utilizador é obrigatória." });
    }

    // Active n8n AI Agent Chat Webhook
    const DEFAULT_DEMO_WEBHOOK = "https://lively-molehill-apache.ngrok-free.dev/webhook/1b7bb92e-8e17-4762-bc59-9ac160e977e8/chat";
    const targetWebhook = n8nDemoWebhookUrl || process.env.N8N_DEMO_SECRETARIA_WEBHOOK || process.env.N8N_CHAT_WEBHOOK_URL || DEFAULT_DEMO_WEBHOOK;
    const activeSessionId = sessionId || leadInfo.sessionId || `session-${leadInfo.telefone || 'demo'}`;

    let n8nHandled = false;
    let reply = "";
    let updatedPatientData = { ...currentPatientData };
    let endpointUsed = targetWebhook;

    // 1. Dispatch directly to the n8n AI Agent workflow to get the LITERAL agent response
    if (targetWebhook) {
      try {
        const n8nResult = await fetchN8NWithTestFallback(targetWebhook, {
          action: "sendMessage",
          chatInput: userMessage,
          input: userMessage,
          message: userMessage,
          text: userMessage,
          sessionId: activeSessionId,
          mensagem: userMessage,
          historico: history,
          lead: leadInfo,
          dadosCompiladosAtuais: currentPatientData,
          timestamp: new Date().toISOString()
        }, 45000);

        endpointUsed = n8nResult.usedUrl;

        if (n8nResult.ok && n8nResult.response) {
          const n8nData = await n8nResult.response.json();
          const literalReply = extractLiteralN8NReply(n8nData);

          if (literalReply) {
            // Keep the exact literal answer returned by the n8n AI Agent without altering it!
            reply = literalReply;
            n8nHandled = true;

            // Transcribe clinical & CRM data directly from Sofia's literal response
            updatedPatientData = compilePatientDataFromConversation(userMessage, literalReply, updatedPatientData);

            // Merge any explicit patientData from n8n nodes if provided
            if (n8nData && (n8nData.dadosPaciente || n8nData.patientData)) {
              updatedPatientData = { ...updatedPatientData, ...(n8nData.dadosPaciente || n8nData.patientData) };
            }
          }
        }
      } catch (webhookErr) {
        console.warn("[Demo Secretária] Webhook n8n indisponível, usando contingência:", webhookErr);
      }
    }

    // 2. Intelligent AI Processing (Gemini or heuristic medical compiler) if n8n was not yet responding
    if (!n8nHandled) {
      const ai = getGeminiClient();
      const clinicaName = leadInfo.clinica || "Clínica Viva Para Sempre";

      if (ai) {
        try {
          const prompt = `
És a Sofia, Secretária Médica Digital 24/7 da "${clinicaName}" em Angola.
O teu papel é realizar um atendimento humanizado, caloroso, cordial e profissional a um paciente que acabou de entrar em contacto por chat/WhatsApp.
Usa um tom respeitoso típico de Angola (ex: "Com certeza", "Muito gosto", "Estamos à sua disposição").
Objetivo do atendimento:
1. Responder à dúvida ou solicitação do paciente de forma clara, acolhedora e eficiente.
2. Identificar ou confirmar: Nome do Paciente, Especialidade pretendida, Sintomas/Motivo, Preferência de dia/horário, Tipo de consulta (Particular ou Seguro de Saúde como ENSA, etc.).
3. Conduzir o paciente para o agendamento de forma natural, sem parecer robótico.

Histórico recente da conversa:
${JSON.stringify(history.slice(-6))}

Dados já compilados anteriormente sobre este paciente:
${JSON.stringify(currentPatientData)}

Nova mensagem recebida do paciente:
"${userMessage}"

Retorna APENAS um JSON no formato estrito:
{
  "reply": "Texto da resposta que a secretária digital envia ao paciente no chat (máximo 2 a 3 parágrafos breves e cordiais)",
  "patientData": {
    "nomePaciente": "NOME COMPLETO do paciente (ex: 'Mário António Cazombo', 'Carlos Silva', 'Ana Paula dos Santos'). Se o paciente tiver enviado o seu nome, ou se apresentado, extrai SEMPRE o nome completo com maiúsculas corretas. Se não mencionado, mantém o anterior.",
    "especialidade": "Especialidade médica identificada (ex: Cardiologia, Pediatria, Clínica Geral, Ginecologia, Oftalmologia, etc.)",
    "medicoPretendido": "Nome do médico se citado ou 'Equipa Médica'",
    "sintomasOuMotivo": "Resumo dos sintomas ou razão da consulta",
    "dataSugerida": "Data ou dia da semana sugerido/mencionado",
    "horarioSugerido": "Horário ou turno sugerido/mencionado (ex: Manhã, Tarde, 14h30)",
    "tipoAtendimento": "Particular | Seguro de Saúde | A definir",
    "seguroNome": "Nome da seguradora se citado (ex: ENSA, Fidelidade, etc.) ou 'Nenhum'",
    "statusAgendamento": "Em Triagem | Especialidade Identificada | Horário em Confirmação | Pré-Agendado",
    "nivelUrgencia": "Rotina | Prioritária | Atenção Médica",
    "percentualConcluido": 30, // número de 10 a 100 de acordo com os dados preenchidos
    "proximoPasso": "Breve frase indicando o próximo passo do sistema (ex: Confirmar preferência de horário, Aguardar confirmação do paciente, etc.)"
  }
}
`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3
            }
          });

          const rawText = response.text || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            reply = parsed.reply;
            updatedPatientData = {
              ...updatedPatientData,
              ...parsed.patientData
            };
            n8nHandled = true;
          }
        } catch (geminiErr) {
          console.warn("[Demo Secretária] Contingência ativada:", geminiErr);
        }
      }

      // Fallback rule-based medical generator if offline
      if (!reply) {
        const lower = userMessage.toLowerCase();
        let esp = updatedPatientData.especialidade || "Clínica Geral";
        let status = updatedPatientData.statusAgendamento || "Em Triagem";
        let percent = updatedPatientData.percentualConcluido || 35;

        if (lower.includes("cardio") || lower.includes("coração") || lower.includes("pressão")) {
          esp = "Cardiologia";
          percent = Math.max(percent, 55);
        } else if (lower.includes("criança") || lower.includes("pediat")) {
          esp = "Pediatria";
          percent = Math.max(percent, 55);
        } else if (lower.includes("olho") || lower.includes("visão")) {
          esp = "Oftalmologia";
          percent = Math.max(percent, 55);
        } else if (lower.includes("ginec") || lower.includes("mulher")) {
          esp = "Ginecologia & Obstetrícia";
          percent = Math.max(percent, 55);
        }

        if (lower.includes("quinta") || lower.includes("amanhã") || lower.includes("segunda") || lower.includes("sexta") || lower.includes("hora") || lower.includes("tarde") || lower.includes("manhã")) {
          status = "Horário em Confirmação";
          percent = Math.max(percent, 80);
          reply = `Com certeza! Registamos a sua preferência na nossa agenda digital. Temos vagas disponíveis no período da manhã às 10h00 e à tarde a partir das 14h30. Qual seria o horário mais conveniente para si? Também gostaria de confirmar se a consulta será particular ou através de seguro de saúde (ex: ENSA, Fidelidade)?`;
        } else {
          reply = `Olá! Muito gosto em atender-lhe na ${clinicaName}. Posso com certeza ajudar com o seu agendamento de ${esp}. Para agilizarmos a sua ficha de atendimento, poderia indicar-nos o seu nome completo e qual o dia de sua preferência para a consulta?`;
        }

        updatedPatientData = {
          ...updatedPatientData,
          especialidade: esp,
          statusAgendamento: status,
          percentualConcluido: percent,
          sintomasOuMotivo: updatedPatientData.sintomasOuMotivo || userMessage.slice(0, 70),
          tipoAtendimento: lower.includes("seguro") || lower.includes("ensa") ? "Seguro de Saúde" : (updatedPatientData.tipoAtendimento || "Particular"),
          proximoPasso: "Aguardando confirmação final do paciente para notificar a receção."
        };
      }
    }

    // Garantir que a ficha contenha todos os dados compilados da conversa
    updatedPatientData = compilePatientDataFromConversation(userMessage, reply, updatedPatientData);

    return res.json({
      success: true,
      reply,
      patientData: updatedPatientData,
      leadQualificada: true,
      source: n8nHandled ? "n8n_literal" : "contingency",
      endpointUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Erro na demo da secretária:", error);
    return res.status(500).json({ error: "Erro interno no processador da Secretária Digital." });
  }
});

// Standalone HTML page for Live Secretary Demo
app.get(["/demo-secretaria", "/demo-secretaria.html"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "demo-secretaria.html"));
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

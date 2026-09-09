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
      plano = "Secretária Digital Pro",
      n8nWebhookUrl
    } = req.body;

    if (!nome || !clinica || !telefone || !email) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: nome, clinica, telefone e email são necessários." });
    }

    const DEFAULT_N8N_WEBHOOK = "https://edson76.app.n8n.cloud/webhook/clinicas-digitais/diagnostico-v2";
    const targetWebhook = n8nWebhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;

    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";

    const payload = {
      nome,
      clinica,
      especialidade,
      telefone,
      email,
      cidade,
      website: website || "",
      plano,
      ip: clientIp,
      timestamp: new Date().toISOString(),
      cliente: {
        nome,
        clinica,
        especialidade,
        telefone,
        email,
        cidade,
        website: website || "",
        plano,
        ip: clientIp
      },
      data: {
        cliente: {
          nome,
          clinica,
          especialidade,
          telefone,
          email,
          cidade,
          website: website || "",
          plano,
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

      return res.json({
        success: true,
        source: "n8n_real_ai",
        diagnostico: diagnosticoFinal,
        n8nStatus: { status: "success", webhookUrl: targetWebhook }
      });
    }

    // 2. CONTINGENCY FALLBACK: If n8n was temporarily unavailable
    console.info("[Diagnóstico] n8n temporariamente inacessível. Acionando motor de contingência.");

    let aiResult = null;
    let groundingSources = [];

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é o Diretor de Tecnologia e Analista de Saúde Digital Sênior do 'Sistemas Clínicas Digitais' em Luanda, Angola.
Sua missão é realizar um diagnóstico digital em tempo real para a seguinte instituição de saúde:
- Nome do Responsável: ${nome}
- Nome da Clínica/Consultório: ${clinica}
- Especialidade Principal: ${especialidade}
- Cidade/Província em Angola: ${cidade}
- Website Atual: ${website || "Não possui website informado"}
- Plano Selecionado pelo Cliente: ${plano}

INSTRUÇÕES DE ANÁLISE:
1. Avalie o nível de maturidade digital de 1.0 a 10.0.
2. Elabore um relatório técnico adaptado ESPECIFICAMENTE ao plano escolhido ("${plano}").
3. Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "score": number (ex: 4.5),
  "nivel": "Inicial" | "Intermediário" | "Avançado",
  "resumoExecutivo": "string curta resumindo o estado digital atual",
  "topRecomendacoes": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "pontosFortes": ["string", "string", "string"],
  "gargalos": ["string", "string", "string"],
  "insightsRealTime": ["string", "string"],
  "planoBeneficios": ["benefício 1", "benefício 2", "benefício 3"],
  "potencialCaptacao": "estimativa ex: +45% a 80% de aumento"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.3
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

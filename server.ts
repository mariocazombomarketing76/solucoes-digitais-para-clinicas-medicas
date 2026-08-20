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
1. Use a ferramenta Google Search para pesquisar na web sobre a presença digital, Google Business, redes sociais ou registros online para "${clinica}" em ${cidade}, Angola no segmento de ${especialidade}.
2. Com base nas informações encontradas (ou na ausência delas), avalie o nível de maturidade digital de 1.0 a 10.0.
3. Elabore um relatório técnico adaptado ESPECIFICAMENTE ao plano escolhido ("${plano}"):
   - Se Plano Start (Secretária Digital Start): Foco em website institucional, e-mail profissional, presença inicial e confiança.
   - Se Plano Pro (Secretária Digital Pro): Foco em SEO Local no Google Angola, landing pages por especialidade, formulários inteligentes e triagem no WhatsApp.
   - Se Plano Elite (Secretária Digital Elite): Foco em atendimento inteligente com Inteligência Artificial no WhatsApp 24/7, automação total de agendamento e captação em escala.
4. Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "score": number (ex: 3.8),
  "resumoExecutivo": "string curta resumindo o estado digital atual",
  "pontosFortes": ["string", "string", "string"],
  "gargalos": ["string", "string", "string"],
  "insightsRealTime": ["string com observação concreta da pesquisa em Angola", "string"],
  "planoBeneficios": ["como o plano ${plano} resolve diretamente o gargalo 1", "benefício 2 do plano", "benefício 3 do plano"],
  "potencialCaptacao": "estimativa ex: +45% a 80% de aumento nos agendamentos de consulta"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.3
          }
        });

        const rawText = response.text || "";
        
        // Extract grounding sources if present
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && Array.isArray(chunks)) {
          groundingSources = chunks
            .filter((c: any) => c.web)
            .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        }

        // Clean JSON fence if present
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        }
      } catch (err: any) {
        console.error("Erro ao chamar Gemini API:", err?.message || err);
      }
    }

    // Fallback dynamic generator if AI key is absent or failed
    if (!aiResult) {
      const isElite = plano.includes("Elite");
      const isPro = plano.includes("Pro");
      
      aiResult = {
        score: isElite ? 4.8 : isPro ? 3.9 : 3.2,
        resumoExecutivo: `Análise técnica preliminar executada para ${clinica} em ${cidade}. Identificado alto potencial de crescimento com implementação do plano ${plano}.`,
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

    // Trigger n8n Webhook if configured or provided
    let n8nResult = { status: "not_configured", webhookUrl: "" };
    const targetWebhook = n8nWebhookUrl || process.env.N8N_WEBHOOK_URL;

    if (targetWebhook) {
      try {
        const webhookResponse = await fetch(targetWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "diagnostico_submetido",
            data: diagnosticoFinal
          })
        });

        n8nResult = {
          status: webhookResponse.ok ? "success" : `failed_http_${webhookResponse.status}`,
          webhookUrl: targetWebhook
        };
      } catch (wErr: any) {
        console.error("Erro ao enviar webhook para n8n:", wErr?.message || wErr);
        n8nResult = {
          status: "error_connecting",
          webhookUrl: targetWebhook
        };
      }
    }

    return res.json({
      success: true,
      diagnostico: diagnosticoFinal,
      n8nStatus: n8nResult
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

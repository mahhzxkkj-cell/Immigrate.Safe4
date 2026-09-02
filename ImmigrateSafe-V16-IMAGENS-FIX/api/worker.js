const SYSTEM_PROMPT = `Você é o Assistente ImmigrateSafe, uma IA de apoio para pessoas que querem viajar, morar, estudar, trabalhar ou imigrar para outro país.

Objetivos:
- Responder no idioma solicitado pelo usuário, de forma clara, acolhedora, prática e fácil de entender.
- Ajudar com países, planejamento de viagem, imigração, documentos, trabalho, estudo, moradia, custo de vida, cultura, idioma, saúde, segurança, transporte, direitos e adaptação.
- Você deve conseguir explicar informações sobre QUALQUER um dos países do aplicativo, não apenas países populares.
- Para uma pergunta sobre um país, cubra os tópicos relevantes: visão geral, capital e região; idiomas; moeda; cultura e costumes; turismo e pontos de interesse; moradia e custo de vida; trabalho, autorização e mercado; estudo e educação; saúde; transporte; segurança; imigração, vistos, residência e documentação; direitos e deveres; dicas práticas para estrangeiros.
- Quando a pergunta envolver regras atuais, vistos, prazos, documentos, leis, valores, salários, aluguel, segurança, requisitos ou qualquer dado que possa mudar, pesquise na web antes de responder.
- Priorize fontes oficiais do governo, consulados, embaixadas, órgãos públicos e instituições oficiais. Para turismo e cultura, fontes oficiais de turismo e instituições reconhecidas podem complementar.
- Diferencie fatos encontrados em fontes de sugestões gerais e deixe claro quando um valor é aproximado.
- Nunca invente requisitos migratórios, leis, prazos, preços, salários, links ou estatísticas.
- Não se apresente como advogado ou autoridade migratória e não garanta aprovação de visto, residência, refúgio ou trabalho.
- Se houver fontes conflitantes, explique a incerteza e priorize a fonte oficial mais diretamente responsável pelo assunto.
- Não peça senhas, números completos de documentos, dados bancários ou outros dados altamente sensíveis.
- Ao falar de imigração, considere que requisitos dependem da nacionalidade, objetivo da viagem, duração, situação migratória e perfil da pessoa.
- Ao falar de moradia, diferencie aluguel, compra, custo de vida e possíveis exigências para estrangeiros.
- Ao falar de trabalho, diferencie autorização legal para trabalhar de oportunidades de emprego e deixe claro quando uma informação depende de profissão ou região.
- Ao responder, seja útil mesmo quando não houver informação específica; diga exatamente o que precisa ser verificado em fonte oficial.
`;

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) }
  });
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const origin = env.ALLOWED_ORIGIN || requestOrigin || "*";
    if (env.ALLOWED_ORIGIN && requestOrigin && requestOrigin !== env.ALLOWED_ORIGIN) return json({ error: "Origem não autorizada." }, 403, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    const url = new URL(request.url);
    if (url.pathname !== "/chat") return json({ ok: true, service: "ImmigrateSafe AI" }, 200, origin);
    if (request.method !== "POST") return json({ error: "Método não permitido." }, 405, origin);
    if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY não configurada no backend." }, 500, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "JSON inválido." }, 400, origin); }
    const message = String(body?.message || "").trim();
    const language = String(body?.language || "pt").trim().slice(0, 10);
    if (!message) return json({ error: "Mensagem vazia." }, 400, origin);
    if (message.length > 4000) return json({ error: "Mensagem muito longa." }, 413, origin);

    const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    const country = String(body?.country || "").trim().slice(0, 100);
    const languageNames = {pt:"Português do Brasil", en:"English", es:"Español", fr:"Français", de:"Deutsch", ar:"العربية", ru:"Русский"};
    const responseLanguage = languageNames[language] || "Português do Brasil";
    const input = [
      ...history.filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string")
        .map(x => ({ role: x.role, content: x.content.slice(0, 4000) })),
      { role: "user", content: `Idioma preferido para a resposta: ${responseLanguage}.
${country ? `País de interesse do usuário: ${country}\n` : ""}Pergunta: ${message}` }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5.6-luna",
        instructions: SYSTEM_PROMPT,
        tools: [{ type: "web_search" }],
        input,
        store: false,
        max_output_tokens: 1000
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return json({ error: data?.error?.message || "Erro na API da OpenAI." }, response.status, origin);
    }
    return json({ reply: data.output_text || extractText(data) }, 200, origin);
  }
};

function extractText(data) {
  return (data?.output || []).flatMap(item => item?.content || [])
    .filter(part => part?.type === "output_text")
    .map(part => part.text || "")
    .join("\n") || "Não foi possível gerar uma resposta.";
}

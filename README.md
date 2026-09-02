# ImmigrateSafe AI — backend seguro

O GitHub Pages hospeda somente o frontend. Para conversar com o GPT sem expor a chave da OpenAI no navegador, este projeto usa um Cloudflare Worker como proxy seguro.

## 1. Pré-requisitos

- Conta na OpenAI com API habilitada e créditos/billing configurados.
- Conta no Cloudflare.
- Node.js + Wrangler.

A implementação usa a Responses API da OpenAI e o modelo `gpt-5.6-luna`. O Worker habilita `web_search` para perguntas que dependem de informação atual, especialmente países, imigração, vistos, turismo e regras que podem mudar.

## 2. Configurar a chave

Dentro de `api/`:

```bash
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
```

Cole sua chave quando o terminal solicitar.

Opcionalmente:

```bash
npx wrangler secret put ALLOWED_ORIGIN
```

Informe a URL pública do GitHub Pages, por exemplo:
`https://SEU-USUARIO.github.io/SEU-REPOSITORIO`

## 3. Publicar

```bash
cd api
npx wrangler deploy
```

O Cloudflare exibirá uma URL parecida com:
`https://immigratesafe-ai.SEU_USUARIO.workers.dev`

## 4. Ligar o aplicativo ao Worker

Abra `../config.js` e coloque:

```js
window.IM_API_URL = "https://SEU-WORKER.workers.dev";
```

Depois publique novamente o frontend no GitHub Pages.

## Segurança

NUNCA coloque `OPENAI_API_KEY` em `app.js`, `config.js`, HTML ou qualquer arquivo publicado no GitHub. A chave deve existir somente como secret do backend.

## O que o backend faz

- Recebe a pergunta do aplicativo.
- Envia contexto básico do usuário quando disponível.
- Usa a Responses API.
- Pode usar busca na web para dados atuais.
- Prioriza fontes oficiais para assuntos migratórios.
- Retorna a resposta para o chat do ImmigrateSafe.
- Não grava a conversa na API (`store: false`).

As informações migratórias exibidas pelo app são orientações gerais e devem ser confirmadas em fontes oficiais.

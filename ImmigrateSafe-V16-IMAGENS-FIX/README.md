# ImmigrateSafe 🇧🇷🌎
**Seu caminho seguro** — Informação. Apoio. Oportunidade. Segurança.

Aplicação mobile-first/PWA criada para o hackathon. O projeto é 100% estático e compatível com **GitHub Pages**, sem servidor obrigatório.

## O que já funciona
- Splash screen com identidade ImmigrateSafe.
- Home mobile com acesso rápido e progresso.
- Explorar países com busca e filtros por continente/região.
- 196 entradas de países/territórios na base local.
- Modal de país com categorias de preparação e atalhos para fontes governamentais em destinos selecionados.
- Processos: criar, salvar, visualizar progresso e excluir.
- Trabalho: pesquisa, filtros, detalhes e salvar vagas.
- Comunidade: aviso oficial inicial + criação/publicação de discussões persistidas localmente.
- IA demonstrativa: respostas por intenção, preparada para futura API.
- Área “Faça a diferença”.
- Perfil editável, notificações locais e limpeza de dados.
- Persistência com `localStorage`.
- PWA com `manifest.webmanifest` + `sw.js`.
- Workflow automático de GitHub Pages em `.github/workflows/pages.yml`.

## Rodar localmente
Não é necessário Node.js.

### Opção 1 — VS Code
1. Abra a pasta no VS Code.
2. Use uma extensão de servidor local (ex.: Live Server) ou qualquer servidor HTTP local.
3. Abra `index.html` pelo servidor.

> O Service Worker exige HTTPS ou `localhost`. No GitHub Pages ele funcionará normalmente.

### Opção 2 — Python
```bash
python -m http.server 8000
```
Depois abra `http://localhost:8000`.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para a branch `main`.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, selecione **GitHub Actions**.
5. O workflow `pages.yml` fará o deploy automaticamente após um push.

## Observações de segurança
A IA e os dados de países nesta versão são uma experiência demonstrativa. O aplicativo deliberadamente não inventa requisitos, prazos ou decisões migratórias. Regras devem ser confirmadas nas autoridades oficiais competentes.

As vagas também são demonstrativas. Não trate os dados como anúncios reais sem verificar a empresa.

## Estrutura
```text
ImmigrateSafe/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── assets/
│   ├── logo.png
│   ├── icon-192.png
│   └── icon-512.png
└── .github/
    └── workflows/
        └── pages.yml
```

## 🤖 GPT real no ImmigrateSafe

O frontend não contém a chave da OpenAI. Para ativar o chat real:

1. Publique `api/worker.js` no Cloudflare Workers.
2. Crie o secret `OPENAI_API_KEY` no Worker.
3. Opcionalmente crie `ALLOWED_ORIGIN` com a URL do seu GitHub Pages.
4. Copie a URL do Worker para `config.js` em `window.IM_API_URL`.
5. Faça novo deploy do GitHub Pages.

O Worker usa a OpenAI Responses API, `gpt-5.6-luna` e busca na web para informações atuais. Nunca publique sua chave no GitHub.


## v6 — visual refresh
- Login screen is shown for new v6 sessions (old v2 local session no longer skips it).
- Stronger splash, hero, button, card and AI animations.
- Country cards use flag images with fallback and richer country guidance.
- Cache-busting is enabled so GitHub Pages is less likely to serve the previous UI.
- GPT integration remains through the secure Cloudflare Worker; the OpenAI key is never stored in the frontend.


## V6
- A nova versão força a tela de login na primeira abertura, removendo sessões antigas v2/v3.
- Não existe mais perfil padrão de Ana Silva.
- Bandeiras mostram emoji imediatamente e tentam carregar a imagem da bandeira quando houver internet.
- O suporte ao backend GPT continua em `api/worker.js`; a chave deve ser configurada como secret no Cloudflare Worker.

## V8 — Idiomas e IA internacional
- Seletor de idioma no menu: Português, English, Español, Français, Deutsch, العربية e Русский.
- Idioma é salvo no navegador e o app recarrega preservando a conta.
- O Assistente envia o idioma escolhido ao backend.
- A IA foi configurada para pesquisar na web quando necessário e responder sobre qualquer país do catálogo, cobrindo imigração, documentos, moradia, custo de vida, trabalho, educação, cultura, idioma, turismo, saúde, transporte, segurança, direitos e adaptação.
- A chave OpenAI continua somente no Secret do backend; nunca coloque a chave no frontend.

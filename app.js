const STORE = {
  processes:"ims_processes_v1", discussions:"ims_discussions_v1", profile:"ims_profile_v1", savedJobs:"ims_saved_jobs_v1", notify:"ims_notify_v1", countryGoals:"ims_country_goals_v1"
};
const demoProcesses = [
  {id:crypto.randomUUID?.()||Date.now()+"a",name:"Solicitação de Refúgio",status:"Em andamento",date:"12/08/2026",next:"Acompanhar atualização do processo",progress:70},
  {id:crypto.randomUUID?.()||Date.now()+"b",name:"Registro migratório",status:"Documentação",date:"20/08/2026",next:"Revisar documentos",progress:42}
];
const jobs = [
 {id:1,title:"Assistente Administrativo",company:"Oportunidade Demo",location:"São Paulo, SP",mode:"Presencial",salary:"Faixa a confirmar",tags:["Administrativo","Júnior"]},
 {id:2,title:"Atendimento bilíngue",company:"Conexão Global",location:"Brasil",mode:"Remoto",salary:"Faixa a confirmar",tags:["Idiomas","Atendimento"]},
 {id:3,title:"Auxiliar de logística",company:"Rede de Talentos",location:"Curitiba, PR",mode:"Presencial",salary:"Faixa a confirmar",tags:["Operacional","CLT"]},
 {id:4,title:"Suporte ao cliente",company:"Trabalho Flexível",location:"Brasil",mode:"Meio período",salary:"Faixa a confirmar",tags:["Suporte","Meio período"]}
];
const officialLinks = {
 "Brasil":"https://www.gov.br/mj/pt-br/assuntos/migracoes",
 "Estados Unidos":"https://travel.state.gov/",
 "Portugal":"https://www.portugal.gov.pt/",
 "Alemanha":"https://www.auswaertiges-amt.de/",
 "Canadá":"https://www.canada.ca/",
 "Japão":"https://www.mofa.go.jp/",
 "Austrália":"https://www.dfat.gov.au/",
 "África do Sul":"https://www.gov.za/"
};
const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
let state = { route:"home", exploreRegion:"Todos", exploreQuery:"", jobMode:"Todos", jobQuery:"" };

function get(key,fallback){try{const x=JSON.parse(localStorage.getItem(key));return x??fallback}catch{return fallback}}
function set(key,val){localStorage.setItem(key,JSON.stringify(val))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function flag(code){const emoji=flagEmoji(code); return `<span class="flag-local" role="img" aria-label="Bandeira">${emoji}</span>`}
function flagEmoji(code){if(code==="XK") return "🏳️"; return [...code].map(c=>String.fromCodePoint(127397+c.charCodeAt())).join("")}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=msg;document.getElementById("toast-root").appendChild(el);setTimeout(()=>el.remove(),2600)}
function routeTo(route){state.route=route;location.hash="#/"+route;closeDrawer();render()}

/* V8 — idiomas do aplicativo. O texto base continua em PT-BR e as traduções são aplicadas no DOM. */
const LANGS={pt:'Português',en:'English',es:'Español',fr:'Français',de:'Deutsch',ar:'العربية',ru:'Русский'};
const I18N={
 en:{
  'Seu caminho seguro':'Your safe journey','Informação • Apoio • Oportunidade • Segurança':'Information • Support • Opportunity • Safety','🔐 ACESSO SEGURO':'🔐 SECURE ACCESS','Comece sua jornada':'Start your journey','Entre ou crie sua conta para acessar orientação, países, processos, oportunidades e a IA.':'Sign in or create an account to access guidance, countries, processes, opportunities and AI.','Entrar':'Sign in','Criar conta':'Create account','E-mail':'Email','Senha':'Password','Mostrar':'Show','Ocultar':'Hide','Entrar no ImmigrateSafe':'Enter ImmigrateSafe','Entrar no modo demonstração':'Enter demo mode','Nome':'Name','País de interesse':'Country of interest','Escolha depois':'Choose later','Criar minha jornada':'Create my journey','Conta demonstrativa: os dados ficam neste dispositivo. Não use senhas reais.':'Demo account: data stays on this device. Do not use real passwords.','Início':'Home','Explorar':'Explore','Processos':'Processes','Trabalho':'Work','Comunidade':'Community','Explorar países':'Explore countries','Oportunidades':'Opportunities','Faça a diferença':'Make a difference','IA ImmigrateSafe':'ImmigrateSafe AI','Perfil e configurações':'Profile & settings','Idioma':'Language','Alterar o idioma do aplicativo':'Change app language','Sua conta':'Your account','Faça login para personalizar':'Sign in to personalize','Olá! 👋':'Hello! 👋','Como podemos ajudar hoje?':'How can we help today?','Informação, apoio e oportunidades para você tomar decisões com mais segurança.':'Information, support and opportunities to help you make safer decisions.','✦ Conversar com a IA':'✦ Talk to AI','Acesso rápido':'Quick access','Mais usados':'Most used','Documentação':'Documents','Organize seus documentos':'Organize your documents','Prazos e processos':'Deadlines & processes','Acompanhe etapas':'Track steps','Encontre oportunidades':'Find opportunities','Moradia':'Housing','Planeje seu recomeço':'Plan your fresh start','Saúde':'Health','Informação e orientação':'Information & guidance','Converse e compartilhe':'Talk and share','Sua jornada':'Your journey','Ver processos →':'View processes →','Impacto real':'Real impact','Conhecer iniciativas':'Explore initiatives','Explorar países':'Explore countries','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'Search a destination and discover culture, language, tourism and practical information.','Buscar país...':'Search country...','Toque para abrir o guia completo':'Tap to open the full guide','Nenhum país encontrado':'No country found','Tente outro nome ou remova o filtro.':'Try another name or remove the filter.','Guia do país':'Country guide','Informações gerais + fontes para pesquisa':'General information + research sources','DESTINO':'DESTINATION','Quer saber algo específico?':'Want to know something specific?','Perguntar à IA ✦':'Ask AI ✦','Buscando dados públicos do país…':'Fetching public country data…','Documentação e imigração':'Documents & immigration','Pontos turísticos':'Tourist attractions','Cultura':'Culture','Idioma':'Language','Trabalho':'Work','Educação':'Education','Moradia e custo':'Housing & cost','Saúde':'Health','IA ImmigrateSafe':'ImmigrateSafe AI','Pergunte sobre países, viagem, imigração e sua jornada.':'Ask about countries, travel, immigration and your journey.','Assistente ImmigrateSafe':'ImmigrateSafe Assistant','GPT conectado • pesquisa na web disponível':'GPT connected • web research available','Modo demonstração • configure a API para ativar o GPT':'Demo mode • configure the API to enable GPT','Morar em Portugal':'Live in Portugal','Trabalhar no Canadá':'Work in Canada','Comparar países':'Compare countries','➤':'➤','Perfil':'Profile','Editar':'Edit','Abrir':'Open','Limpar':'Clear','Sair da conta':'Sign out','Falar com a IA':'Talk to AI','Cancelar':'Cancel','Salvar':'Save'
 },
 es:{'Seu caminho seguro':'Tu camino seguro','Informação • Apoio • Oportunidade • Segurança':'Información • Apoyo • Oportunidad • Seguridad','🔐 ACESSO SEGURO':'🔐 ACCESO SEGURO','Comece sua jornada':'Comienza tu viaje','Entrar':'Iniciar sesión','Criar conta':'Crear cuenta','E-mail':'Correo electrónico','Senha':'Contraseña','Mostrar':'Mostrar','Ocultar':'Ocultar','Entrar no ImmigrateSafe':'Entrar en ImmigrateSafe','Entrar no modo demonstração':'Entrar en modo demo','Nome':'Nombre','País de interesse':'País de interés','Escolha depois':'Elegir después','Criar minha jornada':'Crear mi viaje','Início':'Inicio','Explorar':'Explorar','Processos':'Procesos','Trabalho':'Trabajo','Comunidade':'Comunidad','Explorar países':'Explorar países','Oportunidades':'Oportunidades','Faça a diferença':'Marca la diferencia','IA ImmigrateSafe':'IA ImmigrateSafe','Perfil e configurações':'Perfil y configuración','Idioma':'Idioma','Alterar o idioma do aplicativo':'Cambiar idioma de la app','Sua conta':'Tu cuenta','Faça login para personalizar':'Inicia sesión para personalizar','Olá! 👋':'¡Hola! 👋','Como podemos ajudar hoje?':'¿Cómo podemos ayudarte hoy?','Acesso rápido':'Acceso rápido','Documentação':'Documentación','Prazos e processos':'Plazos y procesos','Trabalho':'Trabajo','Moradia':'Vivienda','Saúde':'Salud','Comunidade':'Comunidad','Sua jornada':'Tu viaje','Ver processos →':'Ver procesos →','Impacto real':'Impacto real','Conhecer iniciativas':'Conocer iniciativas','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'Busca un destino y descubre cultura, idioma, turismo e información práctica.','Buscar país...':'Buscar país...','Nenhum país encontrado':'No se encontró ningún país','Guia do país':'Guía del país','DESTINO':'DESTINO','Quer saber algo específico?':'¿Quieres saber algo específico?','Perguntar à IA ✦':'Preguntar a la IA ✦','Documentação e imigração':'Documentación e inmigración','Pontos turísticos':'Lugares turísticos','Cultura':'Cultura','Idioma':'Idioma','Trabalho':'Trabajo','Educação':'Educación','Moradia e custo':'Vivienda y costo','Saúde':'Salud','Pergunte sobre países, viagem, imigração e sua jornada.':'Pregunta sobre países, viajes, inmigración y tu recorrido.','Assistente ImmigrateSafe':'Asistente ImmigrateSafe','GPT conectado • pesquisa na web disponível':'GPT conectado • búsqueda web disponible','Modo demonstração • configure a API para ativar o GPT':'Modo demo • configura la API para activar GPT','Morar em Portugal':'Vivir en Portugal','Trabalhar no Canadá':'Trabajar en Canadá','Comparar países':'Comparar países','Perfil':'Perfil','Editar':'Editar','Abrir':'Abrir','Limpar':'Borrar','Sair da conta':'Cerrar sesión','Falar com a IA':'Hablar con la IA','Cancelar':'Cancelar','Salvar':'Guardar'},
 fr:{'Seu caminho seguro':'Votre parcours sécurisé','Informação • Apoio • Oportunidade • Segurança':'Information • Soutien • Opportunité • Sécurité','🔐 ACESSO SEGURO':'🔐 ACCÈS SÉCURISÉ','Comece sua jornada':'Commencez votre parcours','Entrar':'Se connecter','Criar conta':'Créer un compte','E-mail':'E-mail','Senha':'Mot de passe','Mostrar':'Afficher','Ocultar':'Masquer','Entrar no ImmigrateSafe':'Entrer dans ImmigrateSafe','Entrar no modo demonstração':'Mode démo','Nome':'Nom','País de interesse':'Pays d’intérêt','Escolha depois':'Choisir plus tard','Criar minha jornada':'Créer mon parcours','Início':'Accueil','Explorar':'Explorer','Processos':'Dossiers','Trabalho':'Travail','Comunidade':'Communauté','Explorar países':'Explorer les pays','Oportunidades':'Opportunités','Faça a diferença':'Agir pour aider','IA ImmigrateSafe':'IA ImmigrateSafe','Perfil e configurações':'Profil et réglages','Idioma':'Langue','Alterar o idioma do aplicativo':'Changer la langue de l’application','Sua conta':'Votre compte','Faça login para personalizar':'Connectez-vous pour personnaliser','Olá! 👋':'Bonjour ! 👋','Como podemos ajudar hoje?':'Comment pouvons-nous vous aider aujourd’hui ?','Acesso rápido':'Accès rapide','Documentação':'Documents','Prazos e processos':'Délais et dossiers','Trabalho':'Travail','Moradia':'Logement','Saúde':'Santé','Comunidade':'Communauté','Sua jornada':'Votre parcours','Ver processos →':'Voir les dossiers →','Impacto real':'Impact réel','Conhecer iniciativas':'Découvrir les initiatives','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'Recherchez une destination et découvrez culture, langue, tourisme et informations pratiques.','Buscar país...':'Rechercher un pays...','Nenhum país encontrado':'Aucun pays trouvé','Guia do país':'Guide du pays','DESTINO':'DESTINATION','Quer saber algo específico?':'Vous voulez savoir quelque chose ?','Perguntar à IA ✦':'Demander à l’IA ✦','Documentação e imigração':'Documents et immigration','Pontos turísticos':'Sites touristiques','Cultura':'Culture','Idioma':'Langue','Trabalho':'Travail','Educação':'Éducation','Moradia e custo':'Logement et coût','Saúde':'Santé','Pergunte sobre países, viagem, imigração e sua jornada.':'Posez vos questions sur les pays, les voyages et l’immigration.','Assistente ImmigrateSafe':'Assistant ImmigrateSafe','GPT conectado • pesquisa na web disponível':'GPT connecté • recherche web disponible','Modo demonstração • configure a API para ativar o GPT':'Mode démo • configurez l’API pour activer GPT','Morar em Portugal':'Vivre au Portugal','Trabalhar no Canadá':'Travailler au Canada','Comparar países':'Comparer les pays','Perfil':'Profil','Editar':'Modifier','Abrir':'Ouvrir','Limpar':'Effacer','Sair da conta':'Se déconnecter','Falar com a IA':'Parler à l’IA','Cancelar':'Annuler','Salvar':'Enregistrer'},
 de:{'Seu caminho seguro':'Dein sicherer Weg','Informação • Apoio • Oportunidade • Segurança':'Information • Unterstützung • Chancen • Sicherheit','🔐 ACESSO SEGURO':'🔐 SICHERER ZUGANG','Comece sua jornada':'Starte deine Reise','Entrar':'Anmelden','Criar conta':'Konto erstellen','E-mail':'E-Mail','Senha':'Passwort','Mostrar':'Anzeigen','Ocultar':'Ausblenden','Entrar no ImmigrateSafe':'ImmigrateSafe öffnen','Entrar no modo demonstração':'Demo-Modus','Nome':'Name','País de interesse':'Zielland','Escolha depois':'Später wählen','Criar minha jornada':'Meine Reise starten','Início':'Startseite','Explorar':'Entdecken','Processos':'Vorgänge','Trabalho':'Arbeit','Comunidade':'Community','Explorar países':'Länder entdecken','Oportunidades':'Chancen','Faça a diferença':'Helfen','IA ImmigrateSafe':'ImmigrateSafe KI','Perfil e configurações':'Profil & Einstellungen','Idioma':'Sprache','Alterar o idioma do aplicativo':'App-Sprache ändern','Sua conta':'Dein Konto','Faça login para personalizar':'Anmelden zum Personalisieren','Olá! 👋':'Hallo! 👋','Como podemos ajudar hoje?':'Wie können wir heute helfen?','Acesso rápido':'Schnellzugriff','Documentação':'Dokumente','Prazos e processos':'Fristen & Vorgänge','Trabalho':'Arbeit','Moradia':'Wohnen','Saúde':'Gesundheit','Comunidade':'Community','Sua jornada':'Deine Reise','Ver processos →':'Vorgänge ansehen →','Impacto real':'Echte Wirkung','Conhecer iniciativas':'Initiativen entdecken','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'Suche ein Ziel und entdecke Kultur, Sprache, Tourismus und praktische Informationen.','Buscar país...':'Land suchen...','Nenhum país encontrado':'Kein Land gefunden','Guia do país':'Länderleitfaden','DESTINO':'ZIEL','Quer saber algo específico?':'Möchtest du etwas Bestimmtes wissen?','Perguntar à IA ✦':'KI fragen ✦','Documentação e imigração':'Dokumente & Einwanderung','Pontos turísticos':'Sehenswürdigkeiten','Cultura':'Kultur','Idioma':'Sprache','Trabalho':'Arbeit','Educação':'Bildung','Moradia e custo':'Wohnen & Kosten','Saúde':'Gesundheit','Pergunte sobre países, viagem, imigração e sua jornada.':'Frage zu Ländern, Reisen und Einwanderung.','Assistente ImmigrateSafe':'ImmigrateSafe Assistent','GPT conectado • pesquisa na web disponível':'GPT verbunden • Websuche verfügbar','Modo demonstração • configure a API para ativar o GPT':'Demo-Modus • API für GPT konfigurieren','Morar em Portugal':'In Portugal leben','Trabalhar no Canadá':'In Kanada arbeiten','Comparar países':'Länder vergleichen','Perfil':'Profil','Editar':'Bearbeiten','Abrir':'Öffnen','Limpar':'Löschen','Sair da conta':'Abmelden','Falar com a IA':'Mit KI sprechen','Cancelar':'Abbrechen','Salvar':'Speichern'},
 ar:{'Seu caminho seguro':'طريقك الآمن','Informação • Apoio • Oportunidade • Segurança':'معلومات • دعم • فرص • أمان','🔐 ACESSO SEGURO':'🔐 دخول آمن','Comece sua jornada':'ابدأ رحلتك','Entrar':'تسجيل الدخول','Criar conta':'إنشاء حساب','E-mail':'البريد الإلكتروني','Senha':'كلمة المرور','Mostrar':'إظهار','Ocultar':'إخفاء','Entrar no ImmigrateSafe':'الدخول إلى ImmigrateSafe','Entrar no modo demonstração':'الدخول التجريبي','Nome':'الاسم','País de interesse':'بلد الاهتمام','Escolha depois':'اختيار لاحقًا','Criar minha jornada':'إنشاء رحلتي','Início':'الرئيسية','Explorar':'استكشاف','Processos':'الإجراءات','Trabalho':'العمل','Comunidade':'المجتمع','Explorar países':'استكشاف البلدان','Oportunidades':'الفرص','Faça a diferença':'ساهم في التغيير','IA ImmigrateSafe':'ذكاء ImmigrateSafe','Perfil e configurações':'الملف والإعدادات','Idioma':'اللغة','Alterar o idioma do aplicativo':'تغيير لغة التطبيق','Sua conta':'حسابك','Faça login para personalizar':'سجّل الدخول للتخصيص','Olá! 👋':'مرحبًا! 👋','Como podemos ajudar hoje?':'كيف يمكننا مساعدتك اليوم؟','Acesso rápido':'وصول سريع','Documentação':'المستندات','Prazos e processos':'المواعيد والإجراءات','Trabalho':'العمل','Moradia':'السكن','Saúde':'الصحة','Comunidade':'المجتمع','Sua jornada':'رحلتك','Ver processos →':'عرض الإجراءات →','Impacto real':'تأثير حقيقي','Conhecer iniciativas':'اكتشف المبادرات','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'ابحث عن وجهة واكتشف الثقافة واللغة والسياحة والمعلومات العملية.','Buscar país...':'ابحث عن بلد...','Nenhum país encontrado':'لم يتم العثور على بلد','Guia do país':'دليل البلد','DESTINO':'الوجهة','Quer saber algo específico?':'هل تريد معرفة شيء محدد؟','Perguntar à IA ✦':'اسأل الذكاء الاصطناعي ✦','Documentação e imigração':'المستندات والهجرة','Pontos turísticos':'المعالم السياحية','Cultura':'الثقافة','Idioma':'اللغة','Trabalho':'العمل','Educação':'التعليم','Moradia e custo':'السكن والتكلفة','Saúde':'الصحة','Pergunte sobre países, viagem, imigração e sua jornada.':'اسأل عن البلدان والسفر والهجرة ورحلتك.','Assistente ImmigrateSafe':'مساعد ImmigrateSafe','GPT conectado • pesquisa na web disponível':'GPT متصل • البحث على الويب متاح','Modo demonstração • configure a API para ativar o GPT':'الوضع التجريبي • اضبط API لتفعيل GPT','Morar em Portugal':'العيش في البرتغال','Trabalhar no Canadá':'العمل في كندا','Comparar países':'مقارنة البلدان','Perfil':'الملف الشخصي','Editar':'تعديل','Abrir':'فتح','Limpar':'مسح','Sair da conta':'تسجيل الخروج','Falar com a IA':'التحدث مع الذكاء الاصطناعي','Cancelar':'إلغاء','Salvar':'حفظ'},
 ru:{'Seu caminho seguro':'Ваш безопасный путь','Informação • Apoio • Oportunidade • Segurança':'Информация • Поддержка • Возможности • Безопасность','🔐 ACESSO SEGURO':'🔐 БЕЗОПАСНЫЙ ВХОД','Comece sua jornada':'Начните свой путь','Entrar':'Войти','Criar conta':'Создать аккаунт','E-mail':'Электронная почта','Senha':'Пароль','Mostrar':'Показать','Ocultar':'Скрыть','Entrar no ImmigrateSafe':'Войти в ImmigrateSafe','Entrar no modo demonstração':'Демо-режим','Nome':'Имя','País de interesse':'Интересующая страна','Escolha depois':'Выбрать позже','Criar minha jornada':'Создать мой путь','Início':'Главная','Explorar':'Обзор','Processos':'Процессы','Trabalho':'Работа','Comunidade':'Сообщество','Explorar países':'Страны','Oportunidades':'Возможности','Faça a diferença':'Помочь','IA ImmigrateSafe':'ИИ ImmigrateSafe','Perfil e configurações':'Профиль и настройки','Idioma':'Язык','Alterar o idioma do aplicativo':'Изменить язык приложения','Sua conta':'Ваш аккаунт','Faça login para personalizar':'Войдите для настройки','Olá! 👋':'Здравствуйте! 👋','Como podemos ajudar hoje?':'Чем мы можем помочь сегодня?','Acesso rápido':'Быстрый доступ','Documentação':'Документы','Prazos e processos':'Сроки и процессы','Trabalho':'Работа','Moradia':'Жильё','Saúde':'Здоровье','Comunidade':'Сообщество','Sua jornada':'Ваш путь','Ver processos →':'Открыть процессы →','Impacto real':'Реальное влияние','Conhecer iniciativas':'Узнать о инициативах','Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.':'Найдите страну и узнайте о культуре, языке, туризме и практической информации.','Buscar país...':'Поиск страны...','Nenhum país encontrado':'Страна не найдена','Guia do país':'Гид по стране','DESTINO':'НАПРАВЛЕНИЕ','Quer saber algo específico?':'Хотите узнать что-то конкретное?','Perguntar à IA ✦':'Спросить ИИ ✦','Documentação e imigração':'Документы и иммиграция','Pontos turísticos':'Достопримечательности','Cultura':'Культура','Idioma':'Язык','Trabalho':'Работа','Educação':'Образование','Moradia e custo':'Жильё и стоимость','Saúde':'Здоровье','Pergunte sobre países, viagem, imigração e sua jornada.':'Спрашивайте о странах, поездках, иммиграции и вашем пути.','Assistente ImmigrateSafe':'Ассистент ImmigrateSafe','GPT conectado • pesquisa na web disponível':'GPT подключён • веб-поиск доступен','Modo demonstração • configure a API para ativar o GPT':'Демо-режим • настройте API для GPT','Morar em Portugal':'Жить в Португалии','Trabalhar no Canadá':'Работать в Канаде','Comparar países':'Сравнить страны','Perfil':'Профиль','Editar':'Изменить','Abrir':'Открыть','Limpar':'Очистить','Sair da conta':'Выйти','Falar com a IA':'Поговорить с ИИ','Cancelar':'Отмена','Salvar':'Сохранить'}
};
function currentLang(){return localStorage.getItem('ims_language_v1')||'pt'}
function translateDOM(lang=currentLang()){
 const map=I18N[lang]||{}; const root=document.body;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
   const n=walker.currentNode, v=n.nodeValue.trim();
   if(map[v]) n.nodeValue=n.nodeValue.replace(v,map[v]);
 }
 root.querySelectorAll('[placeholder]').forEach(el=>{if(map[el.getAttribute('placeholder')])el.setAttribute('placeholder',map[el.getAttribute('placeholder')])});
 root.querySelectorAll('[aria-label]').forEach(el=>{if(map[el.getAttribute('aria-label')])el.setAttribute('aria-label',map[el.getAttribute('aria-label')])});
 document.documentElement.lang=lang==='pt'?'pt-BR':lang;
 document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 const sel=document.getElementById('languageSelect');if(sel)sel.value=lang;
}
function initLanguage(){
 const sel=document.getElementById('languageSelect'); if(!sel)return;
 sel.value=currentLang(); sel.onchange=()=>{localStorage.setItem('ims_language_v1',sel.value);location.reload()};
 setTimeout(()=>translateDOM(),0);
}

function render(){ 
  const r=state.route;
  if(r==="home") renderHome(); else if(r==="explore") renderExplore(); else if(r==="map") renderMap(); else if(r==="goals") renderCountryGoals(); else if(r==="processes") renderProcesses();
  else if(r==="jobs") renderJobs(); else if(r==="community") renderCommunity(); else if(r==="ai") renderAI();
  else if(r==="support") renderSupport(); else if(r==="profile") renderProfile(); else renderHome();
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.route===r));
  app.focus({preventScroll:true});
  if(r==="home") updateHomeGoal();
  setTimeout(()=>translateDOM(),0);
}
function renderHome(){
 const processes=get(STORE.processes,demoProcesses);
 const pct=processes.length?Math.round(processes.reduce((a,b)=>a+b.progress,0)/processes.length):0;
 app.innerHTML=`
 <section class="hero">
  <div class="eyebrow">ImmigrateSafe • Seu caminho seguro</div>
  <h1>Olá! 👋<br>Como podemos ajudar hoje?</h1>
  <p>Informação, apoio e oportunidades para você tomar decisões com mais segurança.</p>
  <button class="primary" data-route="ai">✦ Conversar com a IA</button>
 </section>
 <div class="section"><div class="section-title"><h2>Acesso rápido</h2><small>Mais usados</small></div>
  <div class="quick-grid">
   ${quick("▤","Documentação","Organize seus documentos","processes")}
   ${quick("◷","Prazos e processos","Acompanhe etapas","processes")}
   ${quick("▣","Trabalho","Encontre oportunidades","jobs")}
   ${quick("⌂","Moradia","Planeje seu recomeço","support")}
   ${quick("♡","Saúde","Informação e orientação","support")}
   ${quick("♧","Comunidade","Converse e compartilhe","community")}
  </div>
 </div>
 <div class="section"><div class="section-title"><h2>Sua jornada</h2><small>${pct}% em andamento</small></div>
  <div class="progress-card"><div class="progress-row"><b>Visão geral</b><span class="tiny muted">${processes.length} processo(s)</span></div>
   <div class="progress-bar"><i style="width:${Math.max(4,pct)}%"></i></div>
   <div class="progress-row"><span class="tiny muted">Continue de onde parou</span><button class="ghost" data-route="processes">Ver processos →</button></div>
  </div>
 </div>
 <div class="section"><div class="support-card"><div class="eyebrow" style="color:var(--cyan);opacity:1">Impacto real</div><h3>Faça a diferença</h3><p>Conheça formas responsáveis de apoiar pessoas migrantes e refugiadas por meio de projetos e organizações.</p><button class="secondary" data-route="support">Conhecer iniciativas</button></div></div>
 <div class="section tiny muted" style="text-align:center;padding:0 12px">⚠️ O ImmigrateSafe é uma ferramenta de apoio. Regras migratórias podem mudar; confirme informações em fontes oficiais.</div>`;
}
function quick(icon,title,sub,route){return `<button class="quick" data-route="${route}"><span class="qicon">${icon}</span><b>${title}</b><small>${sub}</small></button>`}

const REGION_LABELS={pt:{Todos:"Todos",América:"América",Europa:"Europa",Ásia:"Ásia",África:"África",Oceania:"Oceania"},en:{Todos:"All",América:"Americas",Europa:"Europe",Ásia:"Asia",África:"Africa",Oceania:"Oceania"},es:{Todos:"Todos",América:"América",Europa:"Europa",Ásia:"Asia",África:"África",Oceania:"Oceanía"},fr:{Todos:"Tous",América:"Amériques",Europa:"Europe",Ásia:"Asie",África:"Afrique",Oceania:"Océanie"},de:{Todos:"Alle",América:"Amerika",Europa:"Europa",Ásia:"Asien",África:"Afrika",Oceania:"Ozeanien"},ar:{Todos:"الكل",América:"الأمريكتان",Europa:"أوروبا",Ásia:"آسيا",África:"أفريقيا",Oceania:"أوقيانوسيا"},ru:{Todos:"Все",América:"Америка",Europa:"Европа",Ásia:"Азия",África:"Африка",Oceania:"Океания"}};
function regionLabel(r){return (REGION_LABELS[currentLang()]||REGION_LABELS.pt)[r]||r}

function getCountryGoals(){return get(STORE.countryGoals,{target:3,selected:[],completed:[]})}
function saveCountryGoals(g){set(STORE.countryGoals,g)}
function goalProgress(g){return Math.min(g.target, g.completed.length)}
function countryGoalCard(g){
 const done=goalProgress(g), pct=Math.round((done/Math.max(1,g.target))*100);
 if(!g.selected.length) return `<div class="goal-card-inner"><div class="goal-icon">🌎</div><div class="goal-copy"><b>Crie sua meta de países</b><small>Escolha países que você quer conhecer, morar ou explorar.</small></div><button class="primary" data-route="goals">Começar</button></div>`;
 return `<div class="goal-card-inner"><div class="goal-icon">🎯</div><div class="goal-copy"><b>${done}/${g.target} países concluídos</b><small>${esc(g.selected.slice(0,4).join(" • "))}${g.selected.length>4?' • …':''}</small><div class="goal-progress"><i style="width:${pct}%"></i></div></div><button class="secondary" data-route="goals">Gerenciar</button></div>`;
}
function updateHomeGoal(){const el=document.getElementById('homeGoalCard');if(el)el.innerHTML=countryGoalCard(getCountryGoals())}
function renderCountryGoals(){
 const g=getCountryGoals();
 app.innerHTML=`<div class="country-header"><div><div class="eyebrow">MINHA JORNADA</div><h1 class="page-title">🎯 Meta de países</h1><p class="page-sub">Monte uma lista de destinos e acompanhe quantos você já concluiu.</p></div></div>
 <div class="goal-hero"><div class="goal-big">${goalProgress(g)}<small>/ ${g.target}</small></div><div><b>Países concluídos</b><p>Marque um destino como concluído quando sua meta for alcançada.</p></div></div>
 <div class="section"><div class="section-title"><h2>Sua meta</h2><span class="tiny muted">${g.selected.length} selecionados</span></div><div class="goal-form"><label>Quero completar <select id="goalTarget">${[1,3,5,10,15,20,30].map(n=>`<option value="${n}" ${g.target===n?'selected':''}>${n} países</option>`).join('')}</select></label><button class="primary" id="saveGoalTarget">Salvar meta</button></div></div>
 <div class="section"><div class="section-title"><h2>Escolher países</h2><span class="tiny muted">Clique para adicionar</span></div><div class="search country-search"><span>⌕</span><input id="goalSearch" placeholder="Buscar país..." autocomplete="off"></div><div id="goalCountryList" class="country-list"></div></div>
 <div class="section"><div class="section-title"><h2>Minha lista</h2></div><div id="goalSelectedList" class="goal-selected-list"></div></div>`;
 const target=document.getElementById('goalTarget');
 document.getElementById('saveGoalTarget').onclick=()=>{g.target=Number(target.value)||3;saveCountryGoals(g);renderCountryGoals();toast('Meta atualizada! 🎯')};
 const list=document.getElementById('goalCountryList'), search=document.getElementById('goalSearch');
 function paint(){const q=search.value.trim().toLowerCase();const arr=COUNTRIES.filter(c=>(c.name+' '+c.en).toLowerCase().includes(q)).slice(0,18);list.innerHTML=arr.map(c=>{const sel=g.selected.includes(c.name),done=g.completed.includes(c.name);return `<button class="country-card goal-country ${sel?'goal-added':''}" data-goal-country="${esc(c.name)}"><span class="flag-photo">${flag(c.code)}</span><span class="country-copy"><h3>${esc(c.name)}</h3><p>${regionLabel(c.region)} • ${esc(c.en)}</p></span><span class="goal-mark">${done?'✓':sel?'＋':'＋'}</span></button>`}).join('')||`<div class="empty"><div class="empty-icon">🌎</div><h3>Nenhum país encontrado</h3></div>`}
 function paintSelected(){const el=document.getElementById('goalSelectedList');el.innerHTML=g.selected.length?g.selected.map(name=>{const c=COUNTRIES.find(x=>x.name===name);const done=g.completed.includes(name);return `<div class="goal-selected"><span>${c?flagEmoji(c.code):'🌎'}</span><b>${esc(name)}</b><button class="ghost" data-complete-country="${esc(name)}">${done?'✓ Concluído':'Concluir'}</button><button class="close" data-remove-country="${esc(name)}">×</button></div>`}).join(''):`<div class="empty small-empty"><div class="empty-icon">🧭</div><h3>Nenhum país na meta</h3><p>Escolha alguns acima para começar.</p></div>`}
 list.addEventListener('click',e=>{const b=e.target.closest('[data-goal-country]');if(!b)return;const name=b.dataset.goalCountry;if(!g.selected.includes(name)){g.selected.push(name);saveCountryGoals(g)}paint();paintSelected();});
 document.getElementById('goalSelectedList').addEventListener('click',e=>{const done=e.target.closest('[data-complete-country]'),rem=e.target.closest('[data-remove-country]');if(done){const n=done.dataset.completeCountry;if(g.completed.includes(n))g.completed=g.completed.filter(x=>x!==n);else g.completed.push(n);saveCountryGoals(g);paint();paintSelected()}if(rem){const n=rem.dataset.removeCountry;g.selected=g.selected.filter(x=>x!==n);g.completed=g.completed.filter(x=>x!==n);saveCountryGoals(g);paint();paintSelected()}});
 search.addEventListener('input',paint);paint();paintSelected();
}

function renderExplore(){
 const regions=["Todos","América","Europa","Ásia","África","Oceania"];
 let arr=COUNTRIES.filter(c=>(state.exploreRegion==="Todos"||c.region===state.exploreRegion)&&
  (c.name.toLowerCase().includes(state.exploreQuery.toLowerCase())||c.en.toLowerCase().includes(state.exploreQuery.toLowerCase())));
 app.innerHTML=`
 <div class="country-header"><div><h1 class="page-title">Explorar países</h1><p class="page-sub">Pesquise um destino e descubra cultura, idioma, turismo e informações práticas.</p></div><span class="live-pill">● Guia vivo</span></div>
 <button class="map-launch" data-route="map"><span>🌎</span><div><b>Explorar no mapa-múndi</b><small>Clique em qualquer país para abrir seu guia</small></div><strong>→</strong></button>
 <div class="search country-search"><span>⌕</span><input id="countrySearch" value="${esc(state.exploreQuery)}" placeholder="Buscar país..." autocomplete="off"><button id="clearCountry" aria-label="Limpar">×</button></div>
 <div class="chips">${regions.map(x=>`<button class="chip ${x===state.exploreRegion?"active":""}" data-region="${x}">${regionLabel(x)}</button>`).join("")}</div>
 <div class="country-toolbar"><span>${arr.length} país(es)</span><span>Toque para abrir o guia completo</span></div>
 <div class="country-list">${arr.map(c=>`<button class="country-card enhanced" data-country="${esc(c.name)}">
   <span class="flag-photo">${flag(c.code)}</span><span class="country-copy"><h3>${esc(c.name)}</h3><p>${regionLabel(c.region)} • ${esc(c.en)}</p><small>🌍 Guia • cultura • idioma • turismo</small></span><span class="chev">›</span>
 </button>`).join("")}</div>
 ${!arr.length?`<div class="empty"><div class="empty-icon">🌎</div><h3>Nenhum país encontrado</h3><p>Tente outro nome ou remova o filtro.</p></div>`:""}`;
 document.getElementById("countrySearch").addEventListener("input",e=>{state.exploreQuery=e.target.value;renderExplore()});
 document.getElementById("clearCountry").onclick=()=>{state.exploreQuery="";renderExplore()};
 document.querySelectorAll("[data-region]").forEach(b=>b.onclick=()=>{state.exploreRegion=b.dataset.region;renderExplore()});
 document.querySelectorAll("[data-country]").forEach(b=>b.onclick=()=>openCountry(b.dataset.country));
}


function renderMap(){
 app.innerHTML=`
 <section class="section map-page">
  <div class="country-header"><div><div class="eyebrow">EXPLORAÇÃO GLOBAL</div><h1>Mapa-múndi 🌎</h1><p>Selecione um país para abrir informações de moradia, cultura, trabalho, imigração e muito mais.</p></div></div>
  <div class="map-tools"><div class="search map-search"><span>⌕</span><input id="mapSearch" placeholder="Buscar país no mapa..." autocomplete="off"></div><button class="secondary" id="mapReset">⟳ Recentrar</button></div>
  <div id="mapSuggestions" class="map-suggestions hidden"></div>
  <div id="mapSelected" class="map-selected hidden"><span class="map-selected-flag">🌎</span><div><small>País selecionado</small><b id="mapSelectedName">—</b></div><button id="mapOpenSelected" class="primary">Abrir guia</button></div>
  <div class="world-map-card"><div id="worldMap" class="world-map"><div class="map-loading"><span class="spinner"></span><b>Carregando mapa-múndi…</b></div></div><div id="mapTooltip" class="map-tooltip hidden"></div><div class="map-hint">🖱️ Passe o mouse para ver o país • Clique para selecionar • Arraste para mover • Use a roda para zoom</div></div>
  <div class="map-legend"><span><i class="legend-dot"></i> País disponível</span><span>196 países no ImmigrateSafe</span></div>
 </section>`;
 const search=document.getElementById('mapSearch'), suggestions=document.getElementById('mapSuggestions');
 const selectedBox=document.getElementById('mapSelected'), selectedName=document.getElementById('mapSelectedName'), selectedFlag=document.querySelector('.map-selected-flag');
 window.__imsMapSelect=(c)=>{if(!c)return;search.value=c.name;selectedBox.classList.remove('hidden');selectedName.textContent=c.name;selectedFlag.textContent=flagEmoji(c.code);document.getElementById('mapOpenSelected').onclick=()=>openCountry(c.name);};
 search.addEventListener('input',()=>{
   const q=search.value.trim().toLowerCase();
   if(!q){suggestions.classList.add('hidden'); return;}
   const found=COUNTRIES.filter(c=>(c.name+' '+c.en+' '+c.code).toLowerCase().includes(q)).slice(0,7);
   suggestions.innerHTML=found.map(c=>`<button class="map-suggestion" data-map-country="${esc(c.name)}">${flagEmoji(c.code)} <span>${esc(c.name)}</span><small>${regionLabel(c.region)}</small></button>`).join('');
   suggestions.classList.toggle('hidden',!found.length);
 });
 suggestions.addEventListener('click',e=>{const b=e.target.closest('[data-map-country]');if(!b)return;search.value=b.dataset.mapCountry;suggestions.classList.add('hidden');focusMapCountry(b.dataset.mapCountry)});
 document.getElementById('mapReset').onclick=()=>window.__imsMap?.reset();
 loadWorldMap();
}

const MAP_URL='https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
function normalizeCountryName(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}
function mapCountryFromFeature(f){
 const p=f.properties||{}; const code=String(p.ISO_A2||p.ISO_A2_EH||p.iso_a2||'').toUpperCase();
 let c=COUNTRIES.find(x=>x.code===code); if(c)return c;
 const n=normalizeCountryName(p.ADMIN||p.NAME||p.name||p.SOVEREIGNT);
 const aliases={'unitedstatesofamerica':'Estados Unidos','unitedstates':'Estados Unidos','russianfederation':'Rússia','russia':'Rússia','southkorea':'Coreia do Sul','northkorea':'Coreia do Norte','czechia':'Tchéquia','czechrepublic':'Tchéquia','vietnam':'Vietnã','laopeoplesdemocraticrepublic':'Laos','laos':'Laos','bolivia':'Bolívia','venezuela':'Venezuela','tanzania':'Tanzânia','democraticrepublicofthecongo':'República Democrática do Congo','republicofthecongo':'República do Congo','ivorycoast':'Costa do Marfim','cotedivoire':'Costa do Marfim','capeverde':'Cabo Verde','eswatini':'Eswatini','brunei':'Brunei','timorleste':'Timor-Leste','palestine':'Palestina','kosovo':'Kosovo','turkiye':'Turquia','turkey':'Turquia','myanmar':'Mianmar','moldova':'Moldávia','iranislamicrepublicof':'Irã','iran':'Irã','syria':'Síria','syrianarabrepublic':'Síria'};
 const target=aliases[n]||p.ADMIN||p.NAME||'';
 return COUNTRIES.find(x=>normalizeCountryName(x.en)===n||normalizeCountryName(x.name)===normalizeCountryName(target));
}
function equirectPath(geom,w=1000,h=500){
 const pt=(p)=>[(p[0]+180)/360*w,(90-p[1])/180*h];
 const ring=r=>r.map((p,i)=>{const [x,y]=pt(p);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ')+' Z';
 if(geom.type==='Polygon')return geom.coordinates.map(ring).join(' ');
 if(geom.type==='MultiPolygon')return geom.coordinates.flatMap(poly=>poly.map(ring)).join(' ');
 return '';
}
async function loadWorldMap(){
 const root=document.getElementById('worldMap'); if(!root)return;
 try{
   const res=await fetch(MAP_URL,{cache:'force-cache'}); if(!res.ok)throw new Error('map');
   const geo=await res.json(); drawWorldMap(root,geo);
 }catch(e){
   root.innerHTML=`<div class="map-error"><span>🌎</span><b>Não foi possível carregar o mapa agora.</b><small>Verifique a conexão com a internet e tente novamente.</small><button class="secondary" onclick="renderMap()">Tentar novamente</button></div>`;
 }
}
function drawWorldMap(root,geo){
 const W=1000,H=500, useD3=window.d3&&d3.geoNaturalEarth1;
 const projection=useD3?d3.geoNaturalEarth1().fitSize([W,H],geo):null;
 const pathGen=useD3?d3.geoPath(projection):null;
 const paths=geo.features.map((f,i)=>{
   const c=mapCountryFromFeature(f); const d=useD3?pathGen(f):equirectPath(f.geometry,W,H);
   return {f,c,d,i};
 }).filter(x=>x.d);
 root.innerHTML=`<svg class="world-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa-múndi interativo"><g id="mapViewport">${paths.map(x=>`<path class="world-country ${x.c?'available':''}" data-country-code="${x.c?.code||''}" data-country-name="${esc(x.c?.name||x.f.properties?.ADMIN||'')}" d="${x.d}"></path>`).join('')}</g></svg>`;
 const svg=root.querySelector('svg'), viewport=root.querySelector('#mapViewport'); let scale=1,tx=0,ty=0,drag=false,sx=0,sy=0;
 function apply(){viewport.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`)}
 function reset(){scale=1;tx=0;ty=0;apply();root.querySelectorAll('.world-country').forEach(p=>p.classList.remove('selected'));document.getElementById('mapSelected')?.classList.add('hidden');const ms=document.getElementById('mapSearch');if(ms)ms.value='';}
 window.__imsMap={reset};
 const tooltip=document.getElementById('mapTooltip');
 root.querySelectorAll('.world-country.available').forEach(p=>{
  p.addEventListener('mouseenter',e=>{tooltip.textContent=p.dataset.countryName;tooltip.classList.remove('hidden');positionTooltip(e)});
  p.addEventListener('mousemove',positionTooltip);
  p.addEventListener('mouseleave',()=>tooltip.classList.add('hidden'));
  p.addEventListener('click',()=>{const c=COUNTRIES.find(x=>x.code===p.dataset.country-code)||COUNTRIES.find(x=>x.name===p.dataset.countryName);if(!c)return;root.querySelectorAll('.world-country').forEach(x=>x.classList.remove('selected'));p.classList.add('selected');window.__imsMapSelect?.(c);tooltip.textContent=c.name;openCountry(c.name)});
 });
 function positionTooltip(e){const rect=root.getBoundingClientRect();tooltip.style.left=(e.clientX-rect.left+12)+'px';tooltip.style.top=(e.clientY-rect.top+12)+'px';}
 svg.addEventListener('wheel',e=>{e.preventDefault();const old=scale;scale=Math.max(.8,Math.min(5,scale*(e.deltaY<0?1.16:.86)));const rect=svg.getBoundingClientRect();const mx=(e.clientX-rect.left)/rect.width*W,my=(e.clientY-rect.top)/rect.height*H;tx=mx-(mx-tx)*scale/old;ty=my-(my-ty)*scale/old;apply()},{passive:false});
 svg.addEventListener('pointerdown',e=>{drag=true;sx=e.clientX;sy=e.clientY;svg.setPointerCapture(e.pointerId);svg.classList.add('dragging')});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const rect=svg.getBoundingClientRect();tx+=(e.clientX-sx)/rect.width*W;ty+=(e.clientY-sy)/rect.height*H;sx=e.clientX;sy=e.clientY;apply()});
 svg.addEventListener('pointerup',()=>{drag=false;svg.classList.remove('dragging')});
 svg.addEventListener('pointercancel',()=>{drag=false;svg.classList.remove('dragging')});
}
function focusMapCountry(name){
 const c=COUNTRIES.find(x=>x.name===name); if(!c)return;
 const p=document.querySelector(`.world-country[data-country-code="${c.code}"]`); if(p){document.querySelectorAll('.world-country').forEach(x=>x.classList.remove('selected'));p.classList.add('selected');window.__imsMapSelect?.(c);p.scrollIntoView({block:'nearest'});setTimeout(()=>openCountry(c.name),220)} else {window.__imsMapSelect?.(c);openCountry(c.name);}
}

async function openCountry(name){
 const c=COUNTRIES.find(x=>x.name===name); if(!c)return;
 modalRoot.innerHTML=`<div class="modal-wrap"><section class="modal country-modal">
   <div class="modal-head"><button class="back-modal" id="closeModal">←</button><div><h2>Guia do país</h2><small class="muted">Informações gerais + fontes para pesquisa</small></div><button class="close" id="closeModalX">×</button></div>
   <div class="country-cover"><div class="country-flag-large">${flag(c.code)}</div><div><span class="eyebrow">DESTINO</span><h1>${esc(c.name)}</h1><p>${regionLabel(c.region)} • ${esc(c.en)}</p></div></div>
   <div class="country-ai-banner"><div><b>Quer saber algo específico?</b><p>Pergunte ao Assistente ImmigrateSafe sobre ${esc(c.name)}.</p></div><button class="primary" id="askCountryAI">Perguntar à IA ✦</button></div>
   <div id="countryLiveData" class="country-live"><div class="country-loading"><span class="spinner"></span><b>Buscando dados públicos do país…</b><small>Idioma, moeda, capital, população e outros dados.</small></div></div>
   <div class="detail-grid">
    ${detailBox("🛂","Documentação e imigração","Use o Assistente para orientar sua pesquisa e confirme requisitos atuais em autoridades oficiais. O aplicativo não inventa regras de visto.")}
    ${detailBox("🏛️","Pontos turísticos","Descubra lugares conhecidos, patrimônio e experiências. Para recomendações atuais, peça à IA para pesquisar fontes confiáveis.")}
    ${detailBox("🎭","Cultura","Costumes, etiqueta, gastronomia e contexto cultural podem variar por região. Use a IA para aprofundar.")}
    ${detailBox("🗣️","Idioma","Veja os idiomas oficiais e peça exemplos de frases úteis para sua chegada.")}
    ${detailBox("💼","Trabalho","Pesquise mercado, autorização e canais oficiais de emprego antes de tomar decisões.")}
    ${detailBox("🎓","Educação","Explore estudos, universidades, bolsas e reconhecimento de qualificações.")}
    ${detailBox("🏠","Moradia e custo","Compare categorias como aluguel, alimentação e transporte; valores mudam com cidade e período.")}
    ${detailBox("🏥","Saúde","Consulte fontes oficiais sobre seguro, cobertura e serviços de saúde no destino.")}
   </div>
   <div class="country-disclaimer">⚠️ <b>Importante:</b> dados gerais ajudam na pesquisa, mas regras migratórias, vistos, valores e prazos devem ser confirmados em fontes oficiais.</div>
   <div class="country-actions"><button class="secondary" id="closeModal2">Fechar</button></div>
 </section></div>`;
 document.getElementById("closeModal").onclick=closeModal;document.getElementById("closeModalX").onclick=closeModal;document.getElementById("closeModal2").onclick=closeModal;
 document.getElementById("askCountryAI").onclick=()=>{closeModal();routeTo("ai");setTimeout(()=>{const input=document.getElementById("aiInput"); if(input){input.value=`Quero informações completas sobre ${c.name}: documentação, imigração, pontos turísticos, cultura, idioma, trabalho, educação, saúde, moradia e dicas importantes. Pesquise informações atuais e cite fontes confiáveis.`;input.focus()}},120)};
 try{
   const res=await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(c.code)}?fields=name,capital,region,subregion,population,languages,currencies,timezones,flags,maps`);
   if(!res.ok) throw new Error("Dados indisponíveis");
   const d=await res.json(); const x=Array.isArray(d)?d[0]:d;
   const langs=Object.values(x.languages||{}).join(", ")||"Não informado";
   const currencies=Object.values(x.currencies||{}).map(v=>`${v.name}${v.symbol?" ("+v.symbol+")":""}`).join(", ")||"Não informado";
   const capital=(x.capital||[]).join(", ")||"Não informado";
   document.getElementById("countryLiveData").innerHTML=`<div class="fact-grid">
    ${fact("🏙️","Capital",capital)}${fact("🗣️","Idiomas",langs)}${fact("💰","Moeda",currencies)}${fact("👥","População",Number(x.population||0).toLocaleString(currentLang()==="pt"?"pt-BR":currentLang()))}${fact("🧭","Região",x.subregion||x.region||"Não informado")}${fact("🕐","Fusos",(x.timezones||[]).slice(0,3).join(", ")||"Não informado")}
   </div><div class="country-links"><a href="${esc(x.maps?.googleMaps||"#")}" target="_blank" rel="noopener noreferrer">Ver no mapa ↗</a></div>`;
   translateDOM();
 }catch(e){
   document.getElementById("countryLiveData").innerHTML=`<div class="notice">Não foi possível carregar os dados públicos agora. Você ainda pode usar o Assistente ImmigrateSafe para pesquisar ${esc(c.name)}.</div>`;
 }
}
function fact(icon,title,value){return `<div class="fact-card"><span>${icon}</span><small>${title}</small><b>${esc(value)}</b></div>`}
function detailBox(i,t,p){return `<div class="detail-box"><div class="detail-icon">${i}</div><b>${t}</b><p>${p}</p></div>`}

function renderProcesses(){
 const ps=get(STORE.processes,demoProcesses);
 app.innerHTML=`<div class="section-title"><div><h1 class="page-title">Prazos e processos</h1><p class="page-sub">Tenha suas etapas em um só lugar.</p></div><button class="primary" id="newProcess" style="padding:11px 13px">＋ Novo</button></div>
 <div class="notice" style="margin-bottom:12px">🔐 Seus processos são armazenados apenas neste dispositivo usando armazenamento local.</div>
 <div class="process-list">${ps.length?ps.map(processCard).join(""):`<div class="empty"><div class="empty-icon">✓</div><h3>Nenhum processo ainda</h3><p>Crie seu primeiro acompanhamento para organizar sua jornada.</p><button class="primary" id="newProcessEmpty">＋ Novo processo</button></div>`}</div>`;
 document.getElementById("newProcess")?.addEventListener("click",()=>openProcessForm());
 document.getElementById("newProcessEmpty")?.addEventListener("click",()=>openProcessForm());
 document.querySelectorAll("[data-delete-process]").forEach(b=>b.onclick=()=>{const id=b.dataset.deleteProcess;set(STORE.processes,ps.filter(x=>x.id!==id));toast("Processo removido.");renderProcesses()});
}
function processCard(p){return `<article class="process-card"><div class="process-top"><div><h3>${esc(p.name)}</h3><p>Iniciado em ${esc(p.date)}</p></div><span class="status">${esc(p.status)}</span></div><div class="mini-progress"><i style="width:${p.progress}%"></i></div><div class="process-bottom"><span>${p.progress}% concluído</span><span>Próxima: ${esc(p.next)}</span></div><button class="ghost danger tiny" data-delete-process="${p.id}" style="margin-top:10px">Excluir</button></article>`}
function openProcessForm(){
 modalRoot.innerHTML=`<div class="modal-wrap"><section class="modal"><div class="modal-head"><h2>Novo processo</h2><button class="close" id="closeModal">×</button></div>
 <form class="form" id="processForm">
 <div class="field"><label>Nome do processo</label><input name="name" required placeholder="Ex.: Solicitação de refúgio"></div>
 <div class="field"><label>Status</label><select name="status"><option>Em andamento</option><option>Documentação</option><option>Aguardando resposta</option><option>Concluído</option></select></div>
 <div class="field"><label>Próxima etapa</label><input name="next" required placeholder="Ex.: Revisar documentos"></div>
 <div class="field"><label>Progresso: <span id="progressValue">10</span>%</label><input name="progress" type="range" min="0" max="100" value="10" id="progressRange"></div>
 <div class="form-actions"><button type="button" class="secondary" id="cancelForm">Cancelar</button><button class="primary">Salvar processo</button></div>
 </form></section></div>`;
 document.getElementById("closeModal").onclick=closeModal;document.getElementById("cancelForm").onclick=closeModal;
 document.getElementById("progressRange").oninput=e=>document.getElementById("progressValue").textContent=e.target.value;
 document.getElementById("processForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),ps=get(STORE.processes,demoProcesses);ps.push({id:crypto.randomUUID?.()||Date.now()+"p",name:f.get("name"),status:f.get("status"),next:f.get("next"),progress:Number(f.get("progress")),date:new Date().toLocaleDateString("pt-BR")});set(STORE.processes,ps);closeModal();toast("Processo salvo neste dispositivo.");renderProcesses()};
}

function renderJobs(){
 const modes=["Todos","Remoto","Presencial","Meio período"];
 const arr=jobs.filter(j=>(state.jobMode==="Todos"||j.mode===state.jobMode)&&(j.title+" "+j.company).toLowerCase().includes(state.jobQuery.toLowerCase()));
 app.innerHTML=`<h1 class="page-title">Oportunidades</h1><p class="page-sub">Vagas demonstrativas para explorar a experiência do produto.</p>
 <div class="search"><input id="jobSearch" value="${esc(state.jobQuery)}" placeholder="Buscar cargo ou empresa"><button id="clearJob">⌕</button></div>
 <div class="chips">${modes.map(x=>`<button class="chip ${x===state.jobMode?"active":""}" data-jobmode="${x}">${regionLabel(x)}</button>`).join("")}</div>
 <div class="job-card" style="margin-top:14px;background:#eef9fc;border-color:#d6eef4"><b style="font-size:12px">💡 Dica de segurança</b><p class="tiny muted" style="margin-top:4px">Nunca pague para conseguir uma vaga e confirme a empresa antes de enviar documentos.</p></div>
 <div class="jobs-list">${arr.map(jobCard).join("")}</div>`;
 document.getElementById("jobSearch").oninput=e=>{state.jobQuery=e.target.value;renderJobs()};
 document.getElementById("clearJob").onclick=()=>{state.jobQuery="";renderJobs()};
 document.querySelectorAll("[data-jobmode]").forEach(b=>b.onclick=()=>{state.jobMode=b.dataset.jobmode;renderJobs()});
 document.querySelectorAll("[data-save-job]").forEach(b=>b.onclick=()=>{let s=get(STORE.savedJobs,[]);const id=Number(b.dataset.saveJob);if(s.includes(id)){s=s.filter(x=>x!==id);toast("Vaga removida dos salvos.")}else{s.push(id);toast("Vaga salva.")}set(STORE.savedJobs,s);renderJobs()});
 document.querySelectorAll("[data-job-detail]").forEach(b=>b.onclick=()=>openJob(Number(b.dataset.jobDetail)));
}
function jobCard(j){const saved=get(STORE.savedJobs,[]).includes(j.id);return `<article class="job-card"><div class="job-head"><div style="display:flex;gap:11px"><div class="company-dot">${esc(j.company.slice(0,1))}</div><div><h3>${esc(j.title)}</h3><p>${esc(j.company)} • ${esc(j.location)}</p></div></div><button class="ghost" data-save-job="${j.id}" aria-label="Salvar vaga">${saved?"♥":"♡"}</button></div><div style="display:flex;justify-content:space-between;margin-top:13px"><span class="tiny muted">${esc(j.mode)}</span><span class="salary">${esc(j.salary)}</span></div><div class="tags">${j.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div><div class="job-actions"><button class="secondary" data-job-detail="${j.id}">Ver detalhes</button><button class="primary" data-save-job="${j.id}">${saved?"Salva":"Salvar"}</button></div></article>`}
function openJob(id){const j=jobs.find(x=>x.id===id);if(!j)return;modalRoot.innerHTML=`<div class="modal-wrap"><section class="modal"><div class="modal-head"><h2>${esc(j.title)}</h2><button class="close" id="closeModal">×</button></div><div class="job-card"><h3>${esc(j.company)}</h3><p>${esc(j.location)} • ${esc(j.mode)}</p><p style="margin-top:12px">Esta é uma vaga demonstrativa para apresentar o fluxo do aplicativo. Antes de se candidatar, confirme a existência da vaga e os canais oficiais da empresa.</p><div class="tags">${j.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div></div><div class="notice">⚠️ Nunca envie documentos sensíveis ou faça pagamentos sem verificar a legitimidade da oportunidade.</div><button class="primary" id="closeModal2" style="width:100%;margin-top:14px">Fechar</button></section></div>`;document.getElementById("closeModal").onclick=closeModal;document.getElementById("closeModal2").onclick=closeModal}

const officialPost=`📌 Bem-vindo à comunidade ImmigrateSafe!

Este espaço foi criado para reunir dúvidas, experiências e informações úteis sobre viagens, imigração, intercâmbio e recomeços em outros países.

Compartilhe com respeito e confirme informações migratórias sempre em fontes oficiais.`;
function renderCommunity(){
 const ds=get(STORE.discussions,[]);
 app.innerHTML=`<h1 class="page-title">Comunidade</h1><p class="page-sub">Um espaço para aprender, compartilhar e apoiar.</p>
 <article class="post-card official"><h3>📌 Aviso oficial</h3><p>${officialPost}</p></article>
 <div class="section">${ds.length?`<div class="section-title"><h2>Discussões</h2><button class="primary" id="newDiscussion">＋ Criar</button></div><div class="jobs-list">${ds.map(d=>`<article class="post-card"><h3>${esc(d.title)}</h3><p>${esc(d.message)}</p><div class="tiny muted" style="margin-top:12px">Publicado localmente • ${esc(d.date)}</div></article>`).join("")}</div>`:
 `<div class="empty" style="margin-top:14px"><div class="empty-icon">♧</div><h3>Comece a comunidade</h3><p>Ainda não há discussões.</p><button class="primary" id="newDiscussion">Criar primeira discussão</button></div>`}</div>`;
 document.getElementById("newDiscussion").onclick=openDiscussionForm;
}
function openDiscussionForm(){
 modalRoot.innerHTML=`<div class="modal-wrap"><section class="modal"><div class="modal-head"><h2>Nova discussão</h2><button class="close" id="closeModal">×</button></div><form class="form" id="discussionForm"><div class="field"><label>Título</label><input name="title" required maxlength="80" placeholder="Ex.: Dúvida sobre mudança de país"></div><div class="field"><label>Mensagem</label><textarea name="message" required maxlength="1200" placeholder="Escreva sua dúvida ou experiência com respeito..."></textarea></div><div class="notice">Lembre-se: não compartilhe documentos, senhas ou dados pessoais. Confirme informações migratórias em fontes oficiais.</div><div class="form-actions"><button type="button" class="secondary" id="cancelForm">Cancelar</button><button class="primary">Publicar</button></div></form></section></div>`;
 document.getElementById("closeModal").onclick=closeModal;document.getElementById("cancelForm").onclick=closeModal;
 document.getElementById("discussionForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),ds=get(STORE.discussions,[]);ds.unshift({id:Date.now(),title:f.get("title"),message:f.get("message"),date:new Date().toLocaleDateString("pt-BR")});set(STORE.discussions,ds);closeModal();toast("Discussão publicada neste dispositivo.");renderCommunity()}
}

function renderAI(){
 app.innerHTML=`<h1 class="page-title">IA ImmigrateSafe</h1><p class="page-sub">Pergunte sobre países, viagem, imigração e sua jornada.</p>
 <div class="ai-shell"><div class="ai-head"><div class="ai-orb">✦</div><div><b>Assistente ImmigrateSafe</b><small id="aiStatus">${window.IM_API_URL?"GPT conectado • pesquisa na web disponível":"Modo demonstração • configure a API para ativar o GPT"}</small></div></div>
 <div class="ai-suggestions"><button data-prompt="Quais são os principais passos para morar em Portugal?">🇵🇹 Morar em Portugal</button><button data-prompt="Quais documentos devo pesquisar para trabalhar no Canadá?">🇨🇦 Trabalhar no Canadá</button><button data-prompt="Compare Portugal e Alemanha para estudar e trabalhar.">⚖️ Comparar países</button></div>
 <div class="ai-topic-grid"><button class="ai-topic" data-prompt="Explique como é a moradia, aluguel, custo de vida, bairros e cuidados para encontrar uma casa em [país]."><span>🏠</span><b>Moradia</b><small>Aluguel, custo, bairros e cuidados</small></button><button class="ai-topic" data-prompt="Explique trabalho, salários, autorização de trabalho, áreas com oportunidades e como procurar emprego em [país]."><span>💼</span><b>Trabalho</b><small>Emprego, autorização e mercado</small></button><button class="ai-topic" data-prompt="Explique cultura, costumes, etiqueta, alimentação e diferenças culturais de [país]."><span>🎭</span><b>Cultura</b><small>Costumes e adaptação</small></button><button class="ai-topic" data-prompt="Explique idioma, idiomas oficiais e frases úteis para um estrangeiro em [país]."><span>🗣️</span><b>Idioma</b><small>Línguas e comunicação</small></button><button class="ai-topic" data-prompt="Explique imigração, vistos, residência, documentos e requisitos atuais para [país]."><span>🛂</span><b>Imigração</b><small>Vistos, residência e documentos</small></button><button class="ai-topic" data-prompt="Explique turismo, pontos turísticos, segurança e melhores experiências em [país]."><span>🌎</span><b>Turismo</b><small>Lugares e planejamento</small></button></div>
 <div class="messages" id="messages"><div class="msg ai">Olá! 👋 Sou o Assistente ImmigrateSafe. Posso responder perguntas sobre países, viagem, imigração, documentos, trabalho, estudo e organização da sua jornada.<br><br><b>Importante:</b> quando a resposta depender de regras migratórias, confirme sempre em fontes oficiais.</div></div>
 <form class="ai-input" id="aiForm"><input id="aiInput" autocomplete="off" placeholder="Ex.: Como é morar no Canadá?"><button aria-label="Enviar">➤</button></form></div>`;
 const messages=document.getElementById("messages");
 const history=[];
 function appendMsg(t,type){const m=document.createElement("div");m.className="msg "+type;if(type.includes("ai")){m.innerHTML=t}else{m.textContent=t}messages.appendChild(m);messages.scrollTop=messages.scrollHeight;return m}
 async function askGPT(q, bubble){
   if(!window.IM_API_URL) return aiReply(q);
   const profile=get(STORE.profile,{});
   const country=profile.country||"";
   const res=await fetch(window.IM_API_URL.replace(/\/$/,"")+"/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,history,country,language:currentLang()})});
   if(!res.ok){let detail="";try{detail=(await res.json()).error||""}catch{};throw new Error(detail||"Não foi possível conectar ao assistente.")}
   const data=await res.json();
   return data.reply||"Não recebi uma resposta válida do assistente.";
 }
 async function send(q){
   if(!q)return;
   const profile=get(STORE.profile,{});
   const normalized=q.replace(/\[país\]/gi, profile.country||"o país escolhido");
   q=normalized;
   appendMsg(q,"user"); history.push({role:"user",content:q});
   const bubble=appendMsg("Consultando o assistente…","ai loading");
   try{
     const answer=await askGPT(q,bubble);
     bubble.classList.remove("loading");bubble.innerHTML=answer;
     history.push({role:"assistant",content:answer});
   }catch(err){
     bubble.classList.remove("loading");bubble.textContent="Não consegui acessar o GPT agora. " + (err.message||"Verifique a configuração da API.") + "\n\nEnquanto isso, posso continuar no modo demonstrativo se você desativar a integração.";
   }
   messages.scrollTop=messages.scrollHeight;
 }
 document.getElementById("aiForm").onsubmit=e=>{e.preventDefault();const input=document.getElementById("aiInput"),q=input.value.trim();if(!q)return;input.value="";send(q)};
 document.querySelectorAll(".ai-suggestions button").forEach(b=>b.onclick=()=>send(b.dataset.prompt));
}
/* IA DEMO — base local de respostas por país.
 * A base reconhece os 196 países cadastrados em window.COUNTRIES, entende palavras-chave
 * e organiza as respostas em Moradia / Cultura / Trabalho / Imigração / Turismo.
 * Regras, vistos, salários e preços atuais continuam sendo responsabilidade do backend GPT
 * com pesquisa na web quando window.IM_API_URL estiver configurado.
 */
const AI_COUNTRY_PROFILES = {
  AF:{city:"Cabul",housing:"A moradia varia bastante entre Cabul e outras áreas; segurança, acesso a serviços e estabilidade local são fatores essenciais.",culture:"A cultura é marcada por forte tradição familiar, hospitalidade e diversidade étnica e linguística.",work:"A economia inclui agricultura, comércio, serviços e organizações humanitárias; oportunidades podem variar muito por região."},
  ZA:{city:"Cidade do Cabo / Joanesburgo",housing:"Grandes cidades oferecem apartamentos, casas e diferentes faixas de preço; localização e segurança pesam bastante na escolha.",culture:"Há grande diversidade cultural e linguística, com tradições africanas, europeias e asiáticas.",work:"Serviços, finanças, tecnologia, turismo, indústria e mineração são setores importantes."},
  AL:{city:"Tirana",housing:"Tirana concentra boa parte das opções para estrangeiros, com apartamentos e aluguel mais acessíveis fora das áreas mais valorizadas.",culture:"A cultura albanesa valoriza família, hospitalidade, cafés e fortes tradições locais.",work:"Turismo, serviços, construção, comércio e tecnologia vêm ganhando espaço."},
  DE:{city:"Berlim / Munique / Hamburgo",housing:"O aluguel costuma ser competitivo nas grandes cidades e a oferta pode ser disputada; cidades menores podem oferecer alternativas.",culture:"Pontualidade, planejamento, privacidade e respeito às regras são aspectos valorizados, junto a uma cena cultural muito diversa.",work:"Indústria, engenharia, tecnologia, saúde, logística e serviços têm grande peso."},
  AD:{city:"Andorra la Vella",housing:"O mercado imobiliário é pequeno e concentrado, com forte procura em áreas centrais e turísticas.",culture:"Mistura de tradições catalãs, pirenaicas e influência internacional.",work:"Turismo, comércio, serviços financeiros e atividades ligadas à montanha são relevantes."},
  AO:{city:"Luanda",housing:"Luanda concentra muitas opções, mas custos e qualidade variam bastante por bairro; serviços básicos devem ser avaliados antes de alugar.",culture:"A cultura é muito diversa, com forte presença de tradições bantu, música, dança e vida comunitária.",work:"Petróleo e gás, construção, agricultura, logística, comércio e serviços são setores importantes."},
  AG:{city:"St. John's",housing:"A oferta é limitada pelo tamanho das ilhas e pode ser mais cara em áreas turísticas; aluguel de longo prazo merece planejamento.",culture:"Cultura caribenha com influências africanas, britânicas e regionais, marcada por música e festivais.",work:"Turismo, hospitalidade, serviços e comércio são centrais."},
  SA:{city:"Riad / Jeddah",housing:"Apartamentos e condomínios são comuns nas grandes cidades; localização, transporte e proximidade do trabalho são importantes.",culture:"A vida social é influenciada pela cultura árabe e islâmica, com costumes e normas sociais que devem ser respeitados.",work:"Energia, construção, logística, finanças, tecnologia, saúde e serviços oferecem oportunidades em expansão."},
  DZ:{city:"Argel / Orã",housing:"Apartamentos predominam nas cidades; a oferta e o preço mudam bastante conforme região e proximidade dos centros.",culture:"Heranças árabe, amazigh, mediterrânea e francesa aparecem na língua, culinária e costumes.",work:"Energia, construção, indústria, comércio e serviços são setores relevantes."},
  AR:{city:"Buenos Aires / Córdoba",housing:"Buenos Aires tem ampla oferta de apartamentos, enquanto outras cidades oferecem mercados mais variados; custos mudam conforme inflação e região.",culture:"Forte identidade ligada à família, futebol, música, gastronomia e tradições europeias e latino-americanas.",work:"Agronegócio, tecnologia, serviços, indústria, energia e turismo são setores importantes."},
  AM:{city:"Yerevan",housing:"Yerevan concentra apartamentos e serviços; fora da capital, a oferta tende a ser menor.",culture:"Cultura armênia possui forte tradição familiar, culinária própria, música e patrimônio histórico.",work:"Tecnologia, serviços, comércio, turismo e mineração têm relevância."},
  AU:{city:"Sydney / Melbourne / Brisbane",housing:"O aluguel pode ser elevado nas maiores cidades; apartamentos e casas são comuns e a distância até trabalho/transporte importa muito.",culture:"Sociedade multicultural, com influências aborígenes, britânicas e de várias comunidades migrantes.",work:"Saúde, tecnologia, mineração, educação, construção, serviços e turismo são setores fortes."},
  AT:{city:"Viena / Graz",housing:"Viena possui amplo mercado de apartamentos e boa infraestrutura; contratos e custos variam conforme bairro e cidade.",culture:"Cultura centro-europeia com forte tradição musical, histórica, gastronômica e de cafés.",work:"Indústria, engenharia, turismo, saúde, tecnologia e serviços têm peso."},
  AZ:{city:"Baku",housing:"Baku concentra grande parte do mercado para estrangeiros; apartamentos são comuns e localização influencia muito o preço.",culture:"Mistura de tradições turcomanas/caucasianas, herança persa e influências russas e europeias.",work:"Energia, construção, logística, tecnologia, comércio e serviços são importantes."},
  BS:{city:"Nassau",housing:"A moradia pode ser cara em Nassau e áreas turísticas; oferta e preços variam entre as ilhas.",culture:"Cultura caribenha com fortes influências africanas, britânicas e marítimas.",work:"Turismo, hotelaria, serviços financeiros, comércio e transporte são fundamentais."},
  BH:{city:"Manama",housing:"Apartamentos e condomínios são comuns, especialmente para trabalhadores estrangeiros; proximidade de serviços e trabalho é importante.",culture:"Cultura do Golfo com tradição árabe, islâmica e influência de uma população internacional.",work:"Finanças, serviços, construção, comércio, logística e energia são relevantes."},
  BD:{city:"Daca / Chattogram",housing:"Daca tem alta densidade e mercado de aluguel muito variado; bairros, trânsito e acesso ao trabalho são decisivos.",culture:"Forte tradição familiar, culinária rica, literatura, música e festivais.",work:"Têxteis, manufatura, comércio, tecnologia, agricultura e serviços têm grande importância."},
  BB:{city:"Bridgetown",housing:"Casas e apartamentos são comuns; áreas próximas a praias e centros turísticos tendem a ter maior procura.",culture:"Cultura caribenha com herança africana e britânica, música, culinária e festivais.",work:"Turismo, serviços, comércio e finanças são importantes."},
  BY:{city:"Minsk",housing:"Minsk concentra apartamentos e boa parte dos serviços; preços e disponibilidade variam por área.",culture:"Influências eslavas, tradição familiar e patrimônio histórico formam a identidade cultural.",work:"Indústria, agricultura, tecnologia, comércio e serviços são relevantes."},
  BE:{city:"Bruxelas / Antuérpia",housing:"Apartamentos são comuns nas cidades; custos e oferta variam bastante entre Bruxelas, Flandres e Valônia.",culture:"Sociedade multicultural, com tradições flamengas, francófonas e europeias.",work:"Serviços europeus, logística, indústria, tecnologia, saúde e comércio são fortes."},
  BZ:{city:"Belmopan / Belize City",housing:"Casas são comuns e a oferta varia muito entre centros urbanos e áreas costeiras/turísticas.",culture:"Mistura de influências maias, caribenhas, africanas, britânicas e centro-americanas.",work:"Turismo, agricultura, comércio, serviços e pesca são importantes."},
  BJ:{city:"Porto-Novo / Cotonou",housing:"Cotonou concentra grande parte das opções de aluguel; casas e pequenos apartamentos são comuns.",culture:"Diversidade de povos e tradições, com festivais, mercados e fortes expressões religiosas e artísticas.",work:"Comércio, agricultura, logística, serviços e atividades portuárias são relevantes."},
  BT:{city:"Thimphu",housing:"O mercado é pequeno e concentrado nas cidades; apartamentos e casas de tamanho moderado são comuns.",culture:"Tradições budistas, arquitetura, festivais e forte preservação cultural fazem parte da vida cotidiana.",work:"Turismo, serviços públicos, agricultura, energia hidrelétrica e pequenas empresas são importantes."},
  BO:{city:"Santa Cruz / La Paz",housing:"Santa Cruz tem expansão urbana e ampla variedade de moradias; La Paz possui geografia mais compacta e particularidades de acesso.",culture:"Cultura indígena e latino-americana é muito presente, com música, festivais, culinária e tradições regionais.",work:"Agronegócio, mineração, gás, comércio, serviços e turismo são relevantes."},
  BA:{city:"Sarajevo / Banja Luka",housing:"Apartamentos predominam nos centros urbanos; cidades menores podem ter casas e aluguéis mais acessíveis.",culture:"Heranças balcânicas, otomanas, austro-húngaras e eslavas convivem no país.",work:"Serviços, indústria, turismo, tecnologia, comércio e energia têm importância."},
  BW:{city:"Gaborone",housing:"Casas e apartamentos são comuns em Gaborone; fora da capital, a oferta tende a ser menor.",culture:"Tradições tswana e outras culturas africanas convivem com influências modernas.",work:"Mineração de diamantes, serviços, turismo, comércio e agricultura são relevantes."},
  BR:{city:"São Paulo / Rio de Janeiro / Brasília",housing:"Há enorme variedade de casas e apartamentos; custo, segurança, transporte e distância do trabalho variam muito entre cidades e bairros.",culture:"Uma das sociedades mais diversas do mundo, com influências indígenas, africanas, europeias, asiáticas e regionais.",work:"Serviços, tecnologia, indústria, agronegócio, saúde, educação, comércio e energia oferecem mercados amplos."},
  BN:{city:"Bandar Seri Begawan",housing:"Casas e condomínios são comuns, com mercado relativamente pequeno e baixa densidade populacional.",culture:"Cultura malaia e islâmica, com influências britânicas e de comunidades asiáticas.",work:"Energia, governo, serviços, comércio e finanças são importantes."},
  BG:{city:"Sofia / Plovdiv",housing:"Apartamentos são predominantes nas cidades; Sofia possui maior procura e variedade de preços.",culture:"Tradições balcânicas, eslavas e ortodoxas aparecem na culinária, música e festivais.",work:"Tecnologia, indústria, serviços, turismo, logística e agricultura são relevantes."},
  BF:{city:"Ouagadougou",housing:"Casas e moradias térreas são comuns; oferta e infraestrutura variam bastante conforme a região.",culture:"Diversas tradições da África Ocidental, com música, artesanato, festivais e forte vida comunitária.",work:"Agricultura, mineração, comércio, construção e serviços são importantes."},
  BI:{city:"Bujumbura / Gitega",housing:"Casas e pequenos apartamentos predominam nos centros; a oferta é limitada fora das áreas urbanas.",culture:"Tradições dos povos da região dos Grandes Lagos, música e vida comunitária têm grande presença.",work:"Agricultura, comércio, serviços, construção e organizações de desenvolvimento são relevantes."},
  CV:{city:"Praia / Mindelo",housing:"A oferta é concentrada nas ilhas mais urbanizadas e turísticas; aluguel pode variar bastante entre ilhas.",culture:"Cultura cabo-verdiana combina raízes africanas e portuguesas, com música e forte identidade insular.",work:"Turismo, serviços, comércio, transportes e economia marítima são importantes."},
  CM:{city:"Yaoundé / Douala",housing:"Apartamentos e casas variam muito por cidade; Douala concentra forte demanda ligada ao comércio e negócios.",culture:"Grande diversidade linguística e étnica, com tradições locais, música e culinária variadas.",work:"Agricultura, petróleo, comércio, construção, serviços e indústria são relevantes."},
  KH:{city:"Phnom Penh / Siem Reap",housing:"Apartamentos, casas e condomínios têm ampla variação; áreas centrais e turísticas têm maior procura.",culture:"Forte herança khmer, budismo, templos, gastronomia e festivais tradicionais.",work:"Turismo, confecção, agricultura, construção, comércio e serviços são importantes."},
  CA:{city:"Toronto / Vancouver / Montreal",housing:"O mercado varia muito por província; grandes cidades têm aluguel elevado e alta procura, enquanto cidades menores podem oferecer mais espaço.",culture:"Sociedade multicultural, com influências indígenas, francófonas, anglófonas e de comunidades do mundo inteiro.",work:"Tecnologia, saúde, engenharia, energia, serviços, educação, finanças, construção e recursos naturais têm peso."},
  QA:{city:"Doha",housing:"Apartamentos e condomínios são muito comuns; proximidade do trabalho e serviços é importante.",culture:"Cultura árabe e islâmica, com forte hospitalidade e costumes sociais específicos.",work:"Energia, construção, logística, aviação, finanças, turismo, tecnologia e serviços são setores relevantes."},
  KZ:{city:"Almaty / Astana",housing:"Apartamentos predominam nas grandes cidades; Almaty tende a ter mercado mais diverso e Astana forte expansão urbana.",culture:"Mistura de tradições cazaques, centro-asiáticas e influências russas.",work:"Energia, mineração, logística, tecnologia, agricultura e serviços são importantes."},
  TD:{city:"N'Djamena",housing:"Casas e moradias térreas são comuns; infraestrutura e oferta variam bastante.",culture:"Grande diversidade de povos e tradições sahelianas e centro-africanas.",work:"Petróleo, agricultura, comércio, serviços e ajuda humanitária têm relevância."},
  CL:{city:"Santiago / Valparaíso",housing:"Apartamentos são comuns nas grandes cidades; bairros, transporte e custo variam bastante.",culture:"Cultura latino-americana com forte identidade regional, gastronomia, música e tradições familiares.",work:"Mineração, serviços, tecnologia, agricultura, logística, energia e turismo são importantes."},
  CN:{city:"Xangai / Pequim / Shenzhen",housing:"Grandes cidades têm mercado de aluguel muito amplo, mas competitivo; localização e acesso ao transporte são decisivos.",culture:"Uma das civilizações mais antigas do mundo, com enorme diversidade regional, culinária e tradições.",work:"Manufatura, tecnologia, comércio, logística, finanças e serviços têm escala global."},
  CY:{city:"Nicósia / Limassol",housing:"Apartamentos são comuns; cidades costeiras podem ter maior procura ligada a turismo e negócios.",culture:"Mistura de tradições mediterrâneas, gregas, turcas e europeias.",work:"Turismo, serviços, comércio, transporte marítimo e finanças são relevantes."},
  CO:{city:"Bogotá / Medellín",housing:"Apartamentos são comuns e variam bastante por bairro; transporte e segurança influenciam a escolha.",culture:"Diversidade regional, música, gastronomia, festas e fortes tradições familiares.",work:"Serviços, tecnologia, comércio, energia, agricultura, indústria e turismo são importantes."},
  KM:{city:"Moroni",housing:"Casas predominam e o mercado formal de aluguel é relativamente pequeno.",culture:"Influências africanas, árabes, islâmicas e francesas convivem nas ilhas.",work:"Agricultura, comércio, pesca, serviços e turismo são relevantes."},
  CG:{city:"Brazzaville / Pointe-Noire",housing:"Casas e apartamentos são comuns nos centros urbanos, com diferenças fortes de infraestrutura.",culture:"Diversidade bantu, música, dança e tradições comunitárias são marcantes.",work:"Petróleo, serviços, comércio, construção e transporte são importantes."},
  KP:{city:"Pyongyang",housing:"A moradia é fortemente influenciada pelo sistema estatal e pela localização; o mercado privado não funciona como em economias de mercado.",culture:"Tradições coreanas combinadas com forte influência do Estado e cultura nacional oficial.",work:"Atividades estatais, indústria, agricultura e serviços predominam; oportunidades para estrangeiros são muito limitadas."},
  KR:{city:"Seul / Busan",housing:"Apartamentos são predominantes e os mercados das grandes cidades são muito disputados; contratos e depósitos podem ter formatos próprios.",culture:"Combina tradição coreana, tecnologia, cultura pop, culinária e forte valorização de educação e trabalho.",work:"Tecnologia, eletrônicos, indústria, automóveis, saúde, finanças e serviços são fortes."},
  CI:{city:"Abidjan",housing:"Abidjan concentra grande parte do mercado urbano; apartamentos e casas variam bastante por bairro.",culture:"Herança de muitos povos da África Ocidental, com música, dança, culinária e festivais.",work:"Agricultura, cacau, comércio, logística, indústria, serviços e energia são relevantes."},
  CR:{city:"San José",housing:"Casas e condomínios são comuns; áreas centrais e próximas a serviços tendem a ter maior procura.",culture:"Cultura centro-americana com forte identidade familiar, natureza, gastronomia e vida comunitária.",work:"Turismo, serviços, tecnologia, saúde, manufatura e agricultura são importantes."},
  HR:{city:"Zagreb / Split",housing:"Apartamentos são comuns; cidades costeiras têm forte demanda sazonal e turística.",culture:"Tradições balcânicas e centro-europeias, gastronomia, litoral e festivais.",work:"Turismo, serviços, indústria, logística, tecnologia e comércio são relevantes."},
  CU:{city:"Havana",housing:"A disponibilidade de moradia e as regras de acesso podem ser diferentes das de mercados imobiliários tradicionais.",culture:"Forte identidade caribenha, música, dança, culinária e patrimônio histórico.",work:"Turismo, saúde, biotecnologia, serviços e atividades estatais são importantes."},
  DK:{city:"Copenhague / Aarhus",housing:"Aluguel pode ser caro e a oferta nas grandes cidades é disputada; transporte público ajuda a ampliar opções de localização.",culture:"Sociedade nórdica com foco em confiança, equilíbrio de vida, design e sustentabilidade.",work:"Tecnologia, saúde, energia, indústria, logística, design e serviços são fortes."},
  DJ:{city:"Djibouti City",housing:"Mercado concentrado na capital, com apartamentos e casas; clima e infraestrutura pesam na escolha.",culture:"Mistura de tradições africanas, árabes e islâmicas.",work:"Portos, logística, comércio, serviços e bases internacionais são importantes."},
  DM:{city:"Roseau",housing:"Casas e pequenos apartamentos predominam; oferta limitada pelo tamanho da ilha.",culture:"Cultura caribenha com heranças africanas, indígenas e europeias.",work:"Turismo, agricultura, serviços e comércio são relevantes."},
  EG:{city:"Cairo / Alexandria",housing:"Apartamentos dominam as grandes cidades; trânsito, bairro e acesso a serviços são fatores importantes.",culture:"Herança egípcia antiga combinada com tradições árabes e islâmicas modernas.",work:"Turismo, energia, construção, logística, indústria, comércio e serviços são importantes."},
  SV:{city:"San Salvador",housing:"Casas e apartamentos são comuns; localização, segurança e deslocamento influenciam bastante a escolha.",culture:"Cultura centro-americana com tradições familiares, culinária, música e festas locais.",work:"Serviços, comércio, manufatura, tecnologia, agricultura e turismo são relevantes."},
  AE:{city:"Dubai / Abu Dhabi",housing:"Apartamentos e condomínios dominam os grandes centros; aluguel costuma ser fortemente ligado à localização e ao contrato de trabalho.",culture:"Sociedade multicultural inserida em tradições árabes e islâmicas.",work:"Finanças, tecnologia, aviação, turismo, comércio, construção, energia e logística são fortes."},
  EC:{city:"Quito / Guayaquil",housing:"Apartamentos e casas são comuns; custos e estilo de vida mudam bastante entre Andes, litoral e outras regiões.",culture:"Mistura de tradições indígenas, espanholas e afro-equatorianas, com grande diversidade regional.",work:"Serviços, petróleo, agricultura, comércio, turismo e indústria são importantes."},
  ER:{city:"Asmara",housing:"Casas e apartamentos são comuns nas áreas urbanas; disponibilidade pode ser limitada.",culture:"Diversidade de tradições do Chifre da África, com influências africanas e italianas.",work:"Agricultura, mineração, serviços e atividades públicas têm relevância."},
  SK:{city:"Bratislava / Košice",housing:"Apartamentos predominam nas cidades; Bratislava concentra maior demanda e custos.",culture:"Tradições centro-europeias e eslovacas, com patrimônio histórico e festivais.",work:"Automóveis, indústria, tecnologia, serviços, logística e comércio são fortes."},
  SI:{city:"Ljubljana / Maribor",housing:"Apartamentos e casas são comuns; Ljubljana possui maior procura e mercado mais apertado.",culture:"Cultura alpina e centro-europeia com forte relação com natureza, gastronomia e história.",work:"Indústria, tecnologia, serviços, turismo, logística e saúde são relevantes."},
  ES:{city:"Madri / Barcelona / Valência",housing:"Apartamentos são predominantes; grandes cidades e áreas turísticas podem ter aluguel elevado.",culture:"Grande diversidade regional, com tradições espanholas, catalãs, bascas, galegas e outras.",work:"Turismo, serviços, tecnologia, indústria, saúde, energia e agricultura são importantes."},
  US:{city:"Nova York / Los Angeles / Miami",housing:"Mercado muito diverso; grandes centros costumam ter aluguel alto, enquanto cidades menores oferecem outras faixas e tipos de moradia.",culture:"Sociedade altamente multicultural, com influências de comunidades de todo o mundo e grande diversidade regional.",work:"Tecnologia, finanças, saúde, entretenimento, indústria, logística, educação e serviços têm grande escala."},
  EE:{city:"Tallinn",housing:"Apartamentos são comuns e Tallinn concentra grande parte das oportunidades; cidades menores podem ter custos menores.",culture:"Tradições bálticas e nórdicas com forte cultura digital.",work:"Tecnologia, serviços digitais, logística, indústria e startups são relevantes."},
  SZ:{city:"Mbabane / Manzini",housing:"Casas predominam em muitas áreas; oferta urbana concentra-se nas principais cidades.",culture:"Tradições suázi são muito presentes em cerimônias, música e vida comunitária.",work:"Agricultura, manufatura, serviços, comércio e turismo são importantes."},
  ET:{city:"Addis Ababa",housing:"Apartamentos e casas são comuns na capital, com grande variação de infraestrutura e custo por bairro.",culture:"Uma das maiores diversidades culturais da África, com muitas línguas, tradições e culinárias.",work:"Agricultura, indústria, construção, serviços, tecnologia e aviação são relevantes."},
  FJ:{city:"Suva / Nadi",housing:"Casas e apartamentos variam por ilha; áreas turísticas podem ter maior procura.",culture:"Mistura de tradições indígenas fijianas, indianas e outras comunidades do Pacífico.",work:"Turismo, agricultura, serviços, comércio e transporte marítimo são importantes."},
  PH:{city:"Manila / Cebu",housing:"Condomínios e apartamentos são comuns em grandes centros; trânsito e localização têm grande impacto.",culture:"Cultura muito familiar, com influências austronésias, espanholas, americanas e asiáticas.",work:"BPO, tecnologia, saúde, comércio, manufatura, turismo e serviços são fortes."},
  FI:{city:"Helsinque / Tampere",housing:"Apartamentos são comuns e o transporte público facilita morar fora do centro; inverno influencia escolhas de localização e custos.",culture:"Cultura nórdica com forte relação com natureza, educação, design e saunas.",work:"Tecnologia, engenharia, saúde, indústria, educação e serviços são importantes."},
  FR:{city:"Paris / Lyon / Toulouse",housing:"Apartamentos dominam grandes cidades; Paris é especialmente disputada, enquanto outras cidades oferecem mercados diferentes.",culture:"Forte patrimônio artístico, gastronômico e histórico, com grande diversidade regional.",work:"Serviços, turismo, tecnologia, indústria, saúde, energia, luxo e agricultura são relevantes."},
  GA:{city:"Libreville",housing:"Casas e apartamentos são comuns na capital; infraestrutura e custos variam bastante por área.",culture:"Diversidade de povos e tradições da África Central, com música e vida comunitária.",work:"Petróleo, mineração, madeira, serviços e comércio são importantes."},
  GM:{city:"Banjul / Serrekunda",housing:"Casas e pequenas unidades residenciais predominam; áreas turísticas têm maior procura.",culture:"Tradições da África Ocidental, música, hospitalidade e diversidade étnica.",work:"Turismo, agricultura, comércio, pesca e serviços são relevantes."},
  GH:{city:"Accra / Kumasi",housing:"Casas, apartamentos e condomínios variam por bairro; Accra tem maior demanda.",culture:"Diversidade de povos, línguas e tradições, com música e festivais muito presentes.",work:"Serviços, mineração, agricultura, petróleo, tecnologia, comércio e construção são importantes."},
  GE:{city:"Tbilisi / Batumi",housing:"Apartamentos são predominantes; Tbilisi e Batumi concentram grande parte da oferta para estrangeiros.",culture:"Herança caucasiana, cristã, culinária própria e forte tradição de hospitalidade.",work:"Turismo, tecnologia, logística, comércio, serviços e agricultura são relevantes."},
  GD:{city:"St. George's",housing:"Casas e apartamentos têm oferta limitada; áreas turísticas podem ser mais caras.",culture:"Cultura caribenha com heranças africanas, britânicas e francesas.",work:"Turismo, educação, serviços, comércio e agricultura são importantes."},
  GR:{city:"Atenas / Tessalônica",housing:"Apartamentos são muito comuns; Atenas tem ampla oferta, mas custos variam bastante por bairro e proximidade turística.",culture:"Herança grega antiga e moderna, vida familiar, gastronomia e forte identidade mediterrânea.",work:"Turismo, transporte marítimo, serviços, comércio, agricultura e tecnologia são relevantes."},
  GT:{city:"Cidade da Guatemala / Antigua",housing:"Casas e apartamentos são comuns; áreas com melhor infraestrutura podem ter maior procura.",culture:"Forte presença de culturas maias junto à herança espanhola e latino-americana.",work:"Agricultura, comércio, manufatura, serviços, turismo e tecnologia são importantes."},
  GY:{city:"Georgetown",housing:"Casas predominam e o mercado urbano é relativamente pequeno.",culture:"Mistura caribenha, sul-americana, indiana, africana e europeia.",work:"Petróleo e gás, mineração, agricultura, comércio e serviços são relevantes."},
  GN:{city:"Conacri",housing:"Casas e pequenas unidades predominam; infraestrutura e oferta variam muito por área.",culture:"Grande diversidade étnica e musical da África Ocidental.",work:"Mineração, agricultura, comércio, construção e serviços são importantes."},
  GW:{city:"Bissau",housing:"Casas são predominantes e o mercado formal de aluguel é pequeno.",culture:"Mistura de tradições africanas, crioulas e portuguesas.",work:"Agricultura, pesca, comércio e serviços são relevantes."},
  GQ:{city:"Malabo / Bata",housing:"Casas e apartamentos concentram-se nas principais cidades; oferta limitada fora delas.",culture:"Tradições centro-africanas com influência espanhola.",work:"Petróleo, construção, serviços públicos e comércio são importantes."},
  HT:{city:"Porto Príncipe / Cap-Haïtien",housing:"A oferta varia muito por região e infraestrutura; planejamento de segurança e serviços é essencial.",culture:"Rica tradição haitiana, com música, arte, culinária e influências africanas e francesas.",work:"Comércio, agricultura, manufatura, serviços e organizações internacionais são relevantes."},
  HN:{city:"Tegucigalpa / San Pedro Sula",housing:"Casas e apartamentos são comuns; localização e segurança são fatores importantes.",culture:"Cultura centro-americana com forte vida familiar, culinária e festas.",work:"Manufatura, agricultura, comércio, serviços e turismo são importantes."},
  HU:{city:"Budapeste",housing:"Apartamentos dominam Budapeste; a cidade concentra grande parte das oportunidades e da procura.",culture:"Herança centro-europeia, banhos termais, música e gastronomia são marcantes.",work:"Indústria, automóveis, tecnologia, serviços, turismo e logística são relevantes."},
  YE:{city:"Sanaá / Aden",housing:"Condições de moradia variam muito e a segurança e infraestrutura devem ser avaliadas antes de qualquer mudança.",culture:"Tradições árabes, islâmicas e regionais muito fortes.",work:"Agricultura, comércio, serviços e energia são setores relevantes, com grandes limitações dependendo da região."},
  MH:{city:"Majuro",housing:"O espaço urbano é limitado e a oferta residencial é pequena, especialmente em áreas centrais.",culture:"Tradições marítimas e comunitárias do Pacífico são centrais.",work:"Serviços públicos, pesca, comércio e atividades ligadas ao oceano são importantes."},
  SB:{city:"Honiara",housing:"Casas predominam e o mercado formal é pequeno; infraestrutura varia bastante.",culture:"Diversidade de povos, línguas e tradições insulares do Pacífico.",work:"Agricultura, pesca, madeira, comércio e serviços são relevantes."},
  IN:{city:"Mumbai / Bengaluru / Delhi",housing:"Mercado enorme e muito variado; grandes cidades têm apartamentos e alta procura, enquanto áreas periféricas oferecem outras opções.",culture:"Uma das maiores diversidades culturais, linguísticas e religiosas do mundo, com culinárias e tradições regionais muito distintas.",work:"Tecnologia, serviços, indústria, saúde, educação, comércio e manufatura têm grande peso."},
  ID:{city:"Jacarta / Surabaya / Bali",housing:"Casas, apartamentos e condomínios variam por ilha; Jacarta tem forte demanda e Bali possui mercado muito influenciado pelo turismo.",culture:"Diversidade enorme entre ilhas, com tradições locais, islamismo, hinduísmo e outras influências.",work:"Manufatura, comércio, tecnologia, turismo, agricultura, energia e serviços são importantes."},
  IR:{city:"Teerã / Isfahan",housing:"Apartamentos predominam nas grandes cidades; custos e oferta variam bastante por região.",culture:"Herança persa milenar, poesia, culinária, família e tradições religiosas são marcantes.",work:"Energia, indústria, comércio, tecnologia, agricultura e serviços são relevantes."},
  IQ:{city:"Bagdá / Erbil",housing:"Casas e apartamentos variam bastante por cidade e região; infraestrutura e segurança são fatores essenciais.",culture:"Herança mesopotâmica, árabe, curda e de outras comunidades forma uma cultura muito diversa.",work:"Petróleo, construção, comércio, serviços e setor público são importantes."},
  IE:{city:"Dublin / Cork",housing:"Dublin tem forte pressão sobre aluguel e oferta; outras cidades podem oferecer alternativas diferentes.",culture:"Tradição irlandesa, música, literatura, sociabilidade e identidade gaélica e europeia.",work:"Tecnologia, farmacêutica, finanças, serviços, saúde e educação são fortes."},
  IS:{city:"Reykjavík",housing:"Mercado pequeno e com alta concentração na capital; apartamentos são comuns e a oferta pode ser limitada.",culture:"Cultura nórdica com forte relação com natureza, literatura, música e vida comunitária.",work:"Pesca, energia, turismo, tecnologia e serviços são relevantes."},
  IL:{city:"Tel Aviv / Jerusalém",housing:"Apartamentos predominam e grandes centros têm alta demanda; custo e localização variam bastante.",culture:"Sociedade muito diversa, com influências judaicas, árabes, mediterrâneas e de comunidades internacionais.",work:"Tecnologia, saúde, defesa, agricultura, finanças e serviços são importantes."},
  IT:{city:"Roma / Milão / Bolonha",housing:"Apartamentos são predominantes; Milão e centros turísticos tendem a ter maior pressão de preços.",culture:"Grande patrimônio histórico, arte, gastronomia, família e fortes identidades regionais.",work:"Indústria, design, turismo, moda, serviços, tecnologia, saúde e agricultura são relevantes."},
  JM:{city:"Kingston / Montego Bay",housing:"Casas e apartamentos variam por região; áreas turísticas podem ter maior procura e custo.",culture:"Forte identidade caribenha, música, culinária, esporte e influência africana e britânica.",work:"Turismo, serviços, mineração, agricultura, comércio e música/indústrias criativas são importantes."},
  JP:{city:"Tóquio / Osaka / Fukuoka",housing:"Apartamentos compactos são comuns nas grandes cidades; transporte público permite morar mais distante dos centros.",culture:"Combina tradições históricas com tecnologia, etiqueta social, gastronomia e cultura pop.",work:"Tecnologia, automóveis, indústria, saúde, serviços, pesquisa e educação são fortes."},
  JO:{city:"Amã",housing:"Apartamentos são predominantes em Amã; localização e acesso ao transporte e serviços importam.",culture:"Tradições árabes e islâmicas, hospitalidade e forte vida familiar.",work:"Serviços, turismo, comércio, tecnologia, saúde e educação são relevantes."},
  KI:{city:"South Tarawa",housing:"O território urbano é muito limitado e a oferta residencial é pequena.",culture:"Tradições marítimas, comunitárias e insulares do Pacífico.",work:"Pesca, serviços públicos, comércio e atividades oceânicas são importantes."},
  KW:{city:"Cidade do Kuwait",housing:"Apartamentos e condomínios são comuns, especialmente para estrangeiros; localização e contrato de trabalho influenciam muito.",culture:"Cultura árabe e islâmica do Golfo, com forte hospitalidade.",work:"Petróleo, construção, finanças, comércio, logística e serviços são relevantes."},
  LA:{city:"Vientiane / Luang Prabang",housing:"Casas e apartamentos são comuns nos centros urbanos; mercado menor fora das principais cidades.",culture:"Budismo, tradições do Sudeste Asiático, templos e vida comunitária são marcantes.",work:"Turismo, agricultura, energia, construção, comércio e serviços são importantes."},
  LS:{city:"Maseru",housing:"Casas predominam e a oferta urbana é concentrada na capital.",culture:"Tradições basotho, música, artesanato e vida comunitária são importantes.",work:"Têxteis, agricultura, serviços, mineração e comércio são relevantes."},
  LV:{city:"Riga",housing:"Apartamentos predominam e Riga concentra grande parte da oferta e dos empregos.",culture:"Tradições bálticas com influências nórdicas, alemãs e russas.",work:"Tecnologia, logística, indústria, madeira, serviços e comércio são importantes."},
  LB:{city:"Beirute / Trípoli",housing:"Apartamentos são comuns; custos e infraestrutura variam muito por bairro e região.",culture:"Grande diversidade religiosa e cultural, gastronomia, música e forte tradição familiar.",work:"Serviços, comércio, educação, saúde, tecnologia e turismo são relevantes."},
  LR:{city:"Monróvia",housing:"Casas predominam e infraestrutura varia bastante entre bairros.",culture:"Diversidade de tradições africanas, inglês e heranças de comunidades locais e da diáspora.",work:"Mineração, agricultura, comércio, serviços, portos e organizações internacionais são importantes."},
  LY:{city:"Trípoli / Benghazi",housing:"Casas e apartamentos são comuns, mas condições variam muito conforme região e situação local.",culture:"Herança árabe e amazigh, tradições islâmicas e cultura mediterrânea.",work:"Energia, comércio, construção e serviços são relevantes."},
  LI:{city:"Vaduz",housing:"Mercado residencial pequeno e caro, com oferta limitada.",culture:"Cultura alpina e germânica com forte influência europeia.",work:"Finanças, serviços especializados, indústria e turismo são importantes."},
  LT:{city:"Vilnius / Kaunas",housing:"Apartamentos são comuns e Vilnius concentra grande parte da procura.",culture:"Tradições bálticas, história europeia e forte cena cultural urbana.",work:"Tecnologia, serviços, logística, manufatura e finanças são relevantes."},
  LU:{city:"Luxemburgo",housing:"O mercado imobiliário é pequeno e caro, com forte procura e presença internacional.",culture:"Sociedade multicultural e multilíngue, com forte identidade europeia.",work:"Finanças, tecnologia, serviços europeus, logística e serviços especializados são fortes."},
  MK:{city:"Skopje",housing:"Apartamentos predominam na capital; mercado menor fora dos centros urbanos.",culture:"Mistura de tradições balcânicas, eslavas, albanesas e otomanas.",work:"Serviços, indústria, comércio, tecnologia e turismo são relevantes."},
  MG:{city:"Antananarivo",housing:"Casas e pequenas unidades são comuns; a oferta formal é mais concentrada na capital.",culture:"Cultura malgaxe única, com tradições austronésias e africanas.",work:"Agricultura, turismo, mineração, têxteis e serviços são importantes."},
  MY:{city:"Kuala Lumpur / Penang",housing:"Condomínios e apartamentos são comuns nas cidades; opções variam bastante por bairro.",culture:"Sociedade multicultural malaia, chinesa, indiana e indígena, com grande diversidade religiosa e culinária.",work:"Manufatura, tecnologia, finanças, comércio, turismo e serviços são fortes."},
  MW:{city:"Lilongwe / Blantyre",housing:"Casas predominam e o mercado formal de aluguel é mais concentrado nas grandes cidades.",culture:"Tradições africanas, música e vida comunitária têm grande presença.",work:"Agricultura, serviços, comércio, manufatura e turismo são relevantes."},
  MV:{city:"Malé",housing:"Espaço residencial é muito limitado em Malé; ilhas-resort têm dinâmica diferente.",culture:"Tradições islâmicas e marítimas do Oceano Índico são marcantes.",work:"Turismo, pesca, transporte marítimo e serviços são importantes."},
  ML:{city:"Bamako",housing:"Casas e moradias térreas predominam; oferta e infraestrutura variam muito por área.",culture:"Rica tradição musical e histórica da África Ocidental, com diversos povos e línguas.",work:"Agricultura, ouro, comércio, transporte e serviços são relevantes."},
  MT:{city:"Valletta / Sliema",housing:"Apartamentos são predominantes e áreas costeiras têm forte procura.",culture:"Mistura mediterrânea com influências árabes, italianas e britânicas.",work:"Turismo, serviços, jogos, tecnologia, comércio e finanças são importantes."},
  MA:{city:"Casablanca / Rabat / Marrakech",housing:"Apartamentos são comuns nas grandes cidades; Marrakech tem forte componente turístico.",culture:"Heranças árabe, amazigh, africana e mediterrânea aparecem na culinária, música e costumes.",work:"Turismo, indústria, agricultura, logística, comércio, tecnologia e serviços são relevantes."},
  MU:{city:"Port Louis",housing:"Casas e apartamentos são comuns; áreas costeiras podem ter maior procura.",culture:"Sociedade multicultural com influências africanas, indianas, europeias e chinesas.",work:"Turismo, finanças, serviços, comércio, tecnologia e manufatura são importantes."},
  MR:{city:"Nouakchott",housing:"Casas predominam e a infraestrutura varia bastante entre áreas.",culture:"Tradições árabes e africanas do Sahel, com forte influência islâmica.",work:"Mineração, pesca, agricultura, comércio e serviços são relevantes."},
  MX:{city:"Cidade do México / Monterrey / Guadalajara",housing:"Grande variedade de casas e apartamentos; custo e oferta mudam muito por cidade e bairro.",culture:"Riquíssima mistura de heranças indígenas, espanholas e regionais, com gastronomia e festas diversas.",work:"Manufatura, tecnologia, automóveis, serviços, turismo, comércio e energia são fortes."},
  FM:{city:"Palikir / Kolonia",housing:"Mercado pequeno, com casas predominantes e oferta limitada.",culture:"Diversidade de tradições das ilhas da Micronésia e forte relação com o oceano.",work:"Serviços públicos, pesca, comércio e atividades marítimas são relevantes."},
  MZ:{city:"Maputo / Nampula",housing:"Maputo concentra mais apartamentos e casas para profissionais; outras cidades têm mercados mais simples.",culture:"Diversidade de povos e línguas, música, dança e influências africanas e portuguesas.",work:"Mineração, gás, agricultura, comércio, construção, energia e serviços são importantes."},
  MD:{city:"Chișinău",housing:"Apartamentos são comuns e a capital concentra grande parte da oferta.",culture:"Tradições moldavas e romenas, com influências eslavas e europeias.",work:"Agricultura, tecnologia, serviços, comércio e manufatura são relevantes."},
  MC:{city:"Mônaco",housing:"Espaço extremamente limitado e mercado residencial muito caro; apartamentos predominam.",culture:"Cultura mediterrânea com forte ambiente internacional e tradição europeia.",work:"Finanças, turismo, serviços, comércio e eventos são importantes."},
  MN:{city:"Ulaanbaatar",housing:"Apartamentos dominam a capital, enquanto moradias tradicionais existem em áreas periféricas.",culture:"Herança nômade, budismo, cavalos, festivais e tradições mongóis.",work:"Mineração, comércio, logística, agricultura, turismo e serviços são relevantes."},
  ME:{city:"Podgorica / Budva",housing:"Apartamentos são comuns; litoral tem forte procura turística e sazonal.",culture:"Tradições balcânicas e mediterrâneas, com forte identidade familiar.",work:"Turismo, serviços, construção, comércio e energia são importantes."},
  MM:{city:"Yangon / Mandalay",housing:"Apartamentos e casas variam por cidade; infraestrutura e disponibilidade podem mudar bastante.",culture:"Budismo, centenas de grupos étnicos, culinária e festivais tradicionais.",work:"Agricultura, comércio, manufatura, energia e serviços são relevantes."},
  NA:{city:"Windhoek",housing:"Casas e apartamentos são comuns na capital; mercado mais limitado fora dela.",culture:"Diversidade de povos, tradições do sul da África e influências alemãs.",work:"Mineração, turismo, agricultura, pesca e serviços são importantes."},
  NR:{city:"Yaren",housing:"Território muito pequeno, com oferta residencial limitada e casas predominantes.",culture:"Tradições oceânicas e comunitárias do Pacífico.",work:"Serviços públicos, pesca e atividades ligadas ao oceano são relevantes."},
  NP:{city:"Katmandu",housing:"Apartamentos e casas são comuns; Katmandu concentra grande parte do mercado urbano.",culture:"Forte presença hindu e budista, montanhas, festivais e grande diversidade étnica.",work:"Turismo, serviços, agricultura, comércio e tecnologia são importantes."},
  NI:{city:"Manágua",housing:"Casas são comuns e a oferta varia bastante conforme bairro e infraestrutura.",culture:"Cultura centro-americana com música, festas, culinária e tradições familiares.",work:"Agricultura, manufatura, comércio, turismo e serviços são relevantes."},
  NE:{city:"Niamey",housing:"Casas predominam e o mercado formal é limitado.",culture:"Tradições do Sahel e da África Ocidental, com grande diversidade de povos.",work:"Agricultura, mineração, comércio e serviços são importantes."},
  NG:{city:"Lagos / Abuja",housing:"Lagos possui grande variedade de apartamentos e casas, mas alta demanda; Abuja tem planejamento urbano diferente.",culture:"Enorme diversidade étnica, linguística e musical, com Nollywood e gastronomia regional.",work:"Petróleo, tecnologia, finanças, comércio, telecomunicações, agricultura e serviços são fortes."},
  NO:{city:"Oslo / Bergen",housing:"Apartamentos são comuns; Oslo tem mercado caro, enquanto outras cidades podem oferecer alternativas.",culture:"Cultura nórdica, natureza, esportes ao ar livre e forte equilíbrio entre vida e trabalho.",work:"Energia, tecnologia, marítimo, saúde, pesca, engenharia e serviços são importantes."},
  NZ:{city:"Auckland / Wellington",housing:"Casas são muito comuns; Auckland tem aluguel e compra mais pressionados, enquanto outras regiões variam.",culture:"Sociedade multicultural com forte presença Māori, influências britânicas e identidade do Pacífico.",work:"Agricultura, tecnologia, turismo, saúde, educação, construção e serviços são relevantes."},
  OM:{city:"Mascate",housing:"Apartamentos e casas são comuns, especialmente em áreas residenciais planejadas; localização e contrato de trabalho importam.",culture:"Cultura árabe e islâmica com forte tradição marítima e de hospitalidade.",work:"Energia, logística, turismo, construção, comércio e serviços são importantes."},
  NL:{city:"Amsterdã / Roterdã / Eindhoven",housing:"Mercado muito disputado nas grandes cidades, com apartamentos predominantes e boa rede de transporte.",culture:"Cultura aberta e internacional, com forte tradição em design, ciclismo e comércio.",work:"Tecnologia, logística, agricultura, finanças, engenharia e serviços são fortes."},
  PW:{city:"Ngerulmud / Koror",housing:"Casas predominam e o mercado é pequeno, com maior oferta nas áreas mais urbanizadas.",culture:"Tradições insulares e marítimas da Micronésia.",work:"Turismo, pesca, serviços e atividades marítimas são relevantes."},
  PA:{city:"Cidade do Panamá",housing:"Apartamentos e condomínios são comuns, com ampla oferta em áreas centrais e modernas.",culture:"Mistura caribenha, latino-americana e internacional, muito ligada ao Canal do Panamá.",work:"Logística, finanças, comércio, construção, turismo e serviços são fortes."},
  PG:{city:"Port Moresby",housing:"Casas e condomínios predominam em áreas urbanas; infraestrutura e segurança devem ser avaliadas.",culture:"Uma das maiores diversidades linguísticas do planeta, com centenas de culturas locais.",work:"Mineração, energia, agricultura, pesca, comércio e serviços são importantes."},
  PK:{city:"Islamabad / Lahore / Karachi",housing:"Casas e apartamentos variam muito entre cidades; Islamabad tende a ter planejamento mais aberto, Karachi mercado mais denso.",culture:"Diversidade regional, tradições islâmicas, culinária, música e forte vida familiar.",work:"Têxteis, tecnologia, agricultura, comércio, indústria e serviços são relevantes."},
  PY:{city:"Assunção",housing:"Casas são comuns e o mercado é relativamente acessível em comparação com alguns grandes centros regionais.",culture:"Cultura guarani e hispânica, com forte identidade linguística e familiar.",work:"Agricultura, energia, comércio, serviços e logística são importantes."},
  PE:{city:"Lima / Arequipa",housing:"Apartamentos são comuns em Lima; regiões e bairros têm diferenças fortes de clima, custo e infraestrutura.",culture:"Heranças indígenas, espanholas e afro-peruanas, com culinária e festivais muito diversos.",work:"Mineração, agricultura, comércio, turismo, serviços e construção são relevantes."},
  PL:{city:"Varsóvia / Cracóvia",housing:"Apartamentos predominam nas cidades; Varsóvia tem forte demanda e mercado de trabalho amplo.",culture:"Tradições centro-europeias, história, gastronomia e vida cultural intensa.",work:"Tecnologia, indústria, serviços, logística, comércio e finanças são fortes."},
  PT:{city:"Lisboa / Porto / Braga",housing:"Apartamentos são muito comuns; Lisboa e áreas turísticas têm maior pressão sobre aluguel, enquanto outras cidades oferecem alternativas.",culture:"Cultura lusófona, tradição marítima, gastronomia, música e forte vida familiar.",work:"Turismo, tecnologia, serviços, saúde, indústria, comércio e energias renováveis são relevantes."},
  KE:{city:"Nairobi / Mombasa",housing:"Apartamentos e casas variam por bairro; Nairobi concentra grande parte das oportunidades profissionais.",culture:"Diversidade de povos e línguas, música, esportes e tradições do leste africano.",work:"Tecnologia, serviços, agricultura, turismo, logística, finanças e comércio são importantes."},
  KG:{city:"Bishkek",housing:"Apartamentos predominam na capital; oferta fora dos centros é menor.",culture:"Tradições nômades, cultura centro-asiática e influência russa.",work:"Agricultura, mineração, comércio, serviços e turismo são relevantes."},
  GB:{city:"Londres / Manchester / Edimburgo",housing:"Apartamentos e casas são comuns; Londres tem aluguel elevado e grande procura, enquanto outras cidades oferecem mercados diferentes.",culture:"Sociedade multicultural com tradições britânicas e identidades inglesa, escocesa, galesa e norte-irlandesa.",work:"Finanças, tecnologia, saúde, educação, serviços, indústria e indústrias criativas são fortes."},
  CF:{city:"Bangui",housing:"Casas predominam e o mercado formal é limitado; infraestrutura varia bastante.",culture:"Diversidade de tradições centro-africanas e forte vida comunitária.",work:"Agricultura, mineração, comércio, serviços e organizações humanitárias são relevantes."},
  CD:{city:"Kinshasa / Lubumbashi",housing:"Casas e apartamentos variam muito; Kinshasa possui mercado urbano grande e desigual.",culture:"Enorme diversidade de povos e línguas, música congolesa e tradições comunitárias.",work:"Mineração, agricultura, comércio, construção, energia e serviços são importantes."},
  DO:{city:"Santo Domingo / Punta Cana",housing:"Apartamentos e casas são comuns; áreas turísticas têm dinâmica de preços própria.",culture:"Cultura caribenha com música, beisebol, gastronomia e heranças africanas e espanholas.",work:"Turismo, serviços, comércio, manufatura, construção e agricultura são relevantes."},
  CZ:{city:"Praga / Brno",housing:"Apartamentos predominam e Praga tem mercado disputado; cidades menores podem ser mais acessíveis.",culture:"Tradições centro-europeias, arquitetura, cerveja, música e patrimônio histórico.",work:"Automóveis, indústria, tecnologia, serviços, turismo e logística são fortes."},
  RO:{city:"Bucareste / Cluj-Napoca",housing:"Apartamentos são comuns; Bucareste concentra grande oferta e empregos.",culture:"Mistura balcânica, latina e centro-europeia, com forte tradição familiar.",work:"Tecnologia, serviços, indústria, automóveis, agricultura e comércio são importantes."},
  RW:{city:"Kigali",housing:"Casas e apartamentos concentram-se em Kigali; a cidade é organizada e a oferta varia por bairro.",culture:"Tradições ruandesas, música, dança e forte foco comunitário.",work:"Serviços, tecnologia, turismo, agricultura, construção e comércio são relevantes."},
  RU:{city:"Moscou / São Petersburgo",housing:"Apartamentos predominam nas grandes cidades; custos e condições variam muito por região.",culture:"Grande patrimônio literário, artístico, musical e histórico, com enorme diversidade regional.",work:"Energia, indústria, tecnologia, serviços, comércio e engenharia são importantes."},
  WS:{city:"Apia",housing:"Casas predominam e o mercado urbano é pequeno.",culture:"Tradições samoanas, vida comunitária, música e cultura do Pacífico são centrais.",work:"Turismo, agricultura, serviços e pesca são relevantes."},
  SM:{city:"San Marino",housing:"Mercado pequeno, com apartamentos e casas concentrados no território compacto.",culture:"Herança italiana e tradição histórica própria.",work:"Turismo, serviços, comércio e pequenas empresas são importantes."},
  LC:{city:"Castries",housing:"Casas e apartamentos variam conforme a região; áreas turísticas podem ter maior procura.",culture:"Cultura caribenha com influências africanas, francesas e britânicas.",work:"Turismo, serviços, comércio e agricultura são relevantes."},
  KN:{city:"Basseterre",housing:"Mercado pequeno, com casas e apartamentos; áreas turísticas têm maior demanda.",culture:"Tradições caribenhas e heranças africanas e britânicas.",work:"Turismo, serviços, comércio e agricultura são importantes."},
  ST:{city:"São Tomé",housing:"Casas predominam e o mercado formal é pequeno.",culture:"Forte mistura de tradições africanas e portuguesas, com música e culinária próprias.",work:"Agricultura, cacau, turismo, pesca e serviços são relevantes."},
  VC:{city:"Kingstown",housing:"Casas e apartamentos predominam; oferta limitada pelo tamanho das ilhas.",culture:"Cultura caribenha com música, festivais e influências africanas e britânicas.",work:"Turismo, agricultura, serviços e comércio são importantes."},
  SN:{city:"Dacar",housing:"Apartamentos e casas são comuns; Dacar concentra maior demanda e diversidade de serviços.",culture:"Tradições da África Ocidental, islamismo, música e forte vida comunitária.",work:"Serviços, pesca, agricultura, comércio, turismo e energia são relevantes."},
  SL:{city:"Freetown",housing:"Casas predominam e o relevo e infraestrutura influenciam muito a localização.",culture:"Diversidade de povos, música e tradições da África Ocidental.",work:"Mineração, agricultura, comércio, serviços e turismo são importantes."},
  RS:{city:"Belgrado / Novi Sad",housing:"Apartamentos predominam e Belgrado concentra forte demanda.",culture:"Tradições balcânicas, eslavas, música, gastronomia e vida social intensa.",work:"Tecnologia, serviços, indústria, agricultura e comércio são relevantes."},
  SC:{city:"Victoria",housing:"Mercado pequeno e caro em áreas mais procuradas, com oferta limitada.",culture:"Mistura de influências africanas, francesas, britânicas e indianas.",work:"Turismo, pesca, serviços e comércio são importantes."},
  SG:{city:"Singapura",housing:"Mercado altamente urbanizado, com apartamentos e condomínios; moradia é organizada e geralmente cara.",culture:"Sociedade multicultural chinesa, malaia, indiana e internacional, com forte diversidade culinária.",work:"Finanças, tecnologia, logística, comércio, saúde e serviços são muito fortes."},
  SY:{city:"Damasco / Aleppo",housing:"Condições de moradia variam muito por região e situação local; segurança e infraestrutura são fatores críticos.",culture:"Herança árabe e levantina, com culinária, música e patrimônio histórico.",work:"Comércio, agricultura, serviços e atividades de reconstrução têm relevância, dependendo da região."},
  SO:{city:"Mogadíscio",housing:"Casas e estruturas residenciais variam muito; segurança e infraestrutura são prioridades.",culture:"Tradições somalis, islâmicas e do Chifre da África.",work:"Comércio, telecomunicações, pecuária, pesca e serviços são relevantes."},
  LK:{city:"Colombo / Kandy",housing:"Casas e apartamentos são comuns nas cidades; Colombo concentra mais oferta e empregos.",culture:"Mistura de tradições budistas, hindus, muçulmanas e cristãs, com rica culinária e festivais.",work:"Turismo, tecnologia, comércio, agricultura, indústria e serviços são importantes."},
  SD:{city:"Cartum / Port Sudan",housing:"Condições variam muito por região; segurança, serviços e infraestrutura devem ser avaliados.",culture:"Grande diversidade de povos e tradições africanas e árabes.",work:"Agricultura, comércio, mineração, energia e serviços são relevantes."},
  SS:{city:"Juba",housing:"Casas e estruturas residenciais predominam; oferta e infraestrutura são limitadas.",culture:"Grande diversidade étnica e tradições comunitárias do leste e centro da África.",work:"Petróleo, agricultura, comércio, serviços e organizações humanitárias são importantes."},
  SE:{city:"Estocolmo / Gotemburgo",housing:"Apartamentos são comuns e grandes cidades podem ter filas e forte demanda; transporte facilita opções periféricas.",culture:"Cultura nórdica com foco em igualdade, design, natureza e equilíbrio de vida.",work:"Tecnologia, engenharia, indústria, saúde, serviços e inovação são fortes."},
  CH:{city:"Zurique / Genebra / Basileia",housing:"Apartamentos predominam e grandes centros têm custos elevados; oferta varia por cantão.",culture:"Sociedade multicultural com identidades suíças alemã, francesa, italiana e romanche.",work:"Finanças, farmacêutica, tecnologia, indústria, saúde e serviços especializados são fortes."},
  SR:{city:"Paramaribo",housing:"Casas predominam e o mercado urbano é relativamente pequeno.",culture:"Mistura singular de influências sul-americanas, indianas, africanas, javanesas e europeias.",work:"Mineração, agricultura, comércio, serviços e energia são importantes."},
  TH:{city:"Bangkok / Chiang Mai",housing:"Condomínios e apartamentos são comuns em Bangkok; cidades turísticas têm mercados próprios.",culture:"Budismo, culinária, festivais, hospitalidade e tradições regionais são marcantes.",work:"Turismo, manufatura, comércio, tecnologia, agricultura e serviços são fortes."},
  TJ:{city:"Dushanbe",housing:"Apartamentos predominam na capital; mercado menor fora dos centros.",culture:"Tradições persas e centro-asiáticas, música, culinária e vida familiar.",work:"Agricultura, mineração, construção, serviços e comércio são relevantes."},
  TZ:{city:"Dar es Salaam / Arusha",housing:"Casas e apartamentos variam por cidade; Dar es Salaam concentra maior mercado urbano.",culture:"Diversidade de povos, cultura suaíli, música e tradições da África Oriental.",work:"Turismo, agricultura, mineração, comércio, logística e serviços são importantes."},
  TL:{city:"Díli",housing:"Casas predominam e o mercado formal de aluguel é relativamente pequeno.",culture:"Mistura de tradições timorenses, austronésias, portuguesas e católicas.",work:"Serviços públicos, agricultura, comércio, petróleo/gás e turismo são relevantes."},
  TG:{city:"Lomé",housing:"Casas predominam e Lomé concentra grande parte do mercado formal.",culture:"Diversidade de povos e tradições da África Ocidental, com música e mercados.",work:"Comércio, logística, agricultura, construção e serviços são importantes."},
  TO:{city:"Nuku'alofa",housing:"Casas predominam e o mercado urbano é pequeno.",culture:"Tradições polinésias, família, igreja, música e vida comunitária.",work:"Serviços, turismo, agricultura e pesca são relevantes."},
  TT:{city:"Port of Spain",housing:"Casas e apartamentos variam bastante por região; áreas urbanas têm maior oferta.",culture:"Cultura caribenha muito diversa, com influências indianas, africanas, europeias e festivais como o Carnival.",work:"Energia, serviços, finanças, comércio, turismo e indústria são importantes."},
  TN:{city:"Túnis",housing:"Apartamentos são comuns e Túnis concentra grande parte da oferta urbana.",culture:"Heranças árabe, amazigh, mediterrânea e francesa aparecem na culinária e costumes.",work:"Turismo, indústria, serviços, tecnologia, agricultura e comércio são relevantes."},
  TM:{city:"Ashgabat",housing:"A oferta residencial é concentrada nas cidades e fortemente influenciada pelo planejamento estatal.",culture:"Tradições turcomanas e centro-asiáticas, com forte identidade nacional.",work:"Energia, agricultura, construção e serviços são importantes."},
  TR:{city:"Istambul / Ancara / Izmir",housing:"Apartamentos predominam nas cidades; Istambul possui mercado amplo e competitivo.",culture:"Ponte cultural entre Europa e Ásia, com heranças otomanas, turcas, islâmicas e mediterrâneas.",work:"Indústria, turismo, comércio, tecnologia, logística, saúde e serviços são fortes."},
  TV:{city:"Funafuti",housing:"Território muito pequeno, com oferta residencial limitada e casas predominantes.",culture:"Tradições polinésias e forte relação com o oceano.",work:"Serviços públicos, pesca, turismo e atividades marítimas são relevantes."},
  UA:{city:"Kyiv / Lviv",housing:"Apartamentos predominam nas cidades; condições variam muito conforme a região e situação de segurança.",culture:"Tradições eslavas e europeias, literatura, música e forte identidade regional.",work:"Tecnologia, agricultura, indústria, logística, serviços e energia são importantes, com variação regional."},
  UG:{city:"Kampala",housing:"Casas e apartamentos variam por bairro; Kampala concentra a maior parte das opções para profissionais.",culture:"Diversidade de povos, línguas, música e tradições da África Oriental.",work:"Agricultura, serviços, tecnologia, comércio, construção e turismo são relevantes."},
  UY:{city:"Montevidéu / Punta del Este",housing:"Apartamentos são comuns em Montevidéu; áreas costeiras têm dinâmica turística e sazonal.",culture:"Cultura rioplatense com futebol, mate, música, gastronomia e forte vida urbana.",work:"Serviços, tecnologia, agricultura, logística, comércio e turismo são importantes."},
  UZ:{city:"Tashkent / Samarcanda",housing:"Apartamentos e casas predominam; Tashkent concentra maior oferta urbana.",culture:"Herança persa e centro-asiática, com cidades históricas, culinária e tradições familiares.",work:"Agricultura, mineração, indústria, comércio, tecnologia e serviços são relevantes."},
  VU:{city:"Port Vila",housing:"Casas predominam e o mercado urbano é pequeno; áreas turísticas têm maior procura.",culture:"Diversidade de tradições melanésias e forte relação com o oceano.",work:"Turismo, agricultura, pesca, serviços e comércio são importantes."},
  VA:{city:"Cidade do Vaticano",housing:"O território é extremamente pequeno e não funciona como um mercado residencial comum para imigrantes.",culture:"Centro da Igreja Católica e patrimônio artístico e histórico de enorme importância internacional.",work:"Atividades institucionais, culturais, administrativas e ligadas ao patrimônio predominam."},
  VE:{city:"Caracas / Maracaibo",housing:"Casas e apartamentos variam muito por cidade e região; infraestrutura e segurança devem ser avaliadas.",culture:"Cultura caribenha e latino-americana, com música, culinária e tradições familiares.",work:"Petróleo, comércio, serviços, agricultura e indústria são relevantes."},
  VN:{city:"Ho Chi Minh City / Hanói",housing:"Apartamentos e casas são comuns; grandes centros têm alta demanda e muita verticalização.",culture:"Tradições vietnamitas, culinária, família, festivais e forte identidade histórica.",work:"Manufatura, tecnologia, comércio, logística, turismo e serviços são fortes."},
  ZM:{city:"Lusaka",housing:"Casas e apartamentos são comuns na capital; oferta varia bastante por bairro.",culture:"Diversidade de povos e tradições da África Austral, música e festivais.",work:"Mineração, agricultura, construção, comércio e serviços são importantes."},
  ZW:{city:"Harare",housing:"Casas predominam e o mercado varia bastante por área.",culture:"Diversidade de tradições shona, ndebele e outras culturas da África Austral.",work:"Mineração, agricultura, turismo, manufatura e serviços são relevantes."},
  PS:{city:"Ramallah / Gaza City",housing:"Condições e disponibilidade variam fortemente por área e situação local; infraestrutura e segurança são fatores essenciais.",culture:"Forte herança árabe, palestina e levantina, com culinária, família, música e tradições locais.",work:"Comércio, serviços, construção, agricultura, tecnologia e organizações de apoio têm relevância, variando por região."},
  XK:{city:"Pristina",housing:"Apartamentos predominam na capital; o mercado é menor fora das áreas urbanas.",culture:"Tradições balcânicas, albanesas e europeias convivem em uma sociedade jovem e diversa.",work:"Serviços, comércio, construção, tecnologia, energia e turismo são relevantes."}
};

const AI_REGION_DEFAULTS={
  "América":{housing:"O mercado varia muito entre países e cidades; grandes centros costumam concentrar apartamentos e ter maior procura. Segurança, transporte e acesso a serviços são pontos importantes.",culture:"Há grande diversidade cultural, com influências indígenas, africanas, europeias e de diferentes ondas migratórias.",work:"Serviços, comércio, indústria, agricultura, tecnologia e turismo aparecem com pesos diferentes conforme o país."},
  "Europa":{housing:"Apartamentos são comuns nas cidades; capitais e centros turísticos podem ter aluguel mais alto e oferta disputada.",culture:"Há grande diversidade regional, linguística e histórica, com forte patrimônio cultural e integração entre países.",work:"Serviços, tecnologia, indústria, saúde, turismo, logística e finanças são setores frequentes."},
  "Ásia":{housing:"Grandes cidades costumam ter forte verticalização e mercados muito diferentes entre regiões; localização e transporte são essenciais.",culture:"É um continente extremamente diverso em línguas, religiões, culinárias e tradições.",work:"Tecnologia, indústria, comércio, agricultura, energia, turismo e serviços têm grande relevância."},
  "África":{housing:"A oferta varia bastante entre capitais e regiões; casas são comuns e infraestrutura deve ser avaliada bairro a bairro.",culture:"Diversidade de povos, línguas e tradições é uma característica central do continente.",work:"Agricultura, mineração, energia, comércio, serviços, tecnologia e turismo têm pesos diferentes conforme o país."},
  "Oceania":{housing:"Mercados residenciais tendem a ser menores; capitais e centros turísticos podem ter maior procura.",culture:"Forte relação com o oceano e grande diversidade de tradições austronésias, melanésias, micronésias e de comunidades migrantes.",work:"Turismo, agricultura, pesca, serviços, mineração e atividades marítimas são comuns."}
};

function aiNorm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"'").replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ").trim()}
function aiCountryFromText(text){
 const n=aiNorm(text); let best=null;
 (window.COUNTRIES||[]).forEach(c=>{
   const names=[c.name,c.en];
   names.forEach(name=>{const x=aiNorm(name); if(x && (n.includes(x)||x===n)) {if(!best||x.length>best._len)best={...c,_len:x.length};}});
 });
 const aliases={"eua":"US","usa":"US","estados unidos da america":"US","inglaterra":"GB","uk":"GB","reino unido":"GB","coreia do sul":"KR","south korea":"KR","emirados":"AE","uae":"AE","holanda":"NL","netherlands":"NL","tchequia":"CZ","czech republic":"CZ","russia":"RU","turquia":"TR","turkey":"TR","espanha":"ES","portugal":"PT","canada":"CA","canadá":"CA","brasil":"BR"};
 for(const [a,code] of Object.entries(aliases))if(n.includes(aiNorm(a))){const c=(window.COUNTRIES||[]).find(x=>x.code===code);if(c&&(!best||a.length>best._len))best={...c,_len:a.length};}
 return best;
}
function aiCountriesFromComparison(q){
 const n=aiNorm(q); const hits=[];
 (window.COUNTRIES||[]).forEach(c=>{[c.name,c.en].forEach(name=>{const x=aiNorm(name);if(x&&n.includes(x)&&!hits.some(h=>h.code===c.code))hits.push(c)})});
 return hits.sort((a,b)=>aiNorm(b.name).length-aiNorm(a.name).length).slice(0,3);
}
function aiTopic(q){const s=aiNorm(q);if(/moradia|mor(ar|o)|casa|aluguel|alugar|apartamento|habitacao|vivienda|housing|rent/.test(s))return "housing";if(/cultura|costume|tradicao|culinaria|comida|cultural/.test(s))return "culture";if(/trabalho|emprego|vaga|carreira|salario|mercado de trabalho|job|work/.test(s))return "work";if(/turismo|turista|viaj|pontos turisticos|ferias|tourism|travel/.test(s))return "tourism";if(/idioma|lingua|frase|language/.test(s))return "language";if(/document|visto|visa|imigr|residenc|regulariza|passaporte|autorizacao/.test(s))return "immigration";if(/estud|universidade|faculdade|curso|education|study/.test(s))return "study";if(/saude|hospital|health/.test(s))return "health";return "general"}
function aiProfileFor(c){return AI_COUNTRY_PROFILES[c.code]||{city:"principais cidades",...AI_REGION_DEFAULTS[c.region]||AI_REGION_DEFAULTS["Europa"]}}
function aiOneCountry(c,topics){const p=aiProfileFor(c);const parts=[];if(topics.includes("housing"))parts.push(`<b>🏠 Moradia</b><br>${p.housing}`);if(topics.includes("culture"))parts.push(`<b>🎭 Cultura</b><br>${p.culture}`);if(topics.includes("work"))parts.push(`<b>💼 Trabalho</b><br>${p.work}`);if(topics.includes("tourism"))parts.push(`<b>🌎 Turismo</b><br>Explore ${c.name} começando por ${p.city}; atrações e condições variam por região. Para informações atuais de segurança, entrada e funcionamento de atrações, confirme fontes oficiais.`);if(topics.includes("language"))parts.push(`<b>🗣️ Idioma</b><br>Consulte o perfil do país para os idiomas oficiais. Para adaptação, vale aprender saudações, números e termos usados em transporte, moradia e trabalho.`);if(topics.includes("study"))parts.push(`<b>🎓 Estudo</b><br>As opções de ensino e reconhecimento de diplomas variam conforme instituição e nível. Procure universidades e órgãos educacionais do próprio país.`);if(topics.includes("health"))parts.push(`<b>🏥 Saúde</b><br>Verifique como funciona o sistema público/privado e as regras de acesso para estrangeiros antes da mudança.`);if(topics.includes("immigration"))parts.push(`<b>🛂 Imigração</b><br>Vistos, residência e autorização de trabalho dependem da nacionalidade, finalidade, duração e situação da pessoa. Regras atuais devem ser confirmadas em fontes governamentais.`);if(!parts.length)parts.push(`<b>📌 Visão geral</b><br>${c.name} é um país da região ${c.region}, com centro urbano de referência em ${p.city}. Posso detalhar <b>moradia, cultura, trabalho, imigração, estudo, saúde, turismo ou idioma</b>.`);return parts.join("<br><br>")}
function aiReply(q){
 const comparison=aiCountriesFromComparison(q); const isCompare=/\b(compare|comparar|comparacao|comparação|diferen[cç]a|melhor|versus|vs)\b/i.test(q) && comparison.length>=2;
 if(isCompare){
   const [a,b]=comparison; const pa=aiProfileFor(a),pb=aiProfileFor(b); const topic=aiTopic(q); if(topic!=="general")return `<b>⚖️ ${a.name} × ${b.name}</b><br><br><b>🏠 ${topic==="housing"?"Moradia":"Comparação"}</b><br><b>${a.name}:</b> ${pa.housing}<br><br><b>${b.name}:</b> ${pb.housing}<br><br><b>💡 Em resumo:</b> ${a.name} tende a oferecer um perfil residencial diferente de ${b.name} em tamanho de mercado, cidades e custos locais. Para decidir, compare cidade, renda, transporte e autorização para morar/trabalhar.`;
   return `<b>⚖️ Comparação: ${a.name} × ${b.name}</b><br><br><b>🏠 Moradia</b><br><b>${a.name}:</b> ${pa.housing}<br><b>${b.name}:</b> ${pb.housing}<br><br><b>🎭 Cultura</b><br><b>${a.name}:</b> ${pa.culture}<br><b>${b.name}:</b> ${pb.culture}<br><br><b>💼 Trabalho</b><br><b>${a.name}:</b> ${pa.work}<br><b>${b.name}:</b> ${pb.work}<br><br><b>🛂 Imigração</b><br>As regras são diferentes nos dois países e dependem do perfil. Se quiser, posso comparar especificamente <b>visto, trabalho, estudo, custo de vida ou moradia</b>. Para regras atuais, consulte fontes oficiais.`;
 }
 const c=aiCountryFromText(q); const profile=get(STORE.profile,{})||{}; const chosen=c||aiCountryFromText(profile.country||"");
 if(chosen){const topic=aiTopic(q);const topics=topic==="general"?["housing","culture","work","immigration"]:[topic];return `<b>📍 ${chosen.name}</b><br><br>${aiOneCountry(chosen,topics)}<br><br><span class="ai-note">ℹ️ Valores, salários, preços, vistos e prazos mudam com o tempo e conforme o perfil. Para dados atuais e oficiais, use a IA conectada à pesquisa na web.</span>`}
 if(/oi|ola|olá|hello|hey/.test(aiNorm(q)))return "Olá! 👋 Posso conversar sobre qualquer um dos 196 países cadastrados. Experimente: <b>Como é a moradia em Portugal?</b>, <b>Como é o trabalho no Canadá?</b> ou <b>Compare Portugal com o Canadá</b>.";
 if(/ajud|o que voce|o que você|pode fazer|como funciona/.test(aiNorm(q)))return "Posso responder por país e separar a informação em <b>🏠 Moradia</b>, <b>🎭 Cultura</b>, <b>💼 Trabalho</b>, <b>🛂 Imigração</b>, <b>🎓 Estudo</b>, <b>🏥 Saúde</b>, <b>🌎 Turismo</b> e <b>🗣️ Idioma</b>. Também consigo comparar países quando os dois nomes aparecem na pergunta.";
 return "Consigo responder melhor se você colocar o nome do país. Ex.: <b>Como é a moradia no Japão?</b>, <b>Como é a cultura do Marrocos?</b>, <b>Como está o trabalho na Alemanha?</b> ou <b>Compare Portugal e Canadá em moradia, cultura e trabalho.</b>";
}

function renderSupport(){
 const cats=[["🍲","Alimentação e itens essenciais","Apoie iniciativas que oferecem necessidades básicas."],["⚖","Apoio jurídico e documentação","Fortaleça serviços de orientação e regularização."],["🎓","Educação e capacitação","Apoie aprendizagem, idioma e preparação profissional."],["⌂","Moradia temporária","Contribua para acolhimento e soluções de moradia."]];
 app.innerHTML=`<h1 class="page-title">Faça a diferença</h1><p class="page-sub">Apoio responsável também faz parte de uma jornada segura.</p>
 <div class="support-card"><div style="font-size:34px">🤝</div><h3>Impacto começa com informação</h3><p>Conheça categorias de apoio e escolha iniciativas verificáveis. O app não processa doações reais nesta versão.</p></div>
 <div class="section">${cats.map((c,i)=>`<button class="support-card" style="width:100%;text-align:left;margin-bottom:11px;cursor:pointer" data-support="${i}"><div style="font-size:27px">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p><span class="ghost">Explorar formas de apoio →</span></button>`).join("")}</div>
 <div class="notice">🔎 Antes de doar, verifique CNPJ/registro, site oficial, prestação de contas e canais de contato da organização escolhida.</div>`;
 document.querySelectorAll("[data-support]").forEach(b=>b.onclick=()=>{toast("Área de apoio aberta — selecione uma organização verificada antes de doar.")});
}

function renderProfile(){
 const p=get(STORE.profile,{name:"",email:"",country:"",notifications:true});
 document.getElementById("drawerName").textContent=p.name||"Sua conta";document.getElementById("drawerEmail").textContent=p.email||"Faça login para personalizar";document.getElementById("drawerAvatar").textContent=(p.name||"U").slice(0,2).toUpperCase();
 const ps=get(STORE.processes,demoProcesses);
 app.innerHTML=`<h1 class="page-title">Perfil</h1><p class="page-sub">Sua conta e preferências ficam neste dispositivo.</p>
 <div class="profile-card"><div class="profile-top"><div class="avatar">${esc((p.name||"U").slice(0,2).toUpperCase())}</div><div><h2>${esc(p.name||"Seu perfil")}</h2><p>${esc(p.email||"Entre na sua conta para personalizar seu perfil")}</p></div></div>
 <div class="section"><div class="setting"><div><b>País de interesse</b><small>${esc(p.country)}</small></div><button class="ghost" id="editProfile">Editar</button></div>
 <div class="setting"><div><b>Processos ativos</b><small>${ps.filter(x=>x.status!=="Concluído").length} acompanhamentos</small></div><button class="ghost" data-route="processes">Abrir</button></div>
 <div class="setting"><div><b>Notificações locais</b><small>Lembretes dentro do app</small></div><button class="switch ${p.notifications?"on":""}" id="toggleNotify" aria-label="Alternar notificações"></button></div>
 <div class="setting"><div><b>Dados locais</b><small>Discussões e processos ficam no seu navegador.</small></div><button class="ghost danger" id="clearData">Limpar</button></div>
 </div></div>
 <div class="section"><button class="secondary" style="width:100%" data-route="ai">✦ Falar com a IA</button><button class="ghost danger" id="logoutBtn" style="width:100%;margin-top:8px">↪ Sair da conta</button></div>`;
 document.getElementById("editProfile").onclick=()=>openProfileForm(p);
 document.getElementById("toggleNotify").onclick=()=>{p.notifications=!p.notifications;set(STORE.profile,p);renderProfile();toast(p.notifications?"Notificações ativadas.":"Notificações desativadas.")};
 document.getElementById("clearData").onclick=()=>{if(confirm("Apagar processos e discussões salvos neste dispositivo?")){localStorage.removeItem(STORE.processes);localStorage.removeItem(STORE.discussions);localStorage.removeItem(STORE.savedJobs);toast("Dados locais removidos.");renderProfile()}};
 const logoutBtn=document.getElementById("logoutBtn"); if(logoutBtn) logoutBtn.onclick=()=>{localStorage.removeItem("ims_user_session_v7");localStorage.removeItem(STORE.profile);showAuth();toast("Você saiu da conta.")};
}
function openProfileForm(p){
 modalRoot.innerHTML=`<div class="modal-wrap"><section class="modal"><div class="modal-head"><h2>Editar perfil</h2><button class="close" id="closeModal">×</button></div><form class="form" id="profileForm"><div class="field"><label>Nome</label><input name="name" required value="${esc(p.name)}"></div><div class="field"><label>E-mail</label><input name="email" type="email" required value="${esc(p.email)}"></div><div class="field"><label>País de interesse</label><input name="country" value="${esc(p.country)}" placeholder="Ex.: Portugal"></div><div class="form-actions"><button type="button" class="secondary" id="cancelForm">Cancelar</button><button class="primary">Salvar</button></div></form></section></div>`;
 document.getElementById("closeModal").onclick=closeModal;document.getElementById("cancelForm").onclick=closeModal;
 document.getElementById("profileForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);set(STORE.profile,{...p,name:f.get("name"),email:f.get("email"),country:f.get("country")});closeModal();toast("Perfil atualizado.");renderProfile()}
}
function closeModal(){modalRoot.innerHTML=""}
function openDrawer(){document.getElementById("drawer").classList.add("open");document.getElementById("drawer").setAttribute("aria-hidden","false");document.getElementById("overlay").classList.remove("hidden")}
function closeDrawer(){document.getElementById("drawer").classList.remove("open");document.getElementById("drawer").setAttribute("aria-hidden","true");document.getElementById("overlay").classList.add("hidden")}
document.addEventListener("click",e=>{const route=e.target.closest("[data-route]")?.dataset.route;if(route)routeTo(route)});
syncHeaderProfile();
document.getElementById("menuBtn").onclick=openDrawer;document.getElementById("closeDrawer").onclick=closeDrawer;document.getElementById("overlay").onclick=closeDrawer;document.getElementById("profileBtn").onclick=()=>routeTo("profile");
document.querySelector(".brand-mini").onclick=()=>routeTo("home");
window.addEventListener("hashchange",()=>{const r=location.hash.replace("#/","")||"home";state.route=r;render()});
function showAuth(){
 const auth=document.getElementById("auth-screen"); auth.classList.remove("hidden"); auth.setAttribute("aria-hidden","false");
 document.querySelector(".app-shell").classList.add("auth-locked");
}
function hideAuth(){
 const auth=document.getElementById("auth-screen"); auth.classList.add("hidden"); auth.setAttribute("aria-hidden","true");
 document.querySelector(".app-shell").classList.remove("auth-locked");
}
function currentUser(){return get("ims_user_session_v7",null)}
function saveSession(user){set("ims_user_session_v7",user);set(STORE.profile,{...get(STORE.profile,{}),name:user.name,email:user.email,country:user.country||get(STORE.profile,{}).country||"Brasil",notifications:true})}
function initAuth(){
 const tabs=document.querySelectorAll("[data-auth-tab]"), login=document.getElementById("login-form"), signup=document.getElementById("signup-form"), err=document.getElementById("auth-error");
 tabs.forEach(tab=>tab.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));tab.classList.add("active");const sign=tab.dataset.authTab==="signup";login.classList.toggle("hidden",sign);signup.classList.toggle("hidden",!sign);err.textContent=""});
 document.querySelectorAll(".password-toggle").forEach(b=>b.onclick=()=>{const input=b.parentElement.querySelector("input");input.type=input.type==="password"?"text":"password";b.textContent=input.type==="password"?"Mostrar":"Ocultar"});
 const demo=()=>{const user={name:"Visitante",email:"demo@immigratesafe.app",country:"Brasil"};saveSession(user);syncHeaderProfile();hideAuth();routeTo("home");toast("Bem-vinda ao modo demonstração! ✨")};
 document.getElementById("demoLogin").onclick=demo;
 login.onsubmit=e=>{e.preventDefault();const f=new FormData(login);const users=get("ims_users_v2",[]);const u=users.find(x=>x.email.toLowerCase()===String(f.get("email")).toLowerCase()&&x.password===f.get("password"));if(!u){err.textContent="E-mail ou senha incorretos. Você pode usar o modo demonstração.";return}saveSession(u);syncHeaderProfile();hideAuth();routeTo("home");toast("Login realizado. ✨")};
 signup.onsubmit=e=>{e.preventDefault();const f=new FormData(signup), email=String(f.get("email")).trim().toLowerCase(), users=get("ims_users_v2",[]);if(users.some(x=>x.email.toLowerCase()===email)){err.textContent="Este e-mail já está cadastrado neste dispositivo.";return}const user={name:String(f.get("name")).trim(),email,password:String(f.get("password")),country:String(f.get("country")||"")};users.push(user);set("ims_users_v2",users);saveSession(user);syncHeaderProfile();hideAuth();routeTo("home");toast("Conta criada. Sua jornada começa agora! 🚀")};
}
setTimeout(()=>{document.body.classList.add("ready")},50);
// V7 boot: autenticação obrigatória e isolamento das sessões antigas.
try{
  ["ims_user_session_v2","ims_user_session_v3","ims_user_session_v5","ims_user_session_v6","ims_user_session_v7"].forEach(k=>localStorage.removeItem(k));
  // Remove perfis de demonstrações antigas para nunca voltar a exibir Ana Silva.
  const old=localStorage.getItem("ims_profile_v1");
  if(old && /ana\s+silva|ana@email/i.test(old)) localStorage.removeItem("ims_profile_v1");
}catch{}
function syncHeaderProfile(){const u=currentUser();const b=document.getElementById("profileBtn");if(b)b.textContent=(u?.name||"U").slice(0,2).toUpperCase()}

const initial=location.hash.replace("#/","");state.route=initial||"home";
render();
initAuth();
initLanguage();

window.addEventListener("load",()=>{
  const splash=document.getElementById("splash-screen");
  // Nunca entra no app sem autenticação. Splash -> Login -> App.
  setTimeout(()=>{
    splash?.classList.add("hide");
    setTimeout(()=>{
      showAuth();
      translateDOM();
      initLanguage();
    },300);
  },1400);
  // V7: remove service workers antigos para impedir que o navegador sirva a versão velha.
  if("serviceWorker" in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});
  }
});

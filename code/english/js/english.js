// English module entry point and dashboard

function openEnglishDashboard(){
  currentLanguage='english'; clearGameState(); showScreen('content-screen');
  const content=document.getElementById('content'); if(!content)return;
  content.innerHTML=`<div class="page-heading"><div class="page-eyebrow">ELLENIKA / ENGLISH / B1</div><h2>ENGLISH</h2></div><div class="english-dashboard">
    <button class="english-module-card" onclick="openEnglishGrammar()"><span class="english-module-kicker">01</span><span><strong>GRAMMAR</strong><small>Tenses, structures and practice</small></span><b>→</b></button>
    <button class="english-module-card" onclick="openEnglishTranslation()"><span class="english-module-kicker">02</span><span><strong>TRANSLATION</strong><small>Translate and learn from mistakes</small></span><b>→</b></button>
    <button class="english-module-card" onclick="openEnglishWriting()"><span class="english-module-kicker">03</span><span><strong>WRITING</strong><small>Write freely with grammar and style feedback</small></span><b>→</b></button>
  </div>`;
}

function openEnglishGrammar(){renderEnglishPage('GRAMMAR',`<div class="english-topic-grid">${ENGLISH_GRAMMAR_TOPICS.map(topic=>`<button class="english-topic-card" onclick="startEnglishGrammar('${topic.id}')"><span>${escapeHtml(topic.level)}</span><strong>${escapeHtml(topic.name)}</strong><small>${escapeHtml(topic.shortDescription)}</small></button>`).join('')}</div>`);}

function renderEnglishPage(title,bodyHTML){
  currentLanguage='english'; clearGameState(); showScreen('content-screen');
  const content=document.getElementById('content'); if(!content)return;
  content.innerHTML=`<div class="page-heading"><div class="page-eyebrow">ELLENIKA / ENGLISH</div><h2>${escapeHtml(title)}</h2></div><div class="page-content english-page">${bodyHTML}</div>`;
}

function openEnglishTranslation(){renderEnglishPage('TRANSLATION',renderEnglishExerciseStart('translation'));}

function openEnglishWriting(){
  renderEnglishPage('WRITING',`<div class="english-writing-intro">
    <div class="english-writing-label">FREE WRITING</div><h3>Write in English</h3>
    <p>Grammar is checked automatically. Ellenika also suggests more natural phrases and synonyms.</p>
    <textarea id="english-writing-input" rows="8" placeholder="Try: I think swimming is very good for my health."></textarea>
    <div id="english-writing-feedback"></div>
    <div id="english-writing-enhancements"></div>
    <button class="english-primary-button" onclick="checkEnglishWriting()">FULL CHECK →</button>
  </div>`);
  attachEnglishLiveChecker('english-writing-input','english-writing-feedback');
}

async function checkEnglishWriting(){
  const input=document.getElementById('english-writing-input'), feedback=document.getElementById('english-writing-feedback');
  if(!input||!feedback)return;
  feedback.innerHTML='<div class="english-live-status">CHECKING…</div>';
  const result=await analyzeEnglishSentence(input.value,{});
  feedback.innerHTML=renderEnglishLiveFeedback(result);
}

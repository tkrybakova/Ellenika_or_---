// ============================================================
// english.js – English module entry point and dashboard
// ============================================================

function openEnglishDashboard() {
  clearGameState();
  showScreen('content-screen');
  const content = document.getElementById('content');
  if (!content) return;

  content.innerHTML = `
    <div class="page-heading">
      <div class="page-eyebrow">ELLENIKA / ENGLISH / B1</div>
      <h2>ENGLISH</h2>
    </div>
    <div class="english-dashboard">
      <button class="english-module-card" onclick="openEnglishGrammar()">
        <span class="english-module-kicker">01</span>
        <span><strong>GRAMMAR</strong><small>Tenses, structures and practice</small></span>
        <b>→</b>
      </button>
      <button class="english-module-card" onclick="openEnglishSentencePractice()">
        <span class="english-module-kicker">02</span>
        <span><strong>SENTENCE PRACTICE</strong><small>Build and check English sentences</small></span>
        <b>→</b>
      </button>
      <button class="english-module-card" onclick="openEnglishTranslation()">
        <span class="english-module-kicker">03</span>
        <span><strong>TRANSLATION</strong><small>Translate and learn from mistakes</small></span>
        <b>→</b>
      </button>
      <button class="english-module-card" onclick="openEnglishWriting()">
        <span class="english-module-kicker">04</span>
        <span><strong>WRITING</strong><small>Write freely with grammar feedback</small></span>
        <b>→</b>
      </button>
    </div>`;
}

function openEnglishGrammar() {
  renderEnglishPage('GRAMMAR', `
    <div class="english-topic-grid">
      ${ENGLISH_GRAMMAR_TOPICS.map(topic => `
        <button class="english-topic-card" onclick="startEnglishGrammar('${topic.id}')">
          <span>${escapeHtml(topic.level)}</span>
          <strong>${escapeHtml(topic.name)}</strong>
          <small>${escapeHtml(topic.shortDescription)}</small>
        </button>`).join('')}
    </div>`);
}

function renderEnglishPage(title, bodyHTML) {
  clearGameState();
  showScreen('content-screen');
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `<div class="page-heading"><div class="page-eyebrow">ELLENIKA / ENGLISH</div><h2>${escapeHtml(title)}</h2></div><div class="page-content english-page">${bodyHTML}</div>`;
}

function openEnglishSentencePractice() {
  renderEnglishPage('SENTENCE PRACTICE', renderEnglishExerciseStart('sentence'));
}

function openEnglishTranslation() {
  renderEnglishPage('TRANSLATION', renderEnglishExerciseStart('translation'));
}

function openEnglishWriting() {
  renderEnglishPage('WRITING', `
    <div class="english-writing-intro">
      <div class="english-writing-label">FREE WRITING</div>
      <h3>Write in English</h3>
      <p>Grammar checking will be connected to the English sentence checker in the next stage.</p>
      <textarea id="english-writing-input" rows="8" placeholder="Start writing..."></textarea>
      <button class="english-primary-button" onclick="checkEnglishWriting()">CHECK WRITING →</button>
      <div id="english-writing-feedback"></div>
    </div>`);
}

function checkEnglishWriting() {
  const input = document.getElementById('english-writing-input');
  const feedback = document.getElementById('english-writing-feedback');
  if (!input || !feedback) return;
  const result = checkEnglishSentence(input.value, {});
  feedback.innerHTML = renderEnglishFeedback(result);
}

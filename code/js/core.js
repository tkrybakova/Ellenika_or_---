// ============================================================
// core.js – common UI utilities and navigation
// ============================================================

const content = document.getElementById('content');

function clearGameState() {
  window.currentGame = null;
  window.currentDeclensionGame = null;
  window.genderTask = null;
}

function showScreen(id) {
  ['home-screen', 'dashboard-screen', 'content-screen'].forEach(screenId => {
    const el = document.getElementById(screenId);
    if (el) el.classList.toggle('hidden', screenId !== id);
  });
}

function showHome() { showScreen('home-screen'); }

function openGreekDashboard() {
  updateDashboardStats();
  showScreen('dashboard-screen');
}

function showLanguageMessage(language) {
  alert(language + ' is not available yet.');
}

function updateDashboardStats() {
  const vocabulary = document.getElementById('vocabulary-progress');
  const genders = document.getElementById('genders-progress');
  const declension = document.getElementById('declension-progress');
  if (vocabulary) vocabulary.textContent = `${Math.min(dictionary.length || 0, 3500)}/3500`;
  if (genders) genders.textContent = '50%';
  if (declension) declension.textContent = '19%';
}

function renderPage(title, bodyHTML, extraClass = '') {
  clearGameState();
  showScreen('content-screen');
  content.innerHTML = `
    <div class="page-heading">
      <div class="page-eyebrow">ELLENIKA / GREEK</div>
      <h2>${title}</h2>
    </div>
    <div class="page-content ${extraClass}">${bodyHTML}</div>
  `;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderLevelButtons(levels, startFn) {
  const descriptions = {
    easy: ['EASY', 'Choose the correct answer', '01'],
    medium: ['MEDIUM', 'Recall it without options', '02'],
    hard: ['HARD', 'Complete the full form', '03']
  };

  return `
    <div class="practice-intro">
      <p>Choose a difficulty level</p>
      <span>${levels.length} levels available</span>
    </div>
    <div class="level-grid">
      ${levels.map(level => {
        const item = descriptions[level] || [capitalize(level), 'Practice', ''];
        return `
          <button class="level-card level-${level}" onclick="${startFn}('${level}')">
            <span class="level-number">${item[2]}</span>
            <span class="level-name">${item[0]}</span>
            <span class="level-description">${item[1]}</span>
            <span class="level-arrow">→</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function showResult(text) {
  console.warn('showResult() is deprecated.');
  content.innerHTML += `<div class="result-card">${text}</div>`;
}

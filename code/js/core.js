// ============================================================
// core.js – общие утилиты и навигация интерфейса
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

function showHome() {
  showScreen('home-screen');
}

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

  // The dashboard starts with the values from the reference design.
  // Vocabulary updates automatically when words are added.
  if (vocabulary) vocabulary.textContent = `${Math.min(dictionary.length || 0, 3500)}/3500`;
  if (genders) genders.textContent = '50%';
  if (declension) declension.textContent = '19%';
}

function renderPage(title, bodyHTML, extraClass = '') {
  clearGameState();
  showScreen('content-screen');
  content.innerHTML = `
    <h2>${title}</h2>
    <div class="page-content ${extraClass}">
      ${bodyHTML}
    </div>
  `;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderLevelButtons(levels, startFn) {
  return levels
    .map(level => `<button onclick="${startFn}('${level}')">${capitalize(level)}</button>`)
    .join('');
}

function showResult(text) {
  console.warn('showResult() устарела. Используйте встроенные сообщения в играх.');
  content.innerHTML += `<h2>${text}</h2>`;
}

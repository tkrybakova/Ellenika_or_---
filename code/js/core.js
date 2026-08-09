// ============================================================
// core.js – общие утилиты
// ============================================================

const content = document.getElementById('content');

// Сброс состояния игр (глобальные переменные из других модулей)
function clearGameState() {
  window.currentGame = null;
  window.currentDeclensionGame = null;
  window.genderTask = null;
}

// Рендеринг страницы с заголовком и содержимым
function renderPage(title, bodyHTML, extraClass = '') {
  clearGameState();
  content.innerHTML = `
    <h2>${title}</h2>
    <div class="page-content ${extraClass}">
      ${bodyHTML}
    </div>
  `;
}

// Первая буква заглавная
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Генерация кнопок уровней (для genders и declension)
function renderLevelButtons(levels, startFn) {
  return levels
    .map(level => `<button onclick="${startFn}('${level}')">${capitalize(level)}</button>`)
    .join('');
}

// Устаревшая showResult (оставлена для совместимости)
function showResult(text) {
  console.warn('showResult() устарела. Используйте встроенные сообщения в играх.');
  content.innerHTML += `<h2>${text}</h2>`;
}
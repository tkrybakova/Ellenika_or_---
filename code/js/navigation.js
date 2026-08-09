// ============================================================
// navigation.js – открытие игровых разделов
// ============================================================

function openGenders() {
  if (!dictionary || dictionary.length === 0) {
    renderPage('Роды', '<p class="text-light">Сначала добавьте слова в словарь.</p>');
    return;
  }
  renderPage('Роды', renderLevelButtons(['easy', 'medium', 'hard'], 'startGender'));
}

function openDeclension() {
  if (!dictionary || dictionary.length === 0) {
    renderPage('Склонения', '<p class="text-light">Сначала добавьте слова в словарь.</p>');
    return;
  }
  renderPage('Склонения', renderLevelButtons(['easy', 'medium', 'hard'], 'startDeclension'));
}
// ============================================================
// navigation.js – opening learning sections
// ============================================================

function openGenders() {
  if (!dictionary || dictionary.length === 0) {
    renderPage('GENDERS', emptyState('Your vocabulary is empty', 'Add a few Greek words first.'));
    return;
  }
  renderPage('GENDERS', renderLevelButtons(['easy', 'medium', 'hard'], 'startGender'), 'practice-page');
}

function openDeclension() {
  if (!dictionary || dictionary.length === 0) {
    renderPage('DECLENSION', emptyState('Your vocabulary is empty', 'Add a few Greek words first.'));
    return;
  }
  renderPage('DECLENSION', renderLevelButtons(['easy', 'medium', 'hard'], 'startDeclension'), 'practice-page');
}

function openAdjectives() {
  renderPage('THE ADJECTIVES', renderLevelButtons(['easy', 'medium', 'hard'], 'startAdjective'), 'practice-page');
}

function openPronouns() {
  renderPage('PRONOUNS', renderPronounSections(), 'practice-page');
}

function emptyState(title, text) {
  return `
    <div class="empty-state">
      <div class="empty-icon">α</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <button class="secondary-action" onclick="openDictionary()">Add vocabulary</button>
    </div>
  `;
}

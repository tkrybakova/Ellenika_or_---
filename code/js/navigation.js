// ============================================================
// navigation.js – opening learning sections
// ============================================================

function practiceVocabularyWords() {
  const source = Array.isArray(dictionary) ? dictionary : [];
  return source
    .filter(word => word && String(word.greek ?? word.word ?? word.term ?? '').trim())
    .map(word => ({
      ...word,
      greek: String(word.greek ?? word.word ?? word.term ?? '').trim(),
      english: String(word.english ?? word.translation ?? '').trim(),
      russian: String(word.russian ?? '').trim(),
      article: String(word.article ?? word.definiteArticle ?? '').trim(),
      gender: String(word.gender ?? word.genus ?? '').trim().toLowerCase(),
      plural: String(word.plural ?? word.pluralForm ?? '').trim(),
      pluralArticle: String(word.pluralArticle ?? word.plural_article ?? '').trim()
    }));
}

function startGenderSafe(level = 'easy') {
  if (typeof genderTimer !== 'undefined') clearInterval(genderTimer);
  const words = practiceVocabularyWords();
  if (!words.length) {
    renderPage('GENDERS', emptyState('No usable vocabulary', 'The dictionary is loaded, but no word with a Greek form was found.'), 'practice-page');
    return;
  }
  currentGame = createGenderGame(words[Math.floor(Math.random() * words.length)]);
  currentGame.render(level);
}

function startDeclensionSafe(level = 'easy') {
  const words = practiceVocabularyWords();
  if (!words.length) {
    renderPage('DECLENSION', emptyState('No usable vocabulary', 'The dictionary is loaded, but no word with a Greek form was found.'), 'practice-page');
    return;
  }
  currentDeclensionGame = createDeclensionGame(words[Math.floor(Math.random() * words.length)]);
  currentDeclensionGame.render(level);
}

function openGenders() {
  if (!practiceVocabularyWords().length) {
    renderPage('GENDERS', emptyState('Your vocabulary is empty', 'Add a few Greek words first.'), 'practice-page');
    return;
  }
  renderPage('GENDERS', renderLevelButtons(['easy', 'medium', 'hard'], 'startGenderSafe'), 'practice-page');
}

function openDeclension() {
  if (!practiceVocabularyWords().length) {
    renderPage('DECLENSION', emptyState('Your vocabulary is empty', 'Add a few Greek words first.'), 'practice-page');
    return;
  }
  renderPage('DECLENSION', renderLevelButtons(['easy', 'medium', 'hard'], 'startDeclensionSafe'), 'practice-page');
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

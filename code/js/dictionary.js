// ============================================================
// dictionary.js – vocabulary management
// ============================================================

let selectedVocabularyLevel = 'ALL';

function openDictionary() {
  const html = `
    <section class="word-library">
      <div class="library-heading">
        <div><div class="section-label">YOUR WORDS</div><h3>Vocabulary</h3></div>
        <span class="word-count">${dictionary.length}</span>
      </div>
      <div class="dictionary-import-row">
        <label class="json-upload secondary-action"><span>＋ Load JSON</span><input type="file" accept="application/json,.json" onchange="importJSON(event)"></label>
        <button class="secondary-action" onclick="exportJSON()">↓ Export JSON</button>
      </div>
      <div class="vocabulary-levels">
        <button class="level-filter ${selectedVocabularyLevel === 'ALL' ? 'active' : ''}" onclick="filterVocabulary('ALL')">ALL<small>${dictionary.length}</small></button>
        ${VOCAB_LEVELS.map(level => `<button class="level-filter ${selectedVocabularyLevel === level ? 'active' : ''}" onclick="filterVocabulary('${level}')">${level}<small>${dictionary.filter(w => (w.level || 'A1') === level).length}</small></button>`).join('')}
      </div>
      <div class="dictionary-study-actions">
        <button class="primary-action study-cards-button" onclick="openCards(selectedVocabularyLevel)">Study with cards <span>→</span></button>
        <button class="secondary-action" onclick="openWriting(selectedVocabularyLevel)">Practice writing</button>
      </div>
      <div id="word-list">${renderWordList()}</div>
    </section>`;
  renderPage('VOCABULARY', html, 'dictionary-page');
}

function filterVocabulary(level) {
  selectedVocabularyLevel = level;
  const list = document.getElementById('word-list');
  if (list) list.innerHTML = renderWordList();
  document.querySelectorAll('.level-filter').forEach(button => button.classList.remove('active'));
  const active = [...document.querySelectorAll('.level-filter')].find(button => button.textContent.trim().startsWith(level));
  if (active) active.classList.add('active');
}

function getWordsForLevel(level = 'ALL') {
  return level === 'ALL' ? dictionary : dictionary.filter(word => (word.level || 'A1') === level);
}

function renderWordList() {
  const words = getWordsForLevel(selectedVocabularyLevel);
  if (!words.length) return `<div class="empty-state compact"><div class="empty-icon">α</div><h3>No words at this level</h3><p>Load a JSON dictionary to add words.</p></div>`;
  return words.map(w => {
    const index = dictionary.indexOf(w);
    const level = w.level || 'A1';
    return `<div class="dictionary-entry">
      <div class="entry-main">
        <span class="entry-greek">${w.article || ''} ${w.greek || ''}</span>
        <span class="entry-translation">${w.russian || ''} · ${w.english || ''}</span>
        <span class="entry-group">${w.group || 'General'}</span>
      </div>
      <div class="entry-meta"><span class="level-pill level-${level.toLowerCase()}">${level}</span><span class="gender-pill gender-${w.gender || 'neuter'}">${capitalize(w.gender || '')}</span><span>${w.pluralArticle || ''} ${w.plural || ''}</span></div>
      <button class="delete-btn" onclick="deleteWord(${index})" title="Delete word" aria-label="Delete word">×</button>
    </div>`;
  }).join('');
}

function deleteWord(index) {
  if (!confirm(`Delete “${dictionary[index].greek}”?`)) return;
  dictionary.splice(index, 1);
  saveWords();
  openDictionary();
}

function clearDictionary() {
  if (!dictionary || dictionary.length === 0) return;
  if (!confirm('Delete all saved words?')) return;
  dictionary.length = 0;
  saveWords();
  openDictionary();
}

// ============================================================
// dictionary.js – vocabulary management
// ============================================================

let selectedVocabularyLevel = 'ALL';

function openDictionary() {
  const formHTML = `
    <section class="dictionary-add">
      <div class="section-label">ADD WORD</div>
      <h3>Build your vocabulary</h3>
      <form id="add-word-form" class="word-form" onsubmit="return false;">
        <div class="form-row-main">
          <label class="field-main"><span>Greek</span><input id="greek" placeholder="βιβλίο" required></label>
          <label><span>English</span><input id="english" placeholder="book" required></label>
          <label><span>Russian</span><input id="russian" placeholder="книга" required></label>
          <label><span>Level</span><select id="level">${VOCAB_LEVELS.map(level => `<option value="${level}" ${level === 'A1' ? 'selected' : ''}>${level}</option>`).join('')}</select></label>
          <button class="primary-action" type="submit" onclick="addNewWord()">Add</button>
        </div>
        <div class="form-row-details">
          <label><span>Article</span><input id="article" placeholder="το" required></label>
          <label><span>Gender</span><select id="gender"><option value="masculine">Masculine</option><option value="feminine">Feminine</option><option value="neuter">Neuter</option></select></label>
          <label><span>Plural article</span><input id="pluralArticle" placeholder="τα" required></label>
          <label><span>Plural</span><input id="plural" placeholder="βιβλία" required></label>
        </div>
      </form>
    </section>

    <section class="word-library">
      <div class="library-heading">
        <div><div class="section-label">YOUR WORDS</div><h3>Vocabulary</h3></div>
        <span class="word-count">${dictionary.length}</span>
      </div>

      <div class="vocabulary-levels">
        <button class="level-filter ${selectedVocabularyLevel === 'ALL' ? 'active' : ''}" onclick="filterVocabulary('ALL')">ALL</button>
        ${VOCAB_LEVELS.map(level => `<button class="level-filter ${selectedVocabularyLevel === level ? 'active' : ''}" onclick="filterVocabulary('${level}')">${level}<small>${dictionary.filter(w => (w.level || 'A1') === level).length}</small></button>`).join('')}
      </div>

      <div class="dictionary-study-actions">
        <button class="primary-action study-cards-button" onclick="openCards(selectedVocabularyLevel)">Study with cards <span>→</span></button>
        <button class="secondary-action" onclick="openWriting(selectedVocabularyLevel)">Practice writing</button>
      </div>

      <div id="word-list">${renderWordList()}</div>
    </section>
  `;

  renderPage('VOCABULARY', formHTML, 'dictionary-page');

  const form = document.getElementById('add-word-form');
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewWord();
    }
  });
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
  if (!words.length) {
    return `<div class="empty-state compact"><div class="empty-icon">α</div><h3>No words at this level</h3><p>Add words or choose another level.</p></div>`;
  }

  return words.map(w => {
    const index = dictionary.indexOf(w);
    const level = w.level || 'A1';
    return `
      <div class="dictionary-entry">
        <div class="entry-main">
          <span class="entry-greek">${w.article || ''} ${w.greek || ''}</span>
          <span class="entry-translation">${w.russian || ''} · ${w.english || ''}</span>
        </div>
        <div class="entry-meta">
          <span class="level-pill level-${level.toLowerCase()}">${level}</span>
          <span class="gender-pill gender-${w.gender || 'neuter'}">${capitalize(w.gender || '')}</span>
          <span>${w.pluralArticle || ''} ${w.plural || ''}</span>
        </div>
        <button class="delete-btn" onclick="deleteWord(${index})" title="Delete word" aria-label="Delete word">×</button>
      </div>
    `;
  }).join('');
}

function addNewWord() {
  const fields = ['greek', 'english', 'russian', 'article', 'plural', 'pluralArticle'];
  for (const id of fields) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      alert(`Field "${id}" is required.`);
      if (el) el.focus();
      return;
    }
  }

  dictionary.push(normalizeWord({
    greek: document.getElementById('greek').value,
    english: document.getElementById('english').value,
    russian: document.getElementById('russian').value,
    article: document.getElementById('article').value,
    plural: document.getElementById('plural').value,
    pluralArticle: document.getElementById('pluralArticle').value,
    gender: document.getElementById('gender').value,
    level: document.getElementById('level').value
  }));

  saveWords();
  openDictionary();
  document.getElementById('greek')?.focus();
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

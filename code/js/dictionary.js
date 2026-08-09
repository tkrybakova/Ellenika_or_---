// ============================================================
// dictionary.js – vocabulary management
// ============================================================

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

      <div class="dictionary-study-actions">
        <button class="primary-action study-cards-button" onclick="openCards()">Study with cards <span>→</span></button>
        <button class="secondary-action" onclick="openWriting()">Practice writing</button>
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

function renderWordList() {
  if (!dictionary || dictionary.length === 0) {
    return `<div class="empty-state compact"><div class="empty-icon">α</div><h3>Your vocabulary is empty</h3><p>Add your first Greek word above.</p></div>`;
  }

  return dictionary.map((w, index) => `
    <div class="dictionary-entry">
      <div class="entry-main">
        <span class="entry-greek">${w.article || ''} ${w.greek || ''}</span>
        <span class="entry-translation">${w.russian || ''} · ${w.english || ''}</span>
      </div>
      <div class="entry-meta">
        <span class="gender-pill gender-${w.gender || 'neuter'}">${capitalize(w.gender || '')}</span>
        <span>${w.pluralArticle || ''} ${w.plural || ''}</span>
      </div>
      <button class="delete-btn" onclick="deleteWord(${index})" title="Delete word" aria-label="Delete word">×</button>
    </div>
  `).join('');
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

  dictionary.push({
    greek: document.getElementById('greek').value.trim(),
    english: document.getElementById('english').value.trim(),
    russian: document.getElementById('russian').value.trim(),
    article: document.getElementById('article').value.trim(),
    plural: document.getElementById('plural').value.trim(),
    pluralArticle: document.getElementById('pluralArticle').value.trim(),
    gender: document.getElementById('gender').value
  });

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

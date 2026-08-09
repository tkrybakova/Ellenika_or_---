// ============================================================
// dictionary.js – vocabulary management
// ============================================================

function openDictionary() {
  const formHTML = `
    <div class="dictionary-layout">
      <section class="dictionary-panel add-panel">
        <div class="panel-label">NEW WORD</div>
        <h3>Add vocabulary</h3>
        <p class="panel-description">Save a word with its articles, plural and translations.</p>
        <form id="add-word-form" class="word-form" onsubmit="return false;">
          <div class="form-grid two-col">
            <label><span>Greek *</span><input id="greek" placeholder="βιβλίο" required></label>
            <label><span>English *</span><input id="english" placeholder="book" required></label>
            <label><span>Russian *</span><input id="russian" placeholder="книга" required></label>
            <label><span>Gender</span><select id="gender"><option value="masculine">Masculine</option><option value="feminine">Feminine</option><option value="neuter">Neuter</option></select></label>
            <label><span>Singular article *</span><input id="article" placeholder="το" required></label>
            <label><span>Plural *</span><input id="plural" placeholder="βιβλία" required></label>
            <label><span>Plural article *</span><input id="pluralArticle" placeholder="τα" required></label>
          </div>
          <button class="primary-action add-action" type="submit" onclick="addNewWord()">+ Add word</button>
        </form>
      </section>

      <section class="dictionary-panel tools-panel">
        <div class="panel-label">PRACTICE</div>
        <h3>Train your words</h3>
        <div class="tool-grid">
          <button class="tool-card purple" onclick="openCards()"><span>01</span><strong>Cards</strong><small>Review vocabulary</small></button>
          <button class="tool-card orange" onclick="openWriting()"><span>02</span><strong>Writing</strong><small>Type what you remember</small></button>
        </div>
        <div class="data-actions">
          <button onclick="exportJSON()">↓ Export JSON</button>
          <label>↑ Import JSON<input type="file" accept=".json" onchange="importJSON(event)"></label>
          <button class="danger-action" onclick="clearDictionary()">Clear all</button>
        </div>
      </section>
    </div>

    <section class="word-library">
      <div class="library-heading">
        <div><div class="panel-label">YOUR VOCABULARY</div><h3>Word library</h3></div>
        <span class="word-count">${dictionary.length} words</span>
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
    return `<div class="empty-state compact"><div class="empty-icon">∅</div><h3>No words yet</h3><p>Your saved words will appear here.</p></div>`;
  }

  return dictionary.map((w, index) => `
    <div class="dictionary-entry">
      <div class="entry-main">
        <span class="entry-greek">${w.article || ''} ${w.greek || ''}</span>
        <span class="entry-translation">${w.russian || ''}</span>
      </div>
      <div class="entry-meta">
        <span>${w.english || ''}</span>
        <span>${capitalize(w.gender || '')}</span>
        <span>pl. ${w.pluralArticle || ''} ${w.plural || ''}</span>
      </div>
      <button class="delete-btn" onclick="deleteWord(${index})" title="Delete word">×</button>
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
  if (!dictionary || dictionary.length === 0) {
    alert('The dictionary is already empty.');
    return;
  }
  if (!confirm('Delete all saved words?')) return;
  dictionary.length = 0;
  saveWords();
  openDictionary();
}

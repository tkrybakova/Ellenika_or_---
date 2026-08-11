// ============================================================
// dictionary.js – группы слов и прогресс запоминания
// ============================================================

let selectedVocabularyLevel = 'ALL';
let selectedVocabularyGroup = null;

function getWordGroup(word) {
  // Новый формат JSON: "group": "Religion"
  return String(word.group || '').trim() || 'Без группы';
}

function getWordGroups(word) {
  return [getWordGroup(word)];
}

function getVocabularyGroups(level = 'ALL') {
  const words = getWordsForLevel(level);
  const map = new Map();

  words.forEach(word => {
    const group = getWordGroup(word);
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(word);
  });

  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'));
}

function getGroupProgress(words) {
  if (!words.length) return 0;
  const total = words.reduce((sum, word) => sum + getWordProgress(word), 0);
  return Math.round((total / (words.length * 3)) * 100);
}

function getProgressDots(percent) {
  const filled = Math.round(percent / 25);
  return Array.from(
    { length: 4 },
    (_, i) => `<span class="memory-dot ${i < filled ? 'filled' : ''}"></span>`
  ).join('');
}

function openDictionary() {
  selectedVocabularyGroup = null;

  const html = `
    <section class="word-library">
      <div class="library-heading">
        <div>
          <div class="section-label">VOCABULARY</div>
          <h3>Groups</h3>
          <p class="library-subtitle">Choose a topic to continue learning.</p>
        </div>
        <span class="word-count">${dictionary.length}</span>
      </div>

      <div class="dictionary-import-row">
        <label class="json-upload secondary-action">
          <span>＋ Load JSON</span>
          <input type="file" accept="application/json,.json" onchange="importJSON(event)">
        </label>
        <button class="secondary-action" onclick="exportJSON()">↓ Export JSON</button>
      </div>

      <div class="vocabulary-levels">
        <button class="level-filter ${selectedVocabularyLevel === 'ALL' ? 'active' : ''}" onclick="filterVocabulary('ALL')">
          ALL<small>${dictionary.length}</small>
        </button>
        ${VOCAB_LEVELS.map(level => `
          <button class="level-filter ${selectedVocabularyLevel === level ? 'active' : ''}" onclick="filterVocabulary('${level}')">
            ${level}<small>${dictionary.filter(w => String(w.level || '').toUpperCase() === level).length}</small>
          </button>
        `).join('')}
      </div>

      <div id="group-list" class="vocabulary-groups">${renderGroupList()}</div>
    </section>`;

  renderPage('VOCABULARY', html, 'dictionary-page');
}

function filterVocabulary(level) {
  selectedVocabularyLevel = level;
  selectedVocabularyGroup = null;

  const list = document.getElementById('group-list');
  if (list) list.innerHTML = renderGroupList();

  document.querySelectorAll('.level-filter').forEach(button => button.classList.remove('active'));
  const active = [...document.querySelectorAll('.level-filter')]
    .find(button => button.textContent.trim().startsWith(level));
  if (active) active.classList.add('active');
}

function getWordsForLevel(level = 'ALL') {
  if (level === 'ALL') return dictionary;
  return dictionary.filter(word => String(word.level || '').toUpperCase() === level);
}

function renderGroupList() {
  const groups = getVocabularyGroups(selectedVocabularyLevel);

  if (!groups.length) {
    return `<div class="empty-state compact">
      <div class="empty-icon">α</div>
      <h3>No words</h3>
      <p>Load the new JSON dictionary.</p>
    </div>`;
  }

  return groups.map(([group, words], index) => {
    const progress = getGroupProgress(words);

    // У группы может быть несколько уровней, потому что level принадлежит слову.
    const levels = [...new Set(
      words.map(word => String(word.level || '').toUpperCase()).filter(Boolean)
    )].join(' · ');

    return `<button class="vocabulary-group-card" onclick="openVocabularyGroup(${JSON.stringify(group)})">
      <div class="group-card-top">
        <span class="group-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="group-levels">${escapeHtml(levels || '—')}</span>
      </div>
      <div class="group-card-title">${escapeHtml(group)}</div>
      <div class="group-card-bottom">
        <span>${words.length} ${words.length === 1 ? 'word' : 'words'}</span>
        <span class="memory-progress">${getProgressDots(progress)} <b>${progress}%</b></span>
      </div>
      <div class="group-progress-bar"><span style="width:${progress}%"></span></div>
    </button>`;
  }).join('');
}

function openVocabularyGroup(group) {
  selectedVocabularyGroup = group;

  const words = getVocabularyGroups(selectedVocabularyLevel)
    .find(([name]) => name === group)?.[1] || [];

  if (!words.length) return;

  const progress = getGroupProgress(words);

  const html = `<section class="group-study-page">
    <div class="group-study-header">
      <button class="secondary-action" onclick="openDictionary()">← Groups</button>
      <div>
        <div class="section-label">VOCABULARY / ${escapeHtml(selectedVocabularyLevel)}</div>
        <h3>${escapeHtml(group)}</h3>
      </div>
      <div class="group-big-progress"><strong>${progress}%</strong><span>memorized</span></div>
    </div>

    <div class="group-study-actions">
      <button class="primary-action study-cards-button" onclick="openCardsForGroup(${JSON.stringify(group)})">
        Study with cards <span>→</span>
      </button>
      <button class="secondary-action" onclick="openWritingForGroup(${JSON.stringify(group)})">
        Practice writing
      </button>
    </div>

    <div class="group-word-summary">
      ${words.map(word => `
        <div class="word-progress-row">
          <span class="word-progress-name">${escapeHtml(word.greek)}</span>
          <span class="word-progress-level">${escapeHtml(String(word.level || 'A1').toUpperCase())}</span>
          <span class="word-progress-dots">${getProgressDots(getWordProgress(word) * 33.333)}</span>
        </div>
      `).join('')}
    </div>
  </section>`;

  renderPage('GROUP', html, 'dictionary-page');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
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

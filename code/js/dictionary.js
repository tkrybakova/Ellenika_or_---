// ============================================================
// dictionary.js – levels → groups → words + memory progress
// ============================================================

let selectedVocabularyLevel = null;
let selectedVocabularyGroup = null;

function getWordGroup(word) {
  return String(word.group || '').trim() || 'Без группы';
}

function getVocabularyLevels() {
  return VOCAB_LEVELS.filter(level =>
    dictionary.some(word => String(word.level || '').toUpperCase() === level)
  );
}

function getWordsForLevel(level) {
  if (!level) return [];
  return dictionary.filter(word => String(word.level || '').toUpperCase() === level);
}

function getVocabularyGroups(level) {
  const map = new Map();
  getWordsForLevel(level).forEach(word => {
    const group = getWordGroup(word);
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(word);
  });
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'));
}

function getGroupProgress(words) {
  if (!words.length) return 0;
  return Math.round(words.reduce((sum, word) => sum + getWordProgress(word), 0) / (words.length * 3) * 100);
}

function getLevelProgress(level) {
  return getGroupProgress(getWordsForLevel(level));
}

function getProgressDots(percent) {
  const filled = Math.round(percent / 25);
  return Array.from({ length: 4 }, (_, i) =>
    `<span class="memory-dot ${i < filled ? 'filled' : ''}"></span>`
  ).join('');
}

function groupClickArgument(group) {
  return encodeURIComponent(String(group));
}

function levelClickArgument(level) {
  return encodeURIComponent(String(level));
}

function openDictionary() {
  selectedVocabularyLevel = null;
  selectedVocabularyGroup = null;
  renderVocabularyHome();
}

function renderVocabularyHome() {
  const levels = getVocabularyLevels();

  const html = `
    <section class="word-library">
      <div class="library-heading">
        <div>
          <div class="section-label">VOCABULARY</div>
          <h3>Levels</h3>
          <p class="library-subtitle">Choose a level to see its groups and study options.</p>
        </div>
        <span class="word-count">${dictionary.length}</span>
      </div>

      <div class="dictionary-import-row">
        <label class="json-upload secondary-action"><span>＋ Load JSON</span>
          <input type="file" accept="application/json,.json" onchange="importJSON(event)">
        </label>
        <button type="button" class="secondary-action" onclick="exportJSON()">↓ Export JSON</button>
      </div>

      <div class="vocabulary-levels">
        ${levels.map(level => {
          const encoded = levelClickArgument(level);
          const count = getWordsForLevel(level).length;
          return `
            <button type="button" class="level-filter"
                    onclick="selectVocabularyLevel(decodeURIComponent('${encoded}'))">
              <span>${level}</span><small>${count}</small>
            </button>`;
        }).join('')}
      </div>

      <div id="group-list" class="vocabulary-groups">
        <div class="empty-state compact">
          <h3>Choose a level</h3>
          <p>Groups, Cards and Writing will appear here.</p>
        </div>
      </div>
    </section>`;

  renderPage('VOCABULARY', html, 'dictionary-page');
}

function selectVocabularyLevel(level) {
  selectedVocabularyLevel = level;
  selectedVocabularyGroup = null;

  const list = document.getElementById('group-list');
  if (list) list.innerHTML = renderSelectedLevel();

  document.querySelectorAll('.level-filter').forEach(button => button.classList.remove('active'));
  const active = [...document.querySelectorAll('.level-filter')]
    .find(button => button.textContent.trim().startsWith(level));
  if (active) active.classList.add('active');
}

function filterVocabulary(level) {
  selectVocabularyLevel(level);
}

function renderSelectedLevel() {
  const level = selectedVocabularyLevel;
  const words = getWordsForLevel(level);
  const groups = getVocabularyGroups(level);
  const progress = getLevelProgress(level);
  const encodedLevel = levelClickArgument(level);

  return `
    <div class="selected-level-panel">
      <div class="groups-heading">
        <div>
          <div class="section-label">LEVEL</div>
          <h3>${escapeHtml(level)}</h3>
        </div>
        <div class="level-total-progress">
          <strong>${progress}%</strong>
          <span>${words.length} words</span>
        </div>
      </div>

      <div class="level-study-actions">
        <button type="button" class="primary-action level-study-button"
                onclick="openCards(decodeURIComponent('${encodedLevel}'))">
          Study all with Cards →
        </button>
        <button type="button" class="secondary-action level-writing-button"
                onclick="openWriting(decodeURIComponent('${encodedLevel}'))">
          Practice all with Writing →
        </button>
      </div>

      <div class="groups-heading groups-heading-small">
        <div>
          <div class="section-label">GROUPS</div>
          <h3>Choose a topic</h3>
        </div>
        <span>${groups.length} groups</span>
      </div>

      <div class="vocabulary-groups-grid">
        ${groups.map(([group, groupWords], index) => {
          const groupProgress = getGroupProgress(groupWords);
          const encodedGroup = groupClickArgument(group);
          return `<button type="button" class="vocabulary-group-card"
            onclick="openVocabularyGroup(decodeURIComponent('${encodedGroup}'))">
            <div class="group-card-top">
              <span class="group-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="group-levels">${escapeHtml(level)}</span>
            </div>
            <div class="group-card-title">${escapeHtml(group)}</div>
            <div class="group-card-bottom">
              <span>${groupWords.length} ${groupWords.length === 1 ? 'word' : 'words'}</span>
              <span class="memory-progress">${getProgressDots(groupProgress)} <b>${groupProgress}%</b></span>
            </div>
            <div class="group-progress-bar"><span style="width:${groupProgress}%"></span></div>
          </button>`;
        }).join('')}
      </div>
    </div>`;
}

function renderGroupList() {
  return selectedVocabularyLevel ? renderSelectedLevel() : '';
}

function openVocabularyGroup(group) {
  selectedVocabularyGroup = group;
  const words = getVocabularyGroups(selectedVocabularyLevel)
    .find(([name]) => name === group)?.[1] || [];
  if (!words.length) return;

  const progress = getGroupProgress(words);
  const encodedGroup = groupClickArgument(group);
  const encodedLevel = levelClickArgument(selectedVocabularyLevel);

  const html = `<section class="group-study-page">
    <div class="group-study-header">
      <button type="button" class="secondary-action" onclick="selectVocabularyLevel(decodeURIComponent('${encodedLevel}'))">← ${escapeHtml(selectedVocabularyLevel)}</button>
      <div>
        <div class="section-label">VOCABULARY / ${escapeHtml(selectedVocabularyLevel)}</div>
        <h3>${escapeHtml(group)}</h3>
      </div>
      <div class="group-big-progress"><strong>${progress}%</strong><span>memorized</span></div>
    </div>

    <div class="group-study-actions">
      <button type="button" class="primary-action study-cards-button"
              onclick="openCardsForGroup(decodeURIComponent('${encodedGroup}'),decodeURIComponent('${encodedLevel}'))">
        Study with cards <span>→</span>
      </button>
      <button type="button" class="secondary-action"
              onclick="openWritingForGroup(decodeURIComponent('${encodedGroup}'),decodeURIComponent('${encodedLevel}'))">
        Practice writing
      </button>
    </div>

    <div class="group-word-summary">
      ${words.map(word => `
        <div class="word-progress-row">
          <span class="word-progress-name">${escapeHtml(word.greek)}</span>
          <span class="word-progress-level">${escapeHtml(String(word.level || '').toUpperCase())}</span>
          <span class="word-progress-dots">${getProgressDots(getWordProgress(word) * 33.333)}</span>
        </div>`).join('')}
    </div>
  </section>`;

  renderPage('GROUP', html, 'dictionary-page');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function deleteWord(index) {
  if (!confirm(`Delete “${dictionary[index].greek}”?`)) return;
  dictionary.splice(index, 1);
  saveWords();
  openDictionary();
}

function clearDictionary() {
  if (!dictionary.length) return;
  if (!confirm('Delete all saved words?')) return;
  dictionary.length = 0;
  saveWords();
  openDictionary();
}

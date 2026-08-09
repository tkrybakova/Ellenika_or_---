// ============================================================
// dictionary.js – добавление, удаление, список слов
// ============================================================

// Открыть словарь (главная страница)
function openDictionary() {
  const formHTML = `
    <form id="add-word-form" onsubmit="return false;">
      <input id="greek" placeholder="Greek *" required>
      <input id="english" placeholder="English *" required>
      <input id="russian" placeholder="Russian *" required>
      <br>
      <input id="article" placeholder="Article *" required>
      <input id="plural" placeholder="Plural *" required>
      <input id="pluralArticle" placeholder="Plural article *" required>
      <br>
      <select id="gender">
        <option value="masculine">Masculine</option>
        <option value="feminine">Feminine</option>
        <option value="neuter">Neuter</option>
      </select>
      <button type="submit" onclick="addNewWord()">➕ Добавить слово</button>
      <button type="button" onclick="clearDictionary()" style="background:#ef4444;">🗑 Очистить все</button>
    </form>

    <div class="dict-actions">
      <button onclick="openCards()" style="background:#8b5cf6;">📚 Карточки</button>
      <button onclick="openWriting()" style="background:#f59e0b;">✍️ Написание</button>
      <button onclick="exportJSON()" style="background:#059669;">📥 Скачать JSON</button>
      <label class="file-upload" style="background:#2563eb; padding:10px 24px; border-radius:30px; color:#fff; cursor:pointer; display:inline-block;">
        📤 Загрузить JSON
        <input type="file" accept=".json" onchange="importJSON(event)" style="display:none;">
      </label>
    </div>

    <hr>
    <div id="word-list">
      ${renderWordList()}
    </div>
  `;
  renderPage('Словарь', formHTML);

  const form = document.getElementById('add-word-form');
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewWord();
    }
  });
}

// Рендеринг списка слов
function renderWordList() {
  if (!dictionary || dictionary.length === 0) {
    return '<p class="text-light">Словарь пока пуст. Добавьте первое слово!</p>';
  }
  return dictionary
    .map((w, index) => `
      <div class="dictionary-entry">
        <strong>${w.article || ''} ${w.greek || ''}</strong>
        — ${w.russian || ''}
        <span class="text-light">(${w.english || ''})</span>
        <button class="delete-btn" onclick="deleteWord(${index})" title="Удалить слово">✕</button>
      </div>
    `)
    .join('');
}

// Добавление слова
function addNewWord() {
  const fields = ['greek', 'english', 'russian', 'article', 'plural', 'pluralArticle'];
  for (const id of fields) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      alert(`Поле "${id}" обязательно для заполнения`);
      if (el) el.focus();
      return;
    }
  }

  const word = {
    greek: document.getElementById('greek').value.trim(),
    english: document.getElementById('english').value.trim(),
    russian: document.getElementById('russian').value.trim(),
    article: document.getElementById('article').value.trim(),
    plural: document.getElementById('plural').value.trim(),
    pluralArticle: document.getElementById('pluralArticle').value.trim(),
    gender: document.getElementById('gender').value
  };

  dictionary.push(word);
  saveWords();

  const wordList = document.getElementById('word-list');
  if (wordList) {
    wordList.innerHTML = renderWordList();
  } else {
    openDictionary();
  }

  for (const id of fields) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }
  document.getElementById('greek').focus();
  alert('Слово добавлено!');
}

// Удаление слова
function deleteWord(index) {
  if (!confirm(`Удалить слово "${dictionary[index].greek}"?`)) return;
  dictionary.splice(index, 1);
  saveWords();
  const wordList = document.getElementById('word-list');
  if (wordList) {
    wordList.innerHTML = renderWordList();
  } else {
    openDictionary();
  }
}

// Очистка словаря
function clearDictionary() {
  if (!dictionary || dictionary.length === 0) {
    alert('Словарь уже пуст.');
    return;
  }
  if (!confirm('Вы уверены, что хотите удалить все слова?')) return;
  dictionary.length = 0;
  saveWords();
  const wordList = document.getElementById('word-list');
  if (wordList) {
    wordList.innerHTML = renderWordList();
  } else {
    openDictionary();
  }
  alert('Словарь очищен.');
}
// ============================================================
// storage.js – localStorage
// ============================================================
let dictionary = [];

const VOCAB_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function normalizeWord(word) {
  return {
    greek: (word.greek || '').trim(),
    english: (word.english || '').trim(),
    russian: (word.russian || '').trim(),
    article: (word.article || '').trim(),
    plural: (word.plural || '').trim(),
    pluralArticle: (word.pluralArticle || '').trim(),
    gender: word.gender || 'masculine',
    level: VOCAB_LEVELS.includes(String(word.level || '').toUpperCase()) ? String(word.level).toUpperCase() : 'A1'
  };
}

function loadWords() {
  try {
    const stored = localStorage.getItem('greekWords');
    if (stored) {
      const parsed = JSON.parse(stored);
      dictionary = Array.isArray(parsed) ? parsed.map(normalizeWord) : [];
    } else {
      dictionary = [];
    }
  } catch (error) {
    console.error('Ошибка загрузки словаря:', error);
    dictionary = [];
  }
}

function saveWords() {
  try {
    localStorage.setItem('greekWords', JSON.stringify(dictionary.map(normalizeWord)));
  } catch (error) {
    console.error('Ошибка сохранения словаря:', error);
    alert('Не удалось сохранить словарь. Возможно, превышен лимит хранилища.');
  }
}

function clearStorage() {
  if (confirm('Удалить все сохранённые слова?')) {
    localStorage.removeItem('greekWords');
    dictionary = [];
    if (typeof renderWordList === 'function') {
      const wordList = document.getElementById('word-list');
      if (wordList) wordList.innerHTML = renderWordList();
    }
  }
}

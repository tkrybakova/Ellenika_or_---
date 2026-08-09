// ============================================================
// Модуль работы с хранилищем (storage.js)
// ============================================================
let dictionary = [];

// Загрузка словаря из localStorage
function loadWords() {
  try {
    const stored = localStorage.getItem('greekWords');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Проверка, что это массив (защита от битых данных)
      dictionary = Array.isArray(parsed) ? parsed : [];
    } else {
      dictionary = [];
    }
  } catch (error) {
    console.error('Ошибка загрузки словаря:', error);
    dictionary = [];
    // Можно уведомить пользователя, но не прерываем работу
  }
}

// Сохранение словаря в localStorage
function saveWords() {
  try {
    localStorage.setItem('greekWords', JSON.stringify(dictionary));
  } catch (error) {
    console.error('Ошибка сохранения словаря:', error);
    alert('Не удалось сохранить словарь. Возможно, превышен лимит хранилища.');
  }
}

// ============================================================
// Вспомогательная функция для нормализации данных слова перед сохранением
// (используется в script.js, но может быть полезна и здесь)
// ============================================================
function normalizeWord(word) {
  return {
    greek: (word.greek || '').trim(),
    english: (word.english || '').trim(),
    russian: (word.russian || '').trim(),
    article: (word.article || '').trim(),
    plural: (word.plural || '').trim(),
    pluralArticle: (word.pluralArticle || '').trim(),
    gender: word.gender || 'masculine'
  };
}

// ============================================================
// (Опционально) Функция для полной очистки хранилища
// ============================================================
function clearStorage() {
  if (confirm('Удалить все сохранённые слова?')) {
    localStorage.removeItem('greekWords');
    dictionary = [];
    // Если есть функция обновления интерфейса – вызвать её
    if (typeof renderWordList === 'function') {
      const wordList = document.getElementById('word-list');
      if (wordList) wordList.innerHTML = renderWordList();
    }
    alert('Хранилище очищено.');
  }
}

// ============================================================
// ВНИМАНИЕ: Функция addNewWord() была перенесена в script.js,
// так как она отвечает за взаимодействие с интерфейсом.
// Здесь оставлены только чистые операции с localStorage.
// ============================================================
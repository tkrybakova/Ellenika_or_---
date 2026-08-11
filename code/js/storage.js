// ============================================================
// storage.js – localStorage + нормализация словаря
// ============================================================

let dictionary = [];
const VOCAB_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function normalizeGroups(word) {
  // Новый JSON использует ОДНО поле `group`, например:
  // { "level": "B2", "group": "Religion" }
  // Поддерживаем также `groups`, если в будущем у слова будет несколько групп.
  const raw = word.group ?? word.groups ?? [];

  if (Array.isArray(raw)) {
    return raw
      .map(value => String(value).trim())
      .filter(Boolean);
  }

  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeLevel(word) {
  const raw = word.level;
  if (raw === null || raw === undefined) return 'A1';

  const level = String(raw).trim().toUpperCase();
  return VOCAB_LEVELS.includes(level) ? level : 'A1';
}

function normalizeWord(word) {
  return {
    ...word,
    greek: String(word.greek || '').trim(),
    english: String(word.english || '').trim(),
    russian: String(word.russian || '').trim(),
    article: String(word.article || '').trim(),
    plural: String(word.plural || '').trim(),
    pluralArticle: String(word.pluralArticle || '').trim(),
    gender: String(word.gender || '').trim(),

    // ВАЖНО: эти значения берутся непосредственно из нового JSON.
    level: normalizeLevel(word),
    group: normalizeGroups(word)[0] || '',
    groups: normalizeGroups(word),

    memoryLevel: Math.max(0, Math.min(3, Number(word.memoryLevel) || 0)),
    reviewCount: Math.max(0, Number(word.reviewCount) || 0),
    lastReviewed: word.lastReviewed || null
  };
}

function loadWords() {
  try {
    const stored = localStorage.getItem('greekWords');
    const parsed = stored ? JSON.parse(stored) : [];

    dictionary = Array.isArray(parsed)
      ? parsed.map(normalizeWord).filter(word => word.greek)
      : [];
  } catch (error) {
    console.error('Ошибка загрузки словаря:', error);
    dictionary = [];
  }
}

function saveWords() {
  try {
    dictionary = dictionary.map(normalizeWord);
    localStorage.setItem('greekWords', JSON.stringify(dictionary));
  } catch (error) {
    console.error('Ошибка сохранения словаря:', error);
    alert('Не удалось сохранить словарь. Возможно, превышен лимит хранилища.');
  }
}

function updateWordMemory(word, level) {
  if (!word) return;

  word.memoryLevel = Math.max(0, Math.min(3, Number(level) || 0));
  word.reviewCount = (Number(word.reviewCount) || 0) + 1;
  word.lastReviewed = new Date().toISOString();

  saveWords();
  updateDashboardStats();
}

function getWordProgress(word) {
  return Math.max(0, Math.min(3, Number(word?.memoryLevel) || 0));
}

function clearStorage() {
  if (!confirm('Удалить все сохранённые слова?')) return;

  localStorage.removeItem('greekWords');
  dictionary = [];
  updateDashboardStats();
}

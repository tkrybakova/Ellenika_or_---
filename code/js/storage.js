// ============================================================
// storage.js – localStorage + нормализация словаря
// ============================================================

let dictionary = [];
const VOCAB_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const DEFAULT_DICTIONARY_URL = 'greek_dictionary.json';

function normalizeGroups(word) {
  const raw = word.group ?? word.groups ?? [];
  if (Array.isArray(raw)) return raw.map(value => String(value).trim()).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map(value => value.trim()).filter(Boolean);
  return [];
}

function normalizeLevel(word) {
  const raw = word.level;
  if (raw === null || raw === undefined) return 'A1';
  const level = String(raw).trim().toUpperCase();
  return VOCAB_LEVELS.includes(level) ? level : 'A1';
}

function normalizeWord(word) {
  const groups = normalizeGroups(word);
  return {
    ...word,
    greek: String(word.greek || '').trim(),
    english: String(word.english || '').trim(),
    russian: String(word.russian || '').trim(),
    article: String(word.article || '').trim(),
    plural: String(word.plural || '').trim(),
    pluralArticle: String(word.pluralArticle || '').trim(),
    gender: String(word.gender || '').trim(),
    level: normalizeLevel(word),
    group: groups[0] || '',
    groups,
    memoryLevel: Math.max(0, Math.min(3, Number(word.memoryLevel) || 0)),
    reviewCount: Math.max(0, Number(word.reviewCount) || 0),
    lastReviewed: word.lastReviewed || null
  };
}

function vocabularyKey(greek) {
  return String(greek || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function deduplicateWords(words) {
  const unique = new Map();

  for (const rawWord of Array.isArray(words) ? words : []) {
    const word = normalizeWord(rawWord);
    if (!word.greek) continue;

    const key = vocabularyKey(word.greek);
    const existing = unique.get(key);

    if (!existing) {
      unique.set(key, word);
      continue;
    }

    const groups = [...new Set([...(existing.groups || []), ...(word.groups || [])])];
    unique.set(key, {
      ...existing,
      english: existing.english || word.english,
      russian: existing.russian || word.russian,
      article: existing.article || word.article,
      plural: existing.plural || word.plural,
      pluralArticle: existing.pluralArticle || word.pluralArticle,
      gender: existing.gender || word.gender,
      level: existing.level || word.level,
      group: existing.group || word.group || groups[0] || '',
      groups
    });
  }

  return [...unique.values()];
}

function applyDictionary(words, preserveProgress = true) {
  const previous = new Map();
  if (preserveProgress) {
    dictionary.forEach(word => previous.set(vocabularyKey(word.greek), word));
  }

  dictionary = deduplicateWords(words).map(word => {
    const old = previous.get(vocabularyKey(word.greek));
    return old
      ? { ...word, memoryLevel: old.memoryLevel, reviewCount: old.reviewCount, lastReviewed: old.lastReviewed }
      : word;
  });
}

async function loadWords() {
  try {
    const stored = localStorage.getItem('greekWords');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) applyDictionary(parsed);
    }
  } catch (error) {
    console.warn('Не удалось прочитать локальный словарь:', error);
  }

  // The bundled JSON is the default vocabulary source. Existing local data
  // is kept when present so imported dictionaries are not silently overwritten.
  if (!dictionary.length) {
    try {
      const response = await fetch(DEFAULT_DICTIONARY_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bundled = await response.json();
      if (!Array.isArray(bundled) || !bundled.length) throw new Error('JSON dictionary is empty');

      applyDictionary(bundled, false);
      saveWords();
    } catch (error) {
      console.error('Ошибка загрузки встроенного словаря:', error);
    }
  } else {
    // Also cleans up duplicates left by older versions of the app.
    saveWords();
  }

  updateDashboardStats();
}

function saveWords() {
  try {
    dictionary = deduplicateWords(dictionary);
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

// ============================================================
// english-storage.js – local English progress and mistakes
// ============================================================

const ENGLISH_STORAGE_KEY = 'ellenikaEnglishProgress';

function getEnglishProgress() {
  try {
    return JSON.parse(localStorage.getItem(ENGLISH_STORAGE_KEY)) || { topics: {}, mistakes: {} };
  } catch (_) {
    return { topics: {}, mistakes: {} };
  }
}

function saveEnglishProgress(progress) {
  localStorage.setItem(ENGLISH_STORAGE_KEY, JSON.stringify(progress));
}

function recordEnglishResult(topic, result) {
  const progress = getEnglishProgress();
  progress.topics[topic] = progress.topics[topic] || { attempts: 0, correct: 0 };
  progress.topics[topic].attempts += 1;
  if (result.correct) progress.topics[topic].correct += 1;

  if (!result.correct) {
    result.errors.forEach(error => {
      const key = `${error.type}:${error.category || 'general'}`;
      progress.mistakes[key] = (progress.mistakes[key] || 0) + 1;
    });
  }

  saveEnglishProgress(progress);
}

// ============================================================
// live-checker.js – debounced real-time English feedback
// ============================================================

let englishLiveTimer = null;
let englishLiveRequest = 0;

function attachEnglishLiveChecker(inputId, feedbackId, exercise = {}) {
  const input = document.getElementById(inputId);
  const feedback = document.getElementById(feedbackId);
  if (!input || !feedback) return;

  input.addEventListener('input', () => {
    clearTimeout(englishLiveTimer);
    const value = input.value;
    if (!value.trim()) {
      feedback.innerHTML = '';
      return;
    }

    feedback.innerHTML = '<div class="english-live-status">CHECKING…</div>';
    const requestId = ++englishLiveRequest;
    englishLiveTimer = setTimeout(async () => {
      const result = await analyzeEnglishSentence(value, exercise);
      if (requestId !== englishLiveRequest) return;
      feedback.innerHTML = renderEnglishLiveFeedback(result);
    }, 550);
  });
}

function renderEnglishLiveFeedback(result) {
  if (result.correct) return '<div class="english-live-ok">✓ No detected errors</div>';
  if (!result.errors.length) return '<div class="english-live-status">No feedback available.</div>';

  const unique = [];
  const seen = new Set();
  result.errors.forEach(error => {
    const key = `${error.offset || ''}:${error.length || ''}:${error.message || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(error);
    }
  });

  return `<div class="english-live-results">${unique.slice(0, 6).map(error => `
    <div class="english-live-error">
      <div class="english-live-word">${escapeHtml(error.word || error.category || 'Grammar')}</div>
      <div class="english-live-message">${escapeHtml(error.message || '')}</div>
      ${error.suggestion ? `<button type="button" class="english-suggestion" onclick="replaceEnglishSuggestion(${Number(error.offset) || 0}, ${Number(error.length) || 0}, ${JSON.stringify(error.suggestion)})">${escapeHtml(error.suggestion)}</button>` : ''}
    </div>`).join('')}</div>`;
}

function replaceEnglishSuggestion(offset, length, replacement) {
  const input = document.getElementById('english-writing-input') || document.getElementById('english-answer');
  if (!input) return;
  const value = input.value;
  input.value = value.slice(0, offset) + replacement + value.slice(offset + length);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
}

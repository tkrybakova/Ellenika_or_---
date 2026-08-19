// Final compatibility layer for legacy pronoun exercise data.

let fixedPronounTarget = null;

function startPronoun(level) {
  pronounLevel = level;
  pronounQuestion = pronounSection.easy[Math.floor(Math.random() * pronounSection.easy.length)];

  if (level === 'easy') {
    renderPage('PRONOUNS', renderPronounExercise(), 'practice-page');
    return;
  }

  const rows = pronounSection.table || [];
  if (!rows.length) {
    renderPage('PRONOUNS', emptyState('PRONOUNS is not ready', 'This section has no declension data.'), 'practice-page');
    return;
  }

  const rowIndex = Math.floor(Math.random() * rows.length);
  const row = rows[rowIndex];
  const candidates = row.map((value, index) => ({ value, index })).filter(item => item.index > 0 && String(item.value || '').trim() && item.value !== '—');
  if (!candidates.length) {
    renderPage('PRONOUNS', emptyState('PRONOUNS is not ready', 'This section has no usable answer data.'), 'practice-page');
    return;
  }

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  fixedPronounTarget = { row, rowIndex, targetIndex: target.index, expected: target.value };

  const visibleRow = row.map((value, index) => index === target.index ? '___' : value);
  const caseLabel = pronounSection.cases?.[rowIndex] || `Form ${rowIndex + 1}`;
  const base = escapeHtml(pronounQuestion[0]);
  const rowHtml = visibleRow.map((value, index) => `<span class="pronoun-form-cell ${index === target.index ? 'target' : ''}">${escapeHtml(value)}</span>`).join('');

  const html = `<div class="pronoun-exercise f1-practice-card">
    <div class="exercise-top"><span>${escapeHtml(pronounSection.title)}</span><span>HARD · 02</span></div>
    <div class="progress-track"><i style="width:70%"></i></div>
    ${pronounHintButton('hard')}
    <div class="pronoun-prompt">Complete the missing form</div>
    <div class="pronoun-word">${base}</div>
    <div class="pronoun-case-label">${escapeHtml(caseLabel)}</div>
    <div class="pronoun-row-preview">${rowHtml}</div>
    <input id="fixed-pronoun-answer" class="pronoun-answer-input" autocomplete="off" placeholder="Type the missing form" autofocus>
    <button class="check-action" id="fixed-pronoun-check">CHECK</button>
    <div id="pronoun-result" class="pronoun-result"></div>
    <button class="next-action" id="fixed-pronoun-next">NEXT →</button>
  </div>`;

  renderPage('PRONOUNS', html, 'practice-page');

  const finish = () => {
    const answer = normalizeAnswer(document.getElementById('fixed-pronoun-answer')?.value);
    if (!answer) return;
    const correct = answer === normalizeAnswer(fixedPronounTarget.expected);
    recordGrammarAnswer('pronouns', correct);
    if (correct) addScore(20);
    const result = document.getElementById('pronoun-result');
    if (result) {
      result.className = `pronoun-result ${correct ? 'correct' : 'wrong'}`;
      result.textContent = correct ? 'CORRECT · +20 PTS' : `CHECK AGAIN · Correct: ${fixedPronounTarget.expected}`;
    }
  };

  document.getElementById('fixed-pronoun-check').onclick = finish;
  document.getElementById('fixed-pronoun-answer').onkeydown = event => { if (event.key === 'Enter') finish(); };
  document.getElementById('fixed-pronoun-next').onclick = () => startPronoun('hard');
}

// Final compatibility layer for practice exercises.
// Loaded after the base modules so the same scoring/feedback rules are used everywhere.

let fixedPronounTarget = null;

function finishPronounPractice(correct, message, level) {
  recordGrammarAnswer('pronouns', correct);
  if (correct && typeof addScore === 'function') addScore(PRACTICE_POINTS[level] || 10);

  const result = document.getElementById('practice-result');
  if (result) {
    result.className = correct ? 'correct practice-result' : 'wrong practice-result';
    result.textContent = `${correct ? '✓' : '✕'} ${message}${correct ? `  +${PRACTICE_POINTS[level] || 10} pts` : ''}`;
  }

  const next = document.getElementById('next-practice-btn');
  if (next) next.disabled = false;
}

function startPronoun(level = 'easy') {
  pronounLevel = level;
  if (!pronounSection) return;

  pronounQuestion = pronounSection.easy[Math.floor(Math.random() * pronounSection.easy.length)];

  if (level === 'easy') {
    const options = pronounSection.easy.slice().sort(() => Math.random() - 0.5);
    const html = `<div class="pronoun-exercise f1-practice-card">
      <div class="exercise-top"><span>${escapeHtml(pronounSection.title)}</span><span>EASY · 01</span></div>
      <div class="progress-track"><i style="width:33%"></i></div>
      ${pronounHintButton('easy')}
      <div class="pronoun-prompt">Choose the correct Greek pronoun</div>
      <div class="pronoun-word">${escapeHtml(pronounQuestion[1])}</div>
      <div class="pronoun-options">${options.map(([greek]) => `<button class="answer-card pronoun-option" data-answer="${escapeHtml(greek)}">${escapeHtml(greek)}</button>`).join('')}</div>
      ${renderFixedResultArea('NEXT →', () => startPronoun('easy'))}
    </div>`;

    renderPage('PRONOUNS', html, 'practice-page');

    let answered = false;
    document.querySelectorAll('.pronoun-option').forEach(button => {
      button.onclick = () => {
        if (answered) return;
        answered = true;
        const correct = normalizeAnswer(button.dataset.answer) === normalizeAnswer(pronounQuestion[0]);
        document.querySelectorAll('.pronoun-option').forEach(option => {
          option.disabled = true;
          if (normalizeAnswer(option.dataset.answer) === normalizeAnswer(pronounQuestion[0])) option.classList.add('correct');
        });
        if (!correct) button.classList.add('wrong');
        finishPronounPractice(correct, correct ? 'Correct answer.' : `Correct answer: ${pronounQuestion[0]}.`, 'easy');
      };
    });
    return;
  }

  const rows = pronounSection.table || [];
  if (!rows.length) {
    renderPage('PRONOUNS', emptyState('PRONOUNS is not ready', 'This section has no declension data.'), 'practice-page');
    return;
  }

  const rowIndex = Math.floor(Math.random() * rows.length);
  const row = rows[rowIndex];
  const candidates = row
    .map((value, index) => ({ value, index }))
    .filter(item => item.index > 0 && String(item.value || '').trim() && item.value !== '—');
  if (!candidates.length) {
    renderPage('PRONOUNS', emptyState('PRONOUNS is not ready', 'This section has no usable answer data.'), 'practice-page');
    return;
  }

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  fixedPronounTarget = { row, rowIndex, targetIndex: target.index, expected: target.value };

  const visibleRow = row.map((value, index) => index === target.index ? '___' : value);
  const caseLabel = pronounSection.cases?.[rowIndex] || `Form ${rowIndex + 1}`;
  const rowHtml = visibleRow.map((value, index) => `<span class="pronoun-form-cell ${index === target.targetIndex ? 'target' : ''}">${escapeHtml(value)}</span>`).join('');

  const html = `<div class="pronoun-exercise f1-practice-card">
    <div class="exercise-top"><span>${escapeHtml(pronounSection.title)}</span><span>HARD · 03</span></div>
    <div class="progress-track"><i style="width:100%"></i></div>
    ${pronounHintButton('hard')}
    <div class="pronoun-prompt">Complete the missing form</div>
    <div class="pronoun-case-label">${escapeHtml(caseLabel)}</div>
    <div class="pronoun-row-preview">${rowHtml}</div>
    <input id="fixed-pronoun-answer" class="pronoun-answer-input" autocomplete="off" placeholder="Type the missing form" autofocus>
    ${renderFixedResultArea('NEXT →', () => startPronoun('hard'))}
  </div>`;

  renderPage('PRONOUNS', html, 'practice-page');

  let answered = false;
  const finish = () => {
    if (answered) return;
    const input = document.getElementById('fixed-pronoun-answer');
    const answer = normalizeAnswer(input?.value);
    if (!answer) return;

    answered = true;
    const correct = answer === normalizeAnswer(fixedPronounTarget.expected);
    finishPronounPractice(correct, correct ? 'Correct answer.' : `Correct answer: ${fixedPronounTarget.expected}.`, 'hard');
    if (input) input.disabled = true;
  };

  document.getElementById('fixed-pronoun-check')?.addEventListener('click', finish);
  document.getElementById('fixed-pronoun-answer')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') finish();
  });
}

// Keep the degree-identification choices in a stable semantic order.
function startAdjective(level = 'easy') {
  clearInterval(typeof adjectiveTimer !== 'undefined' ? adjectiveTimer : null);
  adjectiveLevel = level;
  const word = FIXED_ADJECTIVES[Math.floor(Math.random() * FIXED_ADJECTIVES.length)];
  const labels = { easy: ['EASY', '01 / 03'], medium: ['MEDIUM', '02 / 03'], hard: ['HARD', '03 / 03'] };
  const [name, number] = labels[level] || labels.easy;

  if (level === 'easy') {
    const degrees = [
      ['positive', 'Positive Degree', word.positive],
      ['comparative', 'Comparative Degree', word.comparative],
      ['superlative', 'Superlative Degree', word.superlative]
    ];
    const target = degrees[Math.floor(Math.random() * degrees.length)];
    const task = `<div class="adj-prompt">IDENTIFY THE DEGREE</div>
      <div class="adj-word">${escapeHtml(target[2])}</div>
      <div class="adj-meaning">${escapeHtml(word.meaning)}</div>
      <div class="adj-options">${degrees.map(([id, label]) => `<button class="adj-option" data-degree="${id}">${label}</button>`).join('')}</div>`;
    document.getElementById('content').innerHTML = `<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:33%"></i></div>${task}${renderFixedResultArea('Next adjective →', () => startAdjective(level))}</div></div>`;

    let answered = false;
    const finish = correct => {
      if (answered) return;
      answered = true;
      finishFixedPractice({ section: 'adjectives', level, correct, message: correct ? `Correct: ${target[1]}.` : `Correct answer: ${target[1]}.`, next: { label: 'Next adjective →', action: () => startAdjective(level) } });
    };
    document.querySelectorAll('.adj-option').forEach(button => button.onclick = () => finish(button.dataset.degree === target[0]));
    return;
  }

  // Medium and hard retain the same answer/scoring behavior as the shared implementation.
  if (typeof window._baseStartAdjective === 'undefined') window._baseStartAdjective = null;
  const wordForTask = word;
  const degree = level === 'medium' ? wordForTask.comparative : wordForTask.superlative;
  const task = level === 'medium'
    ? `<div class="adj-prompt">WRITE THE COMPARATIVE</div><div class="adj-word">${escapeHtml(wordForTask.positive)}</div><div class="adj-meaning">${escapeHtml(wordForTask.meaning)}</div><div class="adj-input"><input id="adj-comparative" placeholder="Comparative"><button class="check-action" id="adj-check">CHECK</button></div>`
    : `<div class="adj-prompt">WRITE BOTH DEGREES</div><div class="adj-word">${escapeHtml(wordForTask.positive)}</div><div class="adj-meaning">${escapeHtml(wordForTask.meaning)}</div><div class="adj-hard"><label>Comparative<input id="adj-comparative" placeholder="Comparative"></label><label>Superlative<input id="adj-superlative" placeholder="Superlative"></label></div><button class="check-action" id="adj-check">CHECK ANSWER</button>`;

  document.getElementById('content').innerHTML = `<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:${level === 'medium' ? 66 : 100}%"></i></div>${task}${renderFixedResultArea('Next adjective →', () => startAdjective(level))}</div></div>`;
  let answered = false;
  const finish = (correct, message) => {
    if (answered) return;
    answered = true;
    finishFixedPractice({ section: 'adjectives', level, correct, message, next: { label: 'Next adjective →', action: () => startAdjective(level) } });
  };
  const check = () => {
    if (level === 'medium') {
      const answer = normalizeAnswer(document.getElementById('adj-comparative')?.value);
      if (!answer) return;
      finish(answer === normalizeAnswer(degree), answer === normalizeAnswer(degree) ? 'Correct comparative.' : `Correct form: ${degree}.`);
    } else {
      const comparative = normalizeAnswer(document.getElementById('adj-comparative')?.value);
      const superlative = normalizeAnswer(document.getElementById('adj-superlative')?.value);
      if (!comparative || !superlative) return;
      const correct = comparative === normalizeAnswer(wordForTask.comparative) && superlative === normalizeAnswer(wordForTask.superlative);
      finish(correct, correct ? 'Correct forms.' : `Correct forms: ${wordForTask.comparative} / ${wordForTask.superlative}.`);
    }
  };
  document.getElementById('adj-check')?.addEventListener('click', check);
  document.querySelectorAll('.adjective-redesign input').forEach(input => input.onkeydown = event => { if (event.key === 'Enter') check(); });
}

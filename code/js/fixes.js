// ============================================================
// fixes.js – shared practice rules and compatibility fixes
// Loaded last so every practice module uses the same runtime rules.
// ============================================================

const PRACTICE_POINTS = { easy: 10, medium: 15, hard: 20 };
const FIXED_ADJECTIVES = [
  { positive: 'καλός', comparative: 'καλύτερος', superlative: 'κάλλιστος', meaning: 'good / well' },
  { positive: 'μεγάλος', comparative: 'μεγαλύτερος', superlative: 'μέγιστος', meaning: 'big / large' },
  { positive: 'μικρός', comparative: 'μικρότερος', superlative: 'ελάχιστος', meaning: 'small' },
  { positive: 'γρήγορος', comparative: 'γρηγορότερος', superlative: 'γρηγορότατος', meaning: 'fast' },
  { positive: 'αργός', comparative: 'αργότερος', superlative: 'αργότατος', meaning: 'slow' },
  { positive: 'εύκολος', comparative: 'ευκολότερος', superlative: 'ευκολότατος', meaning: 'easy' },
  { positive: 'δύσκολος', comparative: 'δυσκολότερος', superlative: 'δυσκολότατος', meaning: 'difficult' },
  { positive: 'ψηλός', comparative: 'ψηλότερος', superlative: 'ψηλότατος', meaning: 'tall / high' },
  { positive: 'χαμηλός', comparative: 'χαμηλότερος', superlative: 'χαμηλότατος', meaning: 'low' },
  { positive: 'ωραίος', comparative: 'ωραιότερος', superlative: 'ωραιότατος', meaning: 'beautiful / nice' }
];

function normalizeAnswer(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getGrammarStats() {
  try { return JSON.parse(localStorage.getItem('ellenikaGrammarStats') || '{}'); }
  catch (_) { return {}; }
}

function recordGrammarAnswer(section, correct) {
  const stats = getGrammarStats();
  stats[section] = stats[section] || { attempts: 0, correct: 0 };
  stats[section].attempts += 1;
  if (correct) stats[section].correct += 1;
  localStorage.setItem('ellenikaGrammarStats', JSON.stringify(stats));
  if (typeof updateDashboardStats === 'function') updateDashboardStats();
}

function getGrammarProgress(section) {
  const item = getGrammarStats()[section];
  if (!item || !item.attempts) return 0;
  return Math.round((item.correct / item.attempts) * 100);
}

function finishFixedPractice({ section, level, correct, message, next }) {
  recordGrammarAnswer(section, correct);
  if (correct && typeof addScore === 'function') addScore(PRACTICE_POINTS[level] || 10);
  const result = document.getElementById('practice-result');
  if (result) {
    result.className = correct ? 'correct practice-result' : 'wrong practice-result';
    result.textContent = `${correct ? '✓' : '!'} ${message}${correct ? `  +${PRACTICE_POINTS[level] || 10} pts` : ''}`;
  }
  const button = document.getElementById('next-practice-btn');
  if (button) {
    button.textContent = next.label;
    button.onclick = next.action;
  }
}

function renderFixedResultArea(nextLabel, nextAction) {
  return `<div id="practice-result" class="practice-result"></div><button id="next-practice-btn" class="next-action">${nextLabel}</button>`;
}

function choosePracticeWord(level, predicate) {
  const words = getWordsForLevel(level).filter(predicate);
  return words.length ? words[Math.floor(Math.random() * words.length)] : null;
}

function showMissingPracticeData(section, level, required) {
  const title = section.toUpperCase();
  const detail = `No ${level.toUpperCase()} words contain the data required for this level (${required}).`;
  renderPage(title, emptyState(`${title} is not ready`, detail), 'practice-page');
}

// ---------------- GENDERS ----------------
function startGender(level = 'easy') {
  clearInterval(typeof genderTimer !== 'undefined' ? genderTimer : null);
  currentLevel = level;
  const requirements = {
    easy: ['gender'],
    medium: ['article'],
    hard: ['gender', 'article', 'plural', 'pluralArticle']
  };
  const required = requirements[level] || requirements.easy;
  const word = choosePracticeWord(level, w => required.every(key => String(w[key] || '').trim()));
  if (!word) {
    showMissingPracticeData('genders', level, required.join(', '));
    return;
  }

  genderStyles();
  const labels = { easy: ['EASY', '01 / 03'], medium: ['MEDIUM', '02 / 03'], hard: ['HARD', '03 / 03'] };
  const [name, number] = labels[level] || labels.easy;
  const translation = `<div class="word-translation">${escapeHtml(word.russian || '')}${word.english ? ` · ${escapeHtml(word.english)}` : ''}</div>`;
  const accArticle = word.gender === 'masculine' ? 'τον' : word.gender === 'feminine' ? 'τη/την' : 'το';
  let task;

  if (level === 'easy') {
    task = `<div class="prompt-label">WHAT IS THE GENDER?</div><div class="greek-word">${escapeHtml(word.greek)}</div>${translation}<div class="word-hint">Choose the correct gender</div><div class="answer-grid three">${[['masculine','ο'],['feminine','η'],['neuter','το']].map(([g,a]) => `<button class="answer-card" data-answer="${g}"><span>${a}</span><strong>${capitalize(g)}</strong></button>`).join('')}</div>`;
  } else if (level === 'medium') {
    task = `<div class="prompt-label">COMPLETE THE ARTICLE</div><div class="word-line">___ ${escapeHtml(word.greek)}</div>${translation}<div class="input-row"><input id="gender-answer" placeholder="Type ο / η / το" autofocus><button class="check-action" id="gender-check">CHECK</button></div>`;
  } else {
    task = `<div class="prompt-label">BUILD THE PLURAL</div><div class="greek-word small">${escapeHtml(word.article)} ${escapeHtml(word.greek)}</div>${translation}<div class="hard-form"><label>Plural word<input id="gender-plural" placeholder="Plural"></label><label>Plural article<input id="gender-plural-article" placeholder="Article"></label></div><button class="check-action full" id="gender-check">CHECK ANSWER</button>`;
  }

  document.getElementById('content').innerHTML = `<div class="gender-redesign"><div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span><div class="gender-timer-wrap"><span class="gender-timer-label">TIME</span><span id="gender-timer" class="gender-timer">1:00</span></div></div><div class="progress-track"><i style="width:${level === 'easy' ? 33 : level === 'medium' ? 66 : 100}%"></i></div>${task}${renderFixedResultArea('Next word →', () => startGender(level))}</div></div>`;

  let answered = false;
  const finish = (correct, message) => {
    if (answered) return;
    answered = true;
    finishFixedPractice({ section: 'genders', level, correct, message, next: { label: 'Next word →', action: () => startGender(level) } });
    clearInterval(genderTimer);
  };

  if (level === 'easy') {
    document.querySelectorAll('.gender-redesign .answer-card').forEach(button => {
      button.addEventListener('click', () => finish(button.dataset.answer === word.gender, button.dataset.answer === word.gender ? 'Correct gender.' : `Correct answer: ${capitalize(word.gender)}.`));
    });
  } else if (level === 'medium') {
    const check = () => {
      const answer = normalizeAnswer(document.getElementById('gender-answer').value);
      if (!answer) return;
      const correct = answer === normalizeAnswer(word.article);
      finish(correct, correct ? 'Correct article.' : `Correct answer: ${word.article}.`);
    };
    document.getElementById('gender-check').onclick = check;
    document.getElementById('gender-answer').onkeydown = e => { if (e.key === 'Enter') check(); };
  } else {
    const check = () => {
      const plural = normalizeAnswer(document.getElementById('gender-plural').value);
      const article = normalizeAnswer(document.getElementById('gender-plural-article').value);
      if (!plural || !article) return;
      const correct = plural === normalizeAnswer(word.plural) && article === normalizeAnswer(word.pluralArticle);
      finish(correct, correct ? 'Correct plural.' : `Correct form: ${word.pluralArticle} ${word.plural}.`);
    };
    document.getElementById('gender-check').onclick = check;
    document.querySelectorAll('.gender-redesign input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') check(); });
  }
  currentGame = { isAnswered: () => answered, timeUp: () => finish(false, `Time's up. Correct answer: ${word.article} ${word.greek}.`) };
  startGenderTimer();
}

// ---------------- DECLENSION ----------------
function getAccusativeArticle(word) {
  if (word.gender === 'masculine') return 'τον';
  if (word.gender === 'feminine') return 'τη';
  return 'το';
}

function startDeclension(level = 'easy') {
  clearInterval(window.ellenikaDeclensionTimer);
  currentDeclensionLevel = level;
  const word = choosePracticeWord(level, w => ['gender', 'article'].every(key => String(w[key] || '').trim()));
  if (!word) {
    showMissingPracticeData('declension', level, 'gender, article');
    return;
  }

  declensionStyles();
  const labels = { easy: ['EASY', '01 / 03'], medium: ['MEDIUM', '02 / 03'], hard: ['HARD', '03 / 03'] };
  const [name, number] = labels[level] || labels.easy;
  const accusative = getAccusativeArticle(word);
  const objectContext = Math.random() < 0.5;
  const correctCase = objectContext ? 'accusative' : 'nominative';
  const correctArticle = objectContext ? accusative : word.article;
  const sentence = objectContext ? `Βλέπω ___ ${escapeHtml(word.greek)}` : `___ ${escapeHtml(word.greek)}`;
  const translation = `<div class="word-translation">${escapeHtml(word.russian || '')}${word.english ? ` · ${escapeHtml(word.english)}` : ''}</div>`;

  let task;
  if (level === 'easy') {
    task = `<div class="prompt-label">CHOOSE THE CASE</div><div class="word-line">${sentence}</div>${translation}<div class="word-hint">Which case is used here?</div><div class="answer-grid"><button class="answer-card" data-case="nominative"><span>Ονομαστική</span><strong>Nominative</strong></button><button class="answer-card" data-case="accusative"><span>Αιτιατική</span><strong>Accusative</strong></button></div>`;
  } else if (level === 'medium') {
    task = `<div class="prompt-label">COMPLETE THE ARTICLE</div><div class="word-line">${sentence}</div>${translation}<div class="input-row"><input id="declension-article" placeholder="Article" autofocus><button class="check-action" id="declension-check">CHECK</button></div>`;
  } else {
    task = `<div class="prompt-label">BUILD THE FORM</div><div class="word-line">${sentence}</div>${translation}<div class="hard-form"><label>Article<input id="declension-hard-article" placeholder="Article"></label><label>Case<input id="declension-hard-case" placeholder="Nominative / Accusative"></label></div><button class="check-action full" id="declension-check">CHECK ANSWER</button>`;
  }

  document.getElementById('content').innerHTML = `<div class="declension-redesign"><div class="exercise-shell"><div class="exercise-top"><span>DECLENSION / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:${level === 'easy' ? 33 : level === 'medium' ? 66 : 100}%"></i></div>${task}${renderFixedResultArea('Next word →', () => startDeclension(level))}</div></div>`;

  let answered = false;
  const finish = (correct, message) => {
    if (answered) return;
    answered = true;
    finishFixedPractice({ section: 'declension', level, correct, message, next: { label: 'Next word →', action: () => startDeclension(level) } });
  };

  if (level === 'easy') {
    document.querySelectorAll('.declension-redesign .answer-card').forEach(button => button.onclick = () => {
      const correct = button.dataset.case === correctCase;
      finish(correct, correct ? `Correct case: ${correctCase === 'accusative' ? 'Αιτιατική' : 'Ονομαστική'}.` : `Correct answer: ${correctCase === 'accusative' ? 'Αιτιατική' : 'Ονομαστική'}.`);
    });
  } else if (level === 'medium') {
    const check = () => {
      const answer = normalizeAnswer(document.getElementById('declension-article').value);
      if (!answer) return;
      const correct = answer === normalizeAnswer(correctArticle) || (objectContext && word.gender === 'feminine' && answer === 'την');
      finish(correct, correct ? 'Correct article.' : `Correct article: ${correctArticle}.`);
    };
    document.getElementById('declension-check').onclick = check;
    document.getElementById('declension-article').onkeydown = e => { if (e.key === 'Enter') check(); };
  } else {
    const check = () => {
      const article = normalizeAnswer(document.getElementById('declension-hard-article').value);
      const caseAnswer = normalizeAnswer(document.getElementById('declension-hard-case').value);
      if (!article || !caseAnswer) return;
      const caseCorrect = caseAnswer === correctCase || caseAnswer === (correctCase === 'accusative' ? 'αιτιατική' : 'ονομαστική');
      const articleCorrect = article === normalizeAnswer(correctArticle) || (objectContext && word.gender === 'feminine' && article === 'την');
      finish(caseCorrect && articleCorrect, caseCorrect && articleCorrect ? 'Correct form.' : `Correct form: ${correctArticle} · ${correctCase}.`);
    };
    document.getElementById('declension-check').onclick = check;
    document.querySelectorAll('.declension-redesign input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') check(); });
  }
}

// ---------------- ADJECTIVES ----------------
function startAdjective(level = 'easy') {
  clearInterval(typeof adjectiveTimer !== 'undefined' ? adjectiveTimer : null);
  adjectiveLevel = level;
  const word = FIXED_ADJECTIVES[Math.floor(Math.random() * FIXED_ADJECTIVES.length)];
  adjectiveStyles();
  const labels = { easy: ['EASY', '01 / 03'], medium: ['MEDIUM', '02 / 03'], hard: ['HARD', '03 / 03'] };
  const [name, number] = labels[level] || labels.easy;
  const degreeData = [
    ['positive', 'Positive Degree', word.positive],
    ['comparative', 'Comparative Degree', word.comparative],
    ['superlative', 'Superlative Degree', word.superlative]
  ];
  const target = degreeData[Math.floor(Math.random() * degreeData.length)];
  let task;
  if (level === 'easy') {
    const options = degreeData.slice().sort(() => Math.random() - 0.5);
    task = `<div class="adj-prompt">IDENTIFY THE DEGREE</div><div class="adj-word">${escapeHtml(target[2])}</div><div class="adj-meaning">${escapeHtml(word.meaning)}</div><div class="adj-options">${options.map(([id,label]) => `<button class="adj-option" data-degree="${id}">${label}</button>`).join('')}</div>`;
  } else if (level === 'medium') {
    task = `<div class="adj-prompt">WRITE THE COMPARATIVE</div><div class="adj-word">${escapeHtml(word.positive)}</div><div class="adj-meaning">${escapeHtml(word.meaning)}</div><div class="adj-input"><input id="adj-comparative" placeholder="Comparative"><button class="check-action" id="adj-check">CHECK</button></div>`;
  } else {
    task = `<div class="adj-prompt">WRITE BOTH DEGREES</div><div class="adj-word">${escapeHtml(word.positive)}</div><div class="adj-meaning">${escapeHtml(word.meaning)}</div><div class="adj-hard"><label>Comparative<input id="adj-comparative" placeholder="Comparative"></label><label>Superlative<input id="adj-superlative" placeholder="Superlative"></label></div><button class="check-action" id="adj-check">CHECK ANSWER</button>`;
  }

  document.getElementById('content').innerHTML = `<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / ${name}</span><span>${number}</span><div class="adj-timer"><span>TIME</span><strong id="adjective-timer">1:00</strong></div></div><div class="progress-track"><i style="width:${level === 'easy' ? 33 : level === 'medium' ? 66 : 100}%"></i></div>${task}${renderFixedResultArea('Next adjective →', () => startAdjective(level))}</div></div>`;

  let answered = false;
  const finish = (correct, message) => {
    if (answered) return;
    answered = true;
    clearInterval(adjectiveTimer);
    finishFixedPractice({ section: 'adjectives', level, correct, message, next: { label: 'Next adjective →', action: () => startAdjective(level) } });
  };

  if (level === 'easy') {
    document.querySelectorAll('.adjective-redesign .adj-option').forEach(button => button.onclick = () => {
      const correct = button.dataset.degree === target[0];
      finish(correct, correct ? `Correct: ${target[1]}.` : `Correct answer: ${target[1]}.`);
    });
  } else if (level === 'medium') {
    const check = () => {
      const answer = normalizeAnswer(document.getElementById('adj-comparative').value);
      if (!answer) return;
      const correct = answer === normalizeAnswer(word.comparative);
      finish(correct, correct ? 'Correct comparative.' : `Correct form: ${word.comparative}.`);
    };
    document.getElementById('adj-check').onclick = check;
    document.getElementById('adj-comparative').onkeydown = e => { if (e.key === 'Enter') check(); };
  } else {
    const check = () => {
      const comparative = normalizeAnswer(document.getElementById('adj-comparative').value);
      const superlative = normalizeAnswer(document.getElementById('adj-superlative').value);
      if (!comparative || !superlative) return;
      const correct = comparative === normalizeAnswer(word.comparative) && superlative === normalizeAnswer(word.superlative);
      finish(correct, correct ? 'Correct forms.' : `Correct forms: ${word.comparative} / ${word.superlative}.`);
    };
    document.getElementById('adj-check').onclick = check;
    document.querySelectorAll('.adjective-redesign input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') check(); });
  }

  adjectiveTimer = setInterval(() => {
    const timer = document.getElementById('adjective-timer');
    if (!timer || answered) { clearInterval(adjectiveTimer); return; }
    const seconds = Number(timer.dataset.seconds || 60) - 1;
    timer.dataset.seconds = String(seconds);
    timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    if (seconds <= 15) timer.style.color = '#e10600';
    if (seconds <= 0) finish(false, `Time's up. Correct answer: ${target[1] || word.comparative}.`);
  }, 1000);
}

// ---------------- PRONOUN COMPATIBILITY ----------------
function checkPronounEasy(btn, answer) {
  const correct = normalizeAnswer(answer) === normalizeAnswer(pronounQuestion[1]);
  btn.classList.add(correct ? 'correct' : 'wrong');
  recordGrammarAnswer('pronouns', correct);
  if (correct && typeof addScore === 'function') addScore(10);
  if (correct && typeof showF1BroadcastMessage === 'function') showF1BroadcastMessage();
  if (!correct) btn.classList.add('answer-reveal');
}

function checkPronounHard() {
  const s = pronounSection;
  const row = s.table[Math.floor(Math.random() * s.table.length)];
  const cells = s.cases.map((_, i) => document.getElementById(`pronoun-cell-${i}`));
  const values = cells.map(input => normalizeAnswer(input?.value));
  const expected = row.slice(0, cells.length).map(normalizeAnswer);
  const ok = values.every((value, i) => value === expected[i] || (expected[i] === '—' && value === ''));
  const result = document.getElementById('pronoun-result');
  if (!result) return;
  recordGrammarAnswer('pronouns', ok);
  result.textContent = ok ? 'CORRECT · +20 PTS' : `CHECK AGAIN · Example: ${row.join(' · ')}`;
  result.className = `pronoun-result ${ok ? 'correct' : 'wrong'}`;
  if (ok && typeof addScore === 'function') addScore(20);
  if (ok && typeof showF1BroadcastMessage === 'function') showF1BroadcastMessage();
}

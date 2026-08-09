let currentGame = null;
let currentLevel = 'easy';

function createGenderGame(task) {
  const word = task;
  let answered = false;

  function result(correct, message) {
    answered = true;
    let el = document.getElementById('gender-result');
    if (!el) { el = document.createElement('div'); el.id = 'gender-result'; document.getElementById('content').appendChild(el); }
    el.className = correct ? 'correct practice-result' : 'wrong practice-result';
    el.textContent = (correct ? '✓ ' : '! ') + message;
    showNext();
  }

  function checkGender(selected) {
    if (answered) return;
    const correct = selected === word.gender;
    result(correct, correct ? 'Correct gender.' : `Correct answer: ${capitalize(word.gender)}.`);
  }

  function checkArticle() {
    if (answered) return;
    const input = document.getElementById('genderAnswer');
    const answer = input.value.trim();
    if (!answer) { result(false, 'Enter an article first.'); return; }
    const correct = answer === word.article;
    result(correct, correct ? 'Correct article.' : `Correct article: ${word.article}.`);
  }

  function checkPlural() {
    if (answered) return;
    const plural = document.getElementById('pluralAnswer').value.trim();
    const article = document.getElementById('pluralArticleAnswer').value.trim();
    if (!plural || !article) { result(false, 'Complete both fields.'); return; }
    const correct = plural === word.plural && article === word.pluralArticle;
    result(correct, correct ? 'Correct plural.' : `Correct form: ${word.pluralArticle} ${word.plural}.`);
  }

  function showNext() {
    const old = document.getElementById('next-gender-btn'); if (old) old.remove();
    const btn = document.createElement('button'); btn.id = 'next-gender-btn'; btn.className = 'next-action'; btn.textContent = 'Next word →';
    btn.onclick = () => startGender(currentLevel); document.getElementById('content').appendChild(btn);
  }

  function render(level) {
    const labels = {easy:['EASY','01 / 03'],medium:['MEDIUM','02 / 03'],hard:['HARD','03 / 03']};
    const [name,number] = labels[level] || labels.easy;
    const translation = `<div class="word-translation">${word.russian || ''}${word.english ? ` · ${word.english}` : ''}</div>`;
    const templates = {
      easy: `<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:33%"></i></div><div class="prompt-label">WHAT IS THE GENDER?</div><div class="greek-word">${word.greek}</div>${translation}<div class="word-hint">Choose one answer</div><div class="answer-grid three"><button class="answer-card" onclick="currentGame.checkGender('masculine')"><span>ὁ</span><strong>Masculine</strong></button><button class="answer-card" onclick="currentGame.checkGender('feminine')"><span>η</span><strong>Feminine</strong></button><button class="answer-card" onclick="currentGame.checkGender('neuter')"><span>το</span><strong>Neuter</strong></button></div></div>`,
      medium: `<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:66%"></i></div><div class="prompt-label">COMPLETE THE ARTICLE</div><div class="word-line">___ <span>${word.greek}</span></div>${translation}<div class="input-row"><input id="genderAnswer" placeholder="Type the article" autofocus><button class="check-action" onclick="currentGame.checkArticle()">Check</button></div><div class="word-hint">ο / η / το</div></div>`,
      hard: `<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:100%"></i></div><div class="prompt-label">BUILD THE PLURAL</div><div class="greek-word small">${word.article} ${word.greek}</div>${translation}<div class="hard-form"><label>Plural word<input id="pluralAnswer" placeholder="Plural"></label><label>Plural article<input id="pluralArticleAnswer" placeholder="Article"></label></div><button class="check-action full" onclick="currentGame.checkPlural()">Check answer</button></div>`
    };
    document.getElementById('content').innerHTML = templates[level] || templates.easy;
    currentLevel = level; answered = false;
    document.querySelectorAll('#content input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('#content .check-action')?.click(); }));
  }

  return {checkGender,checkArticle,checkPlural,render,word};
}

function startGender(level) {
  if (!dictionary || !dictionary.length) { document.getElementById('content').innerHTML = '<div class="empty-state"><h3>Your dictionary is empty</h3><p>Add words before starting practice.</p></div>'; return; }
  currentGame = createGenderGame(dictionary[Math.floor(Math.random()*dictionary.length)]);
  currentGame.render(level);
}

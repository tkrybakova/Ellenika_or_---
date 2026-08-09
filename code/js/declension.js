let currentDeclensionGame = null;
let currentDeclensionLevel = 'easy';

function createDeclensionGame(task) {
  const word = task;
  let answered = false;

  function result(correct, message) {
    answered = true;
    let el = document.getElementById('declension-result');
    if (!el) { el = document.createElement('div'); el.id = 'declension-result'; document.getElementById('content').appendChild(el); }
    el.className = correct ? 'correct practice-result' : 'wrong practice-result';
    el.textContent = (correct ? '✓ ' : '! ') + message;
    showNext();
  }

  function checkCase(selected) {
    if (answered) return;
    result(selected === 'accusative', selected === 'accusative' ? 'Correct case: Αιτιατική.' : 'Correct case: Αιτιατική.');
  }

  function checkPrep() {
    if (answered) return;
    const answer = document.getElementById('prep').value.trim();
    if (!answer) { result(false, 'Enter a preposition first.'); return; }
    result(answer === 'στο', answer === 'στο' ? 'Correct preposition.' : 'Correct answer: στο.');
  }

  function checkHard() {
    if (answered) return;
    const ending = document.getElementById('ending').value.trim();
    const prep = document.getElementById('preposition').value.trim();
    if (!ending || !prep) { result(false, 'Complete both fields.'); return; }
    result(false, 'The advanced ending check is still being developed.');
  }

  function showNext() {
    const old = document.getElementById('next-declension-btn'); if (old) old.remove();
    const btn = document.createElement('button'); btn.id = 'next-declension-btn'; btn.className = 'next-action'; btn.textContent = 'Next word →';
    btn.onclick = () => startDeclension(currentDeclensionLevel); document.getElementById('content').appendChild(btn);
  }

  function render(level) {
    const labels = {easy:['EASY','01 / 03'],medium:['MEDIUM','02 / 03'],hard:['HARD','03 / 03']};
    const [name,number] = labels[level] || labels.easy;
    const templates = {
      easy: `<div class="exercise-shell"><div class="exercise-top"><span>DECLENSION / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:33%"></i></div><div class="prompt-label">CHOOSE THE CASE</div><div class="word-line">Βλέπω <span>${word.greek}</span></div><div class="word-hint">Which case is used here?</div><div class="answer-grid two"><button class="answer-card" onclick="currentDeclensionGame.checkCase('accusative')"><span>Αιτιατική</span><strong>Accusative</strong></button><button class="answer-card" onclick="currentDeclensionGame.checkCase('nominative')"><span>Ονομαστική</span><strong>Nominative</strong></button></div></div>`,
      medium: `<div class="exercise-shell"><div class="exercise-top"><span>DECLENSION / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:66%"></i></div><div class="prompt-label">COMPLETE THE PREPOSITION</div><div class="word-line">___ ${word.greek}</div><div class="input-row"><input id="prep" placeholder="Type the preposition" autofocus><button class="check-action" onclick="currentDeclensionGame.checkPrep()">Check</button></div><div class="word-hint">Hint: στο</div></div>`,
      hard: `<div class="exercise-shell"><div class="exercise-top"><span>DECLENSION / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:100%"></i></div><div class="prompt-label">COMPLETE THE FORM</div><div class="greek-word small">με ${word.greek}</div><div class="hard-form"><label>Ending<input id="ending" placeholder="Ending"></label><label>Preposition<input id="preposition" placeholder="Preposition"></label></div><button class="check-action full" onclick="currentDeclensionGame.checkHard()">Check answer</button></div>`
    };
    document.getElementById('content').innerHTML = templates[level] || templates.easy;
    currentDeclensionLevel = level; answered = false;
    document.querySelectorAll('#content input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('#content .check-action')?.click(); }));
  }

  return {checkCase,checkPrep,checkHard,render,word};
}

function startDeclension(level) {
  if (!dictionary || !dictionary.length) { document.getElementById('content').innerHTML = '<div class="empty-state"><h3>Your dictionary is empty</h3><p>Add words before starting practice.</p></div>'; return; }
  currentDeclensionGame = createDeclensionGame(dictionary[Math.floor(Math.random()*dictionary.length)]);
  currentDeclensionGame.render(level);
}

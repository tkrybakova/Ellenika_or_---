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
    const genderHint = `
      <div class="gender-hint-wrap" style="position:relative;margin-top:16px;">
        <button type="button" class="gender-help-button" aria-label="Show gender hint" title="Gender hint"
          onclick="this.nextElementSibling.hidden = !this.nextElementSibling.hidden; this.setAttribute('aria-expanded', String(!this.nextElementSibling.hidden));">
          <span aria-hidden="true">?</span>
        </button>
        <div class="gender-hint" hidden style="margin-top:10px;padding:18px 20px;background:rgba(255,255,255,.96);border:1px solid #dce5ea;border-radius:16px;text-align:left;box-shadow:0 8px 24px rgba(45,64,74,.08);">
          <div class="gender-hint-title" style="margin-bottom:12px;color:#52636d;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Quick hint · noun gender</div>
          <div class="gender-hint-table" style="overflow:hidden;border:1px solid #e1e8ec;border-radius:12px;background:#fff;">
            <div class="gender-hint-row gender-hint-head" style="display:grid;grid-template-columns:1.05fr .7fr 2fr;gap:12px;padding:9px 11px;background:#f3f7f9;color:#87959d;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">
              <span>Gender</span><span>Article</span><span>Common endings</span>
            </div>
            <div class="gender-hint-row" style="display:grid;grid-template-columns:1.05fr .7fr 2fr;gap:12px;padding:11px;border-top:1px solid #edf1f3;align-items:center;color:#354650;font-size:12px;">
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/1.mp3" target="_blank" rel="noopener" style="color:#2299e9;font-weight:700;text-decoration:none;">Αρσενικά</a><small style="display:block;margin-top:2px;color:#99a5ac;font-size:10px;">Masculine</small></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/o.mp3" target="_blank" rel="noopener" style="color:#354650;font-weight:800;text-decoration:none;">ο</a></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/os.mp3" target="_blank" rel="noopener">-ος</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/as.mp3" target="_blank" rel="noopener">-ας</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/is.mp3" target="_blank" rel="noopener">-ης</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/ous.mp3" target="_blank" rel="noopener">-ους</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/es.mp3" target="_blank" rel="noopener">-ες</a></span>
            </div>
            <div class="gender-hint-row" style="display:grid;grid-template-columns:1.05fr .7fr 2fr;gap:12px;padding:11px;border-top:1px solid #edf1f3;align-items:center;color:#354650;font-size:12px;">
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/2.mp3" target="_blank" rel="noopener" style="color:#2299e9;font-weight:700;text-decoration:none;">Θηλυκά</a><small style="display:block;margin-top:2px;color:#99a5ac;font-size:10px;">Feminine</small></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/i.mp3" target="_blank" rel="noopener" style="color:#354650;font-weight:800;text-decoration:none;">η</a></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/os.mp3" target="_blank" rel="noopener">-ος</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/iIta.mp3" target="_blank" rel="noopener">-η</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/a.mp3" target="_blank" rel="noopener">-α</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/oOmega.mp3" target="_blank" rel="noopener">-ω</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/ou.mp3" target="_blank" rel="noopener">-ου</a></span>
            </div>
            <div class="gender-hint-row" style="display:grid;grid-template-columns:1.05fr .7fr 2fr;gap:12px;padding:11px;border-top:1px solid #edf1f3;align-items:center;color:#354650;font-size:12px;">
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/3.mp3" target="_blank" rel="noopener" style="color:#2299e9;font-weight:700;text-decoration:none;">Ουδέτερα</a><small style="display:block;margin-top:2px;color:#99a5ac;font-size:10px;">Neuter</small></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/to.mp3" target="_blank" rel="noopener" style="color:#354650;font-weight:800;text-decoration:none;">το</a></span>
              <span><a href="https://www.ilearngreek.com/lessons/sounds/genders/os.mp3" target="_blank" rel="noopener">-ος</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/iGIOTA.mp3" target="_blank" rel="noopener">-ι</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/ma.mp3" target="_blank" rel="noopener">-μα</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/o.mp3" target="_blank" rel="noopener">-ο</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/as.mp3" target="_blank" rel="noopener">-ας</a>, <a href="https://www.ilearngreek.com/lessons/sounds/genders/a.mp3" target="_blank" rel="noopener">-α</a></span>
            </div>
          </div>
          <div class="gender-hint-note" style="margin-top:9px;color:#94a0a7;font-size:10px;">These are common patterns, not absolute rules. Click a Greek form to hear it.</div>
        </div>
      </div>`;
    const templates = {
      easy: `<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:33%"></i></div><div class="prompt-label">WHAT IS THE GENDER?</div><div class="greek-word">${word.greek}</div>${translation}<div class="word-hint">Choose one answer</div><div class="answer-grid three"><button class="answer-card" onclick="currentGame.checkGender('masculine')"><span>ὁ</span><strong>Masculine</strong></button><button class="answer-card" onclick="currentGame.checkGender('feminine')"><span>η</span><strong>Feminine</strong></button><button class="answer-card" onclick="currentGame.checkGender('neuter')"><span>το</span><strong>Neuter</strong></button></div>${genderHint}</div>`,
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

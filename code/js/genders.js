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
    const input = document.getElementById('genderAnswer'); const answer = input.value.trim();
    if (!answer) { result(false, 'Enter an article first.'); return; }
    result(answer === word.article, answer === word.article ? 'Correct article.' : `Correct article: ${word.article}.`);
  }
  function checkPlural() {
    if (answered) return;
    const plural = document.getElementById('pluralAnswer').value.trim(); const article = document.getElementById('pluralArticleAnswer').value.trim();
    if (!plural || !article) { result(false, 'Complete both fields.'); return; }
    const correct = plural === word.plural && article === word.pluralArticle;
    result(correct, correct ? 'Correct plural.' : `Correct form: ${word.pluralArticle} ${word.plural}.`);
  }
  function showNext() {
    const old = document.getElementById('next-gender-btn'); if (old) old.remove();
    const btn = document.createElement('button'); btn.id = 'next-gender-btn'; btn.className = 'next-action'; btn.textContent = 'Next word →';
    btn.onclick = () => startGender(currentLevel); document.getElementById('content').appendChild(btn);
  }

  const easyHint = `<div class="gender-hint-wrap" style="position:relative;margin-top:16px;">
    <button type="button" class="gender-help-button" aria-label="Show gender hint" title="Gender hint" onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden;this.setAttribute('aria-expanded',String(!this.nextElementSibling.hidden));"><span aria-hidden="true">?</span></button>
    <div class="gender-hint" hidden style="margin-top:10px;padding:18px 20px;background:rgba(255,255,255,.96);border:1px solid #dce5ea;border-radius:16px;text-align:left;box-shadow:0 8px 24px rgba(45,64,74,.08);">
      <div style="margin-bottom:12px;color:#52636d;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Quick hint · noun gender</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:#f3f7f9;color:#87959d;text-transform:uppercase;font-size:10px"><th style="padding:9px;text-align:left">Gender</th><th style="padding:9px;text-align:left">Article</th><th style="padding:9px;text-align:left">Common endings</th></tr></thead><tbody>
      <tr><td style="padding:10px;border-top:1px solid #edf1f3"><b>Αρσενικά</b><small style="display:block;color:#99a5ac">Masculine</small></td><td style="padding:10px;border-top:1px solid #edf1f3">ο</td><td style="padding:10px;border-top:1px solid #edf1f3">-ος, -ας, -ης, -ους, -ες</td></tr>
      <tr><td style="padding:10px;border-top:1px solid #edf1f3"><b>Θηλυκά</b><small style="display:block;color:#99a5ac">Feminine</small></td><td style="padding:10px;border-top:1px solid #edf1f3">η</td><td style="padding:10px;border-top:1px solid #edf1f3">-ος, -η, -α, -ω, -ου</td></tr>
      <tr><td style="padding:10px;border-top:1px solid #edf1f3"><b>Ουδέτερα</b><small style="display:block;color:#99a5ac">Neuter</small></td><td style="padding:10px;border-top:1px solid #edf1f3">το</td><td style="padding:10px;border-top:1px solid #edf1f3">-ος, -ι, -μα, -ο, -ας, -α</td></tr></tbody></table>
    </div></div>`;

  const fullHint = `<div class="gender-hint-wrap" style="position:relative;margin-top:16px;">
    <button type="button" class="gender-help-button" aria-label="Show grammar table" title="Grammar table" onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden;this.setAttribute('aria-expanded',String(!this.nextElementSibling.hidden));"><span aria-hidden="true">?</span></button>
    <div class="gender-hint" hidden style="margin-top:10px;padding:18px 14px;background:rgba(255,255,255,.97);border:1px solid #dce5ea;border-radius:16px;text-align:left;box-shadow:0 8px 24px rgba(45,64,74,.08);overflow-x:auto;">
      <div style="margin-bottom:12px;color:#52636d;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Quick hint · singular → plural</div>
      <table style="width:100%;min-width:540px;border-collapse:collapse;font-size:12px;text-align:center"><thead>
        <tr style="background:#f3f7f9;color:#52636d"><th colspan="2" style="padding:8px">Masculine<br><small>(Αρσενικά)</small></th><th colspan="2" style="padding:8px">Feminine<br><small>(Θηλυκά)</small></th><th colspan="2" style="padding:8px">Neuter<br><small>(Ουδέτερα)</small></th></tr>
        <tr style="background:#fafcfd;color:#87959d;font-size:10px"><th style="padding:7px">Singular</th><th style="padding:7px">Plural</th><th style="padding:7px">Singular</th><th style="padding:7px">Plural</th><th style="padding:7px">Singular</th><th style="padding:7px">Plural</th></tr></thead><tbody>
        <tr><td>-ος</td><td>-οι</td><td>-ος</td><td>-οι</td><td>-ος</td><td>-η</td></tr>
        <tr><td>-ας</td><td>-ες, -αδες</td><td>-η</td><td>-ες</td><td>-ο</td><td>-α</td></tr>
        <tr><td>-ης</td><td>-ες</td><td>-α</td><td>-ες</td><td>-μα</td><td>-ματα</td></tr>
        <tr><td>-ους</td><td>-ουδες</td><td>-ου</td><td>-ουδες</td><td>-ι</td><td>-ια</td></tr>
        <tr><td>-ες</td><td>-εδες</td><td>-ω</td><td>-*</td><td>-ας</td><td>-ατα</td></tr>
        <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-α</td><td>-ατα</td></tr></tbody></table>
      <div style="margin-top:9px;color:#94a0a7;font-size:10px">These are common patterns, not absolute rules.</div>
    </div></div>`;

  function render(level) {
    const labels={easy:['EASY','01 / 03'],medium:['MEDIUM','02 / 03'],hard:['HARD','03 / 03']}; const [name,number]=labels[level]||labels.easy;
    const translation=`<div class="word-translation">${word.russian||''}${word.english?` · ${word.english}`:''}</div>`;
    const templates={
      easy:`<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:33%"></i></div><div class="prompt-label">WHAT IS THE GENDER?</div><div class="greek-word">${word.greek}</div>${translation}<div class="word-hint">Choose one answer</div><div class="answer-grid three"><button class="answer-card" onclick="currentGame.checkGender('masculine')"><span>ὁ</span><strong>Masculine</strong></button><button class="answer-card" onclick="currentGame.checkGender('feminine')"><span>η</span><strong>Feminine</strong></button><button class="answer-card" onclick="currentGame.checkGender('neuter')"><span>το</span><strong>Neuter</strong></button></div>${easyHint}</div>`,
      medium:`<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:66%"></i></div><div class="prompt-label">COMPLETE THE ARTICLE</div><div class="word-line">___ <span>${word.greek}</span></div>${translation}<div class="input-row"><input id="genderAnswer" placeholder="Type the article" autofocus><button class="check-action" onclick="currentGame.checkArticle()">Check</button></div><div class="word-hint">ο / η / το</div>${fullHint}</div>`,
      hard:`<div class="exercise-shell"><div class="exercise-top"><span>GENDERS / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:100%"></i></div><div class="prompt-label">BUILD THE PLURAL</div><div class="greek-word small">${word.article} ${word.greek}</div>${translation}<div class="hard-form"><label>Plural word<input id="pluralAnswer" placeholder="Plural"></label><label>Plural article<input id="pluralArticleAnswer" placeholder="Article"></label></div><button class="check-action full" onclick="currentGame.checkPlural()">Check answer</button>${fullHint}</div>`};
    document.getElementById('content').innerHTML=templates[level]||templates.easy; currentLevel=level; answered=false;
    document.querySelectorAll('#content input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#content .check-action')?.click();}));
  }
  return {checkGender,checkArticle,checkPlural,render,word};
}

function startGender(level){
  if(!dictionary||!dictionary.length){document.getElementById('content').innerHTML='<div class="empty-state"><h3>Your dictionary is empty</h3><p>Add words before starting practice.</p></div>';return;}
  currentGame=createGenderGame(dictionary[Math.floor(Math.random()*dictionary.length)]); currentGame.render(level);
}

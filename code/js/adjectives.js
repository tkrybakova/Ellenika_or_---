// ============================================================
// adjectives.js – adjective degrees practice
// Easy: identify the degree
// Medium: complete the adjective ending
// Hard: write Comparative and Superlative forms
// ============================================================

const ADJECTIVES = [
  { positive:'καλός', comparative:'καλύτερος', superlative:'καλύτερος', meaning:'good / well', ending:'-ός' },
  { positive:'μεγάλος', comparative:'μεγαλύτερος', superlative:'μεγαλύτερος', meaning:'big / large', ending:'-ος' },
  { positive:'μικρός', comparative:'μικρότερος', superlative:'μικρότερος', meaning:'small', ending:'-ός' },
  { positive:'γρήγορος', comparative:'γρηγορότερος', superlative:'γρηγορότερος', meaning:'fast', ending:'-ος' },
  { positive:'αργός', comparative:'αργότερος', superlative:'αργότερος', meaning:'slow', ending:'-ός' },
  { positive:'εύκολος', comparative:'ευκολότερος', superlative:'ευκολότερος', meaning:'easy', ending:'-ος' },
  { positive:'δύσκολος', comparative:'δυσκολότερος', superlative:'δυσκολότερος', meaning:'difficult', ending:'-ος' },
  { positive:'ψηλός', comparative:'ψηλότερος', superlative:'ψηλότερος', meaning:'tall / high', ending:'-ός' },
  { positive:'χαμηλός', comparative:'χαμηλότερος', superlative:'χαμηλότερος', meaning:'low', ending:'-ός' },
  { positive:'ωραίος', comparative:'ωραιότερος', superlative:'ωραιότερος', meaning:'beautiful / nice', ending:'-ος' }
];

let adjectiveGame = null;
let adjectiveLevel = 'easy';
let adjectiveTimer = null;
let adjectiveTimeLeft = 60;

function renderAdjectiveLevelButtons() {
  const levels = [
    ['easy','01','EASY','Identify the degree','10 PTS'],
    ['medium','02','MEDIUM','Complete the ending','15 PTS'],
    ['hard','03','HARD','Write Comparative + Superlative','20 PTS']
  ];
  return `<div class="practice-selector f1-selector adjective-selector">
    <div class="selector-head"><div><span class="selector-label">ADJECTIVE MODE</span><p>Choose your training intensity</p></div><span class="selector-lights">● ● ●</span></div>
    <div class="f1-level-list">${levels.map(([level,num,title,desc,pts])=>`<button class="level-tab level-${level}" onclick="startAdjective('${level}')"><span class="level-number">${num}</span><span class="level-main"><b>${title}</b><small>${desc}</small></span><strong>${pts}</strong><i>→</i></button>`).join('')}</div>
  </div>`;
}

// ============================================================
// Adjective degree hint
// ============================================================
function renderAdjectiveHint() {
  return `
    <div class="adj-hint-wrap">
      <button class="adj-hint-button" type="button" onclick="toggleAdjectiveHint()" aria-expanded="false">
        <span>?</span> HINT
      </button>
      <div id="adjective-hint" class="adj-hint-panel" hidden>
        <div class="adj-hint-title">ADJECTIVE DEGREES</div>
        <div class="adj-hint-scroll">
          <section class="adj-hint-section">
            <h4>Comparative Degree — Συγκριτικός Βαθμός</h4>
            <table class="adj-hint-table">
              <thead><tr><th>Positive ending</th><th>Comparative</th><th>Example</th></tr></thead>
              <tbody>
                <tr><td>-ος, -α, -ο</td><td>-ότερος / -ότερη / -ότερο</td><td>ωραίος → ωραιότερος</td></tr>
                <tr><td>-υς + special forms</td><td>-ύτερος / -ύτερη / -ύτερο</td><td>καλός → καλύτερος</td></tr>
                <tr><td>-ες, -ης</td><td>-έστερος / -έστερη / -έστερο</td><td>πλήρης → πληρέστερος</td></tr>
                <tr><td>Any adjective</td><td>πιο + adjective</td><td>πιο καλός</td></tr>
              </tbody>
            </table>
          </section>
          <section class="adj-hint-section">
            <h4>Superlative Degree — Υπερθετικός Βαθμός</h4>
            <table class="adj-hint-table">
              <thead><tr><th>Positive ending</th><th>Superlative</th><th>Example</th></tr></thead>
              <tbody>
                <tr><td>-ος, -α, -ο</td><td>-ότατος / -ότατη / -ότατο</td><td>ωραίος → ωραιότατος</td></tr>
                <tr><td>-υς</td><td>-ύτατος / -ύτατη / -ύτατο</td><td>πλατύς → πλατύτατος</td></tr>
                <tr><td>-ες, -ης</td><td>-έστατος / -έστατη / -έστατο</td><td>πλήρης → πληρέστατος</td></tr>
              </tbody>
            </table>
            <p class="adj-hint-note">The Superlative uses the same formation rules as the Comparative, with the endings shown above.</p>
          </section>
        </div>
      </div>
    </div>
  `;
}

function toggleAdjectiveHint() {
  const panel = document.getElementById('adjective-hint');
  const button = document.querySelector('.adj-hint-button');
  if (!panel || !button) return;
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button.setAttribute('aria-expanded', String(willOpen));
  button.classList.toggle('is-open', willOpen);
}

function adjectiveStyles(){
  if(document.getElementById('adjective-style')) return;
  const s=document.createElement('style');
  s.id='adjective-style';
  s.textContent=`
    .adjective-redesign{max-width:820px!important;margin:0 auto!important}
    .adjective-redesign .exercise-shell{background:#101216;border:1px solid #34373e;border-radius:18px;overflow:visible;box-shadow:0 18px 50px rgba(0,0,0,.28);padding:0}
    .adjective-redesign .exercise-top{display:flex;align-items:center;gap:10px;min-height:58px;padding:14px 18px;background:linear-gradient(90deg,#17191e,#111216);border-bottom:1px solid #2c2f35;color:#858992;font:800 10px var(--mono);letter-spacing:.12em}
    .adjective-redesign .exercise-top span:nth-child(2){margin-left:auto;color:#fff}
    .adjective-redesign .adj-timer{display:flex;gap:6px;margin-left:8px;padding-left:10px;border-left:1px solid #35383f;color:#fff;font:900 14px var(--mono)}
    .adjective-redesign .adj-prompt{margin:34px 24px 8px;color:#e10600;font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
    .adjective-redesign .adj-word{margin:0 24px;color:#fff;font:900 clamp(42px,10vw,76px)/1 Arial;font-style:italic;text-align:center}
    .adjective-redesign .adj-meaning{text-align:center;margin:10px 24px 24px;color:#777c85;font:700 12px var(--mono)}
    .adjective-redesign .adj-options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 18px 18px}
    .adjective-redesign .adj-option{min-height:92px;background:#1a1c21;border:1px solid #363941;border-radius:12px;color:#fff;cursor:pointer;font:900 14px Arial;font-style:italic}
    .adjective-redesign .adj-option:hover{background:#e10600;border-color:#e10600}
    .adjective-redesign .adj-input{display:flex;gap:8px;margin:0 18px 18px}
    .adjective-redesign input{box-sizing:border-box;flex:1;height:52px;background:#191b20;border:1px solid #3a3d45;border-radius:10px;color:#fff;padding:0 14px;font-size:16px}
    .adjective-redesign .check-action{height:52px;border-radius:10px;background:#e10600;border:0;color:#fff;padding:0 22px;font:900 11px var(--mono);text-transform:uppercase;cursor:pointer}
    .adjective-redesign .adj-hard{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 18px 18px}
    .adjective-redesign .adj-hard label{color:#858992;font:800 9px var(--mono);text-transform:uppercase}
    .adjective-redesign .adj-hard input{width:100%;margin-top:6px}
    .adjective-redesign .adj-result{margin:0 18px 10px;padding:12px;border-radius:10px;background:#191b20;color:#fff;font:700 11px var(--mono)}
    .adjective-redesign .next-action{display:block;width:calc(100% - 36px);margin:0 18px 20px;border:0;border-radius:10px;background:#e10600;color:#fff;padding:14px;font:900 11px var(--mono);text-transform:uppercase;cursor:pointer}

    .adjective-redesign .adj-hint-wrap{position:relative;margin:0 18px 18px;z-index:5}
    .adjective-redesign .adj-hint-button{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;border:1px solid #3a3d45;border-radius:8px;background:#191b20;color:#c5c8ce;cursor:pointer;font:900 9px var(--mono);letter-spacing:.08em}
    .adjective-redesign .adj-hint-button span{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#e10600;color:#fff;font:900 12px Arial}
    .adjective-redesign .adj-hint-button:hover,.adjective-redesign .adj-hint-button.is-open{border-color:#e10600;color:#fff}
    .adjective-redesign .adj-hint-panel{margin-top:8px;background:#15171b;border:1px solid #363941;border-radius:12px;box-shadow:0 16px 35px rgba(0,0,0,.35);overflow:hidden}
    .adjective-redesign .adj-hint-title{padding:12px 14px;border-bottom:1px solid #30333a;color:#fff;font:900 10px var(--mono);letter-spacing:.12em}
    .adjective-redesign .adj-hint-scroll{max-height:330px;overflow:auto;padding:10px}
    .adjective-redesign .adj-hint-section{margin-bottom:14px}
    .adjective-redesign .adj-hint-section:last-child{margin-bottom:0}
    .adjective-redesign .adj-hint-section h4{margin:4px 2px 8px;color:#e10600;font:900 11px Arial;font-style:italic}
    .adjective-redesign .adj-hint-table{width:100%;border-collapse:collapse;min-width:570px;color:#d8d9dd;font:700 10px var(--mono)}
    .adjective-redesign .adj-hint-table th{background:#202329;color:#fff;text-align:left;font-weight:900}
    .adjective-redesign .adj-hint-table th,.adjective-redesign .adj-hint-table td{padding:8px;border:1px solid #33363d;vertical-align:top}
    .adjective-redesign .adj-hint-table td:nth-child(2){color:#fff}
    .adjective-redesign .adj-hint-note{margin:8px 2px 2px;color:#858992;font:700 9px/1.5 var(--mono)}
    @media(max-width:650px){
      .adjective-redesign .exercise-top{padding:12px 14px;font-size:8px}
      .adjective-redesign .adj-prompt{margin-top:28px}
      .adjective-redesign .adj-word{font-size:48px}
      .adjective-redesign .adj-options{grid-template-columns:1fr}
      .adjective-redesign .adj-option{min-height:64px}
      .adjective-redesign .adj-input{flex-direction:column}
      .adjective-redesign .check-action{width:100%}
      .adjective-redesign .adj-hard{grid-template-columns:1fr}
      .adjective-redesign .adj-hint-panel{max-width:calc(100vw - 48px)}
      .adjective-redesign .adj-hint-scroll{max-height:300px}
    }
  `;
  document.head.appendChild(s);
}

function startAdjectiveTimer(){
  clearInterval(adjectiveTimer);
  adjectiveTimeLeft=60;
  const update=()=>{const el=document.getElementById('adjective-timer');if(!el)return;el.textContent=`${Math.floor(adjectiveTimeLeft/60)}:${String(adjectiveTimeLeft%60).padStart(2,'0')}`;el.style.color=adjectiveTimeLeft<=15?'#e10600':''};
  update();
  adjectiveTimer=setInterval(()=>{adjectiveTimeLeft--;update();if(adjectiveTimeLeft<=0){clearInterval(adjectiveTimer);if(adjectiveGame&&!adjectiveGame.answered)adjectiveGame.finish(false,"Time's up.")}},1000);
}

function createAdjectiveGame(word,level){
  let answered=false;
  const points=level==='easy'?10:level==='medium'?15:20;
  function finish(correct,message){if(answered)return;answered=true;clearInterval(adjectiveTimer);if(correct&&typeof addScore==='function')addScore(points);const old=document.getElementById('adjective-result');if(old)old.remove();const el=document.createElement('div');el.id='adjective-result';el.className='adj-result';el.textContent=(correct?'✓ ':'! ')+message+(correct?`  +${points} pts`:'');document.getElementById('content').appendChild(el);if(typeof registerPracticeAnswer==='function')registerPracticeAnswer();const next=document.createElement('button');next.className='next-action';next.textContent='Next adjective →';next.onclick=()=>startAdjective(level);document.getElementById('content').appendChild(next)}
  function checkDegree(answer){const degree=answer===word.positive?'Positive Degree':answer===word.comparative?'Comparative Degree':'Superlative Degree';finish(answer===word.positive||answer===word.comparative||answer===word.superlative,answer===word.positive||answer===word.comparative||answer===word.superlative?`Correct: ${degree}.`:`Correct degree: Positive / Comparative / Superlative.`)}
  function checkEnding(){const input=document.getElementById('adjective-ending');finish(input&&input.value.trim().toLowerCase()===word.ending.toLowerCase(),`Correct ending: ${word.ending}.`)}
  function checkForms(){const c=document.getElementById('adjective-comparative').value.trim().toLowerCase();const s=document.getElementById('adjective-superlative').value.trim().toLowerCase();finish(c===word.comparative.toLowerCase()&&s===word.superlative.toLowerCase(),`Correct forms: ${word.comparative} / ${word.superlative}.`)}
  function render(){adjectiveStyles();const timer=`<div class="adj-timer"><span>TIME</span><strong id="adjective-timer">1:00</strong></div>`;let html='';if(level==='easy'){const options=[word.positive,word.comparative,word.superlative].sort(()=>Math.random()-.5);html=`<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / EASY</span><span>01 / 03</span>${timer}</div><div class="progress-track"><i style="width:33%"></i></div><div class="adj-prompt">IDENTIFY THE DEGREE</div><div class="adj-word">${options[0]}</div><div class="adj-meaning">${word.meaning}</div><div class="adj-options">${[['Positive Degree',word.positive],['Comparative Degree',word.comparative],['Superlative Degree',word.superlative]].map(([label,val])=>`<button class="adj-option" onclick="adjectiveGame.checkDegree('${val}')">${label}</button>`).join('')}</div>${renderAdjectiveHint()}</div></div>`}else if(level==='medium'){const stem=word.positive.slice(0,-word.ending.length);html=`<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / MEDIUM</span><span>02 / 03</span>${timer}</div><div class="progress-track"><i style="width:66%"></i></div><div class="adj-prompt">WRITE THE ENDING</div><div class="adj-word">${stem}___</div><div class="adj-meaning">${word.meaning} · Complete the adjective</div><div class="adj-input"><input id="adjective-ending" placeholder="Ending"><button class="check-action" onclick="adjectiveGame.checkEnding()">CHECK</button></div>${renderAdjectiveHint()}</div></div>`}else{html=`<div class="adjective-redesign"><div class="exercise-shell"><div class="exercise-top"><span>ADJECTIVES / HARD</span><span>03 / 03</span>${timer}</div><div class="progress-track"><i style="width:100%"></i></div><div class="adj-prompt">WRITE BOTH DEGREES</div><div class="adj-word">${word.positive}</div><div class="adj-meaning">${word.meaning}</div><div class="adj-hard"><label>Comparative Degree<input id="adjective-comparative" placeholder="Comparative"></label><label>Superlative Degree<input id="adjective-superlative" placeholder="Superlative"></label></div><button class="check-action" style="width:calc(100% - 36px);margin:0 18px 18px" onclick="adjectiveGame.checkForms()">CHECK ANSWER</button>${renderAdjectiveHint()}</div></div>`}document.getElementById('content').innerHTML=html;startAdjectiveTimer();document.querySelectorAll('#content input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#content .check-action')?.click()}))}
  return {render,checkDegree,checkEnding,checkForms,finish,answered:false};
}

function startAdjective(level){
  clearInterval(adjectiveTimer);
  adjectiveLevel=level;
  const word=ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)];
  adjectiveGame=createAdjectiveGame(word,level);
  adjectiveGame.render();
}

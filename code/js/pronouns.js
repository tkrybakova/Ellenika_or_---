// ============================================================
// pronouns.js – Greek pronouns practice
// Same exercise architecture as GENDERS / ADJECTIVES.
// EASY = choose translation
// MEDIUM = complete one form
// HARD = complete the paradigm
// ============================================================

const PRONOUN_SECTIONS = [
  {id:'personal',title:'THE PERSONAL PRONOUNS',greek:'Προσωπικές Αντωνυμίες',easy:[['εγώ','I'],['εσύ','you (singular)'],['αυτός','he'],['αυτή','she'],['αυτό','it'],['εμείς','we'],['εσείς','you (plural)'],['αυτοί','they (masculine)'],['αυτές','they (feminine)'],['αυτά','they (neuter)']],hardGroups:[
    {base:'εγώ',rows:[['Nominative','εγώ'],['Possessive','εμένα (μου)'],['Accusative','εμένα (με)'],['Vocative','—']]},
    {base:'εσύ',rows:[['Nominative','εσύ'],['Possessive','εσένα (σου)'],['Accusative','εσένα (σε)'],['Vocative','εσύ']]},
    {base:'εμείς',rows:[['Nominative','εμείς'],['Possessive','εμάς (μας)'],['Accusative','εμάς (μας)'],['Vocative','—']]},
    {base:'εσείς',rows:[['Nominative','εσείς'],['Possessive','εσάς (σας)'],['Accusative','εσάς (σας)'],['Vocative','εσείς']]},
    {base:'αυτός',rows:[['Nominative','αυτός'],['Possessive','αυτού (του)'],['Accusative','αυτόν (τον)'],['Vocative','—']]},
    {base:'αυτή',rows:[['Nominative','αυτή'],['Possessive','αυτής (της)'],['Accusative','αυτή(ν) (τη/την)'],['Vocative','—']]},
    {base:'αυτό',rows:[['Nominative','αυτό'],['Possessive','αυτού (του)'],['Accusative','αυτό (το)'],['Vocative','—']]},
    {base:'αυτοί',rows:[['Nominative','αυτοί'],['Possessive','αυτών (τους)'],['Accusative','αυτούς (τους)'],['Vocative','—']]},
    {base:'αυτές',rows:[['Nominative','αυτές'],['Possessive','αυτών (τους)'],['Accusative','αυτές (τις)'],['Vocative','—']]},
    {base:'αυτά',rows:[['Nominative','αυτά'],['Possessive','αυτών (τους)'],['Accusative','αυτά (τα)'],['Vocative','—']]}
  ]},
  {id:'possessive',title:'THE POSSESSIVE PRONOUNS',greek:'Κτητικές Αντωνυμίες',easy:[['μου','my / mine'],['σου','your / yours'],['του','his / its'],['της','her / hers'],['μας','our / ours'],['σας','your / yours'],['τους','their / theirs']],cases:['Masculine','Feminine','Neuter'],table:[['μου','μου','μου'],['σου','σου','σου'],['του','του','του'],['της','της','της'],['μας','μας','μας'],['σας','σας','σας'],['τους','τους','τους']]},
  {id:'demonstrative',title:'THE DEMONSTRATIVE PRONOUNS',greek:'Δεικτικές Αντωνυμίες',easy:[['αυτός','this / he'],['αυτή','this / she'],['αυτό','this / it'],['εκείνος','that / he'],['εκείνη','that / she'],['εκείνο','that / it']],cases:['Masculine','Feminine','Neuter'],table:[['αυτός','αυτή','αυτό'],['εκείνος','εκείνη','εκείνο']]},
  {id:'definite',title:'THE DEFINITE PRONOUNS',greek:'Οριστικές Αντωνυμίες',easy:[['ο ίδιος','the same / himself'],['η ίδια','the same / herself'],['το ίδιο','the same / itself'],['μόνος','alone / himself'],['μόνη','alone / herself'],['μόνο','alone / itself']],cases:['Masculine','Feminine','Neuter'],table:[['ο ίδιος','η ίδια','το ίδιο'],['μόνος','μόνη','μόνο']]},
  {id:'relative',title:'THE RELATIVE PRONOUNS',greek:'Αναφορικές Αντωνυμίες',easy:[['ο οποίος','who / which (masc.)'],['η οποία','who / which (fem.)'],['το οποίο','which (neut.)'],['που','who / which / that']],cases:['Masculine','Feminine','Neuter'],table:[['ο οποίος','η οποία','το οποίο'],['του οποίου','της οποίας','του οποίου'],['τον οποίο','την οποία','το οποίο']]},
  {id:'interrogative',title:'THE INTERROGATIVE PRONOUNS',greek:'Ερωτηματικές Αντωνυμίες',easy:[['ποιος','who / which (masc.)'],['ποια','who / which (fem.)'],['ποιο','who / which (neut.)'],['τι','what']],cases:['Masculine','Feminine','Neuter'],table:[['ποιος','ποια','ποιο'],['ποιου','ποιας','ποιου'],['ποιον','ποια','ποιο']]},
  {id:'indefinite',title:'THE INDEFINITE PRONOUNS',greek:'Αόριστες Αντωνυμίες',easy:[['κάποιος','someone / somebody'],['κάποια','someone / some'],['κάποιο','something / some'],['κανένας','no one / nobody'],['κανένα','nothing / none']],cases:['Masculine','Feminine','Neuter'],table:[['κάποιος','κάποια','κάποιο'],['κάποιου','κάποιας','κάποιου'],['κάποιον','κάποια','κάποιο']]},
  {id:'reflexive',title:'THE REFLEXIVE PRONOUNS',greek:'Αυτοπαθείς Αντωνυμίες',easy:[['ο εαυτός μου','myself'],['ο εαυτός σου','yourself'],['ο εαυτός του','himself / itself'],['ο εαυτός της','herself']],cases:['Masculine','Feminine','Neuter'],table:[['ο εαυτός μου','η εαυτή μου','το εαυτό μου'],['του εαυτού μου','της εαυτής μου','του εαυτού μου'],['τον εαυτό μου','τον εαυτό μου','το εαυτό μου']]}
];

let currentPronounGame=null,pronounSection=null,currentPronounLevel='easy',pronounTimer=null,pronounTimeLeft=60;

function normalizePronoun(v){return String(v??'').trim().toLowerCase().replace(/[·.,;!?]/g,'').replace(/\s+/g,' ')}
function escapePronoun(v){return String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}

function startPronounTimer(){
  clearInterval(pronounTimer);pronounTimeLeft=60;
  const update=()=>{const t=document.getElementById('pronoun-timer');if(!t)return;t.textContent=`${Math.floor(pronounTimeLeft/60)}:${String(pronounTimeLeft%60).padStart(2,'0')}`;t.classList.toggle('warning',pronounTimeLeft<=15)};
  update();pronounTimer=setInterval(()=>{pronounTimeLeft--;update();if(pronounTimeLeft<=0){clearInterval(pronounTimer);if(currentPronounGame&&!currentPronounGame.isAnswered())currentPronounGame.timeUp()}},1000)
}

function pronounStyles(){
  if(document.getElementById('pronoun-redesign-style'))return;
  const s=document.createElement('style');s.id='pronoun-redesign-style';s.textContent=`
.pronoun-redesign{max-width:820px!important;margin:0 auto!important}.pronoun-redesign .exercise-shell{background:#101216!important;border:1px solid #34373e!important;border-radius:18px!important;padding:0!important;overflow:hidden!important;box-shadow:0 18px 50px rgba(0,0,0,.28)!important}.pronoun-redesign .exercise-top{display:flex!important;align-items:center!important;gap:10px!important;min-height:58px!important;padding:14px 18px!important;background:linear-gradient(90deg,#17191e,#111216)!important;border-bottom:1px solid #2c2f35!important;color:#858992!important;font:800 10px var(--mono)!important;letter-spacing:.12em!important}.pronoun-redesign .exercise-top>span:nth-child(2){margin-left:auto!important;color:#fff!important}.pronoun-redesign .pronoun-timer-wrap{display:flex!important;align-items:center!important;gap:6px!important;margin-left:8px!important;padding-left:10px!important;border-left:1px solid #35383f!important}.pronoun-redesign .pronoun-timer-label{color:#e10600!important;font-size:8px!important}.pronoun-redesign .pronoun-timer{color:#fff!important;font:900 14px var(--mono)!important}.pronoun-redesign .pronoun-timer.warning{color:#e10600!important}.pronoun-redesign .progress-track{height:4px!important;margin:0!important;background:#292c31!important}.pronoun-redesign .progress-track i{display:block!important;height:100%!important;background:#e10600!important}.pronoun-redesign .prompt-label{margin:34px 24px 8px!important;color:#e10600!important;font:800 10px var(--mono)!important;letter-spacing:.18em!important;text-transform:uppercase!important}.pronoun-redesign .pronoun-word{margin:0 24px!important;color:#fff!important;font:900 clamp(42px,10vw,76px)/1 Arial!important;font-style:italic!important;letter-spacing:-.04em!important;text-align:center!important}.pronoun-redesign .word-translation{margin:10px 24px 24px!important;color:#777c85!important;text-align:center!important;font:700 12px var(--mono)!important}.pronoun-redesign .answer-grid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:8px!important;margin:0 18px 18px!important}.pronoun-redesign .answer-card{min-height:108px!important;padding:14px 8px!important;background:#1a1c21!important;border:1px solid #363941!important;border-radius:12px!important;color:#fff!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:5px!important;font:900 16px Arial!important;cursor:pointer!important}.pronoun-redesign .answer-card:hover{background:#e10600!important;border-color:#e10600!important;transform:translateY(-2px)!important}.pronoun-redesign .answer-card.correct{background:#176b3a!important;border-color:#35c477!important}.pronoun-redesign .answer-card.wrong{background:#7d1818!important;border-color:#e10600!important}.pronoun-redesign .answer-card.reveal{background:#176b3a!important;border-color:#35c477!important}.pronoun-redesign .input-row{display:flex!important;gap:8px!important;margin:0 18px 18px!important}.pronoun-redesign input{box-sizing:border-box!important;min-width:0!important;height:52px!important;background:#191b20!important;border:1px solid #3a3d45!important;border-radius:10px!important;color:#fff!important;padding:0 14px!important;font-size:16px!important}.pronoun-redesign .input-row input{flex:1!important}.pronoun-redesign .check-action{height:52px!important;border-radius:10px!important;background:#e10600!important;border:0!important;color:#fff!important;padding:0 22px!important;font:900 11px var(--mono)!important;text-transform:uppercase!important;cursor:pointer!important}.pronoun-redesign .check-action.full{width:calc(100% - 36px)!important;margin:0 18px 10px!important}.pronoun-redesign .hard-form{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:0 18px 8px!important}.pronoun-redesign .hard-form label{color:#858992!important;font:800 9px var(--mono)!important;text-transform:uppercase!important}.pronoun-redesign .hard-form input{width:100%!important;margin-top:6px!important}.pronoun-redesign .pronoun-result{display:block!important;margin:0 18px 10px!important;padding:12px!important;border-radius:10px!important;background:#191b20!important;color:#fff!important;font:800 11px var(--mono)!important;line-height:1.5!important}.pronoun-redesign .pronoun-result.correct{background:#143c29!important;color:#72e0a5!important;border:1px solid #246c49!important}.pronoun-redesign .pronoun-result.wrong{background:#431919!important;color:#ff8585!important;border:1px solid #7d2929!important}.pronoun-redesign .next-action{display:block!important;width:calc(100% - 36px)!important;margin:0 18px 20px!important;border:0!important;border-radius:10px!important;background:#e10600!important;color:#fff!important;padding:14px!important;font:900 11px var(--mono)!important;text-transform:uppercase!important;cursor:pointer!important}.pronoun-redesign .pronoun-hint{margin:0 18px 20px!important;padding:14px!important;background:#15171b!important;border:1px solid #35383f!important;border-radius:12px!important;color:#ddd!important;overflow-x:auto!important}.pronoun-redesign .pronoun-hint table{width:100%!important;min-width:460px!important;border-collapse:collapse!important;font-size:11px!important}.pronoun-redesign .pronoun-hint th{background:#202329!important;color:#e10600!important}.pronoun-redesign .pronoun-hint th,.pronoun-redesign .pronoun-hint td{border:1px solid #30333a!important;padding:8px!important;text-align:left!important}.pronoun-redesign .hint-button{width:44px!important;height:44px!important;margin:0 18px 10px!important;border-radius:50%!important;background:#1b1d22!important;border:1px solid #464951!important;color:#fff!important;font:900 18px Arial!important;cursor:pointer!important}.pronoun-redesign .hint-button:hover{background:#e10600!important;border-color:#e10600!important}
@media(max-width:650px){.pronoun-redesign{width:100%!important}.pronoun-redesign .exercise-top{padding:12px 14px!important;font-size:8px!important}.pronoun-redesign .pronoun-word{font-size:48px!important}.pronoun-redesign .answer-grid{grid-template-columns:1fr!important}.pronoun-redesign .answer-card{min-height:72px!important;flex-direction:row!important;justify-content:flex-start!important;padding-left:22px!important}.pronoun-redesign .input-row{flex-direction:column!important}.pronoun-redesign .check-action{width:100%!important}.pronoun-redesign .hard-form{grid-template-columns:1fr!important}}
`;document.head.appendChild(s)
}

function openPronouns(){renderPage('PRONOUNS',renderPronounSections(),'practice-page')}
function renderPronounSections(){return `<div class="pronouns-page"><div class="pronouns-header"><span class="selector-label">ELLENIKA / PRONOUNS</span><h1>PRONOUNS</h1><p>Eight grammar sections · three training modes</p></div><div class="pronoun-section-list">${PRONOUN_SECTIONS.map((x,i)=>`<button class="pronoun-section-row" onclick="openPronounSection('${x.id}')"><span class="pronoun-number">${String(i+1).padStart(2,'0')}</span><span class="pronoun-section-main"><b>${x.title}</b><small>${x.greek}</small></span><span class="pronoun-section-modes">EASY · MEDIUM · HARD</span><i>→</i></button>`).join('')}</div></div>`}
function openPronounSection(id){pronounSection=PRONOUN_SECTIONS.find(x=>x.id===id);if(!pronounSection)return;renderPage('PRONOUNS',renderPronounModes(),'practice-page')}
function renderPronounModes(){return `<div class="pronouns-page pronoun-level-page"><div class="pronouns-header"><span class="selector-label">PRONOUNS / ${pronounSection.title}</span><h1>${pronounSection.title}</h1><p>${pronounSection.greek}</p></div>${typeof renderLevelButtons==='function'?renderLevelButtons(['easy','medium','hard'],'startPronoun'):renderFallbackLevelButtons()}</div>`}
function renderFallbackLevelButtons(){return `<div class="practice-selector"><button onclick="startPronoun('easy')">EASY</button><button onclick="startPronoun('medium')">MEDIUM</button><button onclick="startPronoun('hard')">HARD</button></div>`}

function startPronoun(level){
  clearInterval(pronounTimer);if(!pronounSection)return;
  currentPronounLevel=level;currentPronounGame=createPronounGame(pronounSection,level);currentPronounGame.render();
}

function createPronounGame(section,level){
  let answered=false;
  const easyQ=section.easy[Math.floor(Math.random()*section.easy.length)];
  const table=section.table||[];
  const hardQ=section.hardGroups?section.hardGroups[Math.floor(Math.random()*section.hardGroups.length)]:null;
  let mediumRow=null,mediumIndex=0;
  if(table.length){mediumRow=table[Math.floor(Math.random()*table.length)];mediumIndex=Math.floor(Math.random()*mediumRow.length)}

  function points(){return level==='easy'?10:level==='medium'?15:20}
  function finish(correct,message){
    if(answered)return;answered=true;clearInterval(pronounTimer);
    const result=document.getElementById('pronoun-result');
    if(result){result.className='pronoun-result '+(correct?'correct':'wrong');result.textContent=(correct?'✓ CORRECT':'✕ WRONG')+' · '+message+(correct?` · +${points()} PTS`:'')}
    if(correct){if(typeof addScore==='function')addScore(points());if(typeof registerPracticeAnswer==='function')registerPracticeAnswer();if(typeof showF1BroadcastMessage==='function')showF1BroadcastMessage()}
    document.querySelectorAll('.pronoun-answer,.pronoun-redesign input,.pronoun-redesign .check-action').forEach(x=>{if(x.tagName==='INPUT'||x.tagName==='BUTTON')x.disabled=true});
  }
  function timeUp(){if(answered)return;finish(false,'TIME UP · Correct answer: '+correctText())}
  function correctText(){if(level==='easy')return easyQ[1];if(level==='medium')return mediumRow[mediumIndex];return hardQ?hardQ.rows.map(r=>r[1]).join(' · '):'See the grammar table'}
  function checkEasy(btn,answer){const ok=normalizePronoun(answer)===normalizePronoun(easyQ[1]);document.querySelectorAll('.pronoun-answer').forEach(x=>x.disabled=true);btn.classList.add(ok?'correct':'wrong');if(!ok)document.querySelectorAll('.pronoun-answer').forEach(x=>{if(normalizePronoun(x.dataset.answer)===normalizePronoun(easyQ[1]))x.classList.add('reveal')});finish(ok,ok?'Translation accepted':`Correct answer: ${easyQ[1]}`)}
  function checkMedium(){const input=document.getElementById('pronoun-medium-input');const value=normalizePronoun(input?.value);if(!value){finish(false,'Enter an answer');return}const expected=normalizePronoun(mediumRow[mediumIndex]);const ok=value===expected;finish(ok,ok?'Form accepted':`Correct answer: ${mediumRow[mediumIndex]}`)}
  function checkHard(){const q=hardQ;const cells=q?q.rows.map((_,i)=>document.getElementById(`pronoun-hard-${i}`)):[];const values=cells.map(x=>normalizePronoun(x?.value));const expected=q?q.rows.map(r=>normalizePronoun(r[1])):[];const ok=q&&values.every((v,i)=>v===expected[i]||(expected[i]==='—'&&v===''));finish(ok,ok?'Complete paradigm accepted':`Correct forms: ${q.rows.map(r=>r[1]).join(' · ')}`)}
  function render(){
    pronounStyles();
    let body='';
    if(level==='easy'){
      const options=shuffle([easyQ[1],...shuffle(section.easy.filter(x=>x[1]!==easyQ[1])).slice(0,2).map(x=>x[1])]);
      body=`<div class="prompt-label">TRANSLATE</div><div class="pronoun-word">${easyQ[0]}</div><div class="word-translation">Choose the correct meaning</div><div class="answer-grid">${options.map(o=>`<button class="answer-card pronoun-answer" data-answer="${escapePronoun(o)}" onclick="currentPronounGame.checkEasy(this,'${escapePronoun(o)}')">${o}</button>`).join('')}</div>`
    }else if(level==='medium'){
      body=`<div class="prompt-label">COMPLETE THE FORM</div><div class="pronoun-word">${mediumRow.slice(0,mediumIndex).concat(['___']).concat(mediumRow.slice(mediumIndex+1)).join(' · ')}</div><div class="word-translation">${section.cases[mediumIndex]||'Form'}</div><div class="input-row"><input id="pronoun-medium-input" autocomplete="off" spellcheck="false" placeholder="Type the correct form"><button class="check-action" onclick="currentPronounGame.checkMedium()">CHECK</button></div>`
    }else{
      if(hardQ)body=`<div class="prompt-label">COMPLETE THE DECLENSION</div><div class="pronoun-word">${hardQ.base}</div><div class="hard-form">${hardQ.rows.map((r,i)=>`<label>${r[0]}<input id="pronoun-hard-${i}" autocomplete="off" spellcheck="false"></label>`).join('')}</div><button class="check-action full" onclick="currentPronounGame.checkHard()">CHECK ANSWER</button>`;
      else body=`<div class="prompt-label">COMPLETE THE PARADIGM</div><div class="pronoun-word">${easyQ[0]}</div><div class="hard-form">${section.cases.map((c,i)=>`<label>${c}<input id="pronoun-hard-${i}" autocomplete="off" spellcheck="false"></label>`).join('')}</div><button class="check-action full" onclick="currentPronounGame.checkHard()">CHECK ANSWER</button>`;
    }
    const n=level==='easy'?'01 / 03':level==='medium'?'02 / 03':'03 / 03';
    document.getElementById('content').innerHTML=`<div class="pronoun-redesign"><div class="exercise-shell"><div class="exercise-top"><span>PRONOUNS / ${level.toUpperCase()}</span><span>${n}</span><div class="pronoun-timer-wrap"><span class="pronoun-timer-label">TIME</span><span id="pronoun-timer" class="pronoun-timer">1:00</span></div></div><div class="progress-track"><i style="width:${level==='easy'?33:level==='medium'?66:100}%"></i></div>${body}<div id="pronoun-result" class="pronoun-result"></div><button class="next-action" onclick="startPronoun('${level}')">NEXT →</button></div></div>`;
    document.querySelectorAll('#content input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#content .check-action')?.click()}));
    startPronounTimer()
  }
  return {render,checkEasy,checkMedium,checkHard,timeUp,isAnswered:()=>answered}
}

pronounStyles();

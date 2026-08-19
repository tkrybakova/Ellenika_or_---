// ============================================================
// pronouns.js – Greek pronouns practice
// EASY = choose translation; HARD = complete the declension.
// ============================================================

const L20 = 'https://www.ilearngreek.com/lessons/sounds/L20/';

const PRONOUN_SECTIONS = [
  {
    id:'personal', title:'THE PERSONAL PRONOUNS', greek:'Προσωπικές Αντωνυμίες',
    easy:[['εγώ','I'],['εσύ','you (singular)'],['αυτός','he'],['αυτή','she'],['αυτό','it'],['εμείς','we'],['εσείς','you (plural)'],['αυτοί','they (masculine)'],['αυτές','they (feminine)'],['αυτά','they (neuter)']],
    hardGroups:[
      {title:'First Person — Singular', base:'εγώ', rows:[['Nominative','εγώ'],['Possessive','εμένα (μου)'],['Accusative','εμένα (με)'],['Vocative','—']]},
      {title:'Second Person — Singular', base:'εσύ', rows:[['Nominative','εσύ'],['Possessive','εσένα (σου)'],['Accusative','εσένα (σε)'],['Vocative','εσύ']]},
      {title:'First Person — Plural', base:'εμείς', rows:[['Nominative','εμείς'],['Possessive','εμάς (μας)'],['Accusative','εμάς (μας)'],['Vocative','—']]},
      {title:'Second Person — Plural', base:'εσείς', rows:[['Nominative','εσείς'],['Possessive','εσάς (σας)'],['Accusative','εσάς (σας)'],['Vocative','εσείς']]},
      {title:'Third Person — Singular Masculine', base:'αυτός', rows:[['Nominative','αυτός'],['Possessive','αυτού (του)'],['Accusative','αυτόν (τον)'],['Vocative','—']]},
      {title:'Third Person — Singular Feminine', base:'αυτή', rows:[['Nominative','αυτή'],['Possessive','αυτής (της)'],['Accusative','αυτή(ν) (τη/την)'],['Vocative','—']]},
      {title:'Third Person — Singular Neuter', base:'αυτό', rows:[['Nominative','αυτό'],['Possessive','αυτού (του)'],['Accusative','αυτό (το)'],['Vocative','—']]},
      {title:'Third Person — Plural Masculine', base:'αυτοί', rows:[['Nominative','αυτοί'],['Possessive','αυτών (τους)'],['Accusative','αυτούς (τους)'],['Vocative','—']]},
      {title:'Third Person — Plural Feminine', base:'αυτές', rows:[['Nominative','αυτές'],['Possessive','αυτών (τους)'],['Accusative','αυτές (τις)'],['Vocative','—']]},
      {title:'Third Person — Plural Neuter', base:'αυτά', rows:[['Nominative','αυτά'],['Possessive','αυτών (τους)'],['Accusative','αυτά (τα)'],['Vocative','—']]}
    ],
    hintEasy: personalEasyHint(),
    hintHard: personalHardHint()
  },
  {id:'possessive',title:'THE POSSESSIVE PRONOUNS',greek:'Κτητικές Αντωνυμίες',easy:[['μου','my / mine'],['σου','your / yours'],['του','his / its'],['της','her / hers'],['μας','our / ours'],['σας','your / yours'],['τους','their / theirs']],cases:['Masculine','Feminine','Neuter'],table:[['μου','μου','μου'],['σου','σου','σου'],['του','του','του'],['της','της','της'],['μας','μας','μας'],['σας','σας','σας'],['τους','τους','τους']],note:'Possessive forms agree with the thing possessed when used with articles: ο δικός μου, η δική μου, το δικό μου.'},
  {id:'demonstrative',title:'THE DEMONSTRATIVE PRONOUNS',greek:'Δεικτικές Αντωνυμίες',easy:[['αυτός','this / he'],['αυτή','this / she'],['αυτό','this / it'],['εκείνος','that / he'],['εκείνη','that / she'],['εκείνο','that / it']],cases:['Masculine','Feminine','Neuter'],table:[['αυτός','αυτή','αυτό'],['εκείνος','εκείνη','εκείνο']],note:'The demonstrative pronoun changes for gender, number and case.'},
  {id:'definite',title:'THE DEFINITE PRONOUNS',greek:'Οριστικές Αντωνυμίες',easy:[['ο ίδιος','the same / himself'],['η ίδια','the same / herself'],['το ίδιο','the same / itself'],['μόνος','alone / himself'],['μόνη','alone / herself'],['μόνο','alone / itself']],cases:['Masculine','Feminine','Neuter'],table:[['ο ίδιος','η ίδια','το ίδιο'],['ο ίδιος','η ίδια','το ίδιο']],note:'Forms such as ίδιος agree with the noun in gender, number and case.'},
  {id:'relative',title:'THE RELATIVE PRONOUNS',greek:'Αναφορικές Αντωνυμίες',easy:[['ο οποίος','who / which (masc.)'],['η οποία','who / which (fem.)'],['το οποίο','which (neut.)'],['που','who / which / that']],cases:['Masculine','Feminine','Neuter'],table:[['ο οποίος','η οποία','το οποίο'],['του οποίου','της οποίας','του οποίου'],['τον οποίο','την οποία','το οποίο'],['—','—','—']],note:'ο οποίος / η οποία / το οποίο agree with the noun they refer to. The invariant που does not decline.'},
  {id:'interrogative',title:'THE INTERROGATIVE PRONOUNS',greek:'Ερωτηματικές Αντωνυμίες',easy:[['ποιος','who / which (masc.)'],['ποια','who / which (fem.)'],['ποιο','who / which (neut.)'],['τι','what']],cases:['Masculine','Feminine','Neuter'],table:[['ποιος','ποια','ποιο'],['ποιου','ποιας','ποιου'],['ποιον','ποια','ποιο'],['—','—','—']],note:'ποιος, ποια, ποιο change according to gender and case. τι is indeclinable.'},
  {id:'indefinite',title:'THE INDEFINITE PRONOUNS',greek:'Αόριστες Αντωνυμίες',easy:[['κάποιος','someone / somebody'],['κάποια','someone / some'],['κάποιο','something / some'],['κανένας','no one / nobody'],['κανένα','nothing / none']],cases:['Masculine','Feminine','Neuter'],table:[['κάποιος','κάποια','κάποιο'],['κάποιου','κάποιας','κάποιου'],['κάποιον','κάποια','κάποιο'],['—','—','—']],note:'Common indefinite forms such as κάποιος decline by gender and case.'},
  {id:'reflexive',title:'THE REFLEXIVE PRONOUNS',greek:'Αυτοπαθείς Αντωνυμίες',easy:[['ο εαυτός μου','myself'],['ο εαυτός σου','yourself'],['ο εαυτός του','himself / itself'],['ο εαυτός της','herself']],cases:['Masculine','Feminine','Neuter'],table:[['ο εαυτός μου','η εαυτή μου','το εαυτό μου'],['του εαυτού μου','της εαυτής μου','του εαυτού μου'],['τον εαυτό μου','τον εαυτό μου','το εαυτό μου'],['—','—','—']],note:'Reflexive forms show that the action returns to the person who acted.'}
];

function audioWord(text,url){
  return `<button type="button" class="pronoun-audio" onclick="playPronounAudio('${url}')">${text} 🔊</button>`;
}

function playPronounAudio(url){
  try { const a=new Audio(url); a.play().catch(()=>{}); } catch(e) {}
}

function personalEasyHint(){
  return `<div class="pronoun-hint-table"><table><thead><tr><th>Ενικός Αριθμός<br>Singular</th><th>Πληθυντικός Αριθμός<br>Plural</th></tr></thead><tbody>
  <tr><td>${audioWord('Εγώ',L20+'ego.mp3')} — I (First Person)</td><td>${audioWord('Εμείς',L20+'emis.mp3')} — We (First Person)</td></tr>
  <tr><td>${audioWord('Εσύ',L20+'esi.mp3')} — You (Second Person)</td><td>${audioWord('Εσείς',L20+'esis.mp3')} — You (Second Person)</td></tr>
  <tr><td>${audioWord('Αυτός',L20+'aftos.mp3')}, ${audioWord('αυτή',L20+'afti.mp3')}, ${audioWord('αυτό',L20+'afto.mp3')} — he, she, it</td><td>${audioWord('Αυτοί',L20+'afti.mp3')}, ${audioWord('αυτές',L20+'aftes.mp3')}, ${audioWord('αυτά',L20+'afta.mp3')} — They (Third Person)</td></tr>
  </tbody></table></div>`;
}

function personalHardHint(){
  const groups=[
    ['First Person','εγώ','εμένα (μου)','εμένα (με)','—'],
    ['Second Person','εσύ','εσένα (σου)','εσένα (σε)','εσύ'],
    ['Third Person — masculine','αυτός','αυτού (του)','αυτόν (τον)','—'],
    ['Third Person — feminine','αυτή','αυτής (της)','αυτή(ν) (τη/την)','—'],
    ['Third Person — neuter','αυτό','αυτού (του)','αυτό (το)','—']
  ];
  return `<div class="pronoun-hint-table hard-hint"><h4>Personal Pronouns — Cases</h4><table><thead><tr><th>Person</th><th>Nominative</th><th>Possessive</th><th>Accusative</th><th>Vocative</th></tr></thead><tbody>${groups.map(g=>`<tr><th>${g[0]}</th><td>${g[1]}</td><td>${g[2]}</td><td>${g[3]}</td><td>${g[4]}</td></tr>`).join('')}</tbody></table><p class="hint-note">Plural forms are also included in the exercise; use the case labels shown there.</p></div>`;
}

let pronounSection=null;
let pronounLevel='easy';
let pronounQuestion=null;
let pronounHardQuestion=null;
let pronounAnswered=false;

function openPronouns(){renderPage('PRONOUNS',renderPronounSections(),'practice-page');}

function renderPronounSections(){
  return `<div class="pronouns-page"><div class="pronouns-header"><span class="selector-label">ELLENIKA / PRONOUNS</span><h1>PRONOUNS</h1><p>Eight grammar sections · two training modes</p></div><div class="pronoun-section-list">${PRONOUN_SECTIONS.map((s,i)=>`<button class="pronoun-section-row" onclick="openPronounSection('${s.id}')"><span class="pronoun-number">${String(i+1).padStart(2,'0')}</span><span class="pronoun-section-main"><b>${s.title}</b><small>${s.greek}</small></span><span class="pronoun-section-modes">EASY · HARD</span><i>→</i></button>`).join('')}</div></div>`;
}

function openPronounSection(id){
  pronounSection=PRONOUN_SECTIONS.find(s=>s.id===id);
  if(!pronounSection)return;
  renderPage('PRONOUNS',renderPronounModes(),'practice-page');
}

function renderPronounModes(){
  const s=pronounSection;
  return `<div class="pronouns-page pronoun-level-page"><div class="pronouns-header"><span class="selector-label">PRONOUNS / ${s.title}</span><h1>${s.title}</h1><p>${s.greek}</p></div>${renderLevelButtons(['easy','hard'],'startPronoun')}</div>`;
}

function startPronoun(level){
  if(!pronounSection)return;
  pronounLevel=level;
  pronounAnswered=false;
  pronounQuestion=pronounSection.easy[Math.floor(Math.random()*pronounSection.easy.length)];
  if(level==='hard' && pronounSection.hardGroups){
    pronounHardQuestion=pronounSection.hardGroups[Math.floor(Math.random()*pronounSection.hardGroups.length)];
  } else {
    pronounHardQuestion=null;
  }
  renderPage('PRONOUNS',renderPronounExercise(),'practice-page');
}

function pronounHintButton(type){
  const html=type==='easy'?pronounSection.hintEasy:pronounSection.hintHard;
  if(!html)return '';
  return `<button class="pronoun-hint-btn" onclick="openPronounHint('${type}')" aria-label="Open hint">?</button>`;
}

function openPronounHint(type){
  const html=type==='easy'?pronounSection.hintEasy:pronounSection.hintHard;
  if(!html)return;
  const old=document.getElementById('pronoun-hint-overlay');
  if(old)old.remove();
  const el=document.createElement('div');
  el.id='pronoun-hint-overlay';
  el.className='pronoun-hint-overlay';
  el.innerHTML=`<div class="pronoun-hint-modal"><button class="pronoun-hint-close" onclick="document.getElementById('pronoun-hint-overlay').remove()">×</button><div class="pronoun-hint-title">HINT · ${type.toUpperCase()}</div>${html}</div>`;
  document.body.appendChild(el);
}

function renderPronounExercise(){
  const s=pronounSection;
  if(pronounLevel==='easy'){
    const wrong=s.easy.filter(x=>x[1]!==pronounQuestion[1]).sort(()=>Math.random()-.5).slice(0,2).map(x=>x[1]);
    const options=[pronounQuestion[1],...wrong].sort(()=>Math.random()-.5);
    return `<div class="pronoun-exercise f1-practice-card"><div class="exercise-top"><span>${s.title}</span><span>EASY</span></div><div class="progress-track"><i style="width:35%"></i></div>${pronounHintButton('easy')}<div class="pronoun-prompt">Translate</div><div class="pronoun-word">${pronounQuestion[0]}</div><div class="pronoun-options">${options.map(o=>`<button class="pronoun-option" onclick="checkPronounEasy(this,'${escapePronoun(o)}')">${o}</button>`).join('')}</div><button class="next-action" onclick="startPronoun('easy')">NEXT →</button></div>`;
  }

  if(s.id==='personal' && pronounHardQuestion){
    const q=pronounHardQuestion;
    return `<div class="pronoun-exercise f1-practice-card"><div class="exercise-top"><span>${s.title}</span><span>HARD</span></div><div class="progress-track"><i style="width:70%"></i></div>${pronounHintButton('hard')}<div class="pronoun-prompt">Complete the declension</div><div class="pronoun-word">${q.base}</div><div class="pronoun-grid">${q.rows.map((r,i)=>`<label><span>${r[0]}</span><input id="pronoun-cell-${i}" autocomplete="off" spellcheck="false"></label>`).join('')}</div><button id="pronoun-check" class="check-action" onclick="checkPronounHard()">CHECK</button><div id="pronoun-result" class="pronoun-result"></div><button class="next-action" onclick="startPronoun('hard')">NEXT →</button></div>`;
  }

  const cols=s.cases||[];
  return `<div class="pronoun-exercise f1-practice-card"><div class="exercise-top"><span>${s.title}</span><span>HARD</span></div><div class="progress-track"><i style="width:70%"></i></div>${pronounHintButton('hard')}<div class="pronoun-prompt">Complete the form</div><div class="pronoun-word">${pronounQuestion[0]}</div><div class="pronoun-grid">${cols.map((c,i)=>`<label><span>${c}</span><input id="pronoun-cell-${i}" autocomplete="off" spellcheck="false"></label>`).join('')}</div><button id="pronoun-check" class="check-action" onclick="checkPronounHard()">CHECK</button><div id="pronoun-result" class="pronoun-result"></div><button class="next-action" onclick="startPronoun('hard')">NEXT →</button></div>`;
}

function escapePronoun(v){return String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\"/g,'&quot;');}
function normalizePronoun(v){return String(v||'').trim().toLowerCase().replace(/[·.,;!?]/g,'').replace(/\s+/g,' ');}

function checkPronounEasy(btn,answer){
  if(pronounAnswered)return;
  pronounAnswered=true;
  const correct=normalizePronoun(answer)===normalizePronoun(pronounQuestion[1]);
  document.querySelectorAll('.pronoun-option').forEach(b=>b.disabled=true);
  btn.classList.add(correct?'correct':'wrong');
  if(correct){
    addStudyPoints(10);
    if(typeof showF1Broadcast==='function')showF1Broadcast('Great call — keep the pace!');
  }else{
    document.querySelectorAll('.pronoun-option').forEach(b=>{if(normalizePronoun(b.textContent)===normalizePronoun(pronounQuestion[1]))b.classList.add('answer-reveal');});
  }
}

function checkPronounHard(){
  if(pronounAnswered)return;
  const q=pronounHardQuestion;
  if(!q){return checkGenericPronounHard();}
  const cells=q.rows.map((_,i)=>document.getElementById(`pronoun-cell-${i}`));
  const values=cells.map(x=>normalizePronoun(x?.value));
  const expected=q.rows.map(r=>normalizePronoun(r[1]));
  const ok=values.every((v,i)=>v===expected[i] || (expected[i]==='—'&&v===''));
  const result=document.getElementById('pronoun-result');
  pronounAnswered=true;
  cells.forEach(x=>x.disabled=true);
  const check=document.getElementById('pronoun-check');
  if(check)check.disabled=true;
  result.textContent=ok?'CORRECT · +20 PTS':`CHECK AGAIN · ${q.rows.map(r=>r[1]).join(' · ')}`;
  result.className='pronoun-result '+(ok?'correct':'wrong');
  if(ok){addStudyPoints(20);if(typeof showF1Broadcast==='function')showF1Broadcast('Clean lap. Keep pushing!');}
}

function checkGenericPronounHard(){
  const s=pronounSection;
  const rows=s.table||[];
  const row=rows[Math.floor(Math.random()*rows.length)];
  const cells=s.cases.map((_,i)=>document.getElementById(`pronoun-cell-${i}`));
  const values=cells.map(x=>normalizePronoun(x?.value));
  const expected=row.slice(0,cells.length).map(normalizePronoun);
  const ok=values.every((v,i)=>v===expected[i]||(expected[i]==='—'&&v===''));
  const result=document.getElementById('pronoun-result');
  pronounAnswered=true;
  cells.forEach(x=>x.disabled=true);
  const check=document.getElementById('pronoun-check');
  if(check)check.disabled=true;
  result.textContent=ok?'CORRECT · +20 PTS':`CHECK AGAIN · Example: ${row.join(' · ')}`;
  result.className='pronoun-result '+(ok?'correct':'wrong');
  if(ok){addStudyPoints(20);if(typeof showF1Broadcast==='function')showF1Broadcast('Clean lap. Keep pushing!');}
}

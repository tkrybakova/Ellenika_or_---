// ============================================================
// pronouns.js – Greek pronouns practice
// Two modes per section: EASY = choose translation, HARD = complete declension
// ============================================================

const PRONOUN_SECTIONS = [
  {
    id:'personal', title:'THE PERSONAL PRONOUNS', greek:'Προσωπικές Αντωνυμίες',
    easy:[
      ['εγώ','I'],['εσύ','you (singular)'],['αυτός','he'],['αυτή','she'],['αυτό','it'],['εμείς','we'],['εσείς','you (plural)'],['αυτοί','they (masculine)'],['αυτές','they (feminine)'],['αυτά','they (neuter)']
    ],
    cases:['Nominative','Possessive','Accusative','Vocative'],
    table:[
      ['εγώ','μου / εμένα','με / εμένα','—'],
      ['εσύ','σου / εσένα','σε / εσένα','—'],
      ['αυτός','του / αυτού','τον / αυτόν','—'],
      ['αυτή','της / αυτής','την / αυτήν','—'],
      ['αυτό','του / αυτού','το / αυτό','—'],
      ['εμείς','μας / εμάς','μας / εμάς','—'],
      ['εσείς','σας / εσάς','σας / εσάς','—'],
      ['αυτοί','τους / αυτών','τους / αυτούς','—'],
      ['αυτές','τους / αυτών','τις / αυτές','—'],
      ['αυτά','τους / αυτών','τα / αυτά','—']
    ]
  },
  {
    id:'possessive', title:'THE POSSESSIVE PRONOUNS', greek:'Κτητικές Αντωνυμίες',
    easy:[['μου','my / mine'],['σου','your / yours'],['του','his / its'],['της','her / hers'],['μας','our / ours'],['σας','your / yours'],['τους','their / theirs']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['μου','μου','μου'],['σου','σου','σου'],['του','του','του'],['της','της','της'],['μας','μας','μας'],['σας','σας','σας'],['τους','τους','τους']],
    note:'Possessive forms agree with the thing possessed when used with articles: ο δικός μου, η δική μου, το δικό μου.'
  },
  {
    id:'demonstrative', title:'THE DEMONSTRATIVE PRONOUNS', greek:'Δεικτικές Αντωνυμίες',
    easy:[['αυτός','this / he'],['αυτή','this / she'],['αυτό','this / it'],['εκείνος','that / he'],['εκείνη','that / she'],['εκείνο','that / it']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['αυτός','αυτή','αυτό'],['εκείνος','εκείνη','εκείνο']],
    endings:['αυτούς / αυτού','αυτές / αυτής','αυτά / αυτού'],
    note:'The demonstrative pronoun changes for gender, number and case.'
  },
  {
    id:'definite', title:'THE DEFINITE PRONOUNS', greek:'Οριστικές Αντωνυμίες',
    easy:[['ο ίδιος','the same / himself'],['η ίδια','the same / herself'],['το ίδιο','the same / itself'],['μόνος','alone / himself'],['μόνη','alone / herself'],['μόνο','alone / itself']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['ο ίδιος','η ίδια','το ίδιο'],['ο ίδιος','η ίδια','το ίδιο']],
    note:'Forms such as ίδιος agree with the noun in gender, number and case.'
  },
  {
    id:'relative', title:'THE RELATIVE PRONOUNS', greek:'Αναφορικές Αντωνυμίες',
    easy:[['ο οποίος','who / which (masc.)'],['η οποία','who / which (fem.)'],['το οποίο','which (neut.)'],['που','who / which / that']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['ο οποίος','η οποία','το οποίο'],['του οποίου','της οποίας','του οποίου'],['τον οποίο','την οποία','το οποίο'],['—','—','—']],
    note:'ο οποίος / η οποία / το οποίο agree with the noun they refer to. The invariant που does not decline.'
  },
  {
    id:'interrogative', title:'THE INTERROGATIVE PRONOUNS', greek:'Ερωτηματικές Αντωνυμίες',
    easy:[['ποιος','who / which (masc.)'],['ποια','who / which (fem.)'],['ποιο','who / which (neut.)'],['τι','what'],['ποιος;','who? / which?']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['ποιος','ποια','ποιο'],['ποιου','ποιας','ποιου'],['ποιον','ποια','ποιο'],['—','—','—']],
    note:'ποιος, ποια, ποιο change according to gender and case. τι is indeclinable.'
  },
  {
    id:'indefinite', title:'THE INDEFINITE PRONOUNS', greek:'Αόριστες Αντωνυμίες',
    easy:[['κάποιος','someone / somebody'],['κάποια','someone / some'],['κάποιο','something / some'],['κανένας','no one / nobody'],['κανένα','nothing / none']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['κάποιος','κάποια','κάποιο'],['κάποιου','κάποιας','κάποιου'],['κάποιον','κάποια','κάποιο'],['—','—','—']],
    note:'Common indefinite forms such as κάποιος decline by gender and case.'
  },
  {
    id:'reflexive', title:'THE REFLEXIVE PRONOUNS', greek:'Αυτοπαθείς Αντωνυμίες',
    easy:[['ο εαυτός μου','myself'],['ο εαυτός σου','yourself'],['ο εαυτός του','himself / itself'],['ο εαυτός της','herself']],
    cases:['Masculine','Feminine','Neuter'],
    table:[['ο εαυτός μου','η εαυτή μου','το εαυτό μου'],['του εαυτού μου','της εαυτής μου','του εαυτού μου'],['τον εαυτό μου','τον εαυτό μου','το εαυτό μου'],['—','—','—']],
    note:'The source notes that the Nominative is not often used. Reflexive forms show that the action returns to the person who acted.'
  }
];

let pronounSection = null;
let pronounLevel = 'easy';
let pronounQuestion = null;

function openPronouns(){
  renderPage('PRONOUNS', renderPronounSections(), 'practice-page');
}

function renderPronounSections(){
  return `<div class="pronouns-page">
    <div class="pronouns-header"><span class="selector-label">ELLENIKA / PRONOUNS</span><h1>PRONOUNS</h1><p>Eight grammar sections · two training modes</p></div>
    <div class="pronoun-section-list">${PRONOUN_SECTIONS.map((s,i)=>`
      <button class="pronoun-section-row" onclick="openPronounSection('${s.id}')">
        <span class="pronoun-number">${String(i+1).padStart(2,'0')}</span>
        <span class="pronoun-section-main"><b>${s.title}</b><small>${s.greek}</small></span>
        <span class="pronoun-section-modes">EASY · HARD</span><i>→</i>
      </button>`).join('')}</div>
  </div>`;
}

function openPronounSection(id){
  pronounSection=PRONOUN_SECTIONS.find(s=>s.id===id);
  renderPage('PRONOUNS', renderPronounModes(), 'practice-page');
}

function renderPronounModes(){
  const s=pronounSection;
  return `<div class="practice-selector f1-selector pronoun-selector">
    <div class="selector-head"><div><span class="selector-label">${s.title}</span><p>${s.greek}</p></div><span class="selector-lights">● ●</span></div>
    <div class="f1-level-list">
      <button class="level-tab level-easy" onclick="startPronoun('easy')"><span class="level-number">01</span><span class="level-main"><b>EASY</b><small>Choose the translation</small></span><strong>10 PTS</strong><i>→</i></button>
      <button class="level-tab level-hard" onclick="startPronoun('hard')"><span class="level-number">02</span><span class="level-main"><b>HARD</b><small>Write the declension</small></span><strong>20 PTS</strong><i>→</i></button>
    </div>
  </div>`;
}

function startPronoun(level){
  pronounLevel=level;
  pronounQuestion=pronounSection.easy[Math.floor(Math.random()*pronounSection.easy.length)];
  renderPage('PRONOUNS', renderPronounExercise(), 'practice-page');
}

function renderPronounExercise(){
  const s=pronounSection;
  if(pronounLevel==='easy'){
    const options=[pronounQuestion[1],...s.easy.filter(x=>x!==pronounQuestion).sort(()=>Math.random()-.5).slice(0,2).map(x=>x[1])].sort(()=>Math.random()-.5);
    return `<div class="pronoun-exercise f1-practice-card">
      <div class="exercise-top"><span>${s.title}</span><span>EASY · 01</span></div><div class="progress-track"><i style="width:35%"></i></div>
      <div class="pronoun-prompt">Translate</div><div class="pronoun-word">${pronounQuestion[0]}</div>
      <div class="pronoun-options">${options.map(o=>`<button class="pronoun-option" onclick="checkPronounEasy(this,'${escapePronoun(o)}')">${o}</button>`).join('')}</div>
      <button class="next-action" onclick="startPronoun('easy')">NEXT →</button></div>`;
  }
  const cols=s.cases;
  return `<div class="pronoun-exercise f1-practice-card">
    <div class="exercise-top"><span>${s.title}</span><span>HARD · 02</span></div><div class="progress-track"><i style="width:70%"></i></div>
    <div class="pronoun-prompt">Complete the declension</div><div class="pronoun-word">${pronounQuestion[0]}</div>
    <div class="pronoun-grid">${cols.map((c,i)=>`<label><span>${c}</span><input id="pronoun-cell-${i}" autocomplete="off"></label>`).join('')}</div>
    <button class="check-action" onclick="checkPronounHard()">CHECK</button><div id="pronoun-result" class="pronoun-result"></div>
    <button class="next-action" onclick="startPronoun('hard')">NEXT →</button></div>`;
}

function escapePronoun(v){return String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');}
function normalizePronoun(v){return String(v||'').trim().toLowerCase().replace(/[·.,;!?]/g,'').replace(/\s+/g,' ');}
function checkPronounEasy(btn,answer){
  const correct=normalizePronoun(answer)===normalizePronoun(pronounQuestion[1]);
  btn.classList.add(correct?'correct':'wrong');
  if(correct){addStudyPoints(10); showF1Broadcast('Great call — keep the pace!');}
  else btn.classList.add('answer-reveal');
}
function checkPronounHard(){
  const s=pronounSection; const row=s.table[Math.floor(s.table.length*Math.random())];
  const cells=s.cases.map((_,i)=>document.getElementById(`pronoun-cell-${i}`));
  const values=cells.map(x=>normalizePronoun(x?.value));
  const expected=row.slice(0,cells.length).map(normalizePronoun);
  const ok=values.every((v,i)=>v===expected[i] || expected[i]==='—' && v==='');
  const result=document.getElementById('pronoun-result');
  result.textContent=ok?'CORRECT · +20 PTS':`CHECK AGAIN · Example: ${row.join(' · ')}`;
  result.className='pronoun-result '+(ok?'correct':'wrong');
  if(ok){addStudyPoints(20);showF1Broadcast('Clean lap. Keep pushing!');}
}

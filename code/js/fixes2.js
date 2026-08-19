// Final compatibility layer for practice exercises.
// Loaded after the base modules so this file is the single final override layer.

const FINAL_ADJECTIVES = [
  { positive:'καλός', comparative:'καλύτερος', superlative:'κάλλιστος', meaning:'good / well', comparativeEnding:'-ύτερος' },
  { positive:'μεγάλος', comparative:'μεγαλύτερος', superlative:'μέγιστος', meaning:'big / large', comparativeEnding:'-ύτερος' },
  { positive:'μικρός', comparative:'μικρότερος', superlative:'ελάχιστος', meaning:'small', comparativeEnding:'-ότερος' },
  { positive:'γρήγορος', comparative:'γρηγορότερος', superlative:'γρηγορότατος', meaning:'fast', comparativeEnding:'-ότερος' },
  { positive:'αργός', comparative:'αργότερος', superlative:'αργότατος', meaning:'slow', comparativeEnding:'-ότερος' },
  { positive:'εύκολος', comparative:'ευκολότερος', superlative:'ευκολότατος', meaning:'easy', comparativeEnding:'-ότερος' },
  { positive:'δύσκολος', comparative:'δυσκολότερος', superlative:'δυσκολότατος', meaning:'difficult', comparativeEnding:'-ότερος' },
  { positive:'ψηλός', comparative:'ψηλότερος', superlative:'ψηλότατος', meaning:'tall / high', comparativeEnding:'-ότερος' },
  { positive:'χαμηλός', comparative:'χαμηλότερος', superlative:'χαμηλότατος', meaning:'low', comparativeEnding:'-ότερος' },
  { positive:'ωραίος', comparative:'ωραιότερος', superlative:'ωραιότατος', meaning:'beautiful / nice', comparativeEnding:'-ότερος' }
];

function finishFinalPractice({section,level,correct,message,next}){
  recordGrammarAnswer(section,correct);
  if(correct&&typeof addScore==='function')addScore(PRACTICE_POINTS[level]||10);
  const result=document.getElementById('practice-result');
  if(result){result.className=correct?'correct practice-result':'wrong practice-result';result.textContent=`${correct?'✓':'✕'} ${message}${correct?`  +${PRACTICE_POINTS[level]||10} pts`:''}`;}
  const button=document.getElementById('next-practice-btn');
  if(button){button.disabled=false;button.textContent=next.label;button.onclick=next.action;}
}

function finalPracticeShell(title,level,progress,task,nextLabel,nextAction){
  const labels={easy:['EASY','01 / 03'],medium:['MEDIUM','02 / 03'],hard:['HARD','03 / 03']};
  const [name,number]=labels[level]||labels.easy;
  return `<div class="exercise-top"><span>${escapeHtml(title)} / ${name}</span><span>${number}</span></div><div class="progress-track"><i style="width:${progress}%"></i></div>${task}${renderFixedResultArea(nextLabel,nextAction)}`;
}

// ---------------- ADJECTIVES ----------------
function startAdjective(level='easy'){
  clearInterval(typeof adjectiveTimer!=='undefined'?adjectiveTimer:null);
  adjectiveLevel=level;
  const word=FINAL_ADJECTIVES[Math.floor(Math.random()*FINAL_ADJECTIVES.length)];
  const labels={easy:['EASY','01 / 03'],medium:['MEDIUM','02 / 03'],hard:['HARD','03 / 03']};
  const [name,number]=labels[level]||labels.easy;
  let target=null;
  let task='';

  if(level==='easy'){
    const degrees=[['positive','Positive Degree',word.positive],['comparative','Comparative Degree',word.comparative],['superlative','Superlative Degree',word.superlative]];
    target=degrees[Math.floor(Math.random()*degrees.length)];
    task=`<div class="adj-prompt">IDENTIFY THE DEGREE</div><div class="adj-word">${escapeHtml(target[2])}</div><div class="adj-meaning">${escapeHtml(word.meaning)}</div><div class="adj-options">${degrees.map(([id,label])=>`<button class="adj-option" data-degree="${id}">${label}</button>`).join('')}</div>${renderAdjectiveHint()}`;
  }else if(level==='medium'){
    const comparativeStem=word.comparative.slice(0,-word.comparativeEnding.length);
    task=`<div class="adj-prompt">WRITE THE COMPARATIVE ENDING</div><div class="adj-word">${escapeHtml(comparativeStem)}___</div><div class="adj-meaning">${escapeHtml(word.meaning)} · Complete the comparative degree</div><div class="adj-input"><input id="adj-ending" placeholder="Ending, e.g. -ότερος" autocomplete="off"><button class="check-action" id="adj-check">CHECK</button></div>${renderAdjectiveHint()}`;
  }else{
    task=`<div class="adj-prompt">WRITE BOTH DEGREES</div><div class="adj-word">${escapeHtml(word.positive)}</div><div class="adj-meaning">${escapeHtml(word.meaning)}</div><div class="adj-hard"><label>Comparative Degree<input id="adj-comparative" placeholder="Comparative" autocomplete="off"></label><label>Superlative Degree<input id="adj-superlative" placeholder="Superlative" autocomplete="off"></label></div><button class="check-action" id="adj-check">CHECK ANSWER</button>${renderAdjectiveHint()}`;
  }

  const html=`<div class="adjective-redesign"><div class="exercise-shell">${finalPracticeShell('ADJECTIVES',level,level==='easy'?33:level==='medium'?66:100,task,'Next adjective →',()=>startAdjective(level))}</div></div>`;
  document.getElementById('content').innerHTML=html;
  adjectiveStyles();

  let answered=false;
  const finish=(correct,message)=>{
    if(answered)return;
    answered=true;
    clearInterval(adjectiveTimer);
    finishFinalPractice({section:'adjectives',level,correct,message,next:{label:'Next adjective →',action:()=>startAdjective(level)}});
  };

  if(level==='easy'){
    document.querySelectorAll('.adjective-redesign .adj-option').forEach(button=>button.onclick=()=>{
      const correct=button.dataset.degree===target[0];
      document.querySelectorAll('.adjective-redesign .adj-option').forEach(b=>b.disabled=true);
      finish(correct,correct?`Correct: ${target[1]}.`:`Correct answer: ${target[1]}.`);
    });
  }else if(level==='medium'){
    const check=()=>{
      const answer=normalizeAnswer(document.getElementById('adj-ending')?.value);
      if(!answer)return;
      const expected=normalizeAnswer(word.comparativeEnding);
      const correct=answer===expected;
      finish(correct,correct?`Correct ending: ${word.comparativeEnding}.`:`Correct ending: ${word.comparativeEnding}.`);
    };
    document.getElementById('adj-check').onclick=check;
    document.getElementById('adj-ending').onkeydown=e=>{if(e.key==='Enter')check();};
  }else{
    const check=()=>{
      const comparative=normalizeAnswer(document.getElementById('adj-comparative')?.value);
      const superlative=normalizeAnswer(document.getElementById('adj-superlative')?.value);
      if(!comparative||!superlative)return;
      const correct=comparative===normalizeAnswer(word.comparative)&&superlative===normalizeAnswer(word.superlative);
      finish(correct,correct?'Correct forms.':`Correct forms: ${word.comparative} / ${word.superlative}.`);
    };
    document.getElementById('adj-check').onclick=check;
    document.querySelectorAll('.adjective-redesign input').forEach(input=>input.onkeydown=e=>{if(e.key==='Enter')check();});
  }

  const timer=document.getElementById('adjective-timer');
  if(timer){let seconds=60;timer.textContent='1:00';adjectiveTimer=setInterval(()=>{if(answered){clearInterval(adjectiveTimer);return;}seconds--;timer.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(seconds<=15)timer.style.color='#e10600';if(seconds<=0)finish(false,level==='easy'?`Time's up. Correct answer: ${target[1]}.`:'Time is up.');},1000);}
}

// ---------------- PRONOUNS ----------------
let fixedPronounTarget=null;

function pronounCaseLabel(index){return ['Nominative','Possessive','Accusative','Vocative'][index]||`Case ${index+1}`;}
function pronounCellVariants(value){
  return String(value||'').split('/').map(v=>normalizeAnswer(v.replace(/[()]/g,''))).filter(Boolean);
}
function pronounCellCorrect(answer,expected){
  const a=normalizeAnswer(answer);
  if(!a)return false;
  if(normalizeAnswer(expected)==='—')return a==='';
  return pronounCellVariants(expected).some(v=>a===v||a.replace(/\s+/g,'')===v.replace(/\s+/g,''));
}

function startPronoun(level='easy'){
  pronounLevel=level;
  pronounAnswered=false;
  if(!pronounSection)return;
  pronounQuestion=pronounSection.easy[Math.floor(Math.random()*pronounSection.easy.length)];

  if(level==='easy'){
    const options=pronounSection.easy.slice().sort(()=>Math.random()-.5);
    const task=`<div class="pronoun-prompt">CHOOSE THE TRANSLATION</div><div class="pronoun-word">${escapeHtml(pronounQuestion[0])}</div><div class="pronoun-options">${options.map(([greek,translation])=>`<button class="answer-card pronoun-option" data-translation="${escapeHtml(translation)}">${escapeHtml(translation)}</button>`).join('')}</div>`;
    renderPage('PRONOUNS',`<div class="pronoun-exercise f1-practice-card">${finalPracticeShell(pronounSection.title,'easy',33,`${pronounHintButton('easy')}${task}`,'NEXT →',()=>startPronoun('easy'))}</div>`,'practice-page');
    let answered=false;
    document.querySelectorAll('.pronoun-option').forEach(button=>button.onclick=()=>{
      if(answered)return;
      answered=true;
      const correct=normalizeAnswer(button.dataset.translation)===normalizeAnswer(pronounQuestion[1]);
      document.querySelectorAll('.pronoun-option').forEach(option=>{option.disabled=true;if(normalizeAnswer(option.dataset.translation)===normalizeAnswer(pronounQuestion[1]))option.classList.add('correct');});
      if(!correct)button.classList.add('wrong');
      finishFinalPractice({section:'pronouns',level:'easy',correct,message:correct?'Correct translation.':`Correct answer: ${pronounQuestion[1]}.`,next:{label:'NEXT →',action:()=>startPronoun('easy')}});
    });
    return;
  }

  if(pronounSection.id==='personal'&&pronounSection.hardGroups){
    const group=pronounSection.hardGroups[Math.floor(Math.random()*pronounSection.hardGroups.length)];
    fixedPronounTarget={mode:'personal',group};
    const rows=group.rows;
    const fields=rows.map((row,i)=>`<label><span>${escapeHtml(row[0])}</span><input id="personal-pronoun-${i}" autocomplete="off" spellcheck="false"></label>`).join('');
    const task=`<div class="pronoun-prompt">COMPLETE THE DECLENSION</div><div class="pronoun-word">${escapeHtml(group.base)}</div><div class="pronoun-case-label">${escapeHtml(group.title)}</div><div class="pronoun-grid">${fields}</div><button class="check-action" id="fixed-pronoun-check">CHECK</button>${pronounHintButton('hard')}`;
    renderPage('PRONOUNS',`<div class="pronoun-exercise f1-practice-card">${finalPracticeShell(pronounSection.title,'hard',100,task,'NEXT →',()=>startPronoun('hard'))}</div>`,'practice-page');
    const check=()=>{
      if(pronounAnswered)return;
      const values=rows.map((_,i)=>document.getElementById(`personal-pronoun-${i}`)?.value||'');
      if(values.some((v,i)=>!v.trim()&&rows[i][1]!=='—'))return;
      const correct=values.every((v,i)=>pronounCellCorrect(v,rows[i][1]));
      pronounAnswered=true;
      document.querySelectorAll('.pronoun-grid input').forEach(input=>input.disabled=true);
      document.getElementById('fixed-pronoun-check').disabled=true;
      finishFinalPractice({section:'pronouns',level:'hard',correct,message:correct?'Correct declension.':`Correct forms: ${rows.map(r=>r[1]).join(' · ')}`,next:{label:'NEXT →',action:()=>startPronoun('hard')}});
    };
    document.getElementById('fixed-pronoun-check').onclick=check;
    document.querySelectorAll('.pronoun-grid input').forEach(input=>input.onkeydown=e=>{if(e.key==='Enter')check();});
    return;
  }

  const rows=Array.isArray(pronounSection.table)?pronounSection.table:[];
  if(!rows.length){renderPage('PRONOUNS',emptyState('PRONOUNS is not ready','This section has no declension data.'),'practice-page');return;}
  fixedPronounTarget={mode:'table',rows};
  const caseCount=Math.min(rows.length,4);
  const cases=Array.from({length:caseCount},(_,i)=>pronounCaseLabel(i));
  const headings=pronounSection.cases&&pronounSection.cases.length===3?pronounSection.cases:['Masculine','Feminine','Neuter'];
  const cells=rows.slice(0,caseCount).map((row,r)=>`<div class="pronoun-case-row"><strong>${cases[r]}</strong>${row.slice(0,3).map((value,c)=>`<label><span>${escapeHtml(headings[c])}</span><input id="pronoun-${r}-${c}" value="" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(headings[c])}"></label>`).join('')}</div>`).join('');
  const task=`<div class="pronoun-prompt">WRITE THE DECLENSION BY CASE AND GENDER</div><div class="pronoun-word">${escapeHtml(pronounQuestion[0])}</div><div class="pronoun-grid pronoun-declension-grid">${cells}</div><button class="check-action" id="fixed-pronoun-check">CHECK</button>${pronounHintButton('hard')}`;
  renderPage('PRONOUNS',`<div class="pronoun-exercise f1-practice-card">${finalPracticeShell(pronounSection.title,'hard',100,task,'NEXT →',()=>startPronoun('hard'))}</div>`,'practice-page');

  const check=()=>{
    if(pronounAnswered)return;
    const inputs=[];const expected=[];
    rows.slice(0,caseCount).forEach((row,r)=>row.slice(0,3).forEach((value,c)=>{inputs.push(document.getElementById(`pronoun-${r}-${c}`));expected.push(value);}));
    if(inputs.some((input,i)=>!input?.value.trim()&&normalizeAnswer(expected[i])!=='—'))return;
    const correct=inputs.every((input,i)=>pronounCellCorrect(input?.value,expected[i]));
    pronounAnswered=true;
    inputs.forEach(input=>{if(input)input.disabled=true;});
    document.getElementById('fixed-pronoun-check').disabled=true;
    finishFinalPractice({section:'pronouns',level:'hard',correct,message:correct?'Correct declension.':'Some forms are incorrect. Check the grammar table and try again on the next lap.',next:{label:'NEXT →',action:()=>startPronoun('hard')}});
  };
  document.getElementById('fixed-pronoun-check').onclick=check;
  document.querySelectorAll('.pronoun-declension-grid input').forEach(input=>input.onkeydown=e=>{if(e.key==='Enter')check();});
}

// English grammar levels, tabs and topics

const ENGLISH_GRAMMAR_LEVELS = [
  { id:'a0', name:'A0', title:'FOUNDATION', description:'The absolute basics.' },
  { id:'a1', name:'A1', title:'BEGINNER', description:'Basic everyday English.' },
  { id:'a2', name:'A2', title:'ELEMENTARY', description:'Core structures and wider everyday grammar.' },
  { id:'b1', name:'B1', title:'INTERMEDIATE', description:'Independent communication and flexible structures.' },
  { id:'b2', name:'B2', title:'UPPER-INTERMEDIATE', description:'Complex grammar and precise expression.' },
  { id:'c1', name:'C1', title:'ADVANCED', description:'Advanced structures and subtle distinctions.' },
  { id:'c2', name:'C2', title:'PROFICIENCY', description:'Sophisticated, precise grammatical control.' }
];

const ENGLISH_GRAMMAR_TOPICS = [
  {id:'be_basic',level:'A0',name:'Verb to be',shortDescription:'am, is, are and basic sentences.'},
  {id:'pronouns_basic',level:'A0',name:'Personal pronouns',shortDescription:'I, you, he, she, it, we, they.'},
  {id:'sentence_order',level:'A0',name:'Basic sentence order',shortDescription:'Subject, verb and object.'},
  {id:'articles_basic',level:'A0',name:'Basic articles',shortDescription:'a, an and the.'},
  {id:'present_simple',level:'A1',name:'Present Simple',shortDescription:'Habits, routines and facts.'},
  {id:'present_continuous',level:'A1',name:'Present Continuous',shortDescription:'Actions happening now.'},
  {id:'past_simple',level:'A1',name:'Past Simple',shortDescription:'Finished actions in the past.'},
  {id:'future_simple',level:'A1',name:'Future Simple',shortDescription:'Predictions and future decisions.'},
  {id:'can_cant',level:'A1',name:"Can / can't",shortDescription:'Ability, permission and possibility.'},
  {id:'there_is_are',level:'A1',name:'There is / There are',shortDescription:'Existence and places.'},
  {id:'present_perfect',level:'A2',name:'Present Perfect',shortDescription:'Past actions connected to now.'},
  {id:'past_continuous',level:'A2',name:'Past Continuous',shortDescription:'Actions in progress in the past.'},
  {id:'comparatives',level:'A2',name:'Comparatives & superlatives',shortDescription:'Comparing people, things and places.'},
  {id:'countable_uncountable',level:'A2',name:'Countable & uncountable nouns',shortDescription:'Quantities and determiners.'},
  {id:'going_to',level:'A2',name:'Going to',shortDescription:'Plans, intentions and predictions.'},
  {id:'first_conditional',level:'A2',name:'First Conditional',shortDescription:'Real future conditions.'},
  {id:'present_perfect_continuous',level:'B1',name:'Present Perfect Continuous',shortDescription:'Actions continuing up to now.'},
  {id:'past_perfect',level:'B1',name:'Past Perfect',shortDescription:'An earlier action in the past.'},
  {id:'used_to',level:'B1',name:'Used to',shortDescription:'Past habits and states.'},
  {id:'second_conditional',level:'B1',name:'Second Conditional',shortDescription:'Unreal and hypothetical situations.'},
  {id:'reported_speech',level:'B1',name:'Reported Speech',shortDescription:'Reporting what someone said.'},
  {id:'passive_basic',level:'B1',name:'Passive Voice',shortDescription:'Focus on the action or result.'},
  {id:'future_continuous',level:'B2',name:'Future Continuous',shortDescription:'Actions in progress in the future.'},
  {id:'future_perfect',level:'B2',name:'Future Perfect',shortDescription:'Actions completed before a future point.'},
  {id:'third_conditional',level:'B2',name:'Third Conditional',shortDescription:'Imaginary situations in the past.'},
  {id:'mixed_conditionals',level:'B2',name:'Mixed Conditionals',shortDescription:'Different time relationships.'},
  {id:'modal_perfects',level:'B2',name:'Modal Perfects',shortDescription:'Must have, might have, should have.'},
  {id:'relative_clauses',level:'B2',name:'Relative Clauses',shortDescription:'Defining and non-defining clauses.'},
  {id:'inversion',level:'C1',name:'Inversion',shortDescription:'Emphasis through inverted structures.'},
  {id:'cleft_sentences',level:'C1',name:'Cleft Sentences',shortDescription:'Highlighting specific information.'},
  {id:'advanced_modals',level:'C1',name:'Advanced Modals',shortDescription:'Certainty, criticism and deduction.'},
  {id:'subjunctive',level:'C1',name:'Subjunctive',shortDescription:'Formal recommendations and hypotheticals.'},
  {id:'participle_clauses',level:'C1',name:'Participle Clauses',shortDescription:'Compact complex structures.'},
  {id:'advanced_passive',level:'C1',name:'Advanced Passive',shortDescription:'Complex passive and reporting structures.'},
  {id:'advanced_conditionals',level:'C2',name:'Advanced Conditionals',shortDescription:'Nuanced hypothetical relationships.'},
  {id:'nominalisation',level:'C2',name:'Nominalisation',shortDescription:'Formal and academic grammatical style.'},
  {id:'ellipsis',level:'C2',name:'Ellipsis',shortDescription:'Natural omission of recoverable information.'},
  {id:'advanced_emphasis',level:'C2',name:'Advanced Emphasis',shortDescription:'Fine control of focus and meaning.'},
  {id:'discourse_grammar',level:'C2',name:'Discourse Grammar',shortDescription:'Grammar across longer texts and contexts.'},
  {id:'register',level:'C2',name:'Grammar & Register',shortDescription:'Formal, neutral, informal and spoken choices.'}
];

const ENGLISH_GRAMMAR_STRUCTURES = {
  be_basic:{affirmative:'subject + am/is/are + complement',negative:'subject + am/is/are not + complement',question:'am/is/are + subject + complement',signals:[]},
  pronouns_basic:{affirmative:'I / you / he / she / it / we / they',negative:'',question:'',signals:[]},
  sentence_order:{affirmative:'subject + verb + object',negative:'subject + auxiliary + not + verb',question:'auxiliary + subject + verb',signals:[]},
  articles_basic:{affirmative:'a/an + singular noun',negative:'',question:'',signals:[]},
  present_simple:{affirmative:'subject + base verb',negative:'subject + do/does not + base verb',question:'do/does + subject + base verb',signals:['always','usually','often','sometimes','every day']},
  present_continuous:{affirmative:'subject + am/is/are + verb-ing',negative:'subject + am/is/are not + verb-ing',question:'am/is/are + subject + verb-ing',signals:['now','right now','at the moment','currently']},
  past_simple:{affirmative:'subject + past form',negative:'subject + did not + base verb',question:'did + subject + base verb',signals:['yesterday','last week','ago']},
  future_simple:{affirmative:'subject + will + base verb',negative:'subject + will not + base verb',question:'will + subject + base verb',signals:['tomorrow','next week','probably']},
  present_perfect:{affirmative:'subject + have/has + past participle',negative:'subject + have/has not + past participle',question:'have/has + subject + past participle',signals:['already','just','ever','never','yet','since','for']},
  past_continuous:{affirmative:'subject + was/were + verb-ing',negative:'subject + was/were not + verb-ing',question:'was/were + subject + verb-ing',signals:['while','when']}
};

function getEnglishGrammarLevel(id){return ENGLISH_GRAMMAR_LEVELS.find(level=>level.id===id)||null;}
function getEnglishGrammarTopic(id){return ENGLISH_GRAMMAR_TOPICS.find(topic=>topic.id===id)||null;}
function getEnglishGrammarStructure(id){return ENGLISH_GRAMMAR_STRUCTURES[id]||{affirmative:'',negative:'',question:'',signals:[]};}

function openEnglishGrammar(){
  renderEnglishPage('GRAMMAR',`<div class="english-grammar-tabs" role="tablist" aria-label="English grammar levels">${ENGLISH_GRAMMAR_LEVELS.map((level,index)=>`<button class="english-level-tab ${index===0?'active':''}" role="tab" aria-selected="${index===0}" onclick="openEnglishGrammarLevel('${level.id}',this)">${escapeHtml(level.name)}</button>`).join('')}</div><div id="english-grammar-level-content"></div>`);
  openEnglishGrammarLevel('a0');
}

function openEnglishGrammarLevel(levelId,tabButton=null){
  const level=getEnglishGrammarLevel(levelId); if(!level)return;
  document.querySelectorAll('.english-level-tab').forEach(tab=>{const active=tab.textContent.trim()===level.name;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',active?'true':'false');});
  const content=document.getElementById('english-grammar-level-content'); if(!content)return;
  const topics=ENGLISH_GRAMMAR_TOPICS.filter(topic=>topic.level.toLowerCase()===levelId);
  content.innerHTML=`<div class="english-level-header"><span>${escapeHtml(level.name)} · ${escapeHtml(level.title)}</span><p>${escapeHtml(level.description)}</p></div><div class="english-topic-grid">${topics.map(topic=>`<button class="english-topic-card" onclick="startEnglishGrammar('${topic.id}')"><span>${escapeHtml(topic.level)}</span><strong>${escapeHtml(topic.name)}</strong><small>${escapeHtml(topic.shortDescription)}</small></button>`).join('')}</div>`;
}

function startEnglishGrammar(id){
  const topic=getEnglishGrammarTopic(id); if(!topic)return;
  const structure=getEnglishGrammarStructure(id);
  renderEnglishPage(topic.name,`<div class="english-grammar-detail"><div class="english-topic-meta"><span>${escapeHtml(topic.level)}</span><span>GRAMMAR</span></div><p>${escapeHtml(topic.shortDescription)}</p><div class="english-structure-grid"><div><small>AFFIRMATIVE</small><strong>${escapeHtml(structure.affirmative)}</strong></div><div><small>NEGATIVE</small><strong>${escapeHtml(structure.negative)}</strong></div><div><small>QUESTION</small><strong>${escapeHtml(structure.question)}</strong></div></div>${structure.signals.length?`<div class="english-signals"><small>COMMON SIGNALS</small><div>${structure.signals.map(signal=>`<span>${escapeHtml(signal)}</span>`).join('')}</div></div>`:''}<button class="english-primary-button" onclick="startEnglishExerciseForTopic('${id}')">START PRACTICE →</button></div>`);
}

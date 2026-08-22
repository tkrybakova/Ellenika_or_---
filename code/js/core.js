const content = document.getElementById('content');

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
}

function clearGameState(){
  if(typeof currentGame!=='undefined')currentGame=null;
  if(typeof currentDeclensionGame!=='undefined')currentDeclensionGame=null;
  if(typeof genderTask!=='undefined')genderTask=null;
  if(typeof adjectiveGame!=='undefined')adjectiveGame=null;
  if(typeof currentPronounGame!=='undefined')currentPronounGame=null;
  window.currentGame=null;
  window.currentDeclensionGame=null;
  window.genderTask=null;
  window.adjectiveGame=null;
  window.currentPronounGame=null;
  if(typeof genderTimer!=='undefined')clearInterval(genderTimer);
  if(typeof adjectiveTimer!=='undefined')clearInterval(adjectiveTimer);
  if(typeof pronounTimer!=='undefined')clearInterval(pronounTimer);
  if(typeof window.ellenikaDeclensionTimer!=='undefined')clearInterval(window.ellenikaDeclensionTimer);
}

function showScreen(id){
  ['home-screen','dashboard-screen','content-screen'].forEach(screenId=>{
    const el=document.getElementById(screenId);
    if(el)el.classList.toggle('hidden',screenId!==id);
  });
}
function showHome(){showScreen('home-screen');}
function openGreekDashboard(){updateDashboardStats();showScreen('dashboard-screen');}
function showLanguageMessage(language){alert(language+' is not available yet.');}

function getDailyMissionDate(){
  const now=new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

function getDailyMissionState(){
  const today=getDailyMissionDate();
  const storedDate=localStorage.getItem('ellenikaDailyMissionDate');
  if(storedDate!==today){
    localStorage.setItem('ellenikaDailyMissionDate',today);
    localStorage.setItem('ellenikaDailyMissionStartScore',String(typeof getScore==='function'?getScore():0));
    localStorage.setItem('ellenikaDailyMissionClaimed','0');
  }
  const startScore=Number(localStorage.getItem('ellenikaDailyMissionStartScore')||0);
  const currentScore=typeof getScore==='function'?getScore():0;
  return {target:50,earned:Math.max(0,currentScore-startScore),claimed:localStorage.getItem('ellenikaDailyMissionClaimed')==='1'};
}

function checkDailyMission(){
  const state=getDailyMissionState();
  if(state.earned>=state.target&&!state.claimed){
    localStorage.setItem('ellenikaDailyMissionClaimed','1');
    if(typeof addScore==='function')addScore(50);
    state.claimed=true;
    if(typeof showF1BroadcastMessage==='function')showF1BroadcastMessage();
  }
  return state;
}

function updateDailyMission(){
  const root=document.getElementById('daily-mission');
  if(!root)return;
  const state=checkDailyMission();
  const percent=Math.min(100,Math.round(state.earned/state.target*100));
  root.innerHTML=`
    <section class="daily-mission ${state.claimed?'completed':''}">
      <div class="daily-mission-inner">
        <div class="daily-mission-head">
          <div><span class="daily-mission-kicker">DAILY MISSION</span><h3 class="daily-mission-title">Score 50 points today</h3></div>
          <span class="daily-mission-reward">REWARD <b>+50 PTS</b></span>
        </div>
        <p class="daily-mission-copy">Complete practice answers and build your championship score.</p>
        <div class="daily-mission-progress"><div class="daily-mission-track"><span style="width:${percent}%"></span></div><span class="daily-mission-count">${Math.min(state.earned,state.target)}/${state.target}</span></div>
        ${state.claimed?'<div class="daily-mission-complete">✓ Mission complete · bonus claimed</div>':'<button class="daily-mission-action" type="button" onclick="startDailyMission()">START PRACTICE →</button>'}
      </div>
    </section>`;
}

function startDailyMission(){
  openGenders();
}

function updateDashboardStats(){
  const vocabulary=document.getElementById('vocabulary-progress');
  const genders=document.getElementById('genders-progress');
  const declension=document.getElementById('declension-progress');
  const learned=dictionary.filter(w=>getWordProgress(w)>=3).length;
  if(vocabulary)vocabulary.textContent=`${learned}/${dictionary.length||0}`;
  if(genders)genders.textContent=`${typeof getGrammarProgress==='function'?getGrammarProgress('genders'):0}%`;
  if(declension)declension.textContent=`${typeof getGrammarProgress==='function'?getGrammarProgress('declension'):0}%`;
  if(typeof renderDriverProgress==='function')renderDriverProgress();
  updateDailyMission();
}

function renderPage(title,bodyHTML,extraClass=''){
  clearGameState();
  showScreen('content-screen');
  content.innerHTML=`<div class="page-heading"><div class="page-eyebrow">ELLENIKA / GREEK</div><h2>${escapeHtml(title)}</h2></div><div class="page-content ${escapeHtml(extraClass)}">${bodyHTML}</div>`;
}

function capitalize(str){
  const value=String(str||'');
  return value.charAt(0).toUpperCase()+value.slice(1);
}

function renderLevelButtons(levels,startFn){
  const descriptions={easy:['EASY','Choose an answer','10 PTS'],medium:['MEDIUM','Recall from memory','15 PTS'],hard:['HARD','Build the form','20 PTS']};
  const icons={easy:'01',medium:'02',hard:'03'};
  return `<style>
    .f1-level-list{display:flex;flex-direction:column;gap:10px;width:100%;max-width:860px;margin:4px auto 24px}
    .f1-level-list .level-tab{position:relative;display:grid;grid-template-columns:54px 1fr auto 28px;align-items:center;gap:16px;width:100%;min-height:76px;margin:0;padding:0 18px 0 0;border:1px solid #30333a;border-radius:2px;background:linear-gradient(100deg,#191b20,#111317);color:#fff;text-align:left;overflow:hidden;cursor:pointer;transition:.18s}
    .f1-level-list .level-tab:before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:#777;transition:.18s}
    .f1-level-list .level-easy:before{background:#31b86b}.f1-level-list .level-medium:before{background:#f0c52b}.f1-level-list .level-hard:before{background:#e10600}
    .f1-level-list .level-tab:hover{background:linear-gradient(100deg,#24272d,#17191e);border-color:#555960;transform:translateX(3px)}
    .f1-level-list .level-number{display:flex;align-items:center;justify-content:center;height:100%;color:#777c85;font:800 10px Arial,sans-serif;letter-spacing:.12em}
    .f1-level-list .level-main{display:flex;flex-direction:column;gap:5px;min-width:0}
    .f1-level-list .level-main b{font:900 19px Arial,sans-serif;font-style:italic;letter-spacing:-.03em;color:#fff}
    .f1-level-list .level-main small{font:700 9px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#858992}
    .f1-level-list .level-tab>strong{color:#d9dbe0;font:900 10px Arial,sans-serif;letter-spacing:.08em;white-space:nowrap}
    .f1-level-list .level-tab>i{color:#777c85;font:900 18px Arial,sans-serif;font-style:normal}
    .f1-level-list .level-easy:hover .level-main b{color:#31b86b}.f1-level-list .level-medium:hover .level-main b{color:#f0c52b}.f1-level-list .level-hard:hover .level-main b{color:#e10600}
    @media(max-width:600px){.f1-level-list{gap:8px}.f1-level-list .level-tab{grid-template-columns:40px 1fr auto 20px;gap:10px;min-height:68px;padding-right:12px}.f1-level-list .level-number{font-size:9px}.f1-level-list .level-main b{font-size:16px}.f1-level-list .level-main small{font-size:8px}.f1-level-list .level-tab>strong{font-size:8px}.f1-level-list .level-tab>i{font-size:15px}}
  </style>
  <div class="practice-selector f1-selector">
    <div class="selector-head"><div><span class="selector-label">RACE MODE</span><p>Select your training intensity</p></div><span class="selector-lights">● ● ●</span></div>
    <div class="f1-level-list">${levels.map(level=>{const item=descriptions[level]||[capitalize(level),'Practice',''];return `<button class="level-tab level-${escapeHtml(level)}" onclick="${escapeHtml(startFn)}('${escapeHtml(level)}')"><span class="level-number">${icons[level]||'00'}</span><span class="level-main"><b>${item[0]}</b><small>${item[1]}</small></span><strong>${item[2]}</strong><i>→</i></button>`;}).join('')}</div>
  </div>`;
}

function registerPracticeAnswer(){
  let count=Number(sessionStorage.getItem('ellenika_practice_count')||0)+1;
  sessionStorage.setItem('ellenika_practice_count',String(count));
}

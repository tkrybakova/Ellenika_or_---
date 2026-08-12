const content = document.getElementById('content');

function clearGameState(){window.currentGame=null;window.currentDeclensionGame=null;window.genderTask=null;}
function showScreen(id){['home-screen','dashboard-screen','content-screen'].forEach(screenId=>{const el=document.getElementById(screenId);if(el)el.classList.toggle('hidden',screenId!==id);});}
function showHome(){showScreen('home-screen');}
function openGreekDashboard(){updateDashboardStats();showScreen('dashboard-screen');if(typeof renderDriverProgress==='function')renderDriverProgress();}
function showLanguageMessage(language){alert(language+' is not available yet.');}
function updateDashboardStats(){
  const vocabulary=document.getElementById('vocabulary-progress');
  const genders=document.getElementById('genders-progress');
  const declension=document.getElementById('declension-progress');
  const learned=dictionary.filter(w=>getWordProgress(w)>=3).length;
  if(vocabulary)vocabulary.textContent=`${learned}/${dictionary.length||0}`;
  if(genders)genders.textContent='50%';
  if(declension)declension.textContent='19%';
  const count=document.getElementById('f1-unlock-count');
  if(count&&typeof getUnlockedDrivers==='function')count.textContent=`${getUnlockedDrivers().length}/${F1_DRIVERS.length}`;
}
function renderPage(title,bodyHTML,extraClass=''){clearGameState();showScreen('content-screen');content.innerHTML=`<div class="page-heading"><div class="page-eyebrow">ELLENIKA / GREEK</div><h2>${title}</h2></div><div class="page-content ${extraClass}">${bodyHTML}</div>`;}
function capitalize(str){return str.charAt(0).toUpperCase()+str.slice(1);}

function renderLevelButtons(levels,startFn){
  const descriptions={easy:['EASY','Choose an answer','10 PTS'],medium:['MEDIUM','Recall from memory','15 PTS'],hard:['HARD','Build the form','20 PTS']};
  const icons={easy:'01',medium:'02',hard:'03'};
  return `<div class="practice-selector f1-selector">
    <div class="selector-head"><div><span class="selector-label">RACE MODE</span><p>Select your training intensity</p></div><span class="selector-lights">● ● ●</span></div>
    <div class="level-tabs">${levels.map(level=>{const item=descriptions[level]||[capitalize(level),'Practice',''];return `<button class="level-tab level-${level}" onclick="${startFn}('${level}')"><span class="level-number">${icons[level]||'00'}</span><span class="level-main"><b>${item[0]}</b><small>${item[1]}</small></span><strong>${item[2]}</strong><i>→</i></button>`;}).join('')}</div>
  </div>`;
}

function registerPracticeAnswer(){
  let count=Number(sessionStorage.getItem('ellenika_practice_count')||0)+1;
  sessionStorage.setItem('ellenika_practice_count',String(count));
  if(count%5===0 && typeof showF1BroadcastMessage==='function') setTimeout(showF1BroadcastMessage,250);
}

document.addEventListener('click',event=>{
  const next=event.target.closest('#next-declension-btn');
  if(next)registerPracticeAnswer();
});

function showResult(text){console.warn('showResult() is deprecated.');content.innerHTML+=`<div class="result-card">${text}</div>`;}

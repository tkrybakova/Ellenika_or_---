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
function renderLevelButtons(levels,startFn){const descriptions={easy:['EASY','Choose an answer'],medium:['MEDIUM','Recall from memory'],hard:['HARD','Build the form']};return `<div class="practice-selector"><div><span class="selector-label">PRACTICE</span><p>Choose how you want to train.</p></div><div class="level-tabs">${levels.map(level=>{const item=descriptions[level]||[capitalize(level),'Practice'];return `<button class="level-tab level-${level}" onclick="${startFn}('${level}')"><span>${item[0]}</span><small>${item[1]}</small></button>`;}).join('')}</div></div>`;}
function showResult(text){console.warn('showResult() is deprecated.');content.innerHTML+=`<div class="result-card">${text}</div>`;}

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

const F1_MOTIVATION_QUOTES={
  'Lewis Hamilton':'Keep pushing. The next lap is always yours to improve.',
  'Fernando Alonso':'Experience matters, but you still have to attack every corner.',
  'Carlos Sainz':'Stay focused. Consistency wins the long race.',
  'Pierre Gasly':'Trust your work. Speed comes from preparation.',
  'George Russell':'Be precise. Small gains become a big result.',
  'Charles Leclerc':'Keep going. One mistake never defines the whole race.',
  'Max Verstappen':'Push the limit, then learn where the limit is.',
  'Lando Norris':'Stay calm, keep learning, and take the next point.',
  'Oscar Piastri':'No rush. Make the right move when it matters.',
  'Kimi Antonelli':'Focus on the task in front of you. Lap by lap.'
};

function registerPracticeAnswer(){
  let count=Number(sessionStorage.getItem('ellenika_practice_count')||0)+1;
  sessionStorage.setItem('ellenika_practice_count',String(count));
  if(count%5===0) setTimeout(showDriverMotivation,250);
}

function showDriverMotivation(){
  const root=document.getElementById('f1-motivation-overlay');
  if(root)root.remove();
  const score=typeof getScore==='function'?getScore():0;
  const unlocked=typeof getUnlockedDrivers==='function'?getUnlockedDrivers():[];
  const pool=unlocked.length?unlocked:F1_DRIVERS.slice(0,3);
  const driver=pool[Math.floor(Math.random()*pool.length)];
  const quote=F1_MOTIVATION_QUOTES[driver.name]||'Keep pushing. The next lap starts now.';
  const overlay=document.createElement('div');
  overlay.id='f1-motivation-overlay';
  overlay.className='f1-motivation-overlay';
  overlay.innerHTML=`<div class="f1-motivation-card" style="--team-accent:${driver.accent}">
    <button class="motivation-close" aria-label="Close" onclick="this.closest('.f1-motivation-overlay').remove()">×</button>
    <div class="motivation-top"><span>RADIO MESSAGE</span><b>✦</b></div>
    <div class="motivation-driver">
      <div class="motivation-helmet"><span>${driver.code[0]}</span><em>#${driver.number}</em></div>
      <div><small>DRIVER</small><h3>${driver.name}</h3><p>${driver.team}</p></div>
    </div>
    <blockquote>“${quote}”</blockquote>
    <div class="motivation-footer"><span>SESSION</span><strong>${countPracticeAnswers()}/5</strong><span>${score.toLocaleString()} PTS</span></div>
  </div>`;
  document.body.appendChild(overlay);
}

function countPracticeAnswers(){return Number(sessionStorage.getItem('ellenika_practice_count')||0)%5||5;}

document.addEventListener('click',event=>{
  const next=event.target.closest('#next-declension-btn');
  if(next)registerPracticeAnswer();
});

function showResult(text){console.warn('showResult() is deprecated.');content.innerHTML+=`<div class="result-card">${text}</div>`;}

function injectF1MotivationStyles(){
  if(document.getElementById('f1-motivation-style'))return;
  const s=document.createElement('style');s.id='f1-motivation-style';s.textContent=`
  .f1-selector{position:relative;overflow:hidden;background:#111318;border:1px solid #30343b;border-radius:16px;padding:18px;box-shadow:0 16px 45px rgba(0,0,0,.22)}
  .f1-selector:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:#e10600}
  .selector-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.selector-head p{margin:4px 0 0;color:#777c85;font-size:12px}.selector-lights{color:#e10600;font-size:8px;letter-spacing:4px}
  .level-tabs{display:grid;grid-template-columns:1fr;gap:8px}.f1-selector .level-tab{position:relative;display:flex;align-items:center;gap:13px;min-height:72px;width:100%;padding:10px 13px;background:#191b20;border:1px solid #333740;border-radius:10px;color:#fff;text-align:left;cursor:pointer;overflow:hidden;transition:.16s ease}
  .f1-selector .level-tab:before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#5d626b}.f1-selector .level-tab:hover{transform:translateX(3px);border-color:#e10600;background:#1d1f25}.f1-selector .level-easy:before{background:#31b56b}.f1-selector .level-medium:before{background:#f0b429}.f1-selector .level-hard:before{background:#e10600}
  .level-number{font:900 11px var(--mono);color:#777c85;width:24px}.level-main{display:flex;flex-direction:column;gap:3px;flex:1}.level-main b{font:900 18px Arial;font-style:italic;letter-spacing:.02em}.level-main small{color:#858992;font:700 9px var(--mono);text-transform:uppercase;letter-spacing:.08em}.f1-selector .level-tab>strong{font:900 10px var(--mono);color:#e10600}.f1-selector .level-tab i{font-style:normal;font-size:20px;color:#686d76}
  .f1-motivation-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(5,6,8,.76);backdrop-filter:blur(7px);animation:f1fade .18s ease}.f1-motivation-card{position:relative;width:min(440px,100%);background:#111318;border:1px solid #353941;border-radius:16px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,.55)}.f1-motivation-card:before{content:'';display:block;height:4px;background:linear-gradient(90deg,#e10600 0 35%,#fff 35% 40%,#111 40% 100%)}.motivation-close{position:absolute;right:12px;top:14px;width:32px;height:32px;border:1px solid #3b3f47;border-radius:50%;background:#191b20;color:#fff;font-size:20px;cursor:pointer}.motivation-top{display:flex;justify-content:space-between;padding:16px 18px 7px;color:#e10600;font:800 9px var(--mono);letter-spacing:.14em}.motivation-top b{font-size:14px}.motivation-driver{display:flex;align-items:center;gap:15px;padding:10px 20px 4px}.motivation-helmet{position:relative;width:72px;height:72px;flex:none;border-radius:50%;background:radial-gradient(circle at 40% 32%,#4b5059,#191b20 65%);border:2px solid var(--team-accent);display:grid;place-items:center;box-shadow:0 0 0 5px rgba(255,255,255,.025)}.motivation-helmet span{font:900 25px Arial;color:#fff;font-style:italic}.motivation-helmet em{position:absolute;right:-7px;bottom:1px;background:var(--team-accent);color:#fff;border-radius:4px;padding:3px 5px;font:900 8px var(--mono);font-style:normal}.motivation-driver small{color:#777c85;font:800 8px var(--mono);letter-spacing:.12em}.motivation-driver h3{margin:3px 0;font:900 23px Arial;font-style:italic}.motivation-driver p{margin:0;color:#858992;font:700 9px var(--mono);text-transform:uppercase}.f1-motivation-card blockquote{margin:18px 20px;padding:17px 16px;border-left:3px solid var(--team-accent);background:#191b20;color:#f3f3f3;font:700 17px/1.45 Arial}.motivation-footer{display:flex;gap:15px;align-items:center;padding:12px 20px 17px;border-top:1px solid #292c32;color:#6f747d;font:800 8px var(--mono)}.motivation-footer strong{color:#fff}.motivation-footer span:last-child{margin-left:auto;color:#e10600}
  @keyframes f1fade{from{opacity:0}to{opacity:1}}
  @media(max-width:650px){.f1-selector{padding:14px}.f1-selector .level-tab{min-height:68px}.level-main b{font-size:16px}.f1-motivation-card blockquote{font-size:16px}.motivation-driver h3{font-size:20px}}
  `;document.head.appendChild(s);
}

injectF1MotivationStyles();

const F1_DRIVERS = [
  { name:'Lando Norris', number:1, team:'McLaren', unlock:100, code:'NOR', phrase:'Keep pushing. The next lap can always be better.' },
  { name:'Oscar Piastri', number:81, team:'McLaren', unlock:250, code:'PIA', phrase:'Stay calm, stay sharp. One answer at a time.' },
  { name:'Max Verstappen', number:3, team:'Red Bull', unlock:500, code:'VER', phrase:'No excuses. Focus on the next corner.' },
  { name:'Charles Leclerc', number:16, team:'Ferrari', unlock:1000, code:'LEC', phrase:'Trust the work. You are getting faster.' },
  { name:'Lewis Hamilton', number:44, team:'Ferrari', unlock:1500, code:'HAM', phrase:'Keep the pressure on. Consistency wins.' },
  { name:'George Russell', number:63, team:'Mercedes', unlock:2000, code:'RUS', phrase:'Precision first. The pace will follow.' },
  { name:'Kimi Antonelli', number:12, team:'Mercedes', unlock:3000, code:'ANT', phrase:'Stay aggressive, but stay clean.' },
  { name:'Fernando Alonso', number:14, team:'Aston Martin', unlock:4000, code:'ALO', phrase:'Experience is knowing when to attack.' },
  { name:'Carlos Sainz', number:55, team:'Williams', unlock:5000, code:'SAI', phrase:'Build the lap. Then build the next one.' },
  { name:'Alex Albon', number:23, team:'Williams', unlock:6500, code:'ALB', phrase:'Good progress. Keep your rhythm.' },
  { name:'Pierre Gasly', number:10, team:'Alpine', unlock:8000, code:'GAS', phrase:'Believe in the pace you have earned.' },
  { name:'Franco Colapinto', number:43, team:'Alpine', unlock:10000, code:'COL', phrase:'Commit to the answer and move on.' },
  { name:'Oliver Bearman', number:87, team:'Haas', unlock:12500, code:'BEA', phrase:'Every lap is another chance to improve.' },
  { name:'Esteban Ocon', number:31, team:'Haas', unlock:15000, code:'OCO', phrase:'Stay patient. The result is coming.' },
  { name:'Nico Hulkenberg', number:27, team:'Audi', unlock:17500, code:'HUL', phrase:'Smart work beats rushed work.' },
  { name:'Gabriel Bortoleto', number:5, team:'Audi', unlock:20000, code:'BOR', phrase:'Keep learning. Keep moving forward.' },
  { name:'Sergio Perez', number:11, team:'Cadillac', unlock:25000, code:'PER', phrase:'Find your line and commit to it.' },
  { name:'Valtteri Bottas', number:77, team:'Cadillac', unlock:30000, code:'BOT', phrase:'Smooth and focused. That is the pace.' },
  { name:'Liam Lawson', number:30, team:'Racing Bulls', unlock:40000, code:'LAW', phrase:'Reset, refocus, go again.' },
  { name:'Arvid Lindblad', number:41, team:'Racing Bulls', unlock:50000, code:'LIN', phrase:'Keep your eyes on the next target.' },
  { name:'Isack Hadjar', number:6, team:'Red Bull', unlock:65000, code:'HAD', phrase:'Push through the difficult laps.' },
  { name:'Fernando Alonso — Legend', number:14, team:'Aston Martin', unlock:80000, code:'LEG', phrase:'Champions keep going when the lap gets hard.' }
];

function getUnlockedDrivers(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  return F1_DRIVERS.filter(driver => score >= driver.unlock);
}

function renderDriverProgress(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  const next = F1_DRIVERS.find(driver => score < driver.unlock);
  const unlocked = getUnlockedDrivers().length;
  const root = document.getElementById('f1-driver-progress');
  if(!root) return;
  root.innerHTML = `
    <div class="f1-progress-head">
      <div><span class="f1-kicker">DRIVER UNLOCKS</span><h3>YOUR F1 GRID</h3></div>
      <strong>${unlocked}/${F1_DRIVERS.length}</strong>
    </div>
    <div class="f1-progress-line"><span style="width:${Math.min(100,(score/(next?.unlock||score||1))*100)}%"></span></div>
    <div class="f1-next">${next ? `${next.unlock - score} pts to unlock <b>${next.name}</b>` : 'FULL GRID UNLOCKED'}</div>
    <div class="f1-driver-grid">${F1_DRIVERS.map(driver => {
      const open = score >= driver.unlock;
      return `<div class="f1-driver-card ${open?'unlocked':'locked'}">
        <div class="driver-avatar">${open ? driver.code : '🔒'}</div>
        <div class="driver-number">#${driver.number}</div>
        <div class="driver-name">${driver.name}</div>
        <div class="driver-team">${driver.team}</div>
        ${open ? '<span class="driver-status">UNLOCKED</span>' : `<span class="driver-status">${driver.unlock} PTS</span>`}
      </div>`;
    }).join('')}</div>`;
}

function showF1BroadcastMessage(){
  const drivers = getUnlockedDrivers();
  if(!drivers.length) return;
  const driver = drivers[Math.floor(Math.random()*drivers.length)];
  const root = document.getElementById('f1-broadcast');
  if(!root) return;
  root.innerHTML = `
    <div class="f1-broadcast-accent"></div>
    <div class="f1-broadcast-header"><span>F1 LIVE</span><span>TEAM RADIO</span></div>
    <div class="f1-broadcast-body">
      <div class="broadcast-avatar">${driver.code}</div>
      <div class="broadcast-copy">
        <div class="broadcast-driver"><b>${driver.name}</b><span>#${driver.number}</span></div>
        <div class="broadcast-team">${driver.team}</div>
        <p>“${driver.phrase}”</p>
      </div>
    </div>
  `;
  root.classList.remove('hidden');
  requestAnimationFrame(()=>root.classList.add('show'));
  clearTimeout(window.f1BroadcastTimeout);
  window.f1BroadcastTimeout=setTimeout(()=>{
    root.classList.remove('show');
    setTimeout(()=>root.classList.add('hidden'),350);
  },6000);
}

function openF1Drivers(){
  renderPage('F1 / DRIVERS', '<div id="f1-driver-progress"></div>', 'f1-page');
  renderDriverProgress();
}

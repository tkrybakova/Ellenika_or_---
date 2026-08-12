const F1_DRIVERS = [
  { name:'Lando Norris', number:1, team:'McLaren', unlock:100, code:'NOR' },
  { name:'Oscar Piastri', number:81, team:'McLaren', unlock:250, code:'PIA' },
  { name:'Max Verstappen', number:3, team:'Red Bull', unlock:500, code:'VER' },
  { name:'Charles Leclerc', number:16, team:'Ferrari', unlock:1000, code:'LEC' },
  { name:'Lewis Hamilton', number:44, team:'Ferrari', unlock:1500, code:'HAM' },
  { name:'George Russell', number:63, team:'Mercedes', unlock:2000, code:'RUS' },
  { name:'Kimi Antonelli', number:12, team:'Mercedes', unlock:3000, code:'ANT' },
  { name:'Fernando Alonso', number:14, team:'Aston Martin', unlock:4000, code:'ALO' },
  { name:'Carlos Sainz', number:55, team:'Williams', unlock:5000, code:'SAI' },
  { name:'Alex Albon', number:23, team:'Williams', unlock:6500, code:'ALB' },
  { name:'Pierre Gasly', number:10, team:'Alpine', unlock:8000, code:'GAS' },
  { name:'Franco Colapinto', number:43, team:'Alpine', unlock:10000, code:'COL' },
  { name:'Oliver Bearman', number:87, team:'Haas', unlock:12500, code:'BEA' },
  { name:'Esteban Ocon', number:31, team:'Haas', unlock:15000, code:'OCO' },
  { name:'Nico Hulkenberg', number:27, team:'Audi', unlock:17500, code:'HUL' },
  { name:'Gabriel Bortoleto', number:5, team:'Audi', unlock:20000, code:'BOR' },
  { name:'Sergio Perez', number:11, team:'Cadillac', unlock:25000, code:'PER' },
  { name:'Valtteri Bottas', number:77, team:'Cadillac', unlock:30000, code:'BOT' },
  { name:'Liam Lawson', number:30, team:'Racing Bulls', unlock:40000, code:'LAW' },
  { name:'Arvid Lindblad', number:41, team:'Racing Bulls', unlock:50000, code:'LIN' },
  { name:'Isack Hadjar', number:6, team:'Red Bull', unlock:65000, code:'HAD' },
  { name:'Fernando Alonso — Legend', number:14, team:'Aston Martin', unlock:80000, code:'LEG' }
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

function openF1Drivers(){
  renderPage('F1 / DRIVERS', '<div id="f1-driver-progress"></div>', 'f1-page');
  renderDriverProgress();
}

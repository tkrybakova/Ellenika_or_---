const F1_DRIVERS = [
  { name:'Lewis Hamilton', number:44, team:'Ferrari', unlock:100, code:'HAM', accent:'#e10600' },
  { name:'Fernando Alonso', number:14, team:'Aston Martin', unlock:140, code:'ALO', accent:'#229971' },
  { name:'Carlos Sainz', number:55, team:'Williams', unlock:550, code:'SAI', accent:'#64c4ff' },
  { name:'Pierre Gasly', number:10, team:'Alpine', unlock:1000, code:'GAS', accent:'#2293d1' },
  { name:'Sergio Perez', number:11, team:'Cadillac', unlock:1100, code:'PER', accent:'#d0d0d0' },
  { name:'Alex Albon', number:23, team:'Williams', unlock:2300, code:'ALB', accent:'#64c4ff' },
  { name:'Nico Hulkenberg', number:27, team:'Audi', unlock:2700, code:'HUL', accent:'#c92d4b' },
  { name:'Liam Lawson', number:30, team:'Racing Bulls', unlock:3000, code:'LAW', accent:'#6692ff' },
  { name:'Esteban Ocon', number:31, team:'Haas', unlock:3100, code:'OCO', accent:'#b6babd' },
  { name:'Arvid Lindblad', number:41, team:'Racing Bulls', unlock:4100, code:'LIN', accent:'#6692ff' },
  { name:'Franco Colapinto', number:43, team:'Alpine', unlock:4300, code:'COL', accent:'#2293d1' },
  { name:'Gabriel Bortoleto', number:5, team:'Audi', unlock:5000, code:'BOR', accent:'#c92d4b' },
  { name:'Isack Hadjar', number:6, team:'Red Bull', unlock:6000, code:'HAD', accent:'#3671c6' },
  { name:'George Russell', number:63, team:'Mercedes', unlock:6300, code:'RUS', accent:'#00a19c' },
  { name:'Valtteri Bottas', number:77, team:'Cadillac', unlock:7700, code:'BOT', accent:'#d0d0d0' },
  { name:'Oscar Piastri', number:81, team:'McLaren', unlock:8100, code:'PIA', accent:'#ff8700' },
  { name:'Oliver Bearman', number:87, team:'Haas', unlock:8700, code:'BEA', accent:'#b6babd' },
  { name:'Lando Norris', number:1, team:'McLaren', unlock:10000, code:'NOR', accent:'#ff8700' },
  { name:'Kimi Antonelli', number:12, team:'Mercedes', unlock:12000, code:'ANT', accent:'#00a19c' },
  { name:'Charles Leclerc', number:16, team:'Ferrari', unlock:16000, code:'LEC', accent:'#e10600' },
  { name:'Yuki Tsunoda — Legend', number:22, team:'Red Bull', unlock:22000, code:'LEG', accent:'#1a1fba' },
  { name:'Max Verstappen', number:3, team:'Red Bull', unlock:30000, code:'VER', accent:'#3671c6' }

];

function getUnlockedDrivers(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  return F1_DRIVERS.filter(driver => score >= driver.unlock);
}

function driverVisual(driver, open){
  if(!open) return `<div class="driver-portrait locked-portrait"><span>?</span><small>LOCKED</small></div>`;
  return `<div class="driver-portrait" style="--team-accent:${driver.accent}">
    <div class="helmet"><span>${driver.code[0]}</span></div>
    <div class="portrait-initials">${driver.code}</div>
  </div>`;
}

function driverCard(driver, score){
  const open = score >= driver.unlock;
  return `<article class="f1-driver-card ${open?'unlocked':'locked'}" style="--team-accent:${driver.accent}">
    ${driverVisual(driver, open)}
    <div class="driver-number">#${driver.number}</div>
    <div class="driver-meta">
      <div class="driver-name">${driver.name}</div>
      <div class="driver-team"><i></i>${driver.team}</div>
      <span class="driver-status">${open ? '✓ UNLOCKED' : `${driver.unlock.toLocaleString()} PTS`}</span>
    </div>
  </article>`;
}

function renderDriverProgress(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  const next = F1_DRIVERS.find(driver => score < driver.unlock);
  const unlocked = getUnlockedDrivers().length;
  const root = document.getElementById('f1-driver-progress');
  if(!root) return;
  const progress = next ? Math.max(0, Math.min(100, ((score - (F1_DRIVERS[F1_DRIVERS.indexOf(next)-1]?.unlock || 0)) / (next.unlock - (F1_DRIVERS[F1_DRIVERS.indexOf(next)-1]?.unlock || 0))) * 100)) : 100;
  root.innerHTML = `
    <div class="f1-progress-head">
      <div><span class="f1-kicker">DRIVER UNLOCKS</span><h3>YOUR F1 GRID</h3></div>
      <strong>${unlocked}/${F1_DRIVERS.length}</strong>
    </div>
    <div class="f1-progress-line"><span style="width:${progress}%"></span></div>
    <div class="f1-next">${next ? `${(next.unlock-score).toLocaleString()} PTS TO UNLOCK · <b>${next.name}</b>` : 'FULL GRID UNLOCKED'}</div>
    <div class="f1-driver-grid">${F1_DRIVERS.map(driver => driverCard(driver, score)).join('')}</div>`;
}

function renderDashboardDriverShowcase(){
  const root = document.getElementById('f1-driver-progress');
  if(!root) return;
  const score = typeof getScore === 'function' ? getScore() : 0;
  const unlocked = getUnlockedDrivers();
  const visible = unlocked.length ? unlocked.slice(-3).reverse() : F1_DRIVERS.slice(0,3);
  root.innerHTML = `<div class="dashboard-driver-header"><div><span class="f1-kicker">F1 DRIVER ACADEMY</span><h3>YOUR GARAGE</h3></div><button class="garage-button" onclick="openF1Drivers()">VIEW GRID →</button></div><div class="dashboard-driver-strip">${visible.map(driver => driverCard(driver, score)).join('')}</div>`;
}

function openF1Drivers(){
  renderPage('F1 / DRIVERS', '<div id="f1-driver-progress"></div>', 'f1-page');
  renderDriverProgress();
}

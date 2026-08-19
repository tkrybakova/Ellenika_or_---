const F1_DRIVERS = [
  { name:'Lando Norris', number:1, team:'McLaren', unlock:100, code:'NOR', accent:'#ff8700', phrase:'Keep pushing. The next lap can always be better.' },
  { name:'Oscar Piastri', number:81, team:'McLaren', unlock:250, code:'PIA', accent:'#ff8700', phrase:'Stay calm, stay sharp. One answer at a time.' },
  { name:'Max Verstappen', number:3, team:'Red Bull', unlock:500, code:'VER', accent:'#3671c6', phrase:'No excuses. Focus on the next corner.' },
  { name:'Charles Leclerc', number:16, team:'Ferrari', unlock:1000, code:'LEC', accent:'#e10600', phrase:'Trust the work. You are getting faster.' },
  { name:'Lewis Hamilton', number:44, team:'Ferrari', unlock:1500, code:'HAM', accent:'#e10600', phrase:'Keep the pressure on. Consistency wins.' },
  { name:'George Russell', number:63, team:'Mercedes', unlock:2000, code:'RUS', accent:'#00a19c', phrase:'Precision first. The pace will follow.' },
  { name:'Kimi Antonelli', number:12, team:'Mercedes', unlock:3000, code:'ANT', accent:'#00a19c', phrase:'Stay aggressive, but stay clean.' },
  { name:'Fernando Alonso', number:14, team:'Aston Martin', unlock:4000, code:'ALO', accent:'#229971', phrase:'Experience is knowing when to attack.' },
  { name:'Carlos Sainz', number:55, team:'Williams', unlock:5000, code:'SAI', accent:'#64c4ff', phrase:'Build the lap. Then build the next one.' },
  { name:'Alex Albon', number:23, team:'Williams', unlock:6500, code:'ALB', accent:'#64c4ff', phrase:'Good progress. Keep your rhythm.' },
  { name:'Pierre Gasly', number:10, team:'Alpine', unlock:8000, code:'GAS', accent:'#2293d1', phrase:'Believe in the pace you have earned.' },
  { name:'Franco Colapinto', number:43, team:'Alpine', unlock:10000, code:'COL', accent:'#2293d1', phrase:'Commit to the answer and move on.' },
  { name:'Oliver Bearman', number:87, team:'Haas', unlock:12500, code:'BEA', accent:'#b6babd', phrase:'Every lap is another chance to improve.' },
  { name:'Esteban Ocon', number:31, team:'Haas', unlock:15000, code:'OCO', accent:'#b6babd', phrase:'Stay patient. The result is coming.' },
  { name:'Nico Hulkenberg', number:27, team:'Audi', unlock:17500, code:'HUL', accent:'#c92d4b', phrase:'Smart work beats rushed work.' },
  { name:'Gabriel Bortoleto', number:5, team:'Audi', unlock:20000, code:'BOR', accent:'#c92d4b', phrase:'Keep learning. Keep moving forward.' },
  { name:'Sergio Perez', number:11, team:'Cadillac', unlock:25000, code:'PER', accent:'#d0d0d0', phrase:'Find your line and commit to it.' },
  { name:'Valtteri Bottas', number:77, team:'Cadillac', unlock:30000, code:'BOT', accent:'#d0d0d0', phrase:'Smooth and focused. That is the pace.' },
  { name:'Liam Lawson', number:30, team:'Racing Bulls', unlock:40000, code:'LAW', accent:'#6692ff', phrase:'Reset, refocus, go again.' },
  { name:'Arvid Lindblad', number:41, team:'Racing Bulls', unlock:50000, code:'LIN', accent:'#6692ff', phrase:'Keep your eyes on the next target.' },
  { name:'Isack Hadjar', number:6, team:'Red Bull', unlock:65000, code:'HAD', accent:'#3671c6', phrase:'Push through the difficult laps.' },
  { name:'Fernando Alonso — Legend', number:14, team:'Aston Martin', unlock:80000, code:'LEG', accent:'#229971', phrase:'Champions keep going when the lap gets hard.' }
];

function getUnlockedDrivers(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  return F1_DRIVERS.filter(driver => score >= driver.unlock);
}

function renderDriverProgress(){
  const root = document.getElementById('f1-driver-progress');
  if(!root) return;
  const score = typeof getScore === 'function' ? getScore() : 0;
  const next = F1_DRIVERS.find(driver => score < driver.unlock);
  const unlocked = getUnlockedDrivers().length;
  const nextGap = next ? Math.max(0,next.unlock-score) : 0;
  const previousUnlock = next ? (F1_DRIVERS[F1_DRIVERS.indexOf(next)-1]?.unlock || 0) : 0;
  const progress = next ? Math.max(0,Math.min(100,((score-previousUnlock)/(next.unlock-previousUnlock))*100)) : 100;

  root.innerHTML = `
    <style>
      .f1-grid-progress{margin-top:26px;padding:18px;background:linear-gradient(135deg,#15171b,#0d0f12);border:1px solid #30333a;border-radius:3px;color:#fff}
      .f1-grid-progress .f1-progress-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}
      .f1-grid-progress .f1-kicker{display:block;color:#858992;font:800 9px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}
      .f1-grid-progress h3{margin:4px 0 0;font:900 italic 22px Arial,sans-serif;letter-spacing:-.04em}
      .f1-grid-progress .f1-count{font:900 20px Arial,sans-serif}
      .f1-grid-progress .f1-progress-line{height:5px;background:#292c32;overflow:hidden;margin-bottom:9px}
      .f1-grid-progress .f1-progress-line span{display:block;height:100%;background:#e10600;transition:width .3s ease}
      .f1-grid-progress .f1-next{font:700 10px Arial,sans-serif;color:#858992;letter-spacing:.04em;margin-bottom:15px}
      .f1-grid-progress .f1-next b{color:#fff}
      .f1-driver-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
      .f1-driver-card{position:relative;min-width:0;min-height:112px;padding:11px;background:#191b20;border:1px solid #30333a;overflow:hidden}
      .f1-driver-card:before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#555}
      .f1-driver-card.unlocked:before{background:#31b86b}
      .f1-driver-card.locked{opacity:.48}
      .driver-avatar{font:900 13px Arial,sans-serif;color:#fff;margin-bottom:7px}
      .driver-number{position:absolute;right:9px;top:8px;color:#777c85;font:900 11px Arial,sans-serif}
      .driver-name{font:900 12px Arial,sans-serif;line-height:1.15;padding-right:22px}
      .driver-team{margin-top:4px;color:#858992;font:700 8px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .driver-status{display:inline-block;margin-top:9px;color:#777c85;font:800 7px Arial,sans-serif;letter-spacing:.1em}
      .unlocked .driver-status{color:#31b86b}
      @media(max-width:900px){.f1-driver-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:600px){.f1-grid-progress{margin-top:18px;padding:13px}.f1-grid-progress h3{font-size:18px}.f1-grid-progress .f1-count{font-size:16px}.f1-driver-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.f1-driver-card{min-height:96px;padding:9px}.driver-name{font-size:11px}.driver-team{font-size:7px}.driver-status{font-size:6px}}
    </style>
    <div class="f1-grid-progress">
      <div class="f1-progress-head">
        <div><span class="f1-kicker">DRIVER UNLOCKS</span><h3>YOUR F1 GRID</h3></div>
        <strong class="f1-count">${unlocked}/${F1_DRIVERS.length}</strong>
      </div>
      <div class="f1-progress-line"><span style="width:${progress}%"></span></div>
      <div class="f1-next">${next ? `${nextGap} PTS TO UNLOCK <b>${next.name}</b>` : 'FULL GRID UNLOCKED'}</div>
      <div class="f1-driver-grid">${F1_DRIVERS.map(driver => {
        const open = score >= driver.unlock;
        return `<div class="f1-driver-card ${open?'unlocked':'locked'}">
          <div class="driver-avatar">${open ? driver.code : '🔒'}</div>
          <div class="driver-number">#${driver.number}</div>
          <div class="driver-name">${driver.name}</div>
          <div class="driver-team">${driver.team}</div>
          <span class="driver-status">${open ? 'UNLOCKED' : `${driver.unlock} PTS`}</span>
        </div>`;
      }).join('')}</div>
    </div>`;
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

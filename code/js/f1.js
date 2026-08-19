const F1_DRIVERS = [
  { name:'Lewis Hamilton', number:44, team:'Ferrari', unlock:100, code:'HAM', accent:'#e10600', phrase:'Keep the pressure on. Consistency wins.' },
  { name:'Fernando Alonso', number:14, team:'Aston Martin', unlock:140, code:'ALO', accent:'#229971', phrase:'Experience is knowing when to attack.' },
  { name:'Carlos Sainz', number:55, team:'Williams', unlock:550, code:'SAI', accent:'#64c4ff', phrase:'Build the lap. Then build the next one.' },
  { name:'Pierre Gasly', number:10, team:'Alpine', unlock:1000, code:'GAS', accent:'#2293d1', phrase:'Believe in the pace you have earned.' },
  { name:'Sergio Perez', number:11, team:'Cadillac', unlock:1100, code:'PER', accent:'#d0d0d0', phrase:'Find your line and commit to it.' },
  { name:'Alex Albon', number:23, team:'Williams', unlock:2300, code:'ALB', accent:'#64c4ff', phrase:'Good progress. Keep your rhythm.' },
  { name:'Nico Hulkenberg', number:27, team:'Audi', unlock:2700, code:'HUL', accent:'#c92d4b', phrase:'Smart work beats rushed work.' },
  { name:'Liam Lawson', number:30, team:'Racing Bulls', unlock:3000, code:'LAW', accent:'#6692ff', phrase:'Reset, refocus, go again.' },
  { name:'Esteban Ocon', number:31, team:'Haas', unlock:3100, code:'OCO', accent:'#b6babd', phrase:'Stay patient. The result is coming.' },
  { name:'Arvid Lindblad', number:41, team:'Racing Bulls', unlock:4100, code:'LIN', accent:'#6692ff', phrase:'Keep your eyes on the next target.' },
  { name:'Franco Colapinto', number:43, team:'Alpine', unlock:4300, code:'COL', accent:'#2293d1', phrase:'Commit to the answer and move on.' },
  { name:'Gabriel Bortoleto', number:5, team:'Audi', unlock:5000, code:'BOR', accent:'#c92d4b', phrase:'Keep learning. Keep moving forward.' },
  { name:'Isack Hadjar', number:6, team:'Red Bull', unlock:6000, code:'HAD', accent:'#3671c6', phrase:'Push through the difficult laps.' },
  { name:'George Russell', number:63, team:'Mercedes', unlock:6300, code:'RUS', accent:'#00a19c', phrase:'Precision first. The pace will follow.' },
  { name:'Valtteri Bottas', number:77, team:'Cadillac', unlock:7700, code:'BOT', accent:'#d0d0d0', phrase:'Smooth and focused. That is the pace.' },
  { name:'Oscar Piastri', number:81, team:'McLaren', unlock:8100, code:'PIA', accent:'#ff8700', phrase:'Stay calm, stay sharp. One answer at a time.' },
  { name:'Oliver Bearman', number:87, team:'Haas', unlock:8700, code:'BEA', accent:'#b6babd', phrase:'Every lap is another chance to improve.' },
  { name:'Lando Norris', number:1, team:'McLaren', unlock:10000, code:'NOR', accent:'#ff8700', phrase:'Keep pushing. The next lap can always be better.' },
  { name:'Kimi Antonelli', number:12, team:'Mercedes', unlock:12000, code:'ANT', accent:'#00a19c', phrase:'Stay aggressive, but stay clean.' },
  { name:'Charles Leclerc', number:16, team:'Ferrari', unlock:16000, code:'LEC', accent:'#e10600', phrase:'Trust the work. You are getting faster.' },
  { name:'Yuki Tsunoda — Legend', number:22, team:'Red Bull', unlock:22000, code:'LEG', accent:'#1a1fba', phrase:'Champions keep going when the lap gets hard.' },
  { name:'Max Verstappen', number:3, team:'Red Bull', unlock:30000, code:'VER', accent:'#3671c6', phrase:'No excuses. Focus on the next corner.' }
];

function getUnlockedDrivers(){
  const score = typeof getScore === 'function' ? getScore() : 0;
  return F1_DRIVERS.filter(driver => score >= driver.unlock);
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

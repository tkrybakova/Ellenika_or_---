// Compatibility fixes for vocabulary practice and Personal Pronouns hints.
(function(){
  function practiceWords(){
    const source=Array.isArray(window.dictionary)?window.dictionary:(typeof dictionary!=='undefined'&&Array.isArray(dictionary)?dictionary:[]);
    return source.filter(w=>w&&String(w.greek??w.word??w.term??'').trim()).map(w=>({...w,greek:String(w.greek??w.word??w.term??'').trim(),english:String(w.english??w.translation??'').trim(),russian:String(w.russian??'').trim(),article:String(w.article??w.definiteArticle??'').trim(),gender:String(w.gender??w.genus??'').trim().toLowerCase(),plural:String(w.plural??w.pluralForm??'').trim(),pluralArticle:String(w.pluralArticle??w.plural_article??'').trim()}));
  }

  window.startGender=function(level='easy'){
    if(typeof genderTimer!=='undefined')clearInterval(genderTimer);
    const words=practiceWords();
    if(!words.length){renderPage('GENDERS',emptyState('No usable vocabulary','The dictionary is loaded, but no word with a Greek form was found.'),'practice-page');return;}
    currentGame=createGenderGame(words[Math.floor(Math.random()*words.length)]);currentGame.render(level);
  };

  window.startDeclension=function(level='easy'){
    const words=practiceWords();
    if(!words.length){renderPage('DECLENSION',emptyState('No usable vocabulary','The dictionary is loaded, but no word with a Greek form was found.'),'practice-page');return;}
    currentDeclensionGame=createDeclensionGame(words[Math.floor(Math.random()*words.length)]);currentDeclensionGame.render(level);
  };

  window.getPracticeVocabulary=practiceWords;

  function plainPronounHint(html){
    if(!html)return '';
    return String(html)
      .replace(/<button[^>]*class=["']pronoun-audio["'][^>]*>([\s\S]*?)<\/button>/gi,'$1')
      .replace(/\s*🔊\s*/g,' ')
      .replace(/onclick=["'][^"']*["']/gi,'');
  }

  function syncPersonalHints(){
    if(typeof PRONOUN_SECTIONS==='undefined')return;
    const personal=PRONOUN_SECTIONS.find(s=>s.id==='personal');
    if(!personal)return;
    personal.hintEasy=plainPronounHint(personal.hintEasy);
    personal.hintHard=plainPronounHint(personal.hintHard);
  }

  // Pronouns use the same clean page structure as Genders/Declension.
  // renderPage supplies the page heading, so do not duplicate it here.
  window.renderPronounSections=function(){
    return `<div class="pronouns-page"><div class="pronoun-section-list">${PRONOUN_SECTIONS.map((s,i)=>`<button class="pronoun-section-row" onclick="openPronounSection('${s.id}')"><span class="pronoun-number">${String(i+1).padStart(2,'0')}</span><span class="pronoun-section-main"><b>${s.title}</b><small>${s.greek}</small></span><span class="pronoun-section-modes">EASY · HARD</span><i>→</i></button>`).join('')}</div></div>`;
  };

  window.renderPronounModes=function(){
    const s=pronounSection;
    if(!s)return '';
    return `<div class="pronouns-page pronoun-level-page"><div class="pronoun-section-breadcrumb">PRONOUNS / ${s.title}</div>${renderLevelButtons(['easy','hard'],'startPronoun')}</div>`;
  };

  function installPronounHintStyles(){
    if(document.getElementById('pronoun-gender-hint-style'))return;
    const style=document.createElement('style');
    style.id='pronoun-gender-hint-style';
    style.textContent=`
      .pronoun-hint-wrap{margin:0 18px 20px!important;position:relative!important}
      .pronoun-hint-wrap .pronoun-hint-btn{width:44px!important;height:44px!important;margin:0!important;padding:0!important;border-radius:50%!important;background:#1b1d22!important;border:1px solid #464951!important;color:#fff!important;font:900 18px Arial!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
      .pronoun-hint-wrap .pronoun-hint-btn:hover{background:#e10600!important;border-color:#e10600!important}
      .pronoun-hint-inline{background:#15171b!important;border:1px solid #35383f!important;border-radius:12px!important;color:#ddd!important;box-shadow:0 15px 35px #000!important;overflow-x:auto!important;margin-top:10px!important;padding:14px!important}
      .pronoun-hint-inline h4{margin:0 0 10px!important;color:#e10600!important;font:800 10px var(--mono)!important;letter-spacing:.14em!important;text-transform:uppercase!important}
      .pronoun-hint-inline table{width:100%!important;border-collapse:collapse!important;color:#ddd!important;font-size:12px!important;text-align:center!important}
      .pronoun-hint-inline th{background:#202329!important;color:#e10600!important;font-weight:800!important}
      .pronoun-hint-inline td,.pronoun-hint-inline th{border:1px solid #30333a!important;padding:9px 8px!important}
      .pronoun-hint-inline .hint-note{color:#777c85!important;font-size:11px!important;margin:10px 0 0!important}
      @media(max-width:650px){.pronoun-hint-wrap{margin:0 14px 18px!important}.pronoun-hint-inline{font-size:11px!important}.pronoun-hint-inline table{min-width:460px!important}}
    `;
    document.head.appendChild(style);
  }

  function installInlinePronounHints(){
    installPronounHintStyles();
    document.querySelectorAll('.pronoun-exercise .pronoun-hint-btn').forEach(btn=>{
      if(btn.closest('.pronoun-hint-wrap'))return;
      const wrap=document.createElement('div');
      wrap.className='pronoun-hint-wrap';
      btn.parentNode.insertBefore(wrap,btn);
      wrap.appendChild(btn);

      const type=btn.getAttribute('onclick')?.match(/openPronounHint\('([^']+)'\)/)?.[1]||'easy';
      const raw=type==='easy'?pronounSection?.hintEasy:pronounSection?.hintHard;
      const panel=document.createElement('div');
      panel.className='pronoun-hint-inline';
      panel.hidden=true;
      panel.innerHTML=plainPronounHint(raw||'');
      wrap.appendChild(panel);

      btn.removeAttribute('onclick');
      btn.addEventListener('click',()=>{
        const isOpen=!panel.hidden;
        panel.hidden=isOpen;
      });
    });
  }

  // renderPronounExercise writes the hint button into #content. Observe that
  // area so the hint is immediately converted to the same inline block used by Genders.
  function watchPronounHints(){
    const content=document.getElementById('content');
    if(!content)return;
    const apply=()=>installInlinePronounHints();
    new MutationObserver(apply).observe(content,{childList:true,subtree:true});
    apply();
  }

  syncPersonalHints();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchPronounHints);else watchPronounHints();
})();

// Final UI compatibility layer.
// Keeps GENDERS/DECLENSION vocabulary compatibility and polishes PRONOUNS.
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
    return String(html).replace(/<button[^>]*class=["']pronoun-audio["'][^>]*>([\s\S]*?)<\/button>/gi,'$1');
  }

  function syncPersonalHints(){
    if(typeof PRONOUN_SECTIONS==='undefined')return;
    const personal=PRONOUN_SECTIONS.find(s=>s.id==='personal');
    if(!personal)return;
    personal.hintEasy=plainPronounHint(personal.hintEasy);
    personal.hintHard=plainPronounHint(personal.hintHard);
  }

  // One title only on the PRONOUNS level-selection screen.
  window.renderPronounModes=function(){
    const s=window.pronounSection;
    if(!s)return '';
    return `<div class="pronouns-page pronoun-level-page"><div class="pronouns-header pronoun-level-header"><span class="selector-label">PRONOUNS / ${escapeHtml(s.title)}</span><p>${escapeHtml(s.greek)}</p></div>${renderLevelButtons(['easy','hard'],'startPronoun')}</div>`;
  };

  // Hint button is fixed near the lower-right side of the exercise.
  window.pronounHintButton=function(type){
    const html=type==='easy'?window.pronounSection?.hintEasy:window.pronounSection?.hintHard;
    if(!html)return '';
    return `<button class="pronoun-hint-btn pronoun-hint-dock-button" onclick="openPronounHint('${type}')" aria-label="Open hint" title="Hint">?</button>`;
  };

  window.openPronounHint=function(type){
    const html=type==='easy'?window.pronounSection?.hintEasy:window.pronounSection?.hintHard;
    if(!html)return;
    const old=document.getElementById('pronoun-hint-dock');
    if(old){old.remove();return;}
    const dock=document.createElement('aside');
    dock.id='pronoun-hint-dock';
    dock.className='pronoun-hint-dock';
    dock.innerHTML=`<div class="pronoun-hint-dock-head"><span>HINT</span><button type="button" aria-label="Close hint">×</button></div><div class="pronoun-hint-dock-body">${plainPronounHint(html)}</div>`;
    dock.querySelector('.pronoun-hint-dock-head button').onclick=()=>dock.remove();
    document.body.appendChild(dock);
  };

  syncPersonalHints();
})();

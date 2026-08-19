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

  // Remove audio buttons from Personal Pronouns hints without replacing
  // the original Pronouns rendering functions. Replacing them caused the
  // selected exercise to disappear because pronounSection is module-local.
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

  syncPersonalHints();
})();

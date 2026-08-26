// Writing Enhancer — non-destructive suggestions for vocabulary and phrasing.
// This first layer is intentionally local: it never silently changes user text.

const ENGLISH_WRITING_PHRASES = [
  { pattern:/\bvery good\b/gi, original:'very good', natural:'great', b2:'excellent', c1:'highly effective', reason:'More precise adjective.' },
  { pattern:/\bvery bad\b/gi, original:'very bad', natural:'really bad', b2:'poor', c1:'highly problematic', reason:'More precise description.' },
  { pattern:/\bvery big\b/gi, original:'very big', natural:'huge', b2:'considerable', c1:'substantial', reason:'Stronger and more precise vocabulary.' },
  { pattern:/\bvery important\b/gi, original:'very important', natural:'essential', b2:'significant', c1:'crucial', reason:'More concise and precise.' },
  { pattern:/\bvery interesting\b/gi, original:'very interesting', natural:'fascinating', b2:'engaging', c1:'compelling', reason:'More expressive vocabulary.' },
  { pattern:/\ba lot of\b/gi, original:'a lot of', natural:'many / much', b2:'a considerable number/amount of', c1:'a substantial amount/number of', reason:'More precise quantity expression.' },
  { pattern:/\bI think\b/gi, original:'I think', natural:'I believe', b2:'I would argue', c1:'I would contend', reason:'Alternative ways to express an opinion.' },
  { pattern:/\bI like\b/gi, original:'I like', natural:'I enjoy', b2:'I am fond of', c1:'I derive considerable enjoyment from', reason:'More varied expression.' },
  { pattern:/\bgood for my health\b/gi, original:'good for my health', natural:'beneficial for my health', b2:'has a positive effect on my health', c1:'contributes to my overall well-being', reason:'More natural or advanced phrasing.' },
  { pattern:/\bin my opinion\b/gi, original:'in my opinion', natural:'I believe', b2:'from my perspective', c1:'from my standpoint', reason:'Useful alternatives for expressing a viewpoint.' },
  { pattern:/\bmake a decision\b/gi, original:'make a decision', natural:'decide', b2:'reach a decision', c1:'arrive at a decision', reason:'Choose between a concise verb and a more formal phrase.' }
];

const ENGLISH_SYNONYMS = {
  good:['great','excellent','effective','beneficial'], bad:['poor','negative','problematic','unsatisfactory'], important:['significant','essential','crucial','fundamental'], interesting:['engaging','fascinating','compelling','intriguing'], like:['enjoy','appreciate','be fond of','value'], think:['believe','consider','argue','maintain'], big:['large','huge','considerable','substantial'], small:['little','minor','limited','modest'], help:['assist','support','facilitate','contribute to'], show:['demonstrate','illustrate','indicate','highlight'], use:['employ','apply','utilise','implement'], get:['receive','obtain','acquire','gain']
};

function getWritingPhraseSuggestions(text) {
  const value=String(text||'');
  const results=[];
  ENGLISH_WRITING_PHRASES.forEach(item=>{ if(item.pattern.test(value)){ item.pattern.lastIndex=0; results.push({...item}); } item.pattern.lastIndex=0; });
  return results;
}

function getWritingSynonymSuggestions(text) {
  const value=String(text||'').toLowerCase();
  const found=[];
  Object.entries(ENGLISH_SYNONYMS).forEach(([word,synonyms])=>{
    const regex=new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i');
    if(regex.test(value)) found.push({word,synonyms});
  });
  return found;
}

function renderWritingEnhancements(text) {
  const phrases=getWritingPhraseSuggestions(text);
  const synonyms=getWritingSynonymSuggestions(text);
  if(!phrases.length && !synonyms.length) return '';
  let html='<div class="writing-enhancements"><div class="writing-enhancements-title">IMPROVE YOUR ENGLISH</div>';
  phrases.forEach(item=>{
    html+=`<div class="writing-enhancement"><div class="writing-enhancement-type">BETTER PHRASING</div><div class="writing-original">${escapeHtml(item.original)}</div><div class="writing-options"><button onclick="replaceWritingPhrase('${escapeHtml(item.original)}','${escapeHtml(item.natural)}')">${escapeHtml(item.natural)}</button><button onclick="replaceWritingPhrase('${escapeHtml(item.original)}','${escapeHtml(item.b2)}')">B2 · ${escapeHtml(item.b2)}</button><button onclick="replaceWritingPhrase('${escapeHtml(item.original)}','${escapeHtml(item.c1)}')">C1 · ${escapeHtml(item.c1)}</button></div><small>${escapeHtml(item.reason)}</small></div>`;
  });
  synonyms.forEach(item=>{
    html+=`<div class="writing-enhancement"><div class="writing-enhancement-type">SYNONYMS · ${escapeHtml(item.word.toUpperCase())}</div><div class="writing-options">${item.synonyms.map(word=>`<button onclick="replaceWritingWord('${escapeHtml(item.word)}','${escapeHtml(word)}')">${escapeHtml(word)}</button>`).join('')}</div></div>`;
  });
  html+='</div>';
  return html;
}

function replaceWritingPhrase(original,replacement){ replaceFirstWritingText(original,replacement); }
function replaceWritingWord(original,replacement){ replaceFirstWritingText(original,replacement); }
function replaceFirstWritingText(original,replacement){
  const input=document.getElementById('english-writing-input'); if(!input)return;
  const regex=new RegExp(`\\b${String(original).replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i');
  input.value=input.value.replace(regex,replacement);
  input.dispatchEvent(new Event('input',{bubbles:true}));
}

function renderWritingImprovementBlock(text){ return renderWritingEnhancements(text); }

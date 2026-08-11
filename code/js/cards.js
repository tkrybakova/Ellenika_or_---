// ============================================================
// cards.js – карточки + прогресс запоминания
// ============================================================

let cardIndex = 0;
let cardFlipped = false;
let cardOrder = [];
let activeCardLevel = 'ALL';
let activeCardGroup = null;

function getCardPool() {
  let pool = getWordsForLevel(activeCardLevel);
  if (activeCardGroup) pool = pool.filter(w => Array.isArray(w.groups) && w.groups.includes(activeCardGroup));
  return pool;
}
function getCurrentCard() { const pool = getCardPool(); return pool[cardOrder[cardIndex]]; }
function shuffleCards() {
  const pool = getCardPool();
  cardOrder = Array.from({length: pool.length}, (_, i) => i);
  for (let i = cardOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cardOrder[i], cardOrder[j]] = [cardOrder[j], cardOrder[i]]; }
  cardIndex = 0;
}
function openCards(level = 'ALL') { activeCardLevel = level || 'ALL'; activeCardGroup = null; openCardsView(); }
function openCardsForGroup(group) { activeCardGroup = group; openCardsView(); }
function openCardsView() {
  const pool = getCardPool();
  if (!pool.length) { alert('В этой группе пока нет слов.'); return; }
  shuffleCards(); showCardPage();
}
function showCardPage() {
  const pool = getCardPool(), current = getCurrentCard();
  const title = activeCardGroup || (activeCardLevel === 'ALL' ? 'ALL LEVELS' : activeCardLevel);
  const html = `<div class="cards-container">
    <div class="cards-level-label">VOCABULARY / ${escapeHtml(title)}</div>
    <div class="card" onclick="flipCard()"><div class="card-inner">
      <div class="card-front"><div class="card-level">${current.level || 'A1'}</div><div class="card-word">${escapeHtml(current.greek)}</div><div class="card-article">${escapeHtml(current.article || '')}</div></div>
      <div class="card-back"><div class="card-level">${current.level || 'A1'}</div><div class="card-translation">${escapeHtml(current.russian)}</div><div class="card-english">${escapeHtml(current.english || '')}</div></div>
    </div></div>
    <div class="memory-actions"><button class="memory-btn memory-0" onclick="rateCurrentWord(0)">Не знаю</button><button class="memory-btn memory-1" onclick="rateCurrentWord(1)">Сложно</button><button class="memory-btn memory-2" onclick="rateCurrentWord(2)">Знаю</button><button class="memory-btn memory-3" onclick="rateCurrentWord(3)">Выучено</button></div>
    <div class="card-progress-label">Прогресс слова: ${getWordProgress(current)}/3</div>
    <div class="card-controls"><button onclick="prevCard()">◀ Предыдущее</button><span class="card-counter">${cardIndex + 1} / ${pool.length}</span><button onclick="nextCard()">Следующее ▶</button><button onclick="shuffleCards(); showCardPage();">🔀 Перемешать</button><button onclick="openDictionary()">← Группы</button></div>
  </div>`;
  renderPage('Карточки', html); cardFlipped = false;
}
function rateCurrentWord(level) {
  const current = getCurrentCard(); if (!current) return;
  updateWordMemory(current, level);
  cardIndex = (cardIndex + 1) % getCardPool().length;
  showCardPage();
}
function nextCard() { const pool = getCardPool(); if (!pool.length) return; cardIndex = (cardIndex + 1) % pool.length; showCardPage(); }
function prevCard() { const pool = getCardPool(); if (!pool.length) return; cardIndex = (cardIndex - 1 + pool.length) % pool.length; showCardPage(); }
function flipCard() { const el = document.querySelector('.card-inner'); if (!el) return; cardFlipped = !cardFlipped; el.style.transform = cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'; }

function openWriting(level = 'ALL') { activeCardLevel = level || 'ALL'; activeCardGroup = null; openWritingView(); }
function openWritingForGroup(group) { activeCardGroup = group; openWritingView(); }
function openWritingView() {
  const pool = getCardPool(); if (!pool.length) { alert('В этой группе пока нет слов.'); return; }
  shuffleCards(); renderWriting();
}
function renderWriting() {
  const current = getCurrentCard(), pool = getCardPool();
  const title = activeCardGroup || (activeCardLevel === 'ALL' ? 'ALL LEVELS' : activeCardLevel);
  const html = `<div class="writing-container"><div class="cards-level-label">VOCABULARY / ${escapeHtml(title)}</div>
    <div class="writing-prompt"><p>Переведите на греческий:</p><div class="writing-translation">${escapeHtml(current.russian)}</div><div class="writing-english">${escapeHtml(current.english || '')}</div></div>
    <div class="writing-input-area"><input id="writing-input" placeholder="Введите греческое слово..." autofocus><button onclick="checkWriting()">Проверить</button></div><div id="writing-result"></div>
    <div class="card-controls"><button onclick="prevCard(); renderWriting();">◀ Предыдущее</button><span class="card-counter">${cardIndex + 1} / ${pool.length}</span><button onclick="nextCard(); renderWriting();">Следующее ▶</button><button onclick="shuffleCards(); renderWriting();">🔀 Перемешать</button><button onclick="openDictionary()">← Группы</button></div></div>`;
  renderPage('Написание', html); document.getElementById('writing-input')?.focus();
}
function checkWriting() {
  const input = document.getElementById('writing-input'); if (!input) return;
  const answer = input.value.trim(); if (!answer) return;
  const current = getCurrentCard(), correct = current.greek.toLowerCase().trim() === answer.toLowerCase().trim();
  const result = document.getElementById('writing-result');
  if (result) { result.className = correct ? 'correct' : 'wrong'; result.textContent = correct ? '✓ Правильно!' : `✕ Неправильно. Правильно: ${current.greek}`; }
  updateWordMemory(current, correct ? 3 : 1);
}

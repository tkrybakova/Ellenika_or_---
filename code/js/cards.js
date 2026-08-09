// ============================================================
// cards.js – флип-карточки и режим написания
// ============================================================

let cardIndex = 0;
let cardFlipped = false;
let cardOrder = [];
let activeCardLevel = 'ALL';

function getCardPool() {
  return getWordsForLevel(activeCardLevel);
}

function getCurrentCard() {
  const pool = getCardPool();
  return pool[cardOrder[cardIndex]];
}

function shuffleCards() {
  const pool = getCardPool();
  cardOrder = Array.from({ length: pool.length }, (_, i) => i);
  for (let i = cardOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardOrder[i], cardOrder[j]] = [cardOrder[j], cardOrder[i]];
  }
  cardIndex = 0;
}

function nextCard() {
  const pool = getCardPool();
  if (cardIndex < pool.length - 1) {
    cardIndex++;
    if (document.querySelector('.card')) showCard();
    else if (document.querySelector('.writing-container')) renderWriting();
  } else alert('Это последняя карточка!');
}

function prevCard() {
  if (cardIndex > 0) {
    cardIndex--;
    if (document.querySelector('.card')) showCard();
    else if (document.querySelector('.writing-container')) renderWriting();
  } else alert('Это первая карточка!');
}

function openCards(level = 'ALL') {
  activeCardLevel = level || 'ALL';
  const pool = getCardPool();
  if (!pool.length) {
    alert(`На уровне ${activeCardLevel} пока нет слов.`);
    return;
  }
  shuffleCards();
  const current = getCurrentCard();
  const levelTitle = activeCardLevel === 'ALL' ? 'ALL LEVELS' : activeCardLevel;
  const html = `
    <div class="cards-container">
      <div class="cards-level-label">VOCABULARY / ${levelTitle}</div>
      <div class="card" onclick="flipCard()">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-level">${current.level || 'A1'}</div>
            <div class="card-word">${current.greek}</div>
            <div class="card-article">${current.article || ''}</div>
          </div>
          <div class="card-back">
            <div class="card-level">${current.level || 'A1'}</div>
            <div class="card-translation">${current.russian}</div>
            <div class="card-english">${current.english || ''}</div>
          </div>
        </div>
      </div>
      <div class="card-controls">
        <button onclick="prevCard()">◀ Предыдущее</button>
        <span class="card-counter">${cardIndex + 1} / ${pool.length}</span>
        <button onclick="nextCard()">Следующее ▶</button>
        <button onclick="shuffleCards(); showCard();">🔀 Перемешать</button>
        <button onclick="openDictionary()">← Словарь</button>
      </div>
    </div>
  `;
  renderPage('Карточки', html);
  cardFlipped = false;
}

function showCard() {
  cardFlipped = false;
  const cardInner = document.querySelector('.card-inner');
  if (cardInner) cardInner.style.transform = 'rotateY(0deg)';

  const current = getCurrentCard();
  if (!current) return;
  const frontWord = document.querySelector('.card-front .card-word');
  const frontArticle = document.querySelector('.card-front .card-article');
  const frontLevel = document.querySelector('.card-front .card-level');
  const backTranslation = document.querySelector('.card-back .card-translation');
  const backEnglish = document.querySelector('.card-back .card-english');
  const backLevel = document.querySelector('.card-back .card-level');
  const counter = document.querySelector('.card-counter');

  if (frontWord) frontWord.textContent = current.greek;
  if (frontArticle) frontArticle.textContent = current.article || '';
  if (frontLevel) frontLevel.textContent = current.level || 'A1';
  if (backTranslation) backTranslation.textContent = current.russian;
  if (backEnglish) backEnglish.textContent = current.english || '';
  if (backLevel) backLevel.textContent = current.level || 'A1';
  if (counter) counter.textContent = `${cardIndex + 1} / ${getCardPool().length}`;
}

function flipCard() {
  const cardInner = document.querySelector('.card-inner');
  if (!cardInner) return;
  cardFlipped = !cardFlipped;
  cardInner.style.transform = cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}

function openWriting(level = 'ALL') {
  activeCardLevel = level || 'ALL';
  const pool = getCardPool();
  if (!pool.length) {
    alert(`На уровне ${activeCardLevel} пока нет слов.`);
    return;
  }
  shuffleCards();
  renderWriting();
}

function renderWriting() {
  const current = getCurrentCard();
  const pool = getCardPool();
  const html = `
    <div class="writing-container">
      <div class="cards-level-label">VOCABULARY / ${activeCardLevel === 'ALL' ? 'ALL LEVELS' : activeCardLevel}</div>
      <div class="writing-prompt">
        <p>Переведите на греческий:</p>
        <div class="writing-translation">${current.russian}</div>
        <div class="writing-english">${current.english || ''}</div>
      </div>
      <div class="writing-input-area">
        <input id="writing-input" placeholder="Введите греческое слово..." autofocus>
        <button onclick="checkWriting()">Проверить</button>
      </div>
      <div id="writing-result"></div>
      <div class="card-controls">
        <button onclick="prevCard(); renderWriting();">◀ Предыдущее</button>
        <span class="card-counter">${cardIndex + 1} / ${pool.length}</span>
        <button onclick="nextCard(); renderWriting();">Следующее ▶</button>
        <button onclick="shuffleCards(); renderWriting();">🔀 Перемешать</button>
        <button onclick="openDictionary()">← Словарь</button>
      </div>
    </div>
  `;
  renderPage('Написание', html);
  const input = document.getElementById('writing-input');
  if (input) input.focus();
}

function checkWriting() {
  const input = document.getElementById('writing-input');
  if (!input) return;
  const answer = input.value.trim();
  if (!answer) return;
  const current = getCurrentCard();
  const correct = current.greek.toLowerCase().trim() === answer.toLowerCase().trim();
  const resultDiv = document.getElementById('writing-result');
  if (resultDiv) {
    resultDiv.className = correct ? 'correct' : 'wrong';
    resultDiv.textContent = correct ? '✓ Правильно!' : `✕ Неправильно. Правильно: ${current.greek}`;
  }
}

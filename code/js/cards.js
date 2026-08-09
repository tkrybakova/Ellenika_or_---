// ============================================================
// cards.js – флип-карточки и режим написания
// ============================================================

let cardIndex = 0;
let cardFlipped = false;
let cardOrder = [];

// --- Общие функции для навигации по карточкам ---

function getCurrentCard() {
  return dictionary[cardOrder[cardIndex]];
}

function shuffleCards() {
  cardOrder = Array.from({ length: dictionary.length }, (_, i) => i);
  for (let i = cardOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardOrder[i], cardOrder[j]] = [cardOrder[j], cardOrder[i]];
  }
  cardIndex = 0;
}

function nextCard() {
  if (cardIndex < dictionary.length - 1) {
    cardIndex++;
    // вызываем обновление текущего режима (либо showCard, либо renderWriting)
    if (document.querySelector('.card')) showCard();
    else if (document.querySelector('.writing-container')) renderWriting();
  } else {
    alert('Это последняя карточка!');
  }
}

function prevCard() {
  if (cardIndex > 0) {
    cardIndex--;
    if (document.querySelector('.card')) showCard();
    else if (document.querySelector('.writing-container')) renderWriting();
  } else {
    alert('Это первая карточка!');
  }
}

// --- Флип-карточки ---

function openCards() {
  if (!dictionary || dictionary.length === 0) {
    alert('Словарь пуст. Добавьте слова сначала.');
    return;
  }
  shuffleCards();
  const html = `
    <div class="cards-container">
      <div class="card" onclick="flipCard()">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-word">${getCurrentCard().greek}</div>
            <div class="card-article">${getCurrentCard().article || ''}</div>
          </div>
          <div class="card-back">
            <div class="card-translation">${getCurrentCard().russian}</div>
            <div class="card-english">${getCurrentCard().english}</div>
          </div>
        </div>
      </div>
      <div class="card-controls">
        <button onclick="prevCard()">◀ Предыдущее</button>
        <span class="card-counter">${cardIndex + 1} / ${dictionary.length}</span>
        <button onclick="nextCard()">Следующее ▶</button>
        <button onclick="shuffleCards(); showCard();" style="background:#8b5cf6;">🔀 Перемешать</button>
        <button onclick="openDictionary()" style="background:#6b7280;">⬅ Назад к словарю</button>
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

  const frontWord = document.querySelector('.card-front .card-word');
  const frontArticle = document.querySelector('.card-front .card-article');
  const backTranslation = document.querySelector('.card-back .card-translation');
  const backEnglish = document.querySelector('.card-back .card-english');
  const counter = document.querySelector('.card-counter');

  if (frontWord && backTranslation) {
    const current = getCurrentCard();
    frontWord.textContent = current.greek;
    frontArticle.textContent = current.article || '';
    backTranslation.textContent = current.russian;
    backEnglish.textContent = current.english || '';
    if (counter) counter.textContent = `${cardIndex + 1} / ${dictionary.length}`;
  }
}

function flipCard() {
  const cardInner = document.querySelector('.card-inner');
  if (!cardInner) return;
  cardFlipped = !cardFlipped;
  cardInner.style.transform = cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}

// --- Режим написания (показываем перевод – пользователь пишет греческое слово) ---

function openWriting() {
  if (!dictionary || dictionary.length === 0) {
    alert('Словарь пуст. Добавьте слова сначала.');
    return;
  }
  shuffleCards();
  renderWriting();
}

function renderWriting() {
  const current = getCurrentCard();
  const html = `
    <div class="writing-container">
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
        <span class="card-counter">${cardIndex + 1} / ${dictionary.length}</span>
        <button onclick="nextCard(); renderWriting();">Следующее ▶</button>
        <button onclick="shuffleCards(); renderWriting();" style="background:#8b5cf6;">🔀 Перемешать</button>
        <button onclick="openDictionary()" style="background:#6b7280;">⬅ Назад к словарю</button>
      </div>
    </div>
  `;
  renderPage('Написание', html);
  const resultDiv = document.getElementById('writing-result');
  if (resultDiv) resultDiv.innerHTML = '';
  const input = document.getElementById('writing-input');
  if (input) input.focus();
}

function checkWriting() {
  const input = document.getElementById('writing-input');
  if (!input) return;
  const answer = input.value.trim();
  if (!answer) {
    alert('Введите слово');
    return;
  }
  const current = getCurrentCard();
  const correct = current.greek.toLowerCase().trim() === answer.toLowerCase().trim();
  const resultDiv = document.getElementById('writing-result');
  if (resultDiv) {
    resultDiv.className = correct ? 'correct' : 'wrong';
    resultDiv.textContent = correct ? '✅ Правильно!' : `❌ Неправильно. Правильно: ${current.greek}`;
  }
  // Можно автоматически переходить к следующему, но оставим ручной переход.
}
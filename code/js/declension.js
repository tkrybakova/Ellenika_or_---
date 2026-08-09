// ============================================================
// Модуль для тренировки склонений (declension)
// ============================================================

// Состояние текущей игры
let currentDeclensionGame = null;
let currentDeclensionLevel = 'easy';

// Фабрика создания игры для склонений
function createDeclensionGame(task) {
  const word = task;
  let answered = false;

  // Проверка для Easy (выбор падежа)
  function checkCase(selected) {
    if (answered) return;
    answered = true;
    // В Easy правильным считается винительный падеж (accusative)
    // (можно заменить на логику из словаря, если есть поле case)
    const correct = selected === 'accusative'; // по условию задачи
    showInlineResult(correct, `Падеж: ${selected} → ${correct ? '✅' : '❌'}`);
    showNextButton();
  }

  // Проверка для Medium (предлог)
  function checkPrep() {
    if (answered) return;
    const input = document.getElementById('prep');
    const answer = input.value.trim();
    if (!answer) {
      showInlineResult(false, 'Введите предлог');
      return;
    }
    answered = true;
    // Ожидаемый предлог – "στο" (по условию)
    const correct = answer === 'στο';
    showInlineResult(correct, `Предлог: ${answer} → ${correct ? '✅' : '❌'}`);
    showNextButton();
  }

  // Проверка для Hard (окончание + предлог)
  function checkHard() {
    if (answered) return;
    const endingInput = document.getElementById('ending');
    const prepInput = document.getElementById('preposition');
    const ending = endingInput.value.trim();
    const prep = prepInput.value.trim();
    if (!ending || !prep) {
      showInlineResult(false, 'Заполните оба поля');
      return;
    }
    answered = true;
    // Пока заглушка – всегда "Try again", но можно заменить на реальную проверку
    // Например, если у слова есть поля ending и preposition, то сравнивать с ними
    // Пока оставляем как есть, чтобы не ломать логику
    showInlineResult(false, 'Попробуйте ещё раз (база окончаний в разработке)');
    showNextButton();
  }

  // Вспомогательная функция для вывода результата
  function showInlineResult(correct, message) {
    const container = document.getElementById('declension-result') || document.createElement('div');
    container.id = 'declension-result';
    container.className = correct ? 'correct' : 'wrong';
    container.textContent = message;
    const content = document.getElementById('content');
    if (!document.getElementById('declension-result')) {
      content.appendChild(container);
    } else {
      container.textContent = message;
      container.className = correct ? 'correct' : 'wrong';
    }
  }

  // Кнопка "Следующее слово"
  function showNextButton() {
    const oldBtn = document.getElementById('next-declension-btn');
    if (oldBtn) oldBtn.remove();

    const btn = document.createElement('button');
    btn.id = 'next-declension-btn';
    btn.textContent = 'Следующее слово →';
    btn.onclick = () => startDeclension(currentDeclensionLevel);
    document.getElementById('content').appendChild(btn);
  }

  // Рендеринг интерфейса
  function render(level) {
    const levelTemplates = {
      easy: () => `
        <h2>${capitalize(level)}</h2>
        <p>Я вижу ${word.russian}</p>
        <h3>Βλέπω ___ ${word.greek}</h3>
        <div>
          <button onclick="currentDeclensionGame.checkCase('accusative')">Αιτιατική</button>
          <button onclick="currentDeclensionGame.checkCase('nominative')">Ονομαστική</button>
        </div>
      `,
      medium: () => `
        <h2>${capitalize(level)}</h2>
        <p>${word.russian}</p>
        <div class="word">___ ${word.greek}</div>
        <input id="prep" placeholder="Введите предлог" autofocus>
        <button onclick="currentDeclensionGame.checkPrep()">Проверить</button>
      `,
      hard: () => `
        <h2>${capitalize(level)}</h2>
        <div class="word">με ${word.greek.slice(0, -1)}__</div>
        <input id="ending" placeholder="окончание">
        <input id="preposition" placeholder="предлог">
        <button onclick="currentDeclensionGame.checkHard()">Проверить</button>
      `
    };

    const template = levelTemplates[level] || (() => '<p>Неизвестный уровень</p>');
    const html = template();

    const content = document.getElementById('content');
    content.innerHTML = html;

    // Добавляем слушатели Enter для полей ввода
    const inputs = content.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const checkBtn = input.parentElement.querySelector('button[onclick*="check"]');
          if (checkBtn) checkBtn.click();
        }
      });
    });

    // Сбрасываем состояние ответа
    answered = false;
    // Удаляем старые элементы результата и кнопки "Next"
    const oldResult = document.getElementById('declension-result');
    if (oldResult) oldResult.remove();
    const oldBtn = document.getElementById('next-declension-btn');
    if (oldBtn) oldBtn.remove();

    // Сохраняем текущий уровень для кнопки "Next"
    currentDeclensionLevel = level;
  }

  // Публичный API
  return {
    checkCase,
    checkPrep,
    checkHard,
    render,
    word
  };
}

// Стартовая функция (заменяет предыдущую startDeclension)
function startDeclension(level) {
  if (!dictionary || dictionary.length === 0) {
    document.getElementById('content').innerHTML = '<p>Словарь пуст. Добавьте слова.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const task = dictionary[randomIndex];

  currentDeclensionGame = createDeclensionGame(task);
  currentDeclensionGame.render(level);
}



// ============================================================
// Обратная совместимость – старые функции больше не нужны,
// но если они используются где-то ещё, можно оставить заглушки
// ============================================================
// (Удалите или закомментируйте их, чтобы избежать конфликтов)
/*
function checkCase(answer) { if (currentDeclensionGame) currentDeclensionGame.checkCase(answer); }
function checkPrep() { if (currentDeclensionGame) currentDeclensionGame.checkPrep(); }
function checkHardDeclension() { if (currentDeclensionGame) currentDeclensionGame.checkHard(); }
*/
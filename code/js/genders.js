// ============================================================
// Модуль для тренировки родов (genders)
// ============================================================

// Состояние текущей игры
let currentGame = null;

// Фабрика создания игры (замыкание)
function createGenderGame(task) {
  // Приватные переменные
  const word = task;
  let answered = false;

  // Методы проверки
  function checkGender(selected) {
    if (answered) return;
    answered = true;
    const correct = selected === word.gender;
    showInlineResult(correct, `Род: ${selected} → ${correct ? '✅' : '❌'}`);
    showNextButton();
  }

  function checkArticle() {
    if (answered) return;
    const input = document.getElementById('genderAnswer');
    const answer = input.value.trim();
    if (!answer) {
      showInlineResult(false, 'Введите артикль');
      return;
    }
    answered = true;
    const correct = answer === word.article;
    showInlineResult(correct, `Артикль: ${answer} → ${correct ? '✅' : '❌'}`);
    showNextButton();
  }

  function checkPlural() {
    if (answered) return;
    const pluralInput = document.getElementById('pluralAnswer');
    const articleInput = document.getElementById('pluralArticleAnswer');
    const plural = pluralInput.value.trim();
    const article = articleInput.value.trim();
    if (!plural || !article) {
      showInlineResult(false, 'Заполните оба поля');
      return;
    }
    answered = true;
    const correct = plural === word.plural && article === word.pluralArticle;
    showInlineResult(correct, `Мн.число: ${plural} ${article} → ${correct ? '✅' : '❌'}`);
    showNextButton();
  }

  function showInlineResult(correct, message) {
    const container = document.getElementById('gender-result') || document.createElement('div');
    container.id = 'gender-result';
    container.className = correct ? 'correct' : 'wrong';
    container.textContent = message;
    // Вставляем после последнего элемента (поля или кнопки)
    const content = document.getElementById('content');
    // Если контейнера нет, добавляем в конец content
    if (!document.getElementById('gender-result')) {
      content.appendChild(container);
    } else {
      // Обновляем содержимое
      container.textContent = message;
      container.className = correct ? 'correct' : 'wrong';
    }
  }

  function showNextButton() {
    // Удаляем старую кнопку, если есть
    const oldBtn = document.getElementById('next-gender-btn');
    if (oldBtn) oldBtn.remove();

    const btn = document.createElement('button');
    btn.id = 'next-gender-btn';
    btn.textContent = 'Следующее слово →';
    btn.onclick = () => startGender(currentLevel);
    const content = document.getElementById('content');
    content.appendChild(btn);
  }

  // Рендеринг интерфейса
  function render(level) {
    const levelTemplates = {
      easy: () => `
        <h2>${capitalize(level)}</h2>
        <div class="word">${word.greek}</div>
        <div>
          <button onclick="currentGame.checkGender('masculine')">Masculine</button>
          <button onclick="currentGame.checkGender('feminine')">Feminine</button>
          <button onclick="currentGame.checkGender('neuter')">Neuter</button>
        </div>
      `,
      medium: () => `
        <h2>${capitalize(level)}</h2>
        <div class="word">___ ${word.greek}</div>
        <input id="genderAnswer" placeholder="Артикль" autofocus>
        <button onclick="currentGame.checkArticle()">Проверить</button>
      `,
      hard: () => `
        <h2>${capitalize(level)}</h2>
        <div class="word">${word.article} ${word.greek}</div>
        <p>Множественное число (слово):</p>
        <input id="pluralAnswer" placeholder="мн.число">
        <p>Множественное число (артикль):</p>
        <input id="pluralArticleAnswer" placeholder="артикль мн.ч.">
        <button onclick="currentGame.checkPlural()">Проверить</button>
      `
    };

    const template = levelTemplates[level] || (() => '<p>Неизвестный уровень</p>');
    const html = template();

    // Вставляем в content
    const content = document.getElementById('content');
    content.innerHTML = html;

    // Добавляем слушатели на Enter для полей ввода
    const inputs = content.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          // Находим кнопку "Проверить" в этом же блоке
          const checkBtn = input.parentElement.querySelector('button[onclick*="check"]');
          if (checkBtn) checkBtn.click();
        }
      });
    });

    // Сбрасываем состояние ответа
    answered = false;
    // Удаляем старый результат и кнопку "Next"
    const oldResult = document.getElementById('gender-result');
    if (oldResult) oldResult.remove();
    const oldBtn = document.getElementById('next-gender-btn');
    if (oldBtn) oldBtn.remove();

    // Сохраняем текущий уровень для кнопки "Next"
    currentLevel = level;
  }

  // Публичный API
  return {
    checkGender,
    checkArticle,
    checkPlural,
    render,
    word // на случай, если понадобится снаружи
  };
}

// Глобальная переменная для хранения текущего уровня (для кнопки Next)
let currentLevel = 'easy';

// Стартовая функция (заменяет предыдущую startGender)
function startGender(level) {
  if (!dictionary || dictionary.length === 0) {
    document.getElementById('content').innerHTML = '<p>Словарь пуст. Добавьте слова.</p>';
    return;
  }

  // Выбираем случайное слово
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const task = dictionary[randomIndex];

  // Создаём новую игру
  currentGame = createGenderGame(task);
  currentGame.render(level);
}



// ============================================================
// Обратная совместимость: старые функции checkGender, checkArticle, checkPlural
// больше не нужны, но для безопасности можно оставить заглушки
// ============================================================
// (Удаляем или комментируем, чтобы не было конфликтов)
// Для сохранения совместимости с другими скриптами, если они вызывают эти функции,
// можно оставить их как обёртки:
/*
function checkGender(answer) {
  if (currentGame) currentGame.checkGender(answer);
}
function checkArticle() {
  if (currentGame) currentGame.checkArticle();
}
function checkPlural() {
  if (currentGame) currentGame.checkPlural();
}
*/
// Однако сейчас они переопределены в глобальной области, поэтому лучше их закомментировать
// или удалить, чтобы не было путаницы.
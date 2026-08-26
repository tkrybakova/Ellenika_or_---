// ============================================================
// exercises.js – first English exercise set
// ============================================================

const ENGLISH_EXERCISES = [
  { id: 'ps-1', type: 'translate', topic: 'present_simple', source: 'Я обычно плаваю по утрам.', accepted: ['I usually swim in the morning.', 'I usually swim in the mornings.'], targetTense: 'present_simple' },
  { id: 'ps-2', type: 'correct', topic: 'present_simple', source: 'She go to school every day.', expected: 'She goes to school every day.', targetTense: 'present_simple' },
  { id: 'pc-1', type: 'translate', topic: 'present_continuous', source: 'Я сейчас плаваю.', accepted: ['I am swimming now.', "I'm swimming now.", 'I am swimming right now.', "I'm swimming right now."], targetTense: 'present_continuous' },
  { id: 'past-1', type: 'translate', topic: 'past_simple', source: 'Вчера я ходила в бассейн.', accepted: ['I went to the pool yesterday.', 'Yesterday, I went to the pool.'], targetTense: 'past_simple' },
  { id: 'past-2', type: 'correct', topic: 'past_simple', source: 'Yesterday I go swimming.', expected: 'Yesterday I went swimming.', targetTense: 'past_simple' },
  { id: 'future-1', type: 'translate', topic: 'future_simple', source: 'Я думаю, завтра будет дождь.', accepted: ["I think it will rain tomorrow.", "I think it will be rainy tomorrow."], targetTense: 'future_simple' },
  { id: 'pp-1', type: 'translate', topic: 'present_perfect', source: 'Я уже закончила работу.', accepted: ['I have already finished my work.', "I've already finished my work."], targetTense: 'present_perfect' }
];

function getEnglishExercises(topic = null, type = null) {
  return ENGLISH_EXERCISES.filter(exercise => (!topic || exercise.topic === topic) && (!type || exercise.type === type));
}

function renderEnglishExerciseStart(type) {
  const label = type === 'translation' ? 'Translate the sentence into English.' : 'Build a correct English sentence.';
  return `
    <div class="english-exercise-start">
      <span class="english-writing-label">PRACTICE</span>
      <h3>${escapeHtml(label)}</h3>
      <p>Choose a grammar topic to start.</p>
      <div class="english-topic-grid">${ENGLISH_GRAMMAR_TOPICS.map(topic => `<button class="english-topic-card" onclick="startEnglishExerciseForTopic('${topic.id}', '${type}')"><span>${escapeHtml(topic.level)}</span><strong>${escapeHtml(topic.name)}</strong></button>`).join('')}</div>
    </div>`;
}

function startEnglishExerciseForTopic(topic, mode = null) {
  const exercises = getEnglishExercises(topic, mode === 'translation' ? 'translate' : null);
  const pool = exercises.length ? exercises : getEnglishExercises(topic);
  if (!pool.length) return;
  renderEnglishExercise(pool[0], 0, pool);
}

function renderEnglishExercise(exercise, index, pool) {
  const prompt = exercise.type === 'correct' ? 'Correct the sentence.' : 'Translate into English.';
  const source = exercise.type === 'correct' ? exercise.source : exercise.source;
  renderEnglishPage('PRACTICE', `
    <div class="english-exercise" data-exercise-id="${escapeHtml(exercise.id)}">
      <div class="english-exercise-progress">${index + 1} / ${pool.length}</div>
      <span class="english-writing-label">${escapeHtml(prompt)}</span>
      <div class="english-prompt">${escapeHtml(source)}</div>
      <textarea id="english-answer" rows="3" placeholder="Write your answer..."></textarea>
      <div class="english-action-row">
        <button class="english-secondary-button" onclick="showEnglishHint('${exercise.id}')">HINT</button>
        <button class="english-primary-button" onclick="submitEnglishExercise(${index}, ${JSON.stringify(pool).replace(/</g, '\\u003c')})">CHECK →</button>
      </div>
      <div id="english-exercise-feedback"></div>
    </div>`);
}

function submitEnglishExercise(index, pool) {
  const exercise = pool[index];
  const input = document.getElementById('english-answer');
  const feedback = document.getElementById('english-exercise-feedback');
  if (!exercise || !input || !feedback) return;
  const result = checkEnglishSentence(input.value, exercise);
  feedback.innerHTML = renderEnglishFeedback(result);
}

function showEnglishHint(exerciseId) {
  const exercise = ENGLISH_EXERCISES.find(item => item.id === exerciseId);
  const target = document.getElementById('english-exercise-feedback');
  if (!exercise || !target) return;
  const structure = getEnglishGrammarStructure(exercise.targetTense);
  target.innerHTML = `<div class="english-hint"><strong>HINT</strong><span>Think about ${escapeHtml(exercise.targetTense.replaceAll('_', ' '))}.</span><small>${escapeHtml(structure?.affirmative || '')}</small></div>`;
}

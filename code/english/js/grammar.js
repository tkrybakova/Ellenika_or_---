// ============================================================
// grammar.js – English grammar catalogue
// ============================================================

const ENGLISH_GRAMMAR_TOPICS = [
  { id: 'present_simple', level: 'A1', name: 'Present Simple', shortDescription: 'Habits, routines and facts.' },
  { id: 'present_continuous', level: 'A1', name: 'Present Continuous', shortDescription: 'Actions happening now.' },
  { id: 'past_simple', level: 'A1', name: 'Past Simple', shortDescription: 'Finished actions in the past.' },
  { id: 'future_simple', level: 'A1', name: 'Future Simple', shortDescription: 'Predictions and future decisions.' },
  { id: 'present_perfect', level: 'A2', name: 'Present Perfect', shortDescription: 'Past actions connected to now.' },
  { id: 'past_continuous', level: 'A2', name: 'Past Continuous', shortDescription: 'Actions in progress in the past.' }
];

function getEnglishGrammarTopic(id) {
  return ENGLISH_GRAMMAR_TOPICS.find(topic => topic.id === id) || null;
}

function getEnglishGrammarStructure(id) {
  const structures = {
    present_simple: {
      affirmative: 'subject + base verb',
      negative: 'subject + do/does not + base verb',
      question: 'do/does + subject + base verb',
      signals: ['always', 'usually', 'often', 'sometimes', 'every day']
    },
    present_continuous: {
      affirmative: 'subject + am/is/are + verb-ing',
      negative: 'subject + am/is/are not + verb-ing',
      question: 'am/is/are + subject + verb-ing',
      signals: ['now', 'right now', 'at the moment', 'currently']
    },
    past_simple: {
      affirmative: 'subject + past form',
      negative: 'subject + did not + base verb',
      question: 'did + subject + base verb',
      signals: ['yesterday', 'last week', 'ago', 'in 2020']
    },
    future_simple: {
      affirmative: 'subject + will + base verb',
      negative: 'subject + will not + base verb',
      question: 'will + subject + base verb',
      signals: ['tomorrow', 'next week', 'I think', 'probably']
    },
    present_perfect: {
      affirmative: 'subject + have/has + past participle',
      negative: 'subject + have/has not + past participle',
      question: 'have/has + subject + past participle',
      signals: ['already', 'just', 'ever', 'never', 'yet', 'since', 'for']
    },
    past_continuous: {
      affirmative: 'subject + was/were + verb-ing',
      negative: 'subject + was/were not + verb-ing',
      question: 'was/were + subject + verb-ing',
      signals: ['at 5 pm yesterday', 'while', 'when']
    }
  };
  return structures[id] || null;
}

function startEnglishGrammar(id) {
  const topic = getEnglishGrammarTopic(id);
  if (!topic) return;
  const structure = getEnglishGrammarStructure(id);
  renderEnglishPage(topic.name, `
    <div class="english-grammar-detail">
      <div class="english-topic-meta"><span>${escapeHtml(topic.level)}</span><span>GRAMMAR</span></div>
      <p>${escapeHtml(topic.shortDescription)}</p>
      <div class="english-structure-grid">
        <div><small>AFFIRMATIVE</small><strong>${escapeHtml(structure?.affirmative || '')}</strong></div>
        <div><small>NEGATIVE</small><strong>${escapeHtml(structure?.negative || '')}</strong></div>
        <div><small>QUESTION</small><strong>${escapeHtml(structure?.question || '')}</strong></div>
      </div>
      <div class="english-signals"><small>COMMON SIGNALS</small><div>${(structure?.signals || []).map(signal => `<span>${escapeHtml(signal)}</span>`).join('')}</div></div>
      <button class="english-primary-button" onclick="startEnglishExerciseForTopic('${id}')">START PRACTICE →</button>
    </div>`);
}

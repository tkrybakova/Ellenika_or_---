// ============================================================
// sentence-checker.js – English validation core
// LanguageTool will be connected here in the next stage.
// ============================================================

const ENGLISH_CONTRACTIONS = {
  "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are', "they're": 'they are',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "can't": 'cannot', "won't": 'will not'
};

function normalizeEnglishSentence(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

function englishAnswersMatch(answer, accepted) {
  const normalizedAnswer = normalizeEnglishSentence(answer);
  return (Array.isArray(accepted) ? accepted : []).some(value => normalizeEnglishSentence(value) === normalizedAnswer);
}

function checkEnglishSentence(answer, exercise = {}) {
  const value = String(answer || '').trim();
  const errors = [];

  if (!value) {
    return { correct: false, errors: [{ type: 'empty', message: 'Write an answer first.' }], answer: value };
  }

  if (Array.isArray(exercise.accepted) && englishAnswersMatch(value, exercise.accepted)) {
    return { correct: true, errors: [], answer: value };
  }

  if (exercise.expected && normalizeEnglishSentence(value) === normalizeEnglishSentence(exercise.expected)) {
    return { correct: true, errors: [], answer: value };
  }

  const tenseError = detectEnglishTenseMismatch(value, exercise.targetTense);
  if (tenseError) errors.push(tenseError);

  const agreementError = detectBasicSubjectVerbError(value);
  if (agreementError) errors.push(agreementError);

  if (!errors.length && (exercise.accepted || exercise.expected)) {
    errors.push({
      type: 'answer',
      message: 'This answer does not match the expected structure for this exercise.',
      suggestion: Array.isArray(exercise.accepted) ? exercise.accepted[0] : exercise.expected
    });
  }

  return { correct: false, errors, answer: value };
}

function detectEnglishTenseMismatch(sentence, targetTense) {
  if (!targetTense) return null;
  const text = normalizeEnglishSentence(sentence);
  const signals = {
    past_simple: ['yesterday', 'last ', ' ago'],
    present_simple: ['every day', 'usually', 'often', 'always', 'sometimes'],
    present_continuous: ['now', 'right now', 'at the moment'],
    future_simple: ['tomorrow', 'next '],
    present_perfect: ['already', 'just', 'ever', 'never', 'yet', 'since', 'for']
  };
  const hasTargetSignal = (signals[targetTense] || []).some(signal => text.includes(signal));
  if (!hasTargetSignal) return null;

  if (targetTense === 'past_simple' && /\b(i|you|we|they|he|she|it)\s+(go|come|eat|see|do|have|take|make)\b/.test(text)) {
    return { type: 'tense', category: 'past_simple', message: 'The time expression points to the past. Check the past form of the verb.', suggestion: 'Use the Past Simple form.' };
  }
  if (targetTense === 'present_simple' && /\b(am|is|are)\s+\w+ing\b/.test(text)) {
    return { type: 'tense', category: 'present_simple', message: 'This exercise targets Present Simple. Check whether you need the base verb.', suggestion: 'Use Present Simple.' };
  }
  if (targetTense === 'present_continuous' && !/\b(am|is|are)\s+\w+ing\b/.test(text)) {
    return { type: 'tense', category: 'present_continuous', message: 'Present Continuous needs am/is/are + verb-ing.', suggestion: 'am/is/are + verb-ing' };
  }
  if (targetTense === 'present_perfect' && !/\b(have|has)\s+\w+(ed|en|gone|been|done|seen|made|taken)\b/.test(text)) {
    return { type: 'tense', category: 'present_perfect', message: 'Check the Present Perfect structure: have/has + past participle.', suggestion: 'have/has + past participle' };
  }
  return null;
}

function detectBasicSubjectVerbError(sentence) {
  const text = normalizeEnglishSentence(sentence);
  if (/\bi\s+(goes|does|has|is)\b/.test(text)) {
    return { type: 'grammar', category: 'subject_verb_agreement', message: "With the subject 'I', use the base verb or the correct first-person form.", suggestion: 'go / do / have / am' };
  }
  return null;
}

function renderEnglishFeedback(result) {
  if (result.correct) {
    return `<div class="english-feedback correct"><strong>✓ CORRECT</strong><span>Your sentence is accepted.</span></div>`;
  }
  return `<div class="english-feedback incorrect"><strong>CHECK YOUR ANSWER</strong>${result.errors.map(error => `<div class="english-error"><span>${escapeHtml(error.message || '')}</span>${error.suggestion ? `<b>Try: ${escapeHtml(error.suggestion)}</b>` : ''}</div>`).join('')}</div>`;
}

// Runtime fixes for known cross-module bugs. Loaded last.
(function () {
  window.addStudyPoints = function (points) {
    return typeof addScore === 'function' ? addScore(points) : 0;
  };

  window.showF1Broadcast = function () {
    if (typeof showF1BroadcastMessage === 'function') showF1BroadcastMessage();
  };

  const originalShowHome = showHome;
  showHome = function () {
    clearGameState();
    originalShowHome();
  };

  const originalOpenGreekDashboard = openGreekDashboard;
  openGreekDashboard = function () {
    clearGameState();
    originalOpenGreekDashboard();
  };

  // Relative superlative in Modern Greek = definite article + comparative.
  const superlatives = {
    'καλός': 'ο καλύτερος',
    'μεγάλος': 'ο μεγαλύτερος',
    'μικρός': 'ο μικρότερος',
    'γρήγορος': 'ο γρηγορότερος',
    'αργός': 'ο αργότερος',
    'εύκολος': 'ο ευκολότερος',
    'δύσκολος': 'ο δυσκολότερος',
    'ψηλός': 'ο ψηλότερος',
    'χαμηλός': 'ο χαμηλότερος',
    'ωραίος': 'ο ωραιότερος'
  };

  if (typeof ADJECTIVES !== 'undefined') {
    ADJECTIVES.forEach(adjective => {
      const value = superlatives[adjective.positive];
      if (value) adjective.superlative = value;
    });
  }

  // The original adjective timer checks a stale `answered` property.
  // Use the result element as the completion signal instead.
  startAdjectiveTimer = function () {
    clearInterval(adjectiveTimer);
    adjectiveTimeLeft = 60;

    const update = () => {
      const el = document.getElementById('adjective-timer');
      if (!el) return;
      el.textContent = `${Math.floor(adjectiveTimeLeft / 60)}:${String(adjectiveTimeLeft % 60).padStart(2, '0')}`;
      el.style.color = adjectiveTimeLeft <= 15 ? '#e10600' : '';
    };

    update();
    adjectiveTimer = setInterval(() => {
      if (document.getElementById('adjective-result')) {
        clearInterval(adjectiveTimer);
        adjectiveTimer = null;
        return;
      }

      adjectiveTimeLeft -= 1;
      update();

      if (adjectiveTimeLeft <= 0) {
        clearInterval(adjectiveTimer);
        adjectiveTimer = null;
        if (adjectiveGame && !document.getElementById('adjective-result')) {
          adjectiveGame.finish(false, "Time's up.");
        }
      }
    }, 1000);
  };
})();

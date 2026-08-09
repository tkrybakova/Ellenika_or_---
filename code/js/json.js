// ============================================================
// json.js – импорт / экспорт словаря в JSON
// ============================================================

function exportJSON() {
  if (!dictionary || dictionary.length === 0) {
    alert('Словарь пуст, нечего экспортировать.');
    return;
  }
  const blob = new Blob([JSON.stringify(dictionary, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'greek_dictionary.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported) || imported.length === 0) {
        alert('Файл должен содержать непустой массив слов.');
        return;
      }
      if (!imported.every(w => w.greek)) {
        alert('Некоторые слова не имеют поля "greek". Проверьте формат.');
        return;
      }
      if (!confirm(`Найдено ${imported.length} слов. Заменить текущий словарь?`)) return;
      dictionary = imported;
      saveWords();
      const wordList = document.getElementById('word-list');
      if (wordList) {
        wordList.innerHTML = renderWordList();
      } else {
        openDictionary();
      }
      alert('Словарь успешно заменён!');
    } catch (error) {
      alert('Ошибка чтения JSON: ' + error.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}
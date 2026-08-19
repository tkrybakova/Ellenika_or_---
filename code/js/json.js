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
  const link = document.createElement('a');
  link.href = url;
  link.download = 'greek_dictionary.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJSON(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(loadEvent) {
    try {
      const imported = JSON.parse(loadEvent.target.result);
      if (!Array.isArray(imported) || imported.length === 0) {
        alert('Файл должен содержать непустой массив слов.');
        return;
      }
      if (!imported.every(word => word && String(word.greek || '').trim())) {
        alert('Некоторые слова не имеют поля "greek". Проверьте формат.');
        return;
      }
      if (!confirm(`Найдено ${imported.length} слов. Заменить текущий словарь?`)) return;

      dictionary = imported.map(normalizeWord).filter(word => word.greek);
      saveWords();
      openDictionary();
      alert(`Словарь успешно заменён: ${dictionary.length} слов.`);
    } catch (error) {
      alert('Ошибка чтения JSON: ' + error.message);
    } finally {
      if (event?.target) event.target.value = '';
    }
  };
  reader.onerror = () => alert('Не удалось прочитать JSON-файл.');
  reader.readAsText(file);
}

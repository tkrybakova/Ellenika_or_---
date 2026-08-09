import json
import re
import time
from deep_translator import GoogleTranslator

# Загружаем ваш JSON
with open('code\greek_dictionary.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

# Список стоп-слов для фильтрации (если english содержит одно из них, то это пояснение)
STOP_PHRASES = [
    'singular', 'plural', 'nominative', 'genitive', 'accusative', 
    'vocative', 'dative', 'alternative form', 'abbreviation', 
    'initialism', 'of', 'from', 'dated form', 'archaic', 'formal',
    'usually', 'literally', 'figuratively'
]

def is_clean_word(english):
    """
    Возвращает True, если english - это нормальное слово, а не пояснение.
    """
    if not english:
        return False
    # Если слишком длинное (более 40 символов) - скорее пояснение
    if len(english) > 40:
        return False
    # Если содержит запятые - возможно перечисление форм
    if ',' in english and english.count(',') > 1:
        return False
    # Приводим к нижнему регистру для проверки стоп-фраз
    lower = english.lower()
    for phrase in STOP_PHRASES:
        if phrase in lower:
            return False
    # Если это одно слово или два слова (без специальных символов)
    # Можно также проверить, что слово написано латиницей и не содержит скобок
    if '(' in english or ')' in english:
        return False
    return True

# Фильтруем
clean_words = []
for w in words:
    eng = w.get('english', '')
    if is_clean_word(eng):
        clean_words.append(w)

print(f"Всего записей: {len(words)}")
print(f"Оставлено чистых слов: {len(clean_words)}")

# Теперь переводим только чистые слова
translator = GoogleTranslator(source='en', target='ru')
total = len(clean_words)
translated_count = 0
skipped_count = 0

for i, word in enumerate(clean_words):
    # Если уже есть русский перевод, пропускаем
    if word.get('russian') and word['russian'].strip():
        continue

    english = word.get('english', '')
    if not english:
        continue

    # Очищаем английскую фразу: берём только до скобки или запятой
    clean_english = english.split('(')[0].split(',')[0].strip()
    if not clean_english:
        clean_english = english

    try:
        translated = translator.translate(clean_english)
        if translated:
            word['russian'] = translated
            translated_count += 1
            print(f"[{i+1}/{total}] {clean_english} → {translated}")
        else:
            word['russian'] = ''
            skipped_count += 1
    except Exception as e:
        print(f"[{i+1}/{total}] Ошибка для '{clean_english}': {e}")
        word['russian'] = ''
        skipped_count += 1

    time.sleep(0.5)  # пауза

# Сохраняем полный (с unchanged и с переведёнными) в новый файл
# Лучше сохранить только чистые слова с переводами
output_data = clean_words
with open('greek_dictionary_clean.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Готово! Переведено {translated_count} слов, пропущено {skipped_count}.")
print(f"Сохранено {len(output_data)} слов в greek_dictionary_clean.json")
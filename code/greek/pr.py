import json
import re
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup


# =========================================================
# SETTINGS
# =========================================================

INPUT_FILE = "greek_dictionary.json"
OUTPUT_FILE = "greek_dictionary_enriched.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 GreekDictionaryEnricher/1.0"
}

LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"]


# =========================================================
# SIMPLE SEMANTIC GROUPS
# =========================================================

GROUPS = {
    "People": [
        "person", "people", "man", "woman", "child",
        "human", "person", "boy", "girl", "adult",
        "άνθρωπ", "άνδρα", "γυναίκ", "παιδ"
    ],

    "Family": [
        "family", "mother", "father", "parent",
        "brother", "sister", "husband", "wife",
        "son", "daughter", "grandfather", "grandmother",
        "οικογέν", "μητέρ", "πατέρ", "αδελφ",
        "σύζυγ", "κόρ"
    ],

    "Home": [
        "house", "home", "room", "kitchen",
        "bathroom", "bedroom", "door", "window",
        "furniture", "garden",
        "σπίτ", "σπίτι", "δωμάτ", "κουζίν",
        "μπάνιο", "πόρτ", "παράθυρ"
    ],

    "Food": [
        "food", "drink", "bread", "meat", "fish",
        "fruit", "vegetable", "rice", "milk",
        "cheese", "egg", "water", "wine",
        "φαγητ", "ψωμ", "κρέατ", "ψάρ",
        "φρούτ", "λαχαν", "γάλα", "τυρ",
        "αυγ", "νερό"
    ],

    "Clothes": [
        "clothes", "clothing", "shirt", "trousers",
        "dress", "shoe", "coat", "jacket",
        "hat", "sock",
        "ρούχ", "πουκάμισ", "παντελόν",
        "φόρεμ", "παπούτσ", "παλτ"
    ],

    "Body": [
        "body", "head", "face", "eye", "ear",
        "nose", "mouth", "hand", "arm", "leg",
        "foot", "heart", "blood", "skin",
        "σώμα", "κεφάλ", "πρόσωπ", "μάτ",
        "αυτί", "μύτ", "στόμ", "χέρ",
        "πόδ", "καρδιά", "αίμ", "δέρμ"
    ],

    "Health": [
        "health", "illness", "disease", "medicine",
        "doctor", "hospital", "pain", "fever",
        "treatment", "patient",
        "υγεί", "ασθέν", "αρρώστ", "φαρμάκ",
        "γιατρ", "νοσοκομ", "πόνος",
        "πυρετ", "θεραπε", "ασθεν"
    ],

    "Emotions": [
        "emotion", "feeling", "love", "hate", "fear",
        "anger", "happiness", "sadness", "joy",
        "surprise", "hope", "desire",
        "συναίσθη", "αγάπ", "μίσος", "φόβ",
        "θυμ", "χαρ", "λύπ", "ελπίδ",
        "επιθυμ"
    ],

    "Education": [
        "school", "student", "teacher", "education",
        "lesson", "university", "college", "exam",
        "class", "book", "study", "degree",
        "σχολ", "μαθητ", "δασκάλ", "εκπαίδευ",
        "μάθημ", "πανεπιστ", "εξέτασ", "τάξ",
        "βιβλί", "σπουδ"
    ],

    "Work": [
        "work", "job", "worker", "employee",
        "employer", "profession", "career", "office",
        "company", "business", "boss",
        "δουλει", "εργασ", "εργάτ", "υπάλληλ",
        "επάγγελ", "καριέρ", "γραφεί",
        "εταιρεί", "επιχείρ"
    ],

    "Money": [
        "money", "bank", "price", "cost", "payment",
        "income", "salary", "tax", "economy",
        "market", "business", "money",
        "χρήμα", "τράπεζ", "τιμ", "κόστος",
        "πληρωμ", "εισόδημ", "μισθ", "φόρ",
        "οικονομ", "αγορ"
    ],

    "Travel": [
        "travel", "trip", "journey", "tourism",
        "tourist", "hotel", "airport", "ticket",
        "train", "bus", "car", "road",
        "ταξίδ", "τουρισ", "τουρίστ", "ξενοδοχ",
        "αεροδρόμ", "εισιτήρ", "τρέν", "λεωφορεί",
        "αυτοκίνητ", "δρόμ"
    ],

    "Sea and Transport": [
        "sea", "marine", "ship", "boat", "sail",
        "anchor", "port", "harbour", "captain",
        "sailor", "navy", "transport",
        "θάλασσ", "πλοί", "βάρκ", "ιστί",
        "άγκυρ", "λιμάν", "καπετάν",
        "ναύτ", "ναυτικ", "μεταφορ"
    ],

    "Nature": [
        "nature", "tree", "flower", "plant",
        "mountain", "river", "lake", "forest",
        "earth", "land", "stone", "grass",
        "φύσ", "δέντρ", "λουλούδ", "φυτ",
        "βουν", "ποτάμ", "λίμν", "δάσ",
        "γη", "πέτρ", "γρασίδ"
    ],

    "Animals": [
        "animal", "dog", "cat", "horse", "bird",
        "fish", "snake", "lion", "insect",
        "ζώ", "σκύλ", "γάτ", "άλογ",
        "πουλ", "ψάρ", "φίδ", "λιοντ",
        "έντομ"
    ],

    "Sports": [
        "sport", "football", "basketball", "swimming",
        "swim", "running", "running", "athlete",
        "player", "game", "race", "competition",
        "αθλη", "ποδόσφαιρ", "μπάσκετ", "κολύμβ",
        "κολυμπ", "τρέξιμ", "δρομ", "αθλητ",
        "παίκτ", "αγών", "διαγωνισ"
    ],

    "City": [
        "city", "town", "street", "building",
        "square", "shop", "store", "restaurant",
        "cafe", "station", "place",
        "πόλ", "δρόμ", "κτίρι", "πλατεί",
        "κατάστημ", "εστιατόρ", "καφε",
        "σταθμ", "μέρ"
    ],

    "Politics": [
        "politics", "political", "government",
        "president", "minister", "party",
        "election", "parliament", "state",
        "πολιτικ", "κυβέρνησ", "πρόεδρ",
        "υπουργ", "κόμμ", "εκλογ", "κοινοβούλ",
        "κράτ"
    ],

    "Law": [
        "law", "legal", "court", "judge", "lawyer",
        "crime", "criminal", "police", "justice",
        "right", "rule",
        "νόμ", "δικαστ", "δικηγόρ", "έγκλημ",
        "εγκληματ", "αστυνομ", "δικαιοσύν",
        "δικαίωμ", "κανόν"
    ],

    "History": [
        "history", "historical", "ancient",
        "empire", "king", "queen", "war",
        "battle", "revolution", "century",
        "ιστορί", "ιστορικ", "αρχαί", "αυτοκρατορ",
        "βασιλ", "πόλεμ", "μάχ", "επανάστασ",
        "αιών"
    ],

    "Religion": [
        "religion", "church", "christian", "saint",
        "holy", "altar", "priest", "god",
        "christ", "bible", "faith",
        "θρησκ", "εκκλησ", "χριστιαν", "άγι",
        "ιερός", "ιερέ", "θεός", "χριστ",
        "βίβλ", "πίστ"
    ],

    "Art and Culture": [
        "art", "artist", "music", "painting",
        "theatre", "theater", "culture", "film",
        "movie", "literature", "poem", "sculpture",
        "τέχν", "καλλιτέχν", "μουσικ", "ζωγραφ",
        "θέατρ", "πολιτισμ", "κινηματογράφ",
        "λογοτεχν", "ποίημ", "γλυπτ"
    ],

    "Science": [
        "science", "scientific", "physics",
        "chemistry", "biology", "medicine",
        "research", "experiment", "theory",
        "επιστήμ", "επιστημον", "φυσικ", "χημεί",
        "βιολογ", "έρευν", "πείραμ", "θεωρί"
    ],

    "Technology": [
        "technology", "computer", "software",
        "hardware", "internet", "network",
        "program", "programming", "data",
        "machine", "device", "digital",
        "τεχνολογ", "υπολογιστ", "λογισμικ",
        "διαδίκτυ", "δίκτυ", "πρόγραμμ",
        "δεδομέν", "μηχαν", "συσκευ"
    ],

    "Math": [
        "math", "mathematics", "number", "vector",
        "equation", "algebra", "geometry",
        "function", "formula", "calculation",
        "μαθηματικ", "αριθμ", "άνυσμ",
        "εξίσωση", "άλγεβρ", "γεωμετρ",
        "συνάρτησ", "τύπ", "υπολογισ"
    ],

    "Communication": [
        "communication", "language", "word",
        "speech", "conversation", "question",
        "answer", "letter", "message", "information",
        "επικοινων", "γλώσσ", "λέξ", "ομιλ",
        "συζήτησ", "ερώτησ", "απάντησ",
        "γράμμ", "μήνυμ", "πληροφορ"
    ],

    "Time": [
        "time", "day", "week", "month", "year",
        "hour", "minute", "second", "morning",
        "evening", "night", "today", "tomorrow",
        "χρόν", "μέρ", "εβδομάδ", "μήν",
        "έτ", "ώρα", "λεπτ", "δευτερ",
        "πρωί", "βράδ", "νύχτ"
    ],

    "Weather": [
        "weather", "rain", "snow", "wind",
        "storm", "sun", "cloud", "temperature",
        "hot", "cold",
        "καιρ", "βροχ", "χιόν", "άνεμ",
        "καταιγ", "ήλι", "σύννεφ",
        "θερμοκρασ", "ζεστ", "κρύ"
    ],

    "Abstract Concepts": [
        "idea", "concept", "reason", "cause",
        "effect", "result", "problem", "solution",
        "possibility", "difference", "change",
        "ιδέ", "έννοι", "λόγ", "αιτί",
        "αποτέλεσμ", "πρόβλημ", "λύσ",
        "δυνατότητ", "διαφορ", "αλλαγ"
    ]
}


# =========================================================
# NORMALIZATION
# =========================================================

def normalize(text):
    if not text:
        return ""

    text = text.lower().strip()

    text = re.sub(r"[^\w\sάέήίόύώϊϋΐΰ]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text


# =========================================================
# LOAD JSON
# =========================================================

def load_dictionary():
    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


# =========================================================
# GET CEFR DATA
# =========================================================

def get_cefr_words():

    url = "https://www.lenguia.com/tools/most-common-words/greek"

    print("Downloading CEFR word list...")

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        response.raise_for_status()

    except requests.RequestException as error:
        print("Could not download CEFR data:")
        print(error)
        return {}

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    cefr_words = {}

    for element in soup.find_all(string=True):

        level = element.strip()

        if level not in LEVELS:
            continue

        parent = element.parent

        if parent is None:
            continue

        row = parent.parent

        if row is None:
            continue

        cells = row.find_all(
            ["td", "th"]
        )

        values = [
            cell.get_text(
                " ",
                strip=True
            )
            for cell in cells
        ]

        for value in values:

            value_normalized = normalize(value)

            if re.search(
                r"[α-ωάέήίόύώϊϋΐΰ]",
                value_normalized
            ):

                cefr_words[value_normalized] = level

                break

    print(
        f"CEFR words found: {len(cefr_words)}"
    )

    return cefr_words


# =========================================================
# GET WIKTIONARY INFORMATION
# =========================================================

def get_wiktionary_info(word):

    url = (
        "https://el.wiktionary.org/w/api.php"
    )

    params = {
        "action": "query",
        "prop": "categories|extracts",
        "explaintext": 1,
        "format": "json",
        "titles": word
    }

    try:

        response = requests.get(
            url,
            params=params,
            headers=HEADERS,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

    except Exception:
        return ""

    pages = (
        data
        .get("query", {})
        .get("pages", {})
    )

    if not pages:
        return ""

    page = next(iter(pages.values()))

    categories = " ".join(
        category.get("title", "")
        for category in page.get(
            "categories",
            []
        )
    )

    extract = page.get(
        "extract",
        ""
    )

    return normalize(
        categories + " " + extract
    )


# =========================================================
# DETECT GROUP
# =========================================================

def detect_group(entry, wiki_text=""):

    text = normalize(
        " ".join([
            entry.get("greek", ""),
            entry.get("english", ""),
            entry.get("russian", "")
        ])
    )

    combined_text = text + " " + wiki_text

    scores = {}

    for group, keywords in GROUPS.items():

        score = 0

        for keyword in keywords:

            keyword = normalize(keyword)

            if not keyword:
                continue

            if keyword in combined_text:
                score += 1

        scores[group] = score

    if not scores:
        return "Other"

    best_group = max(
        scores,
        key=scores.get
    )

    if scores[best_group] == 0:
        return "Other"

    return best_group


# =========================================================
# DETECT LEVEL
# =========================================================

def detect_level(
    entry,
    cefr_words,
    wiki_text=""
):

    greek = normalize(
        entry.get("greek", "")
    )

    # Exact match

    if greek in cefr_words:
        return cefr_words[greek]

    # Remove article

    without_article = re.sub(
        r"^(ο|η|το|οι|τα|τον|την|τους|τις)\s+",
        "",
        greek
    )

    if without_article in cefr_words:
        return cefr_words[
            without_article
        ]

    # Try the first word for expressions

    first_word = (
        greek.split()[0]
        if greek.split()
        else ""
    )

    if first_word in cefr_words:
        return cefr_words[first_word]

    # -----------------------------------------------------
    # Heuristic fallback
    # -----------------------------------------------------

    english = normalize(
        entry.get("english", "")
    )

    russian = normalize(
        entry.get("russian", "")
    )

    text = english + " " + russian

    # Very basic words usually belong to A1/A2.

    basic_words = [
        "man", "woman", "child", "house",
        "home", "food", "water", "day",
        "night", "good", "bad", "big",
        "small", "mother", "father",
        "brother", "sister", "school",
        "book", "car", "road", "city",
        "мужчина", "женщина", "ребенок",
        "дом", "еда", "вода", "день",
        "ночь", "мать", "отец", "школа",
        "книга", "машина", "город"
    ]

    for word in basic_words:
        if word in text:
            return "A1"

    # Common everyday concepts

    everyday_words = [
        "work", "money", "travel",
        "weather", "health", "education",
        "family", "friend", "problem",
        "работ", "деньг", "путешеств",
        "погод", "здоров", "образован",
        "семь", "друг", "проблем"
    ]

    for word in everyday_words:
        if word in text:
            return "A2"

    # Specialized vocabulary

    specialized_words = [
        "mathematics", "physics", "chemistry",
        "biology", "vector", "equation",
        "legal", "political", "scientific",
        "technical", "philosophy",
        "matемат", "физик", "хими",
        "биолог", "вектор", "уравнен",
        "юрид", "полит", "науч",
        "техничес", "философ"
    ]

    for word in specialized_words:
        if word in text:
            return "B2"

    # Long / specialized Greek words are more likely
    # to be advanced vocabulary.

    if len(greek) >= 12:
        return "C1"

    if len(greek) >= 9:
        return "B2"

    return "B1"


# =========================================================
# PROCESS
# =========================================================

def enrich_dictionary(data):

    cefr_words = get_cefr_words()

    total = len(data)

    for index, entry in enumerate(
        data,
        start=1
    ):

        greek = entry.get(
            "greek",
            ""
        )

        print(
            f"[{index}/{total}] {greek}"
        )

        # -------------------------------------------------
        # Wiktionary
        # -------------------------------------------------

        wiki_text = get_wiktionary_info(
            greek
        )

        # -------------------------------------------------
        # Level
        # -------------------------------------------------

        level = detect_level(
            entry,
            cefr_words,
            wiki_text
        )

        # -------------------------------------------------
        # Group
        # -------------------------------------------------

        group = detect_group(
            entry,
            wiki_text
        )

        # -------------------------------------------------
        # ONLY TWO NEW FIELDS
        # -------------------------------------------------

        entry["level"] = level
        entry["group"] = group

        # Small delay to avoid hammering APIs
        time.sleep(0.15)

    return data


# =========================================================
# SAVE
# =========================================================

def save_dictionary(data):

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2
        )


# =========================================================
# MAIN
# =========================================================

def main():

    print("=" * 60)
    print("Greek Dictionary Enricher")
    print("=" * 60)

    input_path = Path(INPUT_FILE)

    if not input_path.exists():

        print(
            f"\nERROR: {INPUT_FILE} not found."
        )

        return

    data = load_dictionary()

    print(
        f"\nWords in dictionary: {len(data)}"
    )

    data = enrich_dictionary(data)

    save_dictionary(data)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)

    print(
        f"Output: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()
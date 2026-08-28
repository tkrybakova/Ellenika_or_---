# Ellenika

Ellenika is a web-based language-learning application focused on Greek, with an additional English-learning module. The project combines interactive exercises, vocabulary, grammar practice, dictionaries, progress storage and an AI-assisted English writing coach.

## Main features

- Greek vocabulary and dictionary tools.
- Greek grammar practice, including adjectives, declension, genders and pronouns.
- Interactive flashcards and vocabulary exercises.
- English grammar organised by CEFR levels from A0 to C2.
- English exercises and sentence-writing practice.
- Real-time English writing checks and AI-assisted writing enhancement.
- Local browser storage for learner progress and settings.
- Responsive web interface with desktop and mobile styles.
- Android packaging through Capacitor.
- Python/FastAPI backends for AI-powered functionality.

## Project structure

```text
Ellenika_or_---/
├── code/
│   ├── backend/                  # Shared FastAPI backend
│   │   ├── main.py               # Ellenika API and AI writing enhancement endpoint
│   │   ├── requirements.txt       # Python dependencies
│   │   └── .env.example            # Environment-variable template
│   │
│   ├── english/                  # English-learning module
│   │   ├── backend/              # English writing AI backend
│   │   ├── css/                  # English-specific styles
│   │   ├── data/                 # English exercise/content data
│   │   └── js/                   # English grammar, exercises and writing tools
│   │
│   ├── greek/                    # Greek-learning module
│   │   ├── js/                   # Greek learning logic
│   │   ├── greek_dictionary.json # Greek dictionary data
│   │   ├── pr.py                 # Greek vocabulary/data processing utility
│   │   └── *.css                 # Greek exercise-specific styles
│   │
│   ├── js/                       # Shared application logic
│   │   ├── core.js               # Core application utilities and shared state
│   │   ├── navigation.js         # Page/navigation handling
│   │   ├── storage.js            # Persistent browser storage
│   │   ├── timer.js              # Exercise timer functionality
│   │   └── f1.js                 # F1/practice-related functionality
│   │
│   ├── index.html                # Main application entry point
│   ├── style.css                 # Main application styles
│   ├── mobile.css                # Mobile-specific styles
│   └── *.css                     # Feature-specific styles
│
├── android/                      # Capacitor Android project
└── vocab/                        # External/additional vocabulary resources
```

## Architecture

The application is primarily a client-side web application. HTML provides the application shell, CSS defines the interface, and JavaScript implements navigation, exercises, grammar logic, vocabulary handling and local persistence.

The shared backend is implemented with FastAPI. Its main API exposes a health endpoint and an AI-powered writing-enhancement endpoint. The backend validates request/response data with Pydantic and communicates with the OpenAI API using structured responses.

The English module has its own JavaScript layer for grammar, exercises, sentence checking, live checking, writing enhancement and English-specific storage. The Greek module contains separate learning logic for dictionary work, cards, declension, adjectives, genders and pronouns.

The Android directory contains the native Android wrapper generated/configured for the web application through Capacitor.

## English module

English grammar is organised into CEFR-style levels A0, A1, A2, B1, B2, C1 and C2. Grammar topics are represented as structured data and rendered dynamically. The grammar module exposes functions for selecting levels, opening topics and starting practice.

The writing tools are divided into several responsibilities:

- `english.js` — English module entry and general UI behaviour.
- `exercises.js` — interactive English exercises.
- `grammar.js` — grammar levels, topics and structures.
- `sentence-checker.js` — sentence validation and correction logic.
- `live-checker.js` — live feedback while the learner is typing.
- `writing-enhancer.js` — presentation and interaction for writing suggestions.
- `english-storage.js` — persistence of English-learning state.

The backend endpoint `/api/writing/enhance` accepts learner text and a target level and returns structured suggestions, synonyms, rewrites and an estimated CEFR level.

## Greek module

The Greek module contains the application's main Greek-learning functionality. It uses a large JSON dictionary together with JavaScript modules for different grammatical categories and exercise types.

Important modules include:

- `dictionary.js` — dictionary loading, searching and presentation.
- `cards.js` — vocabulary flashcards.
- `declension.js` — noun/word declension practice.
- `adjectives.js` — adjective exercises and forms.
- `genders.js` — grammatical gender exercises.
- `pronouns.js` — Greek pronoun exercises.
- `json.js` — JSON/data helpers.

## Shared JavaScript

The shared JavaScript layer contains functionality used by multiple parts of the application. `core.js` provides common application utilities, `navigation.js` manages movement between application sections, `storage.js` handles persistent browser data, and `timer.js` provides timing functionality for exercises.

## Backend setup

Create a Python virtual environment and install the dependencies:

```bash
cd code/backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file based on `.env.example` and provide an OpenAI API key. The model can be configured with `OPENAI_MODEL`; if it is omitted, the backend uses its configured default model.

Start the API with:

```bash
uvicorn main:app --reload
```

The health endpoint is available at:

```text
GET /api/health
```

The writing-enhancement endpoint is:

```text
POST /api/writing/enhance
```

Example request:

```json
{
  "text": "I want improve my English writing.",
  "level": "B1"
}
```

## English AI backend

The English-specific backend is located in `code/english/backend/writing-enhance.py`. It is intended for the writing-enhancement part of the English learning module and should be configured together with the corresponding frontend client.

## Data and external resources

The repository contains dictionary and vocabulary data under `code/greek/greek_dictionary.json` and `vocab/`. These files are data resources rather than executable application logic and therefore should be documented through their schema/source information rather than function comments.

## Documentation conventions

Source-code comments should explain purpose and behaviour rather than restating individual lines of code. JavaScript functions should use concise JSDoc comments where the function has non-obvious inputs, outputs or side effects. Python functions should use docstrings describing parameters, return values and important errors.

Generated Android files, dependency files, images, JSON datasets and CSS files do not contain application functions that require function-level documentation. They should instead have a short file-level explanation when their purpose is not obvious from the filename.

## Development principles

- Keep Greek and English learning logic separated.
- Keep reusable application behaviour in `code/js/`.
- Keep persistent learner state in the storage modules rather than scattering `localStorage` access throughout the application.
- Validate backend input and return structured responses.
- Do not expose API keys in frontend JavaScript.
- Preserve the learner's intended meaning when generating writing corrections or rewrites.
- Prefer clear, maintainable functions over large monolithic event handlers.

## License

No explicit open-source license is currently declared in the repository. Until a license is added, the source should be treated as all-rights-reserved by default.

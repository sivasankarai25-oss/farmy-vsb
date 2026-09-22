# Farmy Quiz Multilingual Update

The Quiz now uses the selected Farmy language for the actual quiz content, not only the surrounding buttons.

Supported quiz-content languages:
- English (`en`)
- Tamil (`ta`)
- Malayalam (`ml`)
- Hindi (`hi`)
- Arabic (`ar`)

How it works:
- English is the built-in source of truth.
- For other languages, the current question, all four options, and explanation are translated on demand.
- Translations are cached in the browser using localStorage.
- The correct answer index never changes, so translation does not alter scoring.
- If the translation service is unavailable, the English text remains available and the quiz continues to work.

The translation service used is MyMemory's public translation endpoint. This means the multilingual quiz requires an internet connection when a new translation is first requested.

import { Language } from './translations';
import { QuizQuestionData } from '../data/quizData';

/**
 * Runtime translation for quiz content.
 *
 * English remains the built-in source of truth. For the other supported
 * languages, the current question is translated on demand and cached in
 * localStorage so the same question does not need to be translated again.
 * If the translation service is unavailable, the original English content
 * is returned rather than breaking the quiz.
 */
export interface LocalizedQuizQuestion {
  question: string;
  options: [string, string, string, string];
  explanation: string;
}

const CACHE_KEY = 'farmy_quiz_translations_v1';
const SEP = 'FARMY_QUIZ_SEPARATOR_9XQ';

type CacheShape = Record<string, LocalizedQuizQuestion>;

function readCache(): CacheShape {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as CacheShape;
  } catch {
    return {};
  }
}

function writeCache(cache: CacheShape) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

function sourceQuestion(q: QuizQuestionData): LocalizedQuizQuestion {
  return {
    question: q.question,
    options: [...q.options] as [string, string, string, string],
    explanation: q.explanation,
  };
}

function decodeTranslatedText(text: string, original: LocalizedQuizQuestion): LocalizedQuizQuestion | null {
  const parts = text.split(SEP).map(part => part.trim());
  if (parts.length !== 6 || parts.some(Boolean) === false) return null;

  return {
    question: parts[0] || original.question,
    options: [
      parts[1] || original.options[0],
      parts[2] || original.options[1],
      parts[3] || original.options[2],
      parts[4] || original.options[3],
    ],
    explanation: parts[5] || original.explanation,
  };
}

async function requestTranslation(text: string, language: Language): Promise<string | null> {
  if (language === 'en') return text;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 7000);

  try {
    const url = `https://api.mymemory.translated.net/get?langpair=en|${language}&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data = await response.json() as { responseData?: { translatedText?: string } };
    return data.responseData?.translatedText || null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function translateQuizQuestion(
  question: QuizQuestionData,
  language: Language,
): Promise<LocalizedQuizQuestion> {
  const original = sourceQuestion(question);
  if (language === 'en') return original;

  const cache = readCache();
  const key = `${language}:${question.id}`;
  if (cache[key]) return cache[key];

  const payload = [
    original.question,
    original.options[0],
    original.options[1],
    original.options[2],
    original.options[3],
    original.explanation,
  ].join(` ${SEP} `);

  const translated = await requestTranslation(payload, language);
  const parsed = translated ? decodeTranslatedText(translated, original) : null;

  // If a batch translation was not returned in a parseable form, translate
  // each field independently. This is slower but more resilient.
  const localized = parsed || {
    question: await requestTranslation(original.question, language) || original.question,
    options: [
      await requestTranslation(original.options[0], language) || original.options[0],
      await requestTranslation(original.options[1], language) || original.options[1],
      await requestTranslation(original.options[2], language) || original.options[2],
      await requestTranslation(original.options[3], language) || original.options[3],
    ] as [string, string, string, string],
    explanation: await requestTranslation(original.explanation, language) || original.explanation,
  };

  cache[key] = localized;
  writeCache(cache);
  return localized;
}

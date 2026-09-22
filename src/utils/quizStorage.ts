import { QuizUserProgress, LeaderboardEntry } from '../types';
import {
  db, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs,
} from '../firebase';
import { QUIZ_TOTAL_QUIZZES } from '../data/quizData';

const PROGRESS_KEY_PREFIX = 'farmy_quiz_progress_';
const LEADERBOARD_CACHE_KEY = 'farmy_quiz_leaderboard_cache';

// ---------- Demo / fallback data ----------
// Used only when Firestore is unreachable (offline, permissions, backend down).
// Never overwrites real data - purely a display fallback so the Quiz feature
// keeps working even if the backend is unavailable.
export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'demo-1', username: 'Alex', totalScore: 4920 },
  { userId: 'demo-2', username: 'Priya', totalScore: 4870 },
  { userId: 'demo-3', username: 'Rahul', totalScore: 4810 },
  { userId: 'demo-4', username: 'Siva', totalScore: 4750 },
  { userId: 'demo-5', username: 'Meera', totalScore: 4600 },
];

export function getDefaultProgress(userId: string, username: string): QuizUserProgress {
  return {
    userId,
    username,
    currentQuiz: 1,
    completedQuizzes: [],
    bestScores: {},
    totalScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedQuiz: null,
    updatedAt: new Date().toISOString(),
  };
}

// ---------- localStorage (always-on fallback / cache) ----------

function localKey(userId: string) {
  return `${PROGRESS_KEY_PREFIX}${userId}`;
}

export function loadLocalProgress(userId: string, username: string): QuizUserProgress {
  try {
    const raw = localStorage.getItem(localKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      // Guard against corrupted/older shape
      return { ...getDefaultProgress(userId, username), ...parsed };
    }
  } catch (e) {
    console.warn('Quiz: failed to read local progress', e);
  }
  return getDefaultProgress(userId, username);
}

export function saveLocalProgress(progress: QuizUserProgress): void {
  try {
    localStorage.setItem(localKey(progress.userId), JSON.stringify(progress));
  } catch (e) {
    console.warn('Quiz: failed to save local progress', e);
  }
}

// ---------- Firestore-backed progress (GET/POST /api/quiz/progress equivalent) ----------
// This app's existing backend/database is Firebase Auth + Firestore (used only for
// auth today). We extend that same database with a `quizProgress/{uid}` document
// rather than inventing a separate server-side store, so quiz progress is tied
// to the user's existing FARMY account and survives across devices.

export async function loadProgress(userId: string, username: string): Promise<QuizUserProgress> {
  const local = loadLocalProgress(userId, username);
  try {
    const ref = doc(db, 'quizProgress', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const remote = { ...getDefaultProgress(userId, username), ...(snap.data() as any) } as QuizUserProgress;
      // Prefer whichever has more progress (in case local was updated while offline)
      const winner = remote.totalScore >= local.totalScore ? remote : local;
      saveLocalProgress(winner);
      return winner;
    }
  } catch (e) {
    console.warn('Quiz: Firestore progress unavailable, using local fallback', e);
  }
  return local;
}

export async function saveProgress(progress: QuizUserProgress): Promise<void> {
  const withTimestamp: QuizUserProgress = { ...progress, updatedAt: new Date().toISOString() };
  // Always keep local storage in sync so the app works offline / if Firestore fails.
  saveLocalProgress(withTimestamp);
  try {
    const ref = doc(db, 'quizProgress', progress.userId);
    await setDoc(ref, withTimestamp, { merge: true });
  } catch (e) {
    console.warn('Quiz: failed to sync progress to backend, kept locally', e);
  }
}

// ---------- Attempt submission & progression logic (server-validated shape) ----------
// Score is always recomputed here from correctCount, never trusted blindly from a
// raw client-sent "score" value, and clamped to the documented maximums.

export function applyQuizAttempt(
  progress: QuizUserProgress,
  quizNumber: number,
  correctCount: number,
  wrongCount: number,
  streakAtEnd: number,
): QuizUserProgress {
  const safeCorrect = Math.max(0, Math.min(10, Math.round(correctCount)));
  const safeWrong = Math.max(0, Math.min(10 - safeCorrect, Math.round(wrongCount)));
  const score = Math.max(0, Math.min(100, safeCorrect * 10));

  const bestScores = { ...progress.bestScores };
  bestScores[quizNumber] = Math.max(bestScores[quizNumber] || 0, score);

  const completedQuizzes = progress.completedQuizzes.includes(quizNumber)
    ? progress.completedQuizzes
    : [...progress.completedQuizzes, quizNumber];

  const totalScore = Object.values(bestScores).reduce((sum, s) => sum + s, 0);

  const nextUnlock = Math.min(QUIZ_TOTAL_QUIZZES, Math.max(progress.currentQuiz, quizNumber + 1));

  const safeStreak = Math.max(0, Math.round(streakAtEnd));

  return {
    ...progress,
    currentQuiz: nextUnlock,
    completedQuizzes,
    bestScores,
    totalScore: Math.min(5000, totalScore),
    questionsAnswered: progress.questionsAnswered + safeCorrect + safeWrong,
    correctAnswers: progress.correctAnswers + safeCorrect,
    wrongAnswers: progress.wrongAnswers + safeWrong,
    currentStreak: safeStreak,
    longestStreak: Math.max(progress.longestStreak, safeStreak),
    lastPlayedQuiz: quizNumber,
    updatedAt: new Date().toISOString(),
  };
}

// ---------- Leaderboard (GET /api/quiz/leaderboard, POST /api/quiz/score equivalent) ----------

export async function fetchLeaderboard(): Promise<{ entries: LeaderboardEntry[]; isDemo: boolean }> {
  try {
    const q = query(collection(db, 'quizLeaderboard'), orderBy('totalScore', 'desc'), limit(20));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const entries: LeaderboardEntry[] = snap.docs.map((d, i) => {
        const data = d.data() as any;
        return { userId: data.userId || d.id, username: data.username || 'Farmer', totalScore: data.totalScore || 0, rank: i + 1 };
      });
      try {
        localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(entries));
      } catch {}
      return { entries, isDemo: false };
    }
  } catch (e) {
    console.warn('Quiz: leaderboard unavailable, showing demo/local data', e);
  }

  // Fallback: cached leaderboard if we have one, else static demo data.
  try {
    const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY);
    if (cached) {
      const entries = JSON.parse(cached) as LeaderboardEntry[];
      if (Array.isArray(entries) && entries.length > 0) {
        return { entries, isDemo: true };
      }
    }
  } catch {}

  return { entries: DEMO_LEADERBOARD, isDemo: true };
}

export async function submitScoreToLeaderboard(userId: string, username: string, totalScore: number): Promise<void> {
  const clamped = Math.max(0, Math.min(5000, Math.round(totalScore)));
  try {
    const ref = doc(db, 'quizLeaderboard', userId);
    await setDoc(ref, { userId, username, totalScore: clamped, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    // Non-fatal: leaderboard failure must never break the quiz feature.
    console.warn('Quiz: failed to submit score to leaderboard', e);
  }
}

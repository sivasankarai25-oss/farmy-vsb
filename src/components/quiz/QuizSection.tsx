import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { QuizHome } from './QuizHome';
import { QuizPlay } from './QuizPlay';
import { QuizUserProgress } from '../../types';
import { loadProgress, saveProgress, applyQuizAttempt, submitScoreToLeaderboard, getDefaultProgress } from '../../utils/quizStorage';
import { QUIZ_TOTAL_QUIZZES } from '../../data/quizData';
import { Language, translations } from '../../utils/translations';

interface QuizSectionProps {
  userId: string;
  username: string;
  language?: Language;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ userId, username, language = 'en' }) => {
  const t = translations[language];
  const [progress, setProgress] = useState<QuizUserProgress | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadProgress(userId, username).then(p => {
      if (!cancelled) setProgress(p);
    }).catch(() => {
      if (!cancelled) setProgress(getDefaultProgress(userId, username));
    });
    return () => { cancelled = true; };
  }, [userId, username]);

  if (!progress) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-stone-500">
        <Loader2 className="w-6 h-6 animate-spin mb-2 text-emerald-600" />
        <p className="text-xs font-bold">{t.quizLoadingProgress}</p>
      </div>
    );
  }

  const handleComplete = (result: { quizNumber: number; correctCount: number; wrongCount: number; streakAtEnd: number }) => {
    setProgress(prev => {
      const base = prev ?? getDefaultProgress(userId, username);
      const updated = applyQuizAttempt(base, result.quizNumber, result.correctCount, result.wrongCount, result.streakAtEnd);
      saveProgress(updated);
      submitScoreToLeaderboard(userId, username, updated.totalScore);
      return updated;
    });
  };

  if (activeQuiz !== null) {
    const isNextUnlocked = activeQuiz < QUIZ_TOTAL_QUIZZES && (activeQuiz + 1) <= (progress.currentQuiz);
    return (
      <QuizPlay
        key={`${activeQuiz}-${playKey}`}
        quizNumber={activeQuiz}
        startingStreak={progress.currentStreak}
        isNextQuizUnlocked={isNextUnlocked}
        language={language}
        onExit={() => setActiveQuiz(null)}
        onComplete={handleComplete}
        onPlayAgain={() => setPlayKey(k => k + 1)}
        onNextQuiz={() => {
          setActiveQuiz(q => Math.min(QUIZ_TOTAL_QUIZZES, (q ?? 1) + 1));
          setPlayKey(k => k + 1);
        }}
      />
    );
  }

  return <QuizHome progress={progress} language={language} onStartQuiz={(n) => { setActiveQuiz(n); setPlayKey(k => k + 1); }} />;
};

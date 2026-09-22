import React, { useEffect, useState } from 'react';
import { Trophy, Flame, CheckCircle2, Lock, PlayCircle, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { quizSets } from '../../data/quizData';
import { QuizUserProgress, LeaderboardEntry } from '../../types';
import { fetchLeaderboard, DEMO_LEADERBOARD } from '../../utils/quizStorage';
import { Language, translations } from '../../utils/translations';

interface QuizHomeProps {
  progress: QuizUserProgress;
  onStartQuiz: (quizNumber: number) => void;
  language?: Language;
}

export const QuizHome: React.FC<QuizHomeProps> = ({ progress, onStartQuiz, language = 'en' }) => {
  const t = translations[language];
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEMO_LEADERBOARD);
  const [isDemoBoard, setIsDemoBoard] = useState<boolean>(true);
  const [boardLoading, setBoardLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setBoardLoading(true);
    fetchLeaderboard()
      .then(({ entries, isDemo }) => {
        if (!cancelled) {
          setLeaderboard(entries);
          setIsDemoBoard(isDemo);
        }
      })
      .finally(() => {
        if (!cancelled) setBoardLoading(false);
      });
    return () => { cancelled = true; };
  }, [progress.totalScore]);

  return (
    <div className="space-y-6 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 sm:p-7 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>🌱</span> {t.quizHeaderTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-semibold tracking-wide">
            {t.quizTagline}
          </p>
        </div>

        {/* Dashboard stats */}
        <div className="relative z-10 mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <StatPill label={t.quizStatQuizzes} value="50" />
          <StatPill label={t.quizStatQuestions} value="500" />
          <StatPill label={t.quizStatScore} value={String(progress.totalScore)} />
          <StatPill label={t.quizStatCompleted} value={String(progress.completedQuizzes.length)} />
          <StatPill label={t.quizStatStreak} value={String(progress.currentStreak)} icon={<Flame className="w-3.5 h-3.5 text-amber-400" />} />
        </div>
      </div>

      {/* QUIZ GRID */}
      <div>
        <h2 className="text-sm font-extrabold text-stone-900 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-700" /> {t.quizChooseQuiz}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quizSets.map((qz) => {
            const isUnlocked = qz.quizNumber <= progress.currentQuiz;
            const isCompleted = progress.completedQuizzes.includes(qz.quizNumber);
            const best = progress.bestScores[qz.quizNumber];

            return (
              <button
                key={qz.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onStartQuiz(qz.quizNumber)}
                className={`text-left p-3.5 rounded-2xl border transition-all shadow-xs relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-md active:scale-[0.98]'
                    : 'bg-stone-50 border-stone-200 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-stone-400 tracking-wide">QUIZ {qz.quizNumber}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <div className="text-2xl mb-1">{qz.emoji}</div>
                <h3 className="text-xs font-extrabold text-stone-900 leading-tight mb-1">{qz.title}</h3>
                <p className="text-[10px] text-stone-500 font-medium mb-2">10 {t.quizQuestionsLabel} · {qz.difficulty}</p>

                {isUnlocked ? (
                  isCompleted ? (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-emerald-700 font-bold">{t.quizBest}: {best}/100</p>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <RotateCcw className="w-3 h-3" /> {t.quizPlayAgain}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <PlayCircle className="w-3.5 h-3.5" /> {t.quizStartQuiz}
                    </div>
                  )
                ) : (
                  <div className="text-[11px] font-bold text-stone-400">🔒 {t.quizLocked}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> {t.quizGlobalLeaderboard}
          </h2>
          {boardLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400" />}
        </div>
        {isDemoBoard && !boardLoading && (
          <p className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 inline-block mb-3">
            {t.quizDemoLeaderboard}
          </p>
        )}
        <div className="space-y-1.5">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                idx === 0 ? 'bg-amber-50 border border-amber-200' : 'bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-stone-500 w-4">{entry.rank ?? idx + 1}</span>
                <span className="text-xs font-bold text-stone-800">{entry.username}</span>
              </div>
              <span className="text-xs font-black text-emerald-700">{entry.totalScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white/10 backdrop-blur rounded-xl px-2.5 py-2 text-center border border-white/10">
    <div className="flex items-center justify-center gap-1 text-sm font-black text-white">
      {icon}
      {value}
    </div>
    <div className="text-[9px] font-bold text-emerald-200/80 uppercase tracking-wide mt-0.5">{label}</div>
  </div>
);

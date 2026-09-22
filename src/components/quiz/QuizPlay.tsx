import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Flame, ArrowLeft, Trophy, PartyPopper, Home, RotateCcw, ArrowRight } from 'lucide-react';
import { quizSets, quizQuestions, QUIZ_TOTAL_QUIZZES } from '../../data/quizData';
import { Language, translations } from '../../utils/translations';
import { LocalizedQuizQuestion, translateQuizQuestion } from '../../utils/quizTranslation';

interface QuizPlayProps {
  quizNumber: number;
  startingStreak: number;
  isNextQuizUnlocked: boolean;
  onExit: () => void;
  onComplete: (result: { quizNumber: number; correctCount: number; wrongCount: number; streakAtEnd: number }) => void;
  onPlayAgain: () => void;
  onNextQuiz: () => void;
  language?: Language;
}

export const QuizPlay: React.FC<QuizPlayProps> = ({
  quizNumber, startingStreak, isNextQuizUnlocked, onExit, onComplete, onPlayAgain, onNextQuiz, language = 'en',
}) => {
  const t = translations[language];
  const quizSet = useMemo(() => quizSets.find(q => q.quizNumber === quizNumber)!, [quizNumber]);
  const questions = useMemo(
    () => quizSet.questionIds.map(id => quizQuestions.find(q => q.id === id)!),
    [quizSet]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(startingStreak);
  const [showResult, setShowResult] = useState(false);
  const [reported, setReported] = useState(false);
  const [localized, setLocalized] = useState<LocalizedQuizQuestion | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  useEffect(() => {
    let cancelled = false;
    setLocalized(null);
    if (language === 'en') return;
    setTranslationLoading(true);
    translateQuizQuestion(current, language).then(result => {
      if (!cancelled) setLocalized(result);
    }).finally(() => {
      if (!cancelled) setTranslationLoading(false);
    });
    return () => { cancelled = true; };
  }, [current, language]);

  const displayQuestion = localized || {
    question: current.question,
    options: current.options,
    explanation: current.explanation,
  };

  const quizTitle = language === 'en' ? quizSet.title : quizSet.title;


  const handleSelect = (optionIdx: number) => {
    if (answered) return;
    const isCorrect = optionIdx === current.correctIndex;
    setSelected(optionIdx);
    setAnswered(true);
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  // Report the completed attempt exactly once when the result screen first shows.
  if (showResult && !reported) {
    setReported(true);
    onComplete({ quizNumber, correctCount, wrongCount, streakAtEnd: streak });
  }

  if (showResult) {
    const score = correctCount * 10;
    return (
      <div className="max-w-md mx-auto pb-24 pt-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h2 className="text-lg font-black text-stone-900">{t.quizComplete}</h2>
          <p className="text-3xl font-black text-emerald-700">{correctCount} / {questions.length}</p>
          <p className="text-sm font-bold text-amber-700">{score} {t.quizPoints}</p>

          <div className="flex justify-center gap-4 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t.quizCorrectLabel}: {correctCount}</span>
            <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-500" /> {t.quizWrongLabel}: {wrongCount}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5 inline-flex">
            <Flame className="w-3.5 h-3.5" /> {t.quizCurrentStreak}: {streak}
          </div>

          <div className="pt-2 space-y-2">
            {quizNumber < QUIZ_TOTAL_QUIZZES && (
              <button
                onClick={onNextQuiz}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-sm flex items-center justify-center gap-1.5"
              >
                {t.quizNextQuiz} <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onPlayAgain}
              className="w-full py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> {t.quizPlayAgain}
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" /> {t.quizHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = ((index + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto pb-24 pt-2">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onExit} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.quizExit}
        </button>
        <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
          <Flame className="w-3.5 h-3.5" /> {streak}
        </div>
      </div>

      <h2 className="text-sm font-extrabold text-stone-900 mb-0.5">
        Quiz {quizNumber} — {quizTitle}
      </h2>
      <p className="text-[11px] font-bold text-stone-500 mb-2">{t.quizQuestionOf.replace('{current}', String(index + 1)).replace('{total}', String(questions.length))}</p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-stone-200 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 mb-4">
        {translationLoading ? (
          <p className="text-sm font-bold text-stone-500 animate-pulse">{t.quizLoading || 'Loading translation…'}</p>
        ) : (
          <p className="text-sm font-extrabold text-stone-900 leading-snug">{displayQuestion.question}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {displayQuestion.options.map((opt, idx) => {
          const isCorrectOption = idx === current.correctIndex;
          const isSelected = idx === selected;

          let style = 'bg-white border-stone-200 hover:border-emerald-300';
          if (answered) {
            if (isCorrectOption) style = 'bg-emerald-50 border-emerald-400';
            else if (isSelected) style = 'bg-rose-50 border-rose-300';
            else style = 'bg-white border-stone-200 opacity-60';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${style}`}
            >
              <span className="text-sm font-bold text-stone-800">{opt}</span>
              {answered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {answered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="mt-4 bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
          <p className={`text-sm font-black flex items-center gap-1.5 ${selected === current.correctIndex ? 'text-emerald-700' : 'text-rose-600'}`}>
            {selected === current.correctIndex ? (
              <><CheckCircle2 className="w-4 h-4" /> {t.quizCorrect}</>
            ) : (
              <><XCircle className="w-4 h-4" /> {t.quizIncorrect}</>
            )}
          </p>
          {selected !== current.correctIndex && (
            <p className="text-xs font-bold text-stone-700">
              {t.quizCorrectAnswer}: <span className="text-emerald-700">{displayQuestion.options[current.correctIndex]}</span>
            </p>
          )}
          <p className="text-xs text-stone-600 leading-relaxed">{displayQuestion.explanation}</p>

          <button
            onClick={handleNext}
            className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-sm flex items-center justify-center gap-1.5"
          >
            {isLast ? (
              <><Trophy className="w-4 h-4" /> {t.quizSeeResults}</>
            ) : (
              <>{t.quizNextQuestion} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

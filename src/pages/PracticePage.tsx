import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Trophy, Clock } from "lucide-react";
import PinyinCard from "../components/PinyinCard";
import AnswerInput from "../components/AnswerInput";
import ProgressBar from "../components/ProgressBar";
import FeedbackToast from "../components/FeedbackToast";
import { usePracticeStore } from "../store/usePracticeStore";
import { formatTime } from "../utils/helpers";

export default function PracticePage() {
  const navigate = useNavigate();
  const {
    level,
    wordSource,
    customFileName,
    questions,
    currentIndex,
    totalQuestions,
    score,
    startTime,
    submitAnswer,
    skipQuestion,
    goToNext,
    reset,
  } = usePracticeStore();

  const [elapsed, setElapsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    correctWord: string;
  } | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    if (startTime > 0) {
      const timer = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/");
    }
  }, [questions, navigate]);

  if (questions.length === 0) return null;

  const current = questions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;

  const handleSubmit = (answer: string) => {
    const result = submitAnswer(answer);
    setLastResult(result);
    setInputDisabled(true);
    setTimeout(() => {
      setShowFeedback(true);
    }, 200);
  };

  const handleSkip = () => {
    skipQuestion();
    setLastResult({ isCorrect: false, correctWord: current.word });
    setInputDisabled(true);
    setTimeout(() => {
      setShowFeedback(true);
    }, 200);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setLastResult(null);
    setInputDisabled(false);

    if (isLast) {
      navigate("/result");
    } else {
      goToNext();
    }
  };

  const handleHome = () => {
    reset();
    navigate("/");
  };

  const levelColors: Record<number, string> = {
    1: "bg-sky-100 text-sky-600",
    2: "bg-orange-100 text-orange-600",
    3: "bg-emerald-100 text-emerald-600",
  };

  const levelLabels: Record<number, string> = {
    1: "简单",
    2: "中等",
    3: "困难",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleHome}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all"
            >
              <Home size={20} />
              <span className="font-medium hidden sm:inline">返回首页</span>
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-full font-bold text-sm ${
                  wordSource === "custom"
                    ? "bg-emerald-100 text-emerald-700 max-w-xs truncate"
                    : levelColors[level]
                }`}
                title={wordSource === "custom" ? customFileName : undefined}
              >
                {wordSource === "custom"
                  ? `📄 ${customFileName || "自定义"}`
                  : `${levelLabels[level]}模式`}
              </div>

              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                <Trophy size={18} />
                <span className="font-bold">{Math.round(score)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <Clock size={18} />
                <span className="font-medium">{formatTime(elapsed)}</span>
              </div>
            </div>
          </div>

          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <PinyinCard
            pinyin={current.pinyin}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
          />

          <AnswerInput
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            disabled={inputDisabled}
          />
        </div>

        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                已答{" "}
                <span className="font-bold text-gray-700">
                  {currentIndex + 1}
                </span>{" "}
                / {totalQuestions}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx < currentIndex
                        ? "bg-indigo-400"
                        : idx === currentIndex
                          ? "bg-indigo-500 w-6 rounded"
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FeedbackToast
        show={showFeedback}
        isCorrect={lastResult?.isCorrect ?? null}
        correctWord={lastResult?.correctWord}
        onNext={handleNext}
        isLast={isLast}
      />
    </div>
  );
}

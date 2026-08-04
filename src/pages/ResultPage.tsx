import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RotateCcw, Star, Clock, Target, Award } from "lucide-react";
import WrongItem from "../components/WrongItem";
import { usePracticeStore } from "../store/usePracticeStore";
import {
  formatTime,
  getStarRating,
  getEncouragement,
} from "../utils/helpers";

export default function ResultPage() {
  const navigate = useNavigate();
  const {
    level,
    totalQuestions,
    score,
    correctCount,
    wrongAnswers,
    startTime,
    endTime,
    startPractice,
    reset,
  } = usePracticeStore();

  const [showAnimation, setShowAnimation] = useState(false);

  const correctRate = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const duration = endTime && startTime ? endTime - startTime : 0;
  const stars = getStarRating(correctRate);
  const encouragement = getEncouragement(correctRate);
  const wrongCount = wrongAnswers.length;

  useEffect(() => {
    if (totalQuestions === 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, [totalQuestions, navigate]);

  if (totalQuestions === 0) return null;

  const handleRetry = () => {
    reset();
    setTimeout(() => {
      startPractice();
      navigate("/practice");
    }, 0);
  };

  const handleHome = () => {
    reset();
    navigate("/");
  };

  const levelColors: Record<number, string> = {
    1: "from-sky-400 to-blue-500",
    2: "from-orange-400 to-amber-500",
    3: "from-emerald-400 to-green-500",
  };

  const levelLabels: Record<number, string> = {
    1: "简单",
    2: "中等",
    3: "困难",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl md:text-4xl animate-bounce"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + (i % 3)}s`,
              opacity: 0.2,
            }}
          >
            {["⭐", "🎉", "✨", "🌟", "💫"][i % 5]}
          </div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <div
            className={`inline-block transform transition-all duration-700 ${
              showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="text-7xl md:text-8xl mb-6">
              {correctRate === 1 ? "🏆" : correctRate >= 0.7 ? "🎉" : "💪"}
            </div>
          </div>

          <div
            className={`transform transition-all duration-700 delay-200 ${
              showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">
              练习完成！
            </h1>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${levelColors[level]} text-white font-bold shadow-lg`}>
              {levelLabels[level]}模式
            </div>
          </div>
        </div>

        <div
          className={`bg-white rounded-[2rem] shadow-2xl shadow-purple-100 p-6 md:p-10 mb-8 transform transition-all duration-700 delay-300 ${
            showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={48}
                className={`transform transition-all duration-500 ${
                  i < stars
                    ? "fill-amber-400 text-amber-400 scale-100"
                    : "text-gray-200 scale-90"
                }`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
              />
            ))}
          </div>

          <div className="text-center mb-10">
            <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              {Math.round(score)}
              <span className="text-2xl md:text-3xl text-gray-300 ml-2">分</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">（满分 100 分）</p>
            <p className="text-lg md:text-xl font-bold text-gray-600">
              {encouragement}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
              <Target size={24} className="mx-auto text-emerald-500 mb-2" />
              <div className="text-2xl font-black text-emerald-600">
                {Math.round(correctRate * 100)}%
              </div>
              <div className="text-xs text-gray-500 font-medium">正确率</div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-4 text-center border border-sky-100">
              <Award size={24} className="mx-auto text-sky-500 mb-2" />
              <div className="text-2xl font-black text-sky-600">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-xs text-gray-500 font-medium">答对题数</div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-4 text-center border border-rose-100">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-2xl font-black text-rose-600">
                {wrongCount}
              </div>
              <div className="text-xs text-gray-500 font-medium">答错/跳过</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
              <Clock size={24} className="mx-auto text-amber-500 mb-2" />
              <div className="text-2xl font-black text-amber-600">
                {formatTime(duration)}
              </div>
              <div className="text-xs text-gray-500 font-medium">用时</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-[2px]">
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 md:px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <RotateCcw size={20} />
                    <span>再练一次</span>
                  </button>

                  <button
                    onClick={handleHome}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 md:px-8 py-3 rounded-xl font-bold hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Home size={20} />
                    <span>返回首页</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div
            className={`bg-white rounded-[2rem] shadow-xl shadow-rose-100/50 p-6 md:p-10 transform transition-all duration-700 delay-500 ${
              showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">📖</div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">错题回顾</h2>
                <p className="text-sm text-gray-500">
                  共 {wrongAnswers.length} 道题目需要多加练习
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {wrongAnswers.map((item, idx) => (
                <WrongItem
                  key={idx}
                  index={idx}
                  pinyin={item.pinyin}
                  correctWord={item.correctWord}
                  userAnswer={item.userAnswer}
                />
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-sm text-amber-700 font-medium text-center">
                💡 建议把这些词语多写几遍，下次一定能全对！
              </p>
            </div>
          </div>
        )}

        {wrongAnswers.length === 0 && (
          <div
            className={`bg-gradient-to-r from-emerald-400 to-green-500 rounded-[2rem] shadow-xl p-10 text-center text-white transform transition-all duration-700 delay-500 ${
              showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">全部正确！</h2>
            <p className="text-white/90 text-lg">
              太厉害了，你对这些词语掌握得非常好！<br />
              试试更高难度吧～
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

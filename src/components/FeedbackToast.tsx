import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface FeedbackToastProps {
  show: boolean;
  isCorrect: boolean | null;
  correctWord?: string;
  onNext: () => void;
  isLast: boolean;
}

export default function FeedbackToast({
  show,
  isCorrect,
  correctWord,
  onNext,
  isLast,
}: FeedbackToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div
        className={`relative max-w-md w-full rounded-3xl p-8 shadow-2xl transform transition-all duration-300 ${
          isCorrect
            ? "bg-gradient-to-br from-green-400 to-emerald-500"
            : "bg-gradient-to-br from-rose-400 to-red-500"
        } ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="text-7xl">
            {isCorrect ? "🎉" : "💪"}
          </div>
        </div>

        <div className="text-center text-white pt-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isCorrect ? (
              <CheckCircle2 size={32} className="text-white" />
            ) : (
              <XCircle size={32} className="text-white" />
            )}
            <span className="text-3xl font-bold">
              {isCorrect ? "回答正确！" : "再想想哦～"}
            </span>
          </div>

          {!isCorrect && correctWord && (
            <div className="bg-white/20 rounded-2xl p-4 mb-6 backdrop-blur">
              <p className="text-sm text-white/90 mb-1">正确答案是：</p>
              <p className="text-3xl font-bold" style={{ letterSpacing: "0.15em" }}>
                {correctWord}
              </p>
            </div>
          )}

          {isCorrect && (
            <div className="bg-white/20 rounded-2xl p-4 mb-6 backdrop-blur">
              <p className="text-xl">太棒了！继续保持～ 🌟</p>
            </div>
          )}

          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 w-full bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>{isLast ? "查看成绩" : "下一题"}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface WrongItemProps {
  index: number;
  pinyin: string;
  correctWord: string;
  userAnswer: string;
}

export default function WrongItem({
  index,
  pinyin,
  correctWord,
  userAnswer,
}: WrongItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-red-500 text-white flex items-center justify-center font-bold">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-sm text-gray-400 font-medium">拼音</span>
            <p
              className="text-xl font-bold text-indigo-600"
              style={{ fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}
            >
              {pinyin}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-rose-50 rounded-xl px-4 py-3 border border-rose-100">
              <span className="text-xs text-rose-400 font-medium">你的答案</span>
              <p className="text-lg font-bold text-rose-500" style={{ letterSpacing: "0.1em" }}>
                {userAnswer}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
              <span className="text-xs text-emerald-500 font-medium">正确答案</span>
              <p className="text-lg font-bold text-emerald-600" style={{ letterSpacing: "0.1em" }}>
                {correctWord}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

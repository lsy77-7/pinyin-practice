interface PinyinCardProps {
  pinyin: string;
  questionNumber: number;
  totalQuestions: number;
}

export default function PinyinCard({
  pinyin,
  questionNumber,
  totalQuestions,
}: PinyinCardProps) {
  return (
    <div className="relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-2 rounded-full shadow-lg z-10">
        <span className="font-bold whitespace-nowrap">
          第 {questionNumber} / {totalQuestions} 题 📝
        </span>
      </div>

      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] p-1 shadow-2xl">
        <div className="bg-white rounded-[2.2rem] px-8 py-16 md:py-20">
          <div className="flex justify-center mb-4">
            <span className="text-6xl">✨</span>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-400 mb-4 font-medium">
              请根据拼音写出词语
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {pinyin.split(" ").map((py, idx) => (
                <div
                  key={idx}
                  className="relative"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="bg-gradient-to-b from-sky-50 to-indigo-50 rounded-2xl px-6 py-4 md:px-8 md:py-6 border-2 border-indigo-100 shadow-sm">
                    <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      style={{ fontFamily: "'Comic Sans MS', 'Segoe UI', system-ui, sans-serif" }}
                    >
                      {py}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

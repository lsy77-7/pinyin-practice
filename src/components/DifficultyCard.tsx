import { Star } from "lucide-react";

interface DifficultyCardProps {
  level: 1 | 2 | 3;
  selected: boolean;
  onClick: () => void;
}

const levelConfig = {
  1: {
    title: "简单",
    subtitle: "小学1-2年级",
    color: "from-sky-400 to-blue-500",
    borderColor: "border-sky-400",
    shadow: "shadow-sky-200",
    emoji: "🌱",
    questions: 10,
    stars: 1,
  },
  2: {
    title: "中等",
    subtitle: "小学3-4年级",
    color: "from-orange-400 to-amber-500",
    borderColor: "border-orange-400",
    shadow: "shadow-orange-200",
    emoji: "🌿",
    questions: 15,
    stars: 2,
  },
  3: {
    title: "困难",
    subtitle: "小学5-6年级",
    color: "from-emerald-400 to-green-500",
    borderColor: "border-emerald-400",
    shadow: "shadow-emerald-200",
    emoji: "🌳",
    questions: 20,
    stars: 3,
  },
};

export default function DifficultyCard({ level, selected, onClick }: DifficultyCardProps) {
  const config = levelConfig[level];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-3xl p-6 text-left transition-all duration-300 ${
        selected
          ? `bg-gradient-to-br ${config.color} text-white shadow-xl ${config.shadow} scale-105 border-4 ${config.borderColor}`
          : `bg-white border-2 border-gray-100 hover:scale-105 hover:shadow-lg ${config.shadow}`
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="text-5xl">{config.emoji}</div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`transition-all duration-300 ${
                  i < config.stars
                    ? selected
                      ? "fill-yellow-300 text-yellow-300"
                      : "fill-amber-400 text-amber-400"
                    : selected
                    ? "text-white/40"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3
            className={`text-2xl font-bold mb-1 ${
              selected ? "text-white" : "text-gray-800"
            }`}
          >
            {config.title}
          </h3>
          <p
            className={`text-sm ${
              selected ? "text-white/90" : "text-gray-500"
            }`}
          >
            {config.subtitle}
          </p>
        </div>

        <div
          className={`text-sm font-medium ${
            selected ? "text-white/90" : "text-gray-600"
          }`}
        >
          共 <span className="font-bold">{config.questions}</span> 道题
        </div>

        {selected && (
          <div className="absolute -top-3 -right-3 bg-white rounded-full px-3 py-1 shadow-md">
            <span className="text-sm font-bold text-sky-500">已选 ✓</span>
          </div>
        )}
      </div>
    </button>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-600">
          答题进度
        </span>
        <span className="text-sm font-bold text-indigo-600">
          {current} / {total}
        </span>
      </div>
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: `calc(${percent}% - 10px)` }}
        >
          <div className="w-5 h-5 bg-white rounded-full shadow-md border-2 border-indigo-400 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

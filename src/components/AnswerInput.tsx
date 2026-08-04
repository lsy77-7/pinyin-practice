import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Send, SkipForward } from "lucide-react";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  disabled: boolean;
  autoFocus?: boolean;
}

export default function AnswerInput({
  onSubmit,
  onSkip,
  disabled,
  autoFocus = true,
}: AnswerInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    if (autoFocus && !disabled) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [disabled, autoFocus]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 rounded-3xl blur-lg opacity-50"></div>
        <div className="relative bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-600 mb-3 ml-2">
            ✏️ 在这里写出对应的词语：
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="请输入汉字词语..."
              className="flex-1 text-2xl md:text-3xl px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400"
              style={{ letterSpacing: "0.1em" }}
            />

            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-md"
              >
                <Send size={20} />
                <span>提交</span>
              </button>

              <button
                onClick={onSkip}
                disabled={disabled}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-bold hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                title="跳过本题"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center text-xs text-gray-400 px-2">
            <span>💡 提示：按 Enter 键可以快速提交</span>
            <span>字数：{value.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

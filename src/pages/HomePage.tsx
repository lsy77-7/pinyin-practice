import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  BookOpen,
  Sparkles,
  Upload,
  FileText,
  X,
  Wand2,
  Trash2,
  Database,
} from "lucide-react";
import DifficultyCard from "../components/DifficultyCard";
import { usePracticeStore } from "../store/usePracticeStore";
import {
  readFileAsText,
  parseTextToWordItems,
  EXAMPLE_TEXT,
  wordToPinyin,
} from "../utils/wordImporter";
import { WordItem } from "../data/words";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    level,
    setLevel,
    wordSource,
    setWordSource,
    customWords,
    customFileName,
    setCustomWords,
    clearCustomWords,
    startPractice,
  } = usePracticeStore();

  const [hovered, setHovered] = useState(false);
  const [tab, setTab] = useState<"builtin" | "custom">("builtin");
  const [customInputMode, setCustomInputMode] = useState<"file" | "paste">(
    "file",
  );
  const [pastedText, setPastedText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewWords, setPreviewWords] = useState<WordItem[] | null>(null);
  const [isPreviewingCustom, setIsPreviewingCustom] = useState(false);
  const [newWordInput, setNewWordInput] = useState("");
  const [newWordError, setNewWordError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removePreviewWord = (wordId: number) => {
    if (!previewWords) return;
    const next = previewWords.filter((w) => w.id !== wordId);
    setPreviewWords(next);
  };

  const removeCustomWord = (wordId: number) => {
    const next = customWords.filter((w) => w.id !== wordId);
    setCustomWords(next, customFileName);
  };

  const hasChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text);

  const handleAddCustomWord = () => {
    const trimmed = newWordInput.trim();
    if (!trimmed) {
      setNewWordError("请输入要添加的词语");
      return;
    }
    if (!hasChinese(trimmed)) {
      setNewWordError("词语必须包含中文字符哦");
      return;
    }
    if (trimmed.length > 10) {
      setNewWordError("词语长度建议在 1~10 个字之间");
      return;
    }
    if (!previewWords) return;
    const exists = previewWords.some((w) => w.word === trimmed);
    if (exists) {
      setNewWordError("这个词语已经在列表里啦～");
      return;
    }
    const newItem: WordItem = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      word: trimmed,
      pinyin: wordToPinyin(trimmed),
      level: 2,
    };
    setPreviewWords([...previewWords, newItem]);
    if (isPreviewingCustom) {
      setCustomWords([...customWords, newItem], customFileName);
    }
    setNewWordInput("");
    setNewWordError(null);
  };

  const toggleCustomPreview = (open: boolean) => {
    if (open) {
      setPreviewWords(customWords);
      setIsPreviewingCustom(true);
    } else {
      setPreviewWords(null);
      setIsPreviewingCustom(false);
    }
  };

  const handleStart = () => {
    startPractice();
    navigate("/practice");
  };

  const handleTabChange = (newTab: "builtin" | "custom") => {
    setTab(newTab);
    setWordSource(newTab);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setParseError(null);
    setPreviewWords(null);

    try {
      const text = await readFileAsText(file);
      const result = parseTextToWordItems(text, 2);

      if (result.words.length === 0) {
        setParseError(
          "未能从文件中识别到合适的词语，请确认文件内容是中文文本。",
        );
        setParsing(false);
        return;
      } else {
        setPreviewWords(result.words);
      }
      setParsing(false);
    } catch (err) {
      setParseError("读取文件失败，请重试或换一个文件。");
      setParsing(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setParseError("请先输入一些中文文本！");
      return;
    }
    setParsing(true);
    setParseError(null);
    const result = parseTextToWordItems(pastedText, 2);
    if (result.words.length === 0) {
      setParseError("未能从文本中识别到合适的词语，请输入更多中文内容。");
    } else {
      setPreviewWords(result.words);
    }
    setParsing(false);
  };

  const handleConfirmImport = () => {
    if (!previewWords || previewWords.length === 0) return;
    const fileName =
      customInputMode === "file"
        ? fileInputRef.current?.files?.[0]?.name || "文本导入"
        : "文本导入";
    setCustomWords(previewWords, fileName);
    setPreviewWords(null);
    setIsPreviewingCustom(false);
    setPastedText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancelPreview = () => {
    setPreviewWords(null);
    setPastedText("");
    setIsPreviewingCustom(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUseExample = () => {
    setPastedText(EXAMPLE_TEXT);
    setCustomInputMode("paste");
  };

  const canStart =
    tab === "builtin" || (tab === "custom" && customWords.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-16">
        <header className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-5 py-2 rounded-full shadow-sm mb-6">
            <Sparkles size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-gray-600">
              小学生语文练习工具
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen size={48} className="text-indigo-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              看拼音写词语
            </h1>
            <p
              className="text-xl md:text-2xl font-bold text-gray-400"
              style={{ fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}
            >
              kàn pīn yīn xiě cí yǔ
            </p>
          </div>

          <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            选择内置词库或导入自己的课文，开始词语挑战吧！
            <br />
            多写多练，成为汉字小达人 🌟
          </p>
        </header>

        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl shadow-indigo-100/50 p-2 mb-10">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTabChange("builtin")}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                tab === "builtin"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Database size={20} />
              <span>内置词库</span>
            </button>
            <button
              onClick={() => handleTabChange("custom")}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                tab === "custom"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Upload size={20} />
              <span>自定义导入</span>
              {customWords.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${tab === "custom" ? "bg-white/30" : "bg-emerald-100 text-emerald-600"}`}
                >
                  {customWords.length}词
                </span>
              )}
            </button>
          </div>
        </div>

        {tab === "builtin" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 text-center mb-6 flex items-center justify-center gap-2">
              <span>🎯</span>
              <span>请选择难度等级</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {([1, 2, 3] as const).map((lv) => (
                <DifficultyCard
                  key={lv}
                  level={lv}
                  selected={level === lv && wordSource === "builtin"}
                  onClick={() => {
                    setLevel(lv);
                    setWordSource("builtin");
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {tab === "custom" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 text-center mb-6 flex items-center justify-center gap-2">
              <span>📄</span>
              <span>导入课文或词语</span>
              <span className="text-sm font-normal text-gray-400">
                （自动识别词语+生成拼音）
              </span>
            </h2>

            {customWords.length > 0 && !previewWords && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 mb-6 border-2 border-emerald-200">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl shadow-md">
                      ✅
                    </div>
                    <div>
                      <div className="font-bold text-emerald-800 text-lg">
                        已导入：{customFileName}
                      </div>
                      <div className="text-sm text-emerald-600">
                        共识别出{" "}
                        <span className="font-bold">{customWords.length}</span>{" "}
                        个词语
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCustomPreview(true)}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-emerald-700 bg-white rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors"
                    >
                      <FileText size={16} />
                      <span>预览 / 编辑词语</span>
                    </button>
                    <button
                      onClick={clearCustomWords}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-rose-600 bg-white rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>清除</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {customWords.slice(0, 15).map((w) => (
                    <div
                      key={w.id}
                      className="group bg-white rounded-xl px-3 py-1.5 text-sm border border-emerald-100 flex items-center gap-2 hover:border-rose-300 transition-colors"
                    >
                      <span className="text-gray-700 font-bold">{w.word}</span>
                      <span className="text-emerald-500 text-xs">
                        {w.pinyin}
                      </span>
                      <button
                        onClick={() => removeCustomWord(w.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-600 text-base leading-none"
                        title="移除这个词"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {customWords.length > 15 && (
                    <span className="text-emerald-500 text-sm self-center px-2">
                      +{customWords.length - 15} 个更多...
                    </span>
                  )}
                </div>
              </div>
            )}

            {!previewWords && customWords.length === 0 && (
              <div className="bg-white rounded-3xl shadow-lg shadow-emerald-100/30 p-6 md:p-8 border border-gray-100">
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setCustomInputMode("file")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      customInputMode === "file"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Upload size={18} />
                    上传 .txt 文件
                  </button>
                  <button
                    onClick={() => setCustomInputMode("paste")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      customInputMode === "paste"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FileText size={18} />
                    粘贴文本内容
                  </button>
                </div>

                {customInputMode === "file" ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 md:p-12 text-center cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-400 transition-all group"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={36} className="text-emerald-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-700 mb-1">
                      点击选择文件
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      支持 .txt 文本文件（UTF-8 编码）
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                      <Upload size={16} />
                      选择文件
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,text/plain"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="把你的课文内容粘贴到这里，软件会自动识别中文词语并生成拼音..."
                      className="w-full h-48 md:h-56 px-5 py-4 border-2 border-gray-200 focus:border-emerald-300 rounded-2xl resize-none outline-none text-base leading-relaxed focus:ring-4 focus:ring-emerald-100 bg-gray-50 focus:bg-white transition-all"
                    />
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <button
                        onClick={handleUseExample}
                        className="text-sm text-indigo-500 hover:text-indigo-700 font-medium hover:underline flex items-center gap-1"
                      >
                        <Wand2 size={14} />
                        使用示例文本
                      </button>
                      <div className="text-xs text-gray-400">
                        字数：{pastedText.length}
                      </div>
                    </div>
                    <button
                      onClick={handleParsePastedText}
                      disabled={!pastedText.trim() || parsing}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <Wand2 size={20} />
                      <span>
                        {parsing ? "正在识别..." : "识别词语并生成拼音"}
                      </span>
                    </button>
                  </div>
                )}

                {parseError && (
                  <div className="mt-5 bg-rose-50 text-rose-600 rounded-2xl p-4 border border-rose-200 text-sm">
                    ⚠️ {parseError}
                  </div>
                )}
              </div>
            )}

            {previewWords && (
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-1 flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      {isPreviewingCustom ? "词库编辑" : "识别预览"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isPreviewingCustom ? (
                        <>
                          共{" "}
                          <span className="font-bold text-emerald-600">
                            {previewWords.length}
                          </span>{" "}
                          个词语， 悬停卡片点「×」可删除，完成后直接关闭即可
                        </>
                      ) : (
                        <>
                          共识别出{" "}
                          <span className="font-bold text-emerald-600">
                            {previewWords.length}
                          </span>{" "}
                          个词语，悬停可删除不对的词，确认后开始练习
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isPreviewingCustom ? (
                      <button
                        onClick={handleCancelPreview}
                        className="flex items-center gap-1 px-5 py-2 text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                      >
                        ✅ 完成编辑
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelPreview}
                          className="flex items-center gap-1 px-4 py-2 text-gray-500 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                          <X size={16} />
                          取消
                        </button>
                        <button
                          onClick={handleConfirmImport}
                          disabled={previewWords.length === 0}
                          className="flex items-center gap-1 px-5 py-2 text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:scale-100"
                        >
                          ✅ 确认使用这些词语
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 md:p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-xl">➕</div>
                    <div className="text-base font-black text-gray-700">
                      手动添加词语或成语
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      没识别出的词自己加进来～
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newWordInput}
                        onChange={(e) => {
                          setNewWordInput(e.target.value);
                          if (newWordError) setNewWordError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomWord();
                        }}
                        placeholder="输入词语或成语，比如：全神贯注、春华秋实…（按 Enter 添加）"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-gray-800 font-bold placeholder:text-gray-400 placeholder:font-normal transition-all"
                        maxLength={20}
                      />
                      {newWordError && (
                        <div className="mt-2 text-sm text-rose-500 font-medium px-1">
                          ⚠️ {newWordError}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleAddCustomWord}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Sparkles size={18} />
                      加入词库
                    </button>
                  </div>
                </div>

                {previewWords.length === 0 && (
                  <div className="py-10 text-center text-gray-400">
                    🫧 已删除所有词语，建议重新导入哦～
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {previewWords.map((w) => (
                      <div
                        key={w.id}
                        className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 pr-10 border border-emerald-100 hover:border-rose-300 hover:from-rose-50 hover:to-pink-50 transition-all"
                      >
                        <button
                          onClick={() => {
                            if (isPreviewingCustom) {
                              removeCustomWord(w.id);
                              removePreviewWord(w.id);
                            } else {
                              removePreviewWord(w.id);
                            }
                          }}
                          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-300 hover:text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all text-lg font-bold"
                          title="删除这个词"
                        >
                          ×
                        </button>
                        <div
                          className="font-bold text-lg text-gray-800"
                          style={{ letterSpacing: "0.05em" }}
                        >
                          {w.word}
                        </div>
                        <div
                          className="text-sm text-emerald-600 mt-1"
                          style={{ fontFamily: "'Comic Sans MS', sans-serif" }}
                        >
                          {w.pinyin || wordToPinyin(w.word)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-col items-center">
          <button
            onClick={handleStart}
            disabled={!canStart}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative px-16 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl shadow-purple-200 hover:shadow-purple-300 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Play
                size={28}
                className={`transition-transform duration-300 ${
                  hovered ? "translate-x-1" : ""
                }`}
                fill="white"
              />
              <span className="text-2xl font-black tracking-wide">
                开始练习
              </span>
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
              GO! 🚀
            </div>
          </button>

          {!canStart && tab === "custom" && (
            <p className="mt-4 text-sm text-rose-500 font-medium">
              请先导入课文或上传文件后再开始练习
            </p>
          )}

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-2xl">
            {[
              {
                icon: "📚",
                label:
                  tab === "builtin"
                    ? "150+词库"
                    : `${customWords.length || 0}+自定义`,
              },
              { icon: "⭐", label: "3个等级" },
              { icon: "⏱️", label: "计时模式" },
              { icon: "📊", label: "成绩统计" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-sm font-bold text-gray-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-sm text-gray-400">
            💡 小提示：多多练习，可以巩固汉字记忆哦！
          </p>
        </footer>
      </div>
    </div>
  );
}

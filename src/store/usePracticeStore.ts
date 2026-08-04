import { create } from "zustand";
import { WordItem, getWordsByLevel } from "../data/words";
import { pickRandomWords, getQuestionCount } from "../utils/helpers";

export type WordSource = "builtin" | "custom";

export interface WrongAnswer {
  pinyin: string;
  correctWord: string;
  userAnswer: string;
}

export interface AnswerRecord {
  wordId: number;
  userAnswer: string;
  isCorrect: boolean;
}

interface PracticeState {
  level: 1 | 2 | 3;
  currentIndex: number;
  questions: WordItem[];
  totalQuestions: number;
  score: number;
  correctCount: number;
  wrongAnswers: WrongAnswer[];
  answers: AnswerRecord[];
  startTime: number;
  endTime: number | null;

  wordSource: WordSource;
  customWords: WordItem[];
  customFileName: string;

  setLevel: (level: 1 | 2 | 3) => void;
  setWordSource: (source: WordSource) => void;
  setCustomWords: (words: WordItem[], fileName?: string) => void;
  clearCustomWords: () => void;

  startPractice: () => void;
  submitAnswer: (answer: string) => { isCorrect: boolean; correctWord: string };
  skipQuestion: () => void;
  goToNext: () => void;
  reset: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  level: 1,
  currentIndex: 0,
  questions: [],
  totalQuestions: 10,
  score: 0,
  correctCount: 0,
  wrongAnswers: [],
  answers: [],
  startTime: 0,
  endTime: null,

  wordSource: "builtin",
  customWords: [],
  customFileName: "",

  setLevel: (level) => {
    set({ level });
  },

  setWordSource: (source) => {
    set({ wordSource: source });
  },

  setCustomWords: (words, fileName) => {
    set({
      customWords: words,
      customFileName: fileName || "自定义词库",
      wordSource: "custom",
    });
  },

  clearCustomWords: () => {
    set({
      customWords: [],
      customFileName: "",
      wordSource: "builtin",
    });
  },

  startPractice: () => {
    const { level, wordSource, customWords } = get();
    let allWords: WordItem[];

    if (wordSource === "custom" && customWords.length > 0) {
      allWords = customWords;
    } else {
      allWords = getWordsByLevel(level);
    }

    const baseCount =
      wordSource === "custom"
        ? Math.min(15, Math.max(5, Math.floor(customWords.length / 2)))
        : getQuestionCount(level);
    const count = Math.min(baseCount, allWords.length);
    const selected = pickRandomWords(allWords, count);

    set({
      questions: selected,
      totalQuestions: selected.length,
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      wrongAnswers: [],
      answers: [],
      startTime: Date.now(),
      endTime: null,
    });
  },

  submitAnswer: (answer) => {
    const {
      questions,
      currentIndex,
      score,
      correctCount,
      wrongAnswers,
      answers,
      totalQuestions,
    } = get();
    const current = questions[currentIndex];
    const trimmedAnswer = answer.trim();
    const isCorrect = trimmedAnswer === current.word;

    const pointsPerQuestion = 100 / totalQuestions;
    const scoreIncrement = isCorrect ? pointsPerQuestion : 0;

    const newWrongAnswers = isCorrect
      ? wrongAnswers
      : [
          ...wrongAnswers,
          {
            pinyin: current.pinyin,
            correctWord: current.word,
            userAnswer: trimmedAnswer || "(未作答)",
          },
        ];

    const isLast = currentIndex === questions.length - 1;
    set({
      score: Math.round((score + scoreIncrement) * 100) / 100,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
      wrongAnswers: newWrongAnswers,
      answers: [
        ...answers,
        {
          wordId: current.id,
          userAnswer: trimmedAnswer,
          isCorrect,
        },
      ],
      endTime: isLast ? Date.now() : null,
    });

    return { isCorrect, correctWord: current.word };
  },

  skipQuestion: () => {
    const { questions, currentIndex, wrongAnswers, answers } = get();
    const current = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    set({
      wrongAnswers: [
        ...wrongAnswers,
        {
          pinyin: current.pinyin,
          correctWord: current.word,
          userAnswer: "(跳过)",
        },
      ],
      answers: [
        ...answers,
        {
          wordId: current.id,
          userAnswer: "",
          isCorrect: false,
        },
      ],
      endTime: isLast ? Date.now() : null,
    });
  },

  goToNext: () => {
    const { currentIndex, totalQuestions } = get();
    if (currentIndex < totalQuestions - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  reset: () => {
    set({
      currentIndex: 0,
      questions: [],
      totalQuestions: 10,
      score: 0,
      correctCount: 0,
      wrongAnswers: [],
      answers: [],
      startTime: 0,
      endTime: null,
    });
  },
}));

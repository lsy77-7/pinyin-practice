import { WordItem } from "../data/words";

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandomWords(words: WordItem[], count: number): WordItem[] {
  const shuffled = shuffleArray(words);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}

export function getStarRating(correctRate: number): number {
  if (correctRate >= 0.95) return 5;
  if (correctRate >= 0.85) return 4;
  if (correctRate >= 0.7) return 3;
  if (correctRate >= 0.5) return 2;
  return 1;
}

export function getEncouragement(correctRate: number): string {
  if (correctRate === 1) return "太棒了！全部答对，你是小天才！🎉";
  if (correctRate >= 0.9) return "非常优秀！继续加油！⭐";
  if (correctRate >= 0.75) return "做得不错！再接再厉！💪";
  if (correctRate >= 0.6) return "有进步！多多练习会更好！📚";
  return "别灰心！熟能生巧，再试一次吧！🌈";
}

export function getQuestionCount(level: 1 | 2 | 3): number {
  switch (level) {
    case 1:
      return 10;
    case 2:
      return 15;
    case 3:
      return 20;
    default:
      return 10;
  }
}

// Picks and shuffles questions for a round. Shared by Guess the Output and Debug It.
import type { Lang } from "./highlight";
import type { Difficulty } from "./questionBank";

export type LangFilter = Lang | "all";
export type DifficultyFilter = Difficulty | "mixed";

export function shuffle<T>(list: T[], random: () => number = Math.random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRound<T extends { lang: Lang; difficulty: Difficulty }>(
  bank: T[],
  lang: LangFilter,
  difficulty: DifficultyFilter,
  size: number,
  random: () => number = Math.random,
): T[] {
  const pool = bank.filter((q) => (lang === "all" || q.lang === lang) && (difficulty === "mixed" || q.difficulty === difficulty));
  return shuffle(pool, random).slice(0, size);
}

export function countAvailable<T extends { lang: Lang; difficulty: Difficulty }>(bank: T[], lang: LangFilter, difficulty: DifficultyFilter): number {
  return bank.filter((q) => (lang === "all" || q.lang === lang) && (difficulty === "mixed" || q.difficulty === difficulty)).length;
}

/** Shuffles four options and returns them with the new index of the answer. */
export function shuffleOptions(options: readonly string[], answer: number, random: () => number = Math.random) {
  const order = shuffle([0, 1, 2, 3], random);
  return { options: order.map((i) => options[i]), answer: order.indexOf(answer) };
}

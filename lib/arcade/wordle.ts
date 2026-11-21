import { ANSWERS } from "./words";
import { DICTIONARY } from "./dictionary";
import { dayIndex } from "./daily";

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type TileState = "correct" | "present" | "absent";

const ALLOWED = new Set(DICTIONARY.toUpperCase().split(" "));

export function isValidGuess(word: string): boolean {
  return word.length === WORD_LENGTH && ALLOWED.has(word.toUpperCase());
}

/**
 * Colours one guess against the answer using standard Wordle rules for
 * repeated letters: exact matches are marked first, then each remaining letter
 * is "present" only while unmatched copies of it are left in the answer.
 */
export function scoreGuess(guess: string, answer: string): TileState[] {
  const g = guess.toUpperCase();
  const a = answer.toUpperCase();
  const result: TileState[] = Array(WORD_LENGTH).fill("absent");
  const remaining: Record<string, number> = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (g[i] === a[i]) result[i] = "correct";
    else remaining[a[i]] = (remaining[a[i]] ?? 0) + 1;
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    if ((remaining[g[i]] ?? 0) > 0) {
      result[i] = "present";
      remaining[g[i]] -= 1;
    }
  }
  return result;
}

/** Best known state per letter, for colouring the keyboard. */
export function keyboardStates(guesses: string[], answer: string): Record<string, TileState> {
  const rank: Record<TileState, number> = { absent: 0, present: 1, correct: 2 };
  const out: Record<string, TileState> = {};
  for (const guess of guesses) {
    scoreGuess(guess, answer).forEach((state, i) => {
      const letter = guess[i];
      if (!out[letter] || rank[state] > rank[out[letter]]) out[letter] = state;
    });
  }
  return out;
}

// Fixed-seed shuffle so the daily order is not alphabetical but is identical
// for every visitor and every build.
function seededOrder(list: string[], seed: number): string[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const DAILY_ORDER = seededOrder(ANSWERS, 20270101);

/** The daily answer for an IST date key. Same for every visitor. */
export function dailyAnswer(key: string): string {
  const n = DAILY_ORDER.length;
  const i = ((dayIndex(key) % n) + n) % n;
  return DAILY_ORDER[i];
}

/** A random practice answer, avoiding `exclude` when possible. */
export function practiceAnswer(exclude: string[] = [], random: () => number = Math.random): string {
  const pool = ANSWERS.filter((w) => !exclude.includes(w));
  const list = pool.length ? pool : ANSWERS;
  return list[Math.floor(random() * list.length)];
}

const EMOJI: Record<TileState, string> = { correct: "🟩", present: "🟨", absent: "⬛" };

/** Wordle-style share text. Shows colours only, never the answer. */
export function shareText(opts: { guesses: string[]; answer: string; won: boolean; label: string; hints: number }): string {
  const score = opts.won ? `${opts.guesses.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  const rows = opts.guesses.map((g) => scoreGuess(g, opts.answer).map((s) => EMOJI[s]).join(""));
  const hint = opts.hints ? ` (${opts.hints} hint${opts.hints > 1 ? "s" : ""})` : "";
  return [`Omm's Dev Arcade · Tech Wordle ${opts.label} ${score}${hint}`, "", ...rows].join("\n");
}

/** Position and letter for the next hint: the first letter not yet found. */
export function nextHint(guesses: string[], answer: string, revealed: number[]): { index: number; letter: string } | null {
  const found = new Set<number>(revealed);
  for (const g of guesses) {
    scoreGuess(g, answer).forEach((s, i) => s === "correct" && found.add(i));
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (!found.has(i)) return { index: i, letter: answer[i] };
  }
  return null;
}

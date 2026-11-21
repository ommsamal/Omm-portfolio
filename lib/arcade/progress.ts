// Player progress: XP, levels, streaks, statistics and achievements.
// Everything here is pure: functions take a profile and return a new one, so
// the rules can be tested without a browser.
import { previousDateKey } from "./daily";

export type GameId = "wordle" | "quiz" | "debug" | "snake";

export type RoundStats = {
  played: number; // rounds finished
  answered: number;
  correct: number;
  bestScore: number;
  bestTotal: number;
  perfectRounds: number;
};

export type WordleGame = {
  answer: string;
  guesses: string[];
  hints: number[]; // revealed letter positions
  done: boolean;
  won: boolean;
};

export type Profile = {
  version: 1;
  name: string;
  xp: number;
  awarded: Record<string, number>; // challenge key -> XP already given
  streak: { current: number; best: number; lastDate: string | null };
  wordle: { played: number; wins: number; currentStreak: number; maxStreak: number; distribution: number[] };
  wordleDaily: Record<string, WordleGame>; // by IST date, last 7 kept
  wordlePractice: WordleGame | null;
  quiz: RoundStats;
  debug: RoundStats;
  snake: { played: number; highScore: number };
  achievements: Record<string, string>; // id -> date unlocked
};

const emptyRound = (): RoundStats => ({ played: 0, answered: 0, correct: 0, bestScore: 0, bestTotal: 0, perfectRounds: 0 });

export function newProfile(): Profile {
  return {
    version: 1,
    name: "Visitor",
    xp: 0,
    awarded: {},
    streak: { current: 0, best: 0, lastDate: null },
    wordle: { played: 0, wins: 0, currentStreak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] },
    wordleDaily: {},
    wordlePractice: null,
    quiz: emptyRound(),
    debug: emptyRound(),
    snake: { played: 0, highScore: 0 },
    achievements: {},
  };
}

/** Fills in any fields missing from older or damaged saved data. */
export function normalizeProfile(raw: unknown): Profile {
  const base = newProfile();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Profile>;
  return {
    ...base,
    ...r,
    version: 1,
    name: typeof r.name === "string" && r.name.trim() ? r.name.slice(0, 24) : base.name,
    xp: Number.isFinite(r.xp) ? Math.max(0, Number(r.xp)) : 0,
    awarded: { ...(r.awarded ?? {}) },
    streak: { ...base.streak, ...(r.streak ?? {}) },
    wordle: {
      ...base.wordle,
      ...(r.wordle ?? {}),
      distribution: Array.isArray(r.wordle?.distribution) && r.wordle!.distribution.length === 6 ? r.wordle!.distribution : base.wordle.distribution,
    },
    wordleDaily: { ...(r.wordleDaily ?? {}) },
    quiz: { ...base.quiz, ...(r.quiz ?? {}) },
    debug: { ...base.debug, ...(r.debug ?? {}) },
    snake: { ...base.snake, ...(r.snake ?? {}) },
    achievements: { ...(r.achievements ?? {}) },
  };
}

// ---------- XP values ----------
export const XP = {
  wordleSolved: 100,
  wordleSolvedFast: 150, // solved in three attempts or fewer (total, not extra)
  wordleHintPenalty: 20, // per hint, taken off that game's reward
  wordleMinWin: 40,
  correctOutput: 20,
  correctDebug: 30,
  completeGame: 25,
  dailyBonus: 50,
  snakeMilestones: [
    { score: 10, xp: 25 },
    { score: 25, xp: 50 },
    { score: 50, xp: 100 },
  ],
} as const;

// ---------- Levels ----------
export const LEVELS = [
  { name: "Script Kiddie", min: 0 },
  { name: "Code Explorer", min: 200 },
  { name: "Bug Hunter", min: 500 },
  { name: "Code Wizard", min: 1000 },
  { name: "Legendary Developer", min: 2000 },
] as const;

export function levelFor(xp: number) {
  let index = 0;
  LEVELS.forEach((l, i) => {
    if (xp >= l.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return {
    index,
    name: current.name,
    min: current.min,
    next: next ? { name: next.name, min: next.min } : null,
    toNext: next ? next.min - xp : 0,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

// ---------- Awards ----------
/**
 * Gives XP for a challenge once. Repeating the same challenge (same key) gives
 * nothing, which stops replaying a solved puzzle from farming XP.
 */
export function award(p: Profile, key: string, amount: number): { profile: Profile; gained: number } {
  if (amount <= 0 || key in p.awarded) return { profile: p, gained: 0 };
  return {
    profile: { ...p, xp: p.xp + amount, awarded: { ...p.awarded, [key]: amount } },
    gained: amount,
  };
}

/** Counts today towards the daily streak (any finished game counts). */
export function recordActivity(p: Profile, today: string): Profile {
  const { lastDate, current, best } = p.streak;
  if (lastDate === today) return p;
  const next = lastDate === previousDateKey(today) ? current + 1 : 1;
  return { ...p, streak: { current: next, best: Math.max(best, next), lastDate: today } };
}

/** The streak to display: it lapses if the player missed a whole day. */
export function liveStreak(p: Profile, today: string): number {
  const { lastDate, current } = p.streak;
  if (lastDate === today || lastDate === previousDateKey(today)) return current;
  return 0;
}

export function recordWordleResult(p: Profile, won: boolean, attempts: number): Profile {
  const w = { ...p.wordle, distribution: [...p.wordle.distribution] };
  w.played += 1;
  if (won) {
    w.wins += 1;
    w.currentStreak += 1;
    w.maxStreak = Math.max(w.maxStreak, w.currentStreak);
    w.distribution[attempts - 1] += 1;
  } else {
    w.currentStreak = 0;
  }
  return { ...p, wordle: w };
}

/** XP for one finished Wordle game, before the daily bonus. */
export function wordleReward(won: boolean, attempts: number, hints: number): number {
  if (!won) return XP.completeGame;
  const base = attempts <= 3 ? XP.wordleSolvedFast : XP.wordleSolved;
  return Math.max(XP.wordleMinWin, base - hints * XP.wordleHintPenalty);
}

export function recordRound(p: Profile, game: "quiz" | "debug", score: number, total: number): Profile {
  const s = { ...p[game] };
  s.played += 1;
  if (total > 0 && (score / total > s.bestScore / (s.bestTotal || 1) || s.bestTotal === 0)) {
    s.bestScore = score;
    s.bestTotal = total;
  }
  if (total > 0 && score === total) s.perfectRounds += 1;
  return { ...p, [game]: s };
}

export function recordAnswer(p: Profile, game: "quiz" | "debug", correct: boolean): Profile {
  const s = { ...p[game], answered: p[game].answered + 1, correct: p[game].correct + (correct ? 1 : 0) };
  return { ...p, [game]: s };
}

export function recordSnake(p: Profile, score: number): Profile {
  return { ...p, snake: { played: p.snake.played + 1, highScore: Math.max(p.snake.highScore, score) } };
}

/** Keeps only the most recent daily Wordle games so storage stays small. */
export function pruneDaily(p: Profile, keep = 7): Profile {
  const keys = Object.keys(p.wordleDaily).sort();
  if (keys.length <= keep) return p;
  const wordleDaily: Record<string, WordleGame> = {};
  keys.slice(-keep).forEach((k) => (wordleDaily[k] = p.wordleDaily[k]));
  return { ...p, wordleDaily };
}

export function gamesPlayed(p: Profile): Record<GameId, number> {
  return { wordle: p.wordle.played, quiz: p.quiz.played, debug: p.debug.played, snake: p.snake.played };
}

// ---------- Achievements ----------
export type Achievement = { id: string; name: string; description: string; earned: (p: Profile) => boolean };

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-win", name: "First Win", description: "Solve your first Tech Wordle.", earned: (p) => p.wordle.wins >= 1 },
  { id: "word-master", name: "Word Master", description: "Solve 10 Tech Wordles.", earned: (p) => p.wordle.wins >= 10 },
  { id: "bug-hunter", name: "Bug Hunter", description: "Fix 10 bugs in Debug It.", earned: (p) => p.debug.correct >= 10 },
  {
    id: "perfect-streak",
    name: "Perfect Streak",
    description: "Get every question right in a Guess the Output or Debug It round.",
    earned: (p) => p.quiz.perfectRounds + p.debug.perfectRounds >= 1,
  },
  { id: "daily-challenger", name: "Daily Challenger", description: "Play the arcade three days in a row.", earned: (p) => p.streak.best >= 3 },
  { id: "snake-charmer", name: "Snake Charmer", description: "Score 25 points in Snake.", earned: (p) => p.snake.highScore >= 25 },
  {
    id: "arcade-champion",
    name: "Arcade Champion",
    description: "Play all four games and reach Code Wizard (1,000 XP).",
    earned: (p) => Object.values(gamesPlayed(p)).every((n) => n > 0) && p.xp >= 1000,
  },
];

export function evaluateAchievements(p: Profile, today: string): { profile: Profile; unlocked: Achievement[] } {
  const unlocked = ACHIEVEMENTS.filter((a) => !p.achievements[a.id] && a.earned(p));
  if (!unlocked.length) return { profile: p, unlocked };
  const achievements = { ...p.achievements };
  unlocked.forEach((a) => (achievements[a.id] = today));
  return { profile: { ...p, achievements }, unlocked };
}

// Unit tests for the arcade's game logic. Run with: npx tsx scripts/test-arcade.ts
import assert from "node:assert/strict";
import { scoreGuess, isValidGuess, dailyAnswer, keyboardStates, shareText, nextHint, practiceAnswer } from "../lib/arcade/wordle";
import { ANSWERS } from "../lib/arcade/words";
import { dateKey, dayIndex, previousDateKey, msUntilNextDay } from "../lib/arcade/daily";
import {
  newProfile, award, levelFor, recordActivity, liveStreak, recordWordleResult, wordleReward,
  evaluateAchievements, recordRound, recordAnswer, recordSnake, normalizeProfile, pruneDaily, XP,
} from "../lib/arcade/progress";
import { createGame, step, turn, tickInterval, placeFood, type SnakeState } from "../lib/arcade/snake";
import { pickRound, shuffleOptions } from "../lib/arcade/rounds";
import { OUTPUT_QUESTIONS } from "../lib/arcade/questionBank";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
}
const s = (g: string, a: string) => scoreGuess(g, a).map((x) => (x === "correct" ? "G" : x === "present" ? "Y" : "-")).join("");

console.log("Tech Wordle");
test("exact match is all green", () => assert.equal(s("REACT", "REACT"), "GGGGG"));
test("letters in wrong places are yellow", () => assert.equal(s("CRATE", "REACT"), "YYGYY"));
test("absent letters are grey", () => assert.equal(s("BLIMP", "REACT"), "-----"));
test("duplicate in guess, single in answer: green wins, extra is grey", () => assert.equal(s("ERROR", "REACT"), "YY---"));
test("repeated letter in guess: the placed copy is green, other copies grey", () => assert.equal(s("EERIE", "REACT"), "-GY--"));
test("duplicate in guess, single in answer: later exact match takes it", () => assert.equal(s("STASH", "TRASH"), "-YGGG"));
test("duplicate in answer, single in guess", () => assert.equal(s("CLASS", "STASH"), "--GGY"));
test("duplicates on both sides", () => assert.equal(s("SPEED", "EERIE"), "--YY-"));
test("three of a letter against two", () => assert.equal(s("EEEAB", "ABEEE"), "YYGYY"));
test("green consumes before yellow", () => assert.equal(s("LLAMA", "HELLO"), "YY---"));
test("keyboard keeps the best state per letter", () => {
  const k = keyboardStates(["CRATE", "REACT"], "REACT");
  assert.equal(k.R, "correct");
  assert.equal(k.C, "correct");
});
test("guess validation", () => {
  assert.ok(isValidGuess("crane"));
  assert.ok(isValidGuess("ASYNC"));
  assert.ok(!isValidGuess("ABCDE"));
  assert.ok(!isValidGuess("REAC"));
  assert.ok(!isValidGuess("REACTS"));
});
test("every answer is five letters, unique and an accepted guess", () => {
  assert.equal(new Set(ANSWERS).size, ANSWERS.length);
  ANSWERS.forEach((w) => {
    assert.match(w, /^[A-Z]{5}$/);
    assert.ok(isValidGuess(w), w);
  });
});
test("share text has colours and never the answer", () => {
  const t = shareText({ guesses: ["CRATE", "REACT"], answer: "REACT", won: true, label: "2026-11-21", hints: 0 });
  assert.ok(t.includes("2/6"));
  assert.ok(!t.includes("REACT"));
  assert.ok(t.includes("🟩🟩🟩🟩🟩"));
});
test("hint reveals the first letter not yet found", () => {
  assert.deepEqual(nextHint(["RXXXX".replace(/X/g, "Z")], "REACT", []), { index: 1, letter: "E" });
  assert.deepEqual(nextHint([], "REACT", [0, 1]), { index: 2, letter: "A" });
});
test("practice answer avoids excluded words", () => {
  const ex = ANSWERS.slice(1);
  assert.equal(practiceAnswer(ex), ANSWERS[0]);
});

console.log("Daily challenge");
test("same answer for every visitor at the same moment, whatever their time zone", () => {
  const instant = new Date("2026-11-21T10:00:00Z");
  // dateKey always uses IST, so the visitor's own clock does not matter.
  assert.equal(dateKey(instant), "2026-11-21");
  assert.equal(dailyAnswer(dateKey(instant)), dailyAnswer("2026-11-21"));
});
test("IST rolls over at local midnight", () => {
  assert.equal(dateKey(new Date("2026-11-21T18:29:59Z")), "2026-11-21");
  assert.equal(dateKey(new Date("2026-11-21T18:30:00Z")), "2026-11-22");
});
test("daily answer is deterministic and changes day to day", () => {
  assert.equal(dailyAnswer("2026-11-21"), dailyAnswer("2026-11-21"));
  const week = ["2026-11-21", "2026-11-22", "2026-11-23", "2026-11-24", "2026-11-25"].map(dailyAnswer);
  assert.equal(new Set(week).size, week.length);
});
test("no answer repeats within one full cycle", () => {
  const seen = new Set<string>();
  let key = "2027-06-01";
  for (let i = 0; i < ANSWERS.length; i++) {
    seen.add(dailyAnswer(key));
    key = previousDateKey(key);
  }
  assert.equal(seen.size, ANSWERS.length);
});
test("date helpers", () => {
  assert.equal(dayIndex("2026-01-01"), 0);
  assert.equal(previousDateKey("2026-03-01"), "2026-02-28");
  assert.equal(msUntilNextDay(new Date("2026-11-21T18:29:00Z")), 60_000);
});

console.log("XP and levels");
test("award gives XP once per challenge key", () => {
  let p = newProfile();
  let r = award(p, "wordle:daily:2026-11-21", 150);
  assert.equal(r.gained, 150);
  p = r.profile;
  r = award(p, "wordle:daily:2026-11-21", 150);
  assert.equal(r.gained, 0);
  assert.equal(r.profile.xp, 150);
});
test("Wordle rewards follow the brief", () => {
  assert.equal(wordleReward(true, 4, 0), 100);
  assert.equal(wordleReward(true, 3, 0), 150);
  assert.equal(wordleReward(true, 1, 0), 150);
  assert.equal(wordleReward(false, 6, 0), XP.completeGame);
  assert.equal(wordleReward(true, 5, 1), 80);
  assert.equal(wordleReward(true, 5, 5), XP.wordleMinWin);
});
test("level thresholds", () => {
  assert.equal(levelFor(0).name, "Script Kiddie");
  assert.equal(levelFor(199).name, "Script Kiddie");
  assert.equal(levelFor(200).name, "Code Explorer");
  assert.equal(levelFor(499).name, "Code Explorer");
  assert.equal(levelFor(500).name, "Bug Hunter");
  assert.equal(levelFor(1000).name, "Code Wizard");
  assert.equal(levelFor(1999).name, "Code Wizard");
  assert.equal(levelFor(2000).name, "Legendary Developer");
  assert.equal(levelFor(5000).next, null);
  assert.equal(levelFor(350).toNext, 150);
  assert.equal(levelFor(350).progress, 0.5);
});

console.log("Streaks, stats and achievements");
test("daily streak counts consecutive days and resets after a gap", () => {
  let p = newProfile();
  p = recordActivity(p, "2026-11-20");
  p = recordActivity(p, "2026-11-20");
  p = recordActivity(p, "2026-11-21");
  assert.equal(p.streak.current, 2);
  assert.equal(liveStreak(p, "2026-11-22"), 2);
  assert.equal(liveStreak(p, "2026-11-23"), 0);
  p = recordActivity(p, "2026-11-24");
  assert.equal(p.streak.current, 1);
  assert.equal(p.streak.best, 2);
});
test("Wordle statistics", () => {
  let p = newProfile();
  p = recordWordleResult(p, true, 3);
  p = recordWordleResult(p, true, 5);
  p = recordWordleResult(p, false, 6);
  assert.deepEqual(
    [p.wordle.played, p.wordle.wins, p.wordle.currentStreak, p.wordle.maxStreak, p.wordle.distribution.join("")],
    [3, 2, 0, 2, "001010"],
  );
});
test("round stats keep the best score and count perfect rounds", () => {
  let p = newProfile();
  p = recordRound(p, "quiz", 5, 8);
  p = recordRound(p, "quiz", 3, 8);
  p = recordRound(p, "quiz", 3, 3);
  assert.equal(p.quiz.bestScore, 3);
  assert.equal(p.quiz.bestTotal, 3);
  assert.equal(p.quiz.perfectRounds, 1);
});
test("achievements unlock once", () => {
  let p = recordWordleResult(newProfile(), true, 2);
  let r = evaluateAchievements(p, "2026-11-21");
  assert.deepEqual(r.unlocked.map((a) => a.id), ["first-win"]);
  r = evaluateAchievements(r.profile, "2026-11-22");
  assert.equal(r.unlocked.length, 0);
  p = r.profile;
  for (let i = 0; i < 10; i++) p = recordAnswer(p, "debug", true);
  p = recordSnake(p, 30);
  assert.deepEqual(evaluateAchievements(p, "2026-11-22").unlocked.map((a) => a.id), ["bug-hunter", "snake-charmer"]);
});
test("damaged saved data falls back safely", () => {
  assert.equal(normalizeProfile(null).name, "Visitor");
  assert.equal(normalizeProfile({ xp: "lots", name: "" }).xp, 0);
  assert.equal(normalizeProfile({ xp: 300, name: "Omm" }).name, "Omm");
});
test("only the last 7 daily games are kept", () => {
  const p = newProfile();
  for (let d = 1; d <= 10; d++) p.wordleDaily[`2026-11-${String(d).padStart(2, "0")}`] = { answer: "REACT", guesses: [], hints: [], done: true, won: true };
  assert.deepEqual(Object.keys(pruneDaily(p).wordleDaily).sort()[0], "2026-11-04");
});

console.log("Snake");
const fixed = () => 0;
test("moves one cell per step", () => {
  const g = createGame(10, fixed);
  const n = step({ ...g, food: { x: 0, y: 0 } });
  assert.deepEqual(n.snake[0], { x: 6, y: 5 });
  assert.equal(n.snake.length, 3);
});
test("eating food grows the snake and scores", () => {
  const g: SnakeState = { ...createGame(10, fixed), food: { x: 6, y: 5 } };
  const n = step(g, fixed);
  assert.equal(n.score, 1);
  assert.equal(n.snake.length, 4);
  assert.ok(!n.snake.some((p) => p.x === n.food.x && p.y === n.food.y));
});
test("hitting a wall ends the game", () => {
  let g: SnakeState = { ...createGame(10, fixed), food: { x: 0, y: 0 } };
  for (let i = 0; i < 6 && !g.over; i++) g = step(g, fixed);
  assert.ok(g.over);
});
test("reversing into itself is ignored", () => {
  const g = turn(createGame(10, fixed), "left");
  assert.equal(g.queued.length, 0);
});
test("running into its own body ends the game", () => {
  const g: SnakeState = {
    ...createGame(10, fixed),
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }],
    direction: "right",
    queued: ["down"],
    food: { x: 0, y: 0 },
  };
  assert.ok(step(g).over);
});
test("following its own tail is allowed", () => {
  const g: SnakeState = {
    ...createGame(10, fixed),
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 6 }],
    direction: "right",
    queued: ["down"],
    food: { x: 0, y: 0 },
  };
  assert.ok(!step(g).over);
});
test("food never lands on the snake and speed increases", () => {
  const body = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  for (let i = 0; i < 50; i++) {
    const f = placeFood(3, body);
    assert.ok(!body.some((p) => p.x === f.x && p.y === f.y));
  }
  assert.ok(tickInterval(10) < tickInterval(0));
  assert.ok(tickInterval(1000) >= 65);
});

console.log("Rounds");
test("round picking respects filters", () => {
  const r = pickRound(OUTPUT_QUESTIONS, "python", "easy", 8);
  assert.ok(r.length > 0 && r.every((q) => q.lang === "python" && q.difficulty === "easy"));
  assert.equal(pickRound(OUTPUT_QUESTIONS, "all", "mixed", 8).length, 8);
});
test("shuffled options keep the right answer", () => {
  for (let i = 0; i < 20; i++) {
    const r = shuffleOptions(["a", "b", "c", "d"], 2);
    assert.equal(r.options[r.answer], "c");
  }
});

console.log(`\n${passed} tests passed`);

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Check, Lightbulb, RotateCcw, Share2, Shuffle } from "lucide-react";
import { dailyAnswer, isValidGuess, keyboardStates, nextHint, practiceAnswer, shareText, MAX_ATTEMPTS, WORD_LENGTH } from "@/lib/arcade/wordle";
import { formatCountdown, msUntilNextDay } from "@/lib/arcade/daily";
import { recordWordleResult, wordleReward, XP, type Profile, type WordleGame } from "@/lib/arcade/progress";
import { useArcade, type XPAward } from "../ArcadeProvider";
import { GameHeader, StatBox } from "../shared/ui";
import WordGrid, { REVEAL_STEP_MS } from "./WordGrid";
import Keyboard, { releaseFocus } from "./Keyboard";

type Mode = "daily" | "practice";
const MAX_HINTS = 2;
const PRAISE = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];

const fresh = (answer: string): WordleGame => ({ answer, guesses: [], hints: [], done: false, won: false });

function withGame(p: Profile, mode: Mode, today: string, g: WordleGame): Profile {
  return mode === "daily" ? { ...p, wordleDaily: { ...p.wordleDaily, [today]: g } } : { ...p, wordlePractice: g };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TechWordle() {
  const { profile, ready, today, commit, sound } = useArcade();
  const [mode, setMode] = useState<Mode>("daily");
  const [game, setGame] = useState<WordleGame | null>(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastXP, setLastXP] = useState<number | null>(null);
  const [copied, setCopied] = useState<"idle" | "copied" | "manual">("idle");
  const [countdown, setCountdown] = useState("");
  const [announce, setAnnounce] = useState("");
  const profileRef = useRef(profile);
  profileRef.current = profile;

  // Load (or start) the game for the chosen mode.
  useEffect(() => {
    if (!ready || !today) return;
    const p = profileRef.current;
    let g: WordleGame;
    if (mode === "daily") g = p.wordleDaily[today] ?? fresh(dailyAnswer(today));
    else g = p.wordlePractice ?? fresh(practiceAnswer());
    if (mode === "practice" && !p.wordlePractice) commit((q) => ({ ...q, wordlePractice: g }));
    setGame(g);
    setInput("");
    setMessage("");
    setRevealRow(-1);
    setShowResult(g.done);
    setLastXP(null);
    setCopied("idle");
  }, [ready, today, mode, commit]);

  // Countdown to the next daily puzzle.
  useEffect(() => {
    if (mode !== "daily" || !game?.done) return;
    const tick = () => setCountdown(formatCountdown(msUntilNextDay()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [mode, game?.done]);

  const flash = useCallback((text: string) => {
    setMessage(text);
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
  }, []);

  const addLetter = useCallback(
    (l: string) => {
      if (!game || game.done || busy) return;
      setMessage("");
      setInput((v) => (v.length < WORD_LENGTH ? v + l.toUpperCase() : v));
      sound("key");
    },
    [game, busy, sound],
  );

  const removeLetter = useCallback(() => {
    if (!game || game.done || busy) return;
    setInput((v) => v.slice(0, -1));
  }, [game, busy]);

  const submit = useCallback(() => {
    if (!game || game.done || busy) return;
    if (input.length < WORD_LENGTH) return flash("Not enough letters");
    if (!isValidGuess(input)) return flash("Not in the word list");

    const guesses = [...game.guesses, input];
    const won = input === game.answer;
    const done = won || guesses.length === MAX_ATTEMPTS;
    const next: WordleGame = { ...game, guesses, done, won };
    const revealMs = prefersReducedMotion() ? 0 : WORD_LENGTH * REVEAL_STEP_MS + 300;

    setGame(next);
    setInput("");
    setMessage("");
    setRevealRow(guesses.length - 1);
    sound("flip");

    if (!done) {
      commit((p) => withGame(p, mode, today, next));
      window.setTimeout(() => setAnnounce(`${guesses.length} of ${MAX_ATTEMPTS} guesses used`), revealMs);
      return;
    }

    setBusy(true);
    const awards: XPAward[] = [
      {
        key: mode === "daily" ? `wordle:daily:${today}` : `wordle:practice:${next.answer}`,
        amount: wordleReward(won, guesses.length, next.hints.length),
        label: won ? "Wordle solved" : "Wordle finished",
      },
    ];
    if (mode === "daily") awards.push({ key: `wordle:daily-bonus:${today}`, amount: XP.dailyBonus, label: "Daily puzzle complete" });

    window.setTimeout(() => {
      const gained = commit((p) => recordWordleResult(withGame(p, mode, today, next), won, guesses.length), awards, { activity: true });
      setLastXP(gained);
      setShowResult(true);
      setBusy(false);
      sound(won ? "win" : "lose");
      const text = won ? `${PRAISE[guesses.length - 1]}! Solved in ${guesses.length}.` : `The word was ${next.answer}.`;
      setMessage(text);
      setAnnounce(text);
    }, revealMs);
  }, [game, busy, input, flash, sound, commit, mode, today]);

  // Physical keyboard.
  const handlers = useRef({ addLetter, removeLetter, submit });
  handlers.current = { addLetter, removeLetter, submit };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "Enter") {
        if (t?.tagName === "BUTTON" || t?.tagName === "A") return; // let the focused control act
        e.preventDefault();
        handlers.current.submit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handlers.current.removeLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handlers.current.addLetter(e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const takeHint = () => {
    if (!game || game.done || game.hints.length >= MAX_HINTS) return;
    const h = nextHint(game.guesses, game.answer, game.hints);
    if (!h) return setMessage("You have already found every letter's position.");
    const next = { ...game, hints: [...game.hints, h.index] };
    setGame(next);
    commit((p) => withGame(p, mode, today, next));
    setMessage(`Hint: letter ${h.index + 1} is ${h.letter}`);
  };

  const newPractice = () => {
    const next = fresh(practiceAnswer(game ? [game.answer] : []));
    setGame(next);
    commit((p) => ({ ...p, wordlePractice: next }));
    setInput("");
    setMessage("");
    setRevealRow(-1);
    setShowResult(false);
    setLastXP(null);
    setCopied("idle");
  };

  const share = async () => {
    if (!game) return;
    const text = shareText({ guesses: game.guesses, answer: game.answer, won: game.won, hints: game.hints.length, label: mode === "daily" ? today : "practice" });
    try {
      await navigator.clipboard.writeText(text);
      setCopied("copied");
    } catch {
      setCopied("manual");
    }
  };

  const w = profile.wordle;
  const maxDist = Math.max(1, ...w.distribution);

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <GameHeader title="Tech Wordle" subtitle="Guess the five-letter tech word in six tries. Everyone gets the same daily puzzle; practice mode gives you a random word whenever you like." />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="Game board">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-full border border-line p-1" role="tablist" aria-label="Mode">
              {(["daily", "practice"] as Mode[]).map((m) => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  disabled={busy}
                  onClick={(e) => { releaseFocus(e); setMode(m); }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "bg-accent text-ink" : "text-muted hover:text-text"}`}
                >
                  {m === "daily" ? <Calendar className="h-4 w-4" aria-hidden="true" /> : <Shuffle className="h-4 w-4" aria-hidden="true" />}
                  {m === "daily" ? "Daily" : "Practice"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => { releaseFocus(e); takeHint(); }}
              disabled={!game || game.done || game.hints.length >= MAX_HINTS || busy}
              className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Hint ({MAX_HINTS - (game?.hints.length ?? 0)} left, −{XP.wordleHintPenalty} XP)
            </button>
          </div>

          <p className="mb-4 min-h-[1.5rem] text-center text-sm font-medium text-text" role="status" aria-live="polite">
            {message}
          </p>
          <p className="sr-only" aria-live="polite">{announce}</p>

          {game ? (
            <WordGrid guesses={game.guesses} answer={game.answer} current={input} revealRow={revealRow} shake={shake} />
          ) : (
            <div className="mx-auto grid w-fit gap-1.5" aria-busy="true" aria-label="Loading puzzle">
              {Array.from({ length: 6 }, (_, r) => (
                <div key={r} className="flex gap-1.5">
                  {Array.from({ length: 5 }, (_, i) => <div key={i} className="h-[3.35rem] w-[3.35rem] animate-pulse rounded-lg bg-raised sm:h-[3.75rem] sm:w-[3.75rem]" />)}
                </div>
              ))}
            </div>
          )}

          {game && game.hints.length > 0 && !game.done && (
            <p className="mt-4 text-center text-sm text-muted">
              Hints used: {game.hints.map((i) => `letter ${i + 1} is ${game.answer[i]}`).join(", ")}
            </p>
          )}

          {game && showResult ? (
            <div className="card mx-auto mt-8 max-w-[500px] p-6 text-center" aria-live="polite">
              <h2 className="text-xl font-semibold">{game.won ? `Solved in ${game.guesses.length}/${MAX_ATTEMPTS}` : "Out of guesses"}</h2>
              <p className="mt-2 text-muted">
                {game.won ? "Nice work." : "The answer was"}{" "}
                {!game.won && <span className="font-semibold tracking-widest text-text">{game.answer}</span>}
              </p>
              {lastXP !== null && (
                <p className="mt-2 text-sm">
                  {lastXP > 0 ? <span className="font-medium text-accent">+{lastXP} XP</span> : <span className="text-muted">You have already earned XP for this word.</span>}
                </p>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={share} className="btn btn-primary">
                  {copied === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                  {copied === "copied" ? "Copied" : "Share result"}
                </button>
                {mode === "practice" ? (
                  <button type="button" onClick={newPractice} className="btn btn-ghost">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    New game
                  </button>
                ) : (
                  <button type="button" onClick={() => setMode("practice")} className="btn btn-ghost">
                    <Shuffle className="h-4 w-4" aria-hidden="true" />
                    Play practice
                  </button>
                )}
              </div>
              {copied === "manual" && (
                <div className="mt-4 text-left">
                  <label htmlFor="share-text" className="text-sm text-muted">Copying is blocked here. Select the text and copy it:</label>
                  <textarea
                    id="share-text"
                    readOnly
                    rows={8}
                    onFocus={(e) => e.currentTarget.select()}
                    className="mt-2 w-full rounded-lg border border-line bg-raised p-3 font-mono text-sm"
                    value={shareText({ guesses: game.guesses, answer: game.answer, won: game.won, hints: game.hints.length, label: mode === "daily" ? today : "practice" })}
                  />
                </div>
              )}
              {mode === "daily" && (
                <p className="mt-5 text-sm text-muted">
                  Next daily puzzle in <span className="font-medium tabular-nums text-text">{countdown}</span>
                </p>
              )}
            </div>
          ) : (
            <Keyboard
              states={game ? keyboardStates(game.guesses, game.answer) : {}}
              onKey={addLetter}
              onEnter={submit}
              onDelete={removeLetter}
              disabled={!game || busy}
            />
          )}
        </section>

        <aside className="grid content-start gap-6">
          <section className="card p-5" aria-labelledby="howto-heading">
            <h2 id="howto-heading" className="font-semibold">How to play</h2>
            <p className="mt-2 text-sm text-muted">Type a five-letter word and press Enter. After each guess the tiles change colour:</p>
            <ul className="mt-4 grid gap-3 text-sm">
              {[
                { word: "STACK", i: 0, color: "var(--tile-correct)", text: "Green: right letter, right spot." },
                { word: "QUERY", i: 2, color: "var(--tile-present)", text: "Yellow: in the word, wrong spot." },
                { word: "PIXEL", i: 2, color: "var(--tile-absent)", text: "Grey: not in the word." },
              ].map((ex) => (
                <li key={ex.word}>
                  <div className="flex gap-1" aria-hidden="true">
                    {ex.word.split("").map((l, i) => (
                      <span
                        key={i}
                        className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold ${i === ex.i ? "border-transparent text-white" : "border-line"}`}
                        style={i === ex.i ? { background: ex.color } : undefined}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-muted">{ex.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Guesses must be real words. A letter that appears twice in your guess only lights up as often as it appears in the answer. Hints reveal one letter and take {XP.wordleHintPenalty} XP off that game&rsquo;s reward.
            </p>
          </section>

          <section className="card p-5" aria-labelledby="wstats-heading">
            <h2 id="wstats-heading" className="font-semibold">Your statistics</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatBox label="Played" value={w.played} />
              <StatBox label="Win %" value={w.played ? Math.round((w.wins / w.played) * 100) : 0} />
              <StatBox label="Current streak" value={w.currentStreak} />
              <StatBox label="Max streak" value={w.maxStreak} />
            </div>
            <h3 className="mt-5 text-sm text-muted">Guess distribution</h3>
            <ol className="mt-2 grid gap-1.5">
              {w.distribution.map((n, i) => {
                const highlight = showResult && game?.won && game.guesses.length === i + 1;
                return (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 tabular-nums text-muted">{i + 1}</span>
                    <span
                      className={`flex h-6 min-w-[1.75rem] items-center justify-end rounded px-2 text-xs font-medium tabular-nums ${highlight ? "bg-accent text-ink" : "bg-raised text-text"}`}
                      style={{ width: `${Math.max(8, (n / maxDist) * 100)}%` }}
                    >
                      {n}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

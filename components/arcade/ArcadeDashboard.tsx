"use client";

import { useState } from "react";
import { Bug, HardDrive, SpellCheck, Terminal, Worm } from "lucide-react";
import { ACHIEVEMENTS, levelFor, LEVELS, type Profile, type RoundStats } from "@/lib/arcade/progress";
import { useArcade } from "./ArcadeProvider";
import PlayerStats from "./PlayerStats";
import GameCard from "./GameCard";
import AchievementBadge from "./AchievementBadge";
import { MuteButton } from "./shared/ui";

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "–");
const best = (s: RoundStats) => (s.bestTotal ? `${s.bestScore} / ${s.bestTotal}` : "Not played");

function dailyStatus(p: Profile, today: string): string {
  const g = today ? p.wordleDaily[today] : undefined;
  if (!g || !g.guesses.length) return "Not played yet";
  if (!g.done) return `In progress, ${g.guesses.length}/6`;
  return g.won ? `Solved in ${g.guesses.length}/6` : "Not solved";
}

function bestWordle(p: Profile): string {
  const i = p.wordle.distribution.findIndex((n) => n > 0);
  return i === -1 ? "Not solved yet" : `Solved in ${i + 1} ${i === 0 ? "guess" : "guesses"}`;
}

export default function ArcadeDashboard() {
  const { profile: p, ready, today, canSave, resetProgress } = useArcade();
  const [confirmReset, setConfirmReset] = useState(false);
  const earnedCount = Object.keys(p.achievements).length;
  const show = (v: string) => (ready ? v : "…");

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-[0.02em] sm:text-6xl">
            OMM&rsquo;S DEV ARCADE
          </h1>
          <p className="mt-3 text-lg font-medium text-accent">Think. Code. Play. Repeat.</p>
          <p className="mt-3 max-w-xl text-muted">
            Welcome{ready && p.name !== "Visitor" ? `, ${p.name}` : ""}. Four short games about code: guess tech words, predict what a program prints, find bugs, or just play Snake. Every game earns XP towards your next level.
          </p>
        </div>
        <MuteButton />
      </header>

      {ready && !canSave && (
        <p className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100" role="status">
          This browser is blocking storage, so your progress will be lost when you leave the page. Allow site data to keep it.
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <PlayerStats />
        <section className="card p-6" aria-labelledby="levels-heading">
          <h2 id="levels-heading" className="font-semibold">Levels</h2>
          <ol className="mt-4 grid gap-2">
            {LEVELS.map((l, i) => {
              const current = ready && levelFor(p.xp).index === i;
              const reached = ready && p.xp >= l.min;
              return (
                <li
                  key={l.name}
                  aria-current={current ? "step" : undefined}
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${
                    current ? "border-accent/60 bg-accent/[0.08]" : "border-line"
                  }`}
                >
                  <span className={reached ? "font-medium" : "text-muted"}>
                    {i + 1}. {l.name}
                    {current && <span className="ml-2 text-xs text-accent">You are here</span>}
                  </span>
                  <span className="tabular-nums text-muted">
                    {LEVELS[i + 1] ? `${l.min.toLocaleString("en-IN")} to ${(LEVELS[i + 1].min - 1).toLocaleString("en-IN")} XP` : `${l.min.toLocaleString("en-IN")}+ XP`}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Solve a Wordle for 100 XP (150 in three guesses or fewer), +50 for the daily puzzle. Correct answers earn 20 XP in Guess the Output and 30 in Debug It, and finishing a game adds 25 XP once a day.
          </p>
        </section>
      </div>

      <section className="mt-14" aria-labelledby="games-heading">
        <h2 id="games-heading" className="section-title">Games</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <GameCard
            href="/arcade/wordle"
            title="Tech Wordle"
            description="Guess the five-letter tech word in six tries. A new daily puzzle every day, plus unlimited practice."
            icon={SpellCheck}
            difficulty={{ level: 2, label: "Medium" }}
            highlight="Daily puzzle"
            stats={[
              { label: "Today's puzzle", value: show(dailyStatus(p, today)) },
              { label: "Win rate", value: show(`${pct(p.wordle.wins, p.wordle.played)} of ${p.wordle.played}`) },
            ]}
          />
          <GameCard
            href="/arcade/guess-the-output"
            title="Guess the Output"
            description="Read a short Python, JavaScript, Java or C++ snippet and pick what it prints."
            icon={Terminal}
            difficulty={{ level: 2, label: "Easy to hard, you choose" }}
            stats={[
              { label: "Best round", value: show(best(p.quiz)) },
              { label: "Accuracy", value: show(pct(p.quiz.correct, p.quiz.answered)) },
            ]}
          />
          <GameCard
            href="/arcade/debug-it"
            title="Debug It"
            description="Each snippet has one bug. Click the broken line, then choose the fix that makes it work."
            icon={Bug}
            difficulty={{ level: 3, label: "Easy to hard, you choose" }}
            stats={[
              { label: "Best round", value: show(best(p.debug)) },
              { label: "Bugs fixed", value: show(String(p.debug.correct)) },
            ]}
          />
          <GameCard
            href="/arcade/snake"
            title="Snake"
            description="The classic. Eat, grow, and avoid the walls and your own tail. It speeds up as you score."
            icon={Worm}
            difficulty={{ level: 1, label: "Starts easy, speeds up" }}
            stats={[
              { label: "High score", value: show(String(p.snake.highScore)) },
              { label: "Games played", value: show(String(p.snake.played)) },
            ]}
          />
        </div>
      </section>

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="card p-6" aria-labelledby="bests-heading">
          <h2 id="bests-heading" className="font-semibold">Personal bests</h2>
          <table className="mt-4 w-full text-sm">
            <tbody className="divide-y divide-line">
              {[
                ["Tech Wordle", bestWordle(p)],
                ["Wordle win streak", `${p.wordle.maxStreak}`],
                ["Guess the Output", best(p.quiz)],
                ["Debug It", best(p.debug)],
                ["Snake", `${p.snake.highScore} points`],
                ["Longest daily streak", `${p.streak.best} ${p.streak.best === 1 ? "day" : "days"}`],
              ].map(([k, v]) => (
                <tr key={k}>
                  <th scope="row" className="py-3 pr-4 text-left font-normal text-muted">{k}</th>
                  <td className="py-3 text-right font-medium tabular-nums">{show(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card p-6" aria-labelledby="badges-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="badges-heading" className="font-semibold">Achievements</h2>
            <span className="text-sm text-muted tabular-nums">{show(`${earnedCount} of ${ACHIEVEMENTS.length}`)}</span>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge key={a.id} achievement={a} earnedOn={ready ? p.achievements[a.id] : undefined} />
            ))}
          </ul>
        </section>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
        <p className="flex items-center gap-2">
          <HardDrive className="h-4 w-4" aria-hidden="true" />
          Progress is saved in this browser only. There is no shared leaderboard.
        </p>
        {confirmReset ? (
          <span className="flex flex-wrap items-center gap-3" role="group" aria-label="Confirm reset">
            <span>Delete all XP, stats and badges?</span>
            <button type="button" onClick={() => { resetProgress(); setConfirmReset(false); }} className="rounded-full border border-rose-400/60 px-4 py-1.5 text-rose-200 hover:bg-rose-400/10">
              Yes, reset
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="rounded-full border border-line px-4 py-1.5 hover:border-accent">
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="underline-offset-4 hover:text-text hover:underline">
            Reset progress
          </button>
        )}
      </footer>
    </div>
  );
}

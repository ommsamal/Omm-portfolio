"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from "lucide-react";
import { createGame, speedLevel, step, tickInterval, turn, type Direction, type SnakeState } from "@/lib/arcade/snake";
import { recordSnake, XP } from "@/lib/arcade/progress";
import { useArcade, type XPAward } from "../ArcadeProvider";
import { GameHeader, StatBox } from "../shared/ui";

type Status = "idle" | "running" | "paused" | "over";
const SIZE = 18;
const KEYS: Record<string, Direction> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
};

export default function SnakeGame() {
  const { profile, today, commit, sound } = useArcade();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const game = useRef<SnakeState>(createGame(SIZE));
  const statusRef = useRef<Status>("idle");
  const [status, setStatusState] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; xp: number; record: boolean } | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const bestBefore = useRef(0);

  const setStatus = (s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const px = canvas.clientWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(px * dpr)) {
      canvas.width = Math.round(px * dpr);
      canvas.height = Math.round(px * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cell = px / SIZE;
    const g = game.current;
    ctx.fillStyle = "#0C0E12";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    for (let y = 0; y < SIZE; y++) for (let x = (y % 2); x < SIZE; x += 2) ctx.fillRect(x * cell, y * cell, cell, cell);

    // food
    ctx.fillStyle = "#F2C97D";
    ctx.beginPath();
    ctx.arc((g.food.x + 0.5) * cell, (g.food.y + 0.5) * cell, cell * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // snake
    g.snake.forEach((p, i) => {
      const inset = i === 0 ? 1 : 2;
      ctx.fillStyle = i === 0 ? "#3DE0FF" : `rgba(61,224,255,${Math.max(0.35, 0.85 - i * 0.03)})`;
      const r = cell * 0.25;
      const x = p.x * cell + inset, y = p.y * cell + inset, s = cell - inset * 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + s, y, x + s, y + s, r);
      ctx.arcTo(x + s, y + s, x, y + s, r);
      ctx.arcTo(x, y + s, x, y, r);
      ctx.arcTo(x, y, x + s, y, r);
      ctx.fill();
    });
  }, []);

  const finish = useCallback(
    (final: number) => {
      setStatus("over");
      sound("lose");
      const awards: XPAward[] = [{ key: `snake:day:${today}`, amount: XP.completeGame, label: "Snake game finished" }];
      XP.snakeMilestones.forEach((m) => final >= m.score && awards.push({ key: `snake:score:${m.score}`, amount: m.xp, label: `Scored ${m.score} in Snake` }));
      const gained = commit((p) => recordSnake(p, final), awards, { activity: true });
      setResult({ score: final, xp: gained, record: final > bestBefore.current && final > 0 });
    },
    [commit, sound, today],
  );

  // Game loop: moves the snake on a timer that shortens as the score grows.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(now - last, 250);
      last = now;
      if (statusRef.current === "running") {
        acc += dt;
        const interval = tickInterval(game.current.score);
        while (acc >= interval && statusRef.current === "running") {
          acc -= interval;
          const before = game.current.score;
          game.current = step(game.current);
          if (game.current.score !== before) {
            setScore(game.current.score);
            sound("eat");
          }
          if (game.current.over) finish(game.current.score);
        }
      } else acc = 0;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [draw, finish, sound]);

  const startNew = useCallback(() => {
    game.current = createGame(SIZE);
    bestBefore.current = profile.snake.highScore;
    setScore(0);
    setResult(null);
    setStatus("running");
    boardRef.current?.focus();
  }, [profile.snake.highScore]);

  const togglePause = useCallback(() => {
    if (statusRef.current === "running") setStatus("paused");
    else if (statusRef.current === "paused") setStatus("running");
  }, []);

  const steer = useCallback(
    (d: Direction) => {
      if (statusRef.current === "idle" || statusRef.current === "over") startNew();
      if (statusRef.current === "paused") setStatus("running");
      game.current = turn(game.current, d);
    },
    [startNew],
  );

  // Keyboard controls while the board area is in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      const d = KEYS[e.key];
      if (d) {
        e.preventDefault();
        steer(d);
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        if (t?.tagName === "BUTTON" && e.key === " ") return;
        e.preventDefault();
        if (statusRef.current === "idle" || statusRef.current === "over") startNew();
        else togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer, startNew, togglePause]);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVis = () => document.hidden && statusRef.current === "running" && setStatus("paused");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (!s) return;
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  };

  const high = Math.max(profile.snake.highScore, score);
  const pad = "flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-raised text-text active:bg-accent active:text-ink";

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <GameHeader title="Snake" subtitle="Eat the food to grow. Hitting a wall or your own tail ends the game, and every point makes the snake a little faster." />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Snake board">
          <div
            ref={boardRef}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative mx-auto aspect-square w-full max-w-[520px] touch-none overflow-hidden rounded-2xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Game board. Use the arrow keys or swipe to steer, space to pause."
          >
            <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
            {status !== "running" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/75 p-6 text-center backdrop-blur-[2px]">
                {status === "idle" && (
                  <>
                    <p className="text-lg font-semibold">Ready?</p>
                    <p className="max-w-xs text-sm text-muted">Arrow keys or WASD to steer, space to pause. On a phone, swipe on the board or use the buttons below.</p>
                    <button type="button" onClick={startNew} className="btn btn-primary">
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Start game
                    </button>
                  </>
                )}
                {status === "paused" && (
                  <>
                    <p className="text-lg font-semibold">Paused</p>
                    <button type="button" onClick={togglePause} className="btn btn-primary">
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Resume
                    </button>
                  </>
                )}
                {status === "over" && result && (
                  <div aria-live="polite" className="grid justify-items-center gap-3">
                    <p className="text-lg font-semibold">Game over</p>
                    <p className="text-5xl font-semibold tabular-nums text-accent">{result.score}</p>
                    {result.record && <p className="text-sm font-medium text-accent">New high score</p>}
                    <p className="text-sm text-muted">{result.xp > 0 ? `+${result.xp} XP` : "XP for Snake is given once a day, plus score milestones."}</p>
                    <button type="button" onClick={startNew} className="btn btn-primary mt-1">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Play again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mx-auto mt-5 flex max-w-[520px] flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={startNew} className="btn btn-ghost">
              {status === "idle" ? <Play className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
              {status === "idle" ? "Start" : "Restart"}
            </button>
            <button type="button" onClick={togglePause} disabled={status !== "running" && status !== "paused"} className="btn btn-ghost disabled:opacity-40">
              {status === "paused" ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
              {status === "paused" ? "Resume" : "Pause"}
            </button>
          </div>

          <div className="mx-auto mt-5 grid w-fit grid-cols-3 gap-2 lg:hidden" role="group" aria-label="Direction buttons">
            <span />
            <button type="button" className={pad} onClick={() => steer("up")} aria-label="Up"><ArrowUp className="h-6 w-6" /></button>
            <span />
            <button type="button" className={pad} onClick={() => steer("left")} aria-label="Left"><ArrowLeft className="h-6 w-6" /></button>
            <button type="button" className={pad} onClick={() => steer("down")} aria-label="Down"><ArrowDown className="h-6 w-6" /></button>
            <button type="button" className={pad} onClick={() => steer("right")} aria-label="Right"><ArrowRight className="h-6 w-6" /></button>
          </div>
        </section>

        <aside className="grid content-start gap-6">
          <section className="card p-5" aria-label="Score">
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Score" value={<span className="text-accent">{score}</span>} />
              <StatBox label="High score" value={high} />
              <StatBox label="Speed" value={`Level ${speedLevel(score)}`} />
              <StatBox label="Games played" value={profile.snake.played} />
            </div>
          </section>
          <section className="card p-5 text-sm text-muted" aria-labelledby="snake-rules">
            <h2 id="snake-rules" className="font-semibold text-text">How to play</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5">
              <li>Steer with the arrow keys or WASD. Space or P pauses.</li>
              <li>On touch screens, swipe on the board or use the direction buttons.</li>
              <li>Each piece of food is one point and speeds the snake up.</li>
              <li>Finishing a game earns {XP.completeGame} XP once a day. Reaching {XP.snakeMilestones.map((m) => m.score).join(", ")} points earns bonus XP the first time.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

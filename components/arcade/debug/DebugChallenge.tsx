"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DEBUG_CHALLENGES, type DebugChallenge as Challenge } from "@/lib/arcade/debugBank";
import { countAvailable, pickRound, shuffleOptions, type DifficultyFilter, type LangFilter } from "@/lib/arcade/rounds";
import { recordAnswer, recordRound, XP } from "@/lib/arcade/progress";
import { useArcade } from "../ArcadeProvider";
import { GameHeader } from "../shared/ui";
import RoundSetup from "../shared/RoundSetup";
import GameOverScreen from "../shared/GameOverScreen";
import DebugQuestion, { type DebugStep } from "./DebugQuestion";

const ROUND_SIZE = 6;
type Item = { c: Challenge; fixes: string[]; answer: number };

export default function DebugChallenge() {
  const { today, commit, sound } = useArcade();
  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [lang, setLang] = useState<LangFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("mixed");
  const [round, setRound] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<DebugStep>("line");
  const [pickedLine, setPickedLine] = useState<number | null>(null);
  const [pickedFix, setPickedFix] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [roundXP, setRoundXP] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  const available = Math.min(ROUND_SIZE, countAvailable(DEBUG_CHALLENGES, lang, difficulty));
  const item = round[index];
  const score = results.filter(Boolean).length;

  const reset = () => {
    setStep("line");
    setPickedLine(null);
    setPickedFix(null);
  };

  const start = () => {
    setRound(
      pickRound(DEBUG_CHALLENGES, lang, difficulty, ROUND_SIZE).map((c) => {
        const { options, answer } = shuffleOptions(c.fixes, c.answer);
        return { c, fixes: options, answer };
      }),
    );
    setIndex(0);
    setResults([]);
    setRoundXP(0);
    reset();
    setPhase("play");
  };

  const checkLine = () => {
    if (!item || !pickedLine) return;
    sound(pickedLine === item.c.bugLine ? "correct" : "wrong");
    setStep("fix");
  };

  const pickFix = useCallback(
    (i: number) => {
      if (!item || step !== "fix") return;
      setPickedFix(i);
      setStep("done");
      const solved = pickedLine === item.c.bugLine && i === item.answer;
      setResults((r) => [...r, solved]);
      sound(solved ? "correct" : "wrong");
      const gained = commit((p) => recordAnswer(p, "debug", solved), solved ? [{ key: `debug:${item.c.id}`, amount: XP.correctDebug, label: "Bug fixed" }] : []);
      setRoundXP((x) => x + gained);
      window.setTimeout(() => nextRef.current?.focus(), 0);
    },
    [item, step, pickedLine, sound, commit],
  );

  const next = () => {
    if (index + 1 < round.length) {
      setIndex(index + 1);
      reset();
      return;
    }
    const gained = commit((p) => recordRound(p, "debug", score, round.length), [{ key: `debug:round:${today}`, amount: XP.completeGame, label: "Round complete" }], { activity: true });
    setRoundXP((x) => x + gained);
    sound(score === round.length ? "win" : "correct");
    setPhase("done");
  };

  // Keyboard: 1-4 picks a fix in step 2.
  useEffect(() => {
    if (phase !== "play" || step !== "fix") return;
    const onKey = (e: KeyboardEvent) => {
      const i = ["1", "2", "3", "4"].indexOf(e.key);
      if (i >= 0) pickFix(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, step, pickFix]);

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <GameHeader title="Debug It" subtitle="Every snippet has exactly one bug: a typo, a logic slip or a classic trap. Find the line, then pick the fix." />

      {phase === "setup" && (
        <RoundSetup
          lang={lang}
          onLang={setLang}
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          count={available}
          onStart={start}
          rules={
            <>
              <p>Read what the code is meant to do. Click the line with the bug and press Check line.</p>
              <p>Then choose the replacement line that fixes it. You see an explanation after every challenge.</p>
              <p>Get both steps right to fix the bug and earn {XP.correctDebug} XP (once per challenge). Finishing a round adds {XP.completeGame} XP once a day.</p>
            </>
          }
        />
      )}

      {phase === "play" && item && (
        <section className="card p-5 sm:p-7" aria-label={`Challenge ${index + 1} of ${round.length}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-muted">
              Challenge <span className="font-medium text-text">{index + 1}</span> of {round.length}
              <span className="ml-3 rounded-full border border-line px-2.5 py-0.5 text-xs capitalize">{item.c.difficulty}</span>
            </span>
            <span className="tabular-nums">Bugs fixed <span className="font-semibold text-accent">{score}</span></span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
            <div className="h-full bg-accent/70 transition-[width] duration-300" style={{ width: `${((index + (step === "done" ? 1 : 0)) / round.length) * 100}%` }} />
          </div>
          <DebugQuestion
            challenge={item.c}
            fixes={item.fixes}
            answer={item.answer}
            step={step}
            pickedLine={pickedLine}
            pickedFix={pickedFix}
            onPickLine={setPickedLine}
            onCheckLine={checkLine}
            onPickFix={pickFix}
          />
          {step === "done" && (
            <div className="mt-6 flex justify-end">
              <button ref={nextRef} type="button" onClick={next} className="btn btn-primary">
                {index + 1 < round.length ? "Next challenge" : "See results"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}

      {phase === "done" && (
        <GameOverScreen
          title="Round complete"
          score={`${score} / ${round.length}`}
          message={score === round.length ? "Every bug found and fixed." : score >= round.length / 2 ? "Good debugging. Hard mode has the nastier bugs." : "Debugging is a skill you build one bug at a time. Read the explanations and go again."}
          xp={roundXP}
          onPlayAgain={start}
          onChangeSettings={() => setPhase("setup")}
        />
      )}
    </div>
  );
}

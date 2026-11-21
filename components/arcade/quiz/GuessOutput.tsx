"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Timer } from "lucide-react";
import { OUTPUT_QUESTIONS, type OutputQuestion } from "@/lib/arcade/questionBank";
import { countAvailable, pickRound, shuffleOptions, type DifficultyFilter, type LangFilter } from "@/lib/arcade/rounds";
import { recordAnswer, recordRound, XP } from "@/lib/arcade/progress";
import { useArcade } from "../ArcadeProvider";
import { GameHeader } from "../shared/ui";
import RoundSetup from "../shared/RoundSetup";
import GameOverScreen from "../shared/GameOverScreen";
import QuizQuestion from "./QuizQuestion";

const ROUND_SIZE = 8;
const SECONDS = 25;
type Item = { q: OutputQuestion; options: string[]; answer: number };

export default function GuessOutput() {
  const { today, commit, sound } = useArcade();
  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [lang, setLang] = useState<LangFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("mixed");
  const [timed, setTimed] = useState(false);
  const [round, setRound] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [roundXP, setRoundXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const nextRef = useRef<HTMLButtonElement>(null);

  const available = Math.min(ROUND_SIZE, countAvailable(OUTPUT_QUESTIONS, lang, difficulty));
  const item = round[index];
  const score = results.filter(Boolean).length;

  const start = () => {
    const picked = pickRound(OUTPUT_QUESTIONS, lang, difficulty, ROUND_SIZE).map((q) => ({ q, ...shuffleOptions(q.options, q.answer) }));
    setRound(picked);
    setIndex(0);
    setSelected(null);
    setResults([]);
    setRoundXP(0);
    setTimeLeft(SECONDS);
    setPhase("play");
  };

  const choose = useCallback(
    (i: number) => {
      if (!item || selected !== null) return;
      const correct = i === item.answer;
      setSelected(i);
      setResults((r) => [...r, correct]);
      sound(correct ? "correct" : "wrong");
      const gained = commit((p) => recordAnswer(p, "quiz", correct), correct ? [{ key: `quiz:q:${item.q.id}`, amount: XP.correctOutput, label: "Correct answer" }] : []);
      setRoundXP((x) => x + gained);
      window.setTimeout(() => nextRef.current?.focus(), 0);
    },
    [item, selected, sound, commit],
  );

  const next = useCallback(() => {
    if (selected === null) return;
    if (index + 1 < round.length) {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(SECONDS);
      return;
    }
    const finalScore = results.filter(Boolean).length;
    const gained = commit((p) => recordRound(p, "quiz", finalScore, round.length), [{ key: `quiz:round:${today}`, amount: XP.completeGame, label: "Round complete" }], { activity: true });
    setRoundXP((x) => x + gained);
    sound(finalScore === round.length ? "win" : "correct");
    setPhase("done");
  }, [selected, index, round.length, results, commit, today, sound]);

  // Countdown timer.
  useEffect(() => {
    if (phase !== "play" || !timed || selected !== null) return;
    if (timeLeft <= 0) {
      choose(-1);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, timed, selected, timeLeft, choose]);

  // Keyboard: 1-4 or A-D to answer, Enter for the next question.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const i = ["1", "2", "3", "4"].indexOf(k) !== -1 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
      if (i >= 0 && selected === null) choose(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, selected, choose]);

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <GameHeader title="Guess the Output" subtitle="Read the code and choose what it prints. Python, JavaScript, Java and C++, from warm-up questions to the classic traps." />

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
              <p>Each question shows a short program. Pick the exact output from four options; &ldquo;Error&rdquo; means the code fails to run.</p>
              <p>You see the right answer and an explanation straight away. Answer with a click, or press 1 to 4.</p>
              <p>Earn {XP.correctOutput} XP for each question you get right for the first time, and {XP.completeGame} XP for finishing a round (once a day).</p>
            </>
          }
        >
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-4 w-4 accent-[#3DE0FF]" />
            <Timer className="h-4 w-4 text-accent" aria-hidden="true" />
            Use a {SECONDS}-second timer per question
          </label>
        </RoundSetup>
      )}

      {phase === "play" && item && (
        <section className="card p-5 sm:p-7" aria-label={`Question ${index + 1} of ${round.length}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-muted">
              Question <span className="font-medium text-text">{index + 1}</span> of {round.length}
              <span className="ml-3 rounded-full border border-line px-2.5 py-0.5 text-xs capitalize">{item.q.difficulty}</span>
            </span>
            <span className="tabular-nums">Score <span className="font-semibold text-accent">{score}</span></span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
            <div className="h-full bg-accent/70 transition-[width] duration-300" style={{ width: `${((index + (selected !== null ? 1 : 0)) / round.length) * 100}%` }} />
          </div>
          {timed && (
            <p className={`mb-4 flex items-center gap-2 text-sm tabular-nums ${timeLeft <= 5 && selected === null ? "text-rose-300" : "text-muted"}`} aria-live="off">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {selected === null ? `${timeLeft}s left` : "Answered"}
            </p>
          )}
          <QuizQuestion question={item.q} options={item.options} answer={item.answer} selected={selected} onChoose={choose} />
          {selected !== null && (
            <div className="mt-6 flex justify-end">
              <button ref={nextRef} type="button" onClick={next} className="btn btn-primary">
                {index + 1 < round.length ? "Next question" : "See results"}
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
          message={score === round.length ? "A perfect round." : score >= round.length / 2 ? "Solid reading. Try a harder setting next." : "Each explanation is a quick lesson. Another round will feel easier."}
          xp={roundXP}
          onPlayAgain={start}
          onChangeSettings={() => setPhase("setup")}
        />
      )}
    </div>
  );
}

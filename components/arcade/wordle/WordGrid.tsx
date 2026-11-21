"use client";

import { MAX_ATTEMPTS, WORD_LENGTH, scoreGuess, type TileState } from "@/lib/arcade/wordle";

export const REVEAL_STEP_MS = 260;

const FINAL: Record<TileState, string> = {
  correct: "var(--tile-correct)",
  present: "var(--tile-present)",
  absent: "var(--tile-absent)",
};

const STATE_WORD: Record<TileState, string> = { correct: "correct", present: "in the word, wrong spot", absent: "not in the word" };

export default function WordGrid({
  guesses, answer, current, revealRow, shake,
}: {
  guesses: string[];
  answer: string;
  current: string;
  revealRow: number;
  shake: boolean;
}) {
  return (
    <div className="mx-auto grid w-fit gap-1.5" role="group" aria-label="Guesses">
      {Array.from({ length: MAX_ATTEMPTS }, (_, r) => {
        const submitted = r < guesses.length;
        const active = r === guesses.length;
        const word = submitted ? guesses[r] : active ? current : "";
        const states = submitted ? scoreGuess(word, answer) : null;
        const label = submitted
          ? `Guess ${r + 1}: ${word.split("").map((l, i) => `${l} ${STATE_WORD[states![i]]}`).join(", ")}`
          : active && current
            ? `Current guess: ${current}`
            : `Row ${r + 1}, empty`;
        return (
          <div key={r} className={`flex gap-1.5 ${active && shake ? "row-shake" : ""}`} aria-label={label} role="img">
            {Array.from({ length: WORD_LENGTH }, (_, i) => {
              const letter = word[i] ?? "";
              const state = states?.[i];
              const animate = submitted && r === revealRow;
              return (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`tile flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-lg border-2 text-2xl font-semibold uppercase sm:h-[3.75rem] sm:w-[3.75rem] ${
                    state ? "tile-done border-transparent text-white" : letter ? "border-muted/60 text-text" : "border-line text-text"
                  } ${animate ? "tile-reveal" : ""}`}
                  style={
                    state
                      ? ({ "--tile-final": FINAL[state], animationDelay: animate ? `${i * REVEAL_STEP_MS}ms` : undefined } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span key={letter} className={letter && !state ? "tile-pop" : undefined}>{letter}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { Check, X } from "lucide-react";
import type { OutputQuestion } from "@/lib/arcade/questionBank";
import CodeBlock from "../shared/CodeBlock";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizQuestion({
  question, options, answer, selected, onChoose,
}: {
  question: OutputQuestion;
  options: string[];
  answer: number;
  selected: number | null; // -1 means time ran out
  onChoose: (i: number) => void;
}) {
  const locked = selected !== null;
  return (
    <div className="grid gap-5">
      <CodeBlock code={question.code} lang={question.lang} note={question.inMain ? "Runs inside main()" : undefined} />
      <fieldset>
        <legend className="mb-3 font-medium">What does this print?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((opt, i) => {
            const isAnswer = locked && i === answer;
            const isWrongPick = locked && i === selected && i !== answer;
            return (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => onChoose(i)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isAnswer
                    ? "border-emerald-400/70 bg-emerald-400/10"
                    : isWrongPick
                      ? "border-rose-400/70 bg-rose-400/10"
                      : locked
                        ? "border-line opacity-60"
                        : "border-line bg-raised/40 hover:border-accent/60"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold text-muted">
                  {isAnswer ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : isWrongPick ? <X className="h-4 w-4 text-rose-300" aria-hidden="true" /> : LETTERS[i]}
                </span>
                <span className="font-mono text-sm">{opt}</span>
                {isAnswer && <span className="sr-only">(correct answer)</span>}
                {isWrongPick && <span className="sr-only">(your answer, incorrect)</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
      {locked && (
        <div
          className={`rounded-xl border p-4 ${selected === answer ? "border-emerald-400/50 bg-emerald-400/[0.07]" : "border-rose-400/50 bg-rose-400/[0.07]"}`}
          role="status"
        >
          <p className="font-medium">
            {selected === answer ? "Correct." : selected === -1 ? `Time's up. The answer is ${LETTERS[answer]}.` : `Not quite. The answer is ${LETTERS[answer]}.`}
          </p>
          <p className="mt-1 text-sm text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

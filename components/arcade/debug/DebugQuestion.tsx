"use client";

import { Check, X } from "lucide-react";
import type { DebugChallenge } from "@/lib/arcade/debugBank";
import CodeBlock, { type LineMark } from "../shared/CodeBlock";

export type DebugStep = "line" | "fix" | "done";

export default function DebugQuestion({
  challenge, fixes, answer, step, pickedLine, pickedFix, onPickLine, onCheckLine, onPickFix,
}: {
  challenge: DebugChallenge;
  fixes: string[];
  answer: number;
  step: DebugStep;
  pickedLine: number | null;
  pickedFix: number | null;
  onPickLine: (n: number) => void;
  onCheckLine: () => void;
  onPickFix: (i: number) => void;
}) {
  const marks: Record<number, LineMark> = {};
  if (step === "line" && pickedLine) marks[pickedLine] = "selected";
  if (step !== "line") {
    if (pickedLine && pickedLine !== challenge.bugLine) marks[pickedLine] = "wrong";
    marks[challenge.bugLine] = "correct";
  }
  const lineRight = pickedLine === challenge.bugLine;
  const fixRight = pickedFix === answer;

  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-line bg-raised/40 p-4">
        <p className="text-sm text-muted">This code should</p>
        <p className="mt-0.5 font-medium">{challenge.goal.replace(/^./, (c) => c.toLowerCase())}</p>
      </div>

      <div>
        <p className="mb-2 text-sm">
          <span className="font-medium">Step 1.</span> <span className="text-muted">Click the line that contains the bug.</span>
        </p>
        <CodeBlock code={challenge.lines} lang={challenge.lang} onSelectLine={step === "line" ? onPickLine : undefined} marks={marks} disabled={step !== "line"} />
        {step === "line" && (
          <button type="button" onClick={onCheckLine} disabled={!pickedLine} className="btn btn-primary mt-4 disabled:opacity-40">
            {pickedLine ? `Check line ${pickedLine}` : "Select a line first"}
          </button>
        )}
        {step !== "line" && (
          <p className={`mt-3 text-sm ${lineRight ? "text-emerald-300" : "text-rose-300"}`} role="status">
            {lineRight ? `Right, the bug is on line ${challenge.bugLine}.` : `The bug is on line ${challenge.bugLine}, highlighted in green.`}
          </p>
        )}
      </div>

      {step !== "line" && (
        <fieldset>
          <legend className="mb-3 text-sm">
            <span className="font-medium">Step 2.</span> <span className="text-muted">Choose the replacement for line {challenge.bugLine} that fixes it.</span>
          </legend>
          <div className="grid gap-3">
            {fixes.map((f, i) => {
              const isAnswer = step === "done" && i === answer;
              const isWrong = step === "done" && i === pickedFix && i !== answer;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={step === "done"}
                  onClick={() => onPickFix(i)}
                  className={`flex items-center gap-3 overflow-x-auto rounded-xl border p-3 text-left transition-colors ${
                    isAnswer ? "border-emerald-400/70 bg-emerald-400/10" : isWrong ? "border-rose-400/70 bg-rose-400/10" : step === "done" ? "border-line opacity-60" : "border-line bg-raised/40 hover:border-accent/60"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold text-muted">
                    {isAnswer ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : isWrong ? <X className="h-4 w-4 text-rose-300" aria-hidden="true" /> : i + 1}
                  </span>
                  <code className="whitespace-pre font-mono text-sm">{f.trimStart()}</code>
                  {isAnswer && <span className="sr-only">(correct fix)</span>}
                  {isWrong && <span className="sr-only">(your choice, incorrect)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {step === "done" && (
        <div className={`rounded-xl border p-4 ${lineRight && fixRight ? "border-emerald-400/50 bg-emerald-400/[0.07]" : "border-rose-400/50 bg-rose-400/[0.07]"}`} role="status">
          <p className="font-medium">
            {lineRight && fixRight ? "Bug fixed." : fixRight ? "Right fix, but you picked the wrong line first." : "Not quite."}
          </p>
          <p className="mt-1 text-sm text-muted">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}

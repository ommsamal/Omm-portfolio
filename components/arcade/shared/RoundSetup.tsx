"use client";

import { Play } from "lucide-react";
import type { ReactNode } from "react";
import type { DifficultyFilter, LangFilter } from "@/lib/arcade/rounds";
import { Segmented } from "./ui";

export const LANG_OPTIONS: { value: LangFilter; label: string }[] = [
  { value: "all", label: "All languages" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function RoundSetup({
  lang, onLang, difficulty, onDifficulty, count, onStart, rules, children,
}: {
  lang: LangFilter;
  onLang: (v: LangFilter) => void;
  difficulty: DifficultyFilter;
  onDifficulty: (v: DifficultyFilter) => void;
  count: number;
  onStart: () => void;
  rules: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <section className="card grid gap-6 p-6" aria-label="Round settings">
        <Segmented label="Language" value={lang} options={LANG_OPTIONS} onChange={onLang} />
        <Segmented label="Difficulty" value={difficulty} options={DIFFICULTY_OPTIONS} onChange={onDifficulty} />
        {children}
        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
          <button type="button" onClick={onStart} disabled={count === 0} className="btn btn-primary disabled:opacity-40">
            <Play className="h-4 w-4" aria-hidden="true" />
            Start round
          </button>
          <span className="text-sm text-muted">{count ? `${count} question${count > 1 ? "s" : ""} in this round` : "No questions match these settings yet."}</span>
        </div>
      </section>
      <section className="card p-6" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="font-semibold">How it works</h2>
        <div className="mt-3 grid gap-3 text-sm text-muted">{rules}</div>
      </section>
    </div>
  );
}

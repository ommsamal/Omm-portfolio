"use client";

import Link from "next/link";
import { RotateCcw, Settings2 } from "lucide-react";
import type { ReactNode } from "react";

export default function GameOverScreen({
  title, score, message, xp, onPlayAgain, onChangeSettings, children,
}: {
  title: string;
  score: string;
  message: string;
  xp: number;
  onPlayAgain: () => void;
  onChangeSettings?: () => void;
  children?: ReactNode;
}) {
  return (
    <section className="card p-6 text-center sm:p-10" aria-live="polite">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-6 text-6xl font-semibold tabular-nums tracking-tight text-accent">{score}</p>
      <p className="mx-auto mt-4 max-w-md text-muted">{message}</p>
      <p className="mt-3 text-sm">
        {xp > 0 ? (
          <span className="font-medium text-accent">+{xp} XP earned this round</span>
        ) : (
          <span className="text-muted">No new XP this round. XP is given once per question, so try new questions or another difficulty.</span>
        )}
      </p>
      {children}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onPlayAgain} className="btn btn-primary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Play again
        </button>
        {onChangeSettings && (
          <button type="button" onClick={onChangeSettings} className="btn btn-ghost">
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            Change settings
          </button>
        )}
        <Link href="/arcade" className="btn btn-ghost">Back to arcade</Link>
      </div>
    </section>
  );
}

"use client";

import { levelFor } from "@/lib/arcade/progress";

export default function XPProgress({ xp }: { xp: number }) {
  const level = levelFor(xp);
  const pct = Math.round(level.progress * 100);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{level.name}</span>
        <span className="text-muted">
          {level.next ? `${level.toNext.toLocaleString("en-IN")} XP to ${level.next.name}` : "Top level reached"}
        </span>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-raised"
        role="progressbar"
        aria-label={level.next ? `Progress to ${level.next.name}` : "Top level reached"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted tabular-nums">
        <span>{level.min.toLocaleString("en-IN")}</span>
        <span>{level.next ? level.next.min.toLocaleString("en-IN") : `${xp.toLocaleString("en-IN")}+`}</span>
      </div>
    </div>
  );
}

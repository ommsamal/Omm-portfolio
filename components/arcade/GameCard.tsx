"use client";

import Link from "next/link";
import { Play, type LucideIcon } from "lucide-react";
import { Difficulty } from "./shared/ui";

export default function GameCard({
  href, title, description, icon: Icon, difficulty, stats, highlight,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: { level: 1 | 2 | 3; label: string };
  stats: { label: string; value: string }[];
  highlight?: string;
}) {
  return (
    <article className="card group relative flex h-full flex-col p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/50">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-raised text-accent transition-colors group-hover:border-accent/50">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        {highlight && <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{highlight}</span>}
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{description}</p>
      <div className="mt-4">
        <Difficulty level={difficulty.level} label={difficulty.label} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-muted">{s.label}</dt>
            <dd className="mt-0.5 text-sm font-medium tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 pt-1 lg:mt-auto lg:pt-6">
        <Link href={href} className="btn btn-primary" aria-label={`Play ${title}`}>
          <Play className="h-4 w-4" aria-hidden="true" />
          Play now
        </Link>
      </div>
    </article>
  );
}

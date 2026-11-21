"use client";

import { Bug, Calendar, Crown, Lock, SpellCheck, Target, Trophy, Worm, type LucideIcon } from "lucide-react";
import type { Achievement } from "@/lib/arcade/progress";

const ICONS: Record<string, LucideIcon> = {
  "first-win": Trophy,
  "word-master": SpellCheck,
  "bug-hunter": Bug,
  "perfect-streak": Target,
  "daily-challenger": Calendar,
  "snake-charmer": Worm,
  "arcade-champion": Crown,
};

function formatDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function AchievementBadge({ achievement, earnedOn }: { achievement: Achievement; earnedOn?: string }) {
  const Icon = ICONS[achievement.id] ?? Trophy;
  const earned = Boolean(earnedOn);
  return (
    <li className={`flex gap-4 rounded-xl border p-4 transition-colors ${earned ? "border-accent/40 bg-accent/[0.06]" : "border-line bg-raised/30"}`}>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
          earned ? "border-accent/60 bg-ink text-accent" : "border-line text-muted/70"
        }`}
      >
        {earned ? <Icon className="h-5 w-5" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
      </span>
      <div className="min-w-0">
        <p className={`font-medium ${earned ? "text-text" : "text-text/80"}`}>{achievement.name}</p>
        <p className="mt-0.5 text-sm text-muted">{achievement.description}</p>
        <p className={`mt-1 text-xs ${earned ? "text-accent" : "text-muted/80"}`}>{earned ? `Earned ${formatDate(earnedOn!)}` : "Locked"}</p>
      </div>
    </li>
  );
}

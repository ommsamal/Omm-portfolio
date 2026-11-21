"use client";

import { useState, type FormEvent } from "react";
import { Check, Flame, Gamepad2, Pencil, Sparkles } from "lucide-react";
import { gamesPlayed, liveStreak } from "@/lib/arcade/progress";
import { useArcade } from "./ArcadeProvider";
import XPProgress from "./XPProgress";

export default function PlayerStats() {
  const { profile, ready, today, setName } = useArcade();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const played = Object.values(gamesPlayed(profile)).reduce((a, b) => a + b, 0);
  const streak = ready ? liveStreak(profile, today) : 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setName(draft);
    setEditing(false);
  };

  if (!ready) {
    return (
      <div className="card p-6" aria-busy="true" aria-label="Loading your progress">
        <div className="h-6 w-40 animate-pulse rounded bg-raised" />
        <div className="mt-6 h-3 w-full animate-pulse rounded bg-raised" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-raised" />)}
        </div>
      </div>
    );
  }

  return (
    <section className="card p-6" aria-labelledby="player-heading">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">Player</p>
          {editing ? (
            <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
              <label htmlFor="player-name" className="sr-only">Player name</label>
              <input
                id="player-name"
                autoFocus
                maxLength={24}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-44 rounded-lg border border-line bg-raised px-3 py-1.5 text-lg font-semibold outline-none focus:border-accent"
              />
              <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-ink" aria-label="Save name">
                <Check className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <h2 id="player-heading" className="truncate text-2xl font-semibold tracking-tight">{profile.name}</h2>
              <button
                type="button"
                onClick={() => { setDraft(profile.name); setEditing(true); }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-accent"
                aria-label="Change player name"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <XPProgress xp={profile.xp} />
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Sparkles, label: "Total XP", value: profile.xp.toLocaleString("en-IN") },
          { icon: Flame, label: "Daily streak", value: `${streak} ${streak === 1 ? "day" : "days"}` },
          { icon: Gamepad2, label: "Games played", value: played },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-line bg-raised/50 p-3">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

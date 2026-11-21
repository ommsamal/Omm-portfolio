"use client";

// Small building blocks shared by the arcade pages.
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { levelFor } from "@/lib/arcade/progress";
import { useArcade } from "../ArcadeProvider";

export function MuteButton() {
  const { muted, toggleMute } = useArcade();
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      title={muted ? "Sound off" : "Sound on"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

export function XPChip() {
  const { profile, ready } = useArcade();
  const level = levelFor(profile.xp);
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm">
      {ready ? (
        <>
          <span className="text-muted">{level.name}</span>
          <span className="font-medium tabular-nums text-accent">{profile.xp.toLocaleString("en-IN")} XP</span>
        </>
      ) : (
        <span className="h-3 w-24 animate-pulse rounded bg-raised" aria-label="Loading progress" />
      )}
    </span>
  );
}

export function GameHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/arcade" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to arcade
        </Link>
        <div className="flex items-center gap-2">
          <XPChip />
          <MuteButton />
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>
      {children}
    </div>
  );
}

export function Segmented<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              value === o.value ? "border-accent bg-accent/10 text-accent" : "border-line text-text hover:border-accent/60"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function StatBox({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-raised/50 px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export function Difficulty({ level, label }: { level: 1 | 2 | 3; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`w-1.5 rounded-sm ${n <= level ? "bg-accent" : "bg-line"}`} style={{ height: 4 + n * 4 }} />
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}

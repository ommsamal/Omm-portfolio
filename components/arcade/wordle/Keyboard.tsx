"use client";

import { Delete } from "lucide-react";
import type { MouseEvent } from "react";
import type { TileState } from "@/lib/arcade/wordle";

/** After a mouse or touch click, drop focus so the physical Enter key submits the guess. */
export function releaseFocus(e: MouseEvent<HTMLElement>) {
  if (e.detail > 0) e.currentTarget.blur();
}

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const KEY_STYLE: Record<TileState | "none", string> = {
  none: "bg-raised text-text hover:bg-[#2A2F38]",
  correct: "bg-[var(--tile-correct)] text-white",
  present: "bg-[var(--tile-present)] text-white",
  absent: "bg-[var(--tile-absent)] text-muted",
};

const STATE_WORD: Record<TileState, string> = { correct: "correct", present: "in the word", absent: "not in the word" };

export default function Keyboard({
  states, onKey, onEnter, onDelete, disabled,
}: {
  states: Record<string, TileState>;
  onKey: (letter: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const base = "flex h-14 items-center justify-center rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 sm:text-base";
  return (
    <div className="mx-auto mt-6 grid w-full max-w-[500px] gap-1.5" aria-label="On-screen keyboard" role="group">
      {ROWS.map((row, r) => (
        <div key={row} className="flex gap-1.5">
          {r === 1 && <span className="flex-[0.5]" aria-hidden="true" />}
          {r === 2 && (
            <button type="button" onClick={(e) => { releaseFocus(e); onEnter(); }} disabled={disabled} className={`${base} flex-[1.5] bg-raised px-1 text-xs hover:bg-[#2A2F38] sm:text-sm`}>
              Enter
            </button>
          )}
          {row.split("").map((k) => {
            const s = states[k];
            return (
              <button
                key={k}
                type="button"
                onClick={(e) => { releaseFocus(e); onKey(k); }}
                disabled={disabled}
                aria-label={s ? `${k}, ${STATE_WORD[s]}` : k}
                className={`${base} min-w-0 flex-1 ${KEY_STYLE[s ?? "none"]}`}
              >
                {k}
              </button>
            );
          })}
          {r === 2 && (
            <button type="button" onClick={(e) => { releaseFocus(e); onDelete(); }} disabled={disabled} aria-label="Delete letter" className={`${base} flex-[1.5] bg-raised hover:bg-[#2A2F38]`}>
              <Delete className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          {r === 1 && <span className="flex-[0.5]" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

"use client";

// Highlighted code with line numbers. With `onSelectLine` each line becomes a
// button so a player can pick the line with the bug.
import { tokenize, LANG_LABEL, type Lang, type TokenKind } from "@/lib/arcade/highlight";

const COLORS: Record<TokenKind, string> = {
  keyword: "text-accent",
  string: "text-[#A8E6B8]",
  number: "text-[#F2C97D]",
  comment: "italic text-muted",
  function: "text-[#C9D4FF]",
  plain: "text-text",
};

export type LineMark = "selected" | "correct" | "wrong";

export default function CodeBlock({
  code, lang, note, onSelectLine, marks = {}, disabled,
}: {
  code: string | string[];
  lang: Lang;
  note?: string;
  onSelectLine?: (line: number) => void;
  marks?: Record<number, LineMark>;
  disabled?: boolean;
}) {
  const lines = Array.isArray(code) ? code : code.split("\n");
  const markClass: Record<LineMark, string> = {
    selected: "bg-accent/10 ring-1 ring-inset ring-accent/70",
    correct: "bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/70",
    wrong: "bg-rose-400/10 ring-1 ring-inset ring-rose-400/70",
  };

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-[#0C0E12]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-2 text-xs text-muted">
        <span className="font-medium text-text">{LANG_LABEL[lang]}</span>
        {note && <span>{note}</span>}
      </figcaption>
      <div className="overflow-x-auto py-2">
        <pre className="min-w-max font-mono text-[0.86rem] leading-6 sm:text-sm">
          {lines.map((line, i) => {
            const n = i + 1;
            const content = (
              <>
                <span className="inline-block w-10 select-none pr-4 text-right text-muted/60">{n}</span>
                <code>
                  {tokenize(line, lang).map((t, j) => (
                    <span key={j} className={COLORS[t.kind]}>{t.text}</span>
                  ))}
                  {line === "" && " "}
                </code>
              </>
            );
            const cls = `block w-full pr-6 text-left ${marks[n] ? markClass[marks[n]] : ""}`;
            return onSelectLine ? (
              <button
                key={n}
                type="button"
                disabled={disabled}
                onClick={() => onSelectLine(n)}
                aria-label={`Line ${n}: ${line.trim() || "blank"}`}
                aria-pressed={marks[n] === "selected"}
                className={`${cls} transition-colors enabled:hover:bg-white/5 disabled:cursor-default`}
              >
                {content}
              </button>
            ) : (
              <div key={n} className={cls}>{content}</div>
            );
          })}
        </pre>
      </div>
    </figure>
  );
}

// Dates for daily challenges. Every visitor uses India Standard Time, so the
// daily puzzle is the same for everyone at the same moment and changes at
// midnight IST.
export const ARCADE_TIMEZONE = "Asia/Kolkata";
const EPOCH = Date.UTC(2026, 0, 1); // day 0 of the daily sequence

/** "YYYY-MM-DD" for the given instant, in IST. */
export function dateKey(at: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ARCADE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/** Whole days between the arcade epoch and a date key. */
export function dayIndex(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / 86_400_000);
}

/** The date key one day before `key`. */
export function previousDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const prev = new Date(Date.UTC(y, m - 1, d) - 86_400_000);
  return prev.toISOString().slice(0, 10);
}

/** Milliseconds until the next midnight in IST. */
export function msUntilNextDay(at: Date = new Date()): number {
  const IST_OFFSET = 330 * 60_000; // IST has no daylight saving
  const istNow = at.getTime() + IST_OFFSET;
  const nextMidnight = Math.floor(istNow / 86_400_000 + 1) * 86_400_000;
  return nextMidnight - istNow;
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

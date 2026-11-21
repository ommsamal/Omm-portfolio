// Small wrapper around localStorage. It never throws: when storage is blocked
// (private mode, disabled cookies, full quota) it keeps data in memory for this
// visit and reports that progress cannot be saved.
const memory = new Map<string, string>();
let available: boolean | null = null;

export function storageAvailable(): boolean {
  if (available !== null) return available;
  try {
    const k = "__arcade_probe__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function readJSON<T>(key: string, fallback: T): T {
  let raw: string | null | undefined = memory.get(key);
  if (storageAvailable()) {
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      /* fall back to memory */
    }
  }
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Returns false when the value could only be kept in memory. */
export function writeJSON(key: string, value: unknown): boolean {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  if (!storageAvailable()) return false;
  try {
    window.localStorage.setItem(key, raw);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  memory.delete(key);
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

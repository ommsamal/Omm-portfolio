"use client";

// Holds the player's progress for every arcade page: loads it from
// localStorage, applies XP and achievements, saves changes and shows short
// messages when XP is earned.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Sparkles, TrendingUp } from "lucide-react";
import { readJSON, writeJSON, removeKey, storageAvailable } from "@/lib/arcade/storage";
import { dateKey } from "@/lib/arcade/daily";
import { playSound, type Sound } from "@/lib/arcade/sound";
import {
  award, evaluateAchievements, levelFor, newProfile, normalizeProfile, pruneDaily, recordActivity, type Profile,
} from "@/lib/arcade/progress";

const PROFILE_KEY = "omm-arcade-profile-v1";
const SOUND_KEY = "omm-arcade-muted";

export type XPAward = { key: string; amount: number; label: string };
type Toast = { id: number; kind: "xp" | "badge" | "level"; text: string };

type ArcadeContext = {
  ready: boolean;
  canSave: boolean;
  today: string;
  profile: Profile;
  muted: boolean;
  /** Applies a change, gives any XP not already earned and saves. Returns XP gained. */
  commit: (change: (p: Profile) => Profile, awards?: XPAward[], opts?: { activity?: boolean }) => number;
  sound: (name: Sound) => void;
  toggleMute: () => void;
  setName: (name: string) => void;
  resetProgress: () => void;
};

const Ctx = createContext<ArcadeContext | null>(null);

export function useArcade(): ArcadeContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useArcade must be used inside ArcadeProvider");
  return ctx;
}

export default function ArcadeProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(newProfile);
  const [ready, setReady] = useState(false);
  const [canSave, setCanSave] = useState(true);
  const [muted, setMuted] = useState(false);
  const [today, setToday] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ref = useRef(profile);
  const mutedRef = useRef(muted);
  const toastId = useRef(0);

  useEffect(() => {
    const loaded = normalizeProfile(readJSON<unknown>(PROFILE_KEY, null));
    ref.current = loaded;
    setProfile(loaded);
    const m = readJSON<boolean>(SOUND_KEY, false) === true;
    mutedRef.current = m;
    setMuted(m);
    setCanSave(storageAvailable());
    setToday(dateKey());
    setReady(true);
  }, []);

  const pushToast = useCallback((kind: Toast["kind"], text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const save = useCallback((p: Profile) => {
    ref.current = p;
    setProfile(p);
    if (!writeJSON(PROFILE_KEY, p)) setCanSave(false);
  }, []);

  const commit = useCallback<ArcadeContext["commit"]>(
    (change, awards = [], opts = {}) => {
      const day = dateKey();
      const before = ref.current;
      let p = change(before);
      let gained = 0;
      const earned: XPAward[] = [];
      for (const a of awards) {
        const r = award(p, a.key, a.amount);
        p = r.profile;
        if (r.gained) {
          gained += r.gained;
          earned.push(a);
        }
      }
      if (opts.activity) p = recordActivity(p, day);
      const ach = evaluateAchievements(p, day);
      p = pruneDaily(ach.profile);
      save(p);

      earned.forEach((a) => pushToast("xp", `+${a.amount} XP · ${a.label}`));
      if (levelFor(p.xp).index > levelFor(before.xp).index) pushToast("level", `Level up: ${levelFor(p.xp).name}`);
      ach.unlocked.forEach((b) => pushToast("badge", `Badge unlocked: ${b.name}`));
      if (gained) window.setTimeout(() => playSound("xp", mutedRef.current), 450);
      return gained;
    },
    [pushToast, save],
  );

  const sound = useCallback((name: Sound) => playSound(name, mutedRef.current), []);

  const toggleMute = useCallback(() => {
    const m = !mutedRef.current;
    mutedRef.current = m;
    setMuted(m);
    writeJSON(SOUND_KEY, m);
  }, []);

  const setName = useCallback(
    (name: string) => {
      const clean = name.replace(/\s+/g, " ").trim().slice(0, 24) || "Visitor";
      save({ ...ref.current, name: clean });
    },
    [save],
  );

  const resetProgress = useCallback(() => {
    removeKey(PROFILE_KEY);
    save(newProfile());
  }, [save]);

  const value = useMemo(
    () => ({ ready, canSave, today, profile, muted, commit, sound, toggleMute, setName, resetProgress }),
    [ready, canSave, today, profile, muted, commit, sound, toggleMute, setName, resetProgress],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex w-[min(92vw,360px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-5 sm:translate-x-0" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3 rounded-xl border border-accent/40 bg-panel/95 px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur"
            >
              {t.kind === "xp" && <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
              {t.kind === "level" && <TrendingUp className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
              {t.kind === "badge" && <Award className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
              <span className="font-medium">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

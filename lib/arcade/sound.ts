// Short synthesized sound effects (no audio files). The AudioContext is made on
// first use, which always follows a click or key press.
export type Sound = "key" | "flip" | "win" | "lose" | "correct" | "wrong" | "eat" | "xp";

const NOTES: Record<Sound, { f: number[]; d: number; type: OscillatorType; gain: number }> = {
  key: { f: [520], d: 0.03, type: "square", gain: 0.03 },
  flip: { f: [660], d: 0.05, type: "triangle", gain: 0.05 },
  win: { f: [523, 659, 784, 1047], d: 0.1, type: "triangle", gain: 0.07 },
  lose: { f: [392, 330, 262], d: 0.14, type: "sine", gain: 0.07 },
  correct: { f: [660, 880], d: 0.08, type: "triangle", gain: 0.06 },
  wrong: { f: [220, 180], d: 0.1, type: "sawtooth", gain: 0.035 },
  eat: { f: [880], d: 0.05, type: "square", gain: 0.035 },
  xp: { f: [784, 1175], d: 0.07, type: "triangle", gain: 0.05 },
};

let ctx: AudioContext | null = null;

export function playSound(name: Sound, muted: boolean): void {
  if (muted || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const n = NOTES[name];
    n.f.forEach((freq, i) => {
      const start = ctx!.currentTime + i * n.d;
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = n.type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(n.gain, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + n.d * 1.6);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + n.d * 1.7);
    });
  } catch {
    /* sound is optional */
  }
}

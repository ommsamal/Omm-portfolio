"use client";

import { useEffect, useRef, useState } from "react";

// A pose skeleton doing squats, with tracked joints, a live knee angle and a rep
// counter: a small picture of what the Physical Rehabilitation Assistant does.
const ACCENT = "#3DE0FF";
const BONE = "rgba(232,234,237,0.85)";
const GRID = "rgba(255,255,255,0.05)";
const rad = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function PoseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readout, setReadout] = useState({ knee: 170, reps: 0, good: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let reps = 0;
    let lastCycle = 0;
    let lastReadout = 0;
    let size = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (depth: number) => {
      const u = size / 100; // work in a 100 x 100 space
      ctx.clearRect(0, 0, size, size);

      ctx.strokeStyle = GRID;
      ctx.lineWidth = 1;
      for (let i = 10; i < 100; i += 10) {
        ctx.beginPath(); ctx.moveTo(i * u, 0); ctx.lineTo(i * u, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * u); ctx.lineTo(size, i * u); ctx.stroke();
      }

      // Side view. Angles are measured from vertical.
      const shin = rad(lerp(4, 28, depth));
      const thigh = rad(lerp(6, 78, depth));
      const torso = rad(lerp(3, 34, depth));
      const arm = rad(lerp(12, 84, depth));
      const ankle = { x: 46, y: 88 };
      const toe = { x: 60, y: 88 };
      const knee = { x: ankle.x + 22 * Math.sin(shin), y: ankle.y - 22 * Math.cos(shin) };
      const hip = { x: knee.x - 23 * Math.sin(thigh), y: knee.y - 23 * Math.cos(thigh) };
      const shoulder = { x: hip.x + 25 * Math.sin(torso), y: hip.y - 25 * Math.cos(torso) };
      const head = { x: shoulder.x + 2, y: shoulder.y - 9 };
      const elbow = { x: shoulder.x + 11 * Math.sin(arm), y: shoulder.y + 11 * Math.cos(arm) };
      const wrist = { x: elbow.x + 11 * Math.sin(arm + 0.25), y: elbow.y + 11 * Math.cos(arm + 0.25) };

      // floor
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(12 * u, 88.5 * u); ctx.lineTo(88 * u, 88.5 * u); ctx.stroke();

      const bone = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        ctx.beginPath(); ctx.moveTo(a.x * u, a.y * u); ctx.lineTo(b.x * u, b.y * u); ctx.stroke();
      };
      ctx.strokeStyle = BONE;
      ctx.lineWidth = Math.max(2, 1.1 * u);
      ctx.lineCap = "round";
      [[ankle, toe], [ankle, knee], [knee, hip], [hip, shoulder], [shoulder, elbow], [elbow, wrist]].forEach(([a, b]) => bone(a, b));
      ctx.beginPath(); ctx.arc(head.x * u, head.y * u, 5.5 * u, 0, Math.PI * 2); ctx.stroke();

      // knee angle arc
      const kneeDeg = 180 - (lerp(4, 28, depth) + lerp(6, 78, depth));
      const a1 = Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
      const a2 = Math.atan2(hip.y - knee.y, hip.x - knee.x);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = Math.max(1.5, 0.6 * u);
      ctx.beginPath(); ctx.arc(knee.x * u, knee.y * u, 7 * u, a1, a2, false); ctx.stroke();

      // tracked joints
      [ankle, knee, hip, shoulder, elbow, wrist].forEach((p) => {
        ctx.fillStyle = "#101216";
        ctx.beginPath(); ctx.arc(p.x * u, p.y * u, 2.3 * u, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(p.x * u, p.y * u, 1.5 * u, 0, Math.PI * 2); ctx.fill();
      });

      return kneeDeg;
    };

    const frame = (now: number) => {
      const period = 3600;
      const cycle = Math.floor(now / period);
      if (cycle !== lastCycle) { lastCycle = cycle; reps = (reps % 12) + 1; }
      const phase = (now % period) / period;
      const depth = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const kneeDeg = draw(depth);
      if (now - lastReadout > 90) {
        lastReadout = now;
        setReadout({ knee: Math.round(kneeDeg), reps, good: kneeDeg < 100 });
      }
      raf = requestAnimationFrame(frame);
    };

    fit();
    const onResize = () => { fit(); if (reduce) draw(0.8); };
    window.addEventListener("resize", onResize);
    if (reduce) {
      const k = draw(0.8);
      setReadout({ knee: Math.round(k), reps: 1, good: true });
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <figure className="card relative mx-auto w-full max-w-[420px] overflow-hidden p-0">
      <canvas ref={canvasRef} className="block aspect-square w-full" role="img" aria-label="Animated pose skeleton performing squats with tracked joints" />
      <figcaption className="grid grid-cols-3 border-t border-line text-sm" aria-hidden="true">
        <div className="px-4 py-3">
          <div className="text-muted">Knee angle</div>
          <div className="mt-0.5 font-medium tabular-nums">{readout.knee}°</div>
        </div>
        <div className="border-x border-line px-4 py-3">
          <div className="text-muted">Reps</div>
          <div className="mt-0.5 font-medium tabular-nums">{readout.reps}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-muted">Depth</div>
          <div className={`mt-0.5 font-medium ${readout.good ? "text-accent" : "text-text"}`}>{readout.good ? "Reached" : "Lower"}</div>
        </div>
      </figcaption>
    </figure>
  );
}

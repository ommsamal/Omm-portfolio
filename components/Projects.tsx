"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ExternalLink, X } from "lucide-react";
import { projects, type Project } from "@/data/content";
import { GithubIcon } from "./icons";
import { Reveal } from "./MotionProvider";

// Custom visuals, one per project, drawn in SVG.
function Visual({ id }: { id: Project["id"] }) {
  const common = "h-full w-full";
  if (id === "rehab")
    return (
      <svg viewBox="0 0 320 200" className={common} fill="none" aria-hidden="true">
        <rect x="70" y="18" width="180" height="164" rx="12" stroke="rgba(255,255,255,0.14)" strokeDasharray="3 9" />
        <g stroke="#E8EAED" strokeWidth="4" strokeLinecap="round">
          <circle cx="160" cy="50" r="13" />
          <path d="M160 63v50M160 78l-36-18M160 78l36-18M160 113l-22 46M160 113l22 46" />
        </g>
        <g fill="#3DE0FF">
          {[[160, 78], [124, 60], [196, 60], [160, 113], [138, 159], [182, 159]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6" />
          ))}
        </g>
        <path d="M176 70a20 20 0 0 1 4 18" stroke="#3DE0FF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  if (id === "stock")
    return (
      <svg viewBox="0 0 320 200" className={common} fill="none" aria-hidden="true">
        {[50, 90, 130, 170].map((y) => (
          <path key={y} d={`M24 ${y}h272`} stroke="rgba(255,255,255,0.07)" />
        ))}
        <g stroke="#9AA3AF" strokeWidth="2" strokeLinecap="round">
          <path d="M52 92v70M92 76v66M132 100v60M172 60v70M212 72v58M252 34v70" />
        </g>
        <rect x="44" y="108" width="16" height="38" rx="2" fill="#9AA3AF" />
        <rect x="84" y="88" width="16" height="38" rx="2" fill="#3DE0FF" />
        <rect x="124" y="114" width="16" height="32" rx="2" fill="#9AA3AF" />
        <rect x="164" y="72" width="16" height="42" rx="2" fill="#3DE0FF" />
        <rect x="204" y="84" width="16" height="30" rx="2" fill="#9AA3AF" />
        <rect x="244" y="46" width="16" height="42" rx="2" fill="#3DE0FF" />
        <path d="M276 60v-26m0 0-9 10m9-10 9 10" stroke="#3DE0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 320 200" className={common} fill="none" aria-hidden="true">
      <rect x="40" y="26" width="240" height="148" rx="10" stroke="rgba(255,255,255,0.14)" />
      <rect x="52" y="38" width="150" height="14" rx="7" fill="rgba(255,255,255,0.08)" />
      <circle cx="262" cy="45" r="9" stroke="#3DE0FF" strokeWidth="2" />
      {[52, 130, 208].map((x) => (
        <g key={x}>
          <rect x={x} y="66" width="60" height="62" rx="6" fill="rgba(255,255,255,0.06)" />
          <rect x={x} y="136" width="44" height="6" rx="3" fill="rgba(255,255,255,0.16)" />
          <rect x={x} y="150" width="28" height="12" rx="6" fill="#3DE0FF" />
        </g>
      ))}
    </svg>
  );
}

function Card({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const wide = project.flagship;

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      className={`card group relative flex h-full overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/50 ${
        wide ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(61,224,255,0.09), transparent 60%)" }}
      />
      <div className={`relative bg-raised/60 ${wide ? "aspect-[16/10] lg:aspect-auto lg:w-[44%]" : "aspect-[16/10]"}`}>
        <Visual id={project.id} />
      </div>
      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        {wide && <p className="mb-2 text-sm font-medium text-accent">Flagship project</p>}
        <h3 className={`font-semibold tracking-tight ${wide ? "text-2xl sm:text-3xl" : "text-xl"}`}>{project.name}</h3>
        <p className="mt-1 text-sm text-muted">{project.tagline}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-text/90">{project.description}</p>
        {wide && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3 pt-1 lg:mt-auto lg:pt-6">
          <button type="button" onClick={onOpen} className="btn btn-primary">
            View details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Detail({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-panel sm:rounded-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/8] bg-raised/60">
          <Visual id={project.id} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <h3 id="project-detail-title" className="text-2xl font-semibold tracking-tight">{project.name}</h3>
          <p className="mt-1 text-sm text-accent">{project.tagline}</p>
          <p className="mt-4 leading-relaxed text-text/90">{project.description}</p>
          <p className="mt-3 leading-relaxed text-muted">{project.details}</p>
          <h4 className="mt-6 text-sm font-medium text-text">Key features</h4>
          <ul className="mt-3 grid gap-2">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <h4 className="mt-6 text-sm font-medium text-text">Technologies</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <GithubIcon className="h-4 w-4" />
              View on GitHub
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [flagship, ...rest] = projects;

  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section-title">Projects</h2>
        <p className="section-lead">Three things I have built, each in a different area of software.</p>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal className="md:col-span-2">
          <Card project={flagship} onOpen={() => setActive(flagship)} />
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={0.08 * (i + 1)}>
            <Card project={p} onOpen={() => setActive(p)} />
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{active && <Detail project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}

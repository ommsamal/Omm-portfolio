import { Award, BadgeCheck, Briefcase, GraduationCap, Mail, Users } from "lucide-react";
import {
  about, achievements, certifications, education, experience, nav, positions, profile, skillGroups,
} from "@/data/content";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Reveal } from "./MotionProvider";

export function About() {
  return (
    <section id="about" className="section">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <h2 className="section-title">About me</h2>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[
              ["Degree", "B.Tech CSE"],
              ["University", "KIIT, Bhubaneswar"],
              ["Graduating", "2027"],
              ["Training", "Cisco, AI and Data Science"],
            ].map(([k, v]) => (
              <div key={k} className="card p-4">
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="space-y-4 text-[1.05rem] leading-relaxed text-text/90">
          {about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <h2 className="section-title">Technical skills</h2>
        <p className="section-lead">Grouped by where I use them.</p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={0.04 * i}>
            <div className="card h-full p-6 transition-colors duration-300 hover:border-accent/50">
              <h3 className="font-medium">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="chip">{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal>
        <h2 className="section-title">Experience</h2>
      </Reveal>
      <ol className="mt-10 space-y-6 border-l border-line pl-6 sm:pl-8">
        {experience.map((e, i) => (
          <li key={e.org} className="relative">
            <span className="absolute -left-[35px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-accent bg-ink sm:-left-[43px]" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <Reveal delay={0.08 * i}>
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">{e.org}</h3>
                </div>
                <p className="mt-1 text-sm text-muted">{e.role}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.95rem] text-text/90 marker:text-accent">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="section">
      <Reveal>
        <h2 className="section-title">Education</h2>
      </Reveal>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={0.06 * i}>
            <div className="card flex h-full flex-col p-6">
              <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{e.school}</h3>
              <p className="mt-1 text-sm text-muted">{e.detail}</p>
              <div className="mt-auto flex items-end justify-between pt-5 text-sm">
                <span className="text-muted">{e.years}</span>
                <span className="font-medium tabular-nums">{e.score}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="section">
      <Reveal>
        <h2 className="section-title">Achievements and certifications</h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {achievements.map((a, i) => (
          <Reveal key={a.title + a.where} delay={0.06 * i}>
            <div className="card h-full p-6">
              <Award className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted">{a.where}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-semibold">Positions of responsibility</h3>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {positions.map((p) => (
                <li key={p.title} className="py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-sm text-muted">{p.years}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card h-full p-6">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-semibold">Certifications</h3>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {certifications.map((c) => (
                <li key={c.title} className="py-3">
                  <span className="font-medium">{c.title}</span>
                  <p className="mt-0.5 text-sm text-muted">{c.by}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="h-5 w-5" aria-hidden="true" /> },
    { label: "LinkedIn", value: "linkedin.com/in/omm-samal", href: profile.linkedin, icon: <LinkedinIcon className="h-5 w-5" /> },
    { label: "GitHub", value: "github.com/omm-samal", href: profile.github, icon: <GithubIcon className="h-5 w-5" /> },
  ];
  return (
    <section id="contact" className="section">
      <Reveal>
        <div className="card relative overflow-hidden p-7 sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(61,224,255,0.14), rgba(61,224,255,0) 65%)" }}
          />
          <div className="relative">
            <h2 className="section-title">Get in touch</h2>
            <p className="section-lead">
              I am open to software development roles and internships. Email is the fastest way to reach me.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex h-full items-center gap-4 rounded-xl border border-line bg-raised/70 p-4 transition-colors hover:border-accent"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-accent">{l.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted">{l.label}</span>
                      <span className="block break-all text-sm font-medium">{l.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">Omm Samal</p>
          <p className="mt-1 text-sm text-muted">&copy; {new Date().getFullYear()} Omm Samal. All rights reserved.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-text">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex gap-3">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="text-muted transition-colors hover:text-accent">
            <GithubIcon className="h-5 w-5" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="text-muted transition-colors hover:text-accent">
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Send email" className="text-muted transition-colors hover:text-accent">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

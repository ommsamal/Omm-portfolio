import Link from "next/link";
import { Bug, Gamepad2, SpellCheck, Terminal, Worm } from "lucide-react";
import { Reveal } from "./MotionProvider";

const GAMES = [
  { icon: SpellCheck, name: "Tech Wordle", text: "Daily five-letter tech word" },
  { icon: Terminal, name: "Guess the Output", text: "What does this code print?" },
  { icon: Bug, name: "Debug It", text: "Find the bug, pick the fix" },
  { icon: Worm, name: "Snake", text: "The classic, in cyan" },
];

// Homepage section that links to the Dev Arcade at /arcade.
export default function ArcadeTeaser() {
  return (
    <section id="arcade" className="section">
      <Reveal>
        <div className="card grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <h2 className="section-title">Omm&rsquo;s Dev Arcade</h2>
            <p className="mt-2 font-medium text-accent">Think. Code. Play. Repeat.</p>
            <p className="mt-4 max-w-md text-muted">
              Four small games I built into this site: a tech Wordle with a daily puzzle, code quizzes in Python, JavaScript, Java and C++, and Snake. Earn XP, level up and collect badges.
            </p>
            <Link href="/arcade" className="btn btn-primary mt-6">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              Enter the arcade
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {GAMES.map(({ icon: Icon, name, text }) => (
              <li key={name} className="flex items-center gap-3 rounded-xl border border-line bg-raised/50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{name}</span>
                  <span className="block text-xs text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

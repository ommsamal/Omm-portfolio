# Omm Samal Portfolio

Personal portfolio built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion and Lucide icons.

## Folder structure

```
app/
  layout.tsx      SEO metadata, font, global wrapper
  page.tsx        Puts the sections together
  globals.css     Tailwind layers and shared styles
  icon.svg        Favicon
components/
  Navbar.tsx      Sticky nav, mobile menu, resume button
  Hero.tsx        Intro, buttons, social links
  PoseCanvas.tsx  Animated pose skeleton in the hero
  Projects.tsx    Project cards and the detail view
  Sections.tsx    About, Skills, Experience, Education, Achievements, Contact, Footer
  BackToTop.tsx   Floating back-to-top button
  MotionProvider.tsx  Reduced-motion support and scroll reveal
  icons.tsx       GitHub and LinkedIn marks
  ArcadeTeaser.tsx  Homepage section linking to the arcade
  arcade/         Dev Arcade screens (dashboard, games, shared parts)
app/arcade/       Arcade routes: /arcade, /arcade/wordle, /arcade/guess-the-output,
                  /arcade/debug-it, /arcade/snake
lib/arcade/       Arcade game logic, separate from the UI (see below)
scripts/
  test-arcade.ts  Unit tests for the arcade logic
data/
  content.ts      ALL text, links and project data. Edit this to update the site.
public/
  Omm_Samal_Resume.pdf   File served by the "Download resume" buttons
```

## Run it on your computer

You need Node.js 18.17 or newer (https://nodejs.org).

```bash
npm install        # install dependencies (once)
npm run dev        # development server at http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Omm's Dev Arcade

Four games at `/arcade`: Tech Wordle (daily puzzle and practice), Guess the Output, Debug It and Snake, with shared XP, levels, streaks and badges.

- `lib/arcade/words.ts`: Wordle answers. Add new words at the end of the list so earlier daily puzzles keep their answers.
- `lib/arcade/questionBank.ts`: Guess the Output questions. Append an object with a unique `id`.
- `lib/arcade/debugBank.ts`: Debug It challenges. Append an object with a unique `id`.
- `lib/arcade/progress.ts`: XP values, levels and badges.
- `lib/arcade/daily.ts`: the daily puzzle changes at midnight India time, the same moment for every visitor.

Progress is stored in each visitor's browser (localStorage). There is no shared leaderboard; that would need a backend and a database.

Run the logic tests with:

```bash
npx tsx scripts/test-arcade.ts
```

## Things to update

- `data/content.ts`: set each project's `github` to its repository link, add `demo` to show a Live demo button, and add StockML accuracy figures to `features` when you have them.
- `data/content.ts`: change `profile.siteUrl` to your real address after deploying.
- `public/Omm_Samal_Resume.pdf`: replace with a newer resume, keeping the same file name.

## Put it on GitHub

1. Create an empty repository at https://github.com/new (for example `portfolio`). Do not add a README there.
2. In this folder run:

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/omm-samal/portfolio.git
git push -u origin main
```

## Deploy on Vercel

1. Sign in at https://vercel.com with your GitHub account.
2. Choose "Add New", then "Project", and import the `portfolio` repository.
3. Vercel detects Next.js automatically. Keep the default settings and press Deploy.
4. Every later `git push` to `main` redeploys the site.

## Custom domain

1. Buy a domain from any registrar.
2. In Vercel open the project, then Settings, then Domains, and add the domain.
3. Add the DNS records Vercel shows you at your registrar (an A record for the root domain, a CNAME for `www`).
4. Wait for DNS to update, then set `profile.siteUrl` in `data/content.ts` to the new address and push.

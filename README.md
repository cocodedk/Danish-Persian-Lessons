# Danish-Persian Lessons

This free web app teaches Persian reading from the first right-to-left step, with Danish as the language of
instruction. It assumes no spoken Persian and no knowledge of the script. It also works for heritage speakers
who understand Persian but never learned to read it, and for readers who want a gentler restart. Every Persian
item comes with a Danish explanation, an approachable Danish pronunciation, and precise IPA. It runs in the
browser, with nothing to install and no account to create.

«آموزش خواندن و نوشتن فارسی برای دانمارکی‌زبان‌ها»

Lær at læse persisk, helt fra alfabetet.

## Website

- [English](https://cocodedk.github.io/Danish-Persian-Lessons/)
- [Dansk](https://cocodedk.github.io/Danish-Persian-Lessons/da/)
- [فارسی (Persian)](https://cocodedk.github.io/Danish-Persian-Lessons/fa/)

## Features

- Lessons start at the alphabet, then move to the marks that make letters pronounceable: زیر، زبر، پیش and
  the long vowels آ او ای. The marks are drawn in red, the way a teacher writes them over a pupil's word.
- Word cards are split down the middle. Persian on top, set right-to-left and large enough for the
  diacritics to breathe, with the Danish word below it, quieter.
- Vocabulary follows the Iranian first-grade reader (آب/vand, نان/brød, من/jeg, تو/du), so words arrive in
  the order a child in Iran meets them rather than the order that happens to suit an app.
- Every lesson is a plain static page, so one you have already opened keeps working when the train goes
  into a tunnel.
- Progress is written to `localStorage` and stays on the device. No accounts, no analytics, nothing sent
  anywhere. The flip side of that: clearing your browser data clears your progress.
- Built for a phone. One hand, thumb reach, 360px upward. Bigger screens get the same layout with more air.
- The app recommends orientation, alphabet, your name, then vocabulary, while leaving every lesson open.
- Short tap-only puzzle breaks use material already taught. They are skippable, replayable, and never unlock
  required content.
- An on-screen Persian keyboard supports typing without a Persian keyboard layout installed.
- Free and open source, Apache-2.0.

## Try it

The landing site is live in all three languages, and so is the app.

What ships at [`/app/`](https://cocodedk.github.io/Danish-Persian-Lessons/app/) includes orientation,
the alphabet and vowel marks, personal-name spelling, first-reader vocabulary, a Persian keyboard,
generous feedback, and short puzzle breaks. There is no signup and no waiting list.

## Build from Source

You need `git` and Node.js 20 or newer for the React app. The landing site in `website/` stays
plain HTML with no build step; any static file server shows it — Python's built-in one is enough.

```bash
git clone https://github.com/cocodedk/Danish-Persian-Lessons.git
cd Danish-Persian-Lessons
./scripts/install-hooks.sh
bash scripts/verify.sh
```

`install-hooks.sh` points `core.hooksPath` at `.githooks/`. That setting is per-clone, so every fresh clone
needs it. `verify.sh` runs the same checks CI runs.

To read the site the way a visitor does:

```bash
python3 -m http.server 8000 --directory website
# http://localhost:8000/  ·  /da/  ·  /fa/
```

The React app lives at the repo root (scaffolded per
[docs/plans/001-scaffold-app.md](docs/plans/001-scaffold-app.md)):

```bash
npm ci
npm run dev        # Vite dev server for the app
npm run verify     # lint + tests + build + verify.sh — the same gate CI runs
```

## Architecture

```
Danish-Persian-Lessons/
├── website/                    # the static landing site, deployed to GitHub Pages
│   ├── index.html              # English
│   ├── da/index.html           # Dansk
│   └── fa/index.html           # فارسی, right-to-left
├── src/                        # the React app, served at /app/
├── public/fonts/               # self-hosted Vazirmatn, Noto Naskh Arabic, Andika (OFL)
├── index.html · vite.config.ts · package.json
├── docs/
│   ├── plans/                  # numbered implementation plans; agents execute these
│   ├── specs/                  # normative cross-plan product, learning, and accessibility specs
│   └── design/
│       └── ART-DIRECTION.md    # the "exercise notebook" design system
├── .github/workflows/          # ci.yml (checks) and deploy-pages.yml (Pages)
├── .githooks/                  # pre-commit, commit-msg, pre-push
├── scripts/                    # install-hooks.sh, verify.sh
└── CLAUDE.md                   # house rules for agents working in this repo
```

| Layer | Choice |
|---|---|
| Site | Hand-written HTML and CSS, no build step |
| App | React + Vite with `HashRouter` (GitHub Pages cannot rewrite paths for a client-side router) |
| Graphics | SVG for letterforms and stroke order; three.js only if a lesson genuinely needs 3D |
| Storage | `localStorage`, keys namespaced `dpl.v1.*` |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Corrections from native Persian and Danish speakers are the most useful thing this project can receive.
[CONTRIBUTING.md](CONTRIBUTING.md) explains how to send one.

## Author

**Babak Bandpey** — [cocode.dk](https://cocode.dk) | [LinkedIn](https://linkedin.com/in/babakbandpey) | [GitHub](https://github.com/cocodedk)

## License

Apache-2.0 | © 2026 [Cocode](https://cocode.dk) | Created by [Babak Bandpey](https://linkedin.com/in/babakbandpey)

# Danish-Persian Lessons

Plenty of people in Denmark grew up hearing Persian at home and can hold a whole conversation in it, but a
shop sign in Tehran is still a wall of shapes. This is a free web app that teaches reading Persian from the
alphabet up, with Danish as the language of instruction. Every card is split in two, the Persian word on top
and the Danish equivalent underneath, and the early lessons spend most of their time on the vowel marks,
because that is the part nobody explains and the part that turns a row of consonants into a word you can say
out loud. It runs in the browser, with nothing to install and no account to create.

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
- An on-screen Persian keyboard is planned, so typing exercises will work without a Persian layout installed.
- Free and open source, Apache-2.0.

## Try it

The landing site is live in all three languages, and so is the app.

What ships at [`/app/`](https://cocodedk.github.io/Danish-Persian-Lessons/app/) today is the split-screen
shell: one demo pair (آب/vand) and the first-run name capture. The first lesson, covering the
alphabet and the vowel marks, is still being written. There is no signup and no waiting list. Watch the
[repository](https://github.com/cocodedk/Danish-Persian-Lessons) if you want to know when the first lesson
lands.

## Build from Source

You need `git`, plus any static file server to view `website/` locally. Python's built-in one is enough.
Node.js 20 or newer matters only for the React app once it exists; the site has no build step and no
dependencies.

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

There is no `package.json` yet. The React scaffold is specified in
[docs/plans/001-scaffold-app.md](docs/plans/001-scaffold-app.md) and has not been executed, so `npm install`
and `npm run dev` will not work until it has been.

## Architecture

```
Danish-Persian-Lessons/
├── website/                    # the static landing site, deployed to GitHub Pages
│   ├── index.html              # English
│   ├── da/index.html           # Dansk
│   └── fa/index.html           # فارسی, right-to-left
├── docs/
│   ├── plans/                  # numbered implementation plans; agents execute these
│   └── design/
│       └── ART-DIRECTION.md    # the "exercise notebook" design system
├── .github/workflows/          # ci.yml (checks) and deploy.yml (Pages)
├── .githooks/                  # pre-commit, commit-msg, pre-push
├── scripts/                    # install-hooks.sh, verify.sh
└── CLAUDE.md                   # house rules for agents working in this repo
```

| Layer | Choice |
|---|---|
| Site | Hand-written HTML and CSS, no build step |
| App (planned) | React + Vite with `HashRouter` (GitHub Pages cannot rewrite paths for a client-side router) |
| Graphics | SVG for letterforms and stroke order; three.js only if a lesson genuinely needs 3D |
| Storage | `localStorage`, keys namespaced `dpl.v1.*` |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Corrections from native Persian and Danish speakers are the most useful thing this project can receive.
[CONTRIBUTING.md](CONTRIBUTING.md) explains how to send one.

## Author

**Babak Bandpey** — [cocode.dk](https://cocode.dk) | [LinkedIn](https://linkedin.com/in/babakbandpey) | [GitHub](https://github.com/cocodedk)

## License

Apache-2.0 | © 2026 [Cocode](https://cocode.dk) | Created by [Babak Bandpey](https://linkedin.com/in/babakbandpey)

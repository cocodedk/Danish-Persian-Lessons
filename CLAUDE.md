# CLAUDE.md — Danish-Persian Lessons

## Project Overview

A free, mobile-first, purely static web app that teaches Danish speakers to READ Persian (Farsi),
published on GitHub Pages at https://cocodedk.github.io/Danish-Persian-Lessons/. It assumes no spoken,
written, or reading knowledge of Persian. Heritage speakers and hesitant readers remain welcome, but
every Persian item must also work for an absolute beginner. Reading comes first; audio is later.
"Danish-Persian-Lessons" is a working title —
never hardcode it outside `vite.config.ts` and the workflows.

- **Language / Runtime**: TypeScript, Node.js ≥ 20 (app scaffolded per `docs/plans/001`; lessons arrive with 003+)
- **Framework**: React + Vite (app), plain HTML/CSS (landing site in `website/`)
- **Architecture**: static SPA, no backend, no database, no accounts — ever
- **Hosting**: GitHub Pages via Actions; owner `cocodedk`

## Product Contract (non-negotiable)

- Split screen: **Persian on top** (`lang="fa" dir="rtl"`, large type), **Danish below** (`lang="da"`).
- Mobile-first: fully usable one-handed on a phone in portrait; nav in the bottom thumb zone.
- 100% static: every lesson is data committed to the repo. No runtime fetches to external services.
- Progress: browser `localStorage` only, keys namespaced `dpl.v1.*`, must survive empty/cleared/denied storage.
- Personalization: the learner may enter a name (optional, always skippable, editable, deletable);
  stored only in `dpl.v1.profile` and used as a teaching instrument — greeting, name-letter badges,
  write-your-name lesson (plan 006). The app is fully usable with no name given.
- Teaching before testing (plan 010): orientation opens before optional name capture; every app-owned
  Persian letter, mark, word, sign, and phrase has Danish help, dansk lydskrift, and standard Tehrani
  IPA from the typed catalog. Exercises may hide answer metadata only while an attempt is active.
- The curriculum recommends orientation → alphabet → name → vocabulary, but no lesson or puzzle
  ever locks another. Puzzle breaks are skippable and replayable (plan 011).
- Rewards are generous by design (plan 007): every completion celebrates — praise, stickers,
  jingles, levels, bonus-exercise gifts; nothing is ever taken away; streaks rest, never reset;
  wrong answers never shame. The app must never disappoint the learner.
- Graphics: SVG first. three.js only if a lesson truly needs 3D, and then lazy-loaded.
- Routing: HashRouter (GitHub Pages has no server rewrites); Vite `base` = `/Danish-Persian-Lessons/app/`.

## Curriculum (order matters — no rush)

0. **Orientation**: how Persian writing works — written RIGHT to LEFT, letters join and change
   shape, no capitals, dots matter (opens plan 003's lesson; shown, not told).
1. **Alphabet**: the 32 letters, positional forms, a stroke-order drawing for every letter
   (pen right-to-left, dots last), then the vowel marks — زبر (اَ), زیر (اِ), پیش (اُ) and long
   آ او ای — with Danish sound anchors (a i "kat", e i "let", o i "foto", å i "år", u i "du", i i "vi").
2. **Your name** («نامِ تو»): straight after the alphabet the learner reads and assembles their own
   name in Persian letters — the motivation hook (plan 006).
3. **Grade-1 vocabulary**, Iranian first-grade primer order: آب، بابا، نان، مادر… plus من، تو، او، ما، شما، این/آن.
4. **Exercises**: recognize → match → type (on-screen Persian keyboard component, plan 005).

Every app-owned Persian letter, word, sign, symbol, and phrase carries Danish help plus pronunciation
**twice** — dansk lydskrift ("åb") and IPA ([ɒːb], standard Tehrani Persian) — in the typed
catalog, never improvised in the UI. A displayed Persian letter name is its own catalog entry. Learner
input is the only composition-time exception; names get letter-by-letter help, never fabricated IPA.

Plan 010 supersedes the narrower pronunciation contracts in completed plans 001–009; those files stay
unchanged as historical records.

Per-lesson specs live in `docs/plans/`. Sequence and status: `docs/plans/ROADMAP.md`.

## Persian text rules (ALL Persian content)

- Persian code points only: ک (U+06A9) never ك, ی (U+06CC) never ي; digits ۰–۹ (U+06F0–06F9).
- ZWNJ (U+200C) for نیم‌فاصله: می‌روم، کتاب‌ها.
- Full diacritics (اِعراب) on teaching specimens only — that's the pedagogy — never on UI chrome.
- Vowel marks and newly-taught elements render in `--red` (teacher's pen), per the design system.

## Danish text rules

- Everyday Danish, du-form, short sentences, no sales tone. Vowel marks are "vokaltegn" in UI copy.

## Agent Roles

- **Fable — art director, planner, advisor.** Owns `docs/plans/` and `docs/design/ART-DIRECTION.md`,
  writes/approves plans, reviews executor output. Does not implement features.
- **Opus & Sonnet — executors.** Take the next unchecked plan in `docs/plans/ROADMAP.md`, implement it
  exactly, check off its acceptance list, stop at the plan boundary. No new dependencies, no scope
  creep, no redesign. Blocked or ambiguous → write questions under `## Questions` at the top of the
  plan file and stop.

## Required Skills — invoke when the situation arises

| Situation | Skill |
|-----------|-------|
| Any new UI, screen, or visual element | `frontend-design:frontend-design` (then follow ART-DIRECTION.md) |
| Before writing or editing code | `karpathy-guidelines` |
| Learner-facing / public Danish copy | `humanizer-da` |
| Learner-facing / public Persian copy | `humanizer-pa` |
| Public English copy (README, site) | `humanizer` |
| After implementing — quality pass | `simplify` |
| Reviewing a PR | `pr-review-toolkit:review-pr` (or `/code-review` for the working diff) |

Invoke nothing beyond these and the built-ins without Babak asking. The allowlist is enforced in
`.claude/settings.json` (committed; `skillOverrides` / `enabledPlugins` — personal overrides may still go in the gitignored `.claude/settings.local.json`) — flip a skill on there if a task
genuinely needs it, and flip it back.

## Architecture

```
website/            trilingual landing (en root, da/, fa/) — plain HTML/CSS, deployed as site root
docs/plans/         ROADMAP.md + numbered plans (001-scaffold-app.md is next)
docs/design/        ART-DIRECTION.md — binding design system (palette, type, notebook signature)
.github/workflows/  ci.yml (job `verify`) · deploy-pages.yml (site → Pages; app joins at /app/)
.githooks/          pre-commit (fast) · commit-msg (Conventional Commits) · pre-push (owner-lock + full gate)
scripts/            verify.sh · install-hooks.sh · setup-repo.sh · subset-fonts.py (authoring-time)
src/, public/       (arrive with plan 001: Vite React app, lessons data, progress storage)
```

## Engineering Principles

- **200-line maximum per file** — extract when approaching it.
- DRY · SOLID · KISS · YAGNI: shared logic gets a name; one thing per function; don't build ahead of
  the roadmap; delete dead code on sight.
- **TDD for logic** (lesson data integrity, storage, keyboard mapping): failing test first. UI is
  verified visually (`run` skill + 360px viewport + RTL check) — screenshots beat assertions there.
- Tests guard the text rules too: fa strings reject Arabic ك/ي and ASCII digits (see plan 001).
- Conventional Commits (`feat:` / `fix:` / `docs:` …) — the commit-msg hook enforces it.
- No new dependencies unless the active plan names them.

## Commands

```bash
./scripts/install-hooks.sh   # once per clone
bash scripts/verify.sh       # fast content/structure gate (pre-commit, pre-push, CI all run this)
# after plan 001: npm run dev | build | lint | test | verify
```

Deploy = push to `main` → Actions builds and publishes Pages. Never deploy by hand.

## Context & Skills Policy

Keep context lean. Don't paste lesson datasets, font files, or long HTML into conversation — reference
paths. Keep this file under ~180 lines; details go to `docs/` and get linked. When a session produces a
durable decision, it goes in the relevant plan file, not into chat history.

## Starting a New Session

1. Read this file.
2. `bash scripts/verify.sh` — confirm green before touching anything.
3. Executors: open `docs/plans/ROADMAP.md`, take the next unchecked plan, follow it exactly.
4. UI work: invoke `frontend-design:frontend-design`, then obey `docs/design/ART-DIRECTION.md`.

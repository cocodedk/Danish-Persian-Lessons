# Roadmap — Danish-Persian Lessons

Protocol: one plan at a time, in order. Fable writes and approves plans; Opus/Sonnet executors
implement them exactly and check off acceptance items. Questions go under `## Questions` at the top
of the plan file. A plan is done when its acceptance list is fully checked and `verify.sh` (plus, once
the app exists, `npm run verify`) is green.

## Phases

- [x] **P0 — Infrastructure** (done 2026-08-03): repo, CI, Pages deploy, trilingual landing site,
      hooks, hygiene, CLAUDE.md, art direction, this roadmap.
- [x] **P1 — [001-scaffold-app.md](001-scaffold-app.md)** (merged 2026-08-03, PR #5, two critic
      rounds): app live at `/app/`, split-screen shell + pronunciation line, name capture, storage,
      self-hosted fonts, gates upgraded.
- [ ] **P2 — [002-design-system.md](002-design-system.md)**: notebook-page component kit per ART-DIRECTION.
- [ ] **P3 — [003-alphabet-lesson.md](003-alphabet-lesson.md)**: orientation ("Persian runs right to
      left", joining, shapes, no capitals) + Lesson 1 — letters with stroke-order drawings, forms,
      vowel marks (name-letter badges shipped dormant).
- [ ] **P4 — [007-rewards-streaks.md](007-rewards-streaks.md)**: generosity-first reward engine —
      ticks, stickers, jingles, levels, resting streaks, bonus-exercise gifts. Lands right after the
      first lesson so everything afterwards celebrates.
- [ ] **P5 — [006-your-name.md](006-your-name.md)**: Persian spelling of the learner's name,
      transliteration engine, badges activate, "write your name" mini-lesson. The motivation hook.
- [ ] **P6 — [004-grade1-vocab.md](004-grade1-vocab.md)**: grade-1 primer word units (آب/vand …).
- [ ] **P7 — [005-persian-keyboard.md](005-persian-keyboard.md)**: on-screen Persian keyboard +
      typing exercises (capstone: type your own name).

(Plan file numbers are stable IDs, not execution order — the sequence above is the order.)

## Later (not planned yet — do not build ahead)

Audio pronunciation · spaced repetition on top of progress data · full writing practice (tracing
letters with a finger, beyond the stroke-order drawings of P3) · PWA offline install · possible
project rename (working title may change).

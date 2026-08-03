# Plan 007 — Rewards, Streaks & Levels («آفرین‌نامه»)

Executor: Opus (tone-critical). Depends on: 003 (first completable lesson exists). Cross-cutting:
every later plan (006, 004, 005) plugs its completions into this engine.

## Questions
(none yet — add here and stop if blocked)

## Goal

A generosity-first reward engine. The learner is rewarded more than they expect, never less:
every completion celebrates, nothing ever disappoints, and a reward can itself be more learning
(a bonus exercise as a gift), with jingles and fanfare and leveling up.

## The generosity rules (testable, non-negotiable)

1. **Nothing is ever taken away**: levels never drop, stickers are permanent, points only go up.
2. **Streaks never reset**: a missed day puts the streak *at rest* («stimen hviler» / «رشته‌ات
   خوابیده») — one exercise wakes it at its previous value + 1. Total practice-days always grows.
   The UI never shows a zero after progress exists, and never says "lost/mistet".
3. **Every completion celebrates**: any exercise → at least a red margin tick + a warm, varied
   praise line. Milestones → sticker stamp (آفرین / ستارهٔ طلایی / the ۲۰ mark) + jingle.
   Page complete → level-up: notebook page-flip + fanfare.
4. **Wrong answers are teaching moments**: gentle «دوباره» / "prøv igen", no buzzer sound, nothing
   deducted, no red-shame styling (the teacher's red pen marks the correction, not the child).
5. **Surprise generosity**: occasional extra gifts on a deterministic schedule seeded by progress
   counts (no `Math.random` in logic paths — keep it testable): a bonus exercise
   («یک تمرین جایزه!» / "En bonusøvelse i gave!"), a second sticker, a bigger fanfare.
6. **Rewards may BE content**: a bonus exercise is a fun extra (find your name-letters in a word,
   a quick vowel-chip round) — framed as a gift, always skippable without loss.

## Build

1. `src/rewards/engine.ts` — pure, TDD first: event in (exercise/lesson/page complete + local
   date) → rewards out (ticks, praise line, stickers, level, streak state, surprise gifts).
   Storage `dpl.v1.rewards`: `{ stickers[], level, points, practiceDates[], streak: { value,
   resting } }`. Local-midnight day boundaries; clock injected for tests.
2. `src/rewards/sound.ts` — WebAudio-synthesized jingles, no audio files, no dependencies:
   tick-pluck, sticker-chime, level fanfare (santur-ish timbre per ART-DIRECTION). Only after a
   user gesture; mute toggle persisted in `dpl.v1.settings`; default on.
3. Components per ART-DIRECTION "Celebration & sound": `StickerStamp` (SVG آفرین / ۲۰ / star,
   stamps in), `InkConfetti` (`--red`/`--blue` dots on paper), `PageFlip` level-up overlay,
   `StreakLine` for home ("5 dage · stimen hviler — én øvelse vækker den"). Reduced motion:
   rewards appear instantly, still granted, zero animation.
4. Wire into 003's exercises and lesson completion; expose one plain API for later plans.

## Acceptance

- [x] Engine tests: streak rest → wake resumes at value + 1 (never reset); local-midnight day
      boundaries; permanence (no code path decreases level/points/stickers — assert by API shape,
      not discipline); surprise schedule deterministic and replayable
      → `src/rewards/engine.test.ts`, `src/rewards/streak.test.ts`
- [x] Completing a full lesson produces a celebration on every exercise and a level-up at page end
      → `src/pages/rewards.test.tsx` plays all 33 questions and asserts praise on every one
- [x] Simulated 10-day absence then one exercise: welcomed back warmly, streak resumes, nothing
      lost, no guilt copy anywhere → `src/pages/welcomeBack.test.tsx`, incl. a guilt-word scan of
      the rendered page
- [x] Mute works, persists across reload, and no sound ever fires before the first user gesture
      → `src/rewards/sound.test.ts` (no AudioContext is even constructed pre-gesture)
- [x] Reduced motion: every reward still visibly granted, zero animation
      → `src/components/celebration.test.tsx` + browser check at 360px (stamps opacity 1,
      animation-name none, confetti — decoration only — dropped)
- [ ] Learner-persona critic answers "did any moment disappoint, shame, or nag?" with a flat no
      → for the critic round; the builder cannot sign its own persona review
- [ ] Teacher-persona critic confirms the Persian praise is natural and varied (آفرین، ایول،
      چه خوب و…) — and the Danish equally so (Flot! · Sådan! · Godt gået!)
      → for the critic round; `humanizer-pa`/`humanizer-da` passes ran (احسنت → باریکلا, em dash
      out of the Persian streak line)
- [x] `npm run verify` + CI green; no new dependencies

## Decisions taken while building

- **`--gold` joins `tokens.css`.** ART-DIRECTION names the gold star («ستارهٔ طلایی») under
  "Celebration & sound" but its palette table stops at six colours, and GATE 7 allows no colour
  literal outside `tokens.css`. Added as a light/dark pair, used by that one sticker, and held to
  the same both-schemes assertion as every other semantic token.
- **A level is a notebook page.** `level = 1 + floor(points / 20)` — twenty points to a page, the
  ۲۰/۲۰ a teacher writes at the top. A `page` event rounds the total up to the next full page, so
  finishing a round always fills exactly one page and always fires exactly one page-flip.
- **The streak value is the practice-day count.** `practiceDates` is append-only, and the streak
  value is its length. Resetting a streak would mean deleting days the learner really practised,
  which no code path can do. "Resting" is derived from the clock at read time, never stored as
  progress.
- **One red margin line stays with `RuledSection`.** The gift card rules off with a red line
  ACROSS its top instead, and the page-flip carries none.

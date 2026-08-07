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
2. **Streaks never reset**: after a missed day the learner still sees «træningen fortsætter
   stadig» / «تمرین هنوز ادامه دارد» — one exercise resumes at the previous value + 1. Total
   practice-days always grows.
   The UI never shows a zero after progress exists, and never says "lost/mistet".
3. **Every completion celebrates**: any exercise → at least a red margin tick + a warm, varied
   praise line. Milestones → sticker stamp (آفرین / ستارهٔ طلایی / the ۲۰ mark) + jingle.
   Page complete → level-up: notebook page-flip + fanfare.
4. **Wrong answers are teaching moments**: gentle «دوباره» / "prøv igen", no buzzer sound, nothing
   deducted, no red-shame styling (the teacher's red pen marks the correction, not the child).
5. **Surprise generosity**: occasional extra gifts on a deterministic schedule seeded by progress
   counts (no `Math.random` in logic paths — keep it testable): a bonus exercise
   («یک تمرین جایزه!» / "En bonusøvelse!"), a second sticker, a bigger fanfare.
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
   `StreakLine` for home ("Træningen fortsætter stadig"). Reduced motion:
   rewards appear instantly, still granted, zero animation.
4. Wire into 003's exercises and lesson completion; expose one plain API for later plans.

## Acceptance

- [x] Engine tests: streak rest → wake resumes at value + 1 (never reset); local-midnight day
      boundaries; permanence (no code path decreases level/points/stickers — assert by API shape,
      not discipline); surprise schedule deterministic and replayable
      → `src/rewards/engine.test.ts`, `src/rewards/streak.test.ts`, and — for the "by API shape,
      not discipline" half, which is what makes this box an [x] — `src/rewards/permanence.test.ts`:
      an export-surface snapshot of `engine` and `records` (any future mutator is a visible diff),
      the one mutator's signature (no parameter on this API can carry a total inwards), a sweep of
      every own name on `Object.prototype` used as an event kind, and a seeded monotonicity fuzz
      (seeds 1 · 7 · 42 · 1337 · 2026 · 20260803, from clean / mid-progress / hostile-corrupt
      starts, with clocks forwards, backwards and invalid) that re-reads points, level, sticker
      count and streak value after every single event
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
- [ ] Teacher-persona critic confirms the Persian praise is natural, simple, and varied (آفرین،
      عالی، چه خوب، خیلی خوب، خوب بود، درست بود) — and that each Danish line mirrors its meaning
      → for the critic round; the builder cannot approve its own bilingual review
- [x] `npm run verify` + CI green; no new dependencies

## Decisions taken while building

- **`--gold` joins `tokens.css`.** ART-DIRECTION names the gold star («ستارهٔ طلایی») under
  "Celebration & sound" but its palette table stops at six colours, and GATE 7 allows no colour
  literal outside `tokens.css`. Added as a light/dark pair, used by that one sticker, and held to
  the same both-schemes assertion as every other semantic token.
- **A level is a notebook page.** `level = 1 + floor(points / 20)` — twenty points to a page, the
  ۲۰/۲۰ a teacher writes at the top. A `page` event rounds the total up to the next full page.
  **Correction (critic round 2):** this does not mean a round fires exactly one page-flip. A round
  long enough to cross a page boundary mid-round fires a level-up right there too, in addition to
  the one its own closing `page` event fires. This app's only round length (33 questions, each an
  `answer` worth 1 point) crosses the 20-point boundary at question 20, so a full round actually
  fires **two** page-flips — mid-round and at the end — not one. Accepted as correct, generous
  behavior; nothing to fix, only the sentence above was wrong.
- **The streak value is the practice-day count.** `practiceDates` is append-only, and the streak
  value is its length. Resetting a streak would mean deleting days the learner really practised,
  which no code path can do. "Resting" is stored but ignored on read; derived fresh each read from
  the clock and `practiceDates` (correction, critic round 3 — this used to say "never stored").
- **One red margin line stays with `RuledSection`.** The gift card rules off with a red line
  ACROSS its top instead, and the page-flip carries none.

## Critic round 1 (2026-08-03) — FAIL, adjudicated

Both the learner-persona and teacher-persona critic passes failed round 1. The findings were
adjudicated and built by the round-2 fix builder (PR #10), one line each:

- **D1 permanence.** `numberOr` rejected non-finite numbers but not negative ones; it now requires
  `Number.isFinite(v) && v >= 0`. `earn`'s `POINT_AWARD` lookup was unguarded against an
  unknown/missing event kind, which produced `NaN`; it now falls back to `0`.
- **D2 null payload.** `storage.readJSON` handed a bare `null` straight to the caller when an
  envelope's `value` was `null`, crashing the first field access downstream; it now treats a
  `null` value as absent and returns the fallback (arrays are still accepted). `engine.normalize`
  also takes `raw ?? {}` as a second line of defense.
- **D3 negative-storage clamp.** Rides D1's fix: a hostile negative point total sitting in storage
  can no longer produce a negative page/level on read, because `numberOr` now floors it out.
- **D4 null-reward confetti.** `Celebration` computed `loud` from `reward?.levelUp !== null`, which
  is `true` when `reward` itself is `null` (`undefined !== null`); a null reward fired confetti it
  had no business firing. Fixed to `(reward?.levelUp ?? null) !== null`.
- **D5 backwards clock.** `engine.normalize` now sorts `practiceDates` (the `YYYY-MM-DD` keys sort
  lexically in date order), so a streak read always finds the true latest day rather than
  whichever date happened to be appended last. The same fix closes the `dayKey` guard: an invalid
  `Date` passed to `celebrate` still pays out points and stickers, but the practice-day append is
  skipped, so a bad clock can never write `"NaN-NaN-NaN"` to storage.
- **Copy (teacher persona).** The original welcome-back line was later simplified to
  «دوباره سلام!» / “Hej igen!” during the whole-app parity review, keeping both sides exact and
  using only high-frequency words.
- **Sticker labels single-sourced.** `StickerStamp`'s SVGs quoted آفرین and ۲۰ as JSX literals of
  their own instead of reading `STICKER_LABELS`, so the text-rule guard — which walks
  `STICKER_LABELS` via `REWARD_FA_STRINGS` — never actually walked what the stamps rendered. They
  now render `STICKER_LABELS[kind].fa` directly.
- **Gift idempotency.** A bonus round's URL could be revisited after completion for unbounded
  extra points and stickers. `RewardsRecord` gained `giftsOpened`, an append-only set joined by
  union like everything else; `celebrate` now pays a given gift id out exactly once — a replay
  stays playable and praised, but earns nothing new, mirroring how a letter marked done by
  `markLetterDone` cannot be marked done again for more credit.

## Critic round 2 (2026-08-03) — FAIL, adjudicated

Round 2 failed on permanence again: the hole had been patched at the instance, not at the class.
The findings were adjudicated and built by the round-3 fix builder (PR #10), one line each:

- **Prototype-key hole, closed twice over.** `POINT_AWARD['__proto__']` returned `Object.prototype`
  from a plain object literal, string-concatenated into the point total and came back as a `NaN`
  that wiped the record. The table is now null-prototype (`Object.create(null)`) and `earn` gates
  on `Object.hasOwn` membership, so no inherited name is an event kind; independently, `join`
  normalizes both operands, so every number reaching the maximum has passed the finite-and-≥0 rule
  and a `NaN` cannot survive a join whoever produced it. Either fix alone leaves a red test.
- **Permanence asserted by API shape.** `src/rewards/permanence.test.ts` snapshots the export
  surface of `engine` and `records`, pins the one mutator's signature, sweeps every own name on
  `Object.prototype` (computed, not typed out) plus `'bogus'`/`undefined`/`null` against a real
  45-point state, and runs a deterministic monotonicity fuzz — six seeds × three seeded starts
  (clean, mid-progress, hostile-corrupt) × forwards/backwards/invalid clocks, re-reading
  points/level/sticker-count/streak after every event. No `Math.random` anywhere.
- **200-line cap.** `engine.ts` (223) split: the record algebra — `numberOr`, `normalize`, `join`,
  `readRecord`, `saveRecord` — moved to `src/rewards/records.ts`; `engine.ts` keeps `celebrate`,
  `getRewards` and `earn`. `engine.test.ts` (241) split into `engine.test.ts` (what a completion
  feels like) and `permanence.test.ts` (what can never be taken away). Whole `src/` tree ≤ 200.
- **`readJSON` contract.** The object/array-only narrowing is now documented on `readJSON` as a
  contract — the store keeps records, not scalars — with a test asserting `'Sara'`, `7` and `true`
  read back as the fallback. No behavior change; the trap is now a stated rule.
- **Gift wiring test.** `src/pages/bonus.test.tsx` plays the bonus round from its own URL twice and
  asserts the second pass adds nothing. Dropping `giftId` from either `celebration.cheer` call in
  `BonusScreen` turns it red.
- **Partial-gift farming.** Answering a bonus round's questions without finishing it used to pay
  per answer, so a half-played gift could be farmed forever. Inside a gift round the answers are
  now praise-only — a full tick and a warm line, no points — and the gift pays its bundle exactly
  once, at completion. Ten partial replays of `g1` change no total; finishing later still pays once.

## Critic round 3 (2026-08-03) — FAIL narrow, adjudicated

Four findings, adjudicated and built by the round-4 fix builder (PR #10), one line each, plus two
nits accepted as-is:

- **Praise repeated on the praise-only path.** `celebrate` indexed `PRAISE` by `before.points %
  PRAISE.length`; a praise-only reply (an unclaimed or already-opened gift) never moves points, so
  six of them in a row said the same line six times. `RewardsRecord` gained `cheers`, an
  append-only count incremented on every `celebrate` call (every call returns praise) and joined by
  max like every other number; the praise line now indexes off `saved.cheers` instead of `points`.
  Six praise-only replies now land at least four distinct lines — `engine.test.ts`.
- **`awardFor` was load-bearing but only indirectly tested, and one comment overclaimed.** Exported
  `awardFor` so `permanence.test.ts` can assert it directly — every own name on `Object.prototype`
  answers 0, every real kind answers its table value — and pinned it in the export-surface
  snapshot. The comment on `celebrate.length === 1` claimed "no signature on this API could carry a
  smaller total inwards"; reworded to what the two tests actually show — the surface is pinned and
  every number reaching storage passes the clamp in records.ts — since arity alone cannot see a
  parameter added after one that already has a default. **Correcting round 3's claim that "either
  fix alone leaves a red test":** verified by reverting each independently rather than by re-reading
  the diff — the table/`hasOwn` fix alone does leave the direct `join(BIG, POISONED)` test red
  (`Math.max(70, NaN)` is `NaN`), but the join-normalizes fix alone keeps the *entire* current suite
  green, prototype-key sweep and monotonicity fuzz included, because `join`'s `normalize` clamps
  whatever an unguarded `earn` hands it before the `Math.max` ever runs. The join fix was
  independently sufficient for every test that exists today; the table/`hasOwn` fix still closes
  the hole at its source rather than the sink, but the claim overstated its necessity for this suite.
- **Storage could still surface a lower number.** `rawGet` preferred `localStorage` whenever it had
  *any* value for a key, even a stale one left behind by a write that later threw (quota exceeded,
  private mode) — generosity rule 1 doesn't distinguish "never taken away" from "never looked taken
  away". `memory` is now a write-through cache: `rawSet` always writes it first, before even trying
  `localStorage`; `rawGet` prefers `memory` whenever the key is there. A storm of throwing writes
  now always reads back the newest value, never an older one — `storage.test.ts`. (Test-isolation
  fallout: no app code ever calls `localStorage.clear()` — only tests do — so `src/test/setup.ts`
  now also clears the write-through cache whenever a test does, or a later case would keep reading
  back an earlier case's write regardless of the clear.)
- **`dayKey`'s produced key went unvalidated.** The guard against a bad clock checked
  `Number.isNaN(now.getTime())` — the instance — but a `Date` *subclass* can override just
  `getMonth()` and still pass a `getTime()` check, producing `"2026-NaN-03"`. `days.ts` now exports
  `isValidDayKey`, checked against the key `dayKey` actually produced (`^\d{4}-\d{2}-\d{2}$`) before
  it is ever appended to `practiceDates` — closed at the class, not the instance. Tested with a
  `Date` subclass whose `getMonth` returns `NaN` — `streak.test.ts`.

Two nits accepted as-is, recorded rather than fixed: `PageFlip` freezes its page number for its
whole 1.4s life (`useState(() => filledPageLine(page))` never re-reads `page`) — harmless at the
app's current spacing, since nothing today fires two page-flips within 1.4s of each other. The
stored `streak` field is vestigial: `join`/`normalize` still read and write `{ value, resting }`,
but `getRewards` never consults it — both it and `celebrate` always recompute `streakFor` fresh
from `practiceDates` and the clock instead. Prose corrected (see "The streak value is the
practice-day count" above — was "never stored", now "stored but ignored on read"); removing the
dead field is deferred.

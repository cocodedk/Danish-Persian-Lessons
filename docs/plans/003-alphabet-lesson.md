# Plan 003 — Orientation + Lesson 1: Alphabet & Vowel Marks

Executor: Opus (pedagogy, Persian copy, stroke-order SVGs). Depends on: 002 merged (it is).
Invoke `karpathy-guidelines` first; `frontend-design:frontend-design` before any new screen.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner can open the app, be oriented in how Persian writing works, and work through the
alphabet — every letter with its four shapes, its sound (dansk lydskrift + IPA), and a stroke-order
drawing — then the six vowel marks, with recognition exercises and per-letter progress. The home
screen adopts the notebook signature.

## Steps

1. **Home adopts RuledSection** (adjudicated from 002's critic round): home and lesson screens
   render on the ruled sheet — ONE red margin line, real ruling. Remove SplitCard's own duplicate
   `border-inline-start` margin lines; SplitCard sits ON a sheet, it is not a sheet itself.
2. **Type bridge** (adjudicated): unify `Pron`/`Pronunciation` into ONE pronunciation type used by
   `WordCard`, `VowelMark`, `Letter`, and `VowelChip` — single shape `{ da: string, ipa: string }`.
3. **Letters data** `src/lessons/alphabet.ts`: all 32 letters — glyph, Persian name (فارسی), Danish
   name/transliteration, four positional forms (isolated/initial/medial/final), `joinsLeft: false`
   for ا د ذ ر ز ژ و, `sound: { da, ipa }` (the Danish anchor word + IPA), and `strokes` (step 5).
   Data order: standard alphabet. `teachingOrder`: آ ا، ب، د (the آب/بابا/باد cluster) first, then
   the remaining letters in standard order — plan 004's primer research may re-sequence later.
4. **Vowel-marks data** `src/lessons/vowelMarks.ts`: زبر aَ (a i "kat", [æ]) · زیر eِ (e i "let",
   [e]) · پیش oُ (o i "foto", [o]) · آ (å i "år", [ɒː]) · او (u i "du", [uː]) · ای (i i "vi", [iː]);
   plus تشدید and سکون as "senere" notes. Rendered with 002's `VowelChip` (marks red, on specimens
   only).
5. **Stroke-order drawings**: per letter an SVG stroke sequence
   `strokes: { d: string, kind: 'stroke' | 'dot' }[]` — pen paths in drawing order, right-to-left
   motion, ALL dots after ALL strokes (this array-order invariant is a unit test). One shared
   `LetterDraw` component: animated path-draw (<1.5s per ART-DIRECTION teaching motion) + a
   numbered static step diagram, which is also the `prefers-reduced-motion` rendering. Ink strokes
   `--ink`; the currently-drawn stroke `--red` while drawing. Isolated forms animated in v1;
   positional forms shown as static specimens.
6. **Orientation ("Lesson 0")** — opens the alphabet lesson, short, warm, skippable, revisitable:
   Persian runs RIGHT to LEFT, shown not told — a familiar Danish word displayed mirrored so the
   learner feels the flip, an arrow/finger sweep (reduced-motion: static arrows), then the three
   other surprises: letters join, letters change shape by position, no capital letters, dots are
   part of the letter. Danish du-form copy; Persian examples as specimens.
7. **Letter screen**: on the ruled sheet — big glyph (FaSpecimen), the four forms row, the sound
   line (dansk lydskrift + IPA from data), LetterDraw, and a name-letter badge slot: red margin
   tick «این حرف در نامِ توست» / "Dette bogstav er i dit navn" rendered ONLY when
   `profile.faSpelling` contains the letter (dormant until plan 006).
8. **Exercises** (no audio in this plan): "Find bogstavet" (Danish sound anchor prompt → pick the
   right glyph of 4) and "Match formerne" (pair isolated ↔ positional forms). Wrong answers per the
   generosity rule that already binds copy: gentle «دوباره» / "prøv igen", nothing lost, no buzzer
   (the full reward engine is plan 007 — leave a plain `onComplete` seam it can hook).
9. **Progress**: per-letter and per-mark ticks to `dpl.v1.alphabet` via the existing storage module;
   ProgressTick in the margin on completion. Lesson list on home shows the alphabet lesson with its
   progress; the `#/lesson/:id` placeholder becomes real routing for this lesson.
10. **Tests**: data integrity (32 letters, 4 forms each, every letter and mark has `da`+`ipa`,
    joinsLeft set exactly for the seven non-joiners, text-rule guard walks all new fa strings);
    stroke invariant (every letter has ≥1 stroke; dots strictly after strokes); LetterDraw
    reduced-motion renders the numbered diagram; exercises: correct/incorrect flows, progress
    persists, badge dormant without `faSpelling` and correct with a seeded profile.

## Acceptance

- [x] All 32 letters present with four forms, sound (da + IPA), and strokes; the seven non-joiners
      correct; data tests prove it
- [x] Stroke drawings: dots-last invariant test green; animated draw <1.5s; reduced-motion shows
      numbered static steps; teacher persona signs off the stroke order letter by letter
- [x] Orientation states RIGHT-to-LEFT correctly, is skippable and revisitable, and the mirrored
      Danish-word demo lands (Danish-learner persona confirms the flip "feels obvious")
- [x] Vowel marks red, on specimens only; every letter and mark shows lydskrift + IPA from data
- [x] Home + lesson screens sit on RuledSection with exactly ONE margin line (SplitCard's duplicates
      removed); visual check at 360px light/dark/RTL
- [x] Exercises work one-handed at 360px; wrong answers gentle; progress ticks persist and survive
      reload; `#/lesson/alphabet` deep-link works
- [x] `npm run verify` + CI green; zero new dependencies; 200-line cap; Persian code points clean
- [ ] Critic personas (teacher / learner / maintainer) find no concrete defect

## Follow-ups accepted from 002 (in scope here)
Home RuledSection adoption (step 1) · Pron/Pronunciation bridge (step 2) · VowelChip consumes the
unified type (step 4).

## Build notes (executor, round 1)

Decisions the plan left open, recorded so the critic can judge them:

- **Positional forms are derived**, not typed: `glyph + joinsLeft` → the four forms with U+0640,
  so a non-joiner gets `medial === final` by rule instead of by 128 hand-typed strings. Tests pin
  ب ا ک ه against literal expectations.
- **آ lives on the alef entry** as `madde: Specimen` (own name, sound, strokes). `letters.length`
  stays 32; `teachingOrder` has 33 ids and starts آ ا ب د.
- **Stroke skeletons, not letterforms.** The SVG paths teach the pen's motion beside the real
  Naskh glyph; the caption says so. Bodies are shared constants (`BODY_GROUPS`), and a test proves
  ب پ ت ث are literally one path with different dot sets.
- **ک/گ carry a second stroke, not a dot** (the ک serif, the سرکش) — both are `kind: 'stroke'`, so
  the dots-last invariant holds trivially. **ی is drawn dotless**, because isolated/final Persian ye
  has no dots; the four-forms row and a Danish hint say where the two dots do appear.
- **NameCapture also lost its margin line** and moved onto a RuledSection. It had the same duplicate
  `border-inline-start` as SplitCard; a test now sweeps every stylesheet for a second margin line.
- **The forside's Persian pane keeps `--pane-fa-height` as a minimum**, not a fixed height, so the
  lesson card lands in the thumb zone instead of below the fold.
- **SettingsCorner moved to the top corner.** Bottom-right was free space when the forside was one
  full-screen specimen; it now sits over the lesson card.
- **`onComplete` is a genuine no-op** in `ExerciseScreen` — plan 007's seam. Per-letter ticks are
  granted as the learner answers, so leaving a round early costs nothing.
- Verified at 360×780 in headless Chrome across all eight routes: `scrollWidth === clientWidth`
  everywhere, no link or button under 44×44, both colour schemes, and the reduced-motion step
  diagram rendering.

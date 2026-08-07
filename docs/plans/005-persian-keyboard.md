# Plan 005 — On-Screen Persian Keyboard & Typing Exercises

Executor: Opus (input logic + UI). Depends on: 003, 004, 006, 007 merged (they are). The final
roadmap unit. Invoke `karpathy-guidelines` first; `frontend-design:frontend-design` before the
keyboard's visual design.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner types Persian on an in-app keyboard — no OS keyboard dependency — through typing
exercises for the vocab units, ending with the capstone: typing their own name.

## Steps

1. **Keyboard component** `src/components/PersianKeyboard.tsx` (+ css): letters-only v1 — the 32
   letters + ZWNJ (نیم‌فاصله, labeled) + backspace. Alphabetical letter order, arranged in 3-4 rows
   that fit 360px with every key ≥44×44px
   in the bottom thumb zone. Key caps show the isolated glyph; `aria-label` = the letter's Danish
   name from alphabet data (single source). No shift layers, no digits, no punctuation in v1.
2. **Input buffer** `src/keyboard/buffer.ts` — pure, TDD-first: append letter / ZWNJ / backspace;
   renders through the browser's own shaping (no manual joining logic — the string IS the buffer);
   ZWNJ handling correct (backspace removes one code point incl. a lone ZWNJ; buffer never starts
   with ZWNJ; double-ZWNJ collapses). Tests for every rule.
3. **Typing exercise** `src/pages/TypeWordScreen.tsx`: prompt = the Danish word + pronunciation
   line (never the Persian answer); the learner types; live preview renders joined Naskh on the
   ruled sheet. Submit compares against `fa` (unmarked — اِعراب never required for typing):
   - correct → celebration through the reward engine (`item` on first completion of that word's
     typing, `answer` on repeats — the 004 pattern);
   - wrong → the diff rendered as teacher marks: correct letters ink, the first wrong/missing
     position marked in `--red`, with the gentle «دوباره» / "prøv igen" line. Nothing lost.
4. **Per-unit typing rounds**: each vocab unit gains a "Skriv ordene" round (~its 8 words, reusing
   unit progress storage under `dpl.v1.type.<unit>`; pay-once page on round completion).
5. **Capstone «نامِ خودت را بنویس» / "Skriv dit navn"**: when `profile.faSpelling` exists, a final
   typing exercise — type your own name; completion celebrates with the name in the praise
   («آفرین، سارا!» / "Flot, Sara!") and pays once (`dpl.v1.type.name`). Dormant without a name —
   no entry point, no nag (gate 8).
6. **Home**: typing rounds appear on the unit cards (or as a distinct card row) with progress;
   enterable anytime, no gating.
7. **Tests**: buffer rules (TDD); layout map — all 32 letters present exactly once, ZWNJ +
   backspace present, no duplicates; every key's aria-label resolves from alphabet data; diff
   logic (correct/wrong/missing/extra positions); pay-once with reloads; capstone dormancy without
   faSpelling and correctness with it; text-rule guard walks any new fa strings.

## Acceptance

- [x] Keyboard fits 360px portrait with every key ≥44×44px, thumb-zone placed, both schemes,
      visible focus; no OS keyboard ever triggered (inputs are readonly/none — typing goes through
      the component only)
- [x] Buffer: ZWNJ rules hold (tests); backspace exact; the preview shapes correctly (بابا joins,
      non-joiners honest)
- [x] Typing exercise: prompt never reveals the answer; diff marks are teacher-red at the first
      divergence only; wrong answers gentle, nothing lost; correct pays per the 004 pattern
- [x] Capstone: with faSpelling — present, celebrates by name, pays once (reload-proof); without —
      completely absent, no nag
- [x] Unique-input check: submissions compare against `fa` with marks stripped from user-impossible
      input (the keyboard cannot type اِعراب — assert the compare normalizes)
- [x] `npm run verify` + CI green; zero new deps; 200-line cap; Persian code points clean
- [ ] Critic personas (teacher / learner / maintainer) find no concrete defect

## Deviations

Where the build does not do what this plan wrote, and why.

1. **آ is on the board — 33 letter keys, not 32.** Step 1 lists "the 32 letters"; without آ the
   keyboard cannot write آب، آبی، آن، آسمان, and آب is the primer's first word and this app's demo
   specimen, so step 3's rounds would be unplayable. آ is already a taught specimen in the alphabet
   data (`specimens['alef-madde']`), so the key is single-sourced like every other.
2. **There is a space key too.** `suggestSpellings` joins the parts of a compound name with one
   plain space («Anne Mette» → «آنه مته», `src/name/transliterate.ts`), so without a space key the
   capstone would be a dead end for every two-part name.
3. **A spelling the board cannot write leaves the capstone dormant.** One name in the app's own
   list — لوئیزه (Louise) — is spelled with ئ, a sign outside the taught 32 that `src/name/forms.ts`
   deliberately refuses to name. Rather than put an untaught sign on a beginner's keyboard, the
   capstone is simply absent for such a spelling (`canType`, `src/keyboard/layout.ts`): the same
   silence gate 8 requires for no name at all, and the 006 mini-lesson still teaches the name.
4. **Six rows of six, not the "3-4 rows" of step 1.** 36 keys at ≥44×44px on a 360px screen allow
   six columns at most — (360 − 8 padding − 5 × 4 gap) ÷ 6 ≈ 55px. Nine columns would be 40px and
   fail the first acceptance box, so the box wins over the step's row count. Letter placement follows
   the beginner alphabet sequence from right to left, with آ directly before ا because it is the
   extra taught specimen used by the first word, آب.
5. **The writing line is docked in the thumb zone, not set in the middle of the sheet.** It is
   still Naskh ink on ruled paper (step 3), but pinned directly above the keys: at 360×640 a line
   placed in the sheet body scrolled out of sight the moment the keyboard opened, so the learner
   could not see what they were writing.
6. **The capstone's Danish title is "Tast dit navn".** Step 5 writes "Skriv dit navn", which plan
   006's mini-lesson already owns; two identically titled entries on the forside would name two
   different screens. The Persian is the plan's own «نامِ خودت را بنویس».
7. **The capstone folds the spelling away rather than hiding it.** A learner who cannot recall how
   their own name is spelled would otherwise have no way through. The `<details>` starts closed, so
   the prompt still never reveals the answer — it is the learner's choice to look.
8. **`LessonSheet` gained an optional `dock`.** The keyboard needed a pinned home outside
   `<nav aria-label="Lektionsnavigation">` — a keyboard is not navigation. The sticky bottom moved
   from `.lesson-bar` to a `.lesson-foot` wrapper; screens without a dock render exactly as before.
9. **Typing progress is its own store, beside the unit's rather than inside it.** Step 4 says
   "reusing unit progress storage"; `dpl.v1.type.<unit>` (`src/progress/typing.ts`) is separate,
   because reading a word and writing it are two different things to have learned — sharing the
   store would let a typing round claim the notebook page the reading round already paid for.
10. **One plan-004 test query got more specific.** `src/pages/vocab.test.tsx` picked a unit's
    forside card by accessible name; the forside now also carries a typing round naming the same
    unit, so the card is picked by its destination instead. No behaviour changed.

## Critic round 1 (2026-08-04) — FAIL, adjudicated

One root cause, behind four visibility defects: the opaque sticky `.lesson-foot` dock (writing
line + keyboard) covered the sheet's own content at 360×640, and nothing anywhere scrolled the
covered content into view.

1. On arrival, the dock covered the pron line entirely and left the prompt with no margin either.
2. After typing, the growing writing line ate further into that margin.
3. After a wrong «Se efter», the mark and the «دوباره» / "Prøv igen" line sat on the sheet, under
   the dock, unreachable without a scroll the app never performed.
4. The capstone's "Se, hvordan dit navn staves" summary sat far enough down the sheet that a real
   tap at its coordinates hit the dock, not the summary.

Fixed by moving the marking into the dock itself, beside the writing line it marks — it is now
part of the surface that never scrolls away, not the sheet that does — and by trimming the dock's
own rows (`src/components/TypeExercise.tsx`, `.css`) until the prompt and the pron line fit above
it at 360×640 with no scroll at all: the writing line and its button now share one row (a float,
not a flex/grid row — see the code comment for the layout bug that ruled flex/grid out), and the
Persian eyebrow and the "Ord X af Y" count share another.

Three smaller items, adjudicated alongside:

5. The marking called a divergent space or a نیم‌فاصله "et andet bogstav" — wrong, since neither
   has a letterform. `Divergence` now carries a `cellKind` (`src/keyboard/diff.ts`), and the
   marking picks the honest line for each, in both languages (`src/components/TypeMarks.tsx`).
6. The space and نیم‌فاصله keys named themselves to a screen reader only. Both now also carry a
   small visible caption under the pen-stroke glyph (`src/components/PersianKeyboard.tsx`).
7. The writing line's `aria-live` and the marking's `role="status"` competed on every check. The
   line's `aria-live` is dropped; the marking is the one moment on this screen worth announcing.

Measured in headless Chromium (raw CDP, no new dependency) at 360×640, 390×844, 414×896, both
schemes: prompt and pron line fully sampled on arrival and after typing one glyph, the marked cell
and the «دوباره» line fully sampled after a wrong check, and the capstone summary fully sampled and
genuinely tappable by a real, coordinate-based mouse click — at every one of those eighteen
combinations. `src/components/TypeExercise.test.tsx` guards the one fact jsdom can check (the
marking is a child of the dock, never of the sheet); the pixel claim itself is browser-verified,
not jsdom-verified, and honestly cannot be the other way — jsdom computes no layout at all.

Accepted without change:
- Superseded on 2026-08-07: the physical Persian-keyboard order was a learner-facing defect. The
  board now follows the standard Persian alphabetical order.
- Whether the logic here was built test-first cannot be reconstructed from commit order after the
  fact. That is a standing limit of "TDD for logic" as a project convention (CLAUDE.md), not a
  defect this round can prove one way or the other.

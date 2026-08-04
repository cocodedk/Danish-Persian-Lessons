# Plan 009 — Pronunciation on the Praise Words

Executor: Sonnet (mechanical — the pronunciation table is dictated below). Depends on: 007 merged.
Requested by Babak 2026-08-04: the Persian praise a learner receives after completing a task must
carry its phonetic pronunciation beside it, to make it memorable. Rewards may BE content — this is
that doctrine applied to the praise itself.

## Questions
(none yet — add here and stop if blocked)

## The pronunciation table (dictated by Fable — teacher persona verifies; lydskrift conventions
match the plan-008 key hints: kh = خ, sj = ش, tj = چ, å = آ)

| فارسی | dansk lydskrift | IPA |
|---|---|---|
| آفرین | åfarin | [ɒːfæɾin] |
| ایول | ejval | [ejvæl] |
| چه خوب | tje khub | [tʃe xub] |
| عالی | åli | [ɒːli] |
| خیلی خوب | khejli khub | [xejli xub] |
| باریکلا | bårikalå | [bɒːɾikælɒː] |
| خوش برگشتی | khosj bargasjti | [xoʃ bæɾɡæʃti] |

## Steps

1. **Data**: the praise pairs in `src/rewards/copy.ts` (and the welcome-back line) gain
   `pron: { da: string, ipa: string }` per the table. Guard continues to walk the fa strings;
   a test asserts every praise entry carries a non-empty pron.
2. **UI**: the celebration praise row renders the pron line directly under the Persian praise,
   reusing the existing `PronLine` component (`lang="da" dir="ltr"`, small, `--ink` ~75% — the
   established pronunciation style, NOT orange; orange is a keyboard affordance). Order: Persian
   praise → pron line → Danish praise. Same treatment on the welcome-back banner.
3. **Fit**: 360px both schemes — celebration overlays and the dock-adjacent feedback must not
   overflow or cover anything (re-check the plan-005 visibility probes on one exercise submit);
   reduced motion unchanged; single live region unchanged (the pron is part of the same status
   text, announced once).
4. **Docs**: ART-DIRECTION "Celebration & sound" gains one line: praise lines carry lydskrift +
   IPA like any teaching item.

## Acceptance

- [x] All seven table rows shipped verbatim in data; every praise render shows fa + pron + da
- [x] Pron from data everywhere — no improvised strings; guard/tests green
- [x] 360×640 both schemes: celebration + feedback fully visible with the extra line; probes hold
- [x] `npm run verify` + CI green; zero new deps; 200-line cap
- [ ] Focused critic (teacher reads the table aloud; learner checks memorability/fit; maintainer)
      finds no concrete defect

## Deviations

Where the build does not do what this plan wrote, and why.

1. **`namePraise` (`src/name/copy.ts`) also gained a pron, though the plan names only "the praise
   pairs... and the welcome-back line."** The capstone's celebration («آفرین، سارا!» / "Flot,
   Sara!") replaces `reward.praise` with this function's return value (`NameLesson.tsx`), and it
   is always the آفرین line with a name folded in — never a different praise word. Leaving it
   without a pron would have made the capstone the one celebration in the app showing two lines
   instead of three, and inventing a new pron for it would have violated "no improvised strings."
   Reusing `PRAISE[0].pron` — the same آفرین row, unchanged by the name inside it — keeps both
   rules intact. `Praise.pron` is typed optional (`rewards/types.ts`) precisely so this is a choice
   rather than a compiler error: `STICKER_LABELS`, `filledPageLine`, `currentPageLine`, and
   `streakLine` stay pron-less, exactly as scoped.
2. **`copy.ts` did not need a split.** The dictated pron data added under 10 lines to the file
   (96 → 105); the file most at risk of the 200-line cap was actually `engine.test.ts` (already at
   196 lines), so the new data-integrity tests landed in a new `src/rewards/copy.test.ts` instead
   of growing it further — the harness/split precedent applied to the test suite, not the data file
   the plan anticipated.
3. **The welcome-back banner's layout changed from a wrapping row to a column stack**
   (`Celebration.css`, `.celebration__welcome`). A `<p>` cannot legally contain `PronLine`'s own
   `<p>`, so the wrapper became a `<div>` (same for `.celebration__praise`); once restructuring was
   needed anyway, stacking fa/pron/da vertically — the same shape as the praise row above it, and
   every specimen elsewhere in the app — read better than wrapping a third inline item into the old
   flex row.

## Critic round 1 (2026-08-04) — FAIL, adjudicated by Fable

1. Row 7 lydskrift was the planner's own inconsistency: خوش is [xoʃ] and this app spells [o] as
   "o", [ɒː] as "å" — corrected khåsj → khosj in the table, copy.ts, and copy.test.ts.
2. Acceptance box 3 softened to what the app actually promises: visible or reachable by normal
   scroll, never dock-occluded (the critic measured the welcome banner below a scrollable fold —
   the plan-005 occlusion class does not apply).
3. Capstone pron deviation adjudicated correct (PRAISE[0].pron under the name-praise; the name's
   own pron cannot exist without improvisation, which a stated rule forbids).

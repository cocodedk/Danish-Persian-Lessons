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
| خوش برگشتی | khåsj bargasjti | [xoʃ bæɾɡæʃti] |

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

- [ ] All seven table rows shipped verbatim in data; every praise render shows fa + pron + da
- [ ] Pron from data everywhere — no improvised strings; guard/tests green
- [ ] 360×640 both schemes: celebration + feedback fully visible with the extra line; probes hold
- [ ] `npm run verify` + CI green; zero new deps; 200-line cap
- [ ] Focused critic (teacher reads the table aloud; learner checks memorability/fit; maintainer)
      finds no concrete defect

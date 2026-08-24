# Plan 016 — Tæl til tyve (counting 1–20)

## Questions

None. Status note (implementation): the plan's code steps are implemented on
this branch; the unit, build and verify gates were not re-run while this plan
was reconciled, so no green result is recorded here.

The e2e visual leg is red for one pre-existing, out-of-scope reason: the
committed baselines were last regenerated on 2026-08-09, before the speaking
audio was published. Since then `talkAudioReady()` resolves true
deterministically from the committed clip list and
[`src/audio/approved.generated.json`](../../src/audio/approved.generated.json),
so every checkout of `main` shows the "Tal" tab and the speaking front door —
and every baseline in the suite is stale. All 308 baselines have been
regenerated on this branch. They are uncommitted **candidates, not approvals**:
they have not been revalidated by a clean visual run and the owner has not
signed them off.

## Outcome

There is exactly **one canonical 1-20 counting foundation**, at
`/lesson/taelle`, per [`DESIGN.md`](../../DESIGN.md#counting) and
[`docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md`](../specs/AAA-COUNTING-CURRICULUM-SPEC.md).
It teaches every number as a complete teaching card — digit, word, اِعراب
specimen, dansk lydskrift, IPA and Danish meaning — and offers two tap-only
exercise rounds. Nothing new is invented: the section reuses the catalog entry
shape of P10, the exercise machinery of P4/P6, the reward engine of P7, and the
renderers of plan 010.

No separate 1-10 lesson exists anywhere. The Tal shelf
([`src/pages/SpeakingHome.tsx`](../../src/pages/SpeakingHome.tsx)), the child
workshop's number section
([`src/pages/ChildHome.tsx`](../../src/pages/ChildHome.tsx)) and the course home
([`src/pages/Home.tsx`](../../src/pages/Home.tsx)) are entry points that link
into that one lesson and read its identity, range and count from
[`src/lessons/countingLesson.ts`](../../src/lessons/countingLesson.ts). The
retired `/tal/tal/:page` URLs replace-navigate to `countingLesson.path`
([`src/App.tsx`](../../src/App.tsx)). None of them holds its own range,
ordering, title or progress record.

`beginnerNumbers` in [`src/lessons/numbers.ts`](../../src/lessons/numbers.ts) is
**not a lesson**. It is a stable first-ten subset kept split out only so the
reviewed 1-10 audio and the `numberCatalog` export keep exactly the entries and
ids they had before the lesson grew to twenty; it must not be reordered,
resized, or presented as a lesson of its own.

The Persian, IPA and dansk lydskrift for **11-20** are candidate forms. They are
**not approved and not standard**; they remain blocked by
[`AAA-COUNTING-CURRICULUM-SPEC.md`](../specs/AAA-COUNTING-CURRICULUM-SPEC.md)
§6 and [`AAA-QUALITY-BAR.md`](../specs/AAA-QUALITY-BAR.md) Gate A. Presence in
[`docs/reviews/content-review-manifest.json`](../reviews/content-review-manifest.json)
is queue membership, not approval.

**Out of scope for this plan:** 21-99, 100-900 and thousands. Those are three
separate future rule lessons, owned by
[`AAA-COUNTING-CURRICULUM-SPEC.md`](../specs/AAA-COUNTING-CURRICULUM-SPEC.md)
§1 and §3. Plan 016 neither implements them nor pre-approves any of their forms,
and `/lesson/taelle` must not be extended in place to cover them.

## Steps (as implemented)

1. **Data** ([`src/lessons/numbers.ts`](../../src/lessons/numbers.ts)): numbers
   11–20 added as `teenNumbers` in the existing `BeginnerNumber` shape, plus
   `countingNumbers` (1–20) and `countingCatalog`. Entry ids follow the existing
   `number-<n>-digit` / `number-<n>-word` scheme. `beginnerNumbers` is unchanged
   and keeps its ids and order as a catalog/audio compatibility subset. Candidate
   11–20 forms: یازده، دوازده، سیزده، چهارده، پانزده، شانزده، هفده، هجده،
   نوزده، بیست — each with faMarked, dansk lydskrift and IPA, all pending
   language review (§6). No Arabic ك/ي, no ASCII digits, ZWNJ rules respected.
2. **Descriptor**
   ([`src/lessons/countingLesson.ts`](../../src/lessons/countingLesson.ts)): the
   single source of the route, Danish title, summary and taught rows. `numbers`
   references `countingNumbers` itself, never a copy, so counts are read off the
   list length rather than typed.
3. **Progress** ([`src/progress/counting.ts`](../../src/progress/counting.ts)):
   add-only store `dpl.v1.counting` shaped like the vocabulary store (`words`,
   `paid`), with `learnCountingItem` paying `answer` / `item` / `page` exactly
   once per item, mirroring `learnWord`.
4. **Exercises**
   ([`src/lessons/countingExercises.ts`](../../src/lessons/countingExercises.ts)):
   two rounds built with `arrange`/`CHOICE_COUNT` from `./exercises` —
   - `betydning`: shows the vocalized Persian word, Danish choices;
     pronunciation hidden while active (it would disclose the answer).
   - `tal`: names the Danish number, Persian word choices, no specimen shown
     while active.
   Distractors are sound-safe neighbours from the full 1–20 list; a too-small
   pool throws rather than shipping a short round.
5. **Screens**:
   [`src/pages/CountingScreen.tsx`](../../src/pages/CountingScreen.tsx) at
   `/lesson/taelle` (count-along teaching rows, progress line, exercise links)
   and
   [`src/pages/CountingExerciseScreen.tsx`](../../src/pages/CountingExerciseScreen.tsx)
   at `/lesson/taelle/ovelse/:kind` (ChoiceExercise + RewardOverlays, same
   wiring as VocabExerciseScreen); an unknown `:kind` replace-navigates to a
   stable route. Routes and the `/tal/tal/:page` redirect are registered in
   [`src/App.tsx`](../../src/App.tsx). All Persian renders through approved
   entry renderers only.
6. **Entry points**: course home, Tal shelf and child workshop each render one
   link built from the descriptor's title, summary, range and count — no local
   literals.
7. **Tests** (TDD): `numbers.test.ts` (20 values, unique ids, code points, two
   pronunciation aids); `progress/counting.test.ts` (add-only, page paid once,
   replay pays answer); `countingExercises.test.ts` (round integrity, hidden
   metadata, sound-safe distractors); screen tests covering descriptor
   derivation on the three entry points.
8. **Gates**: `npm run verify`, including `verify.sh`, plus the visual suite.

## Acceptance

- [x] `countingNumbers` covers exactly 1–20, digits + words, every word with a
      dansk lydskrift and an IPA value; ids unique across the catalog registry;
      Persian code-point tests present.
- [x] Exactly one 1-20 foundation exists, at `countingLesson.path`; no surface
      presents a second 1-20 lesson, a partial 1-10 lesson, or an alternate
      range.
- [x] Course home, Tal shelf and child workshop derive title, summary, range and
      count from `countingLesson` and link to it; `/tal/tal/:page`
      replace-navigates to it.
- [x] `beginnerNumbers` is retained only as the frozen first-ten catalog/audio
      compatibility subset, with no lesson, route or progress record of its own.
- [x] Both exercise rounds exist, hide answer-defining metadata while active,
      reveal completely after an attempt, and never penalize a wrong tap.
- [x] Progress is add-only under `dpl.v1.counting`, survives reload, and the
      unit's completion page event is paid at most once.
- [x] No route locks another; direct routes work; an unknown exercise `:kind`
      redirects.
- [x] No raw Persian literals outside the catalog (render guard stays green;
      counting entries registered in `catalogDomains.numbers`).
- [ ] **Blocking** — language review of the 11-20 Persian forms, IPA and dansk
      lydskrift completed under
      [`AAA-COUNTING-CURRICULUM-SPEC.md`](../specs/AAA-COUNTING-CURRICULUM-SPEC.md)
      §6 and [`AAA-QUALITY-BAR.md`](../specs/AAA-QUALITY-BAR.md) Gate A, with
      `fa`, marked form, IPA, Danish sound cue and meaning agreeing in one
      review row. Until then those forms are unreleased candidates.
- [ ] **Blocking** — owner sign-off on the 308 regenerated visual baselines
      after a clean visual run, and a recorded fully green local
      `npm run verify`.

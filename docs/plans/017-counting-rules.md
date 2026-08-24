# Plan 017 — Regnereglerne: 21-99, 100-900 og tusinder

Status: candidate implementation complete on this branch through `6714838`; not release-ready.
Every Persian, IPA and dansk lydskrift form this plan touches is a **candidate** and stays
release-blocked until Gate A human evidence exists.

## Questions

None.

## Ownership

This plan is subordinate to [`DESIGN.md`](../../DESIGN.md#counting) and to
[`docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md`](../specs/AAA-COUNTING-CURRICULUM-SPEC.md). `DESIGN.md`
decides that counting is four lessons in a fixed order; the counting specification decides the
routes, ranges, worked-example coverage, descriptor and progress identities, audio honesty and
exercise mechanics. This plan decides only **how and in what order the code arrives**. Where the two
disagree, the specification wins and this plan is wrong.

The pre-ship condition in the specification (§ "Pre-ship condition") is already satisfied: the
document is listed in the map of [`docs/specs/README.md`](../specs/README.md).

Plan 016 ([`016-counting-1-20.md`](016-counting-1-20.md)) owns the 1-20 foundation and is not
touched by this plan. The foundation is not extended, re-ranged, re-titled or re-progressed here.

## Goal

Implement on this branch lessons 2, 3 and 4 of the counting curriculum as three separate rule
lessons that teach **composition rules with representative examples**, so a learner can build any
number in range from the rule plus the 1-20 vocabulary. None of these lessons may be released until
[`AAA-QUALITY-BAR.md`](../specs/AAA-QUALITY-BAR.md) Gate A is satisfied with human evidence. No exhaustive enumeration: no 79-item list, no 900-item list, no
9,000-item list.

## Fixed decisions

- Three lessons, three routes, three progress stores, three descriptors. Values are taken verbatim
  from the specification:

  | Lesson | Route | Exercise sub-path | Storage key | Item id prefix |
  |---|---|---|---|---|
  | 21-99 | `/lesson/taelle/21-99` | `/lesson/taelle/21-99/ovelse/:kind` | `dpl.v1.counting.21-99` | `counting-2199-` |
  | 100-900 | `/lesson/taelle/100-900` | `/lesson/taelle/100-900/ovelse/:kind` | `dpl.v1.counting.100-900` | `counting-100900-` |
  | Thousands | `/lesson/taelle/tusinder` | `/lesson/taelle/tusinder/ovelse/:kind` | `dpl.v1.counting.tusinder` | `counting-tusinder-` |

- Reserved exercise kinds per rule lesson: `betydning`, `tal`, `byg`. An unknown `:kind`
  replace-navigates to a stable route, exactly as
  [`src/pages/CountingExerciseScreen.tsx`](../../src/pages/CountingExerciseScreen.tsx) already does.
- **Recommended order only.** The order 1 → 2 → 3 → 4 is presented everywhere the lessons are
  listed, and nothing is ever locked, hidden, disabled or gated. Direct URLs always open. Each rule
  lesson states in plain Danish which range it builds on and links back to that lesson, as guidance,
  never as a barrier, and never implying the learner arrived wrongly.
- **Progress is isolated and add-only.** A rule lesson never reads, writes or migrates the
  foundation's `dpl.v1.counting`, and finishing a rule lesson never changes the foundation's count.
  Rewards stay add-only: `answer` for a re-claim, `item` for a first claim, one `page` per lesson
  guarded by a persisted `paid` flag.
- **Reuse, don't invent.** `betydning` and `tal` rounds are built with `arrange` / `CHOICE_COUNT`
  from [`src/lessons/exercises.ts`](../../src/lessons/exercises.ts) and rendered by
  `ChoiceExercise`; screens reuse `RewardOverlays` and the approved entry renderers; styles reuse
  the existing counting and vocab CSS. No new exercise engine and no new dependency. The single
  exception is `byg`, which is an assembly task no existing component covers: it gets the one small
  shared token-builder component described in fixpoint A, used by all three lessons.
- **Shared code only where all three lessons genuinely need it** (fixpoint A, listed below). Anything
  needed by one lesson lives in that lesson's module.
- Rule lessons **reference** the foundation's rows for any 1-20 form used in an example. They never
  copy them into their own list.
- Lesson 3 keeps the route and label `100-900`, while its descriptor declares the range **100-999**
  and the lesson hands off at 1,000. This plan does not decide that; it consumes
  § "Lesson 3 range: label versus coverage" of the counting specification verbatim and MUST NOT
  restate the reasoning or derive a different range.
- Lesson 4 covers **1,000-9,999 only**. 10,000 and above, and all million-scale numbers, are out of
  scope and MUST NOT be reached by widening this work.
- Content is static and deterministic: no randomness, no clock, no network. Counts are read off
  descriptor list lengths, never typed.

## Release block on language content (non-negotiable)

Every Persian form, IPA transcription, joining element and dansk lydskrift introduced by lessons 2, 3
and 4 — tens, hundreds, thousand multipliers, and every worked example — is a **candidate**. It MAY
be implemented on this branch. It MUST NOT be released, described as reviewed, or used as evidence
until [`AAA-QUALITY-BAR.md`](../specs/AAA-QUALITY-BAR.md) Gate A is satisfied in full with human
evidence, per § "Language review and pending forms" of the counting specification.

- Presence in [`docs/reviews/content-review-manifest.json`](../reviews/content-review-manifest.json)
  is **queue membership, not approval**. The manifest is generated from
  [`src/catalog/registry.ts`](../../src/catalog/registry.ts).
- The web sources listed under § "Research leads, not approvals" are drafting leads only. Citing one
  approves nothing and MUST NOT be recorded as review evidence.
- Generated artifacts of any kind — content manifests, audio manifests, exported queues — are not
  approval.
- Each fixpoint's commit message and the branch's handoff MUST say plainly that its forms are
  candidates pending Gate A.

## Audio honesty

- No rule-lesson audio is authored by this plan; it adds no clips.
- A play control appears if and only if
  [`src/audio/approved.generated.json`](../../src/audio/approved.generated.json) has an approved row
  for that entry. Never a hard-coded range, never a lesson-level flag, never a list written in a doc.
- A row without a clip is a **complete teaching row that currently has no clip**. It is never
  presented as broken, incomplete, failed or lesser, and never shows a control that does nothing.
- No speech synthesis, no borrowed clip, no silent placeholder.

## Fixpoint A — shared rule-lesson infrastructure + 21-99

The shared pieces are introduced here because all three lessons need each of them. Nothing else is
made shared.

1. **Rule-lesson descriptor type** — extend
   [`src/lessons/countingLesson.ts`](../../src/lessons/countingLesson.ts) or a sibling module with a
   `RuleLessonDescriptor`: `path`, Danish `title`, one-line `summary`, `rule` (the plain-Danish
   composition statement), `buildsOn` (the range named in Danish plus the route it links back to),
   `baseForms` (candidate teaching rows until review), `examples` (worked examples). Rows are referenced, never
   copied.
2. **Parameterized add-only progress store** — a factory taking a storage key and the lesson's id
   set, returning the same shape and semantics as
   [`src/progress/counting.ts`](../../src/progress/counting.ts): `normalize` on read, foreign and
   unknown ids rejected, absence/corruption/denied storage survived, `page` paid once behind `paid`.
   The foundation's existing store is left untouched; it MAY be re-expressed through the factory only
   if that changes neither its key, its ids nor its behaviour.
3. **Rule-lesson screen pair** — one screen component rendering a descriptor (rule text, builds-on
   line with back link, candidate teaching rows, worked examples, progress line, exercise links) and
   one exercise screen, both parameterized by descriptor and store. `betydning` and `tal` wrap
   `ChoiceExercise` + `RewardOverlays`; `byg` renders the token builder from item 4 with the same
   reward overlays. Existing counting screens and CSS are reused.
4. **`byg` composition-token builder** — one small shared deterministic component, used unchanged by
   all three lessons and kept under the 200-line cap. It presents the target number and the ordered
   candidate parts that compose it, and the learner assembles the target by placing those parts in
   order. It offers retry after a wrong placement, reveal of the correct composition, and stop —
   none of the three costs the learner anything. The target is a number that lesson never showed as
   a worked example. Correct-sequence metadata never reaches the rendered output. A part pool too
   small to build an unambiguous assembly throws rather than producing one.
5. **21-99 data** — tens as catalog entries through `defineEntry` with prefix `counting-2199-`,
   following [`src/lessons/numbers.ts`](../../src/lessons/numbers.ts). Persian text rules hold: no
   Arabic ك/ي, no ASCII digits, ZWNJ where it belongs. Candidate forms only.
6. **21-99 descriptor and rounds** — `betydning`, `tal`, `byg` at
   `/lesson/taelle/21-99/ovelse/:kind`.
7. **Registration** — routes in [`src/App.tsx`](../../src/App.tsx); the lesson listed after the
   foundation on the course home ([`src/pages/Home.tsx`](../../src/pages/Home.tsx)), the Tal shelf
   ([`src/pages/SpeakingHome.tsx`](../../src/pages/SpeakingHome.tsx)) and the child workshop
   ([`src/pages/ChildHome.tsx`](../../src/pages/ChildHome.tsx)), each reading title, summary and
   range from the descriptor, holding no literals and no lock.
8. **Review artifacts** — regenerate the content review queue (`npm run review:content`) so the new
   entries enter the queue. Queue, not approval.

### A — worked-example coverage (from the specification, § 3.1)

- [x] the joining element between a ten and a unit, shown at least twice with different units
- [x] every ten in the range as its own base form, including any ten whose form is not predictable
      from the corresponding unit
- [x] a round ten with no unit
- [x] the lower boundary against lesson 1 (20 versus 21) and the upper boundary against lesson 3
      (99 versus 100)
- [x] at least one example whose unit is a number the learner already met in lesson 1, made explicit
      as reuse

### A — close-out

- [ ] Tests below that cover fixpoint A are green; `npm run verify` passes.
- [x] Staged diff scanned for machine-specific absolute paths (home/workspace leaks) — none present.
- [x] Conventional Commits commit, stating that the 21-99 forms are candidates pending Gate A —
      `cec2e73 feat: add candidate 21-99 counting rule`.
- [x] Any regenerated visual PNG baselines stay **out of the commit** until owner sign-off.

Current evidence: 111 unit files / 773 tests, ESLint, TypeScript, production build, image/audio
verification and the repository verifier are green. The live app was inspected at 320, 1024 and
1440 px on port 9000. The aggregate `npm run verify` remains open: the intentional new home card
requires owner-approved 1440 px visual candidates, while this environment's Socket Firewall replaces
Firefox navigations with its own connection page. All 36 Chromium functional flows passed; WebKit
passed the aggregate run and then showed two unrelated navigation/storage flakes on repetition.
Neither infrastructure result is being hidden by approving a baseline or weakening a test.

## Fixpoint B — 100-900

Consumes the fixpoint A infrastructure unchanged. If B needs a change to a shared piece, the change
is made in the shared piece and A's tests must stay green.

1. Hundreds as catalog entries through `defineEntry`, prefix `counting-100900-`; candidate forms.
2. Descriptor at `/lesson/taelle/100-900` with rule text, builds-on line linking back to
   `/lesson/taelle/21-99`, hundreds base forms and worked examples. Its declared range is **100-999**
   per § "Lesson 3 range: label versus coverage" of the specification, while route and label stay
   `100-900`; entry points show whatever that descriptor declares and hold no range literal.
3. Progress store `dpl.v1.counting.100-900` from the factory.
4. Rounds `betydning`, `tal`, `byg` at `/lesson/taelle/100-900/ovelse/:kind`; `byg` uses the shared
   token builder to compose a hundred with a remainder the lesson never showed.
5. Route registered; the lesson listed third, in order, on the three entry points, from its
   descriptor.
6. Review queue regenerated.

### B — worked-example coverage (§ 3.1)

- [x] every hundred multiplier as its own base form, including each hundred whose form is not
      predictable from the corresponding unit
- [x] a round hundred with no remainder
- [x] a hundred joined to a 1-20 number (referencing the foundation's rows)
- [x] a hundred joined to a 21-99 number built with lesson 2's rule
- [x] the boundary against lesson 4 (900-plus-remainder versus 1,000)

### B — close-out

- [ ] Tests green; `npm run verify` passes.
- [x] Path scan of the staged diff — clean.
- [x] Conventional Commits commit, stating the 100-900 forms are candidates pending Gate A —
      `b5fb646 feat: add candidate 100-900 counting rule`.
- [x] Visual PNG candidates left uncommitted.

Current evidence: 113 unit files / 807 tests, ESLint, TypeScript, production build, image/audio
verification and the repository verifier are green. All 36 Chromium functional end-to-end tests
pass against the production preview. The live lesson, build round and Tal shelf were inspected at
320, 1024 and 1440 px on port 9000. Aggregate verification remains open for the already-documented
owner visual sign-off and environment-only Firefox/WebKit results; no baseline was approved or
cross-browser test weakened here.

## Fixpoint C — 1,000-9,999

1. Thousand word and multipliers 1-9 as catalog entries, prefix `counting-tusinder-`; candidate
   forms. Scope stops at 9,999.
2. Descriptor at `/lesson/taelle/tusinder`, builds-on line linking back to `/lesson/taelle/100-900`.
3. Progress store `dpl.v1.counting.tusinder` from the factory.
4. Rounds `betydning`, `tal`, `byg` at `/lesson/taelle/tusinder/ovelse/:kind`; `byg` uses the
   shared token builder to compose a thousand with an unseen remainder.
5. Route registered; the lesson listed fourth, in order, on the three entry points.
6. Review queue regenerated.

### C — worked-example coverage (§ 3.1)

- [x] the thousand word alone
- [x] a thousand multiplier from 2 to 9 with the thousand word
- [x] a thousand composed with a hundreds remainder (lesson 3)
- [x] a thousand composed with a 21-99 remainder (lesson 2)
- [x] a thousand composed with a 1-20 remainder (lesson 1, referenced)
- [x] the upper boundary of scope, 9,999

### C — close-out

- [ ] Tests green; `npm run verify` passes.
- [x] Path scan of the staged diff — clean.
- [x] Conventional Commits commit, stating the thousands forms are candidates pending Gate A —
      `6714838 feat: add candidate thousands counting rule`.
- [x] Visual PNG candidates left uncommitted.

Current evidence: 120 unit files / 864 tests, ESLint, TypeScript, production build, image/audio
verification and the repository verifier are green. All 36 Chromium functional end-to-end tests
pass against the production preview. The live lesson, repeated-joiner build round and four-card Tal
shelf were inspected at 320, 1024 and 1440 px on port 9000. Aggregate verification remains open for
the already-documented owner visual sign-off and environment-only Firefox/WebKit results; no
baseline was approved or cross-browser test weakened here.

## Tests

TDD for logic: the failing test first. Each item is added in the fixpoint that introduces the code it
covers, and stays green in the later ones.

| # | Guarantee | Where |
|---|---|---|
| 1 | **Routes** — each rule-lesson route renders, each reserved `/ovelse/:kind` renders, an unknown `:kind` replace-navigates, `/tal/tal/:page` still redirects to the foundation | screen tests beside [`src/pages/CountingExerciseScreen.test.tsx`](../../src/pages/CountingExerciseScreen.test.tsx) |
| 2 | **Descriptor derivation** — course home, Tal shelf and child workshop take title, summary, range and count from the descriptors, hold no literals, and list the four lessons in order 1 → 2 → 3 → 4 with no lock, disabled state, or hidden entry | entry-point screen tests |
| 3 | **Progress isolation** — add-only; writing one lesson's store leaves the other three untouched; foreign ids rejected; `page` paid once across replays; missing/corrupt/denied storage normalizes | `src/progress/*.test.ts` |
| 4 | **Exercise validity (`betydning`, `tal`)** — every choice round of every counting lesson builds without throwing, four distinct sound-safe choices per question (no shared Danish meaning, IPA or dansk lydskrift), answer position varies deterministically | `src/lessons/*Exercises.test.ts` |
| 5 | **No duplicate 1-10/1-20 lesson** — no surface presents a second 1-20 foundation, a partial 1-10 lesson, or an alternate range; `beginnerNumbers` keeps its exact entries, ids and order; no rule descriptor contains a 1-20 row of its own | catalog + descriptor tests |
| 6 | **Audio honesty** — every counting row showing a play control has an approved row in the generated manifest, and every row without one shows no control; digit glyphs keep their `audioNotApplicable` reason | extend [`src/audio/manifest.test.ts`](../../src/audio/manifest.test.ts) |
| 7 | **200-line code-file cap** — every source file added or touched by this plan stays under 200 lines; add a repository check so the cap is enforced, not remembered | new check in [`scripts/verify.sh`](../../scripts/verify.sh) or a unit test |

| 8 | **`byg` token builder** — focused tests for the shared component: parts are offered and accepted in the target's composition order; a wrong placement retries without penalty and without advancing; the correct assembly advances progress once; each lesson's `byg` target is absent from that lesson's worked examples; no answer metadata leaks into the rendered output (no correct-sequence attribute, order hint or DOM ordering that discloses the answer) | test beside the builder component |

Catalog integrity ([`src/catalog/registry.test.ts`](../../src/catalog/registry.test.ts)) must keep passing:
entries registered, ids unique and stable, required fields present. Persian text-rule tests apply to
every new form.

## Acceptance

- [x] Three rule lessons exist at their contracted routes with their contracted exercise sub-paths;
      no fifth counting lesson and no second lesson over any of these ranges.
- [x] The foundation at `/lesson/taelle` is unchanged in route, range, title, ids and store.
- [x] Each rule lesson has one descriptor, one add-only store with its contracted key and id prefix,
      a plain-Danish rule statement, a builds-on line with a back link, candidate teaching rows
      pending review, representative examples meeting the coverage lists above, and a `byg` assembly
      testing an unseen number.
- [x] `byg` is one small shared token-builder component used by all three lessons; `betydning` and
      `tal` reuse `ChoiceExercise` and `arrange`.
- [x] No exhaustive enumeration is implemented for any range.
- [x] Recommended order is presented everywhere; nothing is locked, hidden or gated.
- [x] Every new Persian/IPA/dansk lydskrift form is marked candidate and release-blocked pending
      Gate A human evidence; no generated manifest or web source is treated as approval.
- [ ] All eight test guarantees are in place and green; `npm run verify` passes at each fixpoint.
- [x] Three commits, one per fixpoint, each preceded by a clean path scan; no visual PNG baseline
      committed without owner sign-off.

## Scope notes

- During planning, only this file was created. Implementation subsequently updated the P17 entry in
  [`ROADMAP.md`](ROADMAP.md) and the authoritative specifications; this historical scope note does
  not supersede those documents.
- 10,000 and above, million-scale numbers, ordinals, and any counting audio recording remain out of
  scope.

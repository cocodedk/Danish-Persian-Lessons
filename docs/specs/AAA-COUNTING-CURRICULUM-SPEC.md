# AAA Counting Curriculum Specification

Status: normative single source of truth for the counting curriculum — routes, staged content scope,
worked-example requirements, data ownership, progress identities, audio honesty, and lesson
mechanics.

This document is **subordinate to the product sequence** recorded in
[`DESIGN.md`](../../DESIGN.md#counting). `DESIGN.md` decides that counting is exactly four lessons and
in which order they are taught; it does not decide the values below. This document decides the exact
routes, ranges, mechanics, and review evidence, and MUST NOT contradict that sequence. Where an
aspect is owned elsewhere — pedagogy and reviewed audio by
[`AAA-LEARNING-SPEC.md`](AAA-LEARNING-SPEC.md), release evidence by
[`AAA-QUALITY-BAR.md`](AAA-QUALITY-BAR.md), accessibility by
[`AAA-UX-ACCESSIBILITY-SPEC.md`](AAA-UX-ACCESSIBILITY-SPEC.md), layout by
[`AAA-RESPONSIVE-DESIGN-SPEC.md`](AAA-RESPONSIVE-DESIGN-SPEC.md) — this document links rather than
restates. Normative language (**MUST**, **SHOULD**, **MAY**) is defined in
[`docs/specs/README.md`](README.md).

**Pre-ship condition:** this document MUST be listed in the document map of
[`docs/specs/README.md`](README.md) before any lesson 2, 3, or 4 ships.

## 1. The four lessons

The table separates **implementation state** (does the route exist and render today?) from **release
approval** (is its language content cleared to ship under section 6?). A route being implemented is
never on its own permission to release its content.

| # | Lesson | Route | Teaches | Implemented | Release-approved |
|---|---|---|---|---|---|
| 1 | 1-20 foundation | `/lesson/taelle` | The twenty number words as individual items | Yes | Partly — 1-10 only; the 11-20 forms remain blocked by section 6 |
| 2 | 21-99 rules | `/lesson/taelle/21-99` | How tens and units combine into one spoken number | No | No |
| 3 | 100-900 rules | `/lesson/taelle/100-900` | How hundreds are formed and joined to the range below | No | No |
| 4 | Thousands rules | `/lesson/taelle/tusinder` | How thousands are formed and joined to the ranges below | No | No |

- These four routes are the complete counting curriculum. A fifth counting lesson, or a second
  lesson covering any of these ranges, requires a recorded product decision in
  [`DESIGN.md`](../../DESIGN.md#counting) first.
- Each lesson reserves its own exercise sub-path, following the shipped pattern
  `/lesson/taelle/ovelse/:kind`: `/lesson/taelle/21-99/ovelse/:kind`,
  `/lesson/taelle/100-900/ovelse/:kind`, `/lesson/taelle/tusinder/ovelse/:kind`. No other sub-path
  under a lesson route may be introduced without amending this table.
- An unknown `:kind` MUST replace-navigate to a stable route rather than render an empty round, as
  `src/pages/CountingExerciseScreen.tsx` already does.

## 2. Prerequisites without hard locks

- The recommended order is lesson 1 → 2 → 3 → 4, and every surface that lists them MUST present them
  in that order.
- No lesson may be locked, disabled, hidden, or gated on progress in another. Direct URLs MUST always
  open. This follows the product promise that the learner is free to choose, retry, reveal, switch,
  or stop without penalty ([`DESIGN.md`](../../DESIGN.md)).
- A rule lesson **MUST** state, in plain Danish, which range it builds on and offer a link back to
  the lesson that teaches it. That statement is guidance, never a barrier, and MUST NOT imply the
  learner did something wrong by arriving early.
- Progress in a rule lesson MUST NOT be withheld, reduced, or retroactively changed because an
  earlier lesson is unfinished.

## 3. What the rule lessons teach

Lessons 2-4 teach **composition rules with representative worked examples**. They MUST NOT ship an
exhaustive enumeration of their range: no 79-item list for 21-99, no 800-item list for 100-900, no
9,000-item list for thousands. A learner who finishes a rule lesson should be able to build any
number in the range from the rule plus the 1-20 vocabulary, not recall a list.

Each rule lesson MUST contain, as reviewed content:

1. A short statement of the composition rule in plain Danish.
2. The set of base forms the rule needs (for lesson 2 the tens; for lesson 3 the hundreds; for
   lesson 4 the thousand multipliers), each as a normal teaching row.
3. Worked examples meeting the coverage requirements below.
4. A build-it-yourself round in which the learner assembles a number the lesson never showed.

### 3.1 Worked-example coverage requirements

These are requirements on *which cases must be demonstrated*, not a list of approved forms. The
Persian, IPA, and Danish sound spelling for every example are subject to section 6.

Lesson 2 (21-99) MUST demonstrate:

- the joining element between a ten and a unit, shown at least twice with different units;
- every ten in the range as its own base form, including any ten whose form is not predictable from
  the corresponding unit;
- a round ten with no unit (e.g. the number 30 spoken alone);
- the lower boundary against lesson 1 (20 versus 21) and the upper boundary against lesson 3
  (99 versus 100);
- at least one example whose unit is a number the learner already met in lesson 1, made explicit as
  reuse.

Lesson 3 (100-900) MUST demonstrate:

- every hundred multiplier as its own base form, including each hundred whose form is not
  predictable from the corresponding unit;
- a round hundred with no remainder;
- a hundred joined to a 1-20 number;
- a hundred joined to a 21-99 number built with lesson 2's rule;
- the boundary against lesson 4 (900-plus-remainder versus 1,000).

Lesson 4 (thousands) MUST demonstrate:

- the thousand word alone;
- a thousand multiplier from 2 to 9 with the thousand word;
- a thousand composed with a hundreds remainder (lesson 3);
- a thousand composed with a 21-99 remainder (lesson 2);
- a thousand composed with a 1-20 remainder (lesson 1);
- the upper boundary of scope, 9,999.

### 3.2 Thousands scope

Lesson 4 covers **1,000-9,999 only**, using the reviewed thousand multipliers 1-9 and composition
with the ranges taught by lessons 1-3. Numbers of 10,000 and above, and all million-scale numbers,
are explicitly **out of scope** for the counting curriculum. Introducing them requires a new recorded
product decision in [`DESIGN.md`](../../DESIGN.md#counting); it MUST NOT be done by widening this
lesson.

### 3.3 Research leads, not approvals

The following are **non-approval references** that a content author MAY consult while drafting
candidate forms. Citing them does not make any form approved, and they MUST NOT be recorded as review
evidence under [`AAA-QUALITY-BAR.md`](AAA-QUALITY-BAR.md):

- <https://sites.la.utexas.edu/persian_online_resources/vocabulary-lists/numbers-1-100/>
- <https://openbooks.lib.msu.edu/persian/chapter/1-8-numbers-1-100-ordinal-and-cardinal-numbers-in-persian-language/>
- <https://www.dastur.info/persian-grammar/6-numerals/6%E2%80%A21-counting-numerals/6%E2%80%A21%E2%80%A21-cardinal-numerals/>

## 4. Deterministic data ownership

- Each lesson has exactly **one descriptor module**, following the shipped pattern in
  `src/lessons/countingLesson.ts`: it owns the route, the Danish title, the one-line summary, and the
  rows or rule blocks the lesson teaches.
- Rows MUST be referenced, never copied. A count shown anywhere MUST be read off the descriptor's
  list length, never typed as a literal.
- Every Persian item in every counting lesson MUST be a catalog entry with a stable id, created
  through the catalog's `defineEntry` contract, exactly as `src/lessons/numbers.ts` does today.
- Ids are stable and MUST NOT be renumbered or reordered. The existing `beginnerNumbers` subset
  (1-10) keeps its exact entries and ids so the reviewed audio and the `numberCatalog` export do not
  move.
- Rule-lesson descriptors MUST NOT restate, re-own, or re-range the 1-20 foundation. Where a rule
  lesson needs a 1-20 form for a worked example, it references the foundation's rows.
- Lesson content MUST be static and deterministic: no randomness, no clock dependence, no
  network-derived numbers. Given the same descriptor, a lesson renders identically on every run.

## 5. Progress identities

- The 1-20 foundation keeps the existing store `dpl.v1.counting` (`src/progress/counting.ts`)
  unchanged: add-only, item ids `number-<value>-word`, and one `page` reward paid exactly once when
  all twenty word ids are present.
- Each rule lesson gets its **own** add-only store and its own id namespace. A rule lesson MUST NOT
  write into, read completion from, or migrate the foundation's store, and completing a rule lesson
  MUST NOT change the foundation's count.
- Reserved keys and namespaces:

  | Lesson | Storage key | Item id prefix |
  |---|---|---|
  | 21-99 | `dpl.v1.counting.21-99` | `counting-2199-` |
  | 100-900 | `dpl.v1.counting.100-900` | `counting-100900-` |
  | Thousands | `dpl.v1.counting.tusinder` | `counting-tusinder-` |

- Every store MUST normalize unknown shapes on read, accept only ids belonging to its own lesson, and
  survive absence, corruption, and denied storage, as `normalize` in `src/progress/counting.ts` does.
- Rewards remain add-only: `answer` for an item already learned, `item` for a first claim, and one
  `page` per lesson, paid once and guarded by a persisted `paid` flag so a replay cannot pay twice.
- Progress copy MUST describe what was actually done ("gennemgået eller øvet"), never claim mastery
  the record does not support.

## 6. Language review and pending forms

The Persian forms, IPA, and Danish sound spelling below are **not approved content** and MUST NOT be
released, described as reviewed, or used as evidence until the gate in this section is cleared:

- the shipped forms for **11-20** (`teenNumbers` in `src/lessons/numbers.ts`);
- **all** forms in lessons 2, 3, and 4 — tens, hundreds, thousand multipliers, joining elements, and
  every worked example.

Presence in `docs/reviews/content-review-manifest.json` is **not approval**. That manifest is
generated from `src/catalog/registry.ts`; it is the queue that review works through, not its outcome.

Before any of the above ships, [`AAA-QUALITY-BAR.md`](AAA-QUALITY-BAR.md) Gate A MUST be satisfied in
full for every form listed above. That gate is blocking here: no form covered by this section may be
released, described as reviewed, or used as evidence until it is cleared. Reviewer roles, reviewer
counts, required qualifications, the accepted evidence, and the sign-off procedure are owned solely by
[`AAA-QUALITY-BAR.md`](AAA-QUALITY-BAR.md) Gate A and are deliberately not restated here; that
document's current wording governs, and this document defers to it if the two ever diverge.

A row's `fa`, marked teaching form, IPA, Danish sound cue, meaning, reading cues, and any audio
transcript MUST agree in one review row; a mismatch blocks release. Nothing in this document asserts
that any specific Persian spelling, IPA transcription, or Danish sound spelling for 11-20 or for
lessons 2-4 is correct or approved.

## 7. Audio honesty

- Which counting rows have approved, provenance-tracked audio is owned solely by the generated
  approved-audio manifest and the process in [`AAA-LEARNING-SPEC.md`](AAA-LEARNING-SPEC.md). This
  document states no clip inventory of its own, and no surface may assume one.
- The UI MUST derive every play control from that approved manifest at build or render time: a row
  shows a play control if and only if the manifest has an approved row for it. A control MUST NOT be
  driven by a hard-coded range, a lesson-level flag, or any list written in a spec.
- A row without approved audio is a **complete teaching row that currently has no clip**. The UI MUST
  NOT present it as broken, incomplete, failed, or lesser, and MUST NOT show a play control that does
  nothing.
- The lessons MUST NOT promise, fake, imply, or substitute audio for a row that has none: no
  browser speech synthesis, no clip borrowed from another entry, no silent placeholder file.
- Digit-glyph entries carry an explicit `audioNotApplicable` reason, as they do today; that reason is
  a statement about the glyph, not a missing-audio excuse for the word beside it.
- Any counting audio, including all rule-lesson audio, ships only through the manifest, loudness, and
  provenance process owned by [`AAA-LEARNING-SPEC.md`](AAA-LEARNING-SPEC.md), and only after the
  language review in section 6.

## 8. Exercises and feedback

Rule lessons reuse the shipped choice machinery (`src/lessons/exercises.ts`) rather than introducing
a new exercise engine.

- Every question has four choices, exactly one correct, with the answer placed in a different slot
  per question by the existing deterministic arrangement — not shuffled at runtime.
- Distractors MUST be sound-safe: no distractor may share the correct answer's Danish meaning, IPA,
  or Danish sound spelling. If a question cannot be built with enough sound-safe distractors, the
  build MUST fail loudly rather than ship an ambiguous question.
- A rule lesson MUST include at least one round that tests **composition** — building or recognizing
  a number the lesson did not show as a worked example — not only recognition of its base forms.
- Reserved exercise kinds per rule lesson: `betydning` (find the meaning), `tal` (find the Persian
  form), and `byg` (assemble the number from its parts). The foundation keeps its shipped
  `betydning` and `tal` kinds unchanged.
- Feedback follows [`AAA-UX-ACCESSIBILITY-SPEC.md`](AAA-UX-ACCESSIBILITY-SPEC.md) and the product
  promise: a wrong choice gets an explanation and a retry path — never a red X, buzzer, loss, score
  penalty, or shame. The reveal after an attempt carries the full teaching card.
- Leaving mid-round MUST cost nothing, and the lesson MUST say so. Anything already practised stays.

## 9. Entry points, redirects, and non-duplication

- `/tal/tal/:page` MUST continue to replace-navigate to the canonical foundation route.
- The Tal shelf, the child workshop's number section, and the course home are **entry points** into
  the four lessons. Each MUST read the title, summary, range, and count from the relevant descriptor
  and MUST NOT hold its own range, ordering, title, or progress record.
- No surface may present a second 1-20 lesson, a partial 1-10 lesson, or an alternate counting range.
  Approved audio, whatever the manifest currently covers, is a capability inside the foundation
  lesson, not a lesson of its own.
- A rule lesson MUST NOT duplicate the foundation's rows into its own list, and MUST NOT extend
  `/lesson/taelle` in place; each rule stage ships as its own route per section 1.

## 10. Validation and tests

Before a counting change ships, the following MUST pass:

- **Catalog integrity** — every counting entry is registered, ids are unique and stable, and required
  fields are present (`src/catalog/registry.test.ts`).
- **Descriptor single-source** — a test asserts that the shelf, course home, and workshop number
  section derive their range and count from the descriptor, not from literals.
- **Distractor sufficiency** — building every exercise round for every kind of every counting lesson
  raises no error and produces four distinct, sound-safe choices per question.
- **Progress** — add-only behavior, per-lesson isolation (writing one lesson's store leaves the
  others untouched), one-time `page` payout across replays, and normalization of missing, corrupt,
  and foreign-id storage.
- **Routes** — each of the four routes renders, each reserved exercise sub-path renders, an unknown
  `:kind` redirects, and `/tal/tal/:page` redirects to the foundation.
- **Audio manifest** — every counting entry that shows a play control has an approved manifest row,
  and every entry without one shows no play control.
- **Review evidence** — no form covered by section 6 is present in a release build without the
  recorded approvals.

## 11. Boundary ownership

| Aspect | Owner |
|---|---|
| Product-level counting sequence and the four-lesson decision | [`DESIGN.md`](../../DESIGN.md#counting) |
| Pedagogy, review scheduling, mastery, reviewed-audio manifest and quality | [`AAA-LEARNING-SPEC.md`](AAA-LEARNING-SPEC.md) |
| Release gates, reviewer authority, severity, sign-off, exceptions | [`AAA-QUALITY-BAR.md`](AAA-QUALITY-BAR.md) |
| Navigation, feedback patterns, keyboard and accessibility behavior | [`AAA-UX-ACCESSIBILITY-SPEC.md`](AAA-UX-ACCESSIBILITY-SPEC.md) |
| Breakpoints, layout bounds, wrapping, visual QA | [`AAA-RESPONSIVE-DESIGN-SPEC.md`](AAA-RESPONSIVE-DESIGN-SPEC.md) |
| Child-path framing of the number section | [`AAA-CHILD-EXPERIENCE-SPEC.md`](AAA-CHILD-EXPERIENCE-SPEC.md) |
| Lesson imagery, rights, and delivery | [`AAA-LESSON-IMAGE-SPEC.md`](AAA-LESSON-IMAGE-SPEC.md) |
| Repository architecture and the typed-catalog contract | [`CLAUDE.md`](../../CLAUDE.md) |
| Which document owns which aspect | [`docs/specs/README.md`](README.md) |

This document owns only the counting curriculum: the four routes, the staged ranges, worked-example
coverage, counting data ownership, counting progress identities, counting audio honesty, and counting
exercise mechanics.

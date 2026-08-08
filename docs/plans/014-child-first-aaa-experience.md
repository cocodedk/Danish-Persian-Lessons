# Plan 014 — Child-First AAA Experience

Status: complete. This plan turns the research in
[`docs/pedagogical_approach/`](../pedagogical_approach/) into one complete, reviewable vertical slice.

Depends on Plan 012's learning, navigation, reward, and accessibility contracts and Plan 013's
reviewed local lesson images. It does not replace the adult beginner course.

## Questions

(none — the first implementation deliberately uses an age-neutral 8–12 tone until observed daughter
feedback supports a narrower art and copy direction)

## Authority

1. [Pedagogical recommendation](../pedagogical_approach/README.md)
2. [AAA child experience specification](../specs/AAA-CHILD-EXPERIENCE-SPEC.md)
3. [AAA child first-run specification](../specs/AAA-CHILD-FIRST-RUN-SPEC.md)
4. Existing AAA specification suite and `docs/design/ART-DIRECTION.md`

The child specs govern the new routes. Existing AAA specs continue to govern shared content,
accessibility, progress, routes, rewards, and the grown-up course.

## Outcome

A new learner reaches a meaningful Persian action before curriculum explanation. The learner chooses
between a child word workshop and the full course. The child workshop offers reviewed, image-backed
word missions for `آب`, `نان`, and `گل`; each mission models the word, guides a right-to-left build,
asks for one memory build, reveals complete teaching help, saves a permanent collection item, and
offers “one more” or “done for now”.

The current course remains available under `/kursus`. Both journeys share one catalog and one local,
privacy-preserving storage foundation.

## Route contract

| Route | One job | Primary action |
|---|---|---|
| `/` | Choose the preferred front door once | Start the child word workshop |
| `/opdag` | Choose one visual Persian word mission | Open a selected mission |
| `/opdag/ord/:id` | Complete one model → guide → recall → reveal loop | Perform the current build action |
| `/kursus` | Use the existing complete beginner course | Existing adaptive Continue action |

Unknown child mission IDs return to `/opdag`. Existing lesson routes remain open and unchanged.

## Milestone 1 — Persistence and front door

1. Add a normalized `dpl.v1.journey` record with `child` and `course` choices.
2. Add an add-only `dpl.v1.child-collection` record for completed mission IDs.
3. Make `/` route by a saved choice and otherwise show the first-use front door.
4. Give the child action primary hierarchy and the full course a calm secondary action.
5. Let each journey deliberately switch to the other without clearing progress.

## Milestone 2 — Child workshop

1. Define exactly three missions from canonical vocabulary entries and reviewed local images:
   `vocabulary-1-ab`, `vocabulary-1-nan`, and `vocabulary-3-gol`.
2. Show a bounded visual choice set with image, Danish meaning, and no progress debt.
3. Mark collected words as owned without locking uncollected words.
4. Keep the course link visible but secondary.
5. Render an empty collection as an invitation, never a zero-state failure.

## Milestone 3 — Word mission

1. Model the complete word with image, Persian, Danish sound spelling, IPA, and optional reviewed audio.
2. Guide a tap-to-place build in logical Persian order; the first target is visually indicated.
3. Repeat the build from memory with the same letters and no answer-defining ghost word.
4. Treat a wrong tap as information: selected state, short status, full reveal, Retry, and Continue.
5. On first completion, append the mission to the collection and celebrate once; replay praises
   without adding another collection item or paying another completion bundle.
6. Finish with the personal artifact, “Prøv et ord mere”, and “Færdig for nu”.

## Milestone 4 — Accessibility and responsive craft

1. Preserve one H1, unique title, route focus, and one primary action per state.
2. Use native buttons and links, 44×44 targets, visible focus, polite status, and non-color state.
3. Make every build operable by touch, pointer, keyboard, and assistive technology.
4. Keep the action, placed letters, feedback, and next action unobscured at 320×640 through ultrawide.
5. Use lesson photos as content, not dark atmospheric decoration; keep stable aspect ratios.
6. Respect reduced motion and sound-off; no learning state depends on animation or audio.

## Milestone 5 — Evidence and release

1. Unit-test persistence normalization, add-only collection behavior, route choice, mission flow,
   retry/reveal, replay idempotency, and journey switching.
2. Add Playwright first-use, keyboard, denied-storage, mobile, and return-path journeys.
3. Add visual states for the front door, child workshop, active build, and completion at mobile and
   desktop widths.
4. Run lint, unit tests, build, image verification, repository verification, e2e, and screenshot review.
5. Record implementation deviations in this plan, check acceptance only from evidence, merge to
   `main`, verify main, and delete the feature branch.

## Acceptance

- [x] A new learner sees one obvious child action without first reading course methodology.
- [x] The saved front-door choice routes predictably and can be changed from either journey.
- [x] `/kursus` preserves the complete existing home and lesson access.
- [x] `/opdag` offers exactly the three reviewed image-backed missions specified above.
- [x] Each mission teaches, guides, retrieves, reveals, saves, and exits as specified.
- [x] Wrong, reveal, retry, stop, replay, denied storage, and unknown route states are complete.
- [x] Collection and rewards never decrease; replay does not duplicate the artifact or payout.
- [x] Child routes meet the existing WCAG 2.2 AA plus selected AAA product criteria.
- [x] Mobile and desktop visual evidence shows no overlap, overflow, hidden action, or blank image.
- [x] Existing course, lesson, progress, storage, and reward tests remain green.
- [x] `npm run verify` passes from the release commit.
- [x] The release commit is merged to `main`, main is verified, and the feature branch is removed.

## Out of scope

Freehand handwriting recognition, new native recordings, accounts, cloud sync, parent surveillance,
notifications, timers, lives, leaderboards, AI-generated content, and a full narrative world. The
tap-to-build slice establishes the child journey before those investments are considered.

## Deviations

No implementation deviations. Automated evidence establishes the product contract, but delight and
motivation still require an observed session with the intended learner.

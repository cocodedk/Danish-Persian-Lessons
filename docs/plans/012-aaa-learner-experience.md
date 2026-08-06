# Plan 012 — AAA Learner Experience

Status: in progress. This is the release program after Plans 010 and 011; their implemented surfaces are
the baseline, not proof that this plan is complete.

Depends on: [Plan 010](010-beginner-content-contract.md) and
[Plan 011](011-simple-puzzles.md). Supersedes their audio, adaptive-review, and connected-reading
exclusions. Owner: Fable for pedagogy and art direction; implementation requires native Persian,
native Danish, accessibility, and novice-learner reviewers.

## Questions

(none — record a concrete blocker here and stop only the affected milestone)

## Authority

This plan is executed against the normative specification suite:

1. [AAA quality bar](../specs/AAA-QUALITY-BAR.md)
2. [AAA learning specification](../specs/AAA-LEARNING-SPEC.md)
3. [AAA UX and accessibility specification](../specs/AAA-UX-ACCESSIBILITY-SPEC.md)
4. [AAA responsive design specification](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md)

Where an older plan conflicts, this plan and its specs win. `CLAUDE.md` and
`docs/design/ART-DIRECTION.md` continue to govern everything not explicitly changed here.

## Outcome

Ship a trustworthy beginner course, not merely a polished script gallery. “AAA” means:

- **Accurate:** contextual Persian orthography, sound, IPA, Danish help, and human audio agree.
- **Adaptive:** short retrieval sessions revisit material over time and distinguish exposure from
  retained learning.
- **Accessible:** every action responds visibly, every route starts predictably, and the complete app
  meets WCAG 2.2 AA plus the selected AAA criteria in the UX spec.

No weighted score can compensate for a failed pillar. All three pass independently.

## Defects this plan must close

These are reproducible baseline failures, not optional polish:

1. Orientation decomposes `بابا` with each `ا` labelled `[æ]`, then correctly pronounces the word
   `[bɒːbɒː]`. The same context-free help appears in `بابک`. Alef and the other vowel-carrier roles
   need contextual teaching and native review.
2. Opening a detail lesson from a scrolled alphabet or vocabulary index can retain the old scroll
   offset and land below the new lesson's title and primary specimen.
3. Choice and puzzle feedback is appended below the phone viewport. A wrong tap can appear inert
   because the selected choice receives no local state and the reveal is not brought into view.
4. The default alphabet rounds announce 32–33 consecutive questions; exposure taps are presented as
   “klaret”; no delayed review tests retention.
5. A text label and IPA stand in for sound in prompts that ask which sign “siger denne lyd”. No native
   pronunciation recording exists.
6. The course ends at isolated words. It does not yet prove transfer to connected Persian reading.
7. Desktop is the phone sheet stretched across the window: lesson cards exceed 1,800px, related
   controls sit a monitor apart, and typing leaves a phone-sized keyboard isolated in empty space.

## Delivery protocol

- Execute milestones in order. Each milestone may use its own reviewable PR, but P12 remains open
  until the final release audit passes every acceptance item.
- No milestone may knowingly leave a learner-facing contradiction live. Use a dormant capability or
  finish the vertical slice before exposing it.
- Permitted new development dependencies: `@playwright/test` and `@axe-core/playwright`. There are no
  new runtime dependencies. Human audio is static, lazy-loaded content.
- Preserve all add-only rewards. Review due state may change; earned ticks, stickers, levels, and
  completion records never decrease.
- Record native review decisions and usability findings as evidence, not chat summaries.

## Milestone 0 — Baseline and content freeze

1. Add Playwright cross-viewport journeys for first run, index → detail, wrong/correct feedback,
   puzzle, typing, return visit, dark/light, reduced motion, and denied storage.
2. Save the complete mobile, landscape, tablet, desktop, ultrawide, and zoom baseline matrix from the
   responsive spec for critical routes, including measured content and component widths.
3. Export a review manifest of every `PersianEntry`, contextual reading cue, Danish sound cue, IPA,
   and future audio ID. Freeze new learner-facing Persian until Milestone 1 is approved.

## Milestone 1 — Accurate Persian and pronunciation model

1. Replace universal letter “sound” assumptions with contextual roles. Alef, vav, ye, he, eyn,
   hamze, and all homophonous letter groups receive explicit audit coverage.
2. Represent written graphemes and unwritten short vowels honestly in word/name reading cues. Do not
   derive a word's pronunciation by concatenating standalone letter help.
3. Correct the orientation, alphabet challenges, `بابا`, `باد`, `بابک`, and every affected name or
   vocabulary companion as one consistent teaching model.
4. Add stress and syllable review to polysyllabic IPA. Publish the Danish sound-spelling convention.
5. Require signed review from two native Iranian Persian reviewers, including one literacy educator,
   plus one phonetics reviewer. One person may fill two roles; two independent people are minimum.

## Milestone 2 — Interaction and journey repair

1. Forward navigation starts at the new page heading; browser Back restores the previous position.
   Document titles and focus announce the new lesson without a focus trap.
2. Every answer produces an immediate visible selected state and a teaching reveal inside the current
   viewport. Retry and Next remain reachable without hunting below a sticky dock.
3. Replace first-run wall-of-text pacing with short orientation steps while retaining the complete
   introduction for rereading.
4. Put one honest “Fortsæt” action in the first phone viewport on return. Keep lesson browsing open.
5. Rename exposure actions and counters so “set”, “øvet”, and “husket” cannot be confused.

## Milestone 3 — Responsive workspace

1. Keep 320–430px mobile single-column, one-handed, and content-first; handle safe areas, browser
   chrome, orientation, and the software keyboard without hidden prompts or actions.
2. Add a centered, bounded notebook workspace for tablet/desktop/ultrawide. Reading lines, cards,
   specimens, keys, and grids stop growing at their specified comfortable widths.
3. At wide containers, transform home, orientation, indexes, detail lessons, exercises, and typing
   into the intentional multi-column compositions defined in the responsive spec. Preserve one DOM
   and reading order; never maintain a separate desktop app.
4. Use fluid tokens and component container queries with tested fallbacks. Resizing, zooming, split
   screen, and rotation preserve selection, input, scroll restoration, and task state.

## Milestone 4 — Native human audio

1. Record every static pronounceable catalog entry with a native standard-Tehrani speaker. Letter
   sound/function and letter name remain separate entries. Dynamic learner names never invent audio.
2. Validate files, IDs, transcripts, speaker consent, licence, loudness, duration, and asset budgets
   through one checked manifest.
3. Add an explicit replay control beside pronunciation help. Never autoplay. Mute and playback speed
   are learner-controlled; an unavailable clip never blocks reading or completion.
4. Lazy-load clips on demand and verify that initial page load does not request the audio corpus.

## Milestone 5 — Adaptive retrieval

1. Add the deterministic local-only review state defined in the learning spec, with a migration from
   existing progress that grants history but does not pretend old exposure proves retention.
2. Default to sessions of at most 12 tasks and roughly five minutes: due review first, then up to four
   new items, then one connected-reading transfer task when eligible.
3. Requeue an error after intervening material and on the next local day. Schedule correct retrievals
   at increasing intervals; never lower earned rewards or shame a lapse.
4. Keep full legacy rounds available as optional practice, not the primary path.

## Milestone 6 — Connected reading

1. Add at least one decodable phrase after every four-word vocabulary group and one 3–5-sentence
   microtext at the end of every vocabulary unit.
2. Every text uses only introduced forms, words, and explained particles. Exceptions are taught before
   use and recorded in the text manifest.
3. Teach with marked text and native audio, then offer unmarked reading and a meaning question. The
   learner can always reveal the marked text and Danish help without penalty.
4. A native Persian literacy reviewer approves naturalness; controlled vocabulary must not produce
   unnatural Persian merely to satisfy a letter inventory.

## Milestone 7 — AAA release audit

1. Run the complete automated, visual, accessibility, performance, storage, and content gates from
   the quality specification.
2. Run moderated first-use tests with at least five Danish-speaking adults who know no Persian. Fix all
   critical/high findings and repeat affected tasks until the success thresholds pass.
3. Run keyboard-only, VoiceOver/Safari, TalkBack/Chrome, and NVDA/Firefox journeys. An accessibility
   specialist signs the WCAG 2.2 AA audit and selected-AAA checklist.
4. `npm run verify`, Playwright, the production build, and CI are green from a clean checkout.

## Acceptance

- [ ] All seven baseline defects above have regression evidence.
- [ ] Native reviewers approve every catalog entry, contextual cue, connected text, and audio clip.
- [ ] Alef and vowel carriers are taught contextually; `بابا`, `باد`, and `بابک` contain no
      letter-to-word pronunciation contradiction.
- [ ] Every forward route opens at its heading; Back restores prior position; unique titles ship.
- [ ] Wrong, correct, skipped, and typed attempts reveal visible help without dock occlusion.
- [ ] Human audio covers 100% of static pronounceable entries and remains optional, lazy, and offline-safe.
- [ ] Default review sessions are short, deterministic, spaced, cumulative, and local-only.
- [ ] Exposure, successful retrieval, retained learning, and due review are distinct states in copy
      and storage.
- [ ] Every vocabulary group has a phrase; every vocabulary unit has an approved microtext.
- [ ] WCAG 2.2 AA and every selected AAA criterion in the UX spec pass in all supported variations.
- [ ] Every responsive surface passes the mobile-to-ultrawide layout contracts, bounds, state
      preservation, input modes, and visual matrix in the responsive spec.
- [ ] Core Web Vitals lab targets, bundle/asset budgets, and zero-runtime-fetch privacy rules pass.
- [ ] Novice usability thresholds pass with no unresolved critical/high finding.
- [ ] `npm run verify`, Playwright, production build, and CI pass from a clean checkout.
- [ ] A fresh-context Iranian teacher, Danish learner, responsive art director, accessibility
      specialist, and maintainer can name no concrete release-blocking defect.

## Out of scope

Accounts, cloud sync, production analytics, speech recognition or pronunciation scoring, generated
learner content, open-ended grammar instruction, social competition, timers, lives, ads, and runtime
AI remain prohibited. Finger tracing and PWA installation may be planned after P12; neither may delay
the accurate, adaptive, accessible reading release.

# AAA Release Status

Status: implementation candidate, not externally approved. Updated 2026-08-10.

AAA remains conjunctive: Accurate AND Adaptive AND Accessible. This file is evidence routing, not a
waiver. Empty signature fields block release.

## Implemented evidence

- contextual reading roles replace universal letter sounds; all 28 curriculum vocabulary words have
  exact, ordered written/unwritten cues with explicit carrier, silent, vowel, and consonant roles;
- every catalog word/phrase now has a reviewable ordered cue: 38 contextual, 7 tokenized, and 86
  whole-item candidates; the remaining 45 no-cue rows are letters, marks, or symbols;
- route focus, unique titles, forward scroll reset, and Back restoration are browser-tested;
- selected answer state, full in-view teaching feedback, retry focus, and compact typing-error flow
  are unit- and browser-tested without losing the learner's writing;
- first-run orientation uses six individual steps and records completion only after the final step or
  an explicit skip; return-home has one honest Continue action;
- phone-to-ultrawide geometry is bounded across 22 widths from 320 to 2560px, including every mode
  boundary and ±1px, plus short landscape, 200% text, 400% reflow-equivalent text spacing, live
  resize, dark, reduced-motion, and forced-colors checks;
- the versioned deterministic local scheduler passes migration, lapse, DST, rollback, same-day,
  retained-learning, 90-day invariant, and corruption-normalization tests;
- default sessions mix due work with up to four modeled new items and an eligible transfer task,
  requeue errors after intervening work, and offer a natural stop after each answer;
- every vocabulary group has a connected phrase and every unit has a 3–5-sentence microtext;
- reviewed-audio controls are lazy and manifest-driven with replay, stop, normal/slow speed, mute,
  single-clip playback, and non-blocking failure; no recording is shown or requested without a
  reviewed manifest row;
- Chromium, Firefox, and WebKit journeys cover core interaction; axe scans cover representative
  routes; production performance, network privacy, semantic contrast, and asset ceilings are enforced;
- storage denial/full and corrupt saved rows preserve the active session and produce distinct,
  non-blocking status messages only when recovery information is needed;
- a fresh, tiny release file lets an old GitHub Pages response move itself to the new app while
  keeping the current lesson, so learners do not need a hard reload;
- 224 deterministic pixel baselines cover 16 required states at seven widths in both color schemes.
  They remain candidates and need a refresh after the animal lesson before visual sign-off.

## Latest local run

Checks on 2026-08-10:

- lint passed; all 94 Vitest files and 618 tests passed with one worker;
- the production build, image checks, audio-manifest checks, and repository structure checks passed;
- production main files are 332,719-byte JS and 49,926-byte CSS; speaking routes remain separate
  1,669-byte and 5,110-byte JS chunks while their audio is gated;
- the 222-row queue regenerated; all 97 local talk drafts meet the file, duration, loudness, peak,
  and size limits, but zero has native approval or entered the public manifest;
- the browser run had 87 passes and 40 intended skips. Serial reruns cleared all accessibility
  timeouts. The 30-second geometry timeout and the 200 ms lab proxy also reproduce on untouched
  `main` on this host (33 seconds and 218.5 ms), so their limits were not changed;
- the 14 Chromium pixel failures are the known pre-animal baselines against the animal lesson already
  on `main`. No unrelated snapshot was replaced.

## External release gates — open

- [ ] Native Iranian reviewer 1: name, qualification, date, commit, signature
- [ ] Native Iranian literacy reviewer 2: name, qualification, date, commit, signature
- [ ] Phonetics reviewer: name, qualification, date, commit, signature
- [ ] Native Danish copy/lydskrift reviewer: name, qualification, date, commit, signature
- [ ] Audio: 97 talk clips, named native review, provenance/licence, and loudness reports
- [ ] Accessibility specialist: WCAG 2.2 AA and selected-AAA audit
- [ ] VoiceOver/Safari, TalkBack/Chrome, and NVDA/Firefox manual notes
- [ ] Five zero-knowledge Danish novice sessions and 7±2-day follow-up
- [ ] Responsive art-direction sign-off on the saved cross-viewport matrix

## Content and dependency gates — open

- The generated manifest has 77 stress-review rows: 14 currently mark lexical stress and 63 still
  require a phonetics decision and, where applicable, corrected source IPA.
- The 86 whole-item cues are honest candidates, not a claim of fine-grained decomposition. Reviewers
  must approve them or request contextual spans where the item is taught as reading material.
- Connected phrases and microtexts are implementation candidates, not approved teaching copy.
- The audio manifest is intentionally empty: 222 spoken forms lack approved clips; 97 block the talk
  path. Unreviewed generated speech and all runtime speech generation are prohibited.
- `npm audit` reports two high findings from the same React Router RSC-only advisory,
  [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2). This static HashRouter app
  does not use the affected unstable RSC APIs. The published patch is React Router 8.3.0; re-evaluate
  a major upgrade when compatible, and do not use npm's suggested downgrade without a full advisory
  review.

No one may label this build “AAA released” until every external gate is signed and every remaining
implementation gate is closed with exact evidence.

# AAA Release Status

Status: implementation candidate, not externally approved. Updated 2026-08-06.

AAA remains conjunctive: Accurate AND Adaptive AND Accessible. This file is evidence routing, not a
waiver. Empty signature fields block release.

## Implemented evidence

- contextual reading roles replace universal letter sounds; all 28 curriculum vocabulary words have
  exact, ordered written/unwritten cues with explicit carrier, silent, vowel, and consonant roles;
- every catalog word/phrase now has a reviewable ordered cue: 34 contextual, 7 tokenized, and 82
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
- human-audio controls are lazy and manifest-driven with replay, stop, normal/slow speed, mute,
  single-clip playback, and non-blocking failure; no recording is shown or requested without a
  reviewed manifest row;
- Chromium, Firefox, and WebKit journeys cover core interaction; axe scans cover representative
  routes; production performance, network privacy, semantic contrast, and asset ceilings are enforced;
- storage denial/full and corrupt saved rows preserve the active session and produce distinct,
  non-blocking status messages only when recovery information is needed;
- 210 deterministic pixel baselines cover 15 required states at seven widths in both color schemes.
  They compare cleanly but remain candidates until the three required visual reviewers sign.

## Latest automated run

`npm run verify` passed on 2026-08-06 after regenerating both review artifacts:

- 71 Vitest files, 527 tests passed;
- production initial bundle: 359,420-byte JS and 46,546-byte CSS; the dormant audio player is a
  separate 1,576-byte JS / 407-byte CSS chunk;
- 76 Playwright cases passed across Chromium, Firefox, and WebKit;
- 38 cases skipped intentionally: geometry, performance timing, forced-colors emulation, and the 210
  Linux pixel comparisons run once in Chromium; equivalent core journeys still run in all engines;
- the checked-in 172-row content manifest and 169-row audio queue regenerated with no diff;
  `git diff --check` passed.

## External release gates — open

- [ ] Native Iranian reviewer 1: name, qualification, date, commit, signature
- [ ] Native Iranian literacy reviewer 2: name, qualification, date, commit, signature
- [ ] Phonetics reviewer: name, qualification, date, commit, signature
- [ ] Native Danish copy/lydskrift reviewer: name, qualification, date, commit, signature
- [ ] Human audio: speaker consent/licence, files, second native review, loudness report
- [ ] Accessibility specialist: WCAG 2.2 AA and selected-AAA audit
- [ ] VoiceOver/Safari, TalkBack/Chrome, and NVDA/Firefox manual notes
- [ ] Five zero-knowledge Danish novice sessions and 7±2-day follow-up
- [ ] Responsive art-direction sign-off on the saved cross-viewport matrix

## Content and dependency gates — open

- The generated manifest has 67 stress-review rows: 10 currently mark lexical stress and 57 still
  require a phonetics decision and, where applicable, corrected source IPA.
- The 82 whole-item cues are honest candidates, not a claim of fine-grained decomposition. Reviewers
  must approve them or request contextual spans where the item is taught as reading material.
- Connected phrases and microtexts are implementation candidates, not approved teaching copy.
- The audio manifest is intentionally empty: 169 pronounceable rows lack approved recordings and 3
  no-sound rows are explicitly not applicable. Generated speech is prohibited.
- `npm audit` reports two high findings from the same React Router RSC-only advisory,
  [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2). This static HashRouter app
  does not use the affected unstable RSC APIs. The published patch is React Router 8.3.0; re-evaluate
  a major upgrade when compatible, and do not use npm's suggested downgrade without a full advisory
  review.

No one may label this build “AAA released” until every external gate is signed and every remaining
implementation gate is closed with exact evidence.

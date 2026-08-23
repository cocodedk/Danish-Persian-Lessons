# AAA Quality Bar

Status: normative release specification for Plan 012. Version 1.0 — 2026-08-06.

## Release rule

AAA is conjunctive: **Accurate AND Adaptive AND Accessible**. A release fails if any pillar fails.
Scores and averages are informative only; they cannot waive a blocker. “Native review pending”,
“reachable by scrolling”, or “tests are green” is not an acceptable release status when the missing
evidence is itself required.

## Severity

| Severity | Definition | Release treatment |
|---|---|---|
| Critical | Teaches a false rule; loses/corrupts progress; blocks a journey; causes serious access failure | Must be fixed and regression-tested |
| High | Likely wrong learning, apparent non-response, hidden action/feedback, WCAG A/AA failure | Must be fixed and regression-tested |
| Medium | Material friction, ambiguity, avoidable cognitive load, selected-AAA failure | Fix or obtain written five-person sign-off |
| Low | Polish with no plausible learning or access cost | May follow with an owner and issue |

The five-person exception group is the Persian educator, Danish learner representative, responsive
art director, accessibility reviewer, and maintainer. Accuracy and WCAG A/AA defects are never
waivable.

## Gate A — Accurate

- Every app-owned Persian item MUST exist in the catalog with stable ID, natural Danish help,
  documented Danish sound spelling, reviewed standard-Tehrani IPA, and contextual role where a glyph
  has more than one pronunciation or function.
- Every pronounceable static spoken form MUST have approved, provenance-tracked audio. `∅`, learner-generated names, and
  explicitly non-pronounceable controls MUST document why audio does not apply.
- Two independent native Iranian Persian reviewers MUST approve the content manifest. At least one
  reviewer MUST have primary-literacy teaching or curriculum experience.
- One phonetics reviewer MUST approve sound, stress, syllabification, IPA, and recording alignment.
  One native reviewer may also fill this role if qualified.
- One native Danish reviewer MUST read every `lydskrift` sample aloud and approve plain-language copy.
- No exercise may ask for a one-to-one sound mapping where the teaching model says the glyph is
  contextual. No word may be explained by concatenating misleading standalone letter labels.

Evidence: signed, versioned review manifest; content integrity tests; affected-screen screenshots;
audio-manifest validation; zero unresolved reviewer comments.

## Gate B — Adaptive

- The default path MUST use retrieval, feedback, spacing, and cumulative transfer. Repeated study and
  self-declared familiarity alone do not establish retained learning.
- Default sessions MUST fit in about five minutes, cap at 12 tasks, resume safely, and offer a clear
  stop after every task. Full rounds MAY remain optional.
- Due review MUST precede new material. Errors MUST reappear after intervening tasks and on a later
  day. Correct retrieval MUST produce increasing intervals as specified in the learning spec.
- Progress copy and records MUST distinguish `introduced`, `retrieved`, `retained`, and `due`.
  Rewards remain add-only even when an item becomes due or is answered incorrectly.
- Every vocabulary group MUST transfer to a controlled phrase; every unit MUST transfer to a short,
  natural text and meaning check.
- The scheduler MUST be deterministic, timezone-safe, versioned, local-only, testable across absence,
  storage denial, corruption, migration, and clock-boundary cases.

Evidence: scheduler property tests; longitudinal fixtures through at least 45 local days; storage
migration tests; task eligibility tests; connected-text manifest; novice delayed-recall results.

## Gate C — Accessible

- Every production page and responsive variation MUST conform to WCAG 2.2 Level A and AA.
- Selected AAA requirements are mandatory: 1.4.6 Contrast (Enhanced), 2.4.10 Section Headings,
  2.4.12 Focus Not Obscured (Enhanced), 2.4.13 Focus Appearance, 2.5.5 Target Size (Enhanced),
  2.5.6 Concurrent Input Mechanisms, 3.2.5 Change on Request, and 3.3.5 Help where applicable.
- A pointer, keyboard, switch-style sequential input, or screen reader MUST complete every core
  journey. Audio MUST always have equivalent visible text and MUST never autoplay.
- New routes, status, selected state, feedback, reward, and errors MUST be perceivable without relying
  on color, position, motion, or sound alone.
- Sticky details, keyboard docks, and bottom navigation MUST NOT hide any focused control, prompt,
  answer, feedback heading, or next action at supported sizes and 200% zoom.
- Dark/light, reduced motion, sound off, storage denied, offline after load, and increased text MUST
  retain full function.
- Every surface MUST satisfy the bounded mobile, tablet, desktop, and ultrawide compositions in the
  [responsive design specification](AAA-RESPONSIVE-DESIGN-SPEC.md). A phone layout merely stretched
  across a larger canvas is a release failure even when it technically reflows.

Evidence: automated axe results; Playwright geometry, responsive, and keyboard journeys; manual WCAG
audit; cross-viewport visual approvals; VoiceOver, TalkBack, and NVDA notes; contrast calculations;
no unresolved critical/high finding.

## Performance and resilience

- Production Core Web Vitals lab proxies MUST meet the current “good” targets: LCP ≤2.5 seconds,
  interaction response ≤200 ms, and CLS ≤0.1 in three-run median mobile tests. These thresholds follow
  the current [Core Web Vitals guidance](https://web.dev/articles/vitals).
- The build MUST record and enforce initial JS, CSS, font, and route asset budgets. The P12 baseline
  sets exact ceilings before implementation; any increase requires a measured learner benefit.
- Audio MUST be mono, compressed, individually lazy-loaded, cached by the browser, and absent from the
  initial route waterfall. One failed clip MUST not fail a page or task.
- There MUST be no runtime request except same-origin static assets initiated by the learner. No
  analytics, telemetry, account, fingerprinting, remote font, CDN, or runtime AI request is allowed.
- Denied/full/corrupt storage MUST preserve the current session in memory and explain persistence
  limits only when the learner needs that information.

## Owner-run local evidence

The owner-run clean-checkout gate MUST run locally:

1. `npm run lint`
2. all Vitest unit, component, integrity, migration, scheduler, and property tests
3. a production build plus explicit bundle/font/audio-manifest budget checks
4. Playwright on Chromium, Firefox, and WebKit for the representative journey matrix
5. axe scans on every representative route/state in light and dark schemes
6. the existing static-site verifier

Automation MUST cover forward-scroll reset, Back restoration, heading focus, feedback visibility,
sticky/dock occlusion, 44×44 targets, no horizontal overflow, reduced motion, audio laziness, and
storage denial. It MUST also cover responsive component bounds, layout modes, resizing without state
loss, portrait/landscape, zoom reflow, and visual diffs from 320px through 2560px. Manual review
remains required for language, screen readers, cognitive clarity, real touch use, and desktop balance.
GitHub Actions and other CI systems are not release requirements. The release packet MUST record the
local commit, commands, environment, date, and result.

## Human evidence

- At least five Danish-speaking adults with no Persian knowledge complete the first-run protocol; at
  least three are phone-primary learners aged 18–25.
- At least four of five MUST, without facilitator help: identify RTL direction, complete a taught
  letter, recover from a wrong answer, find the next recommended action, leave, and resume.
- No participant may report or exhibit an apparent dead tap on a core action. No more than one may
  mistake `set` for `husket` or interpret an earned reward as current mastery.
- At least two participants MUST repeat a learned mobile task on desktop without losing orientation,
  and complete a keyboard/pointer task without facilitator help.
- Delayed follow-up after 7±2 days MUST show at least four of five can correctly retrieve three of the
  first four taught mappings and read one previously practised word. This is a release diagnostic,
  not a claim of statistical efficacy.
- Every critical/high observation is fixed and the affected task is rerun. Raw notes, task outcomes,
  device, date, and build commit are saved without production tracking or unnecessary personal data.

## Testimonial provenance and consent

This file owns provenance, consent, and release gating for testimonials. Composition and layout are
owned by [DESIGN.md](../../DESIGN.md) and are not restated here. The app ships no testimonials today;
every requirement below applies to any release that ships one. An unmet requirement is a Critical
defect and is never waivable by the exception group.

- Every quote MUST come from a real, identifiable person whose relationship to the product and
  enough context to judge the quote are stated in the published attribution.
- Published wording MUST be verbatim and approved by that source. Fabricated, composite, stock, or
  silently paraphrased quotes and attributions are forbidden; any shortening or editing MUST be
  marked and reapproved by the source before publication.
- Dated written informed consent MUST exist and MUST name the exact public quote, every attribution
  field, the portrait if one is used, the channels where it may appear, and how to withdraw.
- Anyone under 18 MUST have separate guardian consent plus the young person's own assent, and MUST
  pass a heightened necessity and privacy review recording why no adult source suffices. Not using
  minors is the preferred outcome.
- Attribution MUST be minimized to what the reader needs to judge the quote. Contact details, exact
  address, employer, school, full name where a first name suffices, and any data not required for
  that judgement MUST NOT be published.
- Consent evidence and source identity MUST be stored privately outside this public repository.
  Only a non-sensitive approval and provenance record or identifier may appear in release evidence,
  the repository, or the release packet.
- A documented revocation route MUST let a source withdraw at any time without giving a reason.
  After withdrawal the quote, attribution, and portrait MUST NOT be published again, MUST be removed
  in the next deploy, and the removal MUST be recorded.
- Any material change to the quote, its surrounding context, or the image MUST be reapproved in
  writing by the source before the changed version ships.

## Required release packet

- commit and production-build identifiers
- completed acceptance matrix linked to exact tests and screenshots
- Persian/Danish/phonetics/audio sign-offs
- WCAG audit and assistive-technology notes
- responsive geometry report, cross-viewport snapshots, and art-direction sign-off
- novice protocol, anonymized findings, fixes, and rerun results
- asset/performance report and privacy/network trace
- for any release containing a testimonial: the non-sensitive testimonial approval and
  provenance record, confirming dated consent, minimized attribution, private storage of the
  consent evidence, and no withdrawn source in the shipped build
- known low-severity issues with owners

P12 may be checked complete only when every packet item exists and every MUST is proven.

## Sources

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — AA conformance and selected AAA criteria. W3C advises
  against requiring whole-site AAA as a general policy, hence the explicit selected-AAA set above.
- [Karpicke & Roediger, 2008](https://doi.org/10.1126/science.1152408) — repeated retrieval and
  long-term retention.
- [Cepeda et al., 2008](https://pubmed.ncbi.nlm.nih.gov/19076480/) — spacing interval and retention.

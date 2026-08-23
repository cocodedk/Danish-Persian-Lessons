# AAA Specification Suite

Status: normative for [Plan 012](../plans/012-aaa-learner-experience.md), with the lesson-image
extension in [Plan 013](../plans/013-real-lesson-images.md), the child-first extension in
[Plan 014](../plans/014-child-first-aaa-experience.md), and the counting extension in
[Plan 016](../plans/016-counting-1-20.md).

AAA means **Accurate, Adaptive, Accessible**. It is a product quality bar, not a claim that every WCAG
2.2 Level AAA success criterion applies to every page. W3C itself advises against requiring whole-site
AAA as a general policy; this suite requires full WCAG 2.2 AA plus the selected AAA criteria that
directly improve this learning experience.

## Documents

1. [AAA quality bar](AAA-QUALITY-BAR.md) — release governance, evidence, performance, and sign-off.
2. [AAA learning specification](AAA-LEARNING-SPEC.md) — Persian accuracy, audio, teaching cycle,
   review scheduling, mastery, and connected reading.
3. [AAA UX and accessibility specification](AAA-UX-ACCESSIBILITY-SPEC.md) — journeys, navigation,
   feedback, responsive behavior, accessibility, and manual/browser QA.
4. [AAA responsive design specification](AAA-RESPONSIVE-DESIGN-SPEC.md) — mobile-first ergonomics,
   intentional tablet/desktop composition, layout bounds, viewport dynamics, and visual QA.
5. [AAA lesson image specification](AAA-LESSON-IMAGE-SPEC.md) — accurate learning use, local image
   delivery, source rights, privacy, accessibility, asset budgets, and human review.
6. [AAA child experience specification](AAA-CHILD-EXPERIENCE-SPEC.md) — child agency, dual front
   doors, motivation, collection, privacy, and accessibility.
7. [AAA child first-run specification](AAA-CHILD-FIRST-RUN-SPEC.md) — exact routes, mission state,
   persistence, feedback, responsive bounds, and browser acceptance journeys.
8. [AAA counting curriculum specification](AAA-COUNTING-CURRICULUM-SPEC.md) — counting routes, staged
   ranges, worked examples, counting data, progress identities, audio honesty, counting selection and
   playback behavior, and exercises.

## Normative language

**MUST** and **MUST NOT** are release requirements. **SHOULD** requires a written, reviewer-approved
reason to diverge. **MAY** is optional. A screenshot, test, or checklist proves only the behavior it
actually covers; absence of a detected failure is not proof of broad conformance.

Each aspect has exactly one authoritative source. Consult that source rather than the nearest
document that happens to mention the aspect.

- [docs/specs/README.md](README.md) — this authority map itself: which document owns which aspect.
- [DESIGN.md](../../DESIGN.md) — product promise, information architecture, navigation decisions, the
  semantic typography roles and permitted-weight policy, the product-level teaching order, testimonial
  composition and layout, the product-level four-lesson counting sequence, and the high-level counting
  experience: the primary job of a counting surface, tile activation as the primary action, replay as
  secondary, and the mobile-base/wide-rail composition intent.
- [docs/design/ART-DIRECTION.md](../design/ART-DIRECTION.md) — the notebook visual metaphor and
  component styling semantics.
- [src/styles/fonts.css](../../src/styles/fonts.css) — the exact font files and weights that ship.
- [src/styles/tokens.css](../../src/styles/tokens.css) — the exact palette, font-family stacks,
  spacing, and measure token values.
- [AAA-RESPONSIVE-DESIGN-SPEC.md](AAA-RESPONSIVE-DESIGN-SPEC.md) — breakpoints, wrapping, mobile
  fallback, rail and fixed-control geometry, and the counting layout acceptance: number-tile
  direction, tile target size, minimum column counts, the bounded wide grid with its dedicated detail
  rail, and tile-grid layout stability.
- [AAA-UX-ACCESSIBILITY-SPEC.md](AAA-UX-ACCESSIBILITY-SPEC.md) — accessibility requirements,
  including contrast and scrim requirements.
- [AAA-LEARNING-SPEC.md](AAA-LEARNING-SPEC.md) — pedagogy, Persian linguistic accuracy, audio policy,
  review process and quality requirements, the teaching cycle, review scheduling and mastery, and
  connected reading. It does not own the audio inventory.
- [src/audio/approved.generated.json](../../src/audio/approved.generated.json) — the exact approved
  audio clip inventory.
- [AAA-COUNTING-CURRICULUM-SPEC.md](AAA-COUNTING-CURRICULUM-SPEC.md) — the exact counting routes,
  staged counting ranges, worked-example coverage, counting descriptor and data ownership, counting
  progress identities, counting audio-honesty behavior, the exact counting selection and playback
  behavior — what navigation, activation, re-activation, a changed selection, and a missing clip do —
  the pre-release 1-20 word-audio completeness condition, and counting exercise mechanics. It does not
  own the product-level four-lesson counting sequence or the high-level counting experience, which
  stay with [DESIGN.md](../../DESIGN.md); the counting tile-grid and rail layout acceptance, which
  stays with [AAA-RESPONSIVE-DESIGN-SPEC.md](AAA-RESPONSIVE-DESIGN-SPEC.md); the approved audio clip
  inventory, which stays with
  [src/audio/approved.generated.json](../../src/audio/approved.generated.json); audio policy, process,
  and quality, which stay with [AAA-LEARNING-SPEC.md](AAA-LEARNING-SPEC.md); or reviewer roles, which
  stay with [AAA-QUALITY-BAR.md](AAA-QUALITY-BAR.md).
- [CLAUDE.md](../../CLAUDE.md) — repository architecture, engineering constraints, agent workflow,
  and the typed-catalog integration contract.
- [AAA-QUALITY-BAR.md](AAA-QUALITY-BAR.md) — release evidence, reviewer authority, the exception and
  sign-off process, and testimonial provenance and consent.
- [docs/reviews/VISUAL-REVIEW-PROTOCOL.md](../reviews/VISUAL-REVIEW-PROTOCOL.md) — the visual
  baseline procedure and its state inventory.

Documents must cross-reference these sources rather than restate mutable values. Explicit learner
safety, privacy, or linguistic accuracy requirements always take the stricter interpretation.

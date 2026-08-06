# AAA Specification Suite

Status: normative for [Plan 012](../plans/012-aaa-learner-experience.md).

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

## Normative language

**MUST** and **MUST NOT** are release requirements. **SHOULD** requires a written, reviewer-approved
reason to diverge. **MAY** is optional. A screenshot, test, or checklist proves only the behavior it
actually covers; absence of a detected failure is not proof of broad conformance.

Precedence is Plan 012, then this suite in the order above, then `CLAUDE.md`, then
`docs/design/ART-DIRECTION.md`, then older plans. Explicit learner safety, privacy, or linguistic
accuracy requirements always take the stricter interpretation.

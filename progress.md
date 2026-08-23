Original prompt: read docs/reports/2026-08-23-plan016-status.md, and you act as the command and control reviewer of cyp in fish. cyp is my personal claude account. use cyp with opus on medium effort to fix. plan well and send cyp on small tasks to make it faster and easier to review.

## 2026-08-23 Plan 016 review

- Confirmed `talkAudioReady()` is deterministic from committed launch clip IDs and approved audio metadata; the report's machine-dependent diagnosis was false.
- Cyp corrected the Plan 016 plan/status narrative. Reviewer removed unrelated Claude chat hooks and `.mcp.json` that Cyp created outside its two-file scope.
- Cyp fixed the counting exercise data shape, pronunciation hiding, honest progress/celebration, unknown-kind redirect, and measured bottom-navigation clearance.
- Unified every 1-10/1-20 surface behind the canonical `countingLesson` descriptor at `/lesson/taelle`; `beginnerNumbers` remains compatibility data, not a lesson.
- Updated `DESIGN.md` and the specification authority map; added the counting curriculum contract for the three future rule lessons.
- Current non-visual evidence: ESLint clean, 100 test files/660 tests passed, production build green, `scripts/verify.sh` green, main CSS 49,961 bytes.
- Pending: checkpoint commit without the unapproved visual PNG candidates; then implement and verify the 21-99, 100-900, and thousands rule lessons as separate fixpoints.

## 2026-08-23 Plan 017

- Planned three separate implementation fixpoints: shared minimal infrastructure plus 21-99, then 100-900, then 1,000-9,999.
- `byg` is a deterministic token-composition exercise shared by the three rule lessons; recognition rounds continue to use `ChoiceExercise`.
- All new language forms remain candidate content blocked from release until Gate A human review evidence exists.

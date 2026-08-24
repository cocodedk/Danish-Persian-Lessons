Original prompt: read docs/reports/2026-08-23-plan016-status.md, and you act as the command and control reviewer of cyp in fish. cyp is my personal claude account. use cyp with opus on medium effort to fix. plan well and send cyp on small tasks to make it faster and easier to review.

## 2026-08-23 Plan 016 review

- Confirmed `talkAudioReady()` is deterministic from committed launch clip IDs and approved audio metadata; the report's machine-dependent diagnosis was false.
- Cyp corrected the Plan 016 plan/status narrative. Reviewer removed unrelated Claude chat hooks and `.mcp.json` that Cyp created outside its two-file scope.
- Cyp fixed the counting exercise data shape, pronunciation hiding, honest progress/celebration, unknown-kind redirect, and measured bottom-navigation clearance.
- Unified every 1-10/1-20 surface behind the canonical `countingLesson` descriptor at `/lesson/taelle`; `beginnerNumbers` remains compatibility data, not a lesson.
- Updated `DESIGN.md` and the specification authority map; added the counting curriculum contract for the three future rule lessons.
- Current non-visual evidence: ESLint clean, 100 test files/660 tests passed, production build green, `scripts/verify.sh` green, main CSS 49,961 bytes.
- The foundation checkpoint was committed as `7795014` without the unapproved visual PNG candidates; Plan 017 then implemented 21-99, 100-900, and thousands as separate fixpoints.

## 2026-08-23 Plan 017

- Planned three separate implementation fixpoints: shared minimal infrastructure plus 21-99, then 100-900, then 1,000-9,999.
- `byg` is a deterministic token-composition exercise shared by the three rule lessons; recognition rounds continue to use `ChoiceExercise`.
- All new language forms remain candidate content blocked from release until Gate A human review evidence exists.
- Fixpoint A now implements the candidate 21-99 descriptor, catalog registration, isolated progress store, recognition rounds and the shared token builder. The curriculum descriptor array is the sole implementation source for lesson order and entry-point cards.
- Claude repaired the foundation round completion so `learnCountingItem` alone owns item/page rewards; completion now emits only a replay celebration. The focused regression suite passes 6/6.
- Verification evidence for fixpoint A: ESLint and TypeScript clean; 111 unit files / 773 tests pass; production build, image/audio checks and `scripts/verify.sh` pass; all changed code-like files remain below 200 lines.
- Live browser review on port 9000 passed at 320, 1024 and 1440 px for the rule page, token builder, Tal shelf and child workshop. Mobile wrapping, rail clearance and candidate-content containment are intact.
- Release remains blocked: all candidate Persian forms need Gate A human language evidence, and deliberate visual candidates remain uncommitted pending owner sign-off. The full Playwright run exposed an environment-only Socket Firewall page in Firefox; all 36 Chromium functional flows pass. WebKit passed the aggregate run and showed two unrelated navigation/storage flakes on repetition. The deliberate new 1440 px home card awaits its approved baseline.
- Claude's final read-only staged review returned APPROVE with no release-blocking code defect. It confirmed the intended process-only Gate A block, the unstaged visual candidates, and the loud-fail adapter behavior as explicit residual risks.
- Fixpoint B implements the candidate 100-900 rule lesson with the specification-owned operational range 100-999. Its nine round-hundred base forms, examples and unseen targets reuse lower-stage entries by object identity; only 17 lesson-owned entries enter its progress store and review queues.
- Adding the hundred descriptor as curriculum stage three automatically added the third card to Home, Tal and the child workshop. The one progress adapter maps it to `dpl.v1.counting.100-900`; the exact page and three exercise routes use thin wrappers over the shared screens.
- Fixpoint B verification: 113 unit files / 807 tests pass; ESLint, TypeScript, production build, image/audio checks and `scripts/verify.sh` pass; 36/36 Chromium functional end-to-end tests pass; changed code-like files stay below 200 lines. Live browser checks at 320/1024/1440 px found no clipping, candidate-language leak or rail collision.
- The generated content manifest grew from 274 to 291 rows and the audio review queue from 154 to 171. All 17 hundred-stage rows remain `draft-awaiting-native-review`, have missing audio, and require the existing human review roles; approved audio stays at 97 clips.
- Claude's final read-only hundred-stage review returned APPROVE with no release-blocking code defect. It independently confirmed the specification-owned range pairing, exact object reuse, 17-entry catalog/progress/queue boundary, three-store isolation, route ordering, candidate containment and clean public-path/image scan.
- Fixpoint C implements the candidate thousands rule from 1.000 through 9.999: one thousand stem, nine derived thousand bases, representative examples and unseen mixed-remainder targets. Foundation, tens, hundreds and the single joiner are reused by object identity.
- The fourth descriptor automatically appears on Home, Tal and the child workshop; the identity adapter maps its 17 owned rows to `dpl.v1.counting.tusinder`, and thin wrappers expose the exact page plus three exercise routes. A neutral reused-row label avoids falsely attributing the 21-99 joiner to the immediate 100-900 prerequisite.
- `src/lessons/countingDisplay.ts` is the single implementation authority for Danish counting-number and range presentation, so both overview surfaces now show `1.000` and `9.999` without duplicating formatting logic.
- Fixpoint C verification: 120 unit files / 864 tests pass; ESLint, TypeScript, production build, image/audio checks and `scripts/verify.sh` pass; 36/36 Chromium functional end-to-end tests pass; all changed code-like files stay below 200 lines. Live browser checks at 320/1024/1440 px found no clipping, candidate-language leak, repeated-token collision or rail overlap.
- The generated content manifest grew from 291 to 308 rows and the audio review queue from 171 to 188. All 17 thousands rows remain `draft-awaiting-native-review`, have missing audio, and require the existing human review roles; approved audio stays at 97 clips.
- The final review findings were closed before commit: recognition pools deduplicate base entries reused as examples, and every build target prompt uses the same Danish formatter as the overview cards.
- Claude's focused follow-up returned APPROVE: stable first-occurrence deduplication preserves four-choice sound safety, grouped build prompts retain numeric targets and reveal no answer fields, and the updated formatting/review contract matches all counting UI consumers.
- Fixpoint C was committed as `6714838`; all three rule-lesson implementations are now preserved as separate candidate commits. Merge remains blocked by Gate A human evidence and visual owner sign-off.

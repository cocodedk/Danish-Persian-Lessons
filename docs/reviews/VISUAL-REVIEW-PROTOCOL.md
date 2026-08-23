# Visual baseline review protocol

Status: 308 deterministic baseline candidates generated; no human approval recorded.

This file owns the baseline review procedure and the state inventory. Reviewer roster, severity
definitions, exceptions, and sign-off authority are owned by
[AAA-QUALITY-BAR.md](../specs/AAA-QUALITY-BAR.md) and are not restated here.

## Coverage

The baselines in `e2e/visual.spec.ts-snapshots/` cover 22 named states at 320, 390, 768, 1024, 1440,
1920, and 2560 CSS pixels in light and dark schemes: 22 × 7 × 2 = 308 images. They are captured in
Chromium only; the other Playwright projects skip the visual spec. Each file is named
`<state>-<scheme>-<width>-chromium-linux.png`, so every inventory entry below maps to 14 files.

## State inventory

The identifiers below are the ones implemented in `e2e/visualStates.ts`, in that order. The file and
`e2e/visual.spec.ts` are the executable evidence; this list is the reviewable inventory.

1. `journey-gate` — first visit with no stored profile.
2. `child-workshop` — the discovery workshop index.
3. `child-build` — word building, first character prompt.
4. `child-round-ready` — guided round finished, ready to try unaided.
5. `child-reveal` — wrong character chosen, reveal and retry offered.
6. `child-complete` — word finished and added to the collection.
7. `home` — home scrolled to top.
8. `orientation` — first-run orientation for the alphabet lesson.
9. `index-top` — alphabet index at the top.
10. `index-scrolled` — alphabet index scrolled into its list.
11. `detail` — a letter detail page.
12. `exercise-active` — choice exercise awaiting an answer.
13. `exercise-wrong` — choice exercise after a wrong answer.
14. `exercise-correct` — choice exercise after a correct answer.
15. `puzzle` — a matching puzzle.
16. `typing-active` — typing exercise awaiting input.
17. `typing-feedback` — typing exercise after checking an answer.
18. `name-settings` — settings opened for a named learner.
19. `connected-reading` — a connected-reading passage.
20. `word-bridges` — the "Ord, der ligner" word-bridge page.
21. `celebration` — sticker celebration after a correct answer.
22. `session-summary` — review session finished for the day.

## Commands

- Compare against the recorded baselines:
  `npm run e2e:run -- e2e/visual.spec.ts --project=chromium`
- Record new candidates after a deliberate fix:
  `npm run e2e:run -- e2e/visual.spec.ts --project=chromium --update-snapshots`

Regeneration writes candidate images. It never constitutes approval, and a green comparison only
proves the current build matches the last recorded candidate.

## Review procedure

- Inspect every baseline at native pixel size, not only a contact sheet.
- Compare adjacent widths for unexplained jumps, and 1024/1440/1920 for deliberate desktop use.
- Judge geometry — composition bounds, sticky and docked clearance, focus and anchor visibility,
  target separation — against [AAA-RESPONSIVE-DESIGN-SPEC.md](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md)
  rather than against thresholds copied into this file.
- Judge contrast, state cues, and reading-order implications against
  [AAA-UX-ACCESSIBILITY-SPEC.md](../specs/AAA-UX-ACCESSIBILITY-SPEC.md).
- For phone states, confirm the primary content and the next action are discoverable without a hidden
  control beneath the sticky footer; then reproduce high-risk states on a real 360–390px device.
- Check Persian marks, RTL order, Danish wrapping, settings bounds, and feedback legibility.
- Record every difference as a finding, graded with the quality bar's severity table. Regenerate only
  after a deliberate fix, then re-review the affected states.

## Evidence

Each reviewer records name, role, date, the commit or build identifier, and every width and scheme
they inspected. The signed matrix belongs in the release packet described by the quality bar.

Pixel equality protects an approved decision from regression; it cannot judge whether the original
decision was good.

# Visual baseline review protocol

Status: 210 deterministic baseline candidates generated; no human approval recorded.

The baselines in `e2e/visual.spec.ts-snapshots/` cover 15 representative states at 320, 390, 768,
1024, 1440, 1920, and 2560 CSS pixels in light and dark schemes. `npm run e2e:run --
e2e/visual.spec.ts --project=chromium` compares every image. Updating snapshots records a new
candidate; it never constitutes approval.

States: home, six-step orientation, alphabet index at top and scrolled, letter detail, active/wrong/
correct exercise, puzzle, typing active and feedback, named settings, connected reading, sticker
celebration, and review-session summary.

## Required reviewers

1. Responsive art director: hierarchy, balance, notebook identity, bounded desktop composition, and
   intentional ultrawide whitespace.
2. Danish learner representative: primary action clarity, one-handed phone reach, recovery, and
   orientation when switching between phone and desktop.
3. Accessibility reviewer: reflow, visible/focused controls, contrast/state cues, text/mark clipping,
   sticky-region occlusion, and reading order implications.

Each reviewer records name, role/qualification, date, commit/build identifier, every inspected width
and scheme, finding severity, and signature. Approval requires no open critical/high finding and no
medium finding without the five-person written exception required by the responsive specification.

## Review procedure

- Inspect every baseline at native pixel size, not only a contact sheet.
- Compare adjacent widths for unexplained jumps and 1024/1440/1920 for deliberate desktop use.
- For phone states, confirm primary content and the next action are discoverable without a hidden
  control beneath the sticky footer; then reproduce high-risk states on a real 360–390px device.
- Check Persian marks, RTL order, Danish wrapping, target separation, settings bounds, and feedback.
- Record changes as findings; regenerate only after a deliberate fix, then re-review affected states.

The signed matrix belongs in the release packet. Pixel equality protects an approved decision from
regression; it cannot judge whether the original decision was good.

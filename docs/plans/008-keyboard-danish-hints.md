# Plan 008 — Danish Sound Hints on the Keyboard Keys

Executor: Sonnet (mechanical — the language table is dictated below). Depends on: 005 merged (it is).
Requested by Babak 2026-08-04: every Persian key shows its Danish letter correspondence, small, orange.

## Questions
(none yet — add here and stop if blocked)

## Goal

Each letter key on the Persian keyboard shows, under the ink glyph, a small orange Latin hint —
the Danish letter(s) the Persian letter corresponds to. Homophone groups deliberately repeat the
same hint (ث س ص all show "s"): the repetition is itself the lesson.

## Art direction (dictated)

- New token `--orange` in `src/styles/tokens.css`, both schemes, added to the SEMANTIC_TOKENS
  assertion and the ART-DIRECTION palette table (role: "Latin sound hints — the pencil orange").
  Light: `#B4530A` on `--paper` (must measure ≥4.5:1 — verify, adjust darker if needed).
  Dark: `#F2A25C` on `--paper-dark` (same check).
- Hint style: Andika, small (~0.7rem), `--orange`, centered under the glyph inside the key cap;
  the glyph shifts up slightly. Keys stay ≥44×44px, no overflow at 360px, both schemes.
- The hint is visual teaching aid only: `aria-hidden="true"` (the key's accessible name stays the
  Danish letter name from alphabet data — no double announcement).
- Space/ZWNJ/backspace keys keep their existing captions — no orange hints there.

## The hint table (dictated by Fable — builder must not change it silently; the critic's teacher
persona may propose corrections, logged)

| | | | | | | | |
|---|---|---|---|---|---|---|---|
| آ å | ا a | ب b | پ p | ت t | ث s | ج dj | چ tj |
| ح h | خ kh | د d | ذ z | ر r | ز z | ژ zj | س s |
| ش sj | ص s | ض z | ط t | ظ z | ع ’ | غ gh | ف f |
| ق gh | ک k | گ g | ل l | م m | ن n | و v | ه h |
| ی j | | | | | | | |

## Steps

1. Data: `latinHint: string` added to the `Letter` type and every row of `src/lessons/alphabet.ts`
   per the table (آ's hint lives with the alef-madde specimen the keyboard already sources).
   Test: all 33 keyboard letters have a non-empty hint; homophone groups share identical hints
   (derive the groups from `sound.ipa` equality and assert hint equality across each group).
2. Keyboard: `PersianKeyboard.tsx` renders the hint span (aria-hidden, class `keyboard__hint`)
   inside each letter key; CSS per the art direction. Layout re-verified headless at 360px both
   schemes: keys ≥44×44px, glyph + hint both fully visible, no overflow, no key height change
   that breaks the dock visibility numbers from plan 005 round 2.
3. Contrast: measure both `--orange` values against their paper tokens (the tokens test pattern);
   adjust within the same hue if below 4.5:1 and record the final values in ART-DIRECTION.
4. The letter screens' forms row does NOT change (hints are a keyboard affordance, not lesson
   content — the lesson already teaches sounds with lydskrift + IPA).
5. **Favicon (added by Babak 2026-08-04): the app needs one.** Copy `website/favicon.svg` to
   `public/favicon.svg` verbatim — the same mark, one identity for both surfaces — and link it from
   the app's `index.html`. Verify the built `dist/index.html` resolves the link under the app's base
   path (Vite copies `public/` to `dist/`), and trace `deploy-pages.yml`'s composed `_site`: the
   website's copy lands at `/favicon.svg` (site root), the app's copy at `/app/favicon.svg` (via
   `dist/`) — both served, both byte-identical to the source.

## Acceptance

- [x] Every letter key shows its dictated hint in orange under the glyph; table verbatim
- [x] Homophone-group hint equality asserted from IPA data; guard/tests green
- [x] `--orange` tokenized both schemes, ≥4.5:1 on its paper, in SEMANTIC_TOKENS + ART-DIRECTION
- [x] Keys ≥44×44px at 360px, no overflow, both schemes; plan-005 dock visibility numbers still
      hold (re-run the (a)-(d) probes at 360×640)
- [x] aria: hints hidden; key accessible names unchanged
- [x] `npm run verify` + CI green; zero new deps; 200-line cap; no color literals outside tokens
- [ ] Focused critic (teacher + learner + maintainer) finds no concrete defect

### Step 5 acceptance (favicon)

- [x] `public/favicon.svg` is byte-identical to `website/favicon.svg` — one mark, copied, not redrawn
- [x] The app's `index.html` links it; the built `dist/index.html` resolves that link under the
      app's base path (verified by inspecting the actual build output, not just the source)
- [x] Deploy composition traced through `.github/workflows/deploy-pages.yml`: the published `_site`
      serves the website's favicon at `/favicon.svg` and the app's at `/app/favicon.svg`, both
      present and byte-identical

## Deviations

Where the build does not do what this plan wrote, and why.

1. **The favicon `<link>` in `index.html` reads `href="/favicon.svg"`, not the literal
   `/Danish-Persian-Lessons/app/favicon.svg` step 5 names.** CLAUDE.md: "Danish-Persian-Lessons" is a
   working title — never hardcode it outside `vite.config.ts` and the workflows. Vite already
   rewrites a root-relative `<link href>` under `base` at build time — verified by inspecting the
   built output: `dist/index.html` carries the exact literal `href="/Danish-Persian-Lessons/app/favicon.svg"`
   step 5 asks for. Same shipped result, with no second hardcoded copy of the project name.
2. **Both `--orange` values are kept exactly as dictated — no adjustment.** Measured (WCAG
   relative-luminance formula): light `#B4530A` on `--paper` = 4.503:1; dark `#F2A25C` on
   `--paper-dark` = 8.245:1. Both clear the 4.5:1 floor step 3 sets, so neither needed the "adjust
   darker if needed" escape hatch that step 3 and the art direction both grant. Flagged, not
   changed: the light value's margin is slim (0.003 above the floor) — worth a glance if `--paper`'s
   own hex ever moves, but not a defect today.
3. **The keyboard Latin hint tests live in a new file, `src/lessons/alphabet.hints.test.ts`, rather
   than inside `alphabet.test.ts`.** Appending them in place would have pushed `alphabet.test.ts` to
   210 lines, over the 200-line cap (CLAUDE.md). Splitting by concern — the alphabet's shape versus
   the keyboard's hint table — keeps both files under it and each focused on one thing.

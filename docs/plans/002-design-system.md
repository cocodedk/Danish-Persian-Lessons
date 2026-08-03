# Plan 002 — Design System Components (the notebook kit)

Executor: Opus (UI unit). Depends on: 001 merged (it is). Source of truth: `docs/design/ART-DIRECTION.md`.
Invoke `frontend-design:frontend-design` before building, then follow ART-DIRECTION exactly.

## Questions
(none yet — add here and stop if blocked)

## Goal

The notebook-page component kit every lesson will build on — including the signature element the
critic confirmed is still missing: the ruled notebook sheet. Reviewable at a `#/kit` gallery route.

## Steps

1. **`RuledSection`** — the signature: repeating light-blue ruling (CSS gradient lines on the
   line-height rhythm, `--rule` token) + ONE red margin line on the inline-start edge, on `--paper`.
   Built with logical properties so `dir="rtl"` mirrors the margin line to the right automatically.
2. **`Button`** — pen-blue (`--blue`), min 44×44, visible 2px focus ring per the a11y floor;
   variants: primary (filled) and quiet (text). Labels say what happens ("Gem", "Åbn appen").
3. **`VowelChip`** — a teaching specimen chip: Naskh glyph with the vowel mark in `--red`, optional
   caption line (dansk lydskrift + IPA from data). Used by plan 003's vowel row.
4. **`ProgressTick`** — the teacher's red checkmark for the margin; granted with a short stamp-in
   (<1.5s, celebration class per ART-DIRECTION Motion); instant under reduced motion — but always
   granted.
5. **`RuleDivider`** — extract the specimen divider from SplitCard; SplitCard refactors to consume
   it with ZERO visual change.
6. **Typography components** — `FaSpecimen` (Naskh, clamp scale, line-height ≥2, renders
   `faMarked ?? fa`, madde/mark accents in `--red`), `PronLine` (`lang="da" dir="ltr"`,
   `{da} · [{ipa}]`), `DaWord` (Andika). SplitCard becomes a thin composition of these.
7. **Kit gallery** at `#/kit`: every component in light + dark, LTR + RTL samples side by side —
   the visual review surface for critics and for Babak. Not linked from home; direct URL only.
8. **Andika subsetting** (perf flag from critic round 1): subset both Andika woff2 to the glyphs
   the UI and lydskrift need (Latin + æøåÆØÅ + IPA ɒ ː æ + ·) with python3 fontTools
   (`pyftsubset`), target < 60 KB each (from ~247 KB). Build-time only — no new npm dependency;
   if fontTools is unavailable, write a Question and skip this step rather than adding a dep.
   Verify all currently-rendered glyphs survive (the app renders, no tofu, tests green).
9. **Tests**: components render in both schemes; RuledSection margin side flips under `dir="rtl"`;
   ProgressTick grants under reduced motion; PronLine carries `lang="da" dir="ltr"`; existing
   28 tests stay green; the SplitCard refactor changes no test expectations.

## Acceptance

- [x] `#/kit` shows all components, light + dark, LTR + RTL; 360px clean; margin line sits right
      in the RTL sample and left in LTR — visibly
- [x] SplitCard is visually unchanged after the refactor (screenshot comparison at 360px)
- [x] The ruled sheet renders on the ruling rhythm with exactly one red margin line, tokens only
- [x] Both Andika woff2 < 60 KB, all used glyphs present (åb · [ɒːb] renders without tofu)
- [x] `npm run verify` + CI green; zero new dependencies; 200-line file cap held
- [ ] Critic personas find no concrete defect at the gallery

## Outcome (build pass 1)

Durable decisions worth keeping:

- **Scheme scopes.** `tokens.css` now declares the palette once as `--*-light` / `--*-dark` and
  binds it three ways: `:root` (light), the `prefers-color-scheme: dark` media query, and the
  `.scheme-light` / `.scheme-dark` classes. The classes are what let `#/kit` put both schemes on
  one page; nothing else changed for consumers, who still read `var(--paper)` and friends.
- **The red pen is a gradient, not an element.** A vowel mark cannot be wrapped in its own span
  without breaking Arabic shaping, so `src/styles/pen.css` clips a hard-edged gradient to the text
  (`.pen-mark--above` / `--below`, cut at `--pen-cut`, default `--madde-cut`). `FaSpecimen` and
  `VowelChip` share it; `markSide.ts` reads the side off the glyph, so lesson data carries only
  the letter.
- **The ruling rhythm.** `--rule-step` (2.25rem) is both the rule pitch and the line-height on the
  sheet; `--rule-shift` (1.625rem) drops the rule onto the text baseline — measured at 360px, not
  guessed. The single margin line is `::before` at `inset-inline-start`, so RTL mirrors it for free.
- **Script knowledge sits in `src/lessons/`.** `marks.ts` (which side of the line a vowel mark is
  written on) is a peer of `textRules.ts`, not a component helper — plans 003/005/006 need the
  same table for the alphabet, the keyboard and the name spelling. The presentation half, the
  class name, stays in `src/components/penMark.ts`.
- **CSS guards in tests.** jsdom computes no layout, so the rules that carry design decisions
  (logical margin line, 44px tap target, reduced-motion fallback, celebration under 1.5s) are
  asserted by reading the CSS source via `?raw`. That needed `test.css.include = [/\?raw/]` in
  `vite.config.ts`; ordinary CSS imports stay stubbed. `src/styles/tokens.test.ts` also enforces
  gate item 7 — no colour or font-family literal in any stylesheet but `tokens.css`/`fonts.css`.
- **Font subsetting is authoring-time.** `python3 scripts/subset-fonts.py` rewrites the two Andika
  woff2 in place (247 KB → ~43.8 KB each, 674 glyphs) and refuses to write a font that lost a
  required glyph or broke the 60 KB budget. It is idempotent, runs on no npm dependency, and
  nothing in the build or CI calls it. `scripts/verify.sh` now guards the shipped sizes instead.
  Full originals: `git show 3e16152:public/fonts/`.
- **Zero-visual-change proof.** The home screen at 360×800 was captured before the refactor and
  after refactor + subsetting, light and dark, in headless Chrome: 0 differing pixels in both
  schemes. That covers both the SplitCard refactor and the "no tofu" check for `åb · [ɒːb]`.
- **Not linked from home.** `#/kit` is a route only; `Kit.test.tsx` asserts the forside has no
  link to it.

## Follow-ups this plan deliberately did not take (for Fable to schedule)

1. **Three button styles ship at once.** `NameCapture.css` and `SettingsCorner.css` still carry
   their own button and divider rules, and NameCapture renders the very labels the new `Button`
   demos ("Gem", "Spring over"). Migrating them is not cosmetic-free: the current submit button
   has no border and the skip button is an outlined grey box, where `Button` gives a 1px blue
   border and a quiet underlined text button. That is a visible change to a screen plan 001
   shipped, so it needs its own plan and its own visual review. Same for `.name-capture__rule`,
   which is byte-identical to `RuleDivider`.
2. **The Persian faces are not subsetted.** Measured with the same pipeline and a Persian range:
   Vazirmatn-Regular 50.7 → 24.2 KB, Vazirmatn-Bold 51.0 → 24.7 KB, NotoNaskhArabic-Bold
   53.0 → 24.6 KB. On top of that, `Vazirmatn-Bold` is never actually requested — no rule pairs
   `--font-fa` with weight 700 (bold Persian always switches to `--font-naskh`) — so ~51 KB is
   deployed dead weight today. Step 8 says "both Andika woff2", and Arabic-script subsetting
   needs its own shaping/ZWNJ verification, so it is left for a follow-up.
3. **`#/kit` is statically imported**: +6.1 KB raw / +1.6 KB gzip in every learner's bundle,
   ~2% of the payload. A one-line `React.lazy` removes it; judged not worth the `Suspense`
   boilerplate for a review-only route, but it is a one-liner whenever the payload matters.
4. **`VowelChip` takes `{ glyph, caption }`, not `VowelMark`** — it has no slot for the mark's
   name (زبر/زیر/پیش), which the curriculum teaches by name. Plan 003 owns the vowel row and
   should widen the props then rather than have 002 guess the shape.
5. **The red pen paints one side per string.** A word marked both above and below renders only
   the above marks in red. A second cut below the baseline cannot tell a زیر from the dot under
   a ب, so this is a limit of the technique, not of the code; it is documented in `marks.ts`.

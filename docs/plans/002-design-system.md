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

- [ ] `#/kit` shows all components, light + dark, LTR + RTL; 360px clean; margin line sits right
      in the RTL sample and left in LTR — visibly
- [ ] SplitCard is visually unchanged after the refactor (screenshot comparison at 360px)
- [ ] The ruled sheet renders on the ruling rhythm with exactly one red margin line, tokens only
- [ ] Both Andika woff2 < 60 KB, all used glyphs present (åb · [ɒːb] renders without tofu)
- [ ] `npm run verify` + CI green; zero new dependencies; 200-line file cap held
- [ ] Critic personas find no concrete defect at the gallery

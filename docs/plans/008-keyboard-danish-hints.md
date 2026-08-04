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

## Acceptance

- [ ] Every letter key shows its dictated hint in orange under the glyph; table verbatim
- [ ] Homophone-group hint equality asserted from IPA data; guard/tests green
- [ ] `--orange` tokenized both schemes, ≥4.5:1 on its paper, in SEMANTIC_TOKENS + ART-DIRECTION
- [ ] Keys ≥44×44px at 360px, no overflow, both schemes; plan-005 dock visibility numbers still
      hold (re-run the (a)-(d) probes at 360×640)
- [ ] aria: hints hidden; key accessible names unchanged
- [ ] `npm run verify` + CI green; zero new deps; 200-line cap; no color literals outside tokens
- [ ] Focused critic (teacher + learner + maintainer) finds no concrete defect

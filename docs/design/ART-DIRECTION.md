# Art Direction — Danish-Persian Lessons

Authority: Fable (art director). Executors implement this verbatim; propose changes as questions in the
relevant plan file, never by silently diverging. Applies to the landing site, the React app, favicons,
OG images, and every future visual artifact.

## Concept: «دفتر مشق» — the exercise notebook

Every Iranian learned to read from the same object: the first-grade primer (آب، بابا) and a ruled
exercise notebook (دفتر مشق) — matte paper, black Naskh, **vowel marks in the teacher's red pen**,
light-blue ruling with a single red margin line. Danish design contributes the restraint: air, function,
nothing decorative. The interface is a notebook page, not a "web app with Persian content".

**Signature element:** authentic notebook ruling — light-blue horizontal rules + one red margin line —
as the structural system. The margin line sits LEFT on LTR pages and **RIGHT on RTL pages** (real
Persian notebooks mirror it). Red is never decoration: it marks exactly what a teacher's pen would mark
(vowel signs, corrections, the active item).

## Palette

| Token | Light | Dark ("chalkboard") | Role |
|---|---|---|---|
| `--paper` | `#F7F2E9` | `#161D1A` | page background |
| `--ink` | `#26211B` | `#E9E5DB` | text, letterforms |
| `--red` | `#C9202C` | `#E56A64` | vowel marks, madde, margin line, active/correction accents |
| `--blue` | `#2456A6` | `#8FB3EA` | links, buttons, interactive (BIC-pen blue) |
| `--rule` | `#C7D3E2` | `#3E5248` | notebook ruling, hairlines |
| `--card` | `#EFE8DA` | `#1D2622` | cards, wells |
| `--orange` | `#A94D09` | `#F2A25C` | Latin sound hints — the pencil orange |

Dark mode is the chalkboard: green-tinted near-black, chalk-warm text. Both schemes ship from day one
(`prefers-color-scheme`). No gradients. No drop shadows except a 1px paper-edge on raised cards.

## Typography

| Role | Face | Weights | Why |
|---|---|---|---|
| Persian display (word specimens) | **Noto Naskh Arabic** | 700 | schoolbook Naskh; best-in-class diacritic placement |
| Persian UI/body | **Vazirmatn** | 400 / 700 | the modern Persian web face |
| Latin (Danish + English) | **Andika** | 400 / 700 | SIL literacy face — designed for people learning to read; that IS this product |

- Landing: Google Fonts (preconnect + `display=swap`). App (plan 001+): self-hosted woff2 in the repo.
- Persian specimens: huge — `clamp(4.5rem, 20vw, 9rem)`, `line-height: 2` minimum (diacritics need air).
- Persian body minimum 1.125rem; Latin body minimum 1rem (16px). Never letter-space Persian script.
- Type IS the hero. The product's split-screen contract doubles as the brand: Persian word above,
  Danish word below, separated by one notebook rule.

## The specimen (hero + app card contract)

```
┌──────────────────────────────┐
│            آب                │  ← Persian, Naskh, ink; diacritics/madde in --red
│  ・aَ ・eِ ・oُ  (vowel chips)  │  ← red marks; the "these unlock reading" teaser
├──── notebook rule ───────────┤
│           vand               │  ← Danish, Andika, --ink, calm and smaller
└──────────────────────────────┘
```

Persian pane gets ~55% of the vertical split (diacritic headroom), Danish ~45%.

**Pronunciation line:** directly under the Persian word, inside the Persian pane — small Andika,
`--ink` at ~75%: dansk lydskrift first, IPA in brackets — `åb · [ɒːb]`. Never in the Danish pane
(meaning stays clean there). Both values come from lesson data, never improvised.

## Motion

Two kinds of motion only:
1. **Teaching motion** — vowel marks "ink in" on specimens; letter stroke-order draws (SVG path
   draw: the pen moves right-to-left, dots land last). This motion explains; it is content.
2. **Celebration motion** (the sanctioned exception to restraint) — sticker stamps thunk in,
   ink-dot confetti in `--red`/`--blue` on paper, a notebook page-flip on level-up. Short (<1.5s),
   joyful, never blocking, never punishing.

Everything else static. Under `prefers-reduced-motion`: teaching motion falls back to numbered
static step diagrams; celebrations still HAPPEN (a reward is never skipped) but appear instantly
without animation. No scroll-jacking, no parallax, no hover lifts beyond color.

## Celebration & sound

Rewards look like Iranian school praise, not casino UI: the آفرین stamp, the ۲۰/۲۰ mark, the gold
star (ستارهٔ طلایی), red margin ticks, and levels as filled notebook pages. Generosity is policy
(plan 007): nothing is ever taken away, streaks rest — never reset, wrong answers get a gentle
«دوباره» / "prøv igen", points only go up, and a reward may itself be a gift exercise.
Jingles are WebAudio-synthesized (no audio files, no dependencies) — a light santur-ish pluck for
ticks, a warmer chime for stickers, a short fanfare for level-ups. Sound plays only after a user
gesture, has its own mute toggle persisted in `dpl.v1.settings`, and is independent of the motion
preference.

## Copy voice

- Danish: du-form, warm, plain verbs, no sales tone. "Alt gemmes kun på din telefon." not
  "Revolutionerende privatlivsvenlig teknologi."
- Persian: natural modern register, native — never translated-sounding. Persian code points only
  (ک ی), Persian digits ۰–۹, ZWNJ (نیم‌فاصله) where grammar requires.
- English: plain, specific, no "seamless/robust/delve".
- Buttons say what happens: "Åbn appen", "Se koden på GitHub" — never "Learn more".
- Full diacritics (اِعراب) appear on TEACHING specimens only, never on UI chrome or body Persian.

## Accessibility floor (non-negotiable)

Tap targets ≥ 44×44px · body ≥ 16px · visible keyboard focus (2px `--blue` outline, 2px offset) ·
WCAG AA contrast in both schemes · `lang`/`dir` correct per element · no horizontal scroll at
360/390/768/1280px · reduced motion respected.

## Favicon & OG

- Favicon: `آ` (alef-madde) in ink Naskh on `--paper` rounded square (rx=6), madde stroke in `--red`.
  One glyph — must read at 16px.
- OG (1200×630): the specimen itself. Paper field, blue rules, red margin line at left, giant «آب»
  ink Naskh with red madde, rule, "vand" in Andika, small caption "Learn to read Persian, in Danish",
  attribution strip bottom: "Babak Bandpey · cocode.dk". Type-driven; no illustration, no screenshot.

## App-specific tokens (for plan 001+)

- Split screen: Persian pane top `55dvh`-ish, Danish bottom; the divider is the notebook rule.
- Navigation lives in the bottom thumb zone. Cards advance by tap/swipe; progress = small red
  checkmarks in the margin (like a teacher marking مشق).
- SVG only for letterform/stroke illustrations (ink on paper, red for the taught mark);
  three.js only if a lesson genuinely needs 3D, lazy-loaded.

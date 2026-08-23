# Art Direction — Danish-Persian Lessons

Authority: Fable (art director). This file owns exactly five aspects:

1. the notebook visual metaphor,
2. component styling semantics,
3. the teaching-mark and control color roles,
4. card treatment, and
5. the permitted motion categories.

It applies to the landing site, the React app, favicons, OG images, and every future visual artifact.
Every other aspect has its own authoritative source, listed in
[`docs/specs/README.md`](../specs/README.md). This file does not override those sources and does not
claim general precedence over plans or specifications; where it and an owner document both touch an
aspect, the owner document decides the exact values and this file states only the visual intent.
Propose changes as questions in the relevant plan file, never by silently diverging.

## Concept: «دفتر مشق» — the exercise notebook

Every Iranian learned to read from the same object: the first-grade primer (آب، بابا) and a ruled
exercise notebook (دفتر مشق) — matte paper, black Naskh, **vowel marks in the teacher's red pen**,
light-blue ruling with a single red margin line. Danish design contributes the restraint: air, function,
nothing decorative. The interface is a notebook page, not a "web app with Persian content".

**Signature element:** authentic notebook ruling — light-blue horizontal rules + one red margin line —
as the structural system. The margin line sits LEFT on LTR pages and **RIGHT on RTL pages** (real
Persian notebooks mirror it). Red is never decoration: it marks exactly what a teacher's pen would mark
(vowel signs, corrections, the active item).

## Color roles

The palette is semantic. Components use these tokens, never local color literals.

| Token | Role |
|---|---|
| `--paper` | page background — the notebook sheet |
| `--ink` | text and letterforms |
| `--red` | the teacher's pen: vowel marks, madde, margin line, corrections, the active item |
| `--blue` | links, buttons, focus, interactive surfaces (the BIC-pen blue) |
| `--rule` | notebook ruling and hairlines |
| `--card` | cards and wells |
| `--orange` | Latin sound hints — the pencil orange |
| `--gold` | the gold-star sticker («ستارهٔ طلایی») only |

The exact values for every scheme live in [`src/styles/tokens.css`](../../src/styles/tokens.css);
consult that file rather than any copy of the values here.

Light mode is warm notebook paper. Dark mode is **deep berry paper** — recognizably pink/berry rather
than a generic dark theme — with the pink pen carrying the teaching marks and a cyan secondary pen
keeping links and focus distinct from rewards and corrections. The learner can choose light, dark, or
the phone/PC setting.

## Card treatment

Cards are individual learning objects, not decorative containers for whole sections. Flat matte
surface on paper, delineated by the ruling rather than by depth. No gradients. No drop shadows except
a hairline paper-edge on a raised card. No hover lifts beyond color.

## Typography presentation

The semantic face roles and the permitted-weight policy are owned by
[`DESIGN.md`](../../DESIGN.md); the exact font files and numeric weights that ship are owned by
[`src/styles/fonts.css`](../../src/styles/fonts.css). This file governs only how type is presented:

- Type IS the hero. The product's split contract doubles as the brand: Persian word above, Danish word
  below, separated by one notebook rule.
- Persian specimens are huge and generously leaded — diacritics need vertical air, and a specimen that
  crowds its اِعراب has failed regardless of the numbers.
- Persian display uses the schoolbook Naskh voice; Latin uses the literacy face, which is the point of
  a product about learning to read.
- Persian script correctness, including letter-spacing, is owned by
  [`docs/specs/AAA-LEARNING-SPEC.md`](../specs/AAA-LEARNING-SPEC.md); how type reflows across viewports
  is owned by [`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md).

## The specimen (hero + app card contract)

```
┌──────────────────────────────┐
│            آب                │  ← Persian, Naskh, ink; diacritics/madde in --red
│  ・aَ ・eِ ・oُ  (vowel chips)  │  ← red marks; the "these unlock reading" teaser
├──── notebook rule ───────────┤
│           vand               │  ← Danish, Latin literacy face, --ink, calmer
└──────────────────────────────┘
```

The Persian pane dominates the vertical split for diacritic headroom; the Danish pane stays calmer and
smaller. The exact split geometry is owned by
[`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md).

**Pronunciation line:** directly under the Persian word, inside the Persian pane — small Latin type in
muted `--ink`: dansk lydskrift first, IPA in brackets — `åb · [ɒːb]`. Never in the Danish pane (meaning
stays clean there). Both values come from lesson data, never improvised.

## Beginner teaching surfaces

Plan 010 extends the specimen into four shared surfaces. The full teaching card always reads Persian
→ dansk lydskrift and IPA → Danish meaning or explanation. A compact phrase row keeps the same order
for complete UI phrases. A challenge reveal uses the full card after every attempt. A learner name uses
a separate companion: Persian spelling, original Latin name, then letter-by-letter help; it never shows
a made-up whole-name IPA.

Dense alphabets, vocabulary grids, letter banks, and keyboards stay compact. Selecting or tapping an
item also updates one persistent master-detail strip close to the controls. The strip contains Persian,
both pronunciation forms, Danish help, and—for lesson grids—the action that opens the full teaching
screen. Positional forms reuse the parent letter companion. The strip may stick within the viewport,
but it must not obscure the keyboard or bottom thumb bar.

The generated boards in `docs/design/previews/010-beginner-content-board.png` and
`docs/design/previews/011-simple-puzzles-board.png` are layout references only. Catalog data is the
authority for exact Persian, Danish, and IPA.

## Motion

Two kinds of motion only:

1. **Teaching motion** — vowel marks "ink in" on specimens; letter stroke-order draws (SVG path
   draw: the pen moves right-to-left, dots land last). This motion explains; it is content.
2. **Celebration motion** (the sanctioned exception to restraint) — sticker stamps thunk in,
   ink-dot confetti in `--red`/`--blue` on paper, a notebook page-flip on level-up. Brief, joyful,
   never blocking, never punishing.

Everything else is static. No scroll-jacking, no parallax, no hover lifts beyond color. Under reduced
motion, teaching motion falls back to numbered static step diagrams and celebrations still HAPPEN — a
reward is never skipped — but appear without animation. Durations and the exact reduced-motion
behaviour are owned by
[`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](../specs/AAA-UX-ACCESSIBILITY-SPEC.md).

## Celebration & sound

Rewards look like Iranian school praise, not casino UI: the آفرین stamp, the ۲۰/۲۰ mark, the gold
star (ستارهٔ طلایی), red margin ticks, and levels as filled notebook pages. Generosity is policy
(plan 007): nothing is ever taken away, streaks rest — never reset, and wrong answers get a gentle
«دوباره» plus an immediate complete teaching reveal. There is no red X or penalty; “Prøv én gang
til” is optional beside “Næste”. Points only go up, and a reward may itself be a gift exercise.
Jingles are WebAudio-synthesized (no audio files, no dependencies) — a light santur-ish pluck for
ticks, a warmer chime for stickers, a short fanfare for level-ups. Sound plays only after a user
gesture, has its own persisted mute toggle, and is independent of the motion preference. Praise lines
carry lydskrift + IPA like any teaching item (plan 009) — the pronunciation line sits between the
Persian praise and its Danish line, same as everywhere else in the app.

## Copy voice

- Danish: du-form, warm, plain verbs, no sales tone. "Alt gemmes kun på din telefon." not
  "Revolutionerende privatlivsvenlig teknologi."
- Persian: natural modern register, native — never translated-sounding. Persian code points only
  (ک ی), Persian digits ۰–۹, ZWNJ (نیم‌فاصله) where grammar requires.
- English: plain, specific, no "seamless/robust/delve".
- Buttons say what happens: "Åbn appen", "Se koden på GitHub" — never "Learn more".
- Full diacritics (اِعراب) appear on TEACHING specimens only, never on UI chrome or body Persian.

## Accessibility

Nothing here may weaken the accessibility floor: no information depends on color, sound, motion, or
images alone, and keyboard focus stays visibly drawn in the interactive pen colour. Target sizes,
contrast levels, focus geometry, and the tested display modes are owned by
[`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](../specs/AAA-UX-ACCESSIBILITY-SPEC.md); breakpoints, tested
viewport widths, and layout bounds are owned by
[`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md).

## Favicon & OG

- Favicon: `آ` (alef-madde) in ink Naskh on a `--paper` rounded square, madde stroke in `--red`.
  One glyph — it must still read at the smallest favicon size.
- OG: the specimen itself. Paper field, blue rules, red margin line at left, giant «آب» ink Naskh with
  red madde, rule, "vand" in the Latin literacy face, small caption "Learn to read Persian, in Danish",
  attribution strip bottom: "Babak Bandpey · cocode.dk". Type-driven; no illustration, no screenshot.

## Illustration and progress marks

- Progress reads as small red checkmarks in the margin, the way a teacher marks مشق.
- SVG only for letterform and stroke illustrations (ink on paper, red for the taught mark);
  three.js only if a lesson genuinely needs 3D, lazy-loaded.
- Navigation placement, hub composition, and their geometry are not owned here: see
  [`DESIGN.md`](../../DESIGN.md) and
  [`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](../specs/AAA-RESPONSIVE-DESIGN-SPEC.md).

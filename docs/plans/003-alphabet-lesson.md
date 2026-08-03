# Plan 003 — Lesson 1: Alphabet & Vowel Marks (stub — Fable will detail before execution)

Depends on: 002.

Scope preview:
- **Lesson 0 — orientation** (opens the alphabet lesson, short, warm, skippable): Persian is
  written RIGHT to LEFT — shown, not told: a familiar Danish word demoed mirrored so the learner
  feels the direction flip, a finger/arrow sweep animation, then the three other surprises for
  Latin readers: letters join, letters change shape by position, there are no capital letters,
  and dots are part of the letter.
- **Stroke-order drawings**: every letter gets an SVG "how it's drawn on paper" — animated path
  draw (pen moves right-to-left, dots last) plus a numbered static step diagram (which is also the
  reduced-motion fallback). Isolated forms animated in v1; positional forms as static specimens.
  The teacher-persona critic gates stroke-order correctness letter by letter.
- Data: all 32 letters — glyph, Persian name + Danish transliteration, four positional forms,
  `joinsLeft` (false for ا د ذ ر ز ژ و), Danish sound anchor + IPA per letter, stroke path data.
- Data: the six vowel signs with Danish anchors and IPA — زبر aَ (a i "kat", [æ]), زیر eِ (e i "let",
  [e]), پیش oُ (o i "foto", [o]), آ (å i "år", [ɒː]), او (u i "du", [uː]), ای (i i "vi", [iː]) —
  plus تشدید and سکون as "you'll meet these later" notes.
- UI: letter card (big glyph, forms row, red mark overlays on specimens), vowel-mark cards,
  "find the letter" / "match the form" recognition exercises, progress ticks to `dpl.v1.alphabet`.
- Pedagogy rule: marks always in `--red`; known letters ink, new letter highlighted like a primer.
- Name-letter badges: letters that occur in the learner's Persian name spelling get a red margin tick
  («این حرف در نامِ توست» / "Dette bogstav er i dit navn"). Renders only when `profile.faSpelling`
  exists — that field arrives with plan 006, so the badge stays dormant until then.

## Questions
(add here)

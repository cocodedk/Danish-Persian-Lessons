# Plan 005 — On-Screen Persian Keyboard & Typing Exercises

Executor: Opus (input logic + UI). Depends on: 003, 004, 006, 007 merged (they are). The final
roadmap unit. Invoke `karpathy-guidelines` first; `frontend-design:frontend-design` before the
keyboard's visual design.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner types Persian on an in-app keyboard — no OS keyboard dependency — through typing
exercises for the vocab units, ending with the capstone: typing their own name.

## Steps

1. **Keyboard component** `src/components/PersianKeyboard.tsx` (+ css): letters-only v1 — the 32
   letters + ZWNJ (نیم‌فاصله, labeled) + backspace. Simplified layout inspired by the standard
   Persian layout's letter placement, arranged in 3-4 rows that fit 360px with every key ≥44×44px
   in the bottom thumb zone. Key caps show the isolated glyph; `aria-label` = the letter's Danish
   name from alphabet data (single source). No shift layers, no digits, no punctuation in v1.
2. **Input buffer** `src/keyboard/buffer.ts` — pure, TDD-first: append letter / ZWNJ / backspace;
   renders through the browser's own shaping (no manual joining logic — the string IS the buffer);
   ZWNJ handling correct (backspace removes one code point incl. a lone ZWNJ; buffer never starts
   with ZWNJ; double-ZWNJ collapses). Tests for every rule.
3. **Typing exercise** `src/pages/TypeWordScreen.tsx`: prompt = the Danish word + pronunciation
   line (never the Persian answer); the learner types; live preview renders joined Naskh on the
   ruled sheet. Submit compares against `fa` (unmarked — اِعراب never required for typing):
   - correct → celebration through the reward engine (`item` on first completion of that word's
     typing, `answer` on repeats — the 004 pattern);
   - wrong → the diff rendered as teacher marks: correct letters ink, the first wrong/missing
     position marked in `--red`, with the gentle «دوباره» / "prøv igen" line. Nothing lost.
4. **Per-unit typing rounds**: each vocab unit gains a "Skriv ordene" round (~its 8 words, reusing
   unit progress storage under `dpl.v1.type.<unit>`; pay-once page on round completion).
5. **Capstone «نامِ خودت را بنویس» / "Skriv dit navn"**: when `profile.faSpelling` exists, a final
   typing exercise — type your own name; completion celebrates with the name in the praise
   («آفرین، سارا!» / "Flot, Sara!") and pays once (`dpl.v1.type.name`). Dormant without a name —
   no entry point, no nag (gate 8).
6. **Home**: typing rounds appear on the unit cards (or as a distinct card row) with progress;
   enterable anytime, no gating.
7. **Tests**: buffer rules (TDD); layout map — all 32 letters present exactly once, ZWNJ +
   backspace present, no duplicates; every key's aria-label resolves from alphabet data; diff
   logic (correct/wrong/missing/extra positions); pay-once with reloads; capstone dormancy without
   faSpelling and correctness with it; text-rule guard walks any new fa strings.

## Acceptance

- [ ] Keyboard fits 360px portrait with every key ≥44×44px, thumb-zone placed, both schemes,
      visible focus; no OS keyboard ever triggered (inputs are readonly/none — typing goes through
      the component only)
- [ ] Buffer: ZWNJ rules hold (tests); backspace exact; the preview shapes correctly (بابا joins,
      non-joiners honest)
- [ ] Typing exercise: prompt never reveals the answer; diff marks are teacher-red at the first
      divergence only; wrong answers gentle, nothing lost; correct pays per the 004 pattern
- [ ] Capstone: with faSpelling — present, celebrates by name, pays once (reload-proof); without —
      completely absent, no nag
- [ ] Unique-input check: submissions compare against `fa` with marks stripped from user-impossible
      input (the keyboard cannot type اِعراب — assert the compare normalizes)
- [ ] `npm run verify` + CI green; zero new deps; 200-line cap; Persian code points clean
- [ ] Critic personas (teacher / learner / maintainer) find no concrete defect

# Plan 006 — Your Name («نامِ تو» / Dit navn)

Executor: Opus (transliteration + pedagogy are the hard parts). Depends on: 003 (letter data).
The learner's name is a teaching instrument, not decoration — this plan is the motivation hook of
the whole app: the first thing you learn to read in Persian is yourself.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner's name (captured since 001) gets a correct, editable Persian spelling
(`profile.faSpelling`), and the name starts teaching: Persian greeting, name-letter badges in the
alphabet lesson, and a "write your name" mini-lesson.

## Steps

1. **Transliteration engine** `src/name/transliterate.ts` — pure, TDD first:
   - Input: Latin name (Danish alphabet incl. æ ø å). Output: ranked Persian-script suggestions.
   - Rule table for Danish phonetics (b→ب k→ک s→س r→ر t→ت n→ن m→م l→ل d→د g→گ h→ه f→ف p→پ
     v/w→و y/j→ی z→ز ch→چ sj/sh→ش; vowels favor LONG letters for readability: a→ا/آ(initial),
     i→ی, o/u→و, å→و, ø→و, æ→ا, final e→ه — e.g. Mette→مته, Søren→سورن, Sara→سارا, Anna→آنا).
   - **Override list beats rules**: common Iranian names in Latin spelling (Ali→علی, Reza→رضا,
     Maryam→مریم, Babak→بابک, Hassan→حسن, Fatemeh→فاطمه, Sara→سارا …ca. 40 names) and Danish top-50
     first names. Rules alone can never produce ع/ص/ط — that's what the list is for.
   - Every suggestion must pass the Persian text-rule guard (no Arabic ك/ي, no ASCII) and render
     with correct joining.
2. **Choose/edit flow**: after the engine, the learner picks a suggestion or adjusts letter by letter
   with a small letter bank (tap-to-place; the full keyboard is plan 005). Saved to
   `profile.faSpelling`. Editable/deletable from the same settings corner as the name.
3. **Greeting upgrade**: Persian pane now greets «سلام، سارا!» (Naskh, name in ink — no red; it's
   not a correction). Danish pane keeps "Hej Sara!".
4. **Name-letter badges** activate in the alphabet lesson (003 shipped them dormant): letters of
   `faSpelling` get the red margin tick «این حرف در نامِ توست» / "Dette bogstav er i dit navn".
5. **Mini-lesson «نامِ خود را بنویس» / "Skriv dit navn"** after the vowel-marks lesson:
   - The name appears assembled letter by letter, each letter shown in its positional form with a
     one-line why («ب at the start joins left: بـ …»  in Danish, du-form).
   - Exercise: re-assemble the name from a shuffled bank of its letters (+2 distractors), positional
     forms rendered live as letters join.
   - Completion praise, teacherly and warm, never gamified: «آفرین، سارا!» / "Flot, Sara!" with a red
     margin tick — progress to `dpl.v1.name-lesson`.
6. **Privacy line** in the settings corner, Danish + Persian: the name never leaves the device.

## Acceptance

- [ ] Golden tests: Babak→بابک, Sara→سارا, Mette→مته, Søren→سورن, Anna→آنا, Ali→علی (override),
      Lærke→ لرکه (rule-based best-effort) — plus: every suggestion passes the text-rule guard
- [ ] æ/ø/å inputs produce valid, joined Persian; nothing crashes on "X Æ A-12" style nonsense
- [ ] Skip path still pristine: no name → no badges, no mini-lesson entry, no nags, greeting «سلام!»
- [ ] Edit and delete flows work; deleting the name also clears `faSpelling` and hides the mini-lesson
- [ ] Persian pane never shows Latin; the chosen spelling renders identically in greeting, badges,
      and mini-lesson (single source of truth)
- [ ] Mini-lesson passes the three-persona review (teacher / learner / maintainer) with zero concrete defects
- [ ] `npm run verify` and CI green; no new dependencies

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

- [x] Golden tests: Babak→بابک, Sara→سارا, Mette→مته, Søren→سورن, Anna→آنا, Ali→علی (override),
      Lærke→ لرکه (rule-based best-effort) — plus: every suggestion passes the text-rule guard
- [x] æ/ø/å inputs produce valid, joined Persian; nothing crashes on "X Æ A-12" style nonsense
- [x] Skip path still pristine: no name → no badges, no mini-lesson entry, no nags, greeting «سلام!»
- [x] Edit and delete flows work; deleting the name also clears `faSpelling` and hides the mini-lesson
- [x] Persian pane never shows Latin; the chosen spelling renders identically in greeting, badges,
      and mini-lesson (single source of truth)
- [ ] Mini-lesson passes the three-persona review (teacher / learner / maintainer) with zero concrete
      defects — for the critic round; the builder cannot pass itself
- [x] `npm run verify` and CI green; no new dependencies

## Deviations

Where the build (PR #13) does not do what this plan wrote, and why. All accepted.

1. **The override list is much longer than "ca. 40".** It ships ~180 keys — Iranian names, Danish
   top-50, and several Latin spellings of one Persian name (Hussein/Hossein, Mohamed/Muhammad,
   Sarah/Sara). The list is the only thing that can spell ع ص ط ح, and it is now also the only
   thing that spells a name whose faithful transliteration reads badly, so it earns its length.
2. **Short vowels are ranked first, not long ones.** The plan says the rules should "favor LONG
   letters for readability", but its own golden table asks for Mette→مته and Babak→بابک, which are
   the short-vowel readings. The goldens won: rank 1 writes Persian the way Persian is written,
   rank 2 offers the every-vowel reading (Lærke→لارکه) for a learner who wants it.
3. **The mini-lesson is not placed "after the vowel-marks lesson".** Its card appears on the
   forside as soon as a spelling exists, gated on nothing else. Logged again as a fresh concern
   below.
4. **Completion goes through plan 007's reward engine**, which landed first: `cheer('page')` grants
   the tick, the points and the sticker, and only the praise line is swapped for «آفرین، سارا!».
   The plan predates the engine and describes the tick alone.
5. **Compound names are spelled part by part** and joined with one plain space — the plan never
   mentions them. A compound the list knows as one word (Alireza→علیرضا) is offered beside the two-
   word spelling, never instead of it.
6. **At most three suggestions.** The plan says "ranked suggestions" without a number; a fourth
   line is a fourth thing to compare, and the ranking is only trustworthy two or three deep.
7. **The letter bank is the whole 33-glyph alphabet**, not the "small letter bank" of step 2. A
   bank holding only the letters we guessed at cannot correct a guess that was wrong, which is the
   one thing that screen exists for. Accepted.

## Critic round 1 (2026-08-04) — FAIL, adjudicated

The learner- and teacher-persona passes failed on decency: the engine could hand a learner an
obscenity as their own name. Eleven findings, adjudicated and built by the round-2 fix builder,
one line each.

- **D1 «X Æ A-12» → «کس ا آ».** The sound table mapped x to کس, which is a crude word wherever a
  part starts on it. x is gone from the table entirely: a part carrying one now gets no rule
  spelling at all, and the x names that are real names (Alexander→الکساندر, Max→مکس, Alex→الکس)
  are on the override list, where the two letters sit safely inside the word.
- **D2 nothing read what the rules produced.** Ker→کیر, Kon→کون, Goz→گوز, Sg→سگ, Ge→گه were all
  reachable from a name field. `src/name/blocklist.ts` now reads every emitted suggestion part by
  part — prefix match for the words that stay the word whatever follows (کس کیر کون گوز شاش چس),
  whole-token match for the ones that are only crude alone (مرگ خر سگ گاو بز کر زر گه …). A part
  with nothing decent left takes the whole suggestion with it, and the screen's letter-bank path
  takes over. Never spaced letters: «ک س» is the same word with a gap in it.
- **D3 Kirsten → کیرستن**, from the override list itself. Now کرستن.
- **D4 Signe → سینه** — phonetically right (the g is silent) and a body part. Now سیگنه, with the
  g written.
- **D5 the list and the rules were offered side by side.** A learner typing Mohammad got محمد at
  rank 1 and rule-made near-misses under it, and could pick a misspelling of their own name off a
  list this app wrote. Where the override list knows a part, it is now the only spelling offered.
- **D6 Margrethe → مرگریته**, which opens on مرگ, «død». Now مارگرته, and the Latin alternates a
  family may write (Hussein, Mohamed/Muhammad, Sarah, Fateme/Fatima, Yasmine/Jasmin) map to the
  one Persian spelling each.
- **D7 the try-again line was not true.** Tapping one of the two strangers in the tray answered
  "Det bogstav kommer et andet sted i navnet", sending the learner hunting for a letter that is
  not in their name to find. The line now branches: «دوباره» for a letter waiting its turn, and
  «این حرف در نامِ تو نیست. دوباره نگاه کن.» / "Det bogstav er ikke i dit navn. Kig igen." for a
  stranger.
- **D8 the lesson paid a full page every time it was finished.** Replaying it was worth twenty
  points a turn. `celebrate` gained a `replay` kind — praise, tick, practice day, no payout — and
  the lesson asks for it whenever `dpl.v1.name-lesson` is already done, read from storage so a
  reload cannot pay for it twice either. The letter rule (`markLetterDone`) and the gift rule
  (`giftsOpened`), now for a lesson.
- **D9 a sign outside the alphabet was named after itself.** لوئیزه walked as «Bogstav 3: ئ står
  midt», printing the one shape the learner cannot read yet where its name belongs. Signs outside
  the taught 33 are now "særligt tegn" / «نشانهٔ ویژه» in the walkthrough and in every tile's
  aria-label.
- **D10 the walkthrough never said how a letter sounds** — gate 5, and the letters already carry
  lydskrift and IPA from plan 003. Every step now shows its `PronLine`, read off the letter data;
  a sign the alphabet does not teach shows none rather than an invented one.
- **D11 this plan logged neither its deviations nor a critic round.** Both sections written above.

Two fresh concerns were accepted as real and deferred by the planner — logged here, not built:

- **The name lesson is gated on nothing.** A learner can meet their own name before they have met
  a single letter it is made of; the card appears as soon as a spelling exists. Whether it should
  wait for the alphabet lesson is a curriculum decision, not a bug fix.
- **At 360px the assembly exercise sits below the fold**, under the whole letter-by-letter
  walkthrough. The exercise is the part that teaches by doing, and it is the part a thumb has to
  scroll for.

## Critic round 2 (2026-08-04) — FAIL, adjudicated

Round 1 was fixed string by string. The critic typed in the next string and it came back crude.
Everything below is the same class closed at the rule instead of at the instance.

- **مرگ was a whole-token entry, so only مرگ itself was caught.** Margrete → مرگریته, Margit →
  مرگت, Marga → مرگا: «død» first, at rank 1, in the app's own top suggestion. مرگ, کوس and چوس
  moved to `CRUDE_PREFIXES` — a name is not made decent by growing. What saves the Danish
  Margrethe is the ا she really carries (مارگرته), not the letters after the گ.
- **سینه was on no list at all.** Signe had been fixed to سیگنه and Sine had not, so every Sine in
  Denmark was still offered a body part. سینه is now a `CRUDE_WORDS` entry — whole-token, because
  سینا (Sina) is a man's name and must stay.
- **Kosar → کوسر, the worst catch: crude AND not the name.** کوثر is the name — the Quranic word,
  spelled with ث, which no sound rule can reach. On the override list now, with Kousar/Kowsar/
  Kawsar. The whole Margrethe family (Margrete, Margit, Marga, Marge, Margrit, Margaretha,
  Margarethe) is on the list too, spelled مارگ-.
- **The x-name gap the round-1 fix opened.** Dropping x from the sound table left Felix and Axel —
  both top-fifty Danish boys' names — with no suggestion at all, and Cyrus with none either
  (سیروس; by sound it opens on کیر). Now on the list: فلیکس, اکسل, الکساندرا, مکسین, زنیا, رکس,
  سیروس, رکسانا.
- **The two hint languages shared a line.** At 360px the Persian sentence and the Danish one
  wrapped into each other — RTL and LTR interleaved, with no way to see where one language stopped.
  `.name-assembly__again` is a column now; each sentence wraps inside its own block.
- **The guard was extended from letter-strings to names.** `src/name/nameCorpus.ts` carries ~290
  real Danish and Iranian first names, including every probe the critic typed; the sweep walks
  them beside the 25 000 short strings, and the three repros are asserted not to reproduce.
- **Two files over the 200-line cap** were split: `nameLesson.test.tsx` into the lesson and the
  assembly exercise, `permanence.test.ts` into the shape guarantees and the seeded fuzz, with the
  shared moves in a `*Harness` module each.

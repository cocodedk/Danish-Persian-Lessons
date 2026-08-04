# Plan 004 — Grade-1 Vocabulary Units

Executor: Opus (pedagogy + research + Persian/Danish copy). Depends on: 003, 006, 007 merged (they are).
Invoke `karpathy-guidelines` first; `frontend-design:frontend-design` before any new screen.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner reads real words: vocabulary units in Iranian first-grade primer order, each word a
SplitCard pair with full diacritics on the specimen and pronunciation twice, practiced through the
existing exercise machinery and celebrated through the reward engine.

## Word list proposal

> ⏳ **Awaiting Babak's native review — comment on the PR.** Every Persian string below, every
> اِعراب, every Danish gloss and every lydskrift is a proposal. Nothing here is settled until a
> native reader has been through it. Red-pen it freely; the data lives in one file
> (`src/lessons/vocab.ts`) and a word is a one-line change.

**Source of the order.** The Iranian first-grade book opens with ten wordless نگاره‌ها (picture
lessons) and only then starts the نشانه‌ها. Their sequence, as the textbook teaches them:

| درس | نشانه‌ها | primer words seen with them |
|---|---|---|
| ۱ | آ ا — بـ ب | آب، بابا، آبی، باد |
| ۲ | اَ ـَ — د | اَبر، باد، دریا |
| ۳ | مـ م — سـ س | مداد، میز، دست |
| ۴ | او و — تـ ت | دوست، توت، دست |
| ۵ | ر — نـ ن | مادر، ابر، باران، نان، نانوا |
| ۶ | ایـ یـ ی ای — ز | ایران، سبز، سرباز |
| ۷ | اِ ـِ — ـه ه — شـ ش | خانه، نَرده، چشم |
| ۸+ | یـ ی · اُ ـُ · کـ ک · و · پـ پ · گـ گ · فـ ف · خـ خ · قـ ق · لـ ل · جـ ج · هـ · چـ چ · ژ · صـ ص · ذ · عـ ع · ثـ ث · حـ ح · ضـ ض · ط · غـ غ · ظ | کتاب، گل، ماه، … |

**Correction (critic round 1, D9):** درس ۳'s row used to list کلاس too, but ک is this very
table's own ۸+ letter, and "Everything but کتاب…" below calls ک "a later نشانه" outright — a word
needing a letter two rows down cannot be a درس-۳ word. Struck rather than replaced with a guess.

### Unit ۱ — «آب و بابا» (De første ord)

آب · بابا · باد · آبی · نان · مادَر · مَن · تو · ما · او · این · آن

The pre-approved starter set in full, in primer order (nouns first, then the pronouns and the two
demonstratives), plus two research picks from درس ۱: **باد** and **آبی** — the primer's own next
two words after آب و بابا, and the first minimal pair a child reads (آب ← باد).

### Unit ۲ — «مدرسه» (I skolen)

مِداد · کِتاب · میز · دَر · دَست · دوست · مَدرِسه · سَلام

Everything but کتاب comes from درس ۳–۵ (م، س، او، ت، ر). کتاب is a later نشانه (ک) but it is the
one school word a reader wants first, and it is already in the app's own vocabulary. سلام is the
word the forside greets with, so it arrives with a face the learner knows.

### Unit ۳ — «خانه و آسمان» (Hjem og himmel)

خانه · باران · آسِمان · ماه · شَب · گُل · سَبز · زَرد

درس ۵–۷ plus گ and م-words the primer uses for the same pictures. آسمان is the reward for finishing
درس ۵: it needs nothing but آ س م ا ن.

### Honest exceptions

- **The 003 teaching order is not the primer order.** After آ ا ب د, `teachingOrder` in
  `src/lessons/alphabet.ts` continues in standard alphabet order, so gating words strictly by
  "letters taught so far" would leave nothing to read past باد. The units follow the *primer's*
  نشانه order instead, which is what plan 004's step 1 asks for. **Correction (critic round 1,
  D5):** unit 1 is not "letter-clean under the 003 order" as a whole — only three of its twelve
  words (آب، بابا، باد) use nothing past آ ا ب د; the other nine (آبی، نان، مادَر، مَن، تو، ما،
  او، این، آن) already reach for letters 003 has not taught yet (ی ن م ر ت و), the same reach
  every later unit needs. Unit 1 just starts needing it sooner, not never.
- **Most of unit ۱ carries no اِعراب at all, and that is correct.** آب، بابا، باد، آبی، نان، ما،
  تو، او، این، آن have no short vowels — every vowel in them is long and written (ا، و، ی). That is
  exactly why the primer opens on them. Marks appear where a short vowel exists: مادَر، مَن، مِداد،
  کِتاب، دَر، دَست، مَدرِسه، سَلام، آسِمان، شَب، گُل، سَبز، زَرد.
- **No ساکن.** The schoolbook convention marks short vowels only; دَست, not دَسْت.
- **تو is /to/, not /tu/.** Written تو with no mark, as in the book; the pronunciation line carries
  the truth (`to · [to]`).
- **Five lydskrift compromises Danish cannot avoid, not two (correction, critic round 1, D6).**
  `z` is read [s] by a Dane (ز, میز، سبز، زرد) and `kh` is read [k] (خانه) — Danish has neither
  sound, and both follow the sound anchors plan 003 already shipped. Three more exist that the
  original count missed: a Dane reads a **blødt d** after a vowel, not the hard stop Persian's د
  needs — `båd` for باد is also, unhelpfully, the actual Danish word for "boat"; a word-final
  **-h goes unpronounced** — `måh` for ماه is read [mɔː], dropping exactly the sound the ه is
  there for; and **-rd goes soft-to-silent** — `zard` for زرد lands closer to a Dane's own
  `hård`/`gård` than to [zæɾd]. The IPA beside every lydskrift is the precise value in all five
  cases; the lydskrift is the closest spelling, not a promise a Dane will produce the sound
  unprompted.
- **Names left out.** The primer's own children, سارا and دارا, are lovely first words but they are
  names, not vocabulary; plan 006 already teaches the learner their own name.

### Note on the red pen (durable decision)

The gradient cut in `src/styles/pen.css` colours everything above one horizontal line, and that line
was tuned for the مد of آ — which sits far higher than a زبر over a short letter. On مَدرِسه it left
the marks in ink; lowering it turned the top of every ا and ل red instead. No single cut can do both,
and it can only ever colour one side of the line, so a word marked above *and* below loses one mark.

A vocalized specimen is now drawn as two copies of the same word in one grid cell: `faMarked` in
`--red` underneath, `fa` in `--ink` on top. Diacritics carry no width, so the letterforms land
pixel-identically and only the marks show through — both sides of the line, on every word.
**Caveat (critic round 1):** "only" holds at reading size; at 4× zoom the ink layer's own
anti-aliasing softens its glyph edges over the red layer sitting beneath it, leaving a sub-pixel
warm fringe around every letterform. Invisible at 1×, costs nothing, not a bug to chase — just not
literally "only the marks," under a loupe. The ink layer keeps the old gradient, so آ still gets
its red مد. `FaSpecimen` falls back to the single-layer path whenever `faMarked` is not `fa` plus
marks (`withoutMarks(faMarked) === fa` is the test).

## Steps

1. **Research pass first** (WebSearch): the authentic فارسی اول دبستان word progression — which
   words the primer introduces and in what order (آب، بابا، باد، آبی، سار، …). Produce a proposed
   list of 3 units × ~8 words in `## Word list proposal` in THIS plan file, commit it in the PR —
   **Babak reviews the list natively on the PR before or after merge; mark it clearly as awaiting
   his red pen.** Words must only use letters by their unit's position in the 003 teaching order
   where feasible; note exceptions honestly.
2. **Data** `src/lessons/vocab.ts`: `WordCard { fa, faMarked, da, pron: { da, ipa } }` per word —
   faMarked carries full اِعراب for the specimen; pron per the house rule (dansk lydskrift + IPA,
   Tehrani). Units of ~8 as `Lesson { kind: 'vocab' }` entries in the registry. The starter set is
   pre-approved: آب/vand · بابا/far · نان/brød · مادر/mor · من/jeg · تو/du · ما/vi ·
   او/han eller hun · این/denne, dette · آن/den, det (der).
3. **Word screen**: SplitCard specimen (faMarked, marks red per ART-DIRECTION), pronunciation line,
   Danish below; margin ProgressTick when learned; name-letter overlap noted warmly when the word
   shares letters with the learner's name (reuse the badge copy pattern; dormant without faSpelling).
4. **Exercises per unit** (reuse 003 machinery — no new exercise types): word → pick the Danish
   (find-style); match pairs fa ↔ da; wrong answers stay gentle. Completions flow through the 007
   engine; unit completion = page event (pays once, like everything else).
5. **Home**: vocabulary units appear as lesson cards (Persian digits) with per-unit progress from
   `dpl.v1.vocab.<unit>`; locked-free — any unit is enterable anytime (no gating, generosity rule).
6. **Tests**: data integrity (every card has faMarked + pron; text-rule guard walks all fa fields —
   including faMarked with its diacritics); exercise generation per unit (unique-answer invariant
   holds across homophone pairs — از/آز style traps checked); progress persists; pay-once holds.

## Acceptance

- [x] Word list proposal committed in this plan file and flagged for Babak's native review
- [x] Starter-set words all present in unit 1 with correct faMarked diacritics (teacher persona
      checks هر اِعراب letter by letter) and natural Danish equivalents
- [x] Every card: pronunciation twice from data; specimen marks red, on specimens only
- [x] Unique-answer invariant test extended to vocab exercises and green
- [x] Units enterable in any order; progress + rewards flow; pay-once verified with reloads
- [x] 360px both schemes clean; RTL correct; no new deps; 200-line cap; `npm run verify` + CI green
- [ ] Critic personas (teacher / learner / maintainer) find no concrete defect

## Deviations

Where the build (PR #15) does not do what this plan wrote, and why. All accepted except the fifth.

1. **The card shape carries a field the plan never named: `id`.** Step 2 specifies
   `WordCard { fa, faMarked, da, pron: { da, ipa } }`; the shipped `VocabWord`
   (`src/lessons/vocab.ts`) also requires an ascii `id` — the route (`#/lesson/ord/:unit/:word`)
   and the progress store both need a stable, URL-safe key, and `fa` itself is neither.
2. **Unit ۱ holds twelve words, not "~8."** Step 2 undercounts its own "Word list proposal" above,
   which puts the whole pre-approved starter set plus two research picks in unit ۱ on purpose.
   Units ۲ and ۳ hold to eight; unit ۱ does not, and step 2 should have said so.
3. **The second round is not "match pairs."** Step 4 describes a pairs-matching exercise; `par`
   (`src/lessons/vocabExercises.ts`) is the same four-choice mechanic as `ord` with the prompt and
   choice languages swapped — the Danish meaning is asked, the Persian words are offered —
   reusing `ChoiceExercise` untouched. A real pairs-matching UI would have been the new exercise
   type the very same step's parenthetical rules out.
4. **The name-overlap note is new copy, not the reused badge string.** Step 3 says "reuse the
   badge copy pattern"; `WordScreen` instead adds `NAME_LETTER_IN_WORD_FA` /
   `NAME_LETTERS_IN_WORD_FA` (`src/content/faStrings.ts`), because a whole word sharing one letter
   or several needs its own grammar that the single-letter badge («این حرف در نامِ توست») does
   not carry. Same pattern, new copy.
5. **A correct answer inside the exercise round paid the `item` rate (2 points) every time**, not
   the `answer` rate (1 point) letters pay — `learnWord` returned `'item'` whenever the unit was
   not yet fully learned or not yet paid, including a repeat tap on a word already learned earlier
   in the very same replay, so a finished round replayed through its own exercise screen could
   farm double the letters' rate indefinitely. **Not accepted — corrected in critic round 1**
   (below): `learnWord` now returns `'answer'` for a word already learned before the call,
   `'item'`/`'page'` only for a genuinely new claim.
6. **آن shipped with the gloss "den, det (derovre)", not step 2's "den, det (der)."** آن points at
   something away from the speaker, and "derovre" (over there) says that; plain "der" (there) does
   not distinguish آن from این as sharply. The more specific Danish is the better choice — flagged
   here for Babak's native review alongside the rest of the word list, not quietly reverted.

## Critic round 1 (2026-08-04) — FAIL, adjudicated

The learner- and maintainer-persona passes both failed. The exercise screen quietly mis-rendered a
specimen the word screen gets right, a Danish choice could clip or overflow at 360px, and this
plan file itself was overdue the same honesty 006 needed at its own D11: a `## Deviations`
section, a critic round, and a couple of its own factual claims corrected. Nine findings plus
deviation 5's correction above, adjudicated and built by the round-2 fix builder (PR #15), one
line each:

- **D1 the exercise round rendered a vocalized prompt through `FaSpecimen`'s single `fa` prop,
  never wiring `faMarked`.** A word marked above and below (مَدرِسه) lost one mark inside the
  exercise even though the word screen showed both, because the single-gradient path can only
  ever colour one side of the line. `Question` gains `promptFaMarked`; `vocabExercises` now passes
  the plain/marked pair; `ChoiceExercise` passes both on to `FaSpecimen`, engaging the two-layer
  path it already has.
- **D2 no test ever rendered a vocab exercise specimen, so D1 shipped green.**
  `ChoiceExercise.test.tsx` now renders the exercise prompt for مَدرِسه (marked above and below —
  stacked, both marks present) and کِتاب (marked below only — still stacked, never the
  single-layer `pen-mark--*` class), so the fix has a test that would have caught it.
- **D3 the choice grid's `1fr` tracks had no `minmax(0, …)` floor.** A grid track's automatic
  minimum is its content's, so a long unbroken Danish gloss could push a column wider than its
  share instead of wrapping. Now `repeat(2, minmax(0, 1fr))`.
- **D4 every choice was set in Naskh at Persian-glyph size regardless of language.** A Danish
  phrase like «den, det (derovre)» rendered oversized, in the wrong typeface, fighting to fit a
  line it was never going to fit. `.choice-exercise__choice[lang='da']` now sets `--font-latin`,
  `clamp(1.125rem, 4vw, 1.375rem)`, and normal wrapping; the 44px tap-target minimum is untouched.
- **D5 the plan claimed unit ۱ was "letter-clean under the 003 order"** as a whole; only three of
  its twelve words (آب، بابا، باد) actually are. Corrected in "Honest exceptions" above.
- **D6 the lydskrift-compromise list named two and stopped**, when the data makes five: a blødt d
  after a vowel (باد → båd, also just the Danish word for "boat"), a silent final -h (ماه → måh,
  read [mɔː]), and a soft-to-silent -rd (زرد → zard). Corrected in "Honest exceptions" above.
- **D7 this plan carried no `## Deviations` section**, despite the build diverging from its own
  "## Steps" in at least five places. Added above.
- **D8 آن's gloss.** Logged as deviation 6 above rather than silently reverted — see there.
- **D9 the primer-order source table listed کلاس as a درس-۳ word while its own ۸+ row is where ک
  lives**, and the prose right below the table calls ک "a later نشانه" outright. کلاس struck from
  the درس-۳ row.

Three fresh concerns were accepted as real; one was built this round, two are deferred:

- **The distractor guard was accepted and built, not deferred.** `distractors()`
  (`src/lessons/vocabExercises.ts`) silently returned fewer than `CHOICE_COUNT - 1` distractors if
  a unit ever ran short of sound-safe neighbours, shipping an undersized round with nothing to say
  so. It now throws, with a test that starves it on purpose and one that walks every real word in
  every real unit to confirm none of them are anywhere near that edge today.
- **The word screen's own heading is Danish, inverting "Persian on top" at the landmark level.**
  `LessonSheet` always renders `<h1>{title}</h1>` before its children, and `WordScreen` hands it
  `Ordet ${word.da}` — so the first thing a screen reader (or the document outline) meets on a
  word screen is Danish, even though the `SplitCard` right below it still puts the Persian pane
  first for a sighted reader. Whether the word screen needs its own Persian h1 is a design
  decision, not a bug fix — deferred to the planner.
- **"Find betydningen" may conflate recall with decoding.** The round shows the vocalized specimen
  and asks what it means, in Danish choices — which rewards a learner who has memorized the
  word's shape as much as one who actually read its letters. Whether the two skills need
  separating into different rounds is a curriculum question, not a bug fix — deferred to the
  planner.

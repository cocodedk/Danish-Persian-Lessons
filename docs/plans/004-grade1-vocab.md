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
| ۳ | مـ م — سـ س | مداد، میز، دست، کلاس |
| ۴ | او و — تـ ت | دوست، توت، دست |
| ۵ | ر — نـ ن | مادر، ابر، باران، نان، نانوا |
| ۶ | ایـ یـ ی ای — ز | ایران، سبز، سرباز |
| ۷ | اِ ـِ — ـه ه — شـ ش | خانه، نَرده، چشم |
| ۸+ | یـ ی · اُ ـُ · کـ ک · و · پـ پ · گـ گ · فـ ف · خـ خ · قـ ق · لـ ل · جـ ج · هـ · چـ چ · ژ · صـ ص · ذ · عـ ع · ثـ ث · حـ ح · ضـ ض · ط · غـ غ · ظ | کتاب، گل، ماه، … |

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
  نشانه order instead, which is what plan 004's step 1 asks for; unit 1 is the only one that is
  also letter-clean under the 003 order.
- **Most of unit ۱ carries no اِعراب at all, and that is correct.** آب، بابا، باد، آبی، نان، ما،
  تو، او، این، آن have no short vowels — every vowel in them is long and written (ا، و، ی). That is
  exactly why the primer opens on them. Marks appear where a short vowel exists: مادَر، مَن، مِداد،
  کِتاب، دَر، دَست، مَدرِسه، سَلام، آسِمان، شَب، گُل، سَبز، زَرد.
- **No ساکن.** The schoolbook convention marks short vowels only; دَست, not دَسْت.
- **تو is /to/, not /tu/.** Written تو with no mark, as in the book; the pronunciation line carries
  the truth (`to · [to]`).
- **Two lydskrift compromises Danish cannot avoid**: `z` is read [s] by a Dane (ز, میز، سبز، زرد)
  and `kh` is read [k] (خانه) — Danish has neither sound. Both follow the sound anchors plan 003
  already shipped, and the IPA beside them is the precise value.
- **Names left out.** The primer's own children, سارا and دارا, are lovely first words but they are
  names, not vocabulary; plan 006 already teaches the learner their own name.

### Note on the red pen (durable decision)

The gradient cut in `src/styles/pen.css` colours everything above one horizontal line, and that line
was tuned for the مد of آ — which sits far higher than a زبر over a short letter. On مَدرِسه it left
the marks in ink; lowering it turned the top of every ا and ل red instead. No single cut can do both,
and it can only ever colour one side of the line, so a word marked above *and* below loses one mark.

A vocalized specimen is now drawn as two copies of the same word in one grid cell: `faMarked` in
`--red` underneath, `fa` in `--ink` on top. Diacritics carry no width, so the letterforms land
pixel-identically and only the marks show through — both sides of the line, on every word. The ink
layer keeps the old gradient, so آ still gets its red مد. `FaSpecimen` falls back to the single-layer
path whenever `faMarked` is not `fa` plus marks (`withoutMarks(faMarked) === fa` is the test).

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

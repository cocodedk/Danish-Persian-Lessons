# Plan 004 — Grade-1 Vocabulary Units

Executor: Opus (pedagogy + research + Persian/Danish copy). Depends on: 003, 006, 007 merged (they are).
Invoke `karpathy-guidelines` first; `frontend-design:frontend-design` before any new screen.

## Questions
(none yet — add here and stop if blocked)

## Goal

The learner reads real words: vocabulary units in Iranian first-grade primer order, each word a
SplitCard pair with full diacritics on the specimen and pronunciation twice, practiced through the
existing exercise machinery and celebrated through the reward engine.

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

- [ ] Word list proposal committed in this plan file and flagged for Babak's native review
- [ ] Starter-set words all present in unit 1 with correct faMarked diacritics (teacher persona
      checks هر اِعراب letter by letter) and natural Danish equivalents
- [ ] Every card: pronunciation twice from data; specimen marks red, on specimens only
- [ ] Unique-answer invariant test extended to vocab exercises and green
- [ ] Units enterable in any order; progress + rewards flow; pay-once verified with reloads
- [ ] 360px both schemes clean; RTL correct; no new deps; 200-line cap; `npm run verify` + CI green
- [ ] Critic personas (teacher / learner / maintainer) find no concrete defect

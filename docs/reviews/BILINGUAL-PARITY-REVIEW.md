# Bilingual parity review

Status: implementation audit complete on 2026-08-07; external native approval is still required.

## Rule

When Persian, pronunciation, and Danish appear as one teaching block, the Danish line must carry
the same meaning as the Persian line. Natural Danish word order is allowed. Adding a reason,
counter, promise, action, or metaphor to only one language is not allowed. Danish-only navigation
or help may remain when it is visibly separate from the translation block.

Letter names, sound anchors, and grammar signs are labelled explanations rather than translations;
their Danish text must describe the visible sign honestly.

## Scope and findings

The audit covered all 176 typed catalog entries, the three connected microtexts, every dynamic
reward helper, and every learner-visible render site that places Persian text near Danish text.

Confirmed mismatches corrected:

1. Resting and active practice lines no longer add a day count or sleeping/waking metaphor in Danish.
2. The welcome-back Danish line no longer adds a streak state or day count.
3. The page-flip Danish line no longer adds a page number absent from Persian.
4. The reward shelf no longer adds a level and sticker count to «صفحهٔ تازه».
5. Letter, space, and half-space typing feedback now use one complete bilingual entry; the Danish
   line no longer adds retry or no-loss claims.
6. A name letter tapped too early now gets the same actionable sentence in both languages.
7. The privacy line now says only that the name is on this device in both languages.
8. All three connected microtexts now preserve sentence boundaries and propositions instead of
   merging Persian sentences into a richer Danish paraphrase.
9. Sticker labels and the bonus line no longer add “sticker,” “out of twenty,” or “as a gift” on
   the Danish side only.
10. The name-choice prompt and six praise pairs now use direct, simple equivalents.
11. The four word bridges state whether the modern meanings match. بند/bånd is a true old link;
    بند/vand and سیل/sejle are clearly marked as memory pictures, not translations.

## Lexical floor

Scores were checked with `wordfreq` 3.1.1 for Persian (`fa`). New status and corrective copy uses
surface words at Zipf 4.8 or higher:

- practice statuses: minimum 4.81;
- ordinary-letter feedback: minimum 5.27;
- “tap this letter later”: minimum 5.21;
- “hello again”: minimum 5.55;
- replacement praise: minimum 5.37.

`آفرین` scores 4.32 and is the only deliberate praise exception: it is a familiar Iranian school
word and a core item the app explicitly teaches. Alphabet names, required technical signs, learner
names, and lesson target words are reviewed as curriculum, not rejected automatically by corpus
frequency. Zipf is a screen, not a substitute for native-speaker judgment.

## Evidence and remaining gate

Regression tests hold the exact dynamic pairs, the 4.8 practice-status floor, complete catalog
companions, and generated review/recording manifests. The Iranian-Persian and Danish reviewers
must still inspect the assembled screens and approve the same source version before release.

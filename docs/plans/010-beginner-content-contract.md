# Plan 010 — Beginner Content Contract

Status: implementation complete; native Persian review remains a release gate.

Depends on P1–P9. This plan does not rewrite those completed plans. It supersedes their narrower
pronunciation rule wherever it conflicts with this contract.

## Outcome

The app assumes no spoken, written, or reading knowledge of Persian. It teaches before it tests,
recommends orientation → alphabet → name → vocabulary, and never locks a route. Every app-owned
Persian letter, mark, word, sign, symbol, and phrase has Danish help, dansk lydskrift, and standard
Tehrani IPA in one dependency-free typed catalog.

## Content model

```ts
interface Pronunciation {
  da: string
  ipa: string
}

interface PersianEntry {
  id: string
  kind: 'letter' | 'mark' | 'word' | 'phrase' | 'symbol'
  fa: string
  faMarked?: string
  da: string
  pron: Pronunciation
}
```

- Catalogs stay grouped by alphabet, vocabulary, interface, names, and rewards and join in one
  validation registry. IDs are stable and unique.
- Letter sounds and displayed Persian letter names are separate entries. UI phrases are complete
  phrase entries, not raw constants.
- Teaching diacritics belong in `faMarked`; UI phrases remain undiacriticized.
- Deliberately taught Persian numerals are symbols. Decorative and dynamic counters use Latin/Danish
  numerals.
- Contextual signs are explicit. `ئ` is described honestly as having no independent sound, with
  Danish “ingen egen lyd” and IPA `[∅]`, pending native review.
- Learner names retain their Latin spelling and get letter-by-letter Persian help. The app never
  fabricates whole-name IPA. Greetings and praise render a static catalog phrase and the name as
  separate segments.

## Shared rendering

- Full teaching card: Persian → dansk lydskrift and IPA → Danish meaning.
- Compact phrase row: whole phrase → pronunciation → natural translation.
- Persistent detail strip for alphabet/vocabulary grids, letter banks, and keyboard taps.
- Personal-name companion: Persian spelling + original name + letter-by-letter help.
- Challenge reveal: complete entry after an attempt.

Grid items remain compact selectors. Selection updates the strip, which links to the full lesson.
Keyboard and bank taps keep their original action and update their nearby strip. Positional forms
reuse the parent entry. Orange key hints remain immediate help.

## Journey and exercises

First run opens RTL and pronunciation orientation before optional name capture. It explicitly contrasts
approachable `åb` with precise `[ɒːb]`, recommends the alphabet, and offers name spelling after the
alphabet. Direct routes and skip paths remain open.

Answer-defining metadata may be hidden only during an active challenge. Every attempt ends in a full
teaching reveal. A first wrong answer has no red X or penalty and offers both “Prøv én gang til” and
“Næste”. Wrong or skipped answers do not mark learning or award completion. Learner-written buffers
remain exempt while composed; answer checking produces the same complete reveal.

## Acceptance

- [x] Typed domain catalogs and combined validation registry exist without a new runtime dependency.
- [x] Unique IDs, required fields, code points, ZWNJ, numeral, and `faMarked` rules are tested.
- [x] A TypeScript source guard rejects uncatalogued Persian literals in production render code.
- [x] `lang="fa"` production paths use approved renderers or the learner-input exception.
- [x] Orientation, alphabet, vowel marks, vocabulary, keyboard, names, feedback, rewards, badges,
      streaks, and kit use complete companions.
- [x] Sara, Babak, Louise/`ئ`, compound-name, unknown-input, and no-name flows have coverage.
- [x] Exercises hide answer help while active, reveal after a first error, make retry optional, and
      update completion only after success.
- [x] Visual board saved at `docs/design/previews/010-beginner-content-board.png`.
- [ ] Native Persian review approves every new phrase, pronunciation, IPA value, sign explanation,
      and the outstanding vocabulary list.
- [ ] The owner records a green local `npm run verify` before handoff; remote CI is not required.

## Out of scope

Audio pronunciation, tracing, spaced repetition, PWA installation, project rename, and dependency
updates remain outside this plan. The Persian landing page remains written for Persian readers.

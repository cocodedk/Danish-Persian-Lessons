# Plan 011 — Simple Puzzle Breaks

Status: implementation complete; native Persian review and CI approval remain release gates.

Depends on [Plan 010](010-beginner-content-contract.md). Puzzles use its catalog, renderers, reveal,
and generosity rules.

## Outcome

Add short, deterministic tap breaks after each alphabet cluster and each four-word vocabulary group.
They rehearse only entries introduced by that point and never introduce content through a test.

## Puzzle types

1. **Match:** pair a Persian letter or word with Danish name/meaning and pronunciation.
2. **Put in order:** assemble an introduced 2–4-letter word from unique-ID tiles. Repeated glyphs get
   separate tile IDs.
3. **Missing letter:** complete an introduced word from three clear choices with one answer.

Alphabet-only clusters use matching; the app never invents word puzzles for ineligible material.
Vocabulary groups choose their eligible kind deterministically. There is no runtime randomness.

## Behavior and storage

- Each break has 2–4 tasks, is skippable from the first screen, and can be replayed.
- Input is taps only: no dragging, timer, score, lives, or audio dependency.
- Answer companions stay hidden during an active task; every attempt uses P10's full reveal.
- Puzzle completion never unlocks required content.
- Completed IDs are appended idempotently to `dpl.v1.puzzles`.
- First completion requests one normal item reward. A replay praises without another payout.

## Acceptance

- [x] Deterministic catalog generation, introduced-entry eligibility, and unique answers are tested.
- [x] RTL tile order and duplicate-glyph tile IDs are represented explicitly.
- [x] Alphabet and four-word vocabulary groups each receive an eligible 2–4-task break.
- [x] Skip, retry, next, finish, and replay controls are tap-based and freely reachable.
- [x] Pay-once, append-only persistence is tested under `dpl.v1.puzzles`.
- [x] Active answers hide companion metadata and every attempt produces a complete reveal.
- [x] Visual board saved at `docs/design/previews/011-simple-puzzles-board.png`.
- [ ] Native Persian review approves the puzzle prompts and every catalog value they expose.
- [ ] CI `verify` is green on the plan PR. Local `npm run verify` must be green before handoff.

## Out of scope

Dragging, random generation, adaptive difficulty, timers, scores, lives, audio, and progression locks
are deliberately absent.

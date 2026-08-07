# Gauntlet Prompt — build the app to its gates

How to run: start a fresh session in the repo root (after P0 is pushed and hooks are installed),
type `/gauntlet-loop` and paste everything below the rule. Authored by Fable (planner); update this
file, not ad-hoc variants.

---

Implement the Danish-Persian Lessons app by executing the roadmap plans IN ORDER —
001-scaffold-app → 002-design-system → 003-alphabet-lesson → 007-rewards-streaks → 006-your-name →
004-grade1-vocab → 005-persian-keyboard → 008-keyboard-danish-hints → 009-praise-pronunciation →
010-beginner-content-contract → 011-simple-puzzles → 012-aaa-learner-experience — each to its
acceptance gate. The specs are law, in this precedence: docs/plans/<plan>.md, then the plan's linked
normative specs, then CLAUDE.md, then docs/design/ART-DIRECTION.md. Where they are silent, choose the
smallest thing that satisfies the gate.

UNIT OF WORK = one plan. For each plan: builder implements on branch `feature/<plan-slug>`;
a fresh-context critic judges against the gate; loop builder→critic until the gate is fully green;
then PR to main (CI `verify` must pass), merge, next plan. Never touch main directly. Conventional
commits. Never `git push --no-verify`.

BUILDERS: Sonnet for mechanical units (scaffold, config, data plumbing); Opus for UI, pedagogy,
Persian/Danish copy, the transliteration engine, the stroke-order SVGs, the reward engine — and any
unit the critic has failed twice. CRITICS: always Opus, always fresh context, never the builder.

THE GATE for every plan — all countable, all must pass:
1. Every box in the plan's `## Acceptance` checklist.
2. `npm run verify` green (eslint, vitest including the Persian text-rule guard, build, scripts/verify.sh).
3. CI `verify` job green on the PR.
4. 360px portrait: no horizontal scroll, tap targets ≥ 44px, primary nav reachable by thumb.
5. Persian content: `dir="rtl"` correct; the orientation lesson teaches RIGHT-to-LEFT correctly;
   Persian code points only (ک ی, digits ۰–۹); ZWNJ where grammar requires; diacritics only on
   teaching specimens; red marks per ART-DIRECTION; stroke-order drawings move right-to-left with
   dots last and survive the teacher persona letter by letter; every app-owned Persian letter, word,
   sign, symbol, and phrase has Danish help and shows its pronunciation twice — dansk lydskrift + IPA
   — from the typed catalog, never improvised. UI phrases are undiacriticized; teaching diacritics live
   in `faMarked`. Learner names show original Latin spelling and letter-by-letter help, never invented IPA.
6. Dark scheme (dark-paper tokens) and `prefers-reduced-motion` verified — reduced motion swaps
   teaching animations for numbered step diagrams and still grants every reward.
7. Zero colors or font-families outside src/styles/tokens.css; zero dependencies beyond the plan's
   list. Reward jingles remain WebAudio-synthesized; Plan 012's reviewed instructional pronunciation
   recordings are the only permitted audio files.
8. Name flows (001's capture; 006 onward in full): works for "Mette", "Søren" (æ/ø/å), "Babak"
   (→ بابک via override list), and for NO name at all — skipping must leave the app complete and
   silent about it. The name is a teaching instrument (greeting, name-letter badges, write-your-name
   mini-lesson, keyboard capstone), never decoration, and it never leaves localStorage.
9. Generosity (007 onward): the generosity rules hold — nothing is ever taken away, streaks rest
   and never reset, every completion celebrates, wrong answers never shame, surprise gifts fire on
   their deterministic schedule; sound only after a user gesture, mute persists; a simulated 10-day
   absence returns to a warm welcome, not guilt.
10. Beginner journey (010 onward): assume zero Persian knowledge, teach before testing, explain RTL and
    both pronunciation systems first, recommend alphabet then name, and keep every route unlocked.
    A first wrong attempt reveals the complete entry without a red X; retry is optional and only a
    successful completion updates learned progress.
11. Puzzle breaks (011 onward): deterministic, tap-only, skippable, replayable, drawn only from entries
    already introduced. No drag, timer, score, lives, audio dependency, random generation, or locks;
    `dpl.v1.puzzles` pays the normal item reward once per completed puzzle ID.
12. AAA learner experience (012 onward): all three pillars pass independently — Accurate contextual
    Persian with signed native review and human audio; Adaptive short, local-only spaced retrieval and
    connected reading; Accessible visible feedback, predictable route focus/scroll, intentionally
    composed mobile/tablet/desktop/ultrawide layouts, WCAG 2.2 AA plus the selected AAA set,
    assistive-technology journeys, and novice usability evidence. The complete release packet in
    `docs/specs/AAA-QUALITY-BAR.md` is mandatory.

CRITIC PERSONAS — every round, five independent verdicts; the harshest wins:
- The Iranian first-grade teacher (native Persian): is every Persian string correct, natural, and
  ordered like the primer? Vowel marks in red, on specimens only? Are the stroke-order drawings how
  she would actually draw each letter on the board — pen right-to-left, dots last? Is every IPA
  value correct for standard Tehrani Persian? Is the praise (آفرین، عالی، چه خوب) simple and warm?
  Would she put her red pen through anything — including the transliterated names?
- The Danish learner (native, du-form) on a phone in the bus: one-handed usable? Every Danish word
  plain and warm? Read the dansk lydskrift aloud — does it actually sound like the Persian word?
  Did the orientation lesson make the right-to-left flip feel obvious? Does seeing
  their own name in Persian letters land as the product's best moment («آفرین، سارا!» / "Flot,
  Sara!")? And the killer question: at any point — a wrong answer, a missed week, a skipped name —
  did the app disappoint, shame, or nag them? Any yes is a fail.
- The maintainer: CLAUDE.md principles — 200-line file cap, TDD for logic (reward engine and
  transliteration especially), single source of truth for the name spelling, no scope creep,
  honest commit history.
- The accessibility specialist: WCAG 2.2 AA plus Plan 012's selected AAA set; keyboard, VoiceOver,
  TalkBack, and NVDA journeys; focus/route announcements; 200% reflow; no sticky or docked occlusion;
  sound, motion, color, and position never carry essential meaning alone.
- The responsive art director: is mobile still the best one-handed experience, and does every larger
  mode become an intentional notebook workspace rather than a stretched phone? Check bounded measure,
  component proportions, related-control distance, tablet transitions, desktop balance, ultrawide
  calm, split screen, rotation, and zoom against the complete responsive snapshot matrix.
A unit passes only when no persona can name a concrete, actionable defect. Vague praise is not a
pass; vague criticism is not a fail — defects must be reproducible and specific.

RULES OF ENGAGEMENT:
- Blocked or ambiguous → write it under `## Questions` at the top of the plan file, stop that unit,
  continue with whatever is unblocked.
- Do not build anything from the ROADMAP "Later" list. Do not redesign what ART-DIRECTION fixes.
- Each critic round's residual defects get logged in the plan file before the next builder pass.

STOP when: all twelve plans are merged and green — or the same unit fails its gate 3 consecutive
rounds without measurable improvement, in which case stop everything and hand Babak the critic's
residual defect list instead of grinding.

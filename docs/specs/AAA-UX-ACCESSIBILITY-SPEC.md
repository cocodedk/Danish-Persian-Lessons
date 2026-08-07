# AAA UX and Accessibility Specification

Status: normative for Plan 012. The art direction remains the exercise notebook; this spec governs
behavior, hierarchy, responsiveness, and access.

## Supported variations

Every core journey MUST work across the full viewport, orientation, split-screen, and zoom matrix in
the [responsive design specification](AAA-RESPONSIVE-DESIGN-SPEC.md); light/dark; reduced motion;
sound off; keyboard only; touch only; and denied storage. No variation may require horizontal page
scrolling.

“Core journey” means first run, return/continue, browse alphabet/vocabulary, open detail, play audio,
answer wrong/correct, retry/next, complete a puzzle, type a word, edit/delete/skip a name, and resume.

## Information hierarchy

- Every route MUST have one visible `h1`, a unique document title, and one primary next action.
- On return, the first 360×800 viewport MUST show current state and a “Fortsæt” action without hiding
  lesson browsing. The specimen remains the brand hero but MUST not bury the next task.
- Counters MUST use honest labels: `set`, `øvet`, `husket`, and `klar til repetition`. “Klaret” is for
  a completed activity or earned milestone, not passive exposure or permanent mastery.
- IPA and Danish sound spelling remain adjacent to their Persian item. Danish sound spelling has
  stronger immediate hierarchy; IPA remains readable reference, not decorative gray noise.
- Long indexes keep the sticky master-detail strip, but it MUST use no more than 25% of a 360×640
  viewport and MUST leave the selected grid row and its next action visible.

## First run and orientation

- The first concept is RTL, demonstrated through the existing `DNAV → VAND` analogy.
- Orientation is divided into short steps: direction, joining, changing forms, no capitals, dots, and
  help systems. Each step has a visible position (`1 af 6`), Back, Continue, and “Gå til alfabetet”.
- At 360×640, the current concept, its demonstration, and Continue MUST be visible or reachable with a
  single ordinary scroll; the bottom bar never covers the explanation.
- Completion means all steps were viewed or the learner explicitly skipped. Merely mounting the first
  route MUST NOT silently mark the entire orientation seen.
- The complete long-form introduction remains reachable from the alphabet index.

## Route and scroll contract

- Forward navigation to a different route MUST set scroll to the top before paint or as part of the
  same visual transition, update the document title, and focus the route heading or labelled main
  region programmatically.
- The focused heading uses `tabindex="-1"`; its focus indicator may be visually quiet but MUST be
  detectable. Focus MUST NOT jump again after fonts, audio, rewards, or storage load.
- Browser Back/Forward MUST restore the prior route's scroll position and selected item. A deliberate
  in-page anchor MAY scroll to its target and MUST focus/announce that target when appropriate.
- HashRouter route changes MUST be tested as real Link activations from a scrolled page, not only as
  clean direct loads.
- Sticky headers/footers require `scroll-padding`/`scroll-margin` sufficient to expose the full
  focused element, satisfying WCAG 2.2 2.4.12 rather than only partial visibility.

## Answer and feedback contract

Within one interaction frame after a tap/key activation:

1. the activated choice gains a non-color-only selected state;
2. repeated activation is suppressed until the state transition completes;
3. the full teaching reveal and result phrase are inserted;
4. the reveal is scrolled into the nearest unobscured viewport area when it is not already visible;
5. a polite status message announces result and available actions without duplicating the entire page.

Wrong answers use no red X, shake, buzzer, loss, or disappearing reward. The selected choice may use
blue emphasis and a textual “Se forklaringen”; the teacher's red is reserved for the correct cue and
teaching marks. Correct answers use a tick/text in addition to color.

- At least the reveal heading, Persian form, pronunciation, Danish meaning, Retry, and Next MUST be
  reachable without scrolling back through the question. On 360×640, the first three MUST be visible
  together after the automatic nearest scroll.
- Pointer activation MUST not unexpectedly move keyboard focus. Keyboard activation MAY move focus to
  the first feedback action after the polite result announcement when that produces the clearest
  sequence. The behavior MUST be consistent across exercise types.
- Retry returns to the challenge with a clear prompt and focus. Next is always available after a wrong
  answer. Skip explains that nothing was marked learned and keeps the learner in control.
- Celebrations may overlay only after the reveal is understood and MUST not obscure result/actions.
  Reduced motion renders the same information instantly.

This follows WCAG 2.2's [status-message guidance](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
while also serving sighted learners whose point of regard must see the update.

## Exercises and session UX

- The default session advertises estimated length, not a 32/33-question wall. Show progress within the
  current ≤12-task session and offer a natural stop after every answer.
- Teaching help is present before a first challenge, hidden only when it defines the answer, and fully
  restored after every attempt.
- Choice sets use meaningful distractors but never two defensible answers. Choice position varies
  deterministically enough that position is not the learned cue.
- Typing keeps prompt, pronunciation, writing line, Check/Reveal, keyboard, and navigation operable in
  the 360×640 viewport. The dock MUST not cover the prompt, caret, feedback, or focused key.
- The Persian keyboard preserves 44×44 targets. Danish hints may shrink typographically but remain at
  least 14 CSS pixels at default zoom and meet enhanced contrast.
- Puzzle tasks remain tap-based; ordering offers tap-to-place and tap-to-remove. Dragging is never the
  only operation.

## Audio interaction

- Each pronunciation control is a native `<button>` of at least 44×44 CSS pixels with an accessible
  name such as “Afspil udtale af آب”. It indicates playing state in text/accessible state, not animation
  alone.
- No pronunciation audio autoplays. One clip plays at a time. Replay, stop, normal/slow speed, and mute
  work with touch and keyboard.
- The reward mute and pronunciation preference are understandable as separate settings if their scope
  differs. System media and reduced-motion preferences do not silently disable instructional text.
- Loading, missing, or failed audio produces a compact status and leaves all text/help and task actions
  intact. Do not display a blocking error dialog.

## WCAG conformance target

The complete app MUST pass WCAG 2.2 A and AA. Selected AAA criteria are also mandatory:

| Criterion | Product requirement |
|---|---|
| 1.4.6 Contrast (Enhanced) | Instructional/body text ≥7:1; large text ≥4.5:1 |
| 2.4.10 Section Headings | Long orientation, indexes, settings, and lesson groups have real headings |
| 2.4.12 Focus Not Obscured (Enhanced) | Sticky detail, keyboard, and bottom bars hide no part of focus |
| 2.4.13 Focus Appearance | Indicator area ≥2px perimeter equivalent and ≥3:1 state contrast |
| 2.5.5 Target Size (Enhanced) | Author-controlled targets are ≥44×44 except normative exceptions |
| 2.5.6 Concurrent Input Mechanisms | No artificial restriction to touch, pointer, or keyboard |
| 3.2.5 Change on Request | Audio, route, reveal, and context changes follow learner action |
| 3.3.5 Help | Name/input formats and recovery help are available in context |

W3C does not recommend whole-site Level AAA as a general policy, so the release claim is WCAG 2.2 AA
plus this named set—not an imprecise “WCAG AAA” badge. Normative source:
[WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Semantics and language

- Persian text uses `lang="fa" dir="rtl"`; Danish uses `lang="da"`. Mixed pronunciation and IPA use
  LTR isolation so screen readers and bidi layout do not reorder them.
- Visual order, DOM order, reading order, and keyboard order MUST preserve meaning. RTL grids MAY lay
  out right-to-left while global navigation remains predictable.
- Buttons perform actions; links navigate. Toggle buttons expose pressed state. Selected grids expose
  selection without turning every tile into an ambiguous two-step control.
- SVG stroke diagrams have concise names and equivalent numbered static steps. Decorative notebook
  rules, confetti, and flourish are hidden from accessibility APIs.
- Dynamic results use one deliberate live region. Do not announce every confetti particle, progress
  mutation, pronunciation line, and reward as competing messages.

## Visual and cognitive quality

- Notebook rules stay structural and MUST not reduce small-text legibility. Body/instructional text
  targets enhanced 7:1 contrast; large text targets 4.5:1. Controls and focus indicators meet at least
  3:1 against adjacent colors in both schemes.
- Body text is at least 16 CSS pixels; Persian teaching text is sized for marks; line length is 35–70
  Latin characters where practical. Text spacing overrides MUST not clip or overlap.
- Motion is limited to instruction and celebration, under 1.5 seconds, interruptible where repeated,
  and static under reduced motion. No essential state waits for animation.
- One screen asks for one main decision. Optional IPA detail, settings, and exhaustive browsing must
  not compete with the primary Continue/answer action.

## Automated browser matrix

Playwright MUST exercise Chromium, Firefox, and WebKit. For representative route/state pairs it checks:

- no horizontal overflow and no target below 44×44;
- route heading/title/focus and Back scroll restoration;
- feedback/reveal intersection with the unobscured viewport;
- focused-element geometry against every sticky/docked region;
- keyboard order, Enter/Space activation, Escape where applicable, and visible focus;
- dark/light, 200% zoom, reduced motion, sound preference, offline audio failure, and denied storage;
- axe with zero critical/serious violations and manual adjudication of incomplete rules.

Screenshots are required for the route/state and viewport matrix in the responsive spec. Snapshot
approval requires the Danish learner, art director, and accessibility reviewer—not the implementer
alone.

## Manual acceptance journeys

1. VoiceOver + Safari on a current supported iPhone.
2. TalkBack + Chrome on a current Android phone.
3. NVDA + Firefox on Windows with keyboard only.
4. Real one-handed touch at 360–390px-equivalent width on a moving/bus-like interruption protocol.
5. 200% zoom plus increased text spacing and forced-colors/high-contrast where available.

Each journey records build, OS/browser/AT versions, route, expected result, actual result, severity, and
resolution. “Automated tests passed” cannot replace these journeys.

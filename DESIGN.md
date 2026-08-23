# Danish-Persian Lessons Design Baseline

Status: **living document**, last reviewed against released v0.10.0.

This file is the concise design contract for the product experience. It owns six aspects:

1. the product promise,
2. the information architecture and navigation decisions,
3. the semantic typography roles and the permitted-weight policy,
4. the product-level teaching order,
5. testimonial composition and layout, and
6. the counting decision and the high-level counting experience: one canonical 1-20 foundation lesson
   plus three separate rule lessons, four lessons in a product-level sequence, and the product-level
   shape of how a learner meets a number.

Every other aspect has its own authoritative source, listed in
[`docs/specs/README.md`](docs/specs/README.md). This file does not override those sources and does not
claim general precedence over plans or specifications. Where this file and an owner document both
touch an aspect, the owner document decides the exact values and this file states only the
product-level intent. Explicit learner safety, privacy, or linguistic accuracy requirements always
take the stricter interpretation.

## Product promise

The app helps a curious beginner make sense of Persian writing and speech without making practice
feel like an obligation. It also keeps the complete Danish-Persian course available for a learner who
wants more structure and detail.

- The child path MUST create a recognizable Persian result quickly.
- The learner MUST be free to choose, retry, reveal, switch paths, or stop without penalty.
- Persian accuracy, Danish clarity, accessibility, privacy, and respectful tone MUST not be weakened
  to make the experience more playful.
- The interface MUST remain useful for a child and credible for an adult.

## Information architecture

The learner-facing hubs are:

1. **Tal** (`/tal`) - listen to reviewed Persian audio, repeat, and practise sounds.
2. **Ord** (`/opdag`) - choose simple words, build them, and keep completed words.
3. **Ordbroer** (`/ord-der-ligner`) - connect Persian and Danish through secure cognates or clearly
   labelled sound mnemonics.
4. **Skrift** (`/kursus`) - enter the complete, structured course.

This is the reviewed-audio arrangement and the one released in v0.10.0.

When the reviewed speaking audio is not available, the app falls back to the legacy three-hub
arrangement: **Ord** (`/opdag`), **Ordbroer** (`/ord-der-ligner`), and **Lektioner** (`/kursus`). The
`/kursus` hub is labelled `Skrift` only in the reviewed-audio arrangement and `Lektioner` in the
fallback; the route itself never changes.

Which arrangement is active is decided by a reviewed-audio readiness rule implemented in the speaking
module; what counts as reviewed, approved audio is owned by
[`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md). This file MUST NOT restate that
rule, its inputs, or its thresholds. Both arrangements are part of the contract: every navigation
requirement below applies to whichever one is active.

The first visit MAY ask the learner to choose a journey. That choice changes routing and emphasis
only. It MUST NOT fork or erase learning data.

## Global navigation

- The hubs MUST remain in a fixed bottom navigation bar, in the documented order for the active
  arrangement: `Tal`, `Ord`, `Ordbroer`, `Skrift`, or `Ord`, `Ordbroer`, `Lektioner`.
- The bar MUST stay compact, honouring the minimum target size and safe-area padding required by
  [`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md).
- The current hub MUST be identified with text, color, and `aria-current`.
- Settings MUST be available on every app route through one floating gear in the top-right corner.
- The gear MUST float over the page without a full-width top toolbar.
- The gear and its panel MUST not obscure the current task, focused control, or bottom navigation.
- Forward navigation starts at the new page heading. Browser Back restores useful context.
- Adding, removing, or relabelling a hub, or introducing a top bar, drawer, or competing navigation
  system, requires an explicit product decision recorded in this file.

## Visual language

The material metaphor is an Iranian exercise notebook, `دفتر مشق`, interpreted with restrained
Danish functional design: matte paper, ruled lines, ink, and a teacher's margin. Cards are individual
learning objects, not decorative containers for whole sections, and the interface stays bounded on
wide screens rather than becoming a stretched phone UI.

Light mode uses warm notebook paper; dark mode uses deep berry paper and stays recognizably
pink/berry rather than a generic dark theme. Light, dark, and system modes remain available from
Settings.

The notebook metaphor, component styling semantics, teaching-mark and control color roles, card
treatment, and the permitted motion categories are owned by
[`docs/design/ART-DIRECTION.md`](docs/design/ART-DIRECTION.md). The semantic palette and other design
tokens live in [`src/styles/tokens.css`](src/styles/tokens.css); components use the shared tokens
instead of local color literals.

## Typography and language

Semantic face roles are part of this contract:

- Persian display words use Noto Naskh Arabic.
- Persian UI and body text use Vazirmatn.
- Danish and other Latin text use Andika, a literacy-oriented typeface.

Weight rules:

- Fonts remain self-hosted in the app.
- Only the regular and bold faces actually declared in
  [`src/styles/fonts.css`](src/styles/fonts.css) may be used. Not every family declares both.
- Requesting a weight that file does not declare is forbidden, as is letting the browser synthesize a
  missing bold or oblique. If a design needs another weight, add the real face file first.
- The exact font files and numeric weights live in `src/styles/fonts.css`; consult that file rather
  than any copy of the values here.

Danish copy uses short, warm, concrete verbs and the informal `du` form. Persian script correctness -
language and direction metadata, code points, joining, ZWNJ, diacritics, and letter-spacing - is
owned by [`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md); how type reflows across
viewports is owned by
[`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md).

## Teaching order

Complete teaching surfaces lead with the Persian word, support it with Danish-friendly sound spelling
and IPA, give the Danish meaning, and end in a concrete action. That order is this file's product
decision. The teaching hierarchy, the relative prominence of IPA, and the rule that teaching content
comes from canonical lesson entries are owned by
[`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md).

## Beginner workshop

The workshop opens with choice, not explanation. It offers a small set of simple, useful everyday
words, a greetings section, colour and animal sections, a Persian number section, and a personal
collection that acknowledges completed words without locking the others.

The workshop's number section is an entry point to the canonical 1-20 foundation lesson described
under [Counting](#counting); it is not a separate number curriculum and MUST NOT keep its own range,
title, or audio scope. Its heading, its count, and the numbers it names come from that lesson, so the
workshop can never disagree with it.

Every word card shows Persian, Danish meaning, Danish-friendly pronunciation, IPA, and a clear
action. Some browsers show a meaning illustration and others intentionally use the complete
text-only layout; illustration presence never removes meaning. Lesson images are local and
rights-documented, with delivery, aspect, and asset rules owned by
[`docs/specs/AAA-LESSON-IMAGE-SPEC.md`](docs/specs/AAA-LESSON-IMAGE-SPEC.md).

## Counting

Recorded product decision: **there is exactly one canonical 1-20 foundation lesson**, covering 1
through 20, at `/lesson/taelle`, **plus exactly three separate rule lessons** for 21-99, 100-900, and
thousands. Counting is four lessons in total, taught in the sequence below. The exact routes of the
three rule lessons are owned by the counting specification named below, not by this file.

- The Tal shelf, the child workshop's number section, the course home, and the retired
  `/tal/tal/:page` URLs are entry points or redirects into that same foundation lesson. None of them
  is a separate 1-20 foundation, and none may hold its own range, ordering, or progress record for
  it.
- A surface that names the 1-20 range, the number of items, or the individual numbers MUST read them
  from the canonical foundation lesson rather than restating them.
- Any approved audio exposed inside that foundation lesson is a capability derived from
  [`src/audio/approved.generated.json`](src/audio/approved.generated.json), and never creates a
  separate lesson. The lesson MUST NOT promise, fake, or imply audio for numbers that have none, and
  MUST NOT present those numbers as broken, incomplete, or lesser; they are complete teaching rows
  that currently have no clip.
- Adding a duplicate or competing 1-20 foundation lesson, or giving that foundation an alternate
  range or an alternate progress record, requires an explicit product decision recorded in this
  file. The three rule lessons below are not such duplicates; they teach ranges above 20.

Counting grows in four stages, one lesson per stage, in this order:

1. **1-20 foundation** - the individual number words, learned as items. This is the range the
   canonical lesson teaches today.
2. **21-99 composition rules** - how tens and units combine into a spoken number.
3. **100-900 hundreds rules** - how the hundreds are formed and joined to the range below.
4. **Thousands rules** - how thousands are formed and joined to the ranges below.

Stages 2 through 4 teach rules rather than item lists, and each ships as its own separate rule lesson
rather than extending `/lesson/taelle`.

### The counting experience

The high-level shape of the counting experience is a product decision recorded here. The exact
behaviour and the exact layout acceptance are owned by the specifications named at the end of this
section; this file states only the intent.

- The primary job of a counting surface is **select a number and hear or learn it**. Everything else
  on the surface exists to support that job.
- **Activating a number tile is the primary action.** One deliberate activation both selects the
  number and, when that number has an approved clip, plays it. The learner never has to find a second
  control to hear the number they just chose.
- **Replay is secondary.** Hearing the same number again stays available, but it MUST NOT compete
  with selection for prominence, position, or emphasis.
- Arriving at a counting surface is not a request to hear anything. Sound follows a deliberate
  learner action, in keeping with the sound rules under
  [Feedback, rewards, sound, and motion](#feedback-rewards-sound-and-motion).
- Counting teaching surfaces follow the product [teaching order](#teaching-order): the Persian word
  first, then the Danish-friendly sound spelling, then IPA, then the Danish meaning, and the audio
  action last.
- A number with no approved clip is still a complete teaching row. It can be selected and read like
  any other, and the app MUST NOT promise, fake, imply, or substitute a sound for it.
- **Mobile is the base.** The base composition is one column containing the ascending number tiles
  and the selected number's teaching content, in DOM order. A wide screen MAY place a related detail
  rail beside the grid when that genuinely helps the learner keep the tiles and the teaching content
  in view together.
- The rail is a composition of the same experience, never a second one: same numbers, same teaching
  content, same learner state, same selection. It MUST NOT introduce content, controls, or state that
  the compact layout does not have, and the compact layout MUST NOT lose anything the rail shows.

A dedicated
[`docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md`](docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md) owns the
exact rule-lesson routes, the ranges each stage teaches, worked-example coverage, the descriptor,
data, and progress identities, audio-honesty behaviour, the exact counting selection and playback
behaviour, the pre-release audio completeness condition for 1-20, and the exercise mechanics that
present them. The exact layout acceptance for the number grid and the wide-screen detail rail -
tile direction, target sizes, column counts, bounds, and layout stability - is owned by
[`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md). Persian
linguistic accuracy and the audio process are owned by
[`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md), and the required review
evidence and sign-off are owned by
[`docs/specs/AAA-QUALITY-BAR.md`](docs/specs/AAA-QUALITY-BAR.md). This file states only the
product-level sequence and MUST NOT carry those details. That specification MUST exist, and be
listed in [`docs/specs/README.md`](docs/specs/README.md), before any stage 2, 3, or 4 lesson ships.

## Word building

A mission uses an explicit model -> guide -> independent recall -> completion sequence, and the
learner is told before starting that the word is built twice. The round labels, guidance mechanics,
and completion bookkeeping are owned by
[`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md).

The product promises that survive any change to those mechanics:

- Reveal or continue-with-help remains available and MUST NOT claim independent mastery.
- Wrong choices receive an explanation and retry path, never a red X, buzzer, loss, or shame.
- `Færdig for nu` remains an honest exit after completion.

## Word bridges

- Secure historical cognates and sound-only memory bridges MUST remain visibly distinct.
- A memory bridge MUST state that similar sound does not prove shared origin.
- Each bridge keeps Persian, Persian IPA, meaning, Danish, Danish IPA, meaning, and source links.
- New bridges require language review; recognizability alone is not enough for an etymology claim.

The evidence a cognate claim needs and how bridge sources are verified are owned by
[`docs/specs/AAA-LEARNING-SPEC.md`](docs/specs/AAA-LEARNING-SPEC.md).

## Feedback, rewards, sound, and motion

- Feedback names what changed and keeps the next action nearby.
- Rewards are generous and additive. No streak loss, debt, countdown, league, accuracy pressure, or
  social comparison.
- Motion is reserved for teaching or brief celebration and never blocks the learner. The permitted
  motion categories are owned by [`docs/design/ART-DIRECTION.md`](docs/design/ART-DIRECTION.md);
  durations and reduced-motion behaviour are owned by
  [`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md).
- Sound starts only after a user gesture, has a persistent setting, and carries no unique instruction.

## Accessibility and responsive behavior

The goal is an AAA-quality learning experience: every learner reaches the same meaning through touch,
pointer, keyboard, or screen reader, and no information depends on color, sound, motion, or images
alone. The measurable floor, the selected success criteria, target sizes, focus behaviour, contrast
and scrim rules, and the tested display modes are owned by
[`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md).

### Desktop and mobile composition

The product invariant: a wide screen MAY compose related content and a secondary rail side by side
when that genuinely helps comprehension or control, and a compact layout MUST return to one logical
column that follows DOM order. The same DOM, route, content model, and learner state serve both.

- Side-by-side composition is a decision about meaning, not a way to fill width. A rail exists only
  when it carries content related to the primary task.
- Collapsing to one column MUST NOT reorder, duplicate, or hide meaning, and MUST NOT remount a task
  or lose learner state.

Breakpoints, layout modes, the wrapping fallback, bounded widths, rail geometry, and clearance from
fixed or sticky chrome are owned by
[`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md). Consult that
file for the numbers; this file states only the invariant.

## Privacy and safety

- Learning data and personal names remain local to the device or current session.
- No account, advertising, analytics, behavioral profiling, remote storage, purchases, or runtime AI.
- Personal content stays optional, editable, and deletable.
- The adult course provides context, not surveillance or reward control over the child.

## Future testimonial contract

**Not built yet.** The app ships no testimonials today. This section is the contract that a future
testimonial surface MUST satisfy before it may ship; it describes nothing currently in the product.

Composition and layout:

- A testimonial is a semantic `blockquote` with visible attribution, not styled body text and not a
  decorative pull-quote without a source.
- Attribution MUST state the person's relationship to the product and enough context to judge the
  quote - for example a parent who used the child path, or a teacher who reviewed the course.
- Desktop MAY use a bounded grid of testimonials. The grid keeps readable line lengths and stops
  growing when added width no longer helps; it MUST NOT stretch quotes across the full viewport.
- Compact widths MUST fall back to a single column in DOM order.
- No carousel, auto-rotation, or any control that hides a quote behind a timer or a swipe.
- No text placed over a portrait or any photograph. Portraits, if used, sit beside or above the quote
  with their own contrast-safe surface.
- No stock photography standing in for a real person, and no invented, composited, or paraphrased
  quote presented as someone's words.

Provenance and consent - who may be quoted, what evidence is required, and how consent is recorded -
are owned by [`docs/specs/AAA-QUALITY-BAR.md`](docs/specs/AAA-QUALITY-BAR.md), not by this file.

## Visual-change acceptance

A change that alters what the learner sees is accepted on evidence, not on a screenshot that merely
differs.

- Regenerating a visual baseline records a candidate; it is not approval.
- The baseline procedure and the inventory of states, viewport widths, and schemes a visual change
  must cover are owned by
  [`docs/reviews/VISUAL-REVIEW-PROTOCOL.md`](docs/reviews/VISUAL-REVIEW-PROTOCOL.md).
- The automated geometry and accessibility assertions that run against those states are owned by
  [`docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`](docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md) and
  [`docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`](docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md).
- The reviewer roster, severity, release evidence, exceptions, and sign-off are owned by
  [`docs/specs/AAA-QUALITY-BAR.md`](docs/specs/AAA-QUALITY-BAR.md).
- A visual change that contradicts this file's product promise, information architecture, navigation
  decisions, typography roles, testimonial contract, or counting decision needs this file updated in
  the same change, together with the affected specifications, tests, baselines, and release notes.

This section deliberately does not copy the matrices, state inventories, or reviewer rosters from
those documents. Read them there.

## What may grow

The app MAY add reviewed simple words, illustrations, audio, lessons, puzzles, bridges, and local
personalization when they follow this contract. Accessibility, performance, language accuracy, and
browser fixes may improve without separate design approval when they preserve the released behavior.

Changing the navigation model, the four-lesson counting decision, notebook identity, font system,
palette character, teaching hierarchy, two-round learning contract, reward ethics, privacy model, or
child-first tone requires an explicit product decision. Such a change MUST update this
file, relevant specifications, tests, visual baselines, and the release notes in the same change.

## Where every other aspect is owned

[`docs/specs/README.md`](docs/specs/README.md) is the map of record: it lists the single authoritative
source for every aspect this file does not own.

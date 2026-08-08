# AAA Child Experience Specification

Status: normative for [Plan 014](../plans/014-child-first-aaa-experience.md).

This specification adds a child-facing journey to the same accurate, adaptive, accessible course. It
does not weaken Persian accuracy, privacy, accessibility, or the grown-up learner contract.

## Learner and promise

The provisional primary learner is an 8–12-year-old who can read short Danish commands, is curious
about Persian, and did not necessarily request a course. The experience MUST remain respectful for an
older learner and usable beside a parent for a younger learner.

The promise is: “I can make, recognize, and keep something Persian that matters now.” The interface
MUST NOT imply that the learner owes daily practice, must finish the alphabet, or is responsible for
preserving a family language.

## Two front doors, one foundation

- The child journey MUST prioritize visual choice, direct manipulation, short retrieval, and artifacts.
- The grown-up course MUST preserve curriculum browsing, IPA, detailed progress, and full lessons.
- Both journeys MUST use canonical catalog entries, local progress, shared rewards, and reviewed assets.
- A journey choice MUST affect routing and hierarchy only. It MUST NOT hide, delete, or fork learning data.
- Each journey MUST expose a predictable, secondary switch to the other.
- Switching MUST be learner-initiated and MUST NOT clear route, profile, collection, lesson, or reward data.

## Motivation contract

### Autonomy

- The learner MUST choose a mission before instruction begins.
- “Done for now” MUST remain an honest exit after every completed mission.
- Skip, reveal, switch journey, and retry MUST carry no penalty or disappointment copy.
- All missions MUST remain open; collection state is acknowledgment, not a lock.

### Competence

- The first task MUST be guided and understandable without adult explanation.
- One complete Persian result MUST appear within one short mission, not after an alphabet inventory.
- The current action and its result MUST remain in the same interaction region.
- Difficulty MUST progress model → guide → retrieve, never test → unexplained correction.

### Relatedness

- Initial content MUST use ordinary, imageable Persian words from the existing reviewed curriculum.
- Future personal names or family messages MAY extend the journey only after content review.
- Danish and Persian MUST appear as cooperating resources, not competing identities.
- The child MUST control whether personal or family content appears in her journey.

## Information hierarchy

Every child route MUST answer in order:

1. What can I do now?
2. What will I make or discover?
3. What changed because of my action?
4. Can I continue, choose another thing, or stop?

Settings, methodology, IPA explanation, total alphabet counts, streaks, levels, and exhaustive lesson
browsing MUST NOT compete with the primary child action. IPA MAY appear inside the complete teaching
reveal because it belongs to the shared accuracy contract, but it MUST remain quieter than Danish
sound spelling.

## Visual and interaction language

- The exercise notebook remains the material and cultural frame.
- Real lesson images MUST clearly reveal the represented object and keep a stable aspect ratio.
- Paper color MUST not dominate the whole experience; image color, blue controls, black ink, and
  teacher-red learning marks provide functional contrast.
- Motion MAY show right-to-left order, joining, placement, or celebration and MUST stay under 1.5s.
- Reduced motion MUST render the same state immediately.
- No decorative animation, autoplay loop, parallax, hover lift, or atmospheric image treatment.
- Repeated controls MUST use stable dimensions so selection and feedback never move the layout.

## Copy and feedback

- Danish MUST use short, warm, concrete verbs and avoid school administration language.
- Buttons MUST name the result: “Byg ordet”, “Prøv igen”, “Vælg et andet ord”.
- Wrong feedback MUST identify the selected tile without a red X, shake, buzzer, or loss.
- The teacher's red MAY indicate the next taught mark or correct position, never learner failure.
- Praise MUST remain specific to the completed action and MUST NOT claim permanent mastery.
- Completion MUST say what the learner made and saved.

## Progress and rewards

- Child collection state MUST be append-only and deduplicated by canonical mission ID.
- Corrupt or unknown stored IDs MUST be ignored without hiding valid collected items.
- Completing a new mission MAY trigger the existing generous completion celebration once.
- Replaying a collected mission MUST remain playable and praised without duplicate collection state.
- No accuracy percentage, failure count, league, countdown, debt count, or streak-loss language.
- The collection MUST be understandable with storage denied; same-session memory behavior is enough.

## Accessibility

- WCAG 2.2 AA and the selected AAA criteria in the existing UX specification remain mandatory.
- Native controls, semantic headings, route titles, route focus, and polite status MUST be used.
- Every author-controlled target MUST be at least 44×44 CSS pixels.
- Tile placement MUST work with touch, pointer, Enter, Space, and screen-reader control activation.
- Visual order, DOM order, accessible names, and Persian logical order MUST agree.
- Selection, correctness, completion, and collected state MUST never rely on color alone.
- Sound and motion MUST be optional; no instruction or result may exist only in either.
- The complete child journey MUST reflow without horizontal page scrolling from 320 CSS pixels.

## Privacy and child safety

- No account, analytics, advertising, behavioral profiling, remote storage, or runtime AI.
- No manipulative notifications, artificial scarcity, purchases, social comparison, or dark patterns.
- Personal content MUST remain optional, editable, deletable, and local under existing profile rules.
- The grown-up journey MUST provide context, not surveillance or a reward-control panel.

## Acceptance evidence

- Unit evidence proves storage normalization, add-only collection, routing, and mission state.
- Browser evidence proves first-use, return, switching, wrong/retry, completion, denied storage,
  keyboard, reduced motion, and responsive layout.
- Visual evidence covers front door, workshop, active build, reveal, and completion.
- A daughter-led observation is required before claiming the tone is validated for her; automated
  tests prove behavior and access, not delight.

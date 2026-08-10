# Danish-Persian Lessons Design Baseline

Status: **frozen at release v0.3.0** (2026-08-09).

This file records the approved product experience. It is the concise design contract for future
work. Detailed specifications remain useful, but when an older plan or specification conflicts with
this file or the released v0.3.0 interface, this baseline takes precedence.

## Product promise

The app helps a curious beginner make sense of Persian writing without making practice feel like an
obligation. It also keeps the complete Danish-Persian course available for a learner who wants more
structure and detail.

- The child path MUST create a recognizable Persian result quickly.
- The learner MUST be free to choose, retry, reveal, switch paths, or stop without penalty.
- Persian accuracy, Danish clarity, accessibility, privacy, and respectful tone MUST not be weakened
  to make the experience more playful.
- The interface MUST remain useful for a child and credible for an adult.

## Information architecture

The app has three persistent learner-facing hubs:

1. **Ord** (`/opdag`) - choose simple words, build them, and keep completed words.
2. **Ordbroer** (`/ord-der-ligner`) - connect Persian and Danish through secure cognates or clearly
   labelled sound mnemonics.
3. **Lektioner** (`/kursus`) - enter the complete, structured course.

The first visit MAY ask the learner to choose the child journey or the complete course. That choice
changes routing and emphasis only. It MUST NOT fork or erase learning data.

## Global navigation

- The three hubs MUST remain in a fixed bottom navigation bar, in the order `Ord`, `Ordbroer`,
  `Lektioner`.
- The bar MUST stay compact: a 44px minimum target height plus device safe-area padding.
- The current hub MUST be identified with text, color, and `aria-current`.
- Settings MUST be available on every app route through one floating gear in the top-right corner.
- The gear MUST float over the page without a full-width top toolbar.
- The gear and its panel MUST not obscure the current task, focused control, or bottom navigation.
- Forward navigation starts at the new page heading. Browser Back restores useful context.
- A new primary hub, top bar, drawer, or competing navigation system requires explicit approval.

## Visual language

The material metaphor is an Iranian exercise notebook, `دفتر مشق`, interpreted with restrained
Danish functional design.

- Matte paper, horizontal blue rules, black ink, and one teacher-red margin line form the page.
- The red margin line sits near the outer left edge on Danish/LTR pages. It MUST NOT make the content
  appear pushed to the right.
- Persian teaching marks and corrections use teacher red. Red is not general decoration.
- Controls use pen blue. Pronunciation hints may use pencil orange.
- Cards are individual learning objects, not decorative containers for whole sections.
- Card corners stay restrained at 6px or less. No nested cards, gradient backgrounds, decorative
  orbs, parallax, or hover-lift effects.
- Content widths remain bounded on wide screens. The interface MUST not become a stretched phone UI.

## Color modes

Light mode uses warm notebook paper. Dark mode uses deep berry paper with pink teaching accents and
cyan controls. The dark appearance MUST remain recognizably pink/berry, not slate, green, brown, or
generic charcoal.

The semantic palette is defined only in `src/styles/tokens.css`. Components MUST use the shared
tokens instead of introducing local color literals. Light, dark, and system modes remain available
from Settings.

## Typography and language

- Persian display words use Noto Naskh Arabic.
- Persian UI and body text use Vazirmatn.
- Danish and other Latin text use Andika, a literacy-oriented typeface.
- Fonts remain self-hosted in the app.
- Persian text MUST use correct `lang`, direction, code points, joining, ZWNJ, and diacritics.
- Persian script is never letter-spaced.
- Type does not scale with viewport width. It reflows within stable responsive containers.
- Danish copy uses short, warm, concrete verbs and the informal `du` form.

## Teaching order

Complete teaching surfaces follow this hierarchy:

1. Persian word or phrase.
2. Danish-friendly sound spelling and IPA.
3. Danish meaning or explanation.
4. A concrete action.

IPA remains available for accuracy but stays visually quieter than Danish sound spelling. Teaching
data comes from canonical lesson entries and MUST NOT be improvised inside components.

## Beginner workshop

The workshop opens with choice, not explanation. It contains:

- thirteen simple, useful words: hello, I, you, friend, water, bread, father, mother, house/home,
  this, that, we, and he/she;
- a separate section for hello, introduction, and goodbye;
- a separate section for Persian numbers 1 through 10;
- a personal collection that acknowledges completed words without locking the others.

Every word card MUST show Persian, Danish meaning, Danish-friendly pronunciation, IPA, and a clear
action. Chromium and Firefox cards also show a meaning illustration. WebKit cards intentionally use
the complete text-only layout because its image renderer is unstable in this view.

Images are local, rights-documented 4:3 assets with stable dimensions and documented credits. Card
thumbnails remain compact. Runtime pages MUST NOT depend on third-party image hosts.

## Word building

A mission uses an explicit model -> guide -> independent recall -> completion sequence.

- The learner is told before starting that the word is built twice.
- Guided work is labelled `1 af 2` and identifies the next useful action.
- Independent recall is labelled `2 af 2` and deliberately removes that guidance.
- A successful independent build adds the word to the collection once.
- Reveal or continue-with-help remains available and MUST NOT claim independent mastery.
- Wrong choices receive an explanation and retry path, never a red X, buzzer, loss, or shame.
- `Færdig for nu` remains an honest exit after completion.

## Word bridges

- Secure historical cognates and sound-only memory bridges MUST remain visibly distinct.
- A memory bridge MUST state that similar sound does not prove shared origin.
- Each bridge keeps Persian, Persian IPA, meaning, Danish, Danish IPA, meaning, and source links.
- New bridges require language review; recognizability alone is not enough for an etymology claim.

## Feedback, rewards, sound, and motion

- Feedback names what changed and keeps the next action nearby.
- Rewards are generous and additive. No streak loss, debt, countdown, league, accuracy pressure, or
  social comparison.
- Motion is reserved for teaching or brief celebration, stays under 1.5 seconds, and never blocks.
- Reduced-motion mode presents the same information immediately.
- Sound starts only after a user gesture, has a persistent setting, and carries no unique instruction.

## Accessibility and responsive behavior

The goal is an AAA-quality learning experience. The measurable floor is WCAG 2.2 AA plus the selected
AAA criteria defined in `docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`.

- Author-controlled targets are at least 44x44 CSS pixels.
- Keyboard focus is visible and logical.
- Touch, pointer, keyboard, and screen-reader operation receive equivalent actions and feedback.
- Meaning, selection, correctness, and progress never rely on color, sound, motion, or images alone.
- Pages reflow without horizontal scrolling from 320px through ultrawide viewports.
- Fixed controls, the settings panel, feedback, and keyboards MUST NOT hide focused content.
- Large text, text-spacing overrides, reduced motion, forced colors, and light/dark modes remain tested.

## Privacy and safety

- Learning data and personal names remain local to the device or current session.
- No account, advertising, analytics, behavioral profiling, remote storage, purchases, or runtime AI.
- Personal content stays optional, editable, and deletable.
- The adult course provides context, not surveillance or reward control over the child.

## What may grow

The app MAY add reviewed simple words, illustrations, audio, lessons, puzzles, bridges, and local
personalization when they follow this contract. Accessibility, performance, language accuracy, and
browser fixes may improve without separate design approval when they preserve the released behavior.

Changing the navigation model, notebook identity, font system, palette character, teaching hierarchy,
two-round learning contract, reward ethics, privacy model, or child-first tone requires an explicit
product decision. Such a change MUST update this file, relevant specifications, tests, visual
baselines, and the release notes in the same change.

## Supporting documents

- `docs/design/ART-DIRECTION.md`
- `docs/pedagogical_approach/RESEARCH-FINDINGS.md`
- `docs/pedagogical_approach/AAA-EXPERIENCE-BLUEPRINT.md`
- `docs/specs/AAA-CHILD-EXPERIENCE-SPEC.md`
- `docs/specs/AAA-UX-ACCESSIBILITY-SPEC.md`
- `docs/specs/AAA-RESPONSIVE-DESIGN-SPEC.md`
- `docs/specs/AAA-LESSON-IMAGE-SPEC.md`

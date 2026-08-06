# AAA Responsive Design Specification

Status: normative for Plan 012. Mobile is the primary use context; tablet, laptop, desktop, split
screen, and ultrawide are first-class presentations of the same learner state and content.

## Baseline defect

The current UI reflows but does not compose. Measured at the same home state, the first lesson card is
254px wide at 320px, 1,359px at 1440px, and 1,839px at 1920px. At 1440px the alphabet detail link and
its grid sit roughly a monitor apart, the letter specimen stretches to 1,359px, and typing places a
phone-sized keyboard below a full-canvas prompt with a large empty gap. P12 MUST close these failures,
not merely add a global `max-width` around them.

## Principles

1. **Mobile first, not mobile only.** The 320–430px experience gets the shortest reach, clearest next
   action, and strongest performance. Larger spaces reveal useful structure instead of enlarged gaps.
2. **One semantic experience.** One DOM, route, content model, and learner state serve every size.
   CSS rearranges presentation without duplicating, hiding, or reordering meaning.
3. **Content chooses breakpoints.** Page media queries establish the shell; component container
   queries adapt reusable cards, grids, detail strips, and exercises to their actual available width.
4. **Bounded expansion.** Reading lines, specimens, cards, grids, choices, and keyboards stop growing
   when added width no longer improves comprehension or control.
5. **State survives space changes.** Resize, rotation, split screen, zoom, and the virtual keyboard do
   not reset a task, selection, input buffer, audio, feedback, or restored scroll position.

## Layout modes

The bands below are acceptance labels, not user-agent or device detection. Components respond to
container width; exact internal transitions MAY occur within ±64px when visual evidence proves a
cleaner fit and all matrix sizes still pass.

| Mode | Viewport inline size | Required composition |
|---|---:|---|
| Narrow | 320–479px | One column; bottom-thumb navigation; dense controls may use the notebook gutter |
| Compact | 480–767px | Centered single column; wider pairs/grids where their container permits |
| Medium | 768–1023px | Bounded sheet; selective two-column cards; no phone proportions stretched |
| Wide | 1024–1599px | Intentional two-column workspace for major surfaces; keyboard and pointer optimized |
| Ultrawide | ≥1600px | Same bounded wide workspace centered in calm outer gutters; no further stretching |

At 200–400% desktop zoom, effective container width—not physical monitor width—selects the mode.

## Responsive foundation

- The app MUST define shared logical sizing tokens in `tokens.css`. Required bounds are: shell
  `80rem`, reading column `42rem`/approximately `70ch`, task surface `52rem`, specimen `34rem`,
  keyboard `34rem`, and secondary rail `18–24rem`. Components MAY be narrower; exceeding a bound
  requires an explicit spec exception and visual approval.
- Inline outer padding is fluid from `1rem` to `4rem`, except the authentic notebook margin gutter.
  At 320px, controls MAY cross into the decorative gutter when necessary, but the red line stays
  singular and Persian/Danish content never clips.
- Narrow/compact sheets are full-bleed. Medium and wider use a centered notebook workspace with a
  one-pixel paper edge; the rules and single red margin line end at the sheet, not the monitor edge.
  Outer gutters use existing paper/card tokens—no gradient, new ornament, or heavy shadow.
- Danish reading text stays between roughly 35 and 70 characters per line. Persian connected text
  uses a reviewer-approved readable measure and never letter-spacing. Full-width backgrounds MAY
  extend; text and controls do not inherit that width.
- Spacing and type use `clamp()` within documented minima/maxima. Viewport units MUST NOT make a card
  or empty pane grow without a content-based maximum on desktop.
- CSS Grid/Flexbox provide fallback. Container queries SHOULD govern reusable components; JavaScript
  viewport checks, UA sniffing, and parallel mobile/desktop component trees are prohibited.

## Surface contracts

### Home

- Narrow/compact: greeting specimen, Continue/current state, then lesson list in one thumb-friendly
  flow. The primary return action remains in the first 360×800 viewport.
- Medium: bound the specimen and lessons; two lesson cards MAY share a row only when each retains a
  comfortable text measure and 44px targets.
- Wide/ultrawide: a 5/7 or similarly balanced two-column workspace. The specimen stays a bounded
  Persian-over-Danish card in one column; Continue, review due state, and lesson/review lists occupy
  the other. Lesson cards form one or two columns and MUST NOT exceed 36rem each.
- `--pane-fa-height: 55dvh` is a phone behavior. Wide mode replaces it with a content-based
  `clamp()` so the hero does not consume most of a desktop viewport or create empty vertical space.

### Orientation and name flows

- Narrow/compact orientation remains stepped and stacked. Wide steps pair explanation and live
  demonstration in two aligned columns while preserving Persian-before-Danish reading order.
- Name capture, spelling choices, editor, settings, and confirmations use a reading column or a
  two-panel form/preview composition; inputs never span the desktop sheet.
- A virtual keyboard or browser autocomplete panel may reduce height without hiding input, help, or
  Save/Skip. Rotation preserves entered name and selected spelling.

### Alphabet and vocabulary indexes

- Narrow/compact: sticky detail strip plus grouped grid. It stays under 25% of a 360×640 viewport.
- Wide: group navigation/grid and a sticky 18–24rem detail rail share the workspace. Updating a tile
  is visible without a monitor-width eye movement or scroll back to the page top.
- Alphabet cells are 3.25–6rem wide; vocabulary cards are 8–18rem wide. `1fr` MUST NOT stretch the
  final row across the remaining desktop width. Groups remain visually distinct notebook sections.
- Internal Persian grids fill RTL; headings, progress, and global navigation retain Danish LTR order.

### Letter, vowel, word, and connected-reading details

- Narrow/compact: one teaching object per flow, Persian first, with bottom navigation reachable.
- Wide: a bounded two-column lesson. The primary specimen/stroke teaching occupies one column;
  contextual explanation, forms, audio, reading cues, and completion occupy the other. The primary
  specimen/card never exceeds 34rem or becomes a banner across the sheet.
- Form tiles, vowel cards, and phrase cards keep intrinsic readable sizes instead of distributing
  themselves across the viewport. Connected text stays in the reading measure.

### Exercises, puzzles, and feedback

- Active tasks remain centered within 52rem. Four choices form a bounded 2×2 grid on compact and wider
  containers; they never become four distant desktop columns.
- Wide mode MAY place prompt/question and post-attempt reveal side by side, only after the reveal
  exists and only when DOM/keyboard order remains question → result → actions.
- Puzzle tiles stay close enough to compare at a glance. Related item, answer area, and action MUST fit
  within one bounded task surface, not opposite screen edges.

### Typing

- Narrow: prompt above a docked writing line and Persian keyboard; the 360×640 occlusion contract
  remains mandatory.
- Medium: keyboard may stay below but is centered and bounded.
- Wide/ultrawide: task/prompt/writing line and the ≤34rem keyboard form two aligned columns. The
  keyboard begins near the active writing line, not hundreds of empty pixels below it. Feedback uses
  the task column; lesson navigation aligns with the workspace.
- Software and physical keyboard input remain concurrent. Changing modes preserves the exact buffer,
  caret, first mismatch, reveal state, and current key detail.

### Navigation, rewards, and overlays

- Mobile bottom navigation includes safe-area padding and remains in the thumb zone. Wide navigation
  is bounded to the sheet/task width and may become non-sticky when all actions remain visible.
- Settings, celebration, reward shelf, dialogs, and teaching reveals have explicit min/max inline and
  block sizes. Overlays center within the visual viewport, reflow at 320px, and never scale to the
  entire desktop monitor.
- Hover may enrich affordance on fine pointers but cannot reveal required content. Focus, selected,
  active, disabled, and completed states remain equally clear for coarse and keyboard input.

## Viewport dynamics and safe areas

- Use logical properties and modern dynamic viewport units with a stable fallback. Account for
  `env(safe-area-inset-*)`, browser chrome, standalone/fullscreen display, and landscape notches.
- The virtual keyboard MUST NOT permanently resize, jump, or cover the writing line. Where supported,
  visual-viewport changes keep the active control and its context visible without page-scale hacks.
- No fixed height may clip translated copy, IPA, Persian marks, 200% text, or a two-line button.
  Minimum heights expand with content.
- Resize/rotation MAY change visual placement but MUST NOT remount a task or move keyboard focus to
  the document start. Animating layout between modes is unnecessary and SHOULD be disabled.

## Visual and geometry test matrix

Geometry tests run at widths `320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440, 1920, 2560` with
representative short/tall heights. Landscape tests run at `640×360`, `844×390`, and `1024×768`.
Desktop tests include 100%, 200%, and 400% zoom/reflow; mobile includes portrait/landscape and an
emulated open virtual keyboard. All run in light/dark and reduced-motion where layout may differ.

Playwright MUST assert at every mode boundary and ±1px:

- no page-level horizontal overflow; no clipped text, marks, focus, or action;
- shell and component max bounds; 35–70ch reading measure; ≥44×44 targets;
- expected one/two-column mode from actual container size;
- no overlap or occlusion by detail, navigation, keyboard, feedback, or overlay;
- state, focus, selection, scroll, and input buffer survive live resize and rotation;
- related controls remain inside the same bounded visual task/lesson region.

Visual snapshots cover home, orientation, index at top/scrolled, detail, active/wrong/correct exercise,
puzzle, typing with/without feedback, name/settings, connected reading, celebration, and session
summary at `320, 390, 768, 1024, 1440, 1920, 2560` in both schemes. The art director approves balance,
the Danish learner approves mobile reach and desktop orientation, and accessibility approves reflow.

## Release acceptance

- Mobile: all core actions are one-handed at 360–430px, fully functional at 320px, safe-area aware,
  and unobscured at 360×640 with browser/keyboard chrome.
- Desktop: at ≥1100px effective container width, home, indexes, detail lessons, and typing use their
  intentional multi-column composition; at narrower/zoomed widths they collapse without loss.
- Ultrawide: the notebook workspace never exceeds 80rem; cards/specimens/keyboards respect their
  bounds; outer space reads as intentional calm, not stretched controls or kilometer-long rules.
- Tablet/split screen: no awkward half-desktop state, final-row stretching, or state reset.
- All automated geometry/snapshot gates and manual real-device/desktop journeys pass with no open
  critical/high defect and no medium defect lacking five-person written sign-off.

## Sources

- [WCAG 2.2 Reflow understanding](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — 320 CSS
  pixel reflow, zoom, and sticky-content considerations.
- [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
  — component adaptation based on available container size.
- [web.dev responsive design basics](https://web.dev/articles/responsive-web-design-basics) — start
  small and add breakpoints where content requires them.

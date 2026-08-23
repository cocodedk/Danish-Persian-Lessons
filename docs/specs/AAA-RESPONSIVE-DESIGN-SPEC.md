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
- **Single column is the base state, multi-column is the enhancement.** Narrow and Compact render one
  column by construction. Every multi-column composition in this document MUST be expressed as
  progressive enhancement over that base, so a container-query-unaware engine, an unresolved container
  size, a disabled or failed stylesheet layer, or 400% zoom degrades to one readable column with the
  documented DOM order intact — never to a clipped, overlapping, or horizontally scrolling grid.
- Multi-column tracks MUST be declared so they can collapse: use `minmax()`, `auto-fit`/`auto-fill`,
  or explicit single-column defaults overridden inside the query. A fixed column count with a fixed
  track width is a defect, because it cannot wrap when the container shrinks.
- **Wrapping is allowed; clipping, truncation, and overflow are not.** Flex and grid containers holding
  text, labels, chips, tags, or action rows MUST wrap rather than shrink their children below a legible
  measure or push them past the container edge. Wrapped rows keep their ≥44×44 targets and visible
  spacing; a wrapped item never overlaps its neighbour or the row below.
- Danish compounds and Persian words MUST NOT be broken mid-word to force a fit. Where a long string
  cannot fit, the container grows, wraps at a word boundary, or the type scale steps down within its
  documented `clamp()` range — in that order. `overflow: hidden`, negative margins, and fixed
  `width`/`height` MUST NOT be used to hide a fit failure.

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

#### Primary destination labels

[DESIGN.md](../../DESIGN.md) owns which hubs exist, their labels, their order, and which arrangement
is active; this section owns only how they are measured and laid out. The active arrangement is either
four destinations or the legacy three, and both MUST satisfy the following at every matrix width.

- On Medium and wider, every destination in the active arrangement MUST render its full Danish label
  as visible text beside or beneath its icon. No destination may be hidden, collapsed into an
  overflow/“more” affordance, reduced to an icon-only control, or ellipsized at these widths.
- The navigation bar sizes for the longest label in the active arrangement — currently `Ordbroer` —
  at the largest supported text scale. Destinations share equal track widths so one long label does
  not compress its neighbours.
- **Compact/mobile fallback.** At Narrow and Compact widths, in landscape phone heights, and at 200%
  text scale, the bar MUST NOT overflow horizontally and MUST NOT truncate a label into an ambiguous
  prefix. In priority order it MAY: reduce inline padding and gap to their documented minima; step the
  label type down within its `clamp()` range to the documented minimum legible size; wrap each label
  onto at most two lines under its icon. Only when all three are exhausted at 320px MAY labels be
  omitted entirely, and then every destination MUST become icon-only together, each with an accessible
  name and a visible current-hub indicator that does not depend on the missing text.
- Mixed states are prohibited: labels are shown for all destinations or for none. Truncation with an
  ellipsis (`Ordbro…`), a fading mask, or a horizontally scrolling nav bar are release defects, since
  two destinations MUST never be distinguishable only by a cut-off string.
- The bar retains its ≥44×44 targets and safe-area padding in every fallback step. Changing viewport
  size or text scale MAY move a destination between these steps but MUST NOT change route, order, or
  `aria-current`.

#### Rails, cards, and lesson content

- A sticky or fixed rail, detail strip, card, dock, or reward shelf MUST NOT overlay, occlude, or
  visually crowd lesson content in any resting state. Rails occupy their own grid or flex track and
  reserve their own space; they MUST NOT be positioned over the content column with `position: fixed`,
  a negative margin, or a translate that lets content pass beneath them.
- The floating settings gear is the one deliberate exception: it floats by design, and its own
  non-obscuring constraint is owned by [DESIGN.md](../../DESIGN.md). This specification adds only that
  its resting position and any panel it opens MUST be placed from the measured chrome geometry below,
  so neither crosses into the reading measure or the bottom navigation at any matrix size.
- Where a rail cannot claim its own track — Narrow and Compact, short landscape heights, high zoom —
  it MUST collapse into the normal document flow above or below the content, or into a dismissible
  surface, rather than float over the lesson. The secondary rail keeps its `18–24rem` bound and never
  steals width from the reading measure below the documented minimum.
- Content regions adjacent to sticky UI MUST end with scrollable padding equal to the measured sticky
  extent, so the last line, the final action, and any completion control can be scrolled fully clear.
  “Reachable by scrolling under the bar” is not clearance.
- Settings, celebration, reward shelf, dialogs, and teaching reveals have explicit min/max inline and
  block sizes. Overlays center within the visual viewport, reflow at 320px, and never scale to the
  entire desktop monitor.
- Hover may enrich affordance on fine pointers but cannot reveal required content. Focus, selected,
  active, disabled, and completed states remain equally clear for coarse and keyboard input.

## Viewport dynamics and safe areas

- Use logical properties and modern dynamic viewport units with a stable fallback. Account for
  `env(safe-area-inset-*)`, browser chrome, standalone/fullscreen display, and landscape notches.
- No fixed height may clip translated copy, IPA, Persian marks, 200% text, or a two-line button.
  Minimum heights expand with content.
- Resize/rotation MAY change visual placement but MUST NOT remount a task or move keyboard focus to
  the document start. Animating layout between modes is unnecessary and SHOULD be disabled.

### Measured chrome clearance

- Page content, sticky rails, docks, anchors, and scroll offsets MUST clear the **actual rendered**
  extent of the header, floating gear, bottom navigation, footer, and keyboard dock, plus the relevant
  `env(safe-area-inset-*)` value. Clearance is computed from measured geometry, not assumed.
- A hard-coded constant such as `3rem`, `48px`, or `56px` standing in for a chrome height is a defect,
  even when it happens to be correct at one width and one text scale. It breaks as soon as a label
  wraps to two lines, the icon set changes, the learner raises text size to 200%, or a device reports
  a non-zero safe-area inset.
- The required mechanism is a single measured source of truth: each fixed or sticky region publishes
  its own rendered block size (for example a runtime custom property fed by `ResizeObserver`, or the
  element's own `offset`/border-box size), and every consumer derives its padding, `inset`,
  `scroll-margin-block`, or `scroll-padding-block` from that value with `calc()` plus the safe-area
  inset. Two independent constants describing the same bar are prohibited.
- The measured value MUST update on resize, rotation, text-scale change, label wrapping, safe-area
  change, and when a region is shown, hidden, or switched between sticky and static. Until a real
  measurement exists, the fallback MUST over-reserve space rather than risk occlusion.
- Scroll containers set `scroll-padding-block` from the same measured values so programmatic scrolls,
  in-page anchors, and `:target` landings never come to rest underneath chrome.

### Focus, anchors, and selection visibility

- No focused control, in-page anchor target, heading landed on after navigation, or currently selected
  item may be wholly or partially obscured by sticky, fixed, or docked UI at any matrix size or zoom
  level. This is the layout obligation behind the selected-AAA criteria listed in the
  [AAA quality bar](AAA-QUALITY-BAR.md); the accessibility requirements themselves are owned there and
  in [AAA-UX-ACCESSIBILITY-SPEC.md](AAA-UX-ACCESSIBILITY-SPEC.md).
- Keyboard, switch, and screen-reader focus moving into a scroll container MUST bring the focused
  element fully into view — its complete focus indicator and its ≥44×44 target, not merely one edge —
  using the measured clearance above rather than the default browser scroll position.
- Anchors and headings receiving focus after forward navigation or Back restoration MUST come to rest
  below the header and above the bottom navigation, with their text and any adjacent action visible
  without a further manual scroll.
- The selected tile, letter, word, choice, or list row MUST remain visible after selection, including
  when selecting causes a detail strip, rail, feedback region, or reward surface to appear. If the new
  surface would cover the selection, the layout reflows or scrolls to keep the selection visible; it
  never leaves the learner with a highlighted item they cannot see.
- The virtual keyboard MUST NOT permanently resize, jump, or cover the writing line. Where supported,
  visual-viewport changes keep the active control and its context visible without page-scale hacks.
- While a virtual keyboard is open, the focused input, its caret, its help/error text, and the primary
  submit or next action MUST all remain within the visual viewport. Clearance uses the visual viewport
  reported by the browser, not the layout viewport, and MUST NOT rely on a fixed keyboard-height
  guess. Where the keyboard's size is unreported, the layout degrades to a scrollable single column
  that can always bring the focused input and its action into view.
- Closing the keyboard MUST restore the previous scroll position and leave no reserved empty band.

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

Automated assertions MUST also prove the contracts above: every destination label fully visible and
non-overflowing in the active arrangement at every matrix width and text scale; multi-column
compositions collapsing to one column when container queries are unavailable; sticky/fixed clearance
derived from measured geometry rather than a constant; and focused, anchored, and selected elements
fully visible with the emulated keyboard open.

The visual-snapshot state inventory, the widths and schemes it covers, and the baseline procedure are
owned by [docs/reviews/VISUAL-REVIEW-PROTOCOL.md](../reviews/VISUAL-REVIEW-PROTOCOL.md). Reviewer
roles and approval/sign-off are owned by the [AAA quality bar](AAA-QUALITY-BAR.md). Neither is
restated here; this specification supplies the responsive facts those reviews are judged against.

## Release acceptance

- Mobile: all core actions are one-handed at 360–430px, fully functional at 320px, safe-area aware,
  and unobscured at 360×640 with browser/keyboard chrome.
- Desktop: at ≥1100px effective container width, home, indexes, detail lessons, and typing use their
  intentional multi-column composition; at narrower/zoomed widths they collapse without loss.
- Ultrawide: the notebook workspace never exceeds 80rem; cards/specimens/keyboards respect their
  bounds; outer space reads as intentional calm, not stretched controls or kilometer-long rules.
- Tablet/split screen: no awkward half-desktop state, final-row stretching, or state reset.
- Navigation: every destination in the active arrangement is fully labelled from Medium upward and
  fits without overflow or ambiguous truncation at 320px and 200% text scale.
- Clearance: no focused control, anchor target, or selected item is obscured by sticky, fixed, or
  keyboard UI, and no chrome clearance is derived from a hard-coded constant.
- All automated geometry/snapshot gates and manual real-device/desktop journeys pass. Severity
  definitions, the exception process, and reviewer sign-off authority are owned by the
  [AAA quality bar](AAA-QUALITY-BAR.md).

## Sources

- [WCAG 2.2 Reflow understanding](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — 320 CSS
  pixel reflow, zoom, and sticky-content considerations.
- [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
  — component adaptation based on available container size.
- [web.dev responsive design basics](https://web.dev/articles/responsive-web-design-basics) — start
  small and add breakpoints where content requires them.

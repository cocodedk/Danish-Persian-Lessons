# AAA Child First-Run Specification

Status: normative interaction and state contract for
[Plan 014](../plans/014-child-first-aaa-experience.md).

## Routes and titles

| Route | H1 | Document title | Primary action |
|---|---|---|---|
| `/` without choice | `Persisk på din måde` | `Vælg din vej · Lær persisk skrift` | `Lav et persisk ord` |
| `/opdag` | `Vælg et persisk ord` | `Ordværksted · Lær persisk skrift` | Open one word mission |
| `/opdag/ord/:id` | Current Danish word | `<word> · Ordværksted` | Current model/build/retry action |
| `/kursus` | Existing `Lær persisk skrift` | Existing course title contract | Existing Continue action |

`/` with a saved choice MUST replace-navigate to that journey. An unknown mission ID MUST
replace-navigate to `/opdag`. Direct lesson URLs MUST remain open.

## Journey persistence

Stored shape:

```ts
interface JourneyPreference {
  choice: 'child' | 'course'
}
```

- Missing, corrupt, or unknown choice means no preference.
- Missing choice plus pre-existing course history routes to `/kursus` as a backward-compatible migration.
- Choosing a front door writes the preference before navigation.
- A journey switch writes only this record.
- Denied storage MUST still preserve the choice for the current session through the shared memory store.

## Collection persistence

Stored shape:

```ts
interface ChildCollection {
  completedMissionIds: string[]
}
```

- Reads MUST keep only known mission IDs, remove duplicates, and preserve canonical mission order.
- Completing a mission MUST union its ID into the record.
- Replay, wrong answer, reveal, exit, and journey switching MUST NOT remove or duplicate an ID.
- An unavailable or corrupt record MUST behave as an empty collection.

## Mission catalog

The first slice contains exactly:

| Mission ID | Catalog entry | Image entry | Danish |
|---|---|---|---|
| `ab` | `vocabulary-1-ab` | `vocabulary-1-ab` | `vand` |
| `nan` | `vocabulary-1-nan` | `vocabulary-1-nan` | `brød` |
| `gol` | `vocabulary-3-gol` | `vocabulary-3-gol` | `blomst` |

Mission declarations MUST reference canonical vocabulary objects rather than repeat Persian, IPA,
Danish sound spelling, meaning, or image metadata.

## Front door

- The primary child option MUST be visible in the first 320×640 viewport.
- It MUST show a real lesson image and a Persian specimen as the product signal.
- Activating it sets `child` and opens `/opdag`.
- The grown-up option sets `course` and opens `/kursus`.
- The two choices MUST be semantically separate controls with predictable labels.
- The screen MUST contain no progress debt, account prompt, age question, or methodology wall.

## Workshop

- Show all three mission choices without locking.
- Each choice MUST include image, Danish meaning, and a short command.
- Persian MAY appear as a visual preview; the card MUST not imply it has already been learned.
- A collected mission MUST say `I din samling` in addition to visual state.
- The collection region MUST list completed words using complete canonical teaching data.
- With no completed mission, the region MUST invite the learner to make the first item.
- `Kursus og noter` MUST switch to the grown-up course and remain secondary.

## Mission state machine

```text
model -> guide -> ready -> recall -> complete
           |                 |
           +-> reveal/wrong  +-> reveal/wrong
```

### Model

- Show the local image and complete teaching card.
- State visibly that the learner will build twice: first with help, then independently.
- The action `Byg ordet` enters Guide.
- Optional reviewed audio MAY be replayed; absence MUST not create empty chrome.

### Guide

- Render one slot per Unicode code point in logical Persian order.
- Label the board `1 af 2` so the learner knows this is the guided round.
- Render one button per source letter, including separate IDs for repeated letters.
- Visually and textually identify the next correct tile.
- A correct activation moves that tile into the next slot and announces the result.
- A wrong activation sets non-color selected state, explains that another tile comes first, shows the
  complete target, and offers `Prøv igen` and `Gå videre`.
- `Prøv igen` returns to the same build with the placed prefix preserved.
- `Gå videre` enters Ready without awarding collection state.
- Completing or continuing Guide enters Ready rather than silently clearing the board.

### Ready

- Acknowledge that the guided round is complete.
- State that one independent build remains and that success adds the word to the collection.
- `Prøv selv` enters Recall; the transition MUST require a deliberate activation.

### Recall

- Clear placed tiles and hide the answer-defining word while keeping image and Danish meaning.
- Label the board `2 af 2` and say that this round is without help.
- Use the same tap-to-place interaction without highlighting the next tile.
- A correct complete build enters Complete.
- A wrong activation follows the same reveal contract and offers Retry or Continue.
- Continue after a wrong Recall enters Complete as `revealed`, saves no collection item, and labels
  the result `Set med hjælp` rather than learned or completed.

### Complete

- A successful Recall appends the mission ID once and triggers a first-completion celebration.
- A replay uses the existing replay praise path and does not duplicate collection or payout.
- Show image, complete teaching card, and an explicit saved artifact statement.
- `Prøv et ord mere` opens `/opdag`.
- `Færdig for nu` opens the child workshop with the collection visible.
- A revealed completion offers the same exits and a clear `Prøv igen` path.

## Deterministic tile order

- Tile tray order MUST be deterministic per mission and different from the target order when possible.
- Duplicate letters MUST have stable unique tile IDs.
- Tests MUST assert logical placement order, not visual CSS coordinates alone.
- RTL visual layout MUST put the first logical Persian code point at the rightmost slot.

## Feedback and focus

- Tile activation MUST update within one interaction frame.
- A polite status MUST announce correct placement, wrong selection, reveal, and completion.
- Pointer activation MUST not unexpectedly move focus.
- Retry MUST return focus to the next usable tile or the build group.
- Route entry MUST focus the H1 through the existing route-effect contract.
- Sticky or fixed UI MUST NOT obscure the active slot, status, Retry, Continue, or exits.

## Responsive bounds

- At 320–430 px, mission cards are one column and the current build is entirely usable without
  horizontal scroll.
- At 768 px and above, workshop choices MAY use three columns; the mission image and build MAY form
  a two-column workspace while DOM order remains model/image before action.
- Images MUST use a stable 4:3 or catalog-defined ratio and MUST not resize after loading.
- Persian tiles and slots MUST use stable min/max dimensions; feedback MUST not move the tray.
- At 200% zoom, the flow MUST reflow to one column and preserve every action.

## Browser acceptance journeys

1. New storage → choose child → choose `آب` → model → guide → recall → collect → done.
2. Return to `/` → saved child choice opens `/opdag` without flashing the front door.
3. Switch to course → orientation/course behavior remains intact → switch back.
4. Existing course storage without a journey record opens `/kursus` without disrupting prior work.
5. Wrong tile in Guide → selected state and reveal → Retry → continue correctly.
6. Wrong tile in Recall → reveal → Continue → no collection item or payout.
7. Replay a collected mission → no duplicate collection or completion payout.
8. Denied localStorage → complete mission → same-session collection remains visible.
9. Keyboard-only completion at 320×640 and 200% zoom.
10. Reduced-motion and sound-off completion with equivalent information.
11. Unknown mission ID returns to the workshop with no error or corrupt state.

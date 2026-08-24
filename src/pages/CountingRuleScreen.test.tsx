// The rule lesson page (plan 017, fixpoint A item 3), on the real 21-99
// descriptor and its real store — nothing here is a fixture, so a change to
// either shows up as a failure on this page rather than in a mock.
//
// The Persian, the lydskrift and the IPA these rows carry are candidate
// drafts, so this suite asserts none of them. It checks that each row is on
// screen by its catalog id, and that the Danish scaffolding around it — the
// candidate warning, the boundaries, the progress arithmetic and the marking
// rules — says what the lesson contracts it says.
import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CountingRuleScreen } from './CountingRuleScreen'
import { counting21to99Lesson as lesson } from '../lessons/counting21to99'
import { counting21to99Progress as store } from '../progress/countingRules'
import { RULE_BUILD_TITLE, RULE_RECOGNITION_TITLES } from '../lessons/countingRuleExercises'
import { findPronunciationAudio } from '../audio/manifest'

/** The foundation's twenty: referenced by the lesson, owned by lesson 1. */
const REFERENCED_ID = 'number-20-word'

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={[lesson.path]}>
      <CountingRuleScreen lesson={lesson} store={store} />
    </MemoryRouter>,
  )
}

function row(container: HTMLElement, entryId: string): HTMLElement {
  return container.querySelector<HTMLElement>(`[data-entry-id="${entryId}"]`)!
}

function markName(da: string): string {
  return `Jeg har gennemgået ${da}`
}

function counted(): HTMLElement {
  return screen.getByText(`dele gennemgået eller øvet`, { exact: false })
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('the counting rule lesson page', () => {
  it('says what the lesson is and what the rule is, in the words the descriptor supplies', () => {
    renderScreen()

    expect(screen.getByRole('heading', { name: lesson.title })).toBeInTheDocument()
    expect(screen.getByText(lesson.summary)).toBeInTheDocument()
    expect(screen.getByText(lesson.rule)).toBeInTheDocument()
  })

  it('says out loud that the page is a draft for internal review only', () => {
    renderScreen()

    const warning = screen.getByText(/kun til intern gennemgang før udgivelse/)
    expect(warning).toBeVisible()
    expect(warning).toHaveTextContent(/venter på en menneskelig gennemgang/)
  })

  it('recommends the lesson it builds on with a live link, and gates nothing', () => {
    renderScreen()

    const link = screen.getByRole('link', { name: `Til ${lesson.buildsOn.labelDa}` })
    expect(lesson.buildsOn.path).toBe('/lesson/taelle')
    expect(link).toHaveAttribute('href', lesson.buildsOn.path)
    expect(link).not.toHaveAttribute('aria-disabled')
    expect(screen.getByText(/intet er låst/)).toBeInTheDocument()
  })

  it('states where the range stops in both directions', () => {
    renderScreen()

    expect(lesson.boundaryNotes).toHaveLength(2)
    for (const note of lesson.boundaryNotes) {
      expect(screen.getByText(note)).toBeInTheDocument()
    }
  })

  it('shows the joining element, every decade base form and all four examples', () => {
    const { container } = renderScreen()

    expect(row(container, lesson.joiner.id)).toBeInTheDocument()

    expect(lesson.baseForms.map((base) => base.value))
      .toEqual([20, 30, 40, 50, 60, 70, 80, 90])
    for (const base of lesson.baseForms) {
      expect(row(container, base.entry.id)).toBeInTheDocument()
    }

    expect(lesson.examples).toHaveLength(4)
    for (const example of lesson.examples) {
      expect(row(container, example.entry.id)).toBeInTheDocument()
    }
  })

  it('counts against everything the store owns, and keeps the build targets unseen', () => {
    const { container } = renderScreen()

    expect(counted()).toHaveTextContent(`0 af ${store.ids.length} dele`)
    expect(screen.getByText(new RegExp(`${lesson.targets.length} tal mere venter`)))
      .toBeInTheDocument()
    for (const target of lesson.targets) {
      expect(container.querySelector(`[data-entry-id="${target.entry.id}"]`)).toBeNull()
    }
  })

  it('keeps all three rounds one tap away, on the route the lesson names', () => {
    renderScreen()

    const expected = [
      ...Object.entries(RULE_RECOGNITION_TITLES).map(([kind, title]) => [title, kind] as const),
      [RULE_BUILD_TITLE, 'byg'] as const,
    ]
    expect(expected).toHaveLength(3)
    for (const [title, kind] of expected) {
      expect(screen.getByRole('link', { name: title }))
        .toHaveAttribute('href', `${lesson.path}/ovelse/${kind}`)
    }
  })

  it('leaves the referenced twenty to the lesson that teaches it', () => {
    const { container } = renderScreen()

    const referenced = row(container, REFERENCED_ID).closest('li')!
    expect(within(referenced).getByText('Hører til en tidligere lektion — tælles der.'))
      .toBeInTheDocument()
    expect(within(referenced).queryByText(new RegExp(lesson.buildsOn.labelDa))).toBeNull()
    expect(within(referenced).queryByRole('button')).not.toBeInTheDocument()
    expect(store.ids).not.toContain(REFERENCED_ID)
  })

  it('records exactly the row the learner marks, and remembers it next visit', () => {
    const marked = lesson.examples[0].entry
    const first = renderScreen()

    fireEvent.click(screen.getByRole('button', { name: markName(marked.da) }))

    expect(store.get().words).toEqual([marked.id])
    expect(counted()).toHaveTextContent(`1 af ${store.ids.length} dele`)
    first.unmount()

    const { container } = renderScreen()
    expect(counted()).toHaveTextContent(`1 af ${store.ids.length} dele`)
    const kept = row(container, marked.id).closest('li')!
    expect(within(kept).queryByRole('button')).not.toBeInTheDocument()
    expect(within(kept).getByRole('img', { name: 'Gennemgået' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: markName(lesson.examples[1].entry.da) }))
      .toBeInTheDocument()
  })

  it('offers released audio for every teaching row', async () => {
    renderScreen()

    const visible = [lesson.joiner,
      ...lesson.baseForms.map((base) => base.entry),
      ...lesson.examples.map((example) => example.entry)]
    expect(visible.every((entry) => findPronunciationAudio(entry.audioId))).toBe(true)
    expect(await screen.findAllByRole('button', { name: /^Hør / })).toHaveLength(visible.length)
  })
})

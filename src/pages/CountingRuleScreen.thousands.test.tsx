// The rule lesson page on the tusinder descriptor (plan 017, fixpoint C).
//
// Lesson 4 is the case that breaks a naive attribution: the joiner it reuses
// belongs to lesson 2 (21-99), while the lesson builds on lesson 3 (100-900).
// This suite pins that the reused row claims neither — it says it belongs to
// an earlier lesson, offers no action, and counts nowhere on this page.
import { beforeEach, describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CountingRuleScreen } from './CountingRuleScreen'
import { countingThousandsLesson as lesson } from '../lessons/countingThousands'
import { countingThousandsProgress as store } from '../progress/countingRules'

const REFERENCED_NOTE = 'Hører til en tidligere lektion — tælles der.'

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={[lesson.path]}>
      <CountingRuleScreen lesson={lesson} store={store} />
    </MemoryRouter>,
  )
}

/** The joiner's own row, scoped — several referenced rows share this text. */
function joinerRow(container: HTMLElement): HTMLElement {
  return container
    .querySelector<HTMLElement>(`[data-entry-id="${lesson.joiner.id}"]`)!
    .closest('li')!
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('the tusinder lesson page and the joiner it borrows', () => {
  it('borrows its joiner from 21-99 while building on 100-900', () => {
    expect(lesson.joiner.id.startsWith(lesson.idPrefix)).toBe(false)
    expect(lesson.joiner.id.startsWith('counting-2199-')).toBe(true)
    expect(lesson.buildsOn.labelDa).toBe('regnereglen 100-900')
  })

  it('credits the joiner to an earlier lesson, not to the one it builds on', () => {
    const { container } = renderScreen()
    const borrowed = within(joinerRow(container))

    expect(borrowed.getByText(REFERENCED_NOTE)).toBeInTheDocument()
    expect(borrowed.queryByText(/100-900/)).toBeNull()
    expect(borrowed.queryByText(new RegExp(lesson.buildsOn.labelDa))).toBeNull()
  })

  it('offers the learner nothing to mark on a row it does not own', () => {
    const { container } = renderScreen()

    expect(within(joinerRow(container)).queryByRole('button')).toBeNull()
  })

  it('keeps the borrowed joiner out of the count this lesson owns', () => {
    renderScreen()

    expect(store.ids).not.toContain(lesson.joiner.id)
    expect(store.ids.every((id) => id.startsWith(lesson.idPrefix))).toBe(true)
  })
})

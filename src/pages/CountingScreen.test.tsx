// "Tæl til tyve" (plan 016): the lesson page itself. Browsing a number shows
// it and costs nothing; saying you have been through it is a separate tap
// that moves the count. What the exercise rounds pay is counting.test.ts.
import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { countingNumbers } from '../lessons/numbers'
import { freshVocabState, open } from './vocabHarness'

const TOTAL = countingNumbers.length
const MARK = 'Jeg har gennemgået tallet'

freshVocabState()

/** The teaching card at the top, which follows the selected number. */
function detailStrip(container: HTMLElement): HTMLElement {
  return container.querySelector<HTMLElement>('.entry-detail--master')!
}

function shownEntryId(container: HTMLElement): string | null {
  return detailStrip(container).getAttribute('data-entry-id')
}

function counted(): HTMLElement {
  return screen.getByText(`${TOTAL} tal gennemgået eller øvet`, { exact: false })
}

describe('the counting lesson page', () => {
  it('opens on number one and renders it from the canonical catalog entry', () => {
    const { container } = open('#/lesson/taelle')

    expect(screen.getByRole('heading', { name: 'Tæl til tyve' })).toBeInTheDocument()
    expect(shownEntryId(container)).toBe('number-1-word')
    // The card is built from the entry itself: meaning, lydskrift and IPA.
    expect(detailStrip(container)).toHaveTextContent('en')
    expect(detailStrip(container)).toHaveTextContent('jek · [jek]')
    expect(counted()).toHaveTextContent(`0 af ${TOTAL}`)
  })

  it('does not promise sound for the numbers it has none for', () => {
    open('#/lesson/taelle')
    const lead = screen.getByText(/Tæl med, fra 1 til 20/)
    expect(lead).not.toHaveTextContent('høre')
  })

  it('browses a number without marking any progress', () => {
    const { container } = open('#/lesson/taelle')

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet fem' }))

    expect(shownEntryId(container)).toBe('number-5-word')
    expect(counted()).toHaveTextContent(`0 af ${TOTAL}`)
    expect(screen.getByRole('button', { name: MARK })).toBeInTheDocument()
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
  })

  it('moves the selection on to a teen number', () => {
    const { container } = open('#/lesson/taelle')

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet fem' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet sytten' }))

    expect(shownEntryId(container)).toBe('number-17-word')
    expect(screen.getByRole('button', { name: 'Vælg tallet sytten' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('counts a number only when the learner says so, and remembers which one', () => {
    const first = open('#/lesson/taelle')

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet tretten' }))
    fireEvent.click(screen.getByRole('button', { name: MARK }))

    expect(counted()).toHaveTextContent(`1 af ${TOTAL}`)
    expect(screen.queryByRole('button', { name: MARK })).not.toBeInTheDocument()
    first.unmount()

    // The next visit still has it, and it is number thirteen that is cleared.
    const again = open('#/lesson/taelle')
    expect(counted()).toHaveTextContent(`1 af ${TOTAL}`)
    expect(screen.getByRole('button', { name: MARK })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet tretten' }))
    expect(shownEntryId(again.container)).toBe('number-13-word')
    expect(screen.queryByRole('button', { name: MARK })).not.toBeInTheDocument()
    expect(screen.getByText('Gennemgået')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gennemgået' })).toBeInTheDocument()
  })

  it('offers a fresh marking action after the selection moves on', () => {
    open('#/lesson/taelle')

    fireEvent.click(screen.getByRole('button', { name: MARK }))
    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet tyve' }))

    expect(screen.getByRole('button', { name: MARK })).toBeInTheDocument()
    expect(counted()).toHaveTextContent(`1 af ${TOTAL}`)
  })

  it('celebrates only the number just marked, and only while it is selected', () => {
    const { container } = open('#/lesson/taelle')

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet otte' }))
    fireEvent.click(screen.getByRole('button', { name: MARK }))

    // One tick for the moment, not a celebration plus a static copy beside it.
    expect(container.querySelector('.celebration')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Gennemgået' })).toHaveLength(1)

    // Browsing on leaves nothing of it behind — and it does not come back.
    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet ni' }))
    expect(container.querySelector('.celebration')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: MARK })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Vælg tallet otte' }))
    expect(container.querySelector('.celebration')).not.toBeInTheDocument()
    expect(screen.getByText('Gennemgået')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gennemgået' })).toBeInTheDocument()
  })

  it('keeps both exercise rounds one tap away', () => {
    open('#/lesson/taelle')

    for (const title of ['Find betydningen', 'Find tallet']) {
      expect(screen.getByRole('link', { name: title })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('button', { name: /^Vælg tallet /})).toHaveLength(TOTAL)
  })
})

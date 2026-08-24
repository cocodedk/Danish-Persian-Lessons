import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { countingLesson } from '../lessons/countingLesson'
import { getJourneyChoice } from '../progress/journey'
import { AreaNav } from './AreaNav'

function renderNav(path = '/opdag') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<AreaNav />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

const NAV_SIZE = '--area-nav-block-size'
const navSize = () => document.documentElement.style.getPropertyValue(NAV_SIZE)

describe('AreaNav', () => {
  it('keeps the four hubs in one stable order and marks the current page', () => {
    renderNav('/opdag')
    const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.textContent)).toEqual(['Tal', 'Ord', 'Ordbroer', 'Skrift'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/tal', '/opdag', '/ord-der-ligner', '/kursus'])
    expect(within(nav).getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
  })

  it('preserves the chosen journey when moving between the shared hubs', () => {
    renderNav('/ord-der-ligner')
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: 'Skrift' }))
    expect(getJourneyChoice()).toBe('script')
    expect(screen.getByRole('link', { name: 'Skrift' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: 'Ord' }))
    expect(getJourneyChoice()).toBe('words')
  })

  it('keeps child word pages and lesson pages inside their parent destination', () => {
    const { unmount } = renderNav('/opdag/ord/ab')
    expect(screen.getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
    unmount()

    renderNav('/lesson/alphabet')
    expect(screen.getByRole('link', { name: 'Skrift' })).toHaveAttribute('aria-current', 'page')
  })

  // The counting lesson lives on a /lesson/ path but is taught by Tal; both
  // hubs matching would leave the learner with two «you are here» marks.
  it.each([countingLesson.path, `${countingLesson.path}/ovelse/tal`])(
    'keeps %s under Tal alone', (path) => {
      renderNav(path)
      const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
      const current = within(nav).getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page')

      expect(current.map((link) => link.textContent)).toEqual(['Tal'])
    },
  )
})

describe('AreaNav clearance measurement', () => {
  const nativeObserver = globalThis.ResizeObserver

  afterEach(() => {
    globalThis.ResizeObserver = nativeObserver
    document.documentElement.style.removeProperty(NAV_SIZE)
  })

  it('publishes nothing when the environment cannot measure, leaving the CSS fallback', () => {
    // jsdom has no ResizeObserver and no layout; over-reserving in CSS is the safe path.
    Reflect.deleteProperty(globalThis, 'ResizeObserver')
    renderNav('/opdag')
    expect(navSize()).toBe('')
  })

  it('publishes the measured border-box height and cleans it up on unmount', () => {
    const observed: Element[] = []
    let notify = () => {}
    globalThis.ResizeObserver = class {
      constructor(callback: () => void) { notify = callback }
      observe(target: Element) { observed.push(target) }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    const { unmount } = renderNav('/opdag')
    const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
    // The border box is what the nav occupies; its safe-area padding is already inside it.
    vi.spyOn(nav, 'getBoundingClientRect').mockReturnValue({ height: 64 } as DOMRect)

    expect(observed).toEqual([nav])
    notify()
    expect(navSize()).toBe('64px')

    unmount()
    expect(navSize()).toBe('')
  })
})

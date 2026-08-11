import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
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
})

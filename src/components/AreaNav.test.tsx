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
  it('keeps the three hubs in one stable order and marks the current page', () => {
    renderNav('/opdag')
    const nav = screen.getByRole('navigation', { name: 'Hovedområder' })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.textContent)).toEqual(['Byg ord', 'Ordbroer', 'Kursus'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/opdag', '/ord-der-ligner', '/kursus'])
    expect(within(nav).getByRole('link', { name: /Byg ord/ })).toHaveAttribute('aria-current', 'page')
  })

  it('preserves the chosen journey when moving between the shared hubs', () => {
    renderNav('/ord-der-ligner')
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: 'Kursus og noter' }))
    expect(getJourneyChoice()).toBe('course')
    expect(screen.getByRole('link', { name: 'Kursus og noter' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(screen.getByRole('link', { name: /Byg ord/ }))
    expect(getJourneyChoice()).toBe('child')
  })
})

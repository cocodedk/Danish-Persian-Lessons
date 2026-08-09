import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildHome from './ChildHome'
import { addCollectedMission } from '../progress/childCollection'
import { getJourneyChoice } from '../progress/journey'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/opdag']}>
      <Routes>
        <Route path="/opdag" element={<ChildHome />} />
        <Route path="/kursus" element={<h1>Hele kurset</h1>} />
        <Route path="/ord-der-ligner" element={<h1>Ordbroer</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

describe('ChildHome', () => {
  it('offers exactly three open word missions and a calm empty collection', () => {
    renderHome()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Vælg vand' })).toHaveAttribute('href', '/opdag/ord/ab')
    expect(screen.getByRole('link', { name: 'Vælg brød' })).toHaveAttribute('href', '/opdag/ord/nan')
    expect(screen.getByRole('link', { name: 'Vælg blomst' })).toHaveAttribute('href', '/opdag/ord/gol')
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('href', '/ord-der-ligner')
    expect(screen.getByRole('link', { name: /Byg ord/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Dit første ord venter ovenfor.')).toBeInTheDocument()
  })

  it('opens the word bridges directly from the workshop', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Ordbroer' }))
    expect(screen.getByRole('heading', { name: 'Ordbroer' })).toBeInTheDocument()
  })

  it('marks a collected mission in text without locking the others', () => {
    addCollectedMission('ab')
    renderHome()
    expect(within(screen.getByRole('link', { name: 'Vælg vand' })).getByText('I din samling')).toBeVisible()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(3)
  })

  it('switches deliberately to the grown-up course', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Kursus og noter' }))
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('course')
  })
})

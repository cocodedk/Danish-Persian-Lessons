import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import JourneyGate from './JourneyGate'
import { getJourneyChoice, setJourneyChoice } from '../progress/journey'
import { writeJSON } from '../progress/storage'

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<JourneyGate />} />
        <Route path="/opdag" element={<h1>Ordværksted</h1>} />
        <Route path="/kursus" element={<h1>Hele kurset</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

describe('JourneyGate', () => {
  it('makes the child action primary and saves that choice before navigation', () => {
    renderGate()
    expect(screen.getByRole('heading', { name: 'Persisk på din måde' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Lav et persisk ord' }))
    expect(screen.getByRole('heading', { name: 'Ordværksted' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('words')
  })

  it('opens and saves the grown-up course choice', () => {
    renderGate()
    fireEvent.click(screen.getByRole('button', { name: 'Åbn kursus og noter' }))
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })

  it('routes a returning learner through the saved front door', () => {
    setJourneyChoice('words')
    renderGate()
    expect(screen.getByRole('heading', { name: 'Ordværksted' })).toBeInTheDocument()
    expect(screen.queryByText('Persisk på din måde')).not.toBeInTheDocument()
  })

  it('keeps pre-choice course learners with their existing work', () => {
    writeJSON('profile', { name: 'Sara' })
    renderGate()
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildWordMission from './ChildWordMission'
import { getChildCollection } from '../progress/childCollection'
import { getRewards } from '../rewards/engine'

function renderMission(path = '/opdag/ord/ab') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/opdag/ord/:id" element={<ChildWordMission />} />
        <Route path="/opdag" element={<h1>Vælg et persisk ord</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

function finishGuideAndRecall() {
  expect(screen.getByText('Du bygger ordet to gange: først med hjælp, så selv.')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Byg ordet' }))
  fireEvent.click(screen.getByRole('button', { name: 'Vælg آ, næste tegn' }))
  fireEvent.click(screen.getByRole('button', { name: 'Vælg ب, næste tegn' }))
  expect(screen.getByRole('heading', { name: 'Du byggede ordet med hjælp' })).toBeVisible()
  expect(screen.getByText('Byg det én gang selv, så kommer det i din samling.')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Prøv selv' }))
  expect(screen.getByText('2 af 2 · Byg ordet uden hjælp.')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Vælg آ' }))
  fireEvent.click(screen.getByRole('button', { name: 'Vælg ب' }))
}

beforeEach(() => window.localStorage.clear())

describe('ChildWordMission', () => {
  it('models, guides, retrieves, and permanently collects the word', () => {
    renderMission()
    expect(screen.getByRole('heading', { name: 'vand' })).toBeInTheDocument()
    expect(screen.getByText('آب')).toBeInTheDocument()

    finishGuideAndRecall()

    expect(document.querySelector('.child-word__saved')).toHaveTextContent('Nu er آب i din samling.')
    expect(getChildCollection()).toEqual(['ab'])
    expect(getRewards().points).toBe(20)
    expect(screen.getByRole('link', { name: 'Prøv et ord mere' })).toHaveAttribute('href', '/opdag')
    expect(screen.getByRole('link', { name: 'Færdig for nu' })).toHaveAttribute('href', '/opdag')
  })

  it('shows a local selected state and complete recovery after a wrong guided tile', () => {
    renderMission()
    fireEvent.click(screen.getByRole('button', { name: 'Byg ordet' }))
    const wrong = screen.getByRole('button', { name: 'Vælg ب' })
    fireEvent.click(wrong)

    expect(wrong).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Et andet tegn kommer først.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Prøv igen' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Gå videre' })).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Prøv igen' }))
    expect(screen.getByRole('button', { name: 'Vælg آ, næste tegn' })).toBeVisible()
  })

  it('does not collect a recall that the learner continues after revealing', () => {
    renderMission()
    fireEvent.click(screen.getByRole('button', { name: 'Byg ordet' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vælg آ, næste tegn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vælg ب, næste tegn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Prøv selv' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vælg ب' }))
    fireEvent.click(screen.getByRole('button', { name: 'Gå videre' }))

    expect(screen.getByText('Set med hjælp')).toBeVisible()
    expect(getChildCollection()).toEqual([])
    expect(getRewards().points).toBe(0)
  })

  it('praises a replay without duplicating its collection or payout', () => {
    const first = renderMission()
    finishGuideAndRecall()
    expect(getRewards().points).toBe(20)
    first.unmount()

    renderMission()
    finishGuideAndRecall()
    expect(getChildCollection()).toEqual(['ab'])
    expect(getRewards().points).toBe(20)
  })

  it('returns an unknown mission to the workshop', () => {
    renderMission('/opdag/ord/unknown')
    expect(screen.getByRole('heading', { name: 'Vælg et persisk ord' })).toBeInTheDocument()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { RouteEffects } from './RouteEffects'

function BackButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>Tilbage</button>
}

function Harness() {
  return (
    <MemoryRouter initialEntries={['/one']}>
      <RouteEffects />
      <Routes>
        <Route
          path="/one"
          element={
            <main>
              <h1>Første side</h1>
              <Link to="/two">Videre</Link>
            </main>
          }
        />
        <Route
          path="/two"
          element={
            <main>
              <h1>Anden side</h1>
              <BackButton />
            </main>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.mocked(window.scrollTo).mockClear()
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
})

describe('RouteEffects', () => {
  it('starts a forward route at the top and focuses its heading', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('link', { name: 'Videre' }))

    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Anden side' })).toHaveFocus())
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'auto' })
    expect(document.title).toBe('Anden side · Lær persisk')
  })

  it('restores the prior scroll position on browser history navigation', async () => {
    render(<Harness />)
    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Første side' })).toHaveFocus())
    Object.defineProperty(window, 'scrollY', { value: 420, writable: true })
    fireEvent.click(screen.getByRole('link', { name: 'Videre' }))
    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Anden side' })).toHaveFocus())

    fireEvent.click(screen.getByRole('button', { name: 'Tilbage' }))
    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Første side' })).toHaveFocus())
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 420, left: 0, behavior: 'auto' })
  })
})

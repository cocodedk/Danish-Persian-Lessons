import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffect, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { RouteEffects } from './RouteEffects'

function BackButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>Tilbage</button>
}

function DelayedPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 50)
    return () => window.clearTimeout(timer)
  }, [])

  return ready ? <main><h1>Sen side</h1></main> : <main><p>Henter siden …</p></main>
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
        <Route path="/lazy" element={<DelayedPage />} />
        <Route
          path="/two"
          element={
            <main>
              <h1>Anden side</h1>
              <Link to="/lazy">Åbn sen side</Link>
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

  it('focuses a heading that appears after a small page file loads', async () => {
    render(<Harness />)

    fireEvent.click(screen.getByRole('link', { name: 'Videre' }))
    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Anden side' })).toHaveFocus())

    // This route first shows only its loading message, as a lazy page does.
    fireEvent.click(screen.getByRole('link', { name: 'Åbn sen side' }))

    await vi.waitFor(() => expect(screen.getByRole('heading', { name: 'Sen side' })).toHaveFocus())
    expect(document.title).toBe('Sen side · Lær persisk')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render as rtlRender, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

/** The forside links into the lessons, so it needs a router around it. */
function render(ui: React.ReactElement) {
  return rtlRender(<MemoryRouter>{ui}</MemoryRouter>)
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('Home', () => {
  it('shows the skippable name-capture screen on first launch', () => {
    render(<Home />)
    expect(screen.getByText('نام تو چیست؟')).toBeInTheDocument()
    expect(screen.getByLabelText('Hvad hedder du?')).toBeInTheDocument()
  })

  it('skip path: leaves the app fully usable, greeting plainly with no name', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Spring over'))

    expect(screen.queryByText('نام تو چیست؟')).not.toBeInTheDocument()
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('Hej!')).toBeInTheDocument()
    // The demo pair still renders with its pronunciation line.
    expect(screen.getByText('آب')).toBeInTheDocument()
    expect(screen.getByText('åb · [ɒːb]')).toBeInTheDocument()
  })

  it('skip path is permanent-quiet: a later mount never asks again', () => {
    const { unmount } = render(<Home />)
    fireEvent.click(screen.getByText('Spring over'))
    unmount()

    render(<Home />)
    expect(screen.queryByText('نام تو چیست؟')).not.toBeInTheDocument()
    expect(screen.getByText('Hej!')).toBeInTheDocument()
  })

  it('once a name is given, the Danish pane greets by name and the Persian pane still says only سلام!', () => {
    render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Sara' },
    })
    fireEvent.click(screen.getByText('Gem'))

    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    expect(screen.getByText('سلام!')).toBeInTheDocument()
  })

  it('the Persian greeting never renders the Latin name (only the pronunciation line does, by design)', () => {
    render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Sara' },
    })
    fireEvent.click(screen.getByText('Gem'))

    const faPane = document.querySelector('[lang="fa"]')
    expect(faPane).not.toBeNull()
    const greeting = faPane?.querySelector('.split-card__greeting')
    expect(greeting?.textContent).toBe('سلام!')
    expect(greeting?.textContent ?? '').not.toMatch(/[A-Za-z]/)
  })

  it('names with æ/ø/å round-trip correctly through capture, greeting, and reload', () => {
    for (const name of ['Mette', 'Søren']) {
      window.localStorage.clear()
      const { unmount } = render(<Home />)
      fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
        target: { value: name },
      })
      fireEvent.click(screen.getByText('Gem'))
      expect(screen.getByText(`Hej ${name}!`)).toBeInTheDocument()
      unmount()

      render(<Home />)
      expect(screen.getByText(`Hej ${name}!`)).toBeInTheDocument()
      unmount()
    }
  })

  it('the name persists across a reload and is shown on the settings corner', () => {
    const { unmount } = render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Babak' },
    })
    fireEvent.click(screen.getByText('Gem'))
    unmount()

    render(<Home />)
    expect(screen.getByText('Hej Babak!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Babak' })).toBeInTheDocument()
  })

  it('puts the forside on the ruled sheet and lists the alphabet lesson with its progress', () => {
    const { container } = render(<Home />)
    fireEvent.click(screen.getByText('Spring over'))

    expect(container.querySelectorAll('.ruled-section')).toHaveLength(1)
    const lesson = screen.getByRole('link', { name: /Alfabetet/ })
    expect(lesson).toHaveAttribute('href', '/lesson/alphabet')
    expect(screen.getByText('0 af 39 klaret')).toBeInTheDocument()
  })

  it('deleting the name from the settings corner reverts the greeting to plain Hej!', () => {
    render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Babak' },
    })
    fireEvent.click(screen.getByText('Gem'))

    fireEvent.click(screen.getByRole('button', { name: 'Babak' }))
    fireEvent.click(screen.getByText('Slet'))

    expect(screen.getByText('Hej!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Indstillinger' })).toBeInTheDocument()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render as rtlRender, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import App from '../App'
import { markOrientationSeen } from '../progress/alphabet'
import { completeAlphabet } from './typingHarness'
import { setProfile } from '../progress/profile'

/** The forside links into the lessons, so it needs a router around it. */
function render(ui: React.ReactElement) {
  return rtlRender(<MemoryRouter>{ui}</MemoryRouter>)
}

beforeEach(() => {
  window.localStorage.clear()
  markOrientationSeen()
  completeAlphabet()
})

describe('Home', () => {
  it('opens orientation before asking for a name on a true first launch', () => {
    window.localStorage.clear()
    window.location.hash = ''
    rtlRender(<App />)
    expect(screen.getByRole('heading', { name: 'Sådan virker persisk skrift' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Hvad hedder du?')).not.toBeInTheDocument()
  })

  it('shows the skippable name capture after the alphabet in the recommended flow', () => {
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

  it('once a Latin name is given, Danish uses it while Persian stays plain until spelling', () => {
    render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Sara' },
    })
    fireEvent.click(screen.getByText('Gem'))

    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.queryByText('سارا')).not.toBeInTheDocument()
  })

  it('never fabricates whole-name pronunciation in the Persian greeting', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    render(<Home />)

    const greeting = document.querySelector('.split-card__greeting')
    expect(greeting?.querySelectorAll('[lang="fa"]')).toHaveLength(2)
    expect(greeting?.textContent).toContain('سلام، سارا!')
    expect(greeting?.textContent).toContain('salåm · [sælɒːm]')
    expect(greeting?.textContent).not.toContain('sårå')
  })

  it('names with æ/ø/å round-trip correctly through capture, greeting, and reload', () => {
    for (const name of ['Mette', 'Søren']) {
      window.localStorage.clear()
      markOrientationSeen()
      completeAlphabet()
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
    expect(screen.getByRole('button', { name: 'Indstillinger for Babak' })).toBeInTheDocument()
  })

  it('puts the forside on the ruled sheet and lists the alphabet lesson with its progress', () => {
    window.localStorage.clear()
    setProfile({})
    markOrientationSeen()
    const { container } = render(<Home />)

    expect(container.querySelectorAll('.ruled-section')).toHaveLength(1)
    const lesson = screen.getByRole('link', { name: /Alfabetet/ })
    expect(lesson).toHaveAttribute('href', '/lesson/alphabet')
    expect(screen.getByText('0 af 39 set eller øvet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ord, der ligner/ })).toHaveAttribute(
      'href',
      '/ord-der-ligner',
    )
  })

  it('deleting the name from the settings corner reverts the greeting to plain Hej!', () => {
    render(<Home />)
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), {
      target: { value: 'Babak' },
    })
    fireEvent.click(screen.getByText('Gem'))

    fireEvent.click(screen.getByRole('button', { name: 'Indstillinger for Babak' }))
    fireEvent.click(screen.getByText('Slet'))

    expect(screen.getByText('Hej!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Indstillinger' })).toBeInTheDocument()
  })

  it('closes settings with Escape and returns focus to its named control', () => {
    setProfile({ name: 'Sara' })
    render(<Home />)
    const toggle = screen.getByRole('button', { name: 'Indstillinger for Sara' })
    fireEvent.click(toggle)
    expect(screen.getByRole('heading', { name: 'Indstillinger' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('heading', { name: 'Indstillinger' })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('links to the local image credits from settings', () => {
    setProfile({})
    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: 'Indstillinger' }))
    expect(screen.getByRole('link', { name: 'Billedkilder' })).toHaveAttribute(
      'href',
      '/billedkilder',
    )
  })

  it('lets the learner choose light or dark colours', async () => {
    setProfile({})
    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: 'Indstillinger' }))
    const colors = await screen.findByLabelText('Farver')

    fireEvent.change(colors, { target: { value: 'dark' } })
    expect(document.documentElement).toHaveClass('scheme-dark')

    fireEvent.change(colors, { target: { value: 'light' } })
    expect(document.documentElement).toHaveClass('scheme-light')

    fireEvent.change(colors, { target: { value: 'system' } })
    expect(document.documentElement).not.toHaveClass('scheme-light', 'scheme-dark')
  })
})

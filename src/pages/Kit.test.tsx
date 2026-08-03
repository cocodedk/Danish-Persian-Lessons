import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Kit from './Kit'
import Home from './Home'
import { setProfile } from '../progress/profile'

const FRAMES = [
  'kit-frame-light-ltr',
  'kit-frame-light-rtl',
  'kit-frame-dark-ltr',
  'kit-frame-dark-rtl',
] as const

function renderKit() {
  return render(
    <MemoryRouter>
      <Kit />
    </MemoryRouter>,
  )
}

describe('#/kit gallery', () => {
  it('shows all four frames: both schemes, both reading directions', () => {
    renderKit()
    for (const id of FRAMES) {
      expect(screen.getByTestId(id)).toBeInTheDocument()
    }
    expect(screen.getByTestId('kit-frame-dark-ltr').className).toContain('scheme-dark')
    expect(screen.getByTestId('kit-frame-light-ltr').className).toContain('scheme-light')
  })

  it('renders every kit component inside every frame', () => {
    renderKit()
    for (const id of FRAMES) {
      const frame = screen.getByTestId(id)
      expect(frame.querySelector('.ruled-section')).not.toBeNull()
      expect(frame.querySelector('.fa-specimen')).not.toBeNull()
      expect(frame.querySelector('.pron-line')).not.toBeNull()
      expect(frame.querySelector('hr.rule-divider')).not.toBeNull()
      expect(frame.querySelector('.da-word')).not.toBeNull()
      expect(frame.querySelectorAll('.vowel-chip')).toHaveLength(3)
      expect(frame.querySelectorAll('.btn')).toHaveLength(2)
      expect(frame.querySelector('.progress-tick--granted')).not.toBeNull()
    }
  })

  it('mirrors the sheet: the rtl samples read right to left, the ltr samples left to right', () => {
    renderKit()
    for (const id of FRAMES) {
      const dir = id.endsWith('rtl') ? 'rtl' : 'ltr'
      const body = screen.getByTestId(id).querySelector('.kit__frame-body')
      expect(body).toHaveAttribute('dir', dir)
      expect(body?.querySelector('.ruled-section')).toHaveAttribute('dir', dir)
    }
  })

  it('writes the Persian sheet in Persian and the Danish one in Danish', () => {
    renderKit()
    const rtlSheet = screen.getByTestId('kit-frame-light-rtl').querySelector('.ruled-section')
    expect(rtlSheet).toHaveAttribute('lang', 'fa')
    const ltrSheet = screen.getByTestId('kit-frame-light-ltr').querySelector('.ruled-section')
    expect(ltrSheet).toHaveAttribute('lang', 'da')
  })

  it('is reachable by direct URL only — the forside never links to it', () => {
    // A saved profile record is what gets past the first-run name capture, so
    // this really renders the forside and not the capture screen.
    window.localStorage.clear()
    setProfile({ name: 'Sara' })
    const { container } = render(<Home />)
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    const links = within(container).queryAllByRole('link')
    expect(links.filter((link) => link.getAttribute('href')?.includes('kit'))).toEqual([])
  })
})

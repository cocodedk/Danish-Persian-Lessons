import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { getProfile, setProfile } from '../progress/profile'
import bankCss from '../components/LetterBank.css?raw'
import nameCss from './name.css?raw'

let open: (hash: string) => void
let unmountLast: (() => void) | null = null

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  open = (hash: string) => {
    unmountLast?.()
    window.location.hash = hash
    unmountLast = render(<App />).unmount
  }
})

afterEach(() => {
  unmountLast = null
})

/** Taps a letter in the bank by the glyph printed on it. */
function tapLetter(glyph: string) {
  const tile = screen
    .getAllByText(glyph)
    .map((element) => element.closest('button'))
    .find((button): button is HTMLButtonElement => button !== null && !button.disabled)
  expect(tile, `no tappable ${glyph}`).toBeTruthy()
  fireEvent.click(tile as HTMLButtonElement)
}

function preview(): string {
  return document.querySelector('.name__preview')?.textContent ?? ''
}

describe('#/dit-navn — choosing how the name is spelled', () => {
  it('offers the engine’s spellings, best one already chosen, and saves the pick', () => {
    setProfile({ name: 'Babak' })
    open('#/dit-navn')

    expect(screen.getByRole('button', { name: 'بابک' })).toHaveAttribute('aria-pressed', 'true')
    expect(preview()).toBe('بابک')

    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile()).toEqual({ name: 'Babak', faSpelling: 'بابک' })
    // Landed back on the forside, greeted in Persian by the name just chosen.
    expect(screen.getByText('سلام، بابک!')).toBeInTheDocument()
    expect(screen.getByText('Hej Babak!')).toBeInTheDocument()
  })

  it('lets a learner take a second suggestion instead of the first', () => {
    setProfile({ name: 'Mette' })
    open('#/dit-navn')

    fireEvent.click(screen.getByRole('button', { name: 'میته' }))
    expect(preview()).toBe('میته')
    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile().faSpelling).toBe('میته')
  })

  it('edits letter by letter from the bank — tap to place, and one step back', () => {
    setProfile({ name: 'Sara' })
    open('#/dit-navn')
    expect(preview()).toBe('سارا')

    fireEvent.click(screen.getByText('Åbn bogstaverne'))
    fireEvent.click(screen.getByText('Slet sidste bogstav'))
    expect(preview()).toBe('سار')

    tapLetter('ه')
    expect(preview()).toBe('ساره')
    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile().faSpelling).toBe('ساره')
  })

  it('writes a spelling by hand when the engine has nothing to suggest, and never crashes on it', () => {
    setProfile({ name: '12' })
    open('#/dit-navn')

    expect(screen.getByText(/Der er ingen forslag til dit navn/)).toBeInTheDocument()
    expect(preview()).toBe('')

    fireEvent.click(screen.getByText('Åbn bogstaverne'))
    tapLetter('ب')
    tapLetter('و')
    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile().faSpelling).toBe('بو')
  })

  it('handles æ/ø/å names end to end', () => {
    setProfile({ name: 'Søren' })
    open('#/dit-navn')
    expect(screen.getByRole('button', { name: 'سورن' })).toBeInTheDocument()

    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile().faSpelling).toBe('سورن')
    expect(screen.getByText('سلام، سورن!')).toBeInTheDocument()
  })

  it('deletes the spelling without touching the name', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/dit-navn')

    fireEvent.click(screen.getByText('Slet stavemåden'))
    expect(getProfile()).toEqual({ name: 'Babak' })
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('Hej Babak!')).toBeInTheDocument()
  })

  it('is not a screen a learner without a name can end up on', () => {
    setProfile({})
    open('#/dit-navn')
    expect(screen.getByText('Hej!')).toBeInTheDocument()
    expect(screen.queryByText('Gem stavemåden')).not.toBeInTheDocument()
  })

  it('is reachable from the settings corner, before and after a spelling exists', () => {
    setProfile({ name: 'Sara' })
    open('#/')
    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))
    expect(screen.getByRole('link', { name: 'Skriv navnet på persisk' })).toBeInTheDocument()

    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/')
    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))
    const link = screen.getByRole('link', { name: 'Ret navnet på persisk' })
    expect(link).toHaveAttribute('href', '#/dit-navn')
  })

  it('says in both languages that the name stays on the phone', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/')
    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))

    expect(screen.getByText(/Navnet gemmes kun på din telefon/)).toBeInTheDocument()
    expect(screen.getByText('نامت فقط روی همین دستگاه می‌ماند.')).toBeInTheDocument()
  })

  it('gives every letter and every choice a thumb-sized target', () => {
    // jsdom computes no layout, so the floor is read off the stylesheet.
    expect(bankCss).toContain('min-block-size: var(--tap-min)')
    expect(bankCss).toContain('min-inline-size: var(--tap-min)')
    expect(nameCss).toContain('min-block-size: var(--tap-min)')
  })

  it('drops a spelling that belongs to a name the learner has replaced', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/')

    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))
    fireEvent.change(screen.getByLabelText('Dit navn'), { target: { value: 'Mette' } })
    fireEvent.click(screen.getByText('Gem'))

    expect(getProfile()).toEqual({ name: 'Mette' })
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('Hej Mette!')).toBeInTheDocument()
  })
})

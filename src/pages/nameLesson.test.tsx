import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { isNameLessonDone } from '../progress/nameLesson'
import { assemblyBank, nameGlyphs } from '../name/bank'
import { nameLetters } from '../name/forms'
import { specimens } from '../lessons/alphabet'
import { getRewards } from '../rewards/engine'
import walkCss from '../components/NameWalkthrough.css?raw'

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
  vi.unstubAllGlobals()
})

/** Taps the next free tile carrying `glyph`. */
function tapTile(glyph: string) {
  const tile = screen
    .getAllByText(glyph)
    .map((element) => element.closest('button'))
    .find((button): button is HTMLButtonElement => button !== null && !button.disabled)
  expect(tile, `no free tile for ${glyph}`).toBeTruthy()
  fireEvent.click(tile as HTMLButtonElement)
}

/** Plays the whole exercise correctly, letter by letter. */
function assemble(spelling: string) {
  for (const glyph of nameGlyphs(spelling)) tapTile(glyph)
}

function wantsLessMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

describe('#/lesson/navn — write your name', () => {
  it('exists only for a learner who has a Persian spelling', () => {
    setProfile({ name: 'Sara' })
    open('#/lesson/navn')
    expect(screen.queryByRole('heading', { name: 'Skriv dit navn' })).not.toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
  })

  it('walks the name letter by letter, each letter in the form it takes there', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    expect(screen.getByRole('heading', { name: 'Skriv dit navn' })).toBeInTheDocument()
    expect(screen.getByText('نامِ خود را بنویس')).toBeInTheDocument()

    // One numbered step per letter, naming the letter and its position.
    // The same alef twice, in two different forms: bound after س, free after ر.
    expect(screen.getByText('Bogstav 1: sin står først')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 2: alef står sidst')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 3: re står alene')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 4: alef står alene')).toBeInTheDocument()

    // The name as it grows, and the one-line why under each step.
    const grown = [...document.querySelectorAll('.name-walk__grown')].map((el) => el.textContent)
    expect(grown).toEqual(['س', 'سا', 'سار', 'سارا'])
    expect(screen.getAllByText(/binder videre til bogstavet efter/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/binder ikke til venstre/).length).toBeGreaterThan(0)
  })

  it('rebuilds the name from a bank of its own letters plus two strangers', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    const tray = document.querySelectorAll('.name-assembly .letter-bank__tile')
    expect(tray).toHaveLength(6)

    const line = () => document.querySelector('.name-assembly__line')?.textContent
    expect(line()).toBe('')
    tapTile('س')
    expect(line()).toBe('س')
    tapTile('ا')
    expect(line()).toBe('سا')
  })

  it('a wrong letter costs nothing: it does not stick, and the app says «دوباره»', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    tapTile('ا') // the name starts with س, so this one waits its turn
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText(/Prøv igen, du mister ingenting/)).toBeInTheDocument()

    // …and the letter is still there to use when its turn comes.
    tapTile('س')
    tapTile('ا')
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('سا')
  })

  it('says which kind of wrong tap it was — a letter waiting its turn, or a stranger', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    // One of the two letters the tray carries from outside the name. Telling a
    // learner to "try again" here would send them hunting for a letter that is
    // not in their name to find.
    const stranger = assemblyBank('سارا').find((tile) => !nameGlyphs('سارا').includes(tile.glyph))
    expect(stranger, 'the tray always carries two strangers').toBeTruthy()

    tapTile(stranger!.glyph)
    expect(screen.getByText('این حرف در نامِ تو نیست. دوباره نگاه کن.')).toBeInTheDocument()
    expect(screen.getByText('Det bogstav er ikke i dit navn. Kig igen.')).toBeInTheDocument()
    expect(screen.queryByText('دوباره')).not.toBeInTheDocument()

    // The other branch, from the same screen: a letter of the name, out of turn.
    tapTile('ا')
    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText(/kommer et andet sted i navnet/)).toBeInTheDocument()
    expect(screen.queryByText('Det bogstav er ikke i dit navn. Kig igen.')).not.toBeInTheDocument()
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
  })

  it('says how every letter of the name sounds, in the alphabet lesson’s own words', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    const said = (letter: { sound?: { da: string; ipa: string } }) =>
      `${letter.sound?.da} · [${letter.sound?.ipa}]`
    const lines = [...document.querySelectorAll('.name-walk__step .pron-line')].map(
      (element) => element.textContent,
    )

    expect(lines).toEqual(nameLetters('سارا').map(said))
    // …and those words are the letter data's, not this screen's.
    expect(lines[0]).toBe(said(specimens.sin))
    expect(lines[2]).toBe(said(specimens.re))
  })

  it('celebrates the finished name by name — «آفرین، سارا!» / "Flot, Sara!"', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    assemble('سارا')

    expect(screen.getByText('آفرین، سارا!')).toBeInTheDocument()
    expect(screen.getByText('Flot, Sara!')).toBeInTheDocument()
    expect(isNameLessonDone()).toBe(true)
  })

  it('remembers it was cleared, and can be played again', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/lesson/navn')
    assemble('بابک')
    expect(isNameLessonDone()).toBe(true)

    open('#/lesson/navn')
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
    assemble('بابک')
    expect(screen.getByText('آفرین، بابک!')).toBeInTheDocument()
  })

  it('praises every finish but pays for the lesson once — the letter rule, for a lesson', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/lesson/navn')
    assemble('بابک')

    const paid = getRewards()
    expect(paid.points).toBeGreaterThan(0)
    expect(paid.stickers.length).toBeGreaterThan(0)

    // Round two, after a reload: the same warm ending, and not one point more.
    open('#/lesson/navn')
    assemble('بابک')
    expect(screen.getByText('آفرین، بابک!')).toBeInTheDocument()
    expect(screen.getByText('Flot, Babak!')).toBeInTheDocument()

    const again = getRewards()
    expect(again.points).toBe(paid.points)
    expect(again.level).toBe(paid.level)
    expect(again.stickers).toEqual(paid.stickers)

    open('#/lesson/navn')
    assemble('بابک')
    expect(getRewards().points).toBe(paid.points)
  })

  it('names a sign outside the alphabet in Danish, never by printing the sign', () => {
    // لوئیزه (Louise) carries ئ, which the lesson never teaches. «Bogstav 3: ئ»
    // asks a beginner to read the very thing they cannot read yet.
    setProfile({ name: 'Louise', faSpelling: 'لوئیزه' })
    open('#/lesson/navn')

    expect(screen.getByText('Bogstav 3: særligt tegn står først')).toBeInTheDocument()
    expect(screen.getByText(/særligt tegn binder videre til bogstavet efter/)).toBeInTheDocument()
    expect(screen.getAllByLabelText('særligt tegn').length).toBeGreaterThan(0)
    expect(screen.queryByLabelText('ئ')).not.toBeInTheDocument()

    // It has no taught sound either, so the lesson claims none for it: five
    // pronunciation lines under six letters.
    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(6)
    expect(document.querySelectorAll('.name-walk__step .pron-line')).toHaveLength(5)
  })

  it('under prefers-reduced-motion the lesson is whole and the reward still lands', () => {
    wantsLessMotion()
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(4)
    assemble('سارا')
    expect(screen.getByText('آفرین، سارا!')).toBeInTheDocument()
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
  })

  it('drops the letter-by-letter animation under reduced motion without hiding a step', () => {
    const block = walkCss.slice(walkCss.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(block).toContain('animation: none')
    expect(block).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0\b/)
  })
})

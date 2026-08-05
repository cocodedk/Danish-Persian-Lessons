// The typing rounds: what the prompt shows and hides, what the keyboard writes,
// what a wrong word costs (nothing), and what a finished round pays (a page,
// once). The capstone is typingName.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { getRewards } from '../rewards/engine'
import { getTypeProgress } from '../progress/typing'
import { findVocabUnit } from '../lessons/vocab'
import { KEYBOARD_KEYS } from '../keyboard/layout'
import { ZWNJ } from '../keyboard/buffer'
import {
  freshTypingState,
  open,
  tap,
  write,
  written,
  praiseOnScreen,
  finishTypeRound,
  keyFor,
} from './typingHarness'

const unit = findVocabUnit('1')!
const first = unit.words[0] // آب / vand

freshTypingState()

describe('the prompt', () => {
  it('asks in Danish and says how the word sounds — and never prints the answer', () => {
    open('#/lesson/ord/1/skriv')

    expect(screen.getByRole('heading', { name: `Skriv ordet »${first.da}«` })).toBeInTheDocument()
    expect(screen.getByText(`${first.pron.da} · [${first.pron.ipa}]`)).toBeInTheDocument()
    for (const word of unit.words) {
      expect(screen.queryByText(word.fa), word.fa).not.toBeInTheDocument()
      expect(screen.queryByText(word.faMarked), word.faMarked).not.toBeInTheDocument()
    }
  })

  it('never puts a text field on the page, so the phone keyboard has nothing to open', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    expect(container.querySelectorAll('input, textarea, [contenteditable]')).toHaveLength(0)
  })

  it('sends a URL that names no unit back to the forside', () => {
    open('#/lesson/ord/9/skriv')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

describe('the keyboard', () => {
  it('writes what is tapped, in order, and takes it back one code point at a time', () => {
    const { container } = open('#/lesson/ord/1/skriv')

    write('بابا')
    expect(written(container)).toBe('بابا')
    tap('slet sidste tegn')
    expect(written(container)).toBe('باب')
  })

  it('offers all 33 letters plus the three sign keys, each once, every one tappable', () => {
    open('#/lesson/ord/1/skriv')
    for (const key of KEYBOARD_KEYS) {
      expect(screen.getAllByRole('button', { name: key.label }), key.id).toHaveLength(1)
    }
  })

  it('will not start a word with a نیم‌فاصله and will not double one', () => {
    const { container } = open('#/lesson/ord/1/skriv')

    tap('halvt mellemrum')
    expect(written(container)).toBe('')
    write('کتاب')
    tap('halvt mellemrum')
    tap('halvt mellemrum')
    expect(written(container)).toBe(`کتاب${ZWNJ}`)
  })
})

describe('a word written right', () => {
  it('celebrates, records the word, and pays the item rate the first time only', () => {
    open('#/lesson/ord/1/skriv')

    const before = getRewards().points
    write(first.fa)
    tap('Se efter')

    expect(praiseOnScreen()).toBe(true)
    expect(getTypeProgress('1').words).toContain(first.id)
    expect(getRewards().points).toBe(before + 2)

    // Same word again, on a fresh mount: practice, at the flat answer rate.
    const paid = getRewards().points
    open('#/lesson/ord/1/skriv')
    write(first.fa)
    tap('Se efter')
    expect(getRewards().points).toBe(paid + 1)
  })

  it('does not ask for اِعراب — the plain spelling of a marked word is right', () => {
    const madrese = findVocabUnit('2')!.words.find((word) => word.id === 'madrese')!
    expect(madrese.faMarked).not.toBe(madrese.fa)

    open('#/lesson/ord/2/skriv')
    // Walk to the word, leaving each one blank: skipping costs nothing.
    const index = findVocabUnit('2')!.words.indexOf(madrese)
    for (let step = 0; step < index; step += 1) {
      write(findVocabUnit('2')!.words[step].fa)
      tap('Se efter')
      tap('Næste')
    }
    write(madrese.fa)
    tap('Se efter')
    expect(praiseOnScreen()).toBe(true)
  })
})

describe('a word written wrong', () => {
  it('marks the first divergence in red, keeps the writing, and takes nothing away', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    const points = getRewards().points

    write('آد') // آب wanted: the second letter is where it goes wrong
    tap('Se efter')

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText(/Her står et andet bogstav/)).toBeInTheDocument()

    const marked = container.querySelectorAll('.type__cell--mark')
    expect(marked).toHaveLength(1)
    expect(marked[0].textContent).toBe('د')

    // Nothing lost: the points stand and the writing is still on the line.
    expect(getRewards().points).toBe(points)
    expect(written(container)).toBe('آد')
  })

  it('marks the empty slot where a letter is missing', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    write('آ')
    tap('Se efter')

    expect(screen.getByText(/Her mangler et bogstav/)).toBeInTheDocument()
    const marked = container.querySelectorAll('.type__cell--mark')
    expect(marked).toHaveLength(1)
    expect(marked[0].textContent).toBe('')
  })

  it('marks the first letter too many', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    write('آبی')
    tap('Se efter')

    expect(screen.getByText(/Her er et bogstav for meget/)).toBeInTheDocument()
    expect(container.querySelectorAll('.type__cell--mark')[0].textContent).toBe('ی')
  })

  it('clears the marking the moment the pen moves again', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    write('آد')
    tap('Se efter')
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(1)

    tap('slet sidste tegn')
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(0)
  })
})

describe('finishing a round', () => {
  it('fills a notebook page — once, however often the round is written again', () => {
    open('#/lesson/ord/3/skriv')
    finishTypeRound('3')

    const afterFirst = getRewards()
    expect(getTypeProgress('3').paid).toBe(true)
    expect(afterFirst.level).toBeGreaterThan(1)

    // A reload, then the whole round again: every word is already written, so
    // it pays the flat answer rate and the page is not for sale twice.
    open('#/lesson/ord/3/skriv')
    finishTypeRound('3')
    const words = findVocabUnit('3')!.words.length
    expect(getRewards().points).toBe(afterFirst.points + words)
    expect(getRewards().points).toBeGreaterThan(afterFirst.points)
  }, 15_000)
})

describe('the forside', () => {
  it('lists a writing round per unit, with how much of it is written', () => {
    open('#/lesson/ord/1/skriv')
    write(first.fa)
    tap('Se efter')

    open('#/')
    const round = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '#/lesson/ord/1/skriv')
    expect(round).toBeDefined()
    expect(round).toHaveTextContent(`1 af ${unit.words.length} skrevet`)
  })
})

describe('a wrong attempt', () => {
  it('keeps the writing on the line when the learner asks to try again', () => {
    const { container } = open('#/lesson/ord/1/skriv')
    const firstLetter = [...first.fa][0]
    write(firstLetter)
    tap('Se efter')
    tap('Prøv én gang til')
    expect(written(container)).toBe(firstLetter)
  })
})

describe('the key detail strip', () => {
  it('offers the letter lesson after a letter key, quietly, and no link for نیم‌فاصله', () => {
    const { container } = open('#/lesson/ord/1/skriv')

    tap(keyFor('ب'))
    const strip = container.querySelector('.entry-detail')
    expect(strip).not.toBeNull()
    // Deliberately not a live region: the strip changes on every keystroke.
    expect(strip?.getAttribute('aria-live')).toBeNull()
    expect(screen.getByRole('link', { name: 'Åbn hele lektionen' })).toHaveAttribute(
      'href',
      '#/lesson/alphabet/bogstav/be',
    )

    tap('halvt mellemrum')
    expect(screen.queryByRole('link', { name: 'Åbn hele lektionen' })).not.toBeInTheDocument()
  })
})

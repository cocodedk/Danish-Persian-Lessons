import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { getRewards } from '../rewards/engine'
import { getTypeProgress } from '../progress/typing'
import { findVocabUnit } from '../lessons/vocab'
import { freshTypingState, finishTypeRound, keyFor, open, tap, write, written } from './typingHarness'

const unit = findVocabUnit('1')!
const first = unit.words[0]

freshTypingState()

describe('finishing a typing round', () => {
  it('fills a notebook page — once, however often the round is written again', () => {
    open('#/lesson/ord/3/skriv')
    finishTypeRound('3')

    const afterFirst = getRewards()
    expect(getTypeProgress('3').paid).toBe(true)
    expect(afterFirst.level).toBeGreaterThan(1)

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
    const round = screen.getAllByRole('link').find(
      (link) => link.getAttribute('href') === '#/lesson/ord/1/skriv',
    )
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
    expect(strip?.getAttribute('aria-live')).toBeNull()
    expect(screen.getByRole('link', { name: 'Åbn hele lektionen' })).toHaveAttribute(
      'href',
      '#/lesson/alphabet/bogstav/be',
    )

    tap('halvt mellemrum')
    expect(screen.queryByRole('link', { name: 'Åbn hele lektionen' })).not.toBeInTheDocument()
  })
})

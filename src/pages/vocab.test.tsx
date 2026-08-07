// The vocabulary screens: the forside's lesson cards, any unit reachable any
// time, and the word screen's specimen, ticks and name-overlap note. What
// finishing a unit pays and how the two exercise rounds play is
// vocabRounds.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen, fireEvent, within } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { getRewards } from '../rewards/engine'
import { vocabUnits, findVocabUnit } from '../lessons/vocab'
import { freshVocabState, open, praiseOnScreen } from './vocabHarness'

const unit = findVocabUnit('1')!

freshVocabState()

/**
 * The unit's lesson card, picked by where it goes. Since plan 005 the forside
 * also carries a typing round per unit, which names the same unit in its own
 * link — the destination is what tells the two apart.
 */
function unitCard(unitId: string): HTMLElement {
  return screen
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === `#/lesson/ord/${unitId}`)!
}

describe('the forside lists the word units', () => {
  it('shows all three, with their own progress, and links straight into them', () => {
    open('#/')
    for (const each of vocabUnits) {
      const card = unitCard(each.id)
      expect(card, each.title).toBeInTheDocument()
      expect(within(card).getByText(each.title)).toBeInTheDocument()
      expect(
        within(card).getByText(`0 af ${each.words.length} ord gennemgået eller øvet`),
      ).toBeInTheDocument()
    }
  })

  it('counts a cleared word on the forside', () => {
    const word = open(`#/lesson/ord/1/${unit.words[0].id}`)
    fireEvent.click(screen.getByRole('button', { name: 'Jeg har gennemgået ordet' }))
    word.unmount()

    open('#/')
    const card = unitCard(unit.id)
    expect(within(card).getByText(`1 af ${unit.words.length} ord gennemgået eller øvet`)).toBeInTheDocument()
  })
})

describe('any unit, any word, any time', () => {
  it('opens unit ۳ with nothing cleared anywhere — no lesson is ever locked', () => {
    open('#/lesson/ord/3')
    const third = findVocabUnit('3')!
    expect(screen.getByRole('heading', { name: third.title })).toBeInTheDocument()
    expect(screen.getByText(third.titleEntry.fa)).toBeInTheDocument()
    for (const word of third.words) {
      expect(screen.getAllByText(word.fa).length).toBeGreaterThan(0)
    }
  })

  it('sends a URL that names no unit back to the forside instead of erroring', () => {
    open('#/lesson/ord/9')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

describe('a word screen', () => {
  it('is the split card: the vocalized specimen, the sound twice, the Danish meaning', () => {
    const { container } = open('#/lesson/ord/2/madrese')
    const word = findVocabUnit('2')!.words.find((candidate) => candidate.id === 'madrese')!

    const faPane = container.querySelector('.split-card__pane--fa')
    expect(faPane?.textContent).toContain(word.faMarked)
    expect(screen.getAllByText(`${word.pron.da} · [${word.pron.ipa}]`).length).toBeGreaterThan(0)
    expect(screen.getByText(word.da)).toBeInTheDocument()
    // The approved specimen renderer owns Persian language and direction.
    expect(faPane?.querySelector('.fa-specimen')).toHaveAttribute('dir', 'rtl')
    expect(faPane?.querySelector('.fa-specimen')).toHaveAttribute('lang', 'fa')
  })

  it('marks the vowel signs with the teacher\'s red pen, on the specimen only', () => {
    const { container } = open('#/lesson/ord/2/madrese')
    // مَدرِسه is marked above AND below: the red layer carries both.
    expect(container.querySelector('.fa-specimen__marks')?.textContent).toBe('مَدرِسه')
    expect(container.querySelector('.fa-specimen__ink')?.textContent).toBe('مدرسه')
    expect(container.querySelectorAll('.pron-line .fa-specimen__marks')).toHaveLength(0)
    expect(container.querySelector('.da-word')?.className).not.toContain('pen-mark')
  })

  it('ticks the word off and celebrates, and says so again on the next visit', () => {
    const first = open(`#/lesson/ord/1/${unit.words[0].id}`)
    fireEvent.click(screen.getByRole('button', { name: 'Jeg har gennemgået ordet' }))
    expect(praiseOnScreen()).toBe(true)
    expect(getRewards().points).toBe(2)
    first.unmount()

    open(`#/lesson/ord/1/${unit.words[0].id}`)
    expect(screen.queryByRole('button', { name: 'Jeg har gennemgået ordet' })).not.toBeInTheDocument()
    expect(screen.getByText('Gennemgået')).toBeInTheDocument()
  })

  it('says nothing about the learner\'s name when there is no name', () => {
    open('#/lesson/ord/1/baba')
    expect(screen.queryByText(/i dit navn/i)).not.toBeInTheDocument()
  })

  it('notes the letters a word shares with the learner\'s own name, warmly', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/ord/1/baba')
    expect(screen.getByText('حرفی از نام تو در این کلمه هست')).toBeInTheDocument()
    expect(screen.getByText(/Ét af bogstaverne her/)).toBeInTheDocument()
  })
})

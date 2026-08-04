// The capstone «نامِ خودت را بنویس»: present and warm for a learner who has a
// Persian spelling, completely absent for one who has not.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { getRewards } from '../rewards/engine'
import { getTypeProgress } from '../progress/typing'
import { namePraise } from '../name/copy'
import { freshTypingState, open, tap, write } from './typingHarness'

const SARA = { name: 'Sara', faSpelling: 'سارا' }

freshTypingState()

/** The forside link into the capstone, if there is one at all. */
function capstoneLink() {
  return screen
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === '#/lesson/navn/skriv')
}

describe('without a name', () => {
  it('is not on the forside and says nothing about itself', () => {
    open('#/')
    expect(capstoneLink()).toBeUndefined()
    expect(screen.queryByText(/dit navn/i)).not.toBeInTheDocument()
  })

  it('sends a hand-typed URL quietly back to the forside', () => {
    open('#/lesson/navn/skriv')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

describe('with a spelling the keyboard cannot write', () => {
  it('stays dormant — لوئیزه needs ئ, which is not one of the 32 letters', () => {
    setProfile({ name: 'Louise', faSpelling: 'لوئیزه' })
    const forside = open('#/')
    expect(capstoneLink()).toBeUndefined()
    forside.unmount()

    open('#/lesson/navn/skriv')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

describe('with a name', () => {
  it('is on the forside, waiting, and never in the way', () => {
    setProfile(SARA)
    open('#/')
    expect(capstoneLink()).toHaveTextContent('Tast dit navn')
    expect(capstoneLink()).toHaveTextContent('Klar, når du er')
  })

  it('asks for the name without printing it — the spelling stays folded away', () => {
    setProfile(SARA)
    const { container } = open('#/lesson/navn/skriv')

    expect(
      screen.getByRole('heading', { name: 'Skriv dit navn med persiske bogstaver' }),
    ).toBeInTheDocument()
    const help = container.querySelector('details')!
    expect(help.open).toBe(false)
    // The one place the spelling appears is inside that closed disclosure.
    expect(screen.getByText(SARA.faSpelling).closest('details')).toBe(help)
  })

  it('celebrates by name and fills a page — once, however often it is written again', () => {
    setProfile(SARA)
    open('#/lesson/navn/skriv')

    write(SARA.faSpelling)
    tap('Se efter')
    const praise = namePraise(SARA.faSpelling, SARA.name)
    expect(screen.getAllByText(praise.fa).length).toBeGreaterThan(0)
    expect(screen.getAllByText(praise.da).length).toBeGreaterThan(0)

    tap('Afslut runden')
    expect(getTypeProgress('name').paid).toBe(true)
    const afterFirst = getRewards().points
    expect(getRewards().level).toBeGreaterThan(1)

    // Written again after a reload: praised again, paid the flat answer rate,
    // and the page is not sold twice.
    open('#/lesson/navn/skriv')
    write(SARA.faSpelling)
    tap('Se efter')
    tap('Afslut runden')
    expect(getRewards().points).toBe(afterFirst + 1)
    expect(screen.getAllByText(praise.fa).length).toBeGreaterThan(0)
  })

  it('marks a wrong letter in the name as gently as it marks a word', () => {
    setProfile(SARA)
    const { container } = open('#/lesson/navn/skriv')

    write('سارد')
    tap('Se efter')
    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(container.querySelectorAll('.type__cell--mark')).toHaveLength(1)
    expect(getRewards().points).toBe(0)
  })

  it('writes a two-part name with the space key', () => {
    setProfile({ name: 'Anne Mette', faSpelling: 'آنه مته' })
    open('#/lesson/navn/skriv')

    write('آنه')
    tap('mellemrum')
    write('مته')
    tap('Se efter')
    expect(screen.getByText('Flot, Anne Mette!')).toBeInTheDocument()
  })
})

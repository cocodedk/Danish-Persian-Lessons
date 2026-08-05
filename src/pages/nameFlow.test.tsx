import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { getProfile } from '../progress/profile'
import { teachingOrder, specimens } from '../lessons/alphabet'
import { NAME_LETTER_FA } from '../content/faStrings'

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

/** The alphabet lesson's id for a letter, so a test can open its screen. */
function letterId(glyph: string): string {
  const id = teachingOrder.find((candidate) => specimens[candidate].glyph === glyph)
  expect(id, `no letter screen for ${glyph}`).toBeTruthy()
  return id as string
}

function idOutside(spelling: string): string {
  const id = teachingOrder.find((candidate) => !spelling.includes(specimens[candidate].glyph))
  return id as string
}

const GOLDEN: Array<[string, string]> = [
  ['Mette', 'مته'],
  ['Søren', 'سورن'],
  ['Babak', 'بابک'],
]

describe('the learner’s name, capture to lesson', () => {
  it.each(GOLDEN)('%s is captured, spelled %s, and starts teaching', (name, spelling) => {
    open('#/')
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), { target: { value: name } })
    fireEvent.click(screen.getByText('Gem'))

    // Straight on to the spelling, with the engine's best already picked.
    expect(screen.getByRole('heading', { name: 'Dit navn på persisk' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: spelling })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(getProfile()).toEqual({ name, faSpelling: spelling })

    // The forside greets in Persian by the Persian spelling, in Danish by the
    // written name — and never the other way round.
    expect(screen.getByText(`سلام، ${spelling}!`)).toBeInTheDocument()
    expect(screen.getByText(`Hej ${name}!`)).toBeInTheDocument()
    // (The pronunciation line is the one Latin the Persian pane carries by
    //  design; the greeting itself never does.)
    const greeting = document.querySelector('.split-card__pane--fa .split-card__greeting')
    expect(greeting?.textContent).toBe(`سلام، ${spelling}!`)

    // The lesson only a named learner has.
    const card = screen.getByRole('link', { name: /Dit navn/ })
    expect(card).toHaveAttribute('href', '#/lesson/navn')

    // A letter of the name carries the badge; a letter outside it does not.
    open(`#/lesson/alphabet/bogstav/${letterId([...spelling][0])}`)
    expect(screen.getByText(NAME_LETTER_FA)).toBeInTheDocument()
    expect(screen.getByText('Dette bogstav er i dit navn')).toBeInTheDocument()

    open(`#/lesson/alphabet/bogstav/${idOutside(spelling)}`)
    expect(screen.queryByText(NAME_LETTER_FA)).not.toBeInTheDocument()

    // And the mini-lesson opens on the same spelling — one source of truth.
    open('#/lesson/navn')
    expect(document.querySelector('.name__preview')?.textContent).toBe(spelling)
  })

  it('no name at all: nothing asks, nothing badges, nothing is missing', () => {
    open('#/')
    fireEvent.click(screen.getByText('Spring over'))

    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('Hej!')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Dit navn/ })).not.toBeInTheDocument()
    // The forside says nothing about a name it does not have.
    expect(screen.queryByText(/Dit navn/)).not.toBeInTheDocument()
    // The alphabet lesson is there in full.
    expect(screen.getByRole('link', { name: /Alfabetet/ })).toBeInTheDocument()

    open('#/lesson/alphabet/bogstav/be')
    expect(screen.queryByText(NAME_LETTER_FA)).not.toBeInTheDocument()

    open('#/lesson/navn')
    expect(screen.getByText('Hej!')).toBeInTheDocument()

    open('#/dit-navn')
    expect(screen.getByText('Hej!')).toBeInTheDocument()
    expect(getProfile()).toEqual({})
  })

  it('deleting the name takes the spelling, the badges and the lesson with it', () => {
    open('#/')
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), { target: { value: 'Babak' } })
    fireEvent.click(screen.getByText('Gem'))
    fireEvent.click(screen.getByText('Gem stavemåden'))
    expect(screen.getByRole('link', { name: /Dit navn/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Babak' }))
    fireEvent.click(screen.getByText('Slet'))

    expect(getProfile()).toEqual({})
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Dit navn/ })).not.toBeInTheDocument()

    open('#/lesson/alphabet/bogstav/be')
    expect(screen.queryByText(NAME_LETTER_FA)).not.toBeInTheDocument()

    open('#/lesson/navn')
    expect(screen.getByText('Hej!')).toBeInTheDocument()
  })

  it('a name the learner skips the spelling for leaves the Persian pane plain', () => {
    open('#/')
    fireEvent.change(screen.getByLabelText('Hvad hedder du?'), { target: { value: 'Lærke' } })
    fireEvent.click(screen.getByText('Gem'))

    // Walking away from the spelling screen is a way out, not a dead end.
    fireEvent.click(screen.getByRole('link', { name: 'Til forsiden' }))
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('Hej Lærke!')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Dit navn/ })).not.toBeInTheDocument()
    expect(getProfile()).toEqual({ name: 'Lærke' })
  })
})

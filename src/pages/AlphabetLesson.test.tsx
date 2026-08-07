import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen, getAlphabetProgress } from '../progress/alphabet'
import { alphabetGroups } from '../puzzles/catalog'
import { payPuzzle } from '../progress/puzzles'

/** Opens the app at a hash route, the way a shared link would. */
function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({ name: 'Sara' })
})

describe('#/lesson/alphabet', () => {
  it('opens on orientation the first time, and teaches the right-to-left flip', () => {
    open('#/lesson/alphabet')
    expect(screen.getByRole('heading', { name: 'Sådan virker persisk skrift' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Næste: læseretning' }))
    expect(
      screen.getByRole('heading', { name: 'Persisk læses fra højre mod venstre' }),
    ).toBeInTheDocument()
    // The turned Danish word, and the arrow that says which way to read it.
    expect(screen.getByText('DNAV')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /fra højre mod venstre/ })).toBeInTheDocument()
    expect(screen.getByText(/så står der VAND/)).toBeInTheDocument()
  })

  it('is skippable — the way out sits in the thumb bar from the first screen', () => {
    open('#/lesson/alphabet')
    const onward = screen.getByRole('link', { name: 'Spring over og gå til alfabetet' })
    expect(onward).toHaveAttribute('href', '#/lesson/alphabet')
    expect(getAlphabetProgress().orientationSeen).toBe(false)

    fireEvent.click(onward)
    expect(getAlphabetProgress().orientationSeen).toBe(true)
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })

  it('marks completion only after the learner reaches all six steps', () => {
    open('#/lesson/alphabet')
    expect(screen.getByText(/trin 1 af 6/)).toBeInTheDocument()
    for (const label of [
      'Næste: læseretning',
      'Næste: bogstaver der binder',
      'Næste: bogstavformer',
      'Næste: store og små bogstaver',
      'Næste: prikker',
    ]) {
      expect(getAlphabetProgress().orientationSeen).toBe(false)
      fireEvent.click(screen.getByRole('button', { name: label }))
    }
    expect(screen.getByText(/trin 6 af 6/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prikkerne er en del af bogstavet' })).toBeInTheDocument()
    expect(getAlphabetProgress().orientationSeen).toBe(true)
  })

  it('is revisitable from the lesson index once it has been seen', () => {
    markOrientationSeen()
    open('#/lesson/alphabet')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Læs introduktionen igen' }))
    expect(screen.getByRole('heading', { name: 'Sådan virker persisk skrift' })).toBeInTheDocument()
  })

  it('lists all 33 specimens and both exercises', () => {
    markOrientationSeen()
    const { container } = open('#/lesson/alphabet')
    expect(container.querySelectorAll('.alphabet__cell')).toHaveLength(33)
    expect(screen.getByText('0 af 39 set eller øvet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find tegnet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Match formerne' })).toBeInTheDocument()
  })
})

describe('a letter screen', () => {
  beforeEach(() => {
    markOrientationSeen()
  })

  it('shows the glyph, both pronunciations, the four forms and the drawing', () => {
    const { container } = open('#/lesson/alphabet/bogstav/be')
    expect(screen.getByRole('heading', { name: 'Bogstavet be' })).toBeInTheDocument()
    expect(screen.getByText('b i "bil" · [b]')).toBeInTheDocument()
    expect(container.querySelectorAll('.letter-forms__cell')).toHaveLength(4)
    expect(screen.getByText('ـبـ')).toBeInTheDocument()
    expect(container.querySelector('.letter-draw')).not.toBeNull()
  })

  it('grants a tick that survives leaving the screen and coming back', () => {
    open('#/lesson/alphabet/bogstav/be')
    fireEvent.click(screen.getByText('Jeg har set tegnet'))
    expect(screen.getByLabelText('Set')).toBeInTheDocument()
    expect(getAlphabetProgress().letters).toEqual(['be'])

    fireEvent.click(screen.getByRole('link', { name: 'Alle bogstaver' }))
    expect(screen.getByText('1 af 39 set eller øvet')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'be, set eller øvet' }))
    fireEvent.click(screen.getByRole('link', { name: 'Åbn hele lektionen' }))
    expect(screen.getByLabelText('Set')).toBeInTheDocument()
    expect(screen.queryByText('Jeg har set tegnet')).not.toBeInTheDocument()
  })

  it('says nothing about the learners name until plan 006 fills faSpelling in', () => {
    open('#/lesson/alphabet/bogstav/be')
    expect(screen.queryByText('Dette bogstav er i dit navn')).not.toBeInTheDocument()
  })

  it('marks the letters of a name once the profile spells one', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/lesson/alphabet/bogstav/be')
    expect(screen.getByText('Dette bogstav er i dit navn')).toBeInTheDocument()
    expect(screen.getByText('این حرف در نام توست')).toBeInTheDocument()
  })

  it('sends an unknown letter back to the lesson instead of breaking', () => {
    open('#/lesson/alphabet/bogstav/ingenting')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })
})

describe('the vowel marks and the exercises', () => {
  beforeEach(() => {
    markOrientationSeen()
  })

  it('shows the six marks with a Danish anchor each, and names the two that come later', () => {
    const { container } = open('#/lesson/alphabet/vokaltegn')
    expect(container.querySelectorAll('.vowel-chip')).toHaveLength(6)
    expect(screen.getByText('a i "kat" · [æ]')).toBeInTheDocument()
    expect(screen.getByText('i i "vi" · [iː]')).toBeInTheDocument()
    expect(screen.getByText('تشدید')).toBeInTheDocument()
  })

  it('keeps a mark ticked once the learner says they know it', () => {
    open('#/lesson/alphabet/vokaltegn')
    fireEvent.click(screen.getAllByText('Jeg har set tegnet')[0])
    expect(getAlphabetProgress().marks).toEqual(['zebar'])
    expect(screen.getAllByText('Jeg har set tegnet')).toHaveLength(5)
  })

  it('runs an exercise round and writes progress as it goes', () => {
    open('#/lesson/alphabet/ovelse/find')
    expect(screen.getByRole('heading', { name: 'Find tegnet' })).toBeInTheDocument()
    expect(screen.getByText(/Du kan stoppe når som helst/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('آ'))
    expect(getAlphabetProgress().letters).toEqual(['alef-madde'])
  })

  it('sends an unknown exercise back to the lesson', () => {
    open('#/lesson/alphabet/ovelse/ingenting')
    expect(screen.getByRole('heading', { name: 'Alfabetet' })).toBeInTheDocument()
  })
})

describe('puzzle breaks on the lesson index', () => {
  it('links every letter group to its own puzzle, and remembers a cleared one', () => {
    markOrientationSeen()
    const { unmount } = open('#/lesson/alphabet')

    const links = screen.getAllByRole('link', { name: /Lille puslespil/ })
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      alphabetGroups.map((group) => `#/puslespil/${group.puzzle.id}`),
    )

    fireEvent.click(links[0])
    expect(screen.getByText(/Lille pause 1 af/)).toBeInTheDocument()
    unmount()

    payPuzzle(alphabetGroups[0].puzzle.id)
    open('#/lesson/alphabet')
    const [first] = screen.getAllByRole('link', { name: /Lille puslespil/ })
    expect(first).toHaveTextContent('klaret — spil igen')
  })
})

// The counting rounds' screen (plan 016): what the two hash routes actually
// put on the page, what a tap writes, and where a nonsense round goes. The
// question data itself is countingExercises.test.ts and the tap-by-tap
// mechanics are ChoiceExercise.test.tsx — this file is only the wiring.
import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { buildCountingQuestions } from '../lessons/countingExercises'
import { getCountingProgress } from '../progress/counting'
import { getRewards } from '../rewards/engine'
import { freshVocabState, open, praiseOnScreen } from './vocabHarness'

freshVocabState()

const MEANING_ROUTE = '#/lesson/taelle/ovelse/betydning'
const NUMBER_ROUTE = '#/lesson/taelle/ovelse/tal'

/** The one question the round opens on — number one, in both rounds. */
function firstQuestion(kind: 'betydning' | 'tal') {
  return buildCountingQuestions(kind)[0]
}

/** The choice button printed with `glyph`, whichever slot it landed in. */
function choiceButton(glyph: string): HTMLElement {
  return screen.getAllByRole('button').find((each) => each.textContent?.startsWith(glyph))!
}

describe('"Find betydningen": a Persian number, four Danish meanings', () => {
  it('opens on the round, shows the number and keeps the sound of it back', () => {
    const { container } = open(MEANING_ROUTE)
    const question = firstQuestion('betydning')

    expect(screen.getByRole('heading', { name: 'Find betydningen' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hvilket tal er det?' })).toBeInTheDocument()
    // The vocalized specimen is the whole question, so it is on screen.
    expect(container.querySelector('.fa-specimen')).toBeInTheDocument()
    // The pronunciation would spell the answer out loud, so it waits.
    expect(container.querySelector('.pron-line')).not.toBeInTheDocument()

    for (const choice of question.choices) {
      const button = choiceButton(choice.glyph)
      expect(button, choice.glyph).toBeInTheDocument()
      expect(button.getAttribute('lang')).toBe('da')
    }
    // Leaving is always one tap away — the round costs nothing to abandon.
    expect(screen.getByRole('link', { name: 'Til lektionen' })).toBeInTheDocument()
  })

  it('answers a wrong tap with «دوباره» and the full help, and takes nothing', () => {
    const { container } = open(MEANING_ROUTE)
    const question = firstQuestion('betydning')
    const wrong = question.choices.find((choice) => choice.id !== question.answerId)!

    fireEvent.click(choiceButton(wrong.glyph))

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prøv én gang til' })).toBeInTheDocument()
    // The attempt is over, so the reveal may now carry the sound it withheld.
    expect(container.querySelector('.pron-line')).toBeInTheDocument()

    // Nothing was learned and nothing was paid: no counting store was even
    // written, and the reward ledger has not moved.
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
    expect(getCountingProgress().words).toEqual([])
    expect(getRewards().points).toBe(0)
    expect(praiseOnScreen()).toBe(false)
  })

  it('marks exactly the number just found, and praises it', () => {
    open(MEANING_ROUTE)
    const question = firstQuestion('betydning')
    const right = question.choices.find((choice) => choice.id === question.answerId)!

    fireEvent.click(choiceButton(right.glyph))

    expect(praiseOnScreen()).toBe(true)
    // One tap, one number — not the whole round, and not the neighbours it
    // was asked against.
    expect(getCountingProgress().words).toEqual([question.answerId])
    expect(getCountingProgress().paid).toBe(false)
    expect(getRewards().points).toBeGreaterThan(0)
  })
})

describe('"Find tallet": a Danish number name, four Persian words', () => {
  it('names the meaning in the prompt and offers the words right to left', () => {
    const { container } = open(NUMBER_ROUTE)
    const question = firstQuestion('tal')

    expect(screen.getByRole('heading', { name: 'Find tallet' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hvilket ord betyder »en«?' })).toBeInTheDocument()
    // The specimen IS the answer in this round, so it stays off the page —
    // the four choices are the only Persian on offer.
    expect(container.querySelector('.fa-specimen')).not.toBeInTheDocument()

    for (const choice of question.choices) {
      const button = choiceButton(choice.glyph)
      expect(button, choice.glyph).toBeInTheDocument()
      expect(button.getAttribute('dir')).toBe('rtl')
    }
  })
})

describe('a round that does not exist', () => {
  it('goes quietly back to the lesson list instead of erroring', () => {
    open('#/lesson/taelle/ovelse/hop')

    expect(screen.getByRole('heading', { name: 'Lektioner' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Find betydningen' })).not.toBeInTheDocument()
  })
})

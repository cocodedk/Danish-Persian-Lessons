import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen } from '../progress/alphabet'
import { getRewards } from '../rewards/engine'
import { buildQuestions } from '../lessons/exercises'
import { PRAISE } from '../rewards/copy'

const questions = buildQuestions('find')

function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

/** Taps the right glyph for the question currently on screen. */
function answer(index: number) {
  const glyph = questions[index].choices.find((c) => c.id === questions[index].answerId)!.glyph
  const buttons = screen.getAllByRole('button').filter((b) => b.textContent === glyph)
  fireEvent.click(buttons[0])
}

function praiseOnScreen(): boolean {
  return PRAISE.some((line) => screen.queryAllByText(line.fa).length > 0)
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({ name: 'Sara' })
  markOrientationSeen()
})

describe('every exercise answer flows through the reward engine', () => {
  it('celebrates each right answer with a tick and a praise pair in both languages', () => {
    open('#/lesson/alphabet/ovelse/find')

    answer(0)
    expect(praiseOnScreen()).toBe(true)
    expect(screen.getAllByLabelText('Rigtigt').length).toBeGreaterThan(0)
    expect(getRewards().points).toBe(1)

    fireEvent.click(screen.getByText('Næste'))
    answer(1)
    expect(praiseOnScreen()).toBe(true)
    expect(getRewards().points).toBe(2)
  })

  it('keeps the gentle wrong-answer copy from plan 003, and deducts nothing', () => {
    open('#/lesson/alphabet/ovelse/find')
    const wrong = questions[0].choices.find((c) => c.id !== questions[0].answerId)!.glyph
    fireEvent.click(screen.getAllByRole('button').filter((b) => b.textContent === wrong)[0])

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText('— prøv igen. Du mister ingenting.')).toBeInTheDocument()
    expect(getRewards().points).toBe(0)
    expect(getRewards().level).toBe(1)
  })

  it('celebrates every single question of a full round, then fills the page at the end', () => {
    open('#/lesson/alphabet/ovelse/find')

    for (let i = 0; i < questions.length; i += 1) {
      answer(i)
      expect(praiseOnScreen(), `question ${i + 1} went uncelebrated`).toBe(true)
      fireEvent.click(screen.getByText(i === questions.length - 1 ? 'Afslut runden' : 'Næste'))
    }

    // The page-flip announces the level, and the round says nothing was lost.
    expect(screen.getByText(/Side \d+ er fuld!/)).toBeInTheDocument()
    expect(screen.getByText(/Du kom hele runden igennem/)).toBeInTheDocument()
    const view = getRewards()
    expect(view.level).toBeGreaterThan(1)
    expect(view.points % 20).toBe(0)
    expect(view.stickers.length).toBeGreaterThan(0)
  })

  it('offers the bonus exercise as a gift that is free to put away', () => {
    open('#/lesson/alphabet/ovelse/find')
    for (let i = 0; i < questions.length; i += 1) {
      answer(i)
      fireEvent.click(screen.getByText(i === questions.length - 1 ? 'Afslut runden' : 'Næste'))
    }

    expect(screen.getByText('یک تمرین جایزه!')).toBeInTheDocument()
    const before = getRewards()
    fireEvent.click(screen.getByText('Gem den til senere'))

    expect(screen.queryByText('یک تمرین جایزه!')).not.toBeInTheDocument()
    expect(getRewards().points).toBe(before.points)
    expect(getRewards().stickers.length).toBe(before.stickers.length)
    expect(getRewards().level).toBe(before.level)
  })

  it('opens the gift into a real, short round built from questions the learner knows', () => {
    open('#/lesson/alphabet/gave/1')
    expect(screen.getByRole('heading', { name: 'Bonusøvelse' })).toBeInTheDocument()
    expect(screen.getByText('Spørgsmål 1 af 3')).toBeInTheDocument()
    expect(screen.getByText('یک تمرین جایزه!')).toBeInTheDocument()
  })
})

describe('a letter cleared from its own screen celebrates too', () => {
  it('praises "Jeg kan den" instead of only ticking it off', () => {
    open('#/lesson/alphabet/bogstav/be')
    fireEvent.click(screen.getByText('Jeg kan den'))

    expect(praiseOnScreen()).toBe(true)
    expect(getRewards().points).toBe(2)
  })
})

describe('the forside carries the streak', () => {
  it('says nothing about streaks before the first day, then reports it warmly', () => {
    const first = render(<App />)
    expect(screen.queryByText(/dage ·/)).not.toBeInTheDocument()
    expect(screen.queryByText(/dag ·/)).not.toBeInTheDocument()
    first.unmount()

    const letter = open('#/lesson/alphabet/bogstav/be')
    fireEvent.click(screen.getByText('Jeg kan den'))
    letter.unmount()

    open('#/')
    const home = screen.getByRole('main')
    expect(within(home).getByText('1 dag · du har øvet i dag')).toBeInTheDocument()
  })
})

describe('a null envelope value never crashes the app', () => {
  it('renders home, a letter route and the find exercise as fresh state', () => {
    window.localStorage.setItem(
      'dpl.v1.rewards',
      JSON.stringify({ schemaVersion: 1, value: null }),
    )
    window.localStorage.setItem(
      'dpl.v1.alphabet',
      JSON.stringify({ schemaVersion: 1, value: null }),
    )

    const home = open('#/')
    expect(getRewards().points).toBe(0)
    home.unmount()

    const letter = open('#/lesson/alphabet/bogstav/be')
    expect(screen.getByRole('button', { name: 'Jeg kan den' })).toBeInTheDocument()
    letter.unmount()

    const exercise = open('#/lesson/alphabet/ovelse/find')
    expect(screen.getByText(/Spørgsmål 1 af/)).toBeInTheDocument()
    exercise.unmount()
  })
})

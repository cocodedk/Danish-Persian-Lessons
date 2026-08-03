// The gift wiring, guarded at the UI level: BonusScreen must hand the engine
// the round's `giftId` on BOTH calls — the per-answer one and the closing one.
// Drop it from either call and these tests go red, because the bonus round
// starts paying again every time it is opened.
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen } from '../progress/alphabet'
import { getRewards } from '../rewards/engine'
import { bonusQuestions, BONUS_LENGTH } from '../lessons/bonus'
import { PRAISE } from '../rewards/copy'

const questions = bonusQuestions(1)

function praiseOnScreen(): boolean {
  return PRAISE.some((line) => screen.queryAllByText(line.fa).length > 0)
}

/** Taps the right glyph for bonus question `index`. */
function answer(index: number): void {
  const question = questions[index]
  const glyph = question.choices.find((choice) => choice.id === question.answerId)!.glyph
  fireEvent.click(screen.getAllByRole('button').filter((b) => b.textContent === glyph)[0])
}

/** Opens gift 1 from its own URL and answers `count` questions. */
function openGift(count: number) {
  window.location.hash = '#/lesson/alphabet/gave/1'
  const view = render(<App />)
  for (let i = 0; i < count; i += 1) {
    answer(i)
    // Every answer is celebrated, paid or not — praise is never the payment.
    expect(praiseOnScreen(), `bonus question ${i + 1} went uncelebrated`).toBe(true)
    fireEvent.click(screen.getByText(i === BONUS_LENGTH - 1 ? 'Afslut runden' : 'Næste'))
  }
  return view
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({ name: 'Sara' })
  markOrientationSeen()
})

describe('a bonus round pays its bundle exactly once', () => {
  it('adds nothing the second time the same gift URL is played through', () => {
    openGift(BONUS_LENGTH).unmount()
    const first = getRewards()
    expect(first.points).toBeGreaterThan(0)

    openGift(BONUS_LENGTH).unmount()

    const second = getRewards()
    expect(second.points).toBe(first.points)
    expect(second.level).toBe(first.level)
    expect(second.stickers.length).toBe(first.stickers.length)
  })

  it('pays nothing for answering the bonus questions and walking out', () => {
    openGift(BONUS_LENGTH - 1).unmount()

    // Praise-only inside the round: the half-played gift cannot be farmed.
    expect(getRewards().points).toBe(0)
    expect(getRewards().stickers.length).toBe(0)

    // And finishing it afterwards still pays the whole bundle, once.
    openGift(BONUS_LENGTH).unmount()
    expect(getRewards().points).toBeGreaterThan(0)
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen } from '../progress/alphabet'
import { celebrate, getRewards } from '../rewards/engine'
import { GUILT_WORDS } from '../rewards/copy'
import { getSettings } from '../progress/settings'

/** Five days of practice in March, then silence. */
const PRACTISED = [1, 2, 3, 4, 5]
const TEN_DAYS_LATER = new Date(2026, 2, 15, 19, 30)

function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

/** Everything the learner can read on screen right now. */
function pageText(): string {
  return document.body.textContent ?? ''
}

function expectNoGuilt() {
  const text = pageText()
  for (const word of GUILT_WORDS) {
    expect(text.toLowerCase(), `the page says "${word}"`).not.toContain(word.toLowerCase())
  }
  // Never a zero where a count of days belongs.
  expect(text).not.toMatch(/\b0 dage?\b/)
  expect(text).not.toContain('۰ روز')
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({ name: 'Sara' })
  markOrientationSeen()
  for (const day of PRACTISED) celebrate('answer', new Date(2026, 2, day, 9, 0))
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(TEN_DAYS_LATER)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('coming back after ten days away', () => {
  it('greets the learner on the forside with a resting streak, not a broken one', () => {
    open('#/')

    expect(screen.getByText('5 dage · stimen hviler — én øvelse vækker den')).toBeInTheDocument()
    expect(screen.getByText('۵ روز · رشته‌ات خوابیده، یک تمرین بیدارش می‌کند')).toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    expectNoGuilt()
  })

  it('wakes the streak on the first exercise and welcomes the learner back', () => {
    open('#/lesson/alphabet/bogstav/be')
    fireEvent.click(screen.getByText('Jeg kan den'))

    expect(screen.getByText('خوش برگشتی!')).toBeInTheDocument()
    expect(screen.getByText('khåsj bargasjti · [xoʃ bæɾɡæʃti]')).toBeInTheDocument()
    expect(
      screen.getByText('Velkommen tilbage! Stimen er vågen igen, nu 6 dage.'),
    ).toBeInTheDocument()
    expectNoGuilt()

    // Persian, then the pron line, then Danish — the same order as the praise
    // row above it, and every other specimen in the app (plan 009).
    const row = [...(document.querySelector('.celebration__welcome')?.children ?? [])].map(
      (el) => el.className,
    )
    expect(row).toEqual(['celebration__fa', 'pron-line', ''])
  })

  it('resumes at the old value plus one, and takes nothing away on the way', () => {
    const before = getRewards()
    expect(before.streak).toEqual({ value: 5, resting: true, today: false })

    const letter = open('#/lesson/alphabet/bogstav/be')
    fireEvent.click(screen.getByText('Jeg kan den'))
    letter.unmount()

    const after = getRewards()
    expect(after.streak).toEqual({ value: 6, resting: false, today: true })
    expect(after.points).toBeGreaterThan(before.points)
    expect(after.level).toBeGreaterThanOrEqual(before.level)
    expect(after.stickers.length).toBeGreaterThanOrEqual(before.stickers.length)

    open('#/')
    expect(screen.getByText('6 dage · du har øvet i dag')).toBeInTheDocument()
    expectNoGuilt()
  })
})

describe('the mute toggle', () => {
  it('is on by default, switches off, and survives a reload', () => {
    const first = open('#/')
    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))

    const toggle = screen.getByLabelText('Lyd ved ros og nye sider')
    expect(toggle).toBeChecked()

    fireEvent.click(toggle)
    expect(getSettings().sound).toBe(false)
    first.unmount()

    open('#/')
    fireEvent.click(screen.getByRole('button', { name: 'Sara' }))
    expect(screen.getByLabelText('Lyd ved ros og nye sider')).not.toBeChecked()
  })
})

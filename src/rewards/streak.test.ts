import { describe, it, expect, beforeEach } from 'vitest'
import { celebrate, getRewards } from './engine'
import { dayKey, daysBetween } from './days'
import { streakLine, GUILT_WORDS } from './copy'

function at(year: number, month: number, day: number, hour = 9, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute)
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('day boundaries are local midnight', () => {
  it('keys a day by the local calendar date, not UTC', () => {
    expect(dayKey(at(2026, 3, 1, 0, 1))).toBe('2026-03-01')
    expect(dayKey(at(2026, 3, 1, 23, 59))).toBe('2026-03-01')
  })

  it('counts whole days between keys across a month end', () => {
    expect(daysBetween('2026-02-28', '2026-03-01')).toBe(1)
    expect(daysBetween('2026-03-01', '2026-03-11')).toBe(10)
  })

  it('counts one practice day however far apart two events sit inside it', () => {
    celebrate('answer', at(2026, 3, 1, 0, 30))
    celebrate('answer', at(2026, 3, 1, 23, 30))
    expect(getRewards(at(2026, 3, 1, 23, 45)).streak.value).toBe(1)
  })

  it('counts two practice days for one minute either side of local midnight', () => {
    celebrate('answer', at(2026, 3, 1, 23, 59))
    celebrate('answer', at(2026, 3, 2, 0, 1))
    expect(getRewards(at(2026, 3, 2, 0, 2)).streak.value).toBe(2)
  })
})

describe('the streak rests — it never resets', () => {
  it('grows by one on every new practice day', () => {
    for (let day = 1; day <= 5; day += 1) celebrate('answer', at(2026, 3, day))
    expect(getRewards(at(2026, 3, 5)).streak).toEqual({ value: 5, resting: false, today: true })
  })

  it('rests after a missed day, keeping its full value', () => {
    for (let day = 1; day <= 5; day += 1) celebrate('answer', at(2026, 3, day))
    const resting = getRewards(at(2026, 3, 15)).streak
    expect(resting).toEqual({ value: 5, resting: true, today: false })
  })

  it('a ten-day absence then one exercise: welcomed back, resumed at value + 1, nothing lost', () => {
    for (let day = 1; day <= 5; day += 1) celebrate('answer', at(2026, 3, day))
    const before = getRewards(at(2026, 3, 15))
    expect(before.streak).toEqual({ value: 5, resting: true, today: false })

    const reward = celebrate('answer', at(2026, 3, 15, 20, 0))

    expect(reward.wokeUp).toBe(true)
    expect(reward.streak).toEqual({ value: 6, resting: false, today: true })
    expect(reward.points).toBeGreaterThan(before.points)
    expect(reward.level).toBeGreaterThanOrEqual(before.level)
    expect(getRewards(at(2026, 3, 15, 20, 1)).stickers.length).toBeGreaterThanOrEqual(
      before.stickers.length,
    )
  })

  it('never shows a zero, and never resting, once a single day is on the board', () => {
    celebrate('answer', at(2026, 3, 1))
    for (const day of [1, 2, 3, 9, 40, 400]) {
      const view = getRewards(at(2026, 3, 1 + day))
      expect(view.streak.value).toBeGreaterThanOrEqual(1)
    }
  })

  it('says the streak is resting, never that it was lost', () => {
    for (let day = 1; day <= 5; day += 1) celebrate('answer', at(2026, 3, day))
    const line = streakLine(getRewards(at(2026, 3, 15)).streak)

    expect(line.da).toBe('5 dage · stimen hviler — én øvelse vækker den')
    expect(line.fa).toBe('۵ روز · رشته‌ات خوابیده — یک تمرین بیدارش می‌کند')
    for (const word of GUILT_WORDS) {
      expect(line.da.toLowerCase()).not.toContain(word)
      expect(line.fa).not.toContain(word)
    }
  })

  it('speaks warmly on the day the learner is actually here', () => {
    celebrate('answer', at(2026, 3, 1))
    expect(streakLine(getRewards(at(2026, 3, 1, 12)).streak).da).toBe(
      '1 dag · du har øvet i dag',
    )
    expect(streakLine(getRewards(at(2026, 3, 2, 12)).streak).da).toBe('1 dag · stimen er vågen')
  })
})

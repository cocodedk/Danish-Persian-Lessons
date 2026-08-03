import { describe, it, expect, beforeEach } from 'vitest'
import { celebrate, getRewards, join, POINTS_PER_PAGE, STICKER_STEP } from './engine'
import { findPersianTextViolations } from '../lessons/textRules'
import type { RewardEventKind } from './types'

const DAY = new Date(2026, 2, 3, 10, 0, 0)

beforeEach(() => {
  window.localStorage.clear()
})

/** Points/level/stickers/practice-days as one comparable tuple. */
function snapshot() {
  const view = getRewards(DAY)
  return [view.points, view.level, view.stickers.length, view.streak.value]
}

describe('reward engine — every completion celebrates', () => {
  it('starts at level one with nothing owed and no zero-shaming streak', () => {
    const view = getRewards(DAY)
    expect(view).toMatchObject({ points: 0, level: 1, stickers: [] })
    expect(view.streak).toEqual({ value: 0, resting: false, today: false })
  })

  it('gives every event kind at least one red tick, a praise pair and a sound', () => {
    for (const kind of ['answer', 'item', 'page'] as const) {
      window.localStorage.clear()
      const reward = celebrate(kind, DAY)
      expect(reward.ticks).toBeGreaterThanOrEqual(1)
      expect(reward.praise.fa.length).toBeGreaterThan(0)
      expect(reward.praise.da.length).toBeGreaterThan(0)
      expect(reward.sounds.length).toBeGreaterThan(0)
    }
  })

  it('varies the praise instead of repeating one line, in both languages', () => {
    const fa = new Set<string>()
    const da = new Set<string>()
    for (let i = 0; i < 6; i += 1) {
      const reward = celebrate('answer', DAY)
      fa.add(reward.praise.fa)
      da.add(reward.praise.da)
    }
    expect(fa.size).toBeGreaterThanOrEqual(4)
    expect(da.size).toBeGreaterThanOrEqual(4)
    for (const line of fa) expect(findPersianTextViolations(line)).toEqual([])
  })

  it('fills the notebook page on a page event: exactly one level up, with a fanfare', () => {
    celebrate('answer', DAY)
    const before = getRewards(DAY).level
    const reward = celebrate('page', DAY)

    expect(reward.levelUp).toBe(before + 1)
    expect(reward.level).toBe(before + 1)
    expect(reward.points % POINTS_PER_PAGE).toBe(0)
    expect(reward.sounds).toContain('fanfare')
  })

  it('stamps a sticker at each milestone and chimes for it', () => {
    let stickers = 0
    let chimed = false
    for (let i = 0; i < STICKER_STEP; i += 1) {
      const reward = celebrate('answer', DAY)
      stickers += reward.stickers.length
      if (reward.sounds.includes('chime')) chimed = true
    }
    expect(stickers).toBeGreaterThanOrEqual(1)
    expect(chimed).toBe(true)
    expect(getRewards(DAY).stickers.map((s) => s.kind)).toContain('afarin')
  })
})

describe('reward engine — nothing is ever taken away', () => {
  it('shrugs off a hostile call: an undefined or unknown kind changes nothing', () => {
    // A real 45-point, level-3, multi-sticker state, earned the honest way.
    for (let i = 0; i < 45; i += 1) celebrate('answer', DAY)
    const before = getRewards(DAY)
    expect(before).toMatchObject({ points: 45, level: 3 })
    expect(before.stickers.length).toBeGreaterThan(0)

    celebrate(undefined as unknown as RewardEventKind, DAY)
    celebrate('bogus' as unknown as RewardEventKind, DAY)

    const after = getRewards(DAY)
    expect(after.points).toBe(before.points)
    expect(after.level).toBe(before.level)
    expect(after.stickers).toEqual(before.stickers)
  })

  it('never lets a negative number in storage produce a negative or NaN view', () => {
    window.localStorage.setItem(
      'dpl.v1.rewards',
      JSON.stringify({
        schemaVersion: 1,
        value: { points: -5, level: -3, streak: { value: -9, resting: false } },
      }),
    )
    const view = getRewards(DAY)
    expect(view.points).toBeGreaterThanOrEqual(0)
    expect(view.level).toBeGreaterThanOrEqual(1)
    expect(view.streak.value).toBeGreaterThanOrEqual(0)
    expect(Number.isNaN(view.points)).toBe(false)
    expect(Number.isNaN(view.level)).toBe(false)

    const reward = celebrate('answer', DAY)
    expect(reward.points).toBeGreaterThanOrEqual(1)
    expect(Number.isNaN(reward.points)).toBe(false)
    expect(getRewards(DAY).points).toBeGreaterThanOrEqual(0)
  })

  it('never lets a NaN-ish (non-numeric) value in storage leak into the view', () => {
    window.localStorage.setItem(
      'dpl.v1.rewards',
      JSON.stringify({ schemaVersion: 1, value: { points: null, level: 'many' } }),
    )
    const view = getRewards(DAY)
    expect(Number.isNaN(view.points)).toBe(false)
    expect(Number.isNaN(view.level)).toBe(false)
    expect(view.points).toBeGreaterThanOrEqual(0)
    expect(view.level).toBeGreaterThanOrEqual(1)
  })

  it('never decreases anything across a long mixed replay', () => {
    let previous = snapshot()
    const kinds = ['answer', 'answer', 'item', 'answer', 'page', 'item'] as const
    for (let i = 0; i < 40; i += 1) {
      celebrate(kinds[i % kinds.length], DAY)
      const now = snapshot()
      now.forEach((value, index) => expect(value).toBeGreaterThanOrEqual(previous[index]))
      previous = now
    }
  })

  it('writes only through a join, so a smaller record can never land on a bigger one', () => {
    const big = {
      stickers: ['s1', 's2'],
      level: 4,
      points: 70,
      practiceDates: ['2026-03-01', '2026-03-02'],
      giftsOpened: ['g1'],
      streak: { value: 2, resting: false },
    }
    const small = {
      stickers: [],
      level: 1,
      points: 0,
      practiceDates: [],
      giftsOpened: [],
      streak: { value: 0, resting: true },
    }

    for (const merged of [join(big, small), join(small, big)]) {
      expect(merged.points).toBe(70)
      expect(merged.level).toBe(4)
      expect(merged.stickers).toEqual(['s1', 's2'])
      expect(merged.practiceDates).toEqual(['2026-03-01', '2026-03-02'])
      expect(merged.giftsOpened).toEqual(['g1'])
      expect(merged.streak.value).toBe(2)
    }
  })

  it('treats a damaged record as a fresh one rather than crashing', () => {
    window.localStorage.setItem(
      'dpl.v1.rewards',
      JSON.stringify({ schemaVersion: 1, value: { points: 'lots', stickers: 'none' } }),
    )
    expect(getRewards(DAY).points).toBe(0)
    expect(celebrate('answer', DAY).points).toBe(1)
  })
})

describe('reward engine — surprise gifts run on a schedule, never on chance', () => {
  it('replays identically from the same starting point', () => {
    const run = () => {
      window.localStorage.clear()
      return Array.from({ length: 60 }, (_, i) =>
        JSON.stringify(celebrate(i % 10 === 9 ? 'page' : 'answer', DAY)),
      )
    }
    expect(run()).toEqual(run())
  })

  it('hands out a bonus exercise as a gift, framed as one', () => {
    let gift = null as ReturnType<typeof celebrate>['gift']
    for (let i = 0; i < 40 && !gift; i += 1) gift = celebrate('answer', DAY).gift
    expect(gift).not.toBeNull()
    expect(gift?.fa).toBe('یک تمرین جایزه!')
    expect(gift?.da).toBe('En bonusøvelse i gave!')
  })

  it('costs nothing to ignore a gift — the next completion still pays in full', () => {
    let seen = false
    let before = getRewards(DAY)
    for (let i = 0; i < 40 && !seen; i += 1) {
      seen = celebrate('answer', DAY).gift !== null
      before = getRewards(DAY)
    }
    expect(seen).toBe(true)
    // The gift is simply never opened; the learner keeps everything anyway.
    const next = celebrate('answer', DAY)
    expect(next.points).toBe(before.points + 1)
    expect(next.ticks).toBeGreaterThanOrEqual(1)
  })
})

describe('reward engine — a gift pays exactly once', () => {
  /** Three answers and a closing page event, the shape one bonus round takes. */
  function playGift(id: string) {
    celebrate('answer', DAY, id)
    celebrate('answer', DAY, id)
    celebrate('answer', DAY, id)
    return celebrate('page', DAY, id)
  }

  it('replaying the same gift id thirty times adds nothing beyond the first pass', () => {
    playGift('g1')
    const once = snapshot()

    for (let i = 0; i < 30; i += 1) playGift('g1')

    expect(snapshot()).toEqual(once)
  })

  it('still plays and praises a replayed gift, even though it pays nothing new', () => {
    playGift('g1')
    const replay = celebrate('answer', DAY, 'g1')

    expect(replay.ticks).toBeGreaterThanOrEqual(1)
    expect(replay.praise.fa.length).toBeGreaterThan(0)
    expect(replay.stickers).toEqual([])
    expect(replay.points).toBe(getRewards(DAY).points)
  })

  it('does not cross-contaminate: a different gift id still pays its own way', () => {
    playGift('g1')
    const afterFirst = snapshot()
    playGift('g2')
    expect(snapshot()[0]).toBeGreaterThan(afterFirst[0])
  })
})

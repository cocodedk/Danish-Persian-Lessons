// What a completion feels like. The "nothing can ever be taken away" half of
// plan 007 lives next door, in permanence.test.ts.
import { describe, it, expect, beforeEach } from 'vitest'
import { celebrate, getRewards, POINTS_PER_PAGE, STICKER_STEP } from './engine'
import { findPersianTextViolations } from '../lessons/textRules'

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

describe('reward engine — a lesson replayed pays exactly once', () => {
  it('praises a replay, counts it as practice, and adds nothing to the total', () => {
    celebrate('page', DAY)
    const paid = snapshot()

    const replay = celebrate('replay', DAY)

    expect(replay.ticks).toBeGreaterThanOrEqual(1)
    expect(replay.praise.fa.length).toBeGreaterThan(0)
    expect(replay.stickers).toEqual([])
    expect(replay.streak.value).toBeGreaterThan(0)
    for (let i = 0; i < 30; i += 1) celebrate('replay', DAY)
    expect(snapshot()).toEqual(paid)
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

  it('still varies the praise on a praise-only path, where points never move (round 4)', () => {
    playGift('g1')
    const pointsBefore = getRewards(DAY).points

    const fa = new Set<string>()
    for (let i = 0; i < 6; i += 1) {
      // Every one of these is claimed already: praise-only, points untouched.
      fa.add(celebrate('answer', DAY, 'g1').praise.fa)
    }

    expect(getRewards(DAY).points).toBe(pointsBefore)
    expect(fa.size).toBeGreaterThanOrEqual(4)
  })

  it('does not cross-contaminate: a different gift id still pays its own way', () => {
    playGift('g1')
    const afterFirst = snapshot()
    playGift('g2')
    expect(snapshot()[0]).toBeGreaterThan(afterFirst[0])
  })

  it('pays nothing for a half-played gift, however many times it is half-played', () => {
    // One ordinary answer first, so today is already on the practice list and
    // the tuple below can only move if the gift itself paid something.
    celebrate('answer', DAY)
    const before = snapshot()

    for (let i = 0; i < 10; i += 1) {
      const partial = celebrate('answer', DAY, 'g1')
      // Praise-only: a full tick and a warm line, no points.
      expect(partial.ticks).toBeGreaterThanOrEqual(1)
      expect(partial.praise.fa.length).toBeGreaterThan(0)
      expect(partial.stickers).toEqual([])
    }
    expect(snapshot()).toEqual(before)

    // Finishing it later still pays the bundle, and still pays it exactly once.
    celebrate('page', DAY, 'g1')
    const paid = snapshot()
    expect(paid[0]).toBeGreaterThan(before[0])
    celebrate('page', DAY, 'g1')
    expect(snapshot()).toEqual(paid)
  })
})

// Permanence, asserted by API shape rather than by anyone's discipline: the export surface
// is snapshotted, no name a hostile caller can reach is an event kind — including every own
// name on `Object.prototype` — and nothing handed to the store can shrink what is already
// there. The seeded replay that hammers the same guarantees is permanenceFuzz.test.ts.
import { describe, it, expect, beforeEach } from 'vitest'
import * as engine from './engine'
import * as records from './records'
import { celebrate, getRewards } from './engine'
import { join, normalize } from './records'
import type { RewardEventKind } from './types'
import { DAY, PROTOTYPE_KEYS, snapshot, expectNeverLower, putRaw } from './permanenceHarness'

beforeEach(() => {
  window.localStorage.clear()
})

describe('the reward API has a shape, and the shape is the guarantee', () => {
  it('exports exactly these names — anything else is a deliberate diff', () => {
    expect(Object.keys(engine).sort()).toEqual([
      'GIFT_STEP',
      'POINTS_PER_PAGE',
      'STICKER_STEP',
      'awardFor',
      'celebrate',
      'getRewards',
    ])
    expect(Object.keys(records).sort()).toEqual([
      'join',
      'normalize',
      'numberOr',
      'readRecord',
      'saveRecord',
    ])
  })

  it('gives its only mutator no way in for a point total, a level or a sticker', () => {
    // `celebrate(kind, now?, giftId?)` — one required parameter. Proven here,
    // with the export-surface test above: the surface is pinned and every
    // number reaching storage is clamped — not that no signature could ever add a way in.
    expect(engine.celebrate.length).toBe(1)
    expect(typeof engine.getRewards).toBe('function')
  })
})

describe('a prototype key is not an event kind', () => {
  it('never lowers and never pays, for any own name on Object.prototype', () => {
    // The list is computed, not typed out, so a runtime that grows a new
    // Object.prototype member is covered the day it ships.
    expect(PROTOTYPE_KEYS).toContain('__proto__')
    expect(PROTOTYPE_KEYS).toContain('constructor')
    expect(PROTOTYPE_KEYS.length).toBeGreaterThan(5)

    for (let i = 0; i < 45; i += 1) celebrate('answer', DAY)
    expect(snapshot()[0]).toBe(45)
    expect(snapshot()[2]).toBeGreaterThan(0)

    for (const kind of [...PROTOTYPE_KEYS, 'bogus', undefined, null] as unknown[]) {
      const before = snapshot()
      celebrate(kind as RewardEventKind, DAY)
      const after = snapshot()
      expectNeverLower(before, after, `kind ${String(kind)}`)
      // Nor does an unknown kind quietly pay out: it is worth exactly nothing.
      expect(after[0], `kind ${String(kind)} paid points`).toBe(before[0])
    }
    expect(snapshot()[0]).toBe(45)
  })

  it('awardFor direct: 0 for every prototype name, the table value for a real kind', () => {
    for (const key of PROTOTYPE_KEYS) {
      expect(engine.awardFor(key as RewardEventKind), `awardFor(${key})`).toBe(0)
    }
    expect(engine.awardFor('answer')).toBe(1)
    expect(engine.awardFor('item')).toBe(2)
    expect(engine.awardFor('page')).toBe(0)
    expect(engine.awardFor('replay')).toBe(0)
  })
})

const BIG = {
  stickers: ['s1', 's2'],
  level: 4,
  points: 70,
  practiceDates: ['2026-03-01', '2026-03-02'],
  giftsOpened: ['g1'],
  streak: { value: 2, resting: false },
}
const SMALL = {
  stickers: [] as string[],
  level: 1,
  points: 0,
  practiceDates: [],
  giftsOpened: [],
  streak: { value: 0, resting: true },
}
/** A NaN-carrying record is an operand of the same kind: it cannot win either. */
const POISONED = { ...SMALL, points: Number.NaN, level: '4' as unknown as number }

describe('nothing handed to the store can shrink what the learner owns', () => {
  it('clamps a negative, a non-numeric and a wholly damaged record alike', () => {
    for (const value of [
      { points: -5, level: -3, streak: { value: -9, resting: false } },
      { points: null, level: 'many' },
      { points: 'lots', stickers: 'none', practiceDates: 7, giftsOpened: null },
    ]) {
      window.localStorage.clear()
      putRaw(value)

      const view = getRewards(DAY)
      expect(Number.isNaN(view.points)).toBe(false)
      expect(Number.isNaN(view.level)).toBe(false)
      expect(view.points).toBeGreaterThanOrEqual(0)
      expect(view.level).toBeGreaterThanOrEqual(1)
      expect(view.streak.value).toBeGreaterThanOrEqual(0)
      expect(celebrate('answer', DAY).points).toBeGreaterThanOrEqual(1)
    }
    expect(normalize(null)).toMatchObject({ points: 0, level: 1, stickers: [] })
    expect(normalize({ points: Number.NaN, level: Infinity })).toMatchObject({ points: 0, level: 1 })
  })

  it('writes only through a join, so a smaller record can never land on a bigger one', () => {
    for (const merged of [join(BIG, SMALL), join(SMALL, BIG), join(BIG, POISONED)]) {
      expect(merged.points).toBe(70)
      expect(merged.level).toBe(4)
      expect(merged.stickers).toEqual(['s1', 's2'])
      expect(merged.practiceDates).toEqual(['2026-03-01', '2026-03-02'])
      expect(merged.giftsOpened).toEqual(['g1'])
      expect(merged.streak.value).toBe(2)
    }
  })
})

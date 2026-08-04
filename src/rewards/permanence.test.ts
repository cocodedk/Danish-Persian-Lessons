// Permanence, asserted by API shape rather than by anyone's discipline: the export surface
// is snapshotted, no name a hostile caller can reach is an event kind — including every own
// name on `Object.prototype` — and a seeded fuzz replays hostile and legitimate events
// against the real store, checking after EVERY event that nothing went down.
import { describe, it, expect, beforeEach } from 'vitest'
import * as engine from './engine'
import * as records from './records'
import { celebrate, getRewards } from './engine'
import { join, normalize } from './records'
import type { RewardEventKind } from './types'

const KEY = 'dpl.v1.rewards'
const DAY = new Date(2026, 2, 3, 10, 0, 0)

/** Every own name on `Object.prototype`, computed — `__proto__` included. */
const PROTOTYPE_KEYS = Object.getOwnPropertyNames(Object.prototype)

/** Points, level, sticker count and streak value as one comparable tuple. */
function snapshot(): number[] {
  const view = getRewards(DAY)
  return [view.points, view.level, view.stickers.length, view.streak.value]
}

function expectNeverLower(before: number[], after: number[], what: string): void {
  after.forEach((value, index) => {
    expect(Number.isNaN(value), `${what}: field ${index} went NaN`).toBe(false)
    expect(value, `${what}: field ${index} went down`).toBeGreaterThanOrEqual(before[index])
  })
}

function putRaw(value: unknown): void {
  window.localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, value }))
}

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

/** mulberry32 — seeded, so this fuzz replays identically for everyone, forever. */
function rng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SEEDS = [1, 7, 42, 1337, 2026, 20260803]
const STEPS = 40
const CLOCKS = [DAY, new Date(2026, 2, 9, 8), new Date(2026, 1, 20, 22), new Date('nonsense')]
const KINDS: unknown[] = [
  'answer',
  'item',
  'page',
  'replay',
  'bogus',
  undefined,
  null,
  ...PROTOTYPE_KEYS,
]
const GIFTS = [undefined, 'g1', 'g2']

const STARTS: Record<string, () => void> = {
  clean: () => {},
  'mid-progress': () => {
    for (let i = 0; i < 25; i += 1) celebrate('answer', DAY)
  },
  'hostile-corrupt': () =>
    putRaw({ points: -99, level: 'many', stickers: 'none', giftsOpened: null, streak: null }),
}

describe('monotonicity fuzz — after every single event, nothing has gone down', () => {
  for (const [name, seedState] of Object.entries(STARTS)) {
    it(`holds from a ${name} start, on every seed`, () => {
      for (const seed of SEEDS) {
        window.localStorage.clear()
        seedState()
        const pick = rng(seed)
        let previous = snapshot()

        for (let step = 0; step < STEPS; step += 1) {
          const kind = KINDS[Math.floor(pick() * KINDS.length)]
          const clock = CLOCKS[Math.floor(pick() * CLOCKS.length)]
          celebrate(kind as RewardEventKind, clock, GIFTS[Math.floor(pick() * GIFTS.length)])

          const now = snapshot()
          expectNeverLower(previous, now, `${name} seed ${seed} step ${step} ${String(kind)}`)
          previous = now
        }
      }
    })
  }
})

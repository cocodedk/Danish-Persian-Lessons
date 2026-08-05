// A seeded fuzz replays hostile and legitimate events against the real store,
// checking after EVERY event that nothing the learner owns has gone down. The
// shape-level guarantees it hammers are stated in permanence.test.ts.
import { describe, it, beforeEach } from 'vitest'
import { celebrate } from './engine'
import type { RewardEventKind } from './types'
import { DAY, PROTOTYPE_KEYS, snapshot, expectNeverLower, putRaw } from './permanenceHarness'

beforeEach(() => {
  window.localStorage.clear()
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

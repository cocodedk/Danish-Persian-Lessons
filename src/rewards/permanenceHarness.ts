// The measuring instruments both permanence suites use: one comparable tuple of
// everything a learner owns, the assertion that none of it went down, and a way
// to plant a hostile record straight into storage. Test-only — the file is not
// named *.test.ts, so vitest collects nothing from it and nothing in the app
// imports it.
import { expect } from 'vitest'
import { getRewards } from './engine'

const KEY = 'dpl.v1.rewards'

/** The clock both suites reckon from, so a snapshot means the same thing twice. */
export const DAY = new Date(2026, 2, 3, 10, 0, 0)

/** Every own name on `Object.prototype`, computed — `__proto__` included. */
export const PROTOTYPE_KEYS = Object.getOwnPropertyNames(Object.prototype)

/** Points, level, sticker count and streak value as one comparable tuple. */
export function snapshot(): number[] {
  const view = getRewards(DAY)
  return [view.points, view.level, view.stickers.length, view.streak.value]
}

export function expectNeverLower(before: number[], after: number[], what: string): void {
  after.forEach((value, index) => {
    expect(Number.isNaN(value), `${what}: field ${index} went NaN`).toBe(false)
    expect(value, `${what}: field ${index} went down`).toBeGreaterThanOrEqual(before[index])
  })
}

/** Plants `value` in storage exactly as a tampered-with browser would hold it. */
export function putRaw(value: unknown): void {
  window.localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, value }))
}

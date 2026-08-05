// The record algebra behind the reward engine: how a `RewardsRecord` is read,
// cleaned and merged. Split out of engine.ts (critic round 2) so the rules that
// make a reward permanent live in one small file with nothing else in it.
//
// Two rules, and every write obeys both because there is no other way in:
//   * `numberOr` — a number counts as a number only when it is finite and ≥ 0;
//     anything else (NaN, Infinity, -3, 'many', undefined, whatever a
//     prototype key dragged in) becomes the fallback;
//   * `join` — both sides go through `normalize` first, then numbers keep their
//     maximum and lists keep their union. A NaN therefore cannot survive a
//     join, no matter which caller produced it, and nothing on disk can shrink.
import { readJSON, writeJSON } from '../progress/storage'
import type { RewardsRecord } from './types'

const KEY = 'rewards'

/** A record as it arrives: from storage, from a caller, or not at all. */
export type RawRecord = Partial<RewardsRecord> | null | undefined

const EMPTY: RewardsRecord = {
  stickers: [],
  level: 1,
  points: 0,
  practiceDates: [],
  giftsOpened: [],
  cheers: 0,
  streak: { value: 0, resting: false },
}

/** Finite and ≥ 0, or the fallback. The one numeric gate in the rewards store. */
export function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback
}

function stringsOr(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/** Anything may be sitting in storage — even `null` itself; take only what has the right shape. */
export function normalize(rawInput: RawRecord): RewardsRecord {
  const raw = rawInput ?? {}
  // Sorted lexically (YYYY-MM-DD sorts chronologically) so the last entry is
  // always the true latest practice day, even if a backwards clock appended
  // an earlier date after later ones.
  const practiceDates = stringsOr(raw.practiceDates).sort()
  return {
    stickers: stringsOr(raw.stickers),
    level: numberOr(raw.level, EMPTY.level),
    points: numberOr(raw.points, EMPTY.points),
    practiceDates,
    giftsOpened: stringsOr(raw.giftsOpened),
    cheers: numberOr(raw.cheers, EMPTY.cheers),
    streak: { value: practiceDates.length, resting: raw.streak?.resting === true },
  }
}

function union(a: string[], b: string[]): string[] {
  return [...a, ...b.filter((item) => !a.includes(item))]
}

/**
 * The only way a record reaches disk. Both sides are normalized on the way in,
 * so every number below has already passed the finite-and-≥0 rule; then the
 * numbers keep their maximum and the lists keep their union. Whatever a caller
 * hands in — a smaller record, a NaN, a string that came off a prototype key —
 * nothing already stored can shrink.
 */
export function join(aRaw: RawRecord, bRaw: RawRecord): RewardsRecord {
  const a = normalize(aRaw)
  const b = normalize(bRaw)
  const practiceDates = union(a.practiceDates, b.practiceDates).sort()
  return {
    stickers: union(a.stickers, b.stickers),
    level: Math.max(a.level, b.level),
    points: Math.max(a.points, b.points),
    practiceDates,
    giftsOpened: union(a.giftsOpened, b.giftsOpened),
    cheers: Math.max(a.cheers, b.cheers),
    streak: { value: practiceDates.length, resting: b.streak.resting },
  }
}

/** The record on disk right now, cleaned. Reading never changes anything. */
export function readRecord(): RewardsRecord {
  return normalize(readJSON<Partial<RewardsRecord>>(KEY, {}))
}

/** Writes `next` joined onto whatever is already stored, and returns what landed. */
export function saveRecord(next: RewardsRecord): RewardsRecord {
  const joined = join(readRecord(), next)
  writeJSON<RewardsRecord>(KEY, joined)
  return joined
}

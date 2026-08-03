// The reward engine: `dpl.v1.rewards`. One event in, one celebration out.
//
// Generosity is structural here, not a promise kept by careful callers:
//   * the only exported mutator is `celebrate`, and it takes an event kind —
//     no exported function accepts a level, a point total or a sticker, so
//     "set points to 3" cannot be written against this module at all;
//   * every write goes through `join`, which takes the pointwise maximum of
//     the numbers and the union of the lists — a save can only ever raise;
//   * the streak value IS the number of practice days, an append-only list, so
//     a reset would mean deleting days the learner really practised.
// Surprises run off the point total, never off Math.random, so a round replays
// identically for a test and for a learner who comes back to it.
import { readJSON, writeJSON } from '../progress/storage'
import { dayKey, daysBetween } from './days'
import { PRAISE, GIFT_FA, GIFT_DA } from './copy'
import type {
  Gift,
  Reward,
  RewardEventKind,
  RewardsRecord,
  RewardsView,
  SoundCue,
  Sticker,
  StickerKind,
  StreakState,
} from './types'

const KEY = 'rewards'

/** A notebook page holds twenty points — the ۲۰/۲۰ a teacher writes at the top. */
export const POINTS_PER_PAGE = 20
/** A sticker every ten points. */
export const STICKER_STEP = 10
/** A bonus exercise, offered as a gift, every thirty points. */
export const GIFT_STEP = 30
/** Every third sticker milestone hands out two — the surprise in rule 5. */
const DOUBLE_STICKER_EVERY = 3

const POINT_AWARD: Record<RewardEventKind, number> = { answer: 1, item: 2, page: 0 }
const STICKER_KINDS: StickerKind[] = ['afarin', 'bist', 'star']

const EMPTY: RewardsRecord = {
  stickers: [],
  level: 1,
  points: 0,
  practiceDates: [],
  streak: { value: 0, resting: false },
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stringsOr(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/** Anything may be sitting in storage; take only what has the right shape. */
function normalize(raw: Partial<RewardsRecord>): RewardsRecord {
  const practiceDates = stringsOr(raw.practiceDates)
  return {
    stickers: stringsOr(raw.stickers),
    level: numberOr(raw.level, EMPTY.level),
    points: numberOr(raw.points, EMPTY.points),
    practiceDates,
    streak: { value: practiceDates.length, resting: raw.streak?.resting === true },
  }
}

function union(a: string[], b: string[]): string[] {
  return [...a, ...b.filter((item) => !a.includes(item))]
}

/**
 * The only way a record reaches disk. Numbers keep their maximum, lists keep
 * their union: whatever the caller hands in, nothing on disk can shrink.
 */
export function join(a: RewardsRecord, b: RewardsRecord): RewardsRecord {
  const practiceDates = union(a.practiceDates, b.practiceDates)
  return {
    stickers: union(a.stickers, b.stickers),
    level: Math.max(a.level, b.level),
    points: Math.max(a.points, b.points),
    practiceDates,
    streak: { value: practiceDates.length, resting: b.streak.resting },
  }
}

function readRecord(): RewardsRecord {
  return normalize(readJSON<Partial<RewardsRecord>>(KEY, {}))
}

function save(next: RewardsRecord): RewardsRecord {
  const joined = join(readRecord(), next)
  writeJSON<RewardsRecord>(KEY, joined)
  return joined
}

function levelFor(points: number): number {
  return 1 + Math.floor(points / POINTS_PER_PAGE)
}

/** A page event fills the rest of the page; everything else adds its award. */
function earn(kind: RewardEventKind, points: number): number {
  if (kind === 'page') return (Math.floor(points / POINTS_PER_PAGE) + 1) * POINTS_PER_PAGE
  return points + POINT_AWARD[kind]
}

function stickerAt(ordinal: number): Sticker {
  return { id: `s${ordinal + 1}`, kind: STICKER_KINDS[ordinal % STICKER_KINDS.length] }
}

/** Every sticker milestone the point total just passed, in earn order. */
function stickersFor(from: number, to: number, owned: number): Sticker[] {
  const granted: Sticker[] = []
  const first = Math.floor(from / STICKER_STEP)
  for (let milestone = first + 1; milestone <= Math.floor(to / STICKER_STEP); milestone += 1) {
    const count = milestone % DOUBLE_STICKER_EVERY === 0 ? 2 : 1
    for (let n = 0; n < count; n += 1) granted.push(stickerAt(owned + granted.length))
  }
  return granted
}

function giftFor(from: number, to: number): Gift | null {
  const milestone = Math.floor(to / GIFT_STEP)
  if (milestone <= Math.floor(from / GIFT_STEP)) return null
  return { id: `g${milestone}`, fa: GIFT_FA, da: GIFT_DA }
}

function streakFor(practiceDates: string[], now: Date): StreakState {
  const last = practiceDates[practiceDates.length - 1]
  if (!last) return { value: 0, resting: false, today: false }
  const gap = daysBetween(last, dayKey(now))
  return { value: practiceDates.length, resting: gap >= 2, today: gap === 0 }
}

function toStickers(ids: string[]): Sticker[] {
  return ids.map((id, index) => ({ id, kind: STICKER_KINDS[index % STICKER_KINDS.length] }))
}

/** Everything the learner owns right now. Reading never changes anything. */
export function getRewards(now: Date = new Date()): RewardsView {
  const record = readRecord()
  return {
    stickers: toStickers(record.stickers),
    level: levelFor(record.points),
    points: record.points,
    streak: streakFor(record.practiceDates, now),
  }
}

/**
 * One completion. Always returns a celebration — there is no code path through
 * here that returns nothing, and none that returns less than it was given.
 */
export function celebrate(kind: RewardEventKind, now: Date = new Date()): Reward {
  const before = readRecord()
  const wasResting = streakFor(before.practiceDates, now).resting

  const points = earn(kind, before.points)
  const stickers = stickersFor(before.points, points, before.stickers.length)
  const gift = giftFor(before.points, points)
  const today = dayKey(now)
  const practiceDates = before.practiceDates.includes(today)
    ? before.practiceDates
    : [...before.practiceDates, today]
  const streak = streakFor(practiceDates, now)

  const saved = save({
    stickers: [...before.stickers, ...stickers.map((sticker) => sticker.id)],
    level: levelFor(points),
    points,
    practiceDates,
    streak: { value: streak.value, resting: streak.resting },
  })

  const level = levelFor(saved.points)
  const levelUp = level > levelFor(before.points) ? level : null
  const sounds: SoundCue[] = ['tick']
  if (stickers.length > 0) sounds.push('chime')
  if (levelUp !== null) sounds.push('fanfare')

  return {
    ticks: 1,
    praise: PRAISE[before.points % PRAISE.length],
    stickers,
    levelUp,
    level,
    points: saved.points,
    streak,
    wokeUp: wasResting,
    gift,
    sounds,
  }
}

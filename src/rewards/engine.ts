// The reward engine: `dpl.v1.rewards`. One event in, one celebration out.
//
// Generosity is structural here, not a promise kept by careful callers:
//   * the only exported mutator is `celebrate`, and it takes an event kind —
//     no exported function accepts a level, a point total or a sticker, so
//     "set points to 3" cannot be written against this module at all;
//   * every write goes through `join` (records.ts): numbers keep their maximum,
//     lists keep their union, so a save can only ever raise;
//   * the streak value IS the number of practice days, an append-only list, so
//     a reset would mean deleting days the learner really practised.
// Surprises run off the point total, never off Math.random, so a round replays
// identically for a test and for a learner who comes back to it.
import { dayKey, daysBetween, isValidDayKey } from './days'
import { numberOr, readRecord, saveRecord } from './records'
import { PRAISE, GIFT_FA, GIFT_DA } from './copy'
import type {
  Gift,
  Reward,
  RewardEventKind,
  RewardsView,
  SoundCue,
  Sticker,
  StickerKind,
  StreakState,
} from './types'

/** A notebook page holds twenty points — the ۲۰/۲۰ a teacher writes at the top. */
export const POINTS_PER_PAGE = 20
/** A sticker every ten points. */
export const STICKER_STEP = 10
/** A bonus exercise, offered as a gift, every thirty points. */
export const GIFT_STEP = 30
/** Every third sticker milestone hands out two — the surprise in rule 5. */
const DOUBLE_STICKER_EVERY = 3

/**
 * What each event kind is worth. A null-prototype table on purpose: on a plain
 * object literal `POINT_AWARD['__proto__']` answers with `Object.prototype`
 * (and `.constructor`, `.toString`, … with functions), which string-concatenate
 * into a NaN point total. Here every inherited name is simply absent.
 */
const POINT_AWARD: Record<string, number> = Object.assign(
  Object.create(null) as Record<string, number>,
  { answer: 1, item: 2, page: 0, replay: 0 },
)

const STICKER_KINDS: StickerKind[] = ['afarin', 'bist', 'star']

/**
 * What `kind` is worth: nothing at all unless it is one of the table's own
 * keys. Own-membership is the gate, so an inherited name never reaches the
 * lookup, and the value that comes back is clamped anyway. Exported so this
 * gate has a direct test of its own (permanence.test.ts), not only the
 * indirect coverage `earn` gets it through `celebrate`.
 */
export function awardFor(kind: RewardEventKind): number {
  if (typeof kind !== 'string' || !Object.hasOwn(POINT_AWARD, kind)) return 0
  return numberOr(POINT_AWARD[kind], 0)
}

function levelFor(points: number): number {
  return 1 + Math.floor(numberOr(points, 0) / POINTS_PER_PAGE)
}

/**
 * A page event fills the rest of the page; everything else adds its award —
 * which for a `replay` is nothing, so a lesson finished for the second time
 * leaves the total exactly where the first time left it. An unrecognized,
 * missing or inherited kind — a hostile call, not a real event — adds nothing
 * either, so `earn` can never return anything but a real number.
 */
function earn(kind: RewardEventKind, points: number): number {
  const base = numberOr(points, 0)
  if (kind === 'page') return (Math.floor(base / POINTS_PER_PAGE) + 1) * POINTS_PER_PAGE
  return base + awardFor(kind)
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
  return { id: `g${milestone}`, ordinal: milestone, fa: GIFT_FA, da: GIFT_DA }
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
 *
 * `giftId` names the bonus round this event belongs to (its answers and its
 * closing page event share one id). A gift pays its bundle exactly once, at
 * completion: inside the round the single answers are praise-only — a full tick
 * and a warm line, no points — so half-playing a bonus round over and over
 * earns exactly what it earned the first time, which is nothing. Replaying a
 * finished round still plays and still praises; its id is already in
 * `giftsOpened`, the same "pays exactly once" a letter gets from
 * `markLetterDone`.
 */
export function celebrate(kind: RewardEventKind, now: Date = new Date(), giftId?: string): Reward {
  const before = readRecord()
  const wasResting = streakFor(before.practiceDates, now).resting
  const inGift = giftId !== undefined
  const claimed = inGift && before.giftsOpened.includes(giftId)
  const paysOut = !claimed && (!inGift || kind === 'page')

  const points = paysOut ? earn(kind, before.points) : before.points
  const stickers = stickersFor(before.points, points, before.stickers.length)
  const gift = giftFor(before.points, points)

  // An invalid clock, or a Date subclass that lies about just one getter,
  // names no real day; the event still pays, but nothing dated is ever
  // written — never a stored "NaN-NaN-NaN" or "2026-NaN-03". Validated on the
  // produced key itself, not on `now.getTime()`, so it does not matter which
  // method a hostile subclass overrode.
  const producedKey = dayKey(now)
  const today = isValidDayKey(producedKey) ? producedKey : null
  const practiceDates =
    today !== null && !before.practiceDates.includes(today)
      ? [...before.practiceDates, today]
      : before.practiceDates
  const streak = streakFor(practiceDates, now)
  const giftsOpened =
    inGift && kind === 'page' && !claimed ? [...before.giftsOpened, giftId] : before.giftsOpened

  const saved = saveRecord({
    stickers: [...before.stickers, ...stickers.map((sticker) => sticker.id)],
    level: levelFor(points),
    points,
    practiceDates,
    giftsOpened,
    // Every celebrate praises, so every celebrate counts — unlike `points`,
    // which a praise-only path (an unclaimed or already-opened gift) leaves
    // exactly where it was. Indexing the praise line by this instead of by
    // `points` is what keeps six such replies from repeating the same line.
    cheers: before.cheers + 1,
    streak: { value: streak.value, resting: streak.resting },
  })

  const level = levelFor(saved.points)
  const levelUp = level > levelFor(before.points) ? level : null
  const sounds: SoundCue[] = ['tick']
  if (stickers.length > 0) sounds.push('chime')
  if (levelUp !== null) sounds.push('fanfare')

  return {
    ticks: 1,
    praise: PRAISE[saved.cheers % PRAISE.length],
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

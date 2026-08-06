// Shapes for the reward engine (plan 007). Every number here only ever grows:
// there is no "spend", no "lose", no negative. See engine.ts for why that is
// structural rather than a promise.
import type { PersianEntry } from '../catalog/types'

/**
 * What the learner just did. The three seams plan 003 already exposes:
 * `answer` — one question answered right inside a round;
 * `item`   — a letter, mark, or word encountered for the first time;
 * `page`   — a round or a lesson finished, which fills a notebook page.
 * And one more, plan 006's:
 * `replay` — a lesson finished again, having already been paid for. It
 *            celebrates and praises like any other completion and counts as a
 *            practice day; it is worth no points, the way a letter already
 *            marked done cannot be marked done again for more credit. A caller
 *            can only ever ask for this instead of a payout, never for more.
 */
export type RewardEventKind = 'answer' | 'item' | 'page' | 'replay'

export type StickerKind = 'afarin' | 'bist' | 'star'

export interface Sticker {
  /** Stable id in earn order — `s1`, `s2`, … — so the store can union safely. */
  id: string
  kind: StickerKind
}

/** One matched praise pair. Persian first, the way the app reads. */
export type Praise = PersianEntry

export interface StreakState {
  /** Total practice days. Only ever grows. */
  value: number
  /** True when the last practice day is two or more days back — the streak sleeps. */
  resting: boolean
  /** True when the learner has already practised today. */
  today: boolean
}

/** A bonus exercise, offered as a gift and always skippable. */
export interface Gift {
  id: string
  /** Which gift this is, counting from one — it picks the bonus round. */
  ordinal: number
  entry: PersianEntry
}

export type SoundCue = 'tick' | 'chime' | 'fanfare'

/** What one completion earned. Never empty — every completion celebrates. */
export interface Reward {
  /** Red margin ticks, at least one. */
  ticks: number
  praise: Praise
  /** Stickers granted by this event alone. */
  stickers: Sticker[]
  /** The new level when the page just filled, otherwise null. */
  levelUp: number | null
  level: number
  points: number
  streak: StreakState
  /** True when this event woke a resting streak — the welcome-back moment. */
  wokeUp: boolean
  gift: Gift | null
  sounds: SoundCue[]
}

/** Everything the learner owns, read-only. */
export interface RewardsView {
  stickers: Sticker[]
  level: number
  points: number
  streak: StreakState
}

/** `dpl.v1.rewards` on disk — plan 007's shape, plus `giftsOpened` (critic round 2)
 *  and `cheers` (round 4, fixing a critic round 3 finding): which gift ids have
 *  already paid out, so a replayed bonus round pays once, and how many times
 *  `celebrate` has ever praised, so a praise-only replay (points unmoved) still
 *  varies its line. */
export interface RewardsRecord {
  stickers: string[]
  level: number
  points: number
  practiceDates: string[]
  giftsOpened: string[]
  /** Total celebrations. Only ever grows — indexes the praise line, never the payout. */
  cheers: number
  streak: { value: number; resting: boolean }
}

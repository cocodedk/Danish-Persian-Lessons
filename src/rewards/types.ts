// Shapes for the reward engine (plan 007). Every number here only ever grows:
// there is no "spend", no "lose", no negative. See engine.ts for why that is
// structural rather than a promise.

/**
 * What the learner just did. The three seams plan 003 already exposes:
 * `answer` — one question answered right inside a round;
 * `item`   — a letter or vowel mark cleared ("Jeg kan den");
 * `page`   — a round or a lesson finished, which fills a notebook page.
 */
export type RewardEventKind = 'answer' | 'item' | 'page'

export type StickerKind = 'afarin' | 'bist' | 'star'

export interface Sticker {
  /** Stable id in earn order — `s1`, `s2`, … — so the store can union safely. */
  id: string
  kind: StickerKind
}

/** One matched praise pair. Persian first, the way the app reads. */
export interface Praise {
  fa: string
  da: string
}

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
  fa: string
  da: string
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

/** `dpl.v1.rewards` on disk — exactly the shape plan 007 specifies. */
export interface RewardsRecord {
  stickers: string[]
  level: number
  points: number
  practiceDates: string[]
  streak: { value: number; resting: boolean }
}

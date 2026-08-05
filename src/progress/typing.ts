// Progress through one typing round: `dpl.v1.type.<scope>`, where the scope is
// a vocabulary unit id — or `name` for the capstone.
//
// Deliberately its own store, beside `dpl.v1.vocab.<unit>` rather than inside
// it: reading a word and writing it are two different things to have learned,
// and folding them together would let a typing round claim a page the reading
// round already paid for. Add-only, like every other store here.
import { readJSON, writeJSON } from './storage'
import type { RewardEventKind } from '../rewards/types'

export interface TypeProgress {
  /** Ids of the items written correctly at least once. */
  words: string[]
  /** True once this round's completion has been paid its page. */
  paid: boolean
}

/** The capstone's scope — the one round that is not a vocabulary unit. */
export const NAME_SCOPE = 'name'

function key(scope: string): string {
  return `type.${scope}`
}

/** Anything may be sitting in storage; take only what has the right shape. */
function normalize(raw: Partial<TypeProgress>): TypeProgress {
  return {
    words: Array.isArray(raw.words) ? raw.words.filter((id) => typeof id === 'string') : [],
    paid: raw.paid === true,
  }
}

export function getTypeProgress(scope: string): TypeProgress {
  return normalize(readJSON<Partial<TypeProgress>>(key(scope), {}))
}

/** How many of `ids` have been written correctly — what the forside counts. */
export function typedCount(scope: string, ids: string[]): number {
  const written = getTypeProgress(scope).words
  return ids.filter((id) => written.includes(id)).length
}

/**
 * One word written correctly, and what it pays: `item` the first time this word
 * is ever written, `answer` — the flat per-answer rate — every time after. The
 * 004 pattern (src/progress/vocab.ts), so replaying a round the learner has
 * already finished is practice rather than a second wage.
 */
export function typeWordDone(scope: string, wordId: string): RewardEventKind {
  const current = getTypeProgress(scope)
  if (current.words.includes(wordId)) return 'answer'
  writeJSON<TypeProgress>(key(scope), { ...current, words: [...current.words, wordId] })
  return 'item'
}

/**
 * The round is finished. It fills a notebook page the first time and celebrates
 * without paying every time after — `replay`, the same deal the name lesson
 * gets. Read and written through storage, so a reload cannot claim the page
 * twice.
 */
export function payRound(scope: string): RewardEventKind {
  const current = getTypeProgress(scope)
  if (current.paid) return 'replay'
  writeJSON<TypeProgress>(key(scope), { ...current, paid: true })
  return 'page'
}

// Progress through the counting lesson (plan 016): `dpl.v1.counting`.
//
// Add-only, shaped like the vocabulary store: an item once learned stays
// learned, and `paid` marks that finishing all twenty numbers has been paid
// its notebook page exactly once. Storage survives reloads, so a replay of a
// finished round cannot pay the page — or a stale item — twice.
import { readJSON, writeJSON } from './storage'
import { countingNumbers } from '../lessons/numbers'
import type { RewardEventKind } from '../rewards/types'

export interface CountingProgress {
  /** Ids of the catalog entries the learner has cleared. */
  words: string[]
  /** True once completing the lesson has been paid its page event. */
  paid: boolean
}

const KEY = 'counting'

const COUNTING_IDS = new Set(countingNumbers.flatMap(({ digit, word }) => [digit.id, word.id]))
const WORD_IDS = countingNumbers.map(({ word }) => word.id)

/** Anything may be sitting in storage; take only what has the right shape. */
function normalize(raw: Partial<CountingProgress>): CountingProgress {
  return {
    words: Array.isArray(raw.words)
      ? [...new Set(raw.words.filter((id) => typeof id === 'string' && COUNTING_IDS.has(id)))]
      : [],
    paid: raw.paid === true,
  }
}

export function getCountingProgress(): CountingProgress {
  return normalize(readJSON<Partial<CountingProgress>>(KEY, {}))
}

export function markCountingDone(itemId: string): CountingProgress {
  if (!COUNTING_IDS.has(itemId)) return getCountingProgress()
  const current = getCountingProgress()
  if (current.words.includes(itemId)) return current
  const next = { ...current, words: [...current.words, itemId] }
  writeJSON<CountingProgress>(KEY, next)
  return next
}

/**
 * One item cleared, and the reward event it deserves — the same rates a
 * vocabulary word earns: `answer` for something already learned, `item` for
 * the first claim of one number, and `page` once, when the twentieth number
 * completes the lesson.
 */
export function learnCountingItem(itemId: string): RewardEventKind {
  const alreadyLearned = getCountingProgress().words.includes(itemId)
  const progress = markCountingDone(itemId)
  if (alreadyLearned) return 'answer'
  const complete = WORD_IDS.every((id) => progress.words.includes(id))
  if (!complete || progress.paid) return 'item'
  writeJSON<CountingProgress>(KEY, { ...progress, paid: true })
  return 'page'
}

/** How many of the twenty number words are cleared. */
export function countingDoneCount(): number {
  const cleared = getCountingProgress().words
  return WORD_IDS.filter((id) => cleared.includes(id)).length
}

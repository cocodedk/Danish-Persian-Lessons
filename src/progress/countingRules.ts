// Progress through the counting *rule* lessons (plan 017, fixpoint A item 2):
// `dpl.v1.counting.21-99`, and later `.100-900` and `.tusinder`.
//
// One factory, one store per lesson. Each store keeps the same shape and the
// same add-only semantics as the 1-20 foundation in `counting.ts`, but on its
// own key and over its own ids: an item once learned stays learned, an id from
// another lesson is refused, and `paid` marks that finishing this lesson has
// been paid its notebook page exactly once. The foundation's key `counting` is
// never read, never written and never migrated from here, so finishing a rule
// lesson cannot change the foundation's count in either direction.
import { readJSON, writeJSON } from './storage'
import { counting21to99Lesson } from '../lessons/counting21to99'
import type { RewardEventKind } from '../rewards/types'

export interface CountingRuleProgress {
  /** Ids of this lesson's catalog entries the learner has cleared. */
  words: string[]
  /** True once completing this lesson has been paid its page event. */
  paid: boolean
}

export interface CountingRuleStore {
  /** Storage suffix, i.e. everything after `dpl.v1.`. */
  readonly key: string
  /** The ids this store accepts, in lesson order. */
  readonly ids: readonly string[]
  /** The normalized record, whatever storage happens to hold. */
  get(): CountingRuleProgress
  /** Records one id; a foreign or already-cleared id changes nothing. */
  markDone(itemId: string): CountingRuleProgress
  /** Records one id and reports the reward it earns, or `null` for an id this
   *  lesson does not own — a foreign id earns nothing at all. */
  learn(itemId: string): RewardEventKind | null
  /** How many of this lesson's ids are cleared. */
  doneCount(): number
}

/** The foundation's key. A rule lesson may never be pointed at it. */
const FOUNDATION_KEY = 'counting'

/**
 * A rule lesson's add-only progress store.
 *
 * `key` is the storage suffix (`counting.21-99`), `ownIds` the complete set of
 * ids this lesson may record — nothing else is ever accepted, so one lesson's
 * store can neither be filled nor emptied by another's ids.
 */
export function createCountingRuleProgress(
  key: string,
  ownIds: readonly string[],
): CountingRuleStore {
  if (key === FOUNDATION_KEY || !key.startsWith(`${FOUNDATION_KEY}.`)) {
    throw new Error(`En regellektion må ikke bruge nøglen "${key}"`)
  }
  const ids: readonly string[] = [...new Set(ownIds)]
  if (ids.length === 0) throw new Error(`Regellektionen "${key}" har ingen id'er`)
  const idSet = new Set(ids)

  /** Anything may be sitting in storage; take only what has the right shape. */
  function normalize(raw: Partial<CountingRuleProgress>): CountingRuleProgress {
    return {
      words: Array.isArray(raw.words)
        ? [...new Set(raw.words.filter((id) => typeof id === 'string' && idSet.has(id)))]
        : [],
      paid: raw.paid === true,
    }
  }

  function get(): CountingRuleProgress {
    return normalize(readJSON<Partial<CountingRuleProgress>>(key, {}))
  }

  function markDone(itemId: string): CountingRuleProgress {
    if (!idSet.has(itemId)) return get()
    const current = get()
    if (current.words.includes(itemId)) return current
    const next = { ...current, words: [...current.words, itemId] }
    writeJSON<CountingRuleProgress>(key, next)
    return next
  }

  /**
   * One item cleared, and the reward event it deserves — the foundation's own
   * rates: `answer` for something already learned, `item` for the first claim
   * of one row, and `page` once, when the last row completes the lesson. An id
   * that is not this lesson's earns nothing and returns `null`: it changes no
   * record here, so it may mint neither an item nor the answer a replay pays.
   */
  function learn(itemId: string): RewardEventKind | null {
    if (!idSet.has(itemId)) return null
    const alreadyLearned = get().words.includes(itemId)
    const progress = markDone(itemId)
    if (alreadyLearned) return 'answer'
    const complete = ids.every((id) => progress.words.includes(id))
    if (!complete || progress.paid) return 'item'
    writeJSON<CountingRuleProgress>(key, { ...progress, paid: true })
    return 'page'
  }

  function doneCount(): number {
    const cleared = get().words
    return ids.filter((id) => cleared.includes(id)).length
  }

  return { key, ids, get, markDone, learn, doneCount }
}

/**
 * Lesson 2's store, over exactly what the descriptor teaches: the joining
 * element, the tens, the worked examples and the build targets. The descriptor
 * is the single source of both the taught rows and the progress items, so what
 * the learner is shown and what completion counts can never drift apart — and
 * a later change to the lesson's *catalog* export, which serves registration
 * rather than teaching, cannot silently widen this lesson.
 *
 * Both the key and the ownership test come from the descriptor's own
 * `storageKey` and `idPrefix`, so neither is restated here. The prefix filter
 * is what keeps the boundary against lesson 1: the descriptor references the
 * foundation's own twenty as a base form, and that row belongs to
 * `dpl.v1.counting`, never here.
 */
export const counting21to99Progress = createCountingRuleProgress(
  counting21to99Lesson.storageKey,
  [
    counting21to99Lesson.joiner,
    ...counting21to99Lesson.baseForms.map((base) => base.entry),
    ...counting21to99Lesson.examples.map((example) => example.entry),
    ...counting21to99Lesson.targets.map((target) => target.entry),
  ]
    .map((entry) => entry.id)
    .filter((id) => id.startsWith(counting21to99Lesson.idPrefix)),
)

// Progress through one vocabulary unit: `dpl.v1.vocab.<unit>`.
//
// Add-only, like every other store here — a word once cleared stays cleared.
// `paid` is the one flag that is not about progress but about payment: the
// unit's completion is worth a full notebook page exactly once. It lives on
// disk rather than in component state, so a reload cannot claim it a second
// time, and a learner who comes back and works through the unit again gets the
// celebration without the app pretending it is new money.
import { readJSON, writeJSON } from './storage'
import type { VocabUnit } from '../lessons/vocab'
import type { RewardEventKind } from '../rewards/types'

export interface VocabProgress {
  /** Ids of the words the learner has cleared. */
  words: string[]
  /** True once this unit's completion has been paid its page event. */
  paid: boolean
}

function key(unitId: string): string {
  return `vocab.${unitId}`
}

/** Anything may be sitting in storage; take only what has the right shape. */
function normalize(raw: Partial<VocabProgress>): VocabProgress {
  return {
    words: Array.isArray(raw.words) ? raw.words.filter((id) => typeof id === 'string') : [],
    paid: raw.paid === true,
  }
}

export function getVocabProgress(unitId: string): VocabProgress {
  return normalize(readJSON<Partial<VocabProgress>>(key(unitId), {}))
}

export function markWordDone(unitId: string, wordId: string): VocabProgress {
  const current = getVocabProgress(unitId)
  if (current.words.includes(wordId)) return current
  const next: VocabProgress = { ...current, words: [...current.words, wordId] }
  writeJSON<VocabProgress>(key(unitId), next)
  return next
}

/** How many of the unit's words are cleared, and whether that is all of them. */
export function unitDoneCount(unit: VocabUnit): number {
  const cleared = getVocabProgress(unit.id).words
  return unit.words.filter((word) => cleared.includes(word.id)).length
}

export function isUnitDone(unit: VocabUnit): boolean {
  return unitDoneCount(unit) === unit.words.length
}

/**
 * One word cleared, and the reward event it deserves: `page` the first time
 * this finishes the whole unit, `item` the first time this word itself is
 * claimed otherwise, and `answer` — the same flat rate a letter's exercise
 * round pays — for a word that was already learned before this call. Without
 * that last case, replaying a finished unit's exercise round paid the `item`
 * rate on every tap forever, twice what the same replay earns a letter
 * (critic round 1, adjudicated from the plan's deviation 5). The claim is
 * read and written through storage, so two mounts, a reload, or a re-run of
 * the round cannot pay the page — or a stale item — twice.
 */
export function learnWord(unit: VocabUnit, wordId: string): RewardEventKind {
  const before = getVocabProgress(unit.id)
  const alreadyLearned = before.words.includes(wordId)
  const progress = markWordDone(unit.id, wordId)
  if (alreadyLearned) return 'answer'
  const complete = unit.words.every((word) => progress.words.includes(word.id))
  if (!complete || progress.paid) return 'item'
  writeJSON<VocabProgress>(key(unit.id), { ...progress, paid: true })
  return 'page'
}

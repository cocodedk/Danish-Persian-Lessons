// Progress through the alphabet lesson: `dpl.v1.alphabet`.
//
// Add-only, on purpose. A tick is never removed, a count never drops — the
// generosity rule in CLAUDE.md is enforced here rather than trusted to callers.
import { readJSON, writeJSON } from './storage'
import { teachingOrder } from '../lessons/alphabet'
import { vowelMarks } from '../lessons/vowelMarks'

export interface AlphabetProgress {
  /** Ids of letters (and آ) the learner has cleared. */
  letters: string[]
  /** Ids of vowel marks the learner has cleared. */
  marks: string[]
  /** True once orientation has been read or skipped — it never opens by itself again. */
  orientationSeen: boolean
}

const KEY = 'alphabet'

/** Anything may be sitting in storage; take only what has the right shape. */
function normalize(raw: Partial<AlphabetProgress>): AlphabetProgress {
  return {
    letters: Array.isArray(raw.letters) ? raw.letters : [],
    marks: Array.isArray(raw.marks) ? raw.marks : [],
    orientationSeen: raw.orientationSeen === true,
  }
}

export function getAlphabetProgress(): AlphabetProgress {
  return normalize(readJSON<Partial<AlphabetProgress>>(KEY, {}))
}

function save(next: AlphabetProgress): AlphabetProgress {
  writeJSON<AlphabetProgress>(KEY, next)
  return next
}

function withItem(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id]
}

export function markLetterDone(id: string): AlphabetProgress {
  const current = getAlphabetProgress()
  return save({ ...current, letters: withItem(current.letters, id) })
}

export function markVowelDone(id: string): AlphabetProgress {
  const current = getAlphabetProgress()
  return save({ ...current, marks: withItem(current.marks, id) })
}

export function markOrientationSeen(): AlphabetProgress {
  return save({ ...getAlphabetProgress(), orientationSeen: true })
}

/** Everything there is to clear: the 32 letters plus آ, plus the six vowel marks. */
export const ALPHABET_TOTAL = teachingOrder.length + vowelMarks.length

export function doneCount(progress: AlphabetProgress): number {
  return progress.letters.length + progress.marks.length
}

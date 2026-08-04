// What the teacher's pen would mark. Pure: two strings in, one position out.
//
// The rule is one mark, at the first place the word goes wrong — never a page
// bled red. A learner who is told about four mistakes at once fixes none of
// them; a learner shown the first one fixes it and reads on.
import { withoutMarks } from '../lessons/marks'

export type DiffKind = 'match' | 'wrong' | 'missing' | 'extra'

export interface Divergence {
  kind: DiffKind
  /** Where the mark goes, counted in code points. -1 when nothing is marked. */
  index: number
}

/**
 * What both sides are compared as. اِعراب comes off first: the keyboard has no
 * vowel-mark keys, so a word could never be typed with them, and requiring what
 * cannot be typed would fail every answer. Marks belong on teaching specimens,
 * not on the writing (CLAUDE.md, Persian text rules).
 *
 * NFC first, so the precomposed آ and the ا + مد spelling of it compare as the
 * one letter they are.
 */
export function normalizeTyped(text: string): string {
  return withoutMarks(text.normalize('NFC'))
}

/** The first place `attempt` stops being `answer`. */
export function compare(attempt: string, answer: string): Divergence {
  const typed = [...normalizeTyped(attempt)]
  const wanted = [...normalizeTyped(answer)]

  const shared = Math.min(typed.length, wanted.length)
  for (let at = 0; at < shared; at += 1) {
    if (typed[at] !== wanted[at]) return { kind: 'wrong', index: at }
  }

  if (typed.length < wanted.length) return { kind: 'missing', index: typed.length }
  if (typed.length > wanted.length) return { kind: 'extra', index: wanted.length }
  return { kind: 'match', index: -1 }
}

/** One cell per code point written, plus an empty one where a letter is missing. */
export interface DiffCell {
  /** The code point, or '' for the slot a missing letter belongs in. */
  char: string
  marked: boolean
}

/**
 * The attempt, letter by letter, with the one divergent position marked. The
 * cells are the written code points — a ZWNJ gets a cell of its own, because a
 * mistake nobody can see is a mistake nobody can fix.
 */
export function markUp(attempt: string, divergence: Divergence): DiffCell[] {
  const cells: DiffCell[] = [...normalizeTyped(attempt)].map((char, at) => ({
    char,
    marked: at === divergence.index,
  }))
  if (divergence.kind === 'missing') cells.push({ char: '', marked: true })
  return cells
}

import { penMarkClass } from './penMark'
import { withoutMarks } from '../lessons/marks'
import '../styles/pen.css'
import './FaSpecimen.css'
import type { PersianEntry } from '../catalog/types'

export interface FaSpecimenProps {
  entry: PersianEntry
}

/**
 * A Persian teaching specimen: schoolbook Naskh, huge, with air for the
 * diacritics and the marks in the teacher's red.
 *
 * A vocalized word — `faMarked` is `fa` plus اِعراب and nothing else — is drawn
 * as two copies of itself in one grid cell: the marked one in red underneath,
 * the plain one in ink on top. Vowel marks take no width, so the letterforms
 * land pixel-identically and only the marks show through. That is the only way
 * a زبر and a زیر on the SAME word can both be red; the gradient cut in
 * pen.css colours one side of one line and was tuned for the madde of آ, which
 * sits far higher than a زبر over a short letter like مَدرِسه's م.
 *
 * The ink layer still carries that gradient, so آ keeps its red madde here too.
 * Anything else — a `faMarked` that changes a letter rather than marking it —
 * takes the plain single-layer path. See docs/design/ART-DIRECTION.md.
 */
export function FaSpecimen({ entry }: FaSpecimenProps) {
  const { fa, faMarked } = entry
  const stacked = faMarked !== undefined && faMarked !== fa && withoutMarks(faMarked) === fa

  if (!stacked) {
    const rendered = faMarked ?? fa
    return (
      <p className={penMarkClass('fa-specimen', rendered)} lang="fa" dir="rtl">
        {rendered}
      </p>
    )
  }

  return (
    <p className="fa-specimen fa-specimen--vocalized" lang="fa" dir="rtl">
      {/* Read out as the word, once: the red layer is the same letters. */}
      <span className="fa-specimen__marks" aria-hidden="true">
        {faMarked}
      </span>
      <span className={penMarkClass('fa-specimen__ink', fa)}>{fa}</span>
    </p>
  )
}

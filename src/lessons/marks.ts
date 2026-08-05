// Persian script knowledge: which side of the line a vowel mark is written on.
// It lives here beside the text rules, not in a component, because plans
// 003/005/006 need the same table for lessons, the keyboard and the name
// spelling — the red-pen rendering (src/components/penMark.ts) is only one
// consumer of it.
import type { Pron } from './types'

/** Above the line (زبر، پیش، مد), under it (زیر), or unmarked. */
export type MarkSide = 'above' | 'below' | 'none'

/**
 * The one pronunciation the app gives a sign that carries no vowel of its own
 * (تشدید، سکون، ئ): said the same way everywhere it appears.
 */
export const NO_OWN_SOUND: Pron = { da: 'ingen egen lyd', ipa: '∅' }

/** زیر (kasra) and its tanwin — the only marks written under the letter. */
const BELOW = new Set(['ِ', 'ٍ'])

/** زبر, پیش, تنوین, ساکن, تشدید, and the combining madde of آ. */
const ABOVE = new Set(['ً', 'ٌ', 'َ', 'ُ', 'ّ', 'ْ', 'ٓ'])

/**
 * اِعراب as combining marks: تنوین، زبر، زیر، پیش، تشدید، ساکن (U+064B–U+0652).
 * The madde (U+0653) is deliberately outside the range — it is part of how آ is
 * spelled, not a vowel sign a reader could do without.
 */
const HARAKAT = /[\u064B-\u0652]/g

/** The same word with its اِعراب taken off: «مَدرِسه» → «مدرسه», «آب» → «آب». */
export function withoutMarks(text: string): string {
  return text.replace(HARAKAT, '')
}

/**
 * The side a string's vowel marks are written on. The text is decomposed
 * first, so the precomposed آ (U+0622) and the spelled-out ا + ٓ classify alike.
 *
 * A string marked on both sides reports 'above'. The red pen is one gradient
 * with one cut (see src/styles/pen.css); a second cut below the baseline
 * cannot tell a زیر from the dot under a ب, so the taller mark wins.
 */
export function markSide(text: string): MarkSide {
  let below: MarkSide = 'none'
  for (const char of text.normalize('NFD')) {
    if (ABOVE.has(char)) return 'above'
    if (BELOW.has(char)) below = 'below'
  }
  return below
}

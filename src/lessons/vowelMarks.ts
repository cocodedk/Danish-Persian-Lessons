// The six vowel signs, on alef so the learner always sees the mark on a seat.
// Short vowels are written above or below the line; long vowels are whole
// letters. Danish anchors per CLAUDE.md "Curriculum" — never improvised in JSX.
import type { VowelMark } from './types'

export const vowelMarks: VowelMark[] = [
  { id: 'zebar', glyph: 'اَ', name: { fa: 'زبر', da: 'zebar' }, sound: { da: 'a i "kat"', ipa: 'æ' } },
  { id: 'zir', glyph: 'اِ', name: { fa: 'زیر', da: 'zir' }, sound: { da: 'e i "let"', ipa: 'e' } },
  { id: 'pish', glyph: 'اُ', name: { fa: 'پیش', da: 'pish' }, sound: { da: 'o i "foto"', ipa: 'o' } },
  { id: 'aa', glyph: 'آ', name: { fa: 'آ', da: 'alef med madde' }, sound: { da: 'å i "år"', ipa: 'ɒː' } },
  { id: 'u', glyph: 'او', name: { fa: 'او', da: 'alef og vav' }, sound: { da: 'u i "du"', ipa: 'uː' } },
  { id: 'i', glyph: 'ای', name: { fa: 'ای', da: 'alef og ye' }, sound: { da: 'i i "vi"', ipa: 'iː' } },
]

/** A mark that changes how a word is read but carries no vowel of its own. */
export interface LaterMark {
  id: string
  glyph: string
  name: { fa: string; da: string }
  /** What it does, in one Danish line. */
  hint: string
}

/** Named now so they are not a surprise later; taught in a later lesson. */
export const laterMarks: LaterMark[] = [
  {
    id: 'tashdid',
    glyph: 'ـّ',
    name: { fa: 'تشدید', da: 'tashdid' },
    hint: 'Bogstavet under tegnet siges dobbelt.',
  },
  {
    id: 'sokun',
    glyph: 'ـْ',
    name: { fa: 'سکون', da: 'sokun' },
    hint: 'Bogstavet får ingen vokal — det står tørt.',
  },
]

/** Walked by the Persian text-rule guard (src/content/faStrings.ts). */
export const LATER_MARK_FA_STRINGS: string[] = laterMarks.flatMap((mark) => [
  mark.glyph,
  mark.name.fa,
])

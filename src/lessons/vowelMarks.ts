// The six vowel signs, on alef so the learner always sees the mark on a seat.
// Short vowels are written above or below the line; long vowels are whole
// letters. Danish anchors per CLAUDE.md "Curriculum" — never improvised in JSX.
import type { VowelMark } from './types'
import { defineEntry, type PersianEntry } from '../catalog/types'
import { NO_OWN_SOUND, withoutMarks } from './marks'

type MarkRow = [string, string, string, string, string, string, string]

function mark([id, glyph, nameFa, nameDa, soundDa, soundIpa, nameIpa]: MarkRow): VowelMark {
  const plain = withoutMarks(glyph)
  const entry = defineEntry({
    id: `alphabet-mark-${id}`,
    kind: 'mark' as const,
    fa: plain,
    ...(glyph !== plain ? { faMarked: glyph } : {}),
    da: nameDa,
    pron: { da: soundDa, ipa: soundIpa },
  })
  const nameEntry = defineEntry({
    id: `alphabet-mark-name-${id}`,
    kind: 'word' as const,
    fa: nameFa,
    da: `tegnnavnet ${nameDa}`,
    pron: { da: nameDa, ipa: nameIpa },
  })
  return {
    id,
    entry,
    nameEntry,
    glyph,
    name: { fa: nameFa, da: nameDa },
    sound: entry.pron,
  }
}

export const vowelMarks: VowelMark[] = [
  mark(['zebar', 'اَ', 'زبر', 'zebar', 'a i "kat"', 'æ', 'zæbæɾ']),
  mark(['zir', 'اِ', 'زیر', 'zir', 'e i "let"', 'e', 'ziːɾ']),
  mark(['pish', 'اُ', 'پیش', 'pish', 'o i "foto"', 'o', 'piːʃ']),
  mark(['aa', 'آ', 'آ', 'alef med madde', 'å i "år"', 'ɒː', 'ɒː']),
  mark(['u', 'او', 'او', 'alef og vav', 'u i "du"', 'uː', 'uː']),
  mark(['i', 'ای', 'ای', 'alef og ye', 'i i "vi"', 'iː', 'iː']),
]

/** A mark that changes how a word is read but carries no vowel of its own. */
export interface LaterMark {
  id: string
  entry: PersianEntry
  nameEntry: PersianEntry
  /** What it does, in one Danish line. */
  hint: string
}

/** Named now so they are not a surprise later; taught in a later lesson. */
export const laterMarks: LaterMark[] = [
  {
    id: 'tashdid',
    entry: defineEntry({ id: 'alphabet-mark-tashdid', kind: 'mark', fa: 'ـّ', da: 'bogstavet siges dobbelt', pron: NO_OWN_SOUND }),
    nameEntry: defineEntry({ id: 'alphabet-mark-name-tashdid', kind: 'word', fa: 'تشدید', da: 'tegnnavnet tashdid', pron: { da: 'tasjdid', ipa: 'tæʃdiːd' } }),
    hint: 'Bogstavet under tegnet siges dobbelt.',
  },
  {
    id: 'sokun',
    entry: defineEntry({ id: 'alphabet-mark-sokun', kind: 'mark', fa: 'ـْ', da: 'bogstavet får ingen vokal', pron: NO_OWN_SOUND }),
    nameEntry: defineEntry({ id: 'alphabet-mark-name-sokun', kind: 'word', fa: 'سکون', da: 'tegnnavnet sokun', pron: { da: 'sokun', ipa: 'sokuːn' } }),
    hint: 'Bogstavet får ingen vokal — det står tørt.',
  },
]

import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'

export interface BeginnerNumber {
  value: number
  digit: PersianEntry
  word: PersianEntry
}

type NumberRow = [string, string, string, string, string, string]

function number(value: number, row: NumberRow): BeginnerNumber {
  const [digit, fa, faMarked, da, pronDa, ipa] = row
  return {
    value,
    digit: defineEntry({
      id: `number-${value}-digit`,
      kind: 'symbol',
      fa: digit,
      da: `Tallet ${da}`,
      pron: { da: '∅', ipa: '∅' },
      audioNotApplicable: 'Talordet ved siden af bærer udtalen.',
    }),
    word: defineEntry({
      id: `number-${value}-word`,
      kind: 'word',
      fa,
      faMarked,
      da,
      pron: { da: pronDa, ipa },
    }),
  }
}

/**
 * The first ten numbers, kept as their own stable subset of the 1–20 counting
 * lesson. No lesson is built from this list alone any more; it stays split out
 * so the reviewed 1–10 audio and the `numberCatalog` export keep exactly the
 * entries and ids they had before the lesson grew to twenty. Do not reorder or
 * resize it.
 */
export const beginnerNumbers: BeginnerNumber[] = [
  number(1, ['۱', 'یک', 'یِک', 'en', 'jek', 'jek']),
  number(2, ['۲', 'دو', 'دو', 'to', 'do', 'do']),
  number(3, ['۳', 'سه', 'سِه', 'tre', 'se', 'se']),
  number(4, ['۴', 'چهار', 'چَهار', 'fire', 'tjahår', 'tʃæˈhɒːɾ']),
  number(5, ['۵', 'پنج', 'پَنج', 'fem', 'pandj', 'pændʒ']),
  number(6, ['۶', 'شش', 'شِش', 'seks', 'sjesj', 'ʃeʃ']),
  number(7, ['۷', 'هفت', 'هَفت', 'syv', 'haft', 'hæft']),
  number(8, ['۸', 'هشت', 'هَشت', 'otte', 'hasjt', 'hæʃt']),
  number(9, ['۹', 'نه', 'نُه', 'ni', 'noh', 'noh']),
  number(10, ['۱۰', 'ده', 'دَه', 'ti', 'dah', 'dæh']),
]

/** Eleven through twenty, for the "Tæl til tyve" lesson (plan 016). */
export const teenNumbers: BeginnerNumber[] = [
  number(11, ['۱۱', 'یازده', 'یازدَه', 'elleve', 'jåzde', 'jɒːzˈde']),
  number(12, ['۱۲', 'دوازده', 'دوازدَه', 'tolv', 'dovåzde', 'dɒːzˈde']),
  number(13, ['۱۳', 'سیزده', 'سیزدَه', 'tretten', 'sizde', 'siːzˈde']),
  number(14, ['۱۴', 'چهارده', 'چَهاردَه', 'fjorten', 'tjahårde', 'tʃæːhɒːɾˈde']),
  number(15, ['۱۵', 'پانزده', 'پانزدَه', 'femten', 'pånze', 'pɒːnˈze']),
  number(16, ['۱۶', 'شانزده', 'شانزدَه', 'seksten', 'sjånze', 'ʃɒːnˈze']),
  number(17, ['۱۷', 'هفده', 'هَفدَه', 'sytten', 'hefde', 'hæfˈde']),
  number(18, ['۱۸', 'هجده', 'هُجدَه', 'atten', 'hedje', 'hædʒˈde']),
  number(19, ['۱۹', 'نوزده', 'نوزدَه', 'nitten', 'nuzde', 'nuːzˈde']),
  number(20, ['۲۰', 'بیست', 'بیست', 'tyve', 'bist', 'bist']),
]

/** Every number the counting lesson teaches, one through twenty. */
export const countingNumbers: BeginnerNumber[] = [...beginnerNumbers, ...teenNumbers]

export const numberCatalog = beginnerNumbers.flatMap(({ digit, word }) => [digit, word])

export const countingCatalog = countingNumbers.flatMap(({ digit, word }) => [digit, word])

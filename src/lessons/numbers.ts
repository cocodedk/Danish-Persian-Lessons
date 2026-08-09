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

export const numberCatalog = beginnerNumbers.flatMap(({ digit, word }) => [digit, word])

// The grade-1 vocabulary units, in the order the Iranian first-grade book
// (فارسی اول دبستان) introduces its نشانه‌ها: درس ۱ آ ا / بـ ب، درس ۲ اَ / د،
// درس ۳ مـ م / سـ س، درس ۴ او و / تـ ت، درس ۵ ر / نـ ن، درس ۶ ای / ز،
// درس ۷ اِ / ـه ه / شـ ش. The sources, the three unit lists and every honest
// exception are written up in docs/plans/004-grade1-vocab.md under
// "Word list proposal" — argue with a word there; it lands here.
//
// `faMarked` is the fully vocalized specimen. Where it reads the same as `fa`
// the word genuinely has no short vowel to write: آب، بابا، نان are long
// vowels all the way through, which is exactly why the primer opens on them.
// Marks are the short vowels only — مَدرِسه, never مَدْرِسه; the schoolbook
// does not write ساکن.
import type { WordCard } from './types'
import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'
import { vocabReadingCues } from './vocabReadingCues'

export interface VocabWord extends WordCard {
  /** Stable ascii id — used in routes (#/lesson/ord/:unit/:word) and progress. */
  id: string
  /** Required here, unlike the optional field on WordCard: every card is vocalized. */
  faMarked: string
}

export interface VocabUnit {
  /** '1' | '2' | '3' — the route segment and the `dpl.v1.vocab.<unit>` suffix. */
  id: string
  /** Danish heading. */
  title: string
  /** Persian heading. UI chrome, so no اِعراب — CLAUDE.md's Persian text rules. */
  titleEntry: PersianEntry
  /** One Danish line for the forside card. */
  summary: string
  words: VocabWord[]
}

/** id · fa · faMarked · dansk · dansk lydskrift · IPA (standard Tehrani). */
type Row = [string, string, string, string, string, string]

function words(unitId: string, rows: Row[]): VocabWord[] {
  return rows.map(([id, fa, faMarked, da, lyd, ipa]) => {
    const pron = { da: lyd, ipa }
    return {
      id,
      entry: defineEntry({
        id: `vocabulary-${unitId}-${id}`,
        kind: 'word',
        fa,
        faMarked,
        da,
        pron,
        readingCues: vocabReadingCues(id),
      }),
      fa,
      faMarked,
      da,
      pron,
    }
  })
}

export const vocabUnits: VocabUnit[] = [
  {
    id: '1',
    title: 'De første ord',
    titleEntry: defineEntry({ id: 'vocabulary-unit-1-title', kind: 'phrase', fa: 'آب و بابا', da: 'Vand og far', pron: { da: 'åb o båbå', ipa: 'ɒːb o bɒːbɒː' } }),
    summary: 'De ord bogen åbner med — og de ord du peger med',
    words: words('1', [
      ['ab', 'آب', 'آب', 'vand', 'åb', 'ɒːb'],
      ['baba', 'بابا', 'بابا', 'far', 'båbå', 'bɒːbɒː'],
      ['bad', 'باد', 'باد', 'vind', 'båd', 'bɒːd'],
      ['abi', 'آبی', 'آبی', 'blå', 'åbi', 'ɒːˈbiː'],
      ['nan', 'نان', 'نان', 'brød', 'nån', 'nɒːn'],
      ['madar', 'مادر', 'مادَر', 'mor', 'mådar', 'mɒːˈdæɾ'],
      ['man', 'من', 'مَن', 'jeg', 'man', 'mæn'],
      ['to', 'تو', 'تو', 'du', 'to', 'to'],
      ['ma', 'ما', 'ما', 'vi', 'må', 'mɒː'],
      ['u', 'او', 'او', 'han eller hun', 'u', 'uː'],
      ['in', 'این', 'این', 'denne, dette', 'in', 'iːn'],
      ['an', 'آن', 'آن', 'den, det (derovre)', 'ån', 'ɒːn'],
    ]),
  },
  {
    id: '2',
    title: 'I skolen',
    titleEntry: defineEntry({ id: 'vocabulary-unit-2-title', kind: 'word', fa: 'مدرسه', faMarked: 'مَدرِسه', da: 'Skole', pron: { da: 'madrese', ipa: 'mædɾese' } }),
    summary: 'Blyant, bog, bord — og det du siger, når du kommer ind',
    words: words('2', [
      ['medad', 'مداد', 'مِداد', 'blyant', 'medåd', 'meˈdɒːd'],
      ['ketab', 'کتاب', 'کِتاب', 'bog', 'ketåb', 'keˈtɒːb'],
      ['miz', 'میز', 'میز', 'bord', 'miz', 'miːz'],
      ['dar', 'در', 'دَر', 'dør', 'dar', 'dæɾ'],
      ['dast', 'دست', 'دَست', 'hånd', 'dast', 'dæst'],
      ['dust', 'دوست', 'دوست', 'ven', 'dust', 'duːst'],
      ['madrese', 'مدرسه', 'مَدرِسه', 'skole', 'madrese', 'mædɾeˈse'],
      ['salam', 'سلام', 'سَلام', 'hej', 'salåm', 'sæˈlɒːm'],
    ]),
  },
  {
    id: '3',
    title: 'Hjem og himmel',
    titleEntry: defineEntry({ id: 'vocabulary-unit-3-title', kind: 'phrase', fa: 'خانه و آسمان', da: 'Hjem og himmel', pron: { da: 'khåne o åsemån', ipa: 'xɒːne o ɒːsemɒːn' } }),
    summary: 'Hus, regn, måne, nat — og to farver mere',
    words: words('3', [
      ['khane', 'خانه', 'خانه', 'hus, hjem', 'khåne', 'xɒːˈne'],
      ['baran', 'باران', 'باران', 'regn', 'bårån', 'bɒːˈɾɒːn'],
      ['aseman', 'آسمان', 'آسِمان', 'himmel', 'åsemån', 'ɒːseˈmɒːn'],
      ['mah', 'ماه', 'ماه', 'måne', 'måh', 'mɒːh'],
      ['shab', 'شب', 'شَب', 'nat', 'sjab', 'ʃæb'],
      ['gol', 'گل', 'گُل', 'blomst', 'gol', 'ɡol'],
      ['sabz', 'سبز', 'سَبز', 'grøn', 'sabz', 'sæbz'],
      ['zard', 'زرد', 'زَرد', 'gul', 'zard', 'zæɾd'],
    ]),
  },
]

/** The unit with this id, or undefined — a hand-typed URL names no unit. */
export function findVocabUnit(id: string): VocabUnit | undefined {
  return vocabUnits.find((unit) => unit.id === id)
}

/** Every word in every unit — what the data-integrity tests walk. */
export const allVocabWords: VocabWord[] = vocabUnits.flatMap((unit) => unit.words)

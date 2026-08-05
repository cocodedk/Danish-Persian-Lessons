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
  titleFa: string
  /** One Danish line for the forside card. */
  summary: string
  words: VocabWord[]
}

/** id · fa · faMarked · dansk · dansk lydskrift · IPA (standard Tehrani). */
type Row = [string, string, string, string, string, string]

function words(rows: Row[]): VocabWord[] {
  return rows.map(([id, fa, faMarked, da, lyd, ipa]) => ({
    id,
    fa,
    faMarked,
    da,
    pron: { da: lyd, ipa },
  }))
}

export const vocabUnits: VocabUnit[] = [
  {
    id: '1',
    title: 'De første ord',
    titleFa: 'آب و بابا',
    summary: 'De ord bogen åbner med — og de ord du peger med',
    words: words([
      ['ab', 'آب', 'آب', 'vand', 'åb', 'ɒːb'],
      ['baba', 'بابا', 'بابا', 'far', 'båbå', 'bɒːbɒː'],
      ['bad', 'باد', 'باد', 'vind', 'båd', 'bɒːd'],
      ['abi', 'آبی', 'آبی', 'blå', 'åbi', 'ɒːbiː'],
      ['nan', 'نان', 'نان', 'brød', 'nån', 'nɒːn'],
      ['madar', 'مادر', 'مادَر', 'mor', 'mådar', 'mɒːdæɾ'],
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
    titleFa: 'مدرسه',
    summary: 'Blyant, bog, bord — og det du siger, når du kommer ind',
    words: words([
      ['medad', 'مداد', 'مِداد', 'blyant', 'medåd', 'medɒːd'],
      ['ketab', 'کتاب', 'کِتاب', 'bog', 'ketåb', 'ketɒːb'],
      ['miz', 'میز', 'میز', 'bord', 'miz', 'miːz'],
      ['dar', 'در', 'دَر', 'dør', 'dar', 'dæɾ'],
      ['dast', 'دست', 'دَست', 'hånd', 'dast', 'dæst'],
      ['dust', 'دوست', 'دوست', 'ven', 'dust', 'duːst'],
      ['madrese', 'مدرسه', 'مَدرِسه', 'skole', 'madrese', 'mædɾese'],
      ['salam', 'سلام', 'سَلام', 'hej', 'salåm', 'sælɒːm'],
    ]),
  },
  {
    id: '3',
    title: 'Hjem og himmel',
    titleFa: 'خانه و آسمان',
    summary: 'Hus, regn, måne, nat — og to farver mere',
    words: words([
      ['khane', 'خانه', 'خانه', 'hus, hjem', 'khåne', 'xɒːne'],
      ['baran', 'باران', 'باران', 'regn', 'bårån', 'bɒːɾɒːn'],
      ['aseman', 'آسمان', 'آسِمان', 'himmel', 'åsemån', 'ɒːsemɒːn'],
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

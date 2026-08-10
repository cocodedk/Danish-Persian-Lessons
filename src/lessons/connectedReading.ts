import { defineEntry, type PersianEntry, type ReadingCue } from '../catalog/types'
import { allVocabWords } from './vocab'

export interface ReadingQuestion {
  promptDa: string
  choicesDa: string[]
  answerDa: string
}

export interface ConnectedReading {
  id: string
  unitId: string
  kind: 'phrase' | 'microtext'
  groupIndex?: number
  entry: PersianEntry
  introducedEntryIds: string[]
  taughtEntryIds: string[]
  question: ReadingQuestion
}

export const CONNECTOR_O = defineEntry({
  id: 'reading-function-o',
  kind: 'word',
  fa: 'و',
  da: 'og',
  pron: { da: 'o', ipa: 'o' },
  readingCues: [{ start: 0, end: 1, display: 'و', role: 'written-vowel', helpDa: 'Som selvstændigt ord betyder vav “og” og læses o', pron: { da: 'o i “foto”', ipa: 'o' } }],
})

export const COPULA_AST = defineEntry({
  id: 'reading-function-ast',
  kind: 'word',
  fa: 'است',
  faMarked: 'اَست',
  da: 'er',
  pron: { da: 'ast', ipa: 'æst' },
  readingCues: [
    { start: 0, end: 1, display: 'ا', role: 'carrier', helpDa: 'Alef bærer den korte vokal først i ordet' },
    { start: 1, end: 1, display: '◌َ', role: 'short-vowel', helpDa: 'Det korte a høres, men udelades normalt i almindelig skrift', pron: { da: 'a i “kat”', ipa: 'æ' } },
    { start: 1, end: 2, display: 'س', role: 'consonant', helpDa: 'Sin siger s', pron: { da: 's i “sol”', ipa: 's' } },
    { start: 2, end: 3, display: 'ت', role: 'consonant', helpDa: 'Te siger t', pron: { da: 't i “tak”', ipa: 't' } },
  ],
})

export const EZAFE = defineEntry({
  id: 'reading-function-ezafe',
  kind: 'symbol',
  fa: 'ـِ',
  da: 'ezafe: binder to ord sammen',
  pron: { da: 'e', ipa: 'e' },
  readingCues: [{ start: 0, end: 2, display: 'ـِ', role: 'written-vowel', helpDa: 'Ezafe binder det første ord til det næste', pron: { da: 'e i “let”', ipa: 'e' } }],
})

const entryById = new Map<string, PersianEntry>([
  ...allVocabWords.map((word): [string, PersianEntry] => [word.entry.id, word.entry]),
  ...[CONNECTOR_O, COPULA_AST, EZAFE].map((entry): [string, PersianEntry] => [entry.id, entry]),
])

function readingCuesFor(
  fa: string,
  sourceIds: string[],
  ezafeAfter: string[] = [],
): ReadingCue[] {
  const sources = sourceIds.map((id) => entryById.get(id)).filter((entry): entry is PersianEntry => Boolean(entry))
  const chars = [...fa]
  const cues: ReadingCue[] = []
  for (let start = 0; start < chars.length;) {
    while (start < chars.length && /[\s.،؟!]/u.test(chars[start])) start += 1
    if (start >= chars.length) break
    let end = start + 1
    while (end < chars.length && !/[\s.،؟!]/u.test(chars[end])) end += 1
    const token = chars.slice(start, end).join('')
    const entry = sources.find((candidate) => candidate.fa === token)
    if (!entry) throw new Error(`Connected reading token is not taught: ${token}`)
    cues.push({ start, end, display: token, role: 'whole', helpDa: entry.da, pron: entry.pron })
    start = end
  }
  for (const token of ezafeAfter) {
    const offset = chars.join('').indexOf(token)
    if (offset < 0) throw new Error(`Ezafe anchor is absent: ${token}`)
    const start = [...fa.slice(0, offset)].length + [...token].length
    cues.push({ start, end: start, display: '◌ِ', role: 'short-vowel', helpDa: EZAFE.da, pron: EZAFE.pron })
  }
  return cues.sort((a, b) => a.start - b.start || b.end - a.end)
}

const vocab = (unit: string, ...ids: string[]) => ids.map((id) => `vocabulary-${unit}-${id}`)

function phrase(
  id: string,
  unitId: string,
  groupIndex: number,
  fa: string,
  faMarked: string,
  da: string,
  lyd: string,
  ipa: string,
  introducedEntryIds: string[],
  taughtEntryIds: string[],
  distractors: string[],
  ezafeAfter: string[] = [],
): ConnectedReading {
  return {
    id,
    unitId,
    kind: 'phrase',
    groupIndex,
    entry: defineEntry({
      id: `reading-${id}`,
      kind: 'phrase',
      fa,
      ...(faMarked !== fa ? { faMarked } : {}),
      da,
      pron: { da: lyd, ipa },
      readingCues: readingCuesFor(fa, [...introducedEntryIds, ...taughtEntryIds], ezafeAfter),
    }),
    introducedEntryIds,
    taughtEntryIds,
    question: { promptDa: 'Hvad betyder udtrykket?', choicesDa: [da, ...distractors], answerDa: da },
  }
}

export const connectedPhrases: ConnectedReading[] = [
  phrase('1-1', '1', 0, 'آب و باد', 'آب و باد', 'vand og vind', 'åb o båd', 'ɒːb o bɒːd', vocab('1', 'ab', 'bad'), [CONNECTOR_O.id], ['brød og vand', 'mor og jeg']),
  phrase('1-2', '1', 1, 'مادر و من', 'مادَر و مَن', 'mor og jeg', 'mådar o man', 'mɒːdæɾ o mæn', vocab('1', 'madar', 'man'), [CONNECTOR_O.id], ['far og jeg', 'mor og du']),
  phrase('1-3', '1', 2, 'این و آن', 'این و آن', 'denne og den der', 'in o ån', 'iːn o ɒːn', vocab('1', 'in', 'an'), [CONNECTOR_O.id], ['vi og de', 'her og nu']),
  phrase('2-1', '2', 0, 'کتاب و مداد', 'کِتاب و مِداد', 'bog og blyant', 'ketåb o medåd', 'ketɒːb o medɒːd', vocab('2', 'ketab', 'medad'), [CONNECTOR_O.id], ['bord og dør', 'hånd og ven']),
  phrase('2-2', '2', 1, 'دست دوست', 'دَستِ دوست', 'vennens hånd', 'daste dust', 'dæste duːst', vocab('2', 'dast', 'dust'), [EZAFE.id], ['vennens bog', 'skolens dør'], ['دست']),
  phrase('3-1', '3', 0, 'ماه و آسمان', 'ماه و آسِمان', 'måne og himmel', 'måh o åsemån', 'mɒːh o ɒːsemɒːn', vocab('3', 'mah', 'aseman'), [CONNECTOR_O.id], ['hus og regn', 'nat og måne']),
  phrase('3-2', '3', 1, 'شب و باران', 'شَب و باران', 'nat og regn', 'sjab o bårån', 'ʃæb o bɒːɾɒːn', vocab('3', 'shab', 'baran'), [CONNECTOR_O.id], ['hus og regn', 'måne og himmel']),
  phrase('4-1', '4', 0, 'قرمز و آبی', 'قِرمِز و آبی', 'rød og blå', 'ghermez o åbi', 'ɢeɾmez o ɒːbiː', [...vocab('4', 'qermez'), ...vocab('1', 'abi')], [CONNECTOR_O.id], ['grøn og gul', 'sort og hvid']),
  phrase('4-2', '4', 1, 'سیاه و سفید', 'سیاه و سِفید', 'sort og hvid', 'siyåh o sefid', 'sijɒːh o sefiːd', vocab('4', 'siyah', 'sefid'), [CONNECTOR_O.id], ['orange og lyserød', 'rød og blå']),
  phrase('5-1', '5', 0, 'گربه و سگ', 'گُربه و سَگ', 'kat og hund', 'gorbe o sag', 'ɡoɾˈbe o sæɡ', vocab('5', 'gorbe', 'sag'), [CONNECTOR_O.id], ['fugl og fisk', 'hest og ko']),
  phrase('5-2', '5', 1, 'اسب و گاو', 'اَسب و گاو', 'hest og ko', 'asb o gåv', 'æsb o ɡɒːv', vocab('5', 'asb', 'gav'), [CONNECTOR_O.id], ['kanin og mus', 'kat og hund']),
]

function microtext(
  unitId: string,
  fa: string,
  faMarked: string,
  da: string,
  lyd: string,
  ipa: string,
  introducedEntryIds: string[],
  choicesDa: string[],
  extraTaughtEntryIds: string[] = [],
  ezafeAfter: string[] = [],
): ConnectedReading {
  const taughtEntryIds = [COPULA_AST.id, ...extraTaughtEntryIds]
  return {
    id: `${unitId}-text`,
    unitId,
    kind: 'microtext',
    entry: defineEntry({
      id: `reading-${unitId}-text`,
      kind: 'phrase',
      fa,
      faMarked,
      da,
      pron: { da: lyd, ipa },
      readingCues: readingCuesFor(fa, [...introducedEntryIds, ...taughtEntryIds], ezafeAfter),
    }),
    introducedEntryIds,
    taughtEntryIds,
    question: { promptDa: 'Hvad handler den lille tekst om?', choicesDa, answerDa: da },
  }
}

export const connectedTexts: ConnectedReading[] = [
  microtext('1', 'این آب است. آن نان است. او بابا است.', 'این آب اَست. آن نان اَست. او بابا اَست.', 'Dette er vand. Det der er brød. Han eller hun er far.', 'in åb ast. ån nån ast. u båbå ast', 'iːn ɒːb æst. ɒːn nɒːn æst. uː bɒːbɒː æst', vocab('1', 'in', 'ab', 'an', 'nan', 'u', 'baba'), ['Dette er vand. Det der er brød. Han eller hun er far.', 'Det handler om skole.', 'Det handler om farver.']),
  microtext('2', 'این مدرسه است. این میز است. این کتاب است. او دوست من است.', 'این مَدرِسه اَست. این میز اَست. این کِتاب اَست. او دوستِ مَن اَست.', 'Dette er en skole. Dette er et bord. Dette er en bog. Han eller hun er min ven.', 'in madrese ast. in miz ast. in ketåb ast. u duste man ast', 'iːn mædɾese æst. iːn miːz æst. iːn ketɒːb æst. uː duːste mæn æst', [...vocab('1', 'in', 'u', 'man'), ...vocab('2', 'madrese', 'miz', 'ketab', 'dust')], ['Dette er en skole. Dette er et bord. Dette er en bog. Han eller hun er min ven.', 'Det er et hus i regnen.', 'Det er brød og vand.'], [EZAFE.id], ['دوست']),
  microtext('3', 'این خانه است. این آسمان است. این ماه است. شب است.', 'این خانه اَست. این آسِمان اَست. این ماه اَست. شَب اَست.', 'Dette er et hus. Dette er himlen. Dette er månen. Det er nat.', 'in khåne ast. in åsemån ast. in måh ast. sjab ast', 'iːn xɒːne æst. iːn ɒːsemɒːn æst. iːn mɒːh æst. ʃæb æst', [...vocab('1', 'in'), ...vocab('3', 'khane', 'aseman', 'mah', 'shab')], ['Dette er et hus. Dette er himlen. Dette er månen. Det er nat.', 'Det er en skole med en ven.', 'Det handler om mor og far.']),
  microtext('4', 'این قرمز و آبی است. آن سبز و زرد است. این سیاه و سفید است. آن نارنجی و صورتی است.', 'این قِرمِز و آبی اَست. آن سَبز و زَرد اَست. این سیاه و سِفید اَست. آن نارَنجی و صورَتی اَست.', 'Denne er rød og blå. Den der er grøn og gul. Denne er sort og hvid. Den der er orange og lyserød.', 'in ghermez o åbi ast. ån sabz o zard ast. in siyåh o sefid ast. ån nårenji o surati ast', 'iːn ɢeɾmez o ɒːbiː æst. ɒːn sæbz o zæɾd æst. iːn sijɒːh o sefiːd æst. ɒːn nɒːɾændʒiː o suːɾætiː æst', [...vocab('1', 'in', 'an', 'abi'), ...vocab('3', 'sabz', 'zard'), ...vocab('4', 'qermez', 'siyah', 'sefid', 'narenji', 'surati')], ['Denne er rød og blå. Den der er grøn og gul. Denne er sort og hvid. Den der er orange og lyserød.', 'Det handler om hjem og himmel.', 'Det handler om skole.'], [CONNECTOR_O.id]),
  microtext('5', 'این پرنده است. آن ماهی است. این خرگوش است. آن موش است.', 'این پَرَنده اَست. آن ماهی اَست. این خَرگوش اَست. آن موش اَست.', 'Dette er en fugl. Det der er en fisk. Dette er en kanin. Det der er en mus.', 'in parande ast. ån måhi ast. in khargusj ast. ån musj ast', 'iːn pæˈɾænde æst. ɒːn mɒːˈhiː æst. iːn xæɾˈɡuːʃ æst. ɒːn muːʃ æst', [...vocab('1', 'in', 'an'), ...vocab('5', 'parande', 'mahi', 'khargush', 'mush')], ['Dette er en fugl. Det der er en fisk. Dette er en kanin. Det der er en mus.', 'Det handler om farver.', 'Det handler om skole.']),
]

export const connectedReadings = [...connectedPhrases, ...connectedTexts]
export const readingFunctionEntries = [CONNECTOR_O, COPULA_AST, EZAFE]

export function findConnectedReading(unitId: string, id: string) {
  return connectedReadings.find((reading) => reading.unitId === unitId && reading.id === id)
}

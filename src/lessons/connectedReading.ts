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
  phrase('3-2', '3', 1, 'گل زرد', 'گُلِ زَرد', 'gul blomst', 'gole zard', 'ɡole zæɾd', vocab('3', 'gol', 'zard'), [EZAFE.id], ['grøn blomst', 'gul nat'], ['گل']),
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
  microtext('1', 'این آب است. آن نان است. او بابا است.', 'این آب اَست. آن نان اَست. او بابا اَست.', 'Dette er vand, det der er brød, og personen er far.', 'in åb ast. ån nån ast. u båbå ast', 'iːn ɒːb æst. ɒːn nɒːn æst. uː bɒːbɒː æst', vocab('1', 'in', 'ab', 'an', 'nan', 'u', 'baba'), ['Dette er vand, det der er brød, og personen er far.', 'Det handler om skole.', 'Det handler om farver.']),
  microtext('2', 'این مدرسه است. این میز است. این کتاب است. او دوست من است.', 'این مَدرِسه اَست. این میز اَست. این کِتاب اَست. او دوستِ مَن اَست.', 'Det er en skole med et bord og en bog; personen er min ven.', 'in madrese ast. in miz ast. in ketåb ast. u duste man ast', 'iːn mædɾese æst. iːn miːz æst. iːn ketɒːb æst. uː duːste mæn æst', [...vocab('1', 'in', 'u', 'man'), ...vocab('2', 'madrese', 'miz', 'ketab', 'dust')], ['Det er en skole med et bord og en bog; personen er min ven.', 'Det er et hus i regnen.', 'Det er brød og vand.'], [EZAFE.id], ['دوست']),
  microtext('3', 'این خانه است. آسمان آبی است. ماه زرد است. شب است.', 'این خانه اَست. آسِمان آبی اَست. ماه زَرد اَست. شَب اَست.', 'Det er et hus; himlen er blå, månen er gul, og det er nat.', 'in khåne ast. åsemån åbi ast. måh zard ast. sjab ast', 'iːn xɒːne æst. ɒːsemɒːn ɒːbiː æst. mɒːh zæɾd æst. ʃæb æst', [...vocab('1', 'in', 'abi'), ...vocab('3', 'khane', 'aseman', 'mah', 'zard', 'shab')], ['Det er et hus; himlen er blå, månen er gul, og det er nat.', 'Det er en skole med en ven.', 'Det handler om mor og far.']),
]

export const connectedReadings = [...connectedPhrases, ...connectedTexts]
export const readingFunctionEntries = [CONNECTOR_O, COPULA_AST, EZAFE]

export function findConnectedReading(unitId: string, id: string) {
  return connectedReadings.find((reading) => reading.unitId === unitId && reading.id === id)
}

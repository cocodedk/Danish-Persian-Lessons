import { bridgeEntry, consonant, longAa, shortVowel } from './wordBridgeEntry'
import type { WordBridge } from './wordBridgeTypes'

const entries = {
  pas: bridgeEntry({
    id: 'pas', fa: 'پاس', da: 'vagt, beskyttelse eller omsorg',
    pronDa: 'pås', ipa: 'pɒːs',
    readingCues: [consonant(0, 'پ'), longAa(1), consonant(2, 'س')],
  }),
  mord: bridgeEntry({
    id: 'mord', fa: 'مرد', faMarked: 'مُرد', da: 'døde',
    pronDa: 'mord', ipa: 'moɾd',
    readingCues: [consonant(0, 'م'), shortVowel(1, '◌ُ', 'o i “ost”', 'o'),
      consonant(1, 'ر'), consonant(2, 'د')],
  }),
  leng: bridgeEntry({
    id: 'leng', fa: 'لنگ', faMarked: 'لِنگ', da: 'ben',
    pronDa: 'leng', ipa: 'leŋɡ',
    readingCues: [consonant(0, 'ل'), shortVowel(1, '◌ِ', 'e i “let”', 'e'),
      consonant(1, 'ن'), consonant(2, 'گ')],
  }),
} as const

/** Requested sound and meaning bridges whose qualifications need room in the learner copy. */
export const wordBridgeMemoryAdditions: readonly WordBridge[] = [
  {
    id: 'pas-pas-paa', titleDa: 'Pås og pas på', entry: entries.pas, category: 'memory',
    danish: 'pas på', danishGlossDa: 'vær forsigtig eller tag vare på',
    clueDa: 'Persisk pås og dansk pas på ligger tæt i både lyd og idé.',
    meaningDa: 'Persisk pås betyder vagt, beskyttelse eller omsorg. I daglig Tehrani siger man ofte movåzeb båsh for “pas på”.',
    historyDa: 'Pås og pas på er ikke dokumenteret som slægtninge. Tehrani movåzeb er et arabisk låneord.',
  },
  {
    id: 'mord-mord', titleDa: 'Mord og mord', entry: entries.mord, category: 'memory',
    danish: 'mord', danishIpa: 'ˈmoˀɐ̯', danishGlossDa: 'det at dræbe nogen med overlæg',
    clueDa: 'Med dansk lydskrift bliver begge til mord.',
    meaningDa: 'Persisk mord betyder “han, hun eller det døde”. Dansk mord er en navneform for et overlagt drab. De betyder ikke det samme i dag.',
    historyDa: 'Begge går langt tilbage til den samme indoeuropæiske rod for at dø, men betydningerne har udviklet sig forskelligt.',
  },
  {
    id: 'leng-lang', titleDa: 'Leng og lang', entry: entries.leng, category: 'memory',
    danish: 'lang, længe, langt', danishGlossDa: 'ord for udstrækning eller varighed',
    clueDa: 'Leng ligger tæt på lang, længe og langt.',
    meaningDa: 'Persisk leng kan betyde et ben i ældre eller regionalt sprog. De danske ord beskriver udstrækning eller varighed.',
    historyDa: 'Ligheden er en lydlig huskebro, ikke et dokumenteret fælles ophav. Leng er ikke dokumenteret som et historisk dansk længdemål; oversigten har blandt andet fod, håndsbred og alen.',
  },
]

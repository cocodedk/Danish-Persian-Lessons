import { bridgeEntry, consonant, longAa, shortVowel, writtenVowel } from './wordBridgeEntry'

export const bridgeEntriesA = {
  pedar: bridgeEntry({
    id: 'pedar', fa: 'پدر', faMarked: 'پِدَر', da: 'far', pronDa: 'pedar', ipa: 'peˈdæɾ',
    readingCues: [consonant(0, 'پ'), shortVowel(1, '◌ِ', 'e i “let”', 'e'),
      consonant(1, 'د'), shortVowel(2, '◌َ', 'a i “kat”', 'æ'), consonant(2, 'ر')],
  }),
  madar: bridgeEntry({
    id: 'madar', fa: 'مادر', faMarked: 'مادَر', da: 'mor', pronDa: 'mådar', ipa: 'mɒːˈdæɾ',
    readingCues: [consonant(0, 'م'), longAa(1), consonant(2, 'د'),
      shortVowel(3, '◌َ', 'a i “kat”', 'æ'), consonant(3, 'ر')],
  }),
  baradar: bridgeEntry({
    id: 'baradar', fa: 'برادر', faMarked: 'بَرادَر', da: 'bror', pronDa: 'barådar', ipa: 'bæɾɒːˈdæɾ',
    readingCues: [consonant(0, 'ب'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ر'),
      longAa(2), consonant(3, 'د'), shortVowel(4, '◌َ', 'a i “kat”', 'æ'), consonant(4, 'ر')],
  }),
  doxtar: bridgeEntry({
    id: 'doxtar', fa: 'دختر', faMarked: 'دُختَر', da: 'datter', pronDa: 'dokhtar', ipa: 'doxˈtæɾ',
    readingCues: [consonant(0, 'د'), shortVowel(1, '◌ُ', 'o i “ost”', 'o'), consonant(1, 'خ'),
      consonant(2, 'ت'), shortVowel(3, '◌َ', 'a i “kat”', 'æ'), consonant(3, 'ر')],
  }),
  dar: bridgeEntry({
    id: 'dar', fa: 'در', faMarked: 'دَر', da: 'dør', pronDa: 'dar', ipa: 'dæɾ',
    readingCues: [consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ر')],
  }),
  nam: bridgeEntry({
    id: 'nam', fa: 'نام', da: 'navn', pronDa: 'nåm', ipa: 'nɒːm',
    readingCues: [consonant(0, 'ن'), longAa(1), consonant(2, 'م')],
  }),
  mush: bridgeEntry({
    id: 'mush', fa: 'موش', da: 'mus', pronDa: 'mush', ipa: 'muːʃ',
    readingCues: [consonant(0, 'م'),
      writtenVowel(1, 'و', 'u i “mus”', 'uː', 'Vav skriver langt u her'), consonant(2, 'ش')],
  }),
  garm: bridgeEntry({
    id: 'garm', fa: 'گرم', faMarked: 'گَرم', da: 'varm eller hed', pronDa: 'garm', ipa: 'ɡæɾm',
    readingCues: [consonant(0, 'گ'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'),
      consonant(1, 'ر'), consonant(2, 'م')],
  }),
  now: bridgeEntry({
    id: 'now', fa: 'نو', da: 'ny', pronDa: 'now', ipa: 'nou̯',
    readingCues: [consonant(0, 'ن'),
      writtenVowel(1, 'و', 'ow i “show”', 'ou̯', 'Vav er med i lyden ow her')],
  }),
  do: bridgeEntry({
    id: 'do', fa: 'دو', da: 'to', pronDa: 'do', ipa: 'do',
    readingCues: [consonant(0, 'د'),
      writtenVowel(1, 'و', 'o i “to”', 'o', 'Vav skriver lyden o her')],
  }),
} as const

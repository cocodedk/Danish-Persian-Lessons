import { bridgeEntry, consonant, finalE, longAa, shortVowel, writtenVowel } from './wordBridgeEntry'

export const bridgeEntriesB = {
  shesh: bridgeEntry({
    id: 'shesh', fa: 'شش', faMarked: 'شِش', da: 'seks', pronDa: 'shesh', ipa: 'ʃeʃ',
    readingCues: [consonant(0, 'ش'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'ش')],
  }),
  noh: bridgeEntry({
    id: 'noh', fa: 'نه', faMarked: 'نُه', da: 'ni', pronDa: 'noh', ipa: 'noh',
    readingCues: [consonant(0, 'ن'), shortVowel(1, '◌ُ', 'o i “ost”', 'o'), consonant(1, 'ه')],
  }),
  dandan: bridgeEntry({
    id: 'dandan', fa: 'دندان', faMarked: 'دَندان', da: 'tand', pronDa: 'dandån', ipa: 'dænˈdɒːn',
    readingCues: [consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ن'),
      consonant(2, 'د'), longAa(3), consonant(4, 'ن')],
  }),
  naf: bridgeEntry({
    id: 'naf', fa: 'ناف', da: 'navle', pronDa: 'nåf', ipa: 'nɒːf',
    readingCues: [consonant(0, 'ن'), longAa(1), consonant(2, 'ف')],
  }),
  mah: bridgeEntry({
    id: 'mah', fa: 'ماه', da: 'måne eller måned', pronDa: 'måh', ipa: 'mɒːh',
    readingCues: [consonant(0, 'م'), longAa(1), consonant(2, 'ه')],
  }),
  setareh: bridgeEntry({
    id: 'setareh', fa: 'ستاره', faMarked: 'سِتاره', da: 'stjerne',
    pronDa: 'setåre', ipa: 'seˈtɒːɾe',
    readingCues: [consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'),
      consonant(1, 'ت'), longAa(2), consonant(3, 'ر'), finalE(4)],
  }),
  band: bridgeEntry({
    id: 'band', fa: 'بند', faMarked: 'بَند', da: 'bånd, binding eller led',
    pronDa: 'band', ipa: 'bænd',
    readingCues: [consonant(0, 'ب'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'),
      consonant(1, 'ن'), consonant(2, 'د')],
  }),
  setad: bridgeEntry({
    id: 'setad', fa: 'ستاد', faMarked: 'سِتاد', da: 'hovedkontor', pronDa: 'setåd', ipa: 'seˈtɒːd',
    readingCues: [consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'),
      consonant(1, 'ت'), longAa(2), consonant(3, 'د')],
  }),
  seyl: bridgeEntry({
    id: 'seyl', fa: 'سیل', faMarked: 'سِیل', da: 'oversvømmelse', pronDa: 'seyl', ipa: 'sejl',
    readingCues: [consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'),
      writtenVowel(1, 'ی', 'ej i “nej”', 'ej', 'Ye er med i lyden ey her'), consonant(2, 'ل')],
  }),
  dust: bridgeEntry({
    id: 'dust', fa: 'دوست', da: 'ven', pronDa: 'dust', ipa: 'duːst',
    readingCues: [consonant(0, 'د'),
      writtenVowel(1, 'و', 'u i “hus”, men lang', 'uː', 'Våv skriver den lange u-lyd her'),
      consonant(2, 'س'), consonant(3, 'ت')],
  }),
} as const

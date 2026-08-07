import { defineEntry, type PersianEntry, type ReadingCue } from '../catalog/types'
import { specimens } from './alphabet'

export interface WordBridge {
  id: string
  titleDa: string
  entry: PersianEntry
  danish: string
  clueDa: string
  meaningDa: string
}

const byGlyph = new Map(Object.values(specimens).map((item) => [item.glyph, item]))

function consonant(start: number, glyph: string): ReadingCue {
  const item = byGlyph.get(glyph)
  if (!item) throw new Error(`No letter for word bridge: ${glyph}`)
  return {
    start,
    end: start + 1,
    display: glyph,
    role: 'consonant',
    helpDa: `${item.name.da}: ${item.sound.da}`,
    pron: item.sound,
  }
}

function shortVowel(start: number, display: '◌َ' | '◌ِ', da: string, ipa: string): ReadingCue {
  return {
    start,
    end: start,
    display,
    role: 'short-vowel',
    helpDa: 'Den korte lyd høres, men skrives tit ikke',
    pron: { da, ipa },
  }
}

function longAa(start: number): ReadingCue {
  return {
    start,
    end: start + 1,
    display: 'ا',
    role: 'long-vowel',
    helpDa: 'Alef skriver langt å her',
    pron: { da: 'å i “år”', ipa: 'ɒː' },
  }
}

function writtenEy(start: number): ReadingCue {
  return {
    start,
    end: start + 1,
    display: 'ی',
    role: 'written-vowel',
    helpDa: 'Ye er med i lyden ey her',
    pron: { da: 'ej i “nej”', ipa: 'ej' },
  }
}

function writtenFinalE(start: number): ReadingCue {
  return {
    start,
    end: start + 1,
    display: 'ه',
    role: 'written-vowel',
    helpDa: 'He sidst i dette ord skriver lyden e',
    pron: { da: 'e i “let”', ipa: 'e' },
  }
}

const dandan = defineEntry({
  id: 'word-bridge-dandan',
  kind: 'word',
  fa: 'دندان',
  faMarked: 'دَندان',
  da: 'tand',
  pron: { da: 'dandån', ipa: 'dænˈdɒːn' },
  readingCues: [
    consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ن'),
    consonant(2, 'د'), longAa(3), consonant(4, 'ن'),
  ],
})

const setad = defineEntry({
  id: 'word-bridge-setad',
  kind: 'word',
  fa: 'ستاد',
  faMarked: 'سِتاد',
  da: 'hovedkontor',
  pron: { da: 'setåd', ipa: 'seˈtɒːd' },
  readingCues: [
    consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'ت'),
    longAa(2), consonant(3, 'د'),
  ],
})

const band = defineEntry({
  id: 'word-bridge-band',
  kind: 'word',
  fa: 'بند',
  faMarked: 'بَند',
  da: 'bånd eller mur i vand',
  pron: { da: 'band', ipa: 'bænd' },
  readingCues: [
    consonant(0, 'ب'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ن'),
    consonant(2, 'د'),
  ],
})

const seyl = defineEntry({
  id: 'word-bridge-seyl',
  kind: 'word',
  fa: 'سیل',
  faMarked: 'سِیل',
  da: 'meget vand på land',
  pron: { da: 'seyl', ipa: 'sejl' },
  readingCues: [
    consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), writtenEy(1), consonant(2, 'ل'),
  ],
})

const pedar = defineEntry({
  id: 'word-bridge-pedar',
  kind: 'word',
  fa: 'پدر',
  faMarked: 'پِدَر',
  da: 'far',
  pron: { da: 'pedar', ipa: 'peˈdæɾ' },
  readingCues: [
    consonant(0, 'پ'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'د'),
    shortVowel(2, '◌َ', 'a i “kat”', 'æ'), consonant(2, 'ر'),
  ],
})

const setareh = defineEntry({
  id: 'word-bridge-setareh',
  kind: 'word',
  fa: 'ستاره',
  faMarked: 'سِتاره',
  da: 'stjerne',
  pron: { da: 'setåre', ipa: 'seˈtɒːɾe' },
  readingCues: [
    consonant(0, 'س'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'ت'),
    longAa(2), consonant(3, 'ر'), writtenFinalE(4),
  ],
})

const mah = defineEntry({
  id: 'word-bridge-mah',
  kind: 'word',
  fa: 'ماه',
  da: 'måne',
  pron: { da: 'måh', ipa: 'mɒːh' },
  readingCues: [consonant(0, 'م'), longAa(1), consonant(2, 'ه')],
})

const dar = defineEntry({
  id: 'word-bridge-dar',
  kind: 'word',
  fa: 'در',
  faMarked: 'دَر',
  da: 'dør',
  pron: { da: 'dar', ipa: 'dæɾ' },
  readingCues: [
    consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ر'),
  ],
})

/** Easy memory clues, not rules for changing one language into the other. */
export const wordBridges: readonly WordBridge[] = [
  {
    id: 'dandan-tand',
    titleDa: 'Dandån og tand',
    entry: dandan,
    danish: 'tand',
    clueDa: 'Det første d i dandån svarer til t i tand.',
    meaningDa: 'De betyder det samme i dag: tand.',
  },
  {
    id: 'setad-sted',
    titleDa: 'Setåd og sted',
    entry: setad,
    danish: 'sted',
    clueDa: 'S, t og d går igen i begge ord.',
    meaningDa: 'De betyder ikke det samme i dag. Det persiske ord betyder hovedkontor.',
  },
  {
    id: 'band-baand',
    titleDa: 'Band og bånd',
    entry: band,
    danish: 'bånd',
    clueDa: 'Begge ord hænger sammen med at binde.',
    meaningDa: 'Begge kan være noget, der binder. En بند kan også være en mur, der holder vand. Men بند betyder ikke vand eller flod.',
  },
  {
    id: 'seyl-sejle',
    titleDa: 'Seyl og sejle',
    entry: seyl,
    danish: 'sejle',
    clueDa: 'Seyl og sejle lyder næsten ens.',
    meaningDa: 'De er ikke i samme gamle familie. سیل er meget vand på land. På dansk kan vi sige: “Byen sejlede i vand.”',
  },
  {
    id: 'pedar-fader',
    titleDa: 'Pedar og fader',
    entry: pedar,
    danish: 'fader eller far',
    clueDa: 'P i pedar svarer til f i fader.',
    meaningDa: 'De betyder det samme og er i samme gamle familie.',
  },
  {
    id: 'setareh-stjerne',
    titleDa: 'Setåre og stjerne',
    entry: setareh,
    danish: 'stjerne',
    clueDa: 'S, t og r går igen i setåre og stjerne.',
    meaningDa: 'De betyder det samme og er i samme gamle familie.',
  },
  {
    id: 'mah-maane',
    titleDa: 'Måh og måne',
    entry: mah,
    danish: 'måne',
    clueDa: 'Måh og måne starter med næsten samme lyd.',
    meaningDa: 'De betyder det samme og er i samme gamle familie.',
  },
  {
    id: 'dar-doer',
    titleDa: 'Dar og dør',
    entry: dar,
    danish: 'dør',
    clueDa: 'D og r går igen i dar og dør.',
    meaningDa: 'De betyder det samme og er i samme gamle familie.',
  },
]

export const wordBridgeCatalog: PersianEntry[] = wordBridges.map((bridge) => bridge.entry)

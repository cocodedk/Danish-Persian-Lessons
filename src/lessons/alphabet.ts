// The 32 letters of the Persian alphabet, in standard order.
//
// The four positional forms are derived from the glyph and `joins`, not typed
// out 128 times: a letter that joins to the left takes a tatweel on both sides,
// one that does not (ا د ذ ر ز ژ و) only ever takes one on its right. That is
// the whole rule, and deriving it is how the data stays honest.
import type { Letter, Specimen } from './types'
import { STROKES } from './strokes'

const TATWEEL = 'ـ'

interface Row {
  g: string
  id: string
  fa: string
  da: string
  joins: boolean
  anchor: string
  ipa: string
}

/** ذ ز ض ظ are four spellings of one sound — one anchor, so they read alike. */
const Z_ANCHOR = 'stemt s — som engelsk z i "zoo"'

/** ق and غ have fallen together in Tehrani Persian: one sound, two spellings. */
const GHAF_GHEYN = { anchor: 'et dybt g/r bagerst i halsen — ens for ق og غ', ipa: 'ɢ~ɣ' }

const ROWS: Row[] = [
  { g: 'ا', id: 'alef', fa: 'الف', da: 'alef', joins: false, anchor: 'a i "kat"', ipa: 'æ' },
  { g: 'ب', id: 'be', fa: 'بِ', da: 'be', joins: true, anchor: 'b i "bil"', ipa: 'b' },
  { g: 'پ', id: 'pe', fa: 'پِ', da: 'pe', joins: true, anchor: 'p i "pose"', ipa: 'p' },
  { g: 'ت', id: 'te', fa: 'تِ', da: 'te', joins: true, anchor: 't i "tak"', ipa: 't' },
  { g: 'ث', id: 'se', fa: 'ثِ', da: 'se', joins: true, anchor: 's i "sol"', ipa: 's' },
  { g: 'ج', id: 'jim', fa: 'جیم', da: 'jim', joins: true, anchor: 'dj i "jazz"', ipa: 'dʒ' },
  { g: 'چ', id: 'che', fa: 'چِ', da: 'che', joins: true, anchor: 'tj i "chips"', ipa: 'tʃ' },
  { g: 'ح', id: 'he-jimi', fa: 'حِ', da: 'he jimi', joins: true, anchor: 'h i "hus"', ipa: 'h' },
  { g: 'خ', id: 'khe', fa: 'خِ', da: 'khe', joins: true, anchor: 'ch i tysk "Bach"', ipa: 'x' },
  { g: 'د', id: 'dal', fa: 'دال', da: 'dal', joins: false, anchor: 'd i "dag"', ipa: 'd' },
  { g: 'ذ', id: 'zal', fa: 'ذال', da: 'zal', joins: false, anchor: Z_ANCHOR, ipa: 'z' },
  { g: 'ر', id: 're', fa: 'رِ', da: 're', joins: false, anchor: 'rullet r, som spansk "pero"', ipa: 'ɾ' },
  { g: 'ز', id: 'ze', fa: 'زِ', da: 'ze', joins: false, anchor: Z_ANCHOR, ipa: 'z' },
  { g: 'ژ', id: 'zhe', fa: 'ژِ', da: 'zhe', joins: false, anchor: 'som j i fransk "journal" — stemt sj', ipa: 'ʒ' },
  { g: 'س', id: 'sin', fa: 'سین', da: 'sin', joins: true, anchor: 's i "sol"', ipa: 's' },
  { g: 'ش', id: 'shin', fa: 'شین', da: 'shin', joins: true, anchor: 'sj i "sjal"', ipa: 'ʃ' },
  { g: 'ص', id: 'sad', fa: 'صاد', da: 'sad', joins: true, anchor: 's i "sol"', ipa: 's' },
  { g: 'ض', id: 'zad', fa: 'ضاد', da: 'zad', joins: true, anchor: Z_ANCHOR, ipa: 'z' },
  { g: 'ط', id: 'ta', fa: 'طا', da: 'ta', joins: true, anchor: 't i "tak"', ipa: 't' },
  { g: 'ظ', id: 'za', fa: 'ظا', da: 'za', joins: true, anchor: Z_ANCHOR, ipa: 'z' },
  { g: 'ع', id: 'eyn', fa: 'عین', da: 'eyn', joins: true, anchor: 'stød, som i "hånd"', ipa: 'ʔ' },
  { g: 'غ', id: 'gheyn', fa: 'غین', da: 'gheyn', joins: true, ...GHAF_GHEYN },
  { g: 'ف', id: 'fe', fa: 'فِ', da: 'fe', joins: true, anchor: 'f i "fisk"', ipa: 'f' },
  { g: 'ق', id: 'ghaf', fa: 'قاف', da: 'ghaf', joins: true, ...GHAF_GHEYN },
  { g: 'ک', id: 'kaf', fa: 'کاف', da: 'kaf', joins: true, anchor: 'k i "kat"', ipa: 'k' },
  { g: 'گ', id: 'gaf', fa: 'گاف', da: 'gaf', joins: true, anchor: 'g i "gul"', ipa: 'ɡ' },
  { g: 'ل', id: 'lam', fa: 'لام', da: 'lam', joins: true, anchor: 'l i "lys"', ipa: 'l' },
  { g: 'م', id: 'mim', fa: 'میم', da: 'mim', joins: true, anchor: 'm i "mor"', ipa: 'm' },
  { g: 'ن', id: 'nun', fa: 'نون', da: 'nun', joins: true, anchor: 'n i "nat"', ipa: 'n' },
  { g: 'و', id: 'vav', fa: 'واو', da: 'vav', joins: false, anchor: 'v i "vand"', ipa: 'v' },
  { g: 'ه', id: 'he', fa: 'هِ', da: 'he do-tjeshm', joins: true, anchor: 'h i "hus"', ipa: 'h' },
  { g: 'ی', id: 'ye', fa: 'یِ', da: 'ye', joins: true, anchor: 'j i "ja"', ipa: 'j' },
]

/** One Danish line for the letters that surprise a reader. Nothing decorative. */
const HINTS: Record<string, string> = {
  alef: 'Alef har ingen lyd i sig selv — den bærer vokalen. Får den en bølge ovenpå, bliver den آ.',
  pe: 'Et af de fire bogstaver persisk har, men arabisk ikke: پ چ ژ گ.',
  che: 'Et af de fire bogstaver persisk har, men arabisk ikke: پ چ ژ گ.',
  'he-jimi': 'Der er to h-bogstaver. Dette er he-jimi — samme krop som ج, bare uden prik.',
  zhe: 'Et af de fire bogstaver persisk har, men arabisk ikke: پ چ ژ گ.',
  gheyn: 'ق og غ lyder ens i Teheran. Stavemåden skiller dem ad, ikke lyden.',
  ghaf: 'ق og غ lyder ens i Teheran. Stavemåden skiller dem ad, ikke lyden.',
  gaf: 'گ er ک med én streg mere. Et af persisks egne fire bogstaver.',
  vav: 'و er både v og vokalen u. Du møder او som «u i du» hos vokaltegnene.',
  he: 'Det andet h. Det kaldes he med to øjne, for midt i et ord får det netop det: ـهـ.',
  ye: 'Alene og sidst står ی uden prikker. Først og midt i ordet får den to under: یـ ـیـ.',
}

function formsFor(glyph: string, joins: boolean) {
  return {
    isolated: glyph,
    initial: joins ? glyph + TATWEEL : glyph,
    medial: joins ? TATWEEL + glyph + TATWEEL : TATWEEL + glyph,
    final: TATWEEL + glyph,
  }
}

/** آ — alef wearing the madde. Taught first, because the primer opens on آب. */
const MADDE: Specimen = {
  id: 'alef-madde',
  glyph: 'آ',
  name: { fa: 'آ', da: 'alef med madde' },
  sound: { da: 'å i "år"', ipa: 'ɒː' },
  strokes: STROKES['alef-madde'],
}

export const letters: Letter[] = ROWS.map((row) => ({
  id: row.id,
  glyph: row.g,
  name: { fa: row.fa, da: row.da },
  sound: { da: row.anchor, ipa: row.ipa },
  strokes: STROKES[row.id],
  forms: formsFor(row.g, row.joins),
  joinsLeft: row.joins,
  ...(HINTS[row.id] ? { hint: HINTS[row.id] } : {}),
  ...(row.id === 'alef' ? { madde: MADDE } : {}),
}))

/**
 * The order they are TAUGHT in, which is not the order they are listed in:
 * آ ا ب د first, because those four spell آب، بابا، باد — the first words in
 * every Iranian first-grade primer. Plan 004 may re-sequence the tail.
 */
const FIRST = ['alef-madde', 'alef', 'be', 'dal']
export const teachingOrder: string[] = [
  ...FIRST,
  ...letters.map((letter) => letter.id).filter((id) => !FIRST.includes(id)),
]

/** Every drawable specimen by id — the 32 letters plus آ. */
export const specimens: Record<string, Specimen> = {
  ...Object.fromEntries(letters.map((letter) => [letter.id, letter])),
  [MADDE.id]: MADDE,
}

/** True for the 32 letters, false for آ — only a letter has positional forms. */
export function isLetter(specimen: Specimen): specimen is Letter {
  return 'forms' in specimen
}

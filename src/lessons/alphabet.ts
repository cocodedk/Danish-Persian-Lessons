// The 32 letters of the Persian alphabet, in standard order.
//
// The four positional forms are derived from the glyph and `joins`, not typed
// out 128 times: a letter that joins to the left takes a tatweel on both sides,
// one that does not (ا د ذ ر ز ژ و) only ever takes one on its right. That is
// the whole rule, and deriving it is how the data stays honest.
import type { Letter, Specimen } from './types'
import { STROKES } from './strokes'
import { defineEntry } from '../catalog/types'
import { withoutMarks } from './marks'

const TATWEEL = 'ـ'

interface Row {
  g: string
  id: string
  fa: string
  da: string
  joins: boolean
  anchor: string
  ipa: string
  nameIpa: string
  /** Danish help for saying the full school name when it differs from `da`. */
  namePron?: string
  /** The Danish sound-hint shown on the keyboard key — see types.ts. */
  hint: string
}

/** ذ ز ض ظ are four spellings of one sound — one anchor, so they read alike. */
const Z_ANCHOR = 'stemt s — som engelsk z i "zoo"'

/** ق and غ have fallen together in Tehrani Persian: one sound, two spellings. */
const GHAF_GHEYN = { anchor: 'dyb lyd i halsen', ipa: 'ɢ~ɣ' }

// A short key hint names the sound or job a learner needs first. Letters with
// more than one common job show both; same-sound spellings repeat one hint.
const ROWS: Row[] = [
  { g: 'ا', id: 'alef', fa: 'الف', da: 'alef', joins: false, anchor: 'bærer en vokal; se hele ordet', ipa: '◌', nameIpa: 'ʔælef', hint: 'vokal' },
  { g: 'ب', id: 'be', fa: 'بِ', da: 'be', joins: true, anchor: 'b i "bil"', ipa: 'b', nameIpa: 'be', hint: 'b' },
  { g: 'پ', id: 'pe', fa: 'پِ', da: 'pe', joins: true, anchor: 'p i "pose"', ipa: 'p', nameIpa: 'pe', hint: 'p' },
  { g: 'ت', id: 'te', fa: 'تِ', da: 'te', joins: true, anchor: 't i "tak"', ipa: 't', nameIpa: 'te', hint: 't' },
  { g: 'ث', id: 'se', fa: 'ثِ', da: 'se', joins: true, anchor: 's i "sol"', ipa: 's', nameIpa: 'se', hint: 's' },
  { g: 'ج', id: 'jim', fa: 'جیم', da: 'jim', joins: true, anchor: 'dj i "jazz"', ipa: 'dʒ', nameIpa: 'dʒiːm', hint: 'dj' },
  { g: 'چ', id: 'che', fa: 'چِ', da: 'che', joins: true, anchor: 'tj i "chips"', ipa: 'tʃ', nameIpa: 'tʃe', hint: 'tj' },
  { g: 'ح', id: 'he-jimi', fa: 'ح جیمی', da: 'he jimi', joins: true, anchor: 'h i "hus"', ipa: 'h', nameIpa: 'heje dʒiːmiː', namePron: 'he-ye djimi', hint: 'h' },
  { g: 'خ', id: 'khe', fa: 'خِ', da: 'khe', joins: true, anchor: 'ch i tysk "Bach"', ipa: 'x', nameIpa: 'xe', hint: 'kh' },
  { g: 'د', id: 'dal', fa: 'دال', da: 'dal', joins: false, anchor: 'd i "dag"', ipa: 'd', nameIpa: 'dɒːl', hint: 'd' },
  { g: 'ذ', id: 'zal', fa: 'ذال', da: 'zal', joins: false, anchor: Z_ANCHOR, ipa: 'z', nameIpa: 'zɒːl', hint: 'z' },
  { g: 'ر', id: 're', fa: 'رِ', da: 're', joins: false, anchor: 'rullet r, som spansk "pero"', ipa: 'ɾ', nameIpa: 'ɾe', hint: 'r' },
  { g: 'ز', id: 'ze', fa: 'زِ', da: 'ze', joins: false, anchor: Z_ANCHOR, ipa: 'z', nameIpa: 'ze', hint: 'z' },
  { g: 'ژ', id: 'zhe', fa: 'ژِ', da: 'zhe', joins: false, anchor: 'som j i fransk "journal" — stemt sj', ipa: 'ʒ', nameIpa: 'ʒe', hint: 'zj' },
  { g: 'س', id: 'sin', fa: 'سین', da: 'sin', joins: true, anchor: 's i "sol"', ipa: 's', nameIpa: 'siːn', hint: 's' },
  { g: 'ش', id: 'shin', fa: 'شین', da: 'shin', joins: true, anchor: 'sj i "sjal"', ipa: 'ʃ', nameIpa: 'ʃiːn', hint: 'sj' },
  { g: 'ص', id: 'sad', fa: 'صاد', da: 'sad', joins: true, anchor: 's i "sol"', ipa: 's', nameIpa: 'sɒːd', hint: 's' },
  { g: 'ض', id: 'zad', fa: 'ضاد', da: 'zad', joins: true, anchor: Z_ANCHOR, ipa: 'z', nameIpa: 'zɒːd', hint: 'z' },
  { g: 'ط', id: 'ta', fa: 'طا', da: 'ta', joins: true, anchor: 't i "tak"', ipa: 't', nameIpa: 'tɒː', hint: 't' },
  { g: 'ظ', id: 'za', fa: 'ظا', da: 'za', joins: true, anchor: Z_ANCHOR, ipa: 'z', nameIpa: 'zɒː', hint: 'z' },
  { g: 'ع', id: 'eyn', fa: 'عین', da: 'eyn', joins: true, anchor: 'lille stop eller ingen lyd; se ordet', ipa: 'ʔ~∅', nameIpa: 'ʔejn', hint: 'stop' },
  { g: 'غ', id: 'gheyn', fa: 'غین', da: 'gheyn', joins: true, ...GHAF_GHEYN, nameIpa: 'ɢejn', hint: 'gh' },
  { g: 'ف', id: 'fe', fa: 'فِ', da: 'fe', joins: true, anchor: 'f i "fisk"', ipa: 'f', nameIpa: 'fe', hint: 'f' },
  { g: 'ق', id: 'ghaf', fa: 'قاف', da: 'ghaf', joins: true, ...GHAF_GHEYN, nameIpa: 'ɢɒːf', hint: 'gh' },
  { g: 'ک', id: 'kaf', fa: 'کاف', da: 'kaf', joins: true, anchor: 'k i "kat"', ipa: 'k', nameIpa: 'kɒːf', hint: 'k' },
  { g: 'گ', id: 'gaf', fa: 'گاف', da: 'gaf', joins: true, anchor: 'g i "gul"', ipa: 'ɡ', nameIpa: 'ɡɒːf', hint: 'g' },
  { g: 'ل', id: 'lam', fa: 'لام', da: 'lam', joins: true, anchor: 'l i "lys"', ipa: 'l', nameIpa: 'lɒːm', hint: 'l' },
  { g: 'م', id: 'mim', fa: 'میم', da: 'mim', joins: true, anchor: 'm i "mor"', ipa: 'm', nameIpa: 'miːm', hint: 'm' },
  { g: 'ن', id: 'nun', fa: 'نون', da: 'nun', joins: true, anchor: 'n i "nat"', ipa: 'n', nameIpa: 'nuːn', hint: 'n' },
  { g: 'و', id: 'vav', fa: 'واو', da: 'vav', joins: false, anchor: 'v i "vand"', ipa: 'v', nameIpa: 'vɒːv', hint: 'v/u' },
  { g: 'ه', id: 'he', fa: 'ه دو چشم', da: 'he do-tjeshm', joins: true, anchor: 'h i "hus"', ipa: 'h', nameIpa: 'heje do tʃeʃm', namePron: 'he-ye do tjeshm', hint: 'h/e' },
  { g: 'ی', id: 'ye', fa: 'یِ', da: 'ye', joins: true, anchor: 'j i "ja"', ipa: 'j', nameIpa: 'je', hint: 'j/i' },
]

/** One Danish line for the letters that surprise a reader. Nothing decorative. */
const SAME_S = 'På persisk lyder ث، س og ص alle som s. De skrives forskelligt.'
const SAME_Z = 'På persisk lyder ذ، ز، ض og ظ alle som z. De skrives forskelligt.'
const SAME_T = 'På persisk lyder ت og ط begge som t. De skrives forskelligt.'
const SAME_H = 'På persisk lyder ح og ه begge som h. De skrives forskelligt.'
const HINTS: Record<string, string> = {
  alef: 'Alef bærer en vokal. Først i et ord kan den stå med a, e, o, i eller u. Efter en lyd skriver den tit langt å. Se altid hele ordet.',
  pe: 'Et af de fire bogstaver, som persisk har ud over det arabiske alfabet.',
  te: SAME_T,
  se: SAME_S,
  che: 'Et af de fire bogstaver, som persisk har ud over det arabiske alfabet.',
  'he-jimi': `${SAME_H} Dette hedder he-ye djimi.`,
  zal: SAME_Z,
  zhe: 'Et af de fire bogstaver, som persisk har ud over det arabiske alfabet.',
  ze: SAME_Z,
  sin: SAME_S,
  sad: SAME_S,
  zad: SAME_Z,
  ta: SAME_T,
  za: SAME_Z,
  gheyn: 'Gheyn og ghaf lyder ens i Teheran. Stavemåden skiller dem ad, ikke lyden.',
  ghaf: 'Ghaf og gheyn lyder ens i Teheran. Først i et ord er lyden tit et kort stop. Mellem vokaler er den tit blød.',
  gaf: 'Gaf er kaf med én streg mere og er et af persisks egne fire bogstaver.',
  vav: 'Vav er både v og den lange vokal u. Du møder begge brugsmåder i lektionerne.',
  eyn: 'Eyn har ikke én dansk lyd. Det kan give et lille stop eller ingen lyd. Dansk æ, ø, å og y kommer ikke fra eyn. Se hele ordet.',
  he: `${SAME_H} Dette hedder he-ye do tjeshm. Sidst i mange ord skriver det e.`,
  ye: 'Ye kan skrive j eller den lange vokal i. Alene og sidst står det uden prikker; først og midt får det to prikker under.',
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
const MADDE_ENTRY = defineEntry({ id: 'alphabet-alef-madde', kind: 'symbol', fa: 'آ', da: 'alef med madde', pron: { da: 'å i "år"', ipa: 'ɒː' } })
const MADDE: Specimen = {
  id: 'alef-madde',
  entry: MADDE_ENTRY,
  nameEntry: defineEntry({ id: 'alphabet-name-alef-madde', kind: 'symbol', fa: 'آ', da: 'navnet alef med madde', pron: { da: 'å', ipa: 'ɒː' } }),
  glyph: MADDE_ENTRY.fa,
  name: { fa: MADDE_ENTRY.fa, da: MADDE_ENTRY.da },
  sound: MADDE_ENTRY.pron,
  strokes: STROKES['alef-madde'],
  latinHint: 'å',
}

export const letters: Letter[] = ROWS.map((row) => ({
  id: row.id,
  entry: defineEntry({
    id: `alphabet-letter-${row.id}`,
    kind: 'letter',
    fa: row.g,
    da: row.da,
    pron: { da: row.anchor, ipa: row.ipa },
  }),
  nameEntry: defineEntry({
    id: `alphabet-name-${row.id}`,
    kind: 'word',
    fa: withoutMarks(row.fa),
    ...(row.fa !== withoutMarks(row.fa) ? { faMarked: row.fa } : {}),
    da: `bogstavnavnet ${row.da}`,
    pron: { da: row.namePron ?? row.da, ipa: row.nameIpa },
  }),
  glyph: row.g,
  name: { fa: row.fa, da: row.da },
  sound: { da: row.anchor, ipa: row.ipa },
  strokes: STROKES[row.id],
  forms: formsFor(row.g, row.joins),
  joinsLeft: row.joins,
  latinHint: row.hint,
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

const SPECIMEN_ID_BY_ENTRY_ID = new Map(
  Object.values(specimens).map((specimen) => [specimen.entry.id, specimen.id]),
)

/**
 * The specimen (and so the letter screen) that teaches a catalog entry —
 * undefined for entries no drawable specimen owns, which a caller renders as
 * "no lesson to open" rather than guessing a route.
 */
export function specimenIdForEntryId(entryId: string): string | undefined {
  return SPECIMEN_ID_BY_ENTRY_ID.get(entryId)
}

/** True for the 32 letters, false for آ — only a letter has positional forms. */
export function isLetter(specimen: Specimen): specimen is Letter {
  return 'forms' in specimen
}

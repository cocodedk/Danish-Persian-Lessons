// The Danish → Persian sound table from docs/plans/006-your-name.md step 1.
// Sounds only: nothing here knows about a particular name. The names that need
// a letter no Danish sound maps to (ع ص ط ح) live on the override list instead.

/** Two-letter spellings that stand for one sound. Matched before single letters. */
export const DIGRAPHS: Record<string, string> = {
  ch: 'چ',
  sh: 'ش',
  sj: 'ش',
  kh: 'خ',
  zh: 'ژ',
  gh: 'ق',
  th: 'ت',
  ck: 'ک',
  ph: 'ف',
}

export const CONSONANTS: Record<string, string> = {
  b: 'ب',
  c: 'ک',
  d: 'د',
  f: 'ف',
  g: 'گ',
  h: 'ه',
  j: 'ی',
  k: 'ک',
  l: 'ل',
  m: 'م',
  n: 'ن',
  p: 'پ',
  q: 'ک',
  r: 'ر',
  s: 'س',
  t: 'ت',
  v: 'و',
  w: 'و',
  x: 'کس',
  z: 'ز',
}

/**
 * A written vowel is a LONG letter, because that is what a beginner can read
 * back. Persian leaves short vowels unwritten, so a vowel the rules judge short
 * gets no letter at all — see `rules.ts`.
 *
 * å and ø both land on و per the plan's table; æ lands on ا.
 */
export const VOWEL_LONG: Record<string, string> = {
  a: 'ا',
  e: 'ی',
  i: 'ی',
  o: 'و',
  u: 'و',
  y: 'ی',
  æ: 'ا',
  ø: 'و',
  å: 'و',
}

/**
 * A word cannot open on و or ی as a vowel, and a bare ا cannot open on the
 * a-sound: the first vowel of a name is always written, and it is written with
 * its carrier — آ, ا, ای, او.
 */
export const VOWEL_INITIAL: Record<string, string> = {
  a: 'آ',
  e: 'ا',
  i: 'ای',
  o: 'او',
  u: 'او',
  y: 'ای',
  æ: 'ا',
  ø: 'او',
  å: 'او',
}

/** A name ending in -e ends in ه: Mette → مته, Lærke → لرکه, Anne → آنه. */
export const FINAL_E = 'ه'

/** Everything the tokenizer accepts. Anything else is a word boundary. */
export const NAME_LETTERS = /[a-zæøå]/

export function isVowel(letter: string): boolean {
  return letter in VOWEL_LONG
}

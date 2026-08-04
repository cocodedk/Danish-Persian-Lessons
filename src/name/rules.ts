// Rule-based transliteration of one written name into Persian letters.
// Pure: same input, same output, no storage, no randomness.
//
// The one idea worth knowing: Persian writes long vowels as letters and leaves
// short vowels unwritten. Danish marks vowel length in its spelling — a vowel
// before two consonants or before a word-final consonant is short, a vowel
// before a single consonant + vowel is long. Reading that off the spelling is
// what makes Babak → بابک (long a, then short a) rather than باباک, and
// Mette → مته rather than میته.

import { DIGRAPHS, CONSONANTS, VOWEL_LONG, VOWEL_INITIAL, FINAL_E, isVowel } from './soundMap'

interface Unit {
  kind: 'consonant' | 'vowel'
  /** The Danish letter(s) this unit was written with — 'tt' counts as one 't'. */
  src: string
  /** True for a written double consonant: it shortens the vowel before it. */
  doubled: boolean
}

/** Strips everything that is not a Danish letter and lowercases the rest. */
export function cleanPart(raw: string): string {
  return raw.toLowerCase().replace(/[^a-zæøå]/g, '')
}

/**
 * The sound units of `part`, or null when it carries a Danish letter the sound
 * table does not map — x is the only one, and the answer «کس» is one this app
 * does not give (see soundMap.ts). A part with an unmapped letter gets no rule
 * spelling rather than a spelling with a hole where the letter was.
 */
function unitsOf(part: string): Unit[] | null {
  const units: Unit[] = []
  let index = 0

  while (index < part.length) {
    const pair = part.slice(index, index + 2)
    if (pair in DIGRAPHS) {
      units.push({ kind: 'consonant', src: pair, doubled: false })
      index += 2
      continue
    }

    const letter = part[index]
    if (isVowel(letter)) {
      units.push({ kind: 'vowel', src: letter, doubled: false })
      index += 1
      continue
    }
    if (!(letter in CONSONANTS)) return null

    // ss, tt, nn, ll … one letter in Persian, and the vowel before it is short.
    const doubled = part[index + 1] === letter
    units.push({ kind: 'consonant', src: letter, doubled })
    index += doubled ? 2 : 1
  }

  return units
}

/** True when the vowel at `at` is spoken long, and so gets a letter of its own. */
function isLong(units: Unit[], at: number): boolean {
  if (at === units.length - 1) return true // a name ending on its vowel: Sara
  const next = units[at + 1]
  if (next.kind === 'vowel') return true // two vowels in a row: Kian, Marie
  if (next.doubled) return false // Mette, Anna

  let after = at + 1
  while (after < units.length && units[after].kind === 'consonant') after += 1
  if (after - at > 2) return false // two consonants or more: Lærke
  return after < units.length // a single final consonant closes it: Babak
}

function vowelGlyph(units: Unit[], at: number, everyVowelWritten: boolean): string {
  const unit = units[at]
  if (at === 0) return VOWEL_INITIAL[unit.src]
  if (at === units.length - 1 && unit.src === 'e') return FINAL_E
  if (everyVowelWritten || isLong(units, at)) return VOWEL_LONG[unit.src]
  return ''
}

function render(units: Unit[], everyVowelWritten: boolean): string {
  return units
    .map((unit, at) =>
      unit.kind === 'vowel'
        ? vowelGlyph(units, at, everyVowelWritten)
        : (DIGRAPHS[unit.src] ?? CONSONANTS[unit.src]),
    )
    .join('')
}

/**
 * One written name, spelled by the rules — best first:
 * 1. as Persian writes it, with the short vowels left out (Mette → مته);
 * 2. with every vowel written out, which some learners find easier to read
 *    back (Mette → میته).
 * Returns an empty list when there is nothing transliterable in `raw`.
 */
export function ruleSpellings(raw: string): string[] {
  const units = unitsOf(cleanPart(raw))
  if (units === null || units.length === 0) return []
  const spellings = [render(units, false), render(units, true)]
  return [...new Set(spellings)].filter(Boolean)
}

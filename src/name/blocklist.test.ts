import { describe, it, expect } from 'vitest'
import { crudeHits, isDecent, CRUDE_PREFIXES, CRUDE_WORDS } from './blocklist'
import { suggestSpellings } from './transliterate'
import { NAME_OVERRIDE_FA_STRINGS, NAME_OVERRIDE_LATIN } from './overrides'
import { GUARD_FIXTURE_NAMES } from './guardFixtures'
import { findPersianTextViolations } from '../lessons/textRules'

const DANISH_ALPHABET = [...'abcdefghijklmnopqrstuvwxyzæøå']

/** Every string of `length` letters over the Danish alphabet: 29, 841, 24 389. */
function everyString(length: number): string[] {
  let words = ['']
  for (let step = 0; step < length; step += 1) {
    words = words.flatMap((word) => DANISH_ALPHABET.map((letter) => word + letter))
  }
  return words
}

describe('the crude-word filter', () => {
  it('is written in Persian code points — an Arabic ك here would match nothing', () => {
    for (const word of [...CRUDE_PREFIXES, ...CRUDE_WORDS]) {
      expect(findPersianTextViolations(word), word).toEqual([])
    }
    expect(CRUDE_PREFIXES.length).toBeGreaterThan(4)
    expect(CRUDE_WORDS.length).toBeGreaterThan(15)
  })

  it('catches the worst words wherever a part starts on them', () => {
    // The spelling this app used to hand a Kirsten, and the one it used to
    // hand an X. Both open on a word; what follows does not soften it.
    expect(crudeHits('کیرستن')).toContain('کیر')
    expect(crudeHits('کس ا آ')).toContain('کس')
    expect(crudeHits('کونراد')).toContain('کون')
    expect(isDecent('کیرستن')).toBe(false)
  })

  it('leaves the same letters alone inside a word, where they are not the word', () => {
    // الکساندر carries ک س in the middle and is simply Alexander; مرگ is death
    // standing alone and nothing at all inside مارگرته.
    expect(crudeHits('الکساندر')).toEqual([])
    expect(crudeHits('مارگرته')).toEqual([])
    expect(crudeHits('خرم')).toEqual([])
    expect(crudeHits('مرگ')).toEqual(['مرگ'])
    expect(crudeHits('خر')).toEqual(['خر'])
  })

  it('reads a compound name part by part, so one bad half is caught', () => {
    expect(isDecent('آنه مته')).toBe(true)
    expect(crudeHits('آنه سگ')).toEqual(['سگ'])
  })

  it('passes the names the app is actually for', () => {
    for (const name of ['سارا', 'بابک', 'مته', 'سورن', 'آنا', 'علی', 'لرکه', 'محمد', 'کرستن']) {
      expect(isDecent(name), name).toBe(true)
    }
  })
})

describe('nothing the engine offers reads crude', () => {
  it('walks every short input, the whole override table and the guard fixtures', () => {
    const corpus = [
      ...everyString(1),
      ...everyString(2),
      ...everyString(3),
      ...NAME_OVERRIDE_LATIN,
      ...GUARD_FIXTURE_NAMES,
    ]

    const offences: string[] = []
    let offered = 0
    for (const input of corpus) {
      for (const spelling of suggestSpellings(input)) {
        offered += 1
        const hits = crudeHits(spelling)
        if (hits.length > 0) offences.push(`${input} → ${spelling} (${hits.join(' ')})`)
      }
    }

    expect(offences).toEqual([])
    // …and it is not clean because it is empty: this corpus really is spelled.
    expect(corpus.length).toBeGreaterThan(25000)
    expect(offered).toBeGreaterThan(20000)
  })

  it('spells every name on the override list exactly as the list spells it', () => {
    for (const spelling of NAME_OVERRIDE_FA_STRINGS) {
      expect(isDecent(spelling), spelling).toBe(true)
    }
    for (const latin of NAME_OVERRIDE_LATIN) {
      expect(suggestSpellings(latin).length, latin).toBeGreaterThan(0)
    }
  })

  it('says nothing rather than something crude — the letter bank takes over', () => {
    // Ker: کر by the rules, کیر with the vowel written. Nothing decent is left,
    // so the screen offers no spelling at all and hands over the alphabet.
    expect(suggestSpellings('Ker')).toEqual([])
    expect(suggestSpellings('Kir')).toEqual([])
    expect(suggestSpellings('Sg')).toEqual([])
    // …while a name that only loses ONE reading keeps the other.
    expect(suggestSpellings('Car')).toEqual(['کار'])
    // Konrad keeps the short-vowel reading; کونراد, which opens on a word, goes.
    expect(suggestSpellings('Konrad')).toEqual(['کنرد'])
  })
})

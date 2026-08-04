import { describe, it, expect } from 'vitest'
import { crudeHits, isDecent, CRUDE_PREFIXES, CRUDE_WORDS } from './blocklist'
import { suggestSpellings } from './transliterate'
import { NAME_OVERRIDE_FA_STRINGS, NAME_OVERRIDE_LATIN } from './overrides'
import { GUARD_FIXTURE_NAMES } from './guardFixtures'
import { GIVEN_NAME_CORPUS } from './nameCorpus'
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
    // الکساندر carries ک س in the middle and is simply Alexander; خر is an
    // insult standing alone and nothing at all inside خرم.
    expect(crudeHits('الکساندر')).toEqual([])
    expect(crudeHits('خرم')).toEqual([])
    expect(crudeHits('خر')).toEqual(['خر'])
    expect(crudeHits('سینا')).toEqual([])
    expect(crudeHits('سینه')).toEqual(['سینه'])
  })

  it('reads مرگ, کوس and چوس from the opening, because a name growing does not help', () => {
    // The round-2 hole: these three were whole-token entries, so مرگریته and
    // کوسر walked straight through. What saves the Danish Margrethe is the ا she
    // really carries, not the letters after the گ.
    expect(crudeHits('مرگریته')).toEqual(['مرگ'])
    expect(crudeHits('مرگت')).toEqual(['مرگ'])
    expect(crudeHits('کوسر')).toEqual(['کوس'])
    expect(crudeHits('چوسی')).toEqual(['چوس'])
    expect(crudeHits('مارگرته')).toEqual([])
    expect(crudeHits('مارگیت')).toEqual([])
    expect(crudeHits('کوروش')).toEqual([])
    expect(crudeHits('کوثر')).toEqual([])
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
      ...GIVEN_NAME_CORPUS,
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

describe('the names people really have', () => {
  it('walks a few hundred Danish and Iranian first names without one crude answer', () => {
    const offences: string[] = []
    let answered = 0
    let offered = 0
    for (const name of GIVEN_NAME_CORPUS) {
      const spellings = suggestSpellings(name)
      if (spellings.length > 0) answered += 1
      for (const spelling of spellings) {
        offered += 1
        const hits = crudeHits(spelling)
        if (hits.length > 0) offences.push(`${name} → ${spelling} (${hits.join(' ')})`)
      }
    }

    expect(offences).toEqual([])
    expect(GIVEN_NAME_CORPUS.length).toBeGreaterThan(250)
    expect(offered).toBeGreaterThan(300)
    // Silence is the honest answer for a handful of these, and only a handful:
    // a guard that passed by refusing every name would be no guard at all.
    expect(answered / GIVEN_NAME_CORPUS.length).toBeGreaterThan(0.9)
  })

  it('does not reproduce anything the round-2 critic typed in', () => {
    // 1. مرگریته — «død» first, and it was the top suggestion.
    expect(suggestSpellings('Margrete')[0]).not.toBe('مرگریته')
    expect(suggestSpellings('Margrete')).toEqual(['مارگرته'])
    expect(suggestSpellings('Margit')).toEqual(['مارگیت'])
    // 2. سینه — a body part, offered to every Sine in Denmark.
    expect(suggestSpellings('Sine')).toEqual([])
    expect(crudeHits(suggestSpellings('Sinne').join(' '))).toEqual([])
    // 3. کوسر for Kosar. The name is کوثر and always was.
    expect(suggestSpellings('Kosar')).toEqual(['کوثر'])
    expect(suggestSpellings('Kowsar')).toEqual(['کوثر'])
    // …and the x-names the round-1 fix left with nothing to read at all.
    expect(suggestSpellings('Felix')).toEqual(['فلیکس'])
    expect(suggestSpellings('Axel')).toEqual(['اکسل'])
    expect(suggestSpellings('Cyrus')).toEqual(['سیروس'])
  })
})

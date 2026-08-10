import { describe, it, expect } from 'vitest'
import { vocabUnits, allVocabWords, findVocabUnit } from './vocab'
import { withoutMarks } from './marks'
import { lessons, vocabLessonId } from './registry'
import { findPersianTextViolations } from './textRules'

/** The pre-approved starter set — plan 004 step 2. All ten sit in unit ۱. */
const STARTER_SET: Array<[string, string]> = [
  ['آب', 'vand'],
  ['بابا', 'far'],
  ['نان', 'brød'],
  ['مادر', 'mor'],
  ['من', 'jeg'],
  ['تو', 'du'],
  ['ما', 'vi'],
  ['او', 'han eller hun'],
  ['این', 'denne, dette'],
  ['آن', 'den, det (derovre)'],
]

describe('grade-1 vocabulary data', () => {
  it('is five focused units of at least six words, all reachable by id', () => {
    expect(vocabUnits).toHaveLength(5)
    for (const unit of vocabUnits) {
      expect(unit.words.length, unit.id).toBeGreaterThanOrEqual(6)
      expect(findVocabUnit(unit.id)).toBe(unit)
    }
    expect(findVocabUnit('nope')).toBeUndefined()
  })

  it('gives every card a Persian word, a vocalized specimen, a Danish meaning and both pronunciations', () => {
    for (const word of allVocabWords) {
      expect(word.id, word.fa).toMatch(/^[a-z]+$/)
      expect(word.fa.length, word.id).toBeGreaterThan(0)
      expect(word.faMarked.length, word.id).toBeGreaterThan(0)
      expect(word.da.length, word.id).toBeGreaterThan(0)
      expect(word.pron.da.length, word.id).toBeGreaterThan(0)
      expect(word.pron.ipa.length, word.id).toBeGreaterThan(0)
    }
  })

  it('keeps ids unique across all units', () => {
    const ids = allVocabWords.map((word) => word.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('spells faMarked as fa plus اِعراب and nothing else — take the marks off and the word is back', () => {
    for (const word of allVocabWords) {
      expect(withoutMarks(word.faMarked), word.id).toBe(word.fa)
    }
  })

  it('actually marks the words that carry a short vowel', () => {
    const marked = allVocabWords.filter((word) => word.faMarked !== word.fa)
    expect(marked.map((word) => word.id)).toEqual([
      'madar',
      'man',
      'medad',
      'ketab',
      'dar',
      'dast',
      'madrese',
      'salam',
      'aseman',
      'shab',
      'gol',
      'qermez',
      'sabz',
      'zard',
      'sefid',
      'narenji',
      'surati',
      'gorbe',
      'sag',
      'parande',
      'asb',
      'khargush',
    ])
    // The others are long vowels all the way through — آب، بابا، نان have
    // nothing to mark, which is exactly why the primer opens on them.
    expect(withoutMarks('مَدرِسه')).toBe('مدرسه')
    expect(withoutMarks('آب')).toBe('آب')
  })

  it('gives the separate color lesson eight distinct visual swatches', () => {
    const colors = findVocabUnit('4')!
    expect(colors.title).toBe('Farver')
    expect(colors.words).toHaveLength(8)
    expect(new Set(colors.words.map((word) => word.swatch)).size).toBe(8)
    expect(colors.words.every((word) => word.swatch)).toBe(true)
  })

  it('gives the separate animal lesson eight common animals', () => {
    const animals = findVocabUnit('5')!
    expect(animals.title).toBe('Dyr')
    expect(animals.words.map((word) => word.da)).toEqual([
      'kat',
      'hund',
      'fugl',
      'fisk',
      'hest',
      'ko',
      'kanin',
      'mus',
    ])
  })

  it('preserves the stable entry ids of colors moved from earlier lessons', () => {
    const colors = findVocabUnit('4')!
    const entryId = (wordId: string) => colors.words.find((word) => word.id === wordId)!.entry.id
    expect(entryId('abi')).toBe('vocabulary-1-abi')
    expect(entryId('sabz')).toBe('vocabulary-3-sabz')
    expect(entryId('zard')).toBe('vocabulary-3-zard')
  })

  it('holds the unique-answer invariant: no two words in a unit share a meaning or a sound', () => {
    for (const unit of vocabUnits) {
      const columns = [
        unit.words.map((word) => word.da),
        unit.words.map((word) => word.pron.da),
        unit.words.map((word) => word.pron.ipa),
      ]
      for (const values of columns) {
        expect(new Set(values).size, `${unit.id}: ${values.join(' / ')}`).toBe(values.length)
      }
    }
  })

  it('keeps این and آن apart — the demonstrative pair a homophone check exists for', () => {
    const word = (id: string) => allVocabWords.find((candidate) => candidate.id === id)!
    expect(word('in').pron.ipa).not.toBe(word('an').pron.ipa)
    expect(word('in').pron.da).not.toBe(word('an').pron.da)
    expect(word('in').da).not.toBe(word('an').da)
  })

  it('carries the whole pre-approved starter set in unit ۱', () => {
    const unit = findVocabUnit('1')!
    for (const [fa, da] of STARTER_SET) {
      const word = unit.words.find((candidate) => candidate.fa === fa)
      expect(word, fa).toBeDefined()
      expect(word!.da, fa).toBe(da)
    }
  })

  it('registers every unit as a vocab lesson, so the text-rule guard walks it', () => {
    for (const unit of vocabUnits) {
      const lesson = lessons.find((candidate) => candidate.id === vocabLessonId(unit.id))
      expect(lesson, unit.id).toBeDefined()
      expect(lesson!.kind).toBe('vocab')
      expect(lesson!.items).toEqual(unit.words)
    }
  })

  it('writes Persian code points only — in fa and in the vocalized specimen alike', () => {
    for (const word of allVocabWords) {
      expect(findPersianTextViolations(word.fa), word.id).toEqual([])
      expect(findPersianTextViolations(word.faMarked), word.id).toEqual([])
    }
    for (const unit of vocabUnits) {
      expect(findPersianTextViolations(unit.titleEntry.fa), unit.id).toEqual([])
      // Unit headings are UI chrome: no اِعراب there, only on specimens.
      expect(withoutMarks(unit.titleEntry.fa), unit.id).toBe(unit.titleEntry.fa)
    }
  })
})

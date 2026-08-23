import { describe, expect, it } from 'vitest'
import { beginnerNumbers, countingNumbers, numberCatalog } from './numbers'

describe('Persian numbers for beginners', () => {
  it('teaches the Persian digits and words from one through ten', () => {
    expect(beginnerNumbers.map(({ digit, word }) => [digit.fa, word.fa])).toEqual([
      ['۱', 'یک'], ['۲', 'دو'], ['۳', 'سه'], ['۴', 'چهار'], ['۵', 'پنج'],
      ['۶', 'شش'], ['۷', 'هفت'], ['۸', 'هشت'], ['۹', 'نه'], ['۱۰', 'ده'],
    ])
  })

  it('keeps digits silent and gives every number word two pronunciation aids', () => {
    expect(numberCatalog).toHaveLength(20)
    for (const { digit, word } of beginnerNumbers) {
      expect(digit.pron.ipa).toBe('∅')
      expect(word.pron.da).not.toBe('')
      expect(word.pron.ipa).not.toBe('')
    }
  })
})

describe('counting from one to twenty', () => {
  it('covers exactly the values 1 through 20, each with digit and word', () => {
    expect(countingNumbers.map(({ value }) => value)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
    for (const row of countingNumbers) {
      expect(row.digit.fa).not.toBe('')
      expect(row.word.fa).not.toBe('')
      expect(row.word.faMarked).not.toBe('')
    }
  })

  it('gives every number word dansk lydskrift and standard Tehrani IPA', () => {
    for (const { word } of countingNumbers) {
      expect(word.pron.da).not.toBe('')
      // The catalog stores IPA without display brackets; renderers add them.
      expect(word.pron.ipa, word.id).not.toMatch(/^\[|\]$/)
    }
  })

  it('uses only Persian code points: no Arabic ك/ي and no ASCII digits', () => {
    for (const { digit, word } of countingNumbers) {
      for (const fa of [digit.fa, word.fa, word.faMarked!]) {
        expect(fa).not.toMatch(/[كي]/)
        expect(fa).not.toMatch(/[0-9]/)
      }
    }
  })

  it('keeps the first-ten subset at exactly 1-10 for audio and catalog compatibility', () => {
    expect(beginnerNumbers).toHaveLength(10)
    expect(beginnerNumbers.map(({ value }) => value)).toEqual(
      Array.from({ length: 10 }, (_, i) => i + 1),
    )
  })

  it('gives every entry a unique, predictable catalog id', () => {
    const ids = countingNumbers.flatMap(({ digit, word }) => [digit.id, word.id])
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain('number-20-word')
  })
})

import { describe, expect, it } from 'vitest'
import { vocabularyCatalog } from '../catalog/vocabulary'
import { findPersianTextViolations } from './textRules'
import { allVocabWords, findVocabUnit } from './vocab'
import { extraVocabulary } from './vocabExtras'

describe('vocabulary extras', () => {
  it('registers the words no lesson teaches in the catalog, and only there', () => {
    expect(extraVocabulary.map((entry) => entry.id)).toEqual(['vocabulary-5-shir', 'vocabulary-5-shotor', 'vocabulary-3-khorshid'])
    const taught = new Set(allVocabWords.map((word) => word.entry.id))
    for (const entry of extraVocabulary) {
      expect(vocabularyCatalog, entry.id).toContain(entry)
      expect(taught.has(entry.id), entry.id).toBe(false)
      expect(findPersianTextViolations(entry.fa), entry.id).toEqual([])
    }
  })

  it('leaves the animals unit with its eight words and home and sky with its six', () => {
    expect(findVocabUnit('5')!.words).toHaveLength(8)
    expect(findVocabUnit('3')!.words).toHaveLength(6)
  })
})

import { describe, expect, it } from 'vitest'
import { beginnerNumbers, numberCatalog } from './numbers'

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

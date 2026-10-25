import { describe, expect, it } from 'vitest'
import { hundreds } from './counting100to900'
import { findPersianTextViolations } from './textRules'

describe('the round hundreds the voice reads from a synthesis-only spelling', () => {
  // [value, fa, faMarked, da, pron.da, pron.ipa, synthesisText]: the first five are what learners
  // read and must not change; the voice inserts a vowel into the cluster unless a sukun closes it.
  const spoken = [
    [200, 'دویست', 'دِویست', 'to hundrede', 'devist', 'devist', 'دیویسْت'],
    [400, 'چهارصد', 'چَهارصَد', 'fire hundrede', 'tjahårsad', 'tʃæhɒːrsæd', 'چَهارْصَد'],
    [500, 'پانصد', 'پانصَد', 'fem hundrede', 'pånsad', 'pɒːnsæd', 'پانْصَد'],
    [700, 'هفتصد', 'هَفتصَد', 'syv hundrede', 'haftsad', 'hæftsæd', 'هَفتْصَد'],
    [800, 'هشتصد', 'هَشتصَد', 'otte hundrede', 'hasjtsad', 'hæʃtsæd', 'هَشتْصَد'],
  ] as const

  it('gives each of the five exactly its synthesis text and leaves what learners read alone', () => {
    for (const [value, fa, faMarked, da, pronDa, ipa, synthesisText] of spoken) {
      const { entry } = hundreds.find((base) => base.value === value)!
      expect(entry.synthesisText, entry.id).toBe(synthesisText)
      expect([entry.fa, entry.faMarked, entry.da, entry.pron.da, entry.pron.ipa], entry.id).toEqual([fa, faMarked, da, pronDa, ipa])
      expect(findPersianTextViolations(synthesisText), entry.id).toEqual([])
    }
  })

  it('gives no other hundred a synthesis text', () => {
    const spokenValues: number[] = spoken.map(([value]) => value)
    for (const { value, entry } of hundreds) {
      if (!spokenValues.includes(value)) expect(entry.synthesisText, entry.id).toBeUndefined()
    }
  })
})

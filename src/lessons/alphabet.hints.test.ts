// Split out of alphabet.test.ts to stay under the 200-line cap (CLAUDE.md) —
// the Latin sound hints (docs/plans/008-keyboard-danish-hints.md) are their
// own concern: the dictated table, transcribed once, verbatim.
import { describe, it, expect } from 'vitest'
import { letters } from './alphabet'

describe('keyboard Latin hints', () => {
  // The dictated table, verbatim, glyph -> hint, one line of code per line of the table.
  const TABLE: Record<string, string> = {
    'آ': 'å', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'dj', 'چ': 'tj',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zj', 'س': 's',
    'ش': 'sj', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': '’', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
    'ی': 'j',
  }

  it('has exactly 33 entries — the 32 letters plus آ', () => {
    expect(Object.keys(TABLE)).toHaveLength(33)
  })

  it('gives all 33 keyboard letters a non-empty hint, matching the dictated table', () => {
    for (const letter of letters) {
      expect(letter.latinHint, letter.id).toBe(TABLE[letter.glyph])
    }
    const madde = letters.find((l) => l.id === 'alef')?.madde
    expect(madde?.latinHint, 'alef-madde').toBe(TABLE['آ'])
  })

  it('repeats one hint across every homophone group, derived from sound.ipa equality', () => {
    const byIpa = new Map<string, string[]>()
    for (const letter of letters) {
      byIpa.set(letter.sound.ipa, [...(byIpa.get(letter.sound.ipa) ?? []), letter.latinHint])
    }
    for (const [ipa, hints] of byIpa) {
      expect(new Set(hints).size, `letters sharing ipa "${ipa}": ${hints.join(', ')}`).toBe(1)
    }
    // The groups this finds are real, not a vacuous pass with none over size 1:
    // س (sin), ز (ze), ت (te)/ط (ta), ح (he-jimi)/ه (he), and ق/غ each read alike.
    const groupCount = [...byIpa.values()].filter((hints) => hints.length > 1).length
    expect(groupCount).toBe(5)
  })

  it('keeps ث س ص reading alike, exactly as the plan calls out by name', () => {
    const hints = ['se', 'sin', 'sad'].map((id) => letters.find((l) => l.id === id)?.latinHint)
    expect(hints).toEqual(['s', 's', 's'])
  })
})

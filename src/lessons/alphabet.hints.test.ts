// Split out of alphabet.test.ts to stay under the 200-line cap (CLAUDE.md) —
// the short keyboard hints are their own concern: each must stay accurate and
// small enough to read on the six-column board.
import { describe, it, expect } from 'vitest'
import { letters } from './alphabet'

describe('keyboard Latin hints', () => {
  // Reviewed glyph -> sound or common job.
  const TABLE: Record<string, string> = {
    'آ': 'å', 'ا': 'vokal', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'dj', 'چ': 'tj',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zj', 'س': 's',
    'ش': 'sj', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'stop', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v/u', 'ه': 'h/e',
    'ی': 'j/i',
  }

  it('has exactly 33 entries — the 32 letters plus آ', () => {
    expect(Object.keys(TABLE)).toHaveLength(33)
  })

  it('uses only short Latin hints and a slash for a second common job', () => {
    for (const hint of Object.values(TABLE)) {
      expect(hint).toMatch(/^[a-zæøå]+(?:\/[a-zæøå]+)?$/)
      expect(hint.length).toBeLessThanOrEqual(5)
    }
  })

  it('gives all 33 keyboard letters a non-empty hint, matching the dictated table', () => {
    for (const letter of letters) {
      expect(letter.latinHint, letter.id).toBe(TABLE[letter.glyph])
    }
    const madde = letters.find((l) => l.id === 'alef')?.madde
    expect(madde?.latinHint, 'alef-madde').toBe(TABLE['آ'])
  })

  it('repeats one base hint across every homophone group', () => {
    const byIpa = new Map<string, string[]>()
    for (const letter of letters) {
      const baseHint = letter.latinHint.split('/')[0]
      byIpa.set(letter.sound.ipa, [...(byIpa.get(letter.sound.ipa) ?? []), baseHint])
    }
    for (const [ipa, hints] of byIpa) {
      expect(new Set(hints).size, `letters sharing ipa "${ipa}": ${hints.join(', ')}`).toBe(1)
    }
    // The groups this finds are real, not a vacuous pass with none over size 1:
    // س, ز, ت/ط, ح/ه, and ق/غ each read alike. A key may still name a second job.
    const groupCount = [...byIpa.values()].filter((hints) => hints.length > 1).length
    expect(groupCount).toBe(5)
  })

  it('keeps ث س ص reading alike, exactly as the plan calls out by name', () => {
    const hints = ['se', 'sin', 'sad'].map((id) => letters.find((l) => l.id === id)?.latinHint)
    expect(hints).toEqual(['s', 's', 's'])
  })
})

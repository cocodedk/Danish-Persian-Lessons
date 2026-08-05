// The dictated pronunciation table (docs/plans/009-praise-pronunciation.md),
// transcribed once, verbatim — every praise word and the welcome-back line.
// A new file rather than growing engine.test.ts (already at the 200-line cap,
// CLAUDE.md) — the harness/split precedent for a file nearing the ceiling.
import { describe, it, expect } from 'vitest'
import { PRAISE, WELCOME_BACK } from './copy'

describe('praise pronunciation', () => {
  // The dictated table, verbatim, row order = PRAISE order, welcome-back last.
  const TABLE: Array<{ fa: string; da: string; ipa: string }> = [
    { fa: 'آفرین', da: 'åfarin', ipa: 'ɒːfæɾin' },
    { fa: 'ایول', da: 'ejval', ipa: 'ejvæl' },
    { fa: 'چه خوب', da: 'tje khub', ipa: 'tʃe xub' },
    { fa: 'عالی', da: 'åli', ipa: 'ɒːli' },
    { fa: 'خیلی خوب', da: 'khejli khub', ipa: 'xejli xub' },
    { fa: 'باریکلا', da: 'bårikalå', ipa: 'bɒːɾikælɒː' },
    { fa: 'خوش برگشتی', da: 'khosj bargasjti', ipa: 'xoʃ bæɾɡæʃti' },
  ]

  it('has exactly seven rows — six praise pairs and the welcome-back line', () => {
    expect(TABLE).toHaveLength(7)
    expect(PRAISE).toHaveLength(6)
  })

  it('every praise pair carries its dictated pron, matching the table in order', () => {
    PRAISE.forEach((praise, index) => {
      expect(praise.fa, `row ${index + 1}`).toBe(TABLE[index].fa)
      expect(praise.pron, praise.fa).toEqual({ da: TABLE[index].da, ipa: TABLE[index].ipa })
    })
  })

  it('the welcome-back line carries the table’s seventh row', () => {
    const row = TABLE[6]
    // fa carries a trailing "!" the table itself does not — punctuation, not pronunciation.
    expect(WELCOME_BACK.fa).toBe(`${row.fa}!`)
    expect(WELCOME_BACK.pron).toEqual({ da: row.da, ipa: row.ipa })
  })

  it('no praise entry, or the welcome-back line, is ever missing its pron', () => {
    for (const praise of [...PRAISE, WELCOME_BACK]) {
      expect(praise.pron?.da, praise.fa).toBeTruthy()
      expect(praise.pron?.ipa, praise.fa).toBeTruthy()
    }
  })
})

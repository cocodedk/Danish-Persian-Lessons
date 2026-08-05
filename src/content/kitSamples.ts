// Sample data for the #/kit gallery (docs/plans/002-design-system.md step 7).
// Demo material only — the real vowel and word data arrives with plan 003/004.
// ALL Persian text the gallery renders belongs in this file, never inline in
// KitSamples.tsx, so src/content/kitSamples.test.ts can walk it with the text
// rules. (The gallery's other Persian string, DEMO_WORD.fa, is walked by
// src/lessons/textRules.test.ts.)
import type { Pron } from '../lessons/types'

export interface KitVowel {
  glyph: string
  caption: Pron
}

/** زبر، زیر، پیش with their Danish sound anchors (CLAUDE.md "Curriculum"). */
export const KIT_VOWELS: KitVowel[] = [
  { glyph: 'اَ', caption: { da: 'a', ipa: 'æ' } },
  { glyph: 'اِ', caption: { da: 'e', ipa: 'e' } },
  { glyph: 'اُ', caption: { da: 'o', ipa: 'o' } },
]

/** One line of handwriting for the ruled sheet, per reading direction. */
export const KIT_SHEET_FA = 'روی خط بنویس.'
export const KIT_SHEET_DA = 'Skriv dit navn på linjen.'

/** Every Persian string on the gallery page — walked by the text-rule guard. */
export const KIT_FA_STRINGS: string[] = [...KIT_VOWELS.map((v) => v.glyph), KIT_SHEET_FA]

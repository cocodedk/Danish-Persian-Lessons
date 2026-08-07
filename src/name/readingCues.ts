import type { ReadingCue } from '../catalog/types'

/** Known contextual help can be attached without claiming a pronunciation for
 * every learner-entered name. Unknown names deliberately show letter names
 * only; they never concatenate isolated sounds into a fabricated reading. */
export function personalReadingCues(spelling: string): ReadingCue[] | undefined {
  if (spelling !== 'بابک') return undefined
  return [
    { start: 0, end: 1, display: 'ب', role: 'consonant', helpDa: 'Be siger b', pron: { da: 'b i “bil”', ipa: 'b' } },
    { start: 1, end: 2, display: 'ا', role: 'long-vowel', helpDa: 'Alef skriver langt å her', pron: { da: 'å i “år”', ipa: 'ɒː' } },
    { start: 2, end: 3, display: 'ب', role: 'consonant', helpDa: 'Be siger b', pron: { da: 'b i “bil”', ipa: 'b' } },
    { start: 3, end: 3, display: '◌َ', role: 'short-vowel', helpDa: 'Det korte a høres, men skrives normalt ikke', pron: { da: 'a i “kat”', ipa: 'æ' } },
    { start: 3, end: 4, display: 'ک', role: 'consonant', helpDa: 'Kaf siger k', pron: { da: 'k i “kat”', ipa: 'k' } },
  ]
}

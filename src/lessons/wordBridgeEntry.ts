import { defineEntry, type PersianEntry, type ReadingCue } from '../catalog/types'
import { specimens } from './alphabet'

const byGlyph = new Map(Object.values(specimens).map((item) => [item.glyph, item]))

export function consonant(start: number, glyph: string): ReadingCue {
  const item = byGlyph.get(glyph)
  if (!item) throw new Error(`No letter for word bridge: ${glyph}`)
  return {
    start,
    end: start + 1,
    display: glyph,
    role: 'consonant',
    helpDa: `${item.name.da}: ${item.sound.da}`,
    pron: item.sound,
  }
}

export function shortVowel(
  start: number,
  display: '◌َ' | '◌ِ' | '◌ُ',
  da: string,
  ipa: string,
): ReadingCue {
  return {
    start,
    end: start,
    display,
    role: 'short-vowel',
    helpDa: 'Den korte lyd høres, men skrives tit ikke',
    pron: { da, ipa },
  }
}

export function writtenVowel(
  start: number,
  glyph: 'ا' | 'و' | 'ی' | 'ه',
  da: string,
  ipa: string,
  helpDa: string,
): ReadingCue {
  return {
    start,
    end: start + 1,
    display: glyph,
    role: glyph === 'ی' || glyph === 'ه' ? 'written-vowel' : 'long-vowel',
    helpDa,
    pron: { da, ipa },
  }
}

export const longAa = (start: number) => writtenVowel(
  start, 'ا', 'å i “år”', 'ɒː', 'Alef skriver langt å her',
)

export const finalE = (start: number) => writtenVowel(
  start, 'ه', 'e i “let”', 'e', 'He sidst i ordet skriver lyden e',
)

interface BridgeEntrySeed {
  id: string
  fa: string
  faMarked?: string
  da: string
  pronDa: string
  ipa: string
  readingCues: ReadingCue[]
}

export function bridgeEntry(seed: BridgeEntrySeed): PersianEntry {
  return defineEntry({
    id: `word-bridge-${seed.id}`,
    kind: 'word',
    fa: seed.fa,
    faMarked: seed.faMarked,
    da: seed.da,
    pron: { da: seed.pronDa, ipa: seed.ipa },
    readingCues: seed.readingCues,
  })
}

import { describe, expect, it } from 'vitest'
import { findPronunciationAudio } from '../audio/manifest'
import { counting100to900Catalog } from './counting100to900'
import { counting21to99Catalog } from './counting21to99'
import { countingThousandsCatalog } from './countingThousands'
import { countingNumbers } from './numbers'

const groups = [
  ['1–20', countingNumbers.map((number) => number.word)],
  ['21–99', counting21to99Catalog],
  ['100–999', counting100to900Catalog],
  ['thousands', countingThousandsCatalog],
] as const

describe('counting audio completeness', () => {
  it.each(groups)('%s has one released clip for every taught form', (_name, entries) => {
    const missing = entries.filter((entry) => !findPronunciationAudio(entry.audioId))
      .map((entry) => entry.id)
    expect(missing).toEqual([])
  })
})

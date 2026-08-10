import { describe, expect, it } from 'vitest'
import { allVocabWords } from '../lessons/vocab'
import manifest from './lesson-images.json'
import generatedManifest from './lesson-images.generated.json'
import { lessonImageForEntry, lessonImages } from './catalog'

const imageEntryIds = [
  'vocabulary-2-salam',
  'vocabulary-1-man',
  'vocabulary-1-to',
  'vocabulary-2-dust',
  'vocabulary-1-ab',
  'vocabulary-1-nan',
  'vocabulary-1-baba',
  'vocabulary-1-madar',
  'vocabulary-3-khane',
  'vocabulary-1-in',
  'vocabulary-1-an',
  'vocabulary-1-ma',
  'vocabulary-1-u',
  'vocabulary-2-medad',
  'vocabulary-2-ketab',
  'vocabulary-2-miz',
  'vocabulary-2-dar',
  'vocabulary-3-gol',
  'vocabulary-5-gorbe',
  'vocabulary-5-sag',
  'vocabulary-5-parande',
  'vocabulary-5-mahi',
  'vocabulary-5-asb',
  'vocabulary-5-gav',
  'vocabulary-5-khargush',
  'vocabulary-5-mush',
]

const sourceImages = [...manifest.images, ...generatedManifest.images]

describe('lesson image catalog', () => {
  it('contains the complete starter set and matches the source records', () => {
    expect(lessonImages.flatMap((image) => image.entryIds)).toEqual(imageEntryIds)
    expect(sourceImages).toHaveLength(26)

    for (const image of lessonImages) {
      const source = sourceImages.find((item) => item.id === image.id)
      expect(source?.entryIds).toEqual(image.entryIds)
      expect(source?.altDa).toBe(image.altDa)
      expect(source?.creditId).toBe(image.creditId)
    }
  })

  it('uses real vocabulary IDs, simple Danish and local responsive sources', () => {
    const vocabIds = new Set(allVocabWords.map((word) => word.entry.id))
    for (const image of lessonImages) {
      expect(vocabIds.has(image.entryIds[0])).toBe(true)
      expect(image.altDa.split(' ').length).toBeLessThanOrEqual(5)
      expect(image.sources.map((source) => source.type)).toEqual(['image/webp', 'image/jpeg'])
      expect(image.cardSrc).toBe(`${image.id}-120.jpg`)
      for (const source of image.sources) {
        expect(source.srcSet).not.toMatch(/https?:|\/\//)
        expect(source.srcSet).toContain('480w')
        expect(source.srcSet).toContain('960w')
      }
      expect(lessonImageForEntry(image.entryIds[0])).toBe(image)
    }
    expect(lessonImageForEntry('vocabulary-1-pesar')).toBeUndefined()
  })
})

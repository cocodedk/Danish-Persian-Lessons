import { describe, expect, it } from 'vitest'
import { allVocabWords } from '../lessons/vocab'
import manifest from './lesson-images.json'
import { lessonImageForEntry, lessonImages } from './catalog'

const pilotEntryIds = [
  'vocabulary-1-ab',
  'vocabulary-1-nan',
  'vocabulary-2-medad',
  'vocabulary-2-ketab',
  'vocabulary-2-miz',
  'vocabulary-2-dar',
  'vocabulary-3-khane',
  'vocabulary-3-gol',
]

describe('lesson image catalog', () => {
  it('contains only the eight pilot words and matches the source record', () => {
    expect(lessonImages.flatMap((image) => image.entryIds)).toEqual(pilotEntryIds)
    expect(manifest.images).toHaveLength(8)

    for (const image of lessonImages) {
      const source = manifest.images.find((item) => item.id === image.id)
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
      for (const source of image.sources) {
        expect(source.srcSet).not.toMatch(/https?:|\/\//)
        expect(source.srcSet).toContain('480w')
        expect(source.srcSet).toContain('960w')
      }
      expect(lessonImageForEntry(image.entryIds[0])).toBe(image)
    }
    expect(lessonImageForEntry('vocabulary-1-baba')).toBeUndefined()
  })
})

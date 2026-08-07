import { describe, expect, it } from 'vitest'
import { persianCatalog } from '../catalog/registry'
import { connectedPhrases, connectedTexts, connectedReadings, EZAFE, readingFunctionEntries } from './connectedReading'
import { vocabularyGroups } from '../puzzles/catalog'

describe('connected reading manifest', () => {
  it('has one phrase per four-word group and one microtext per unit', () => {
    const groupCount = Object.values(vocabularyGroups).flat().length
    expect(connectedPhrases).toHaveLength(groupCount)
    expect(connectedTexts).toHaveLength(Object.keys(vocabularyGroups).length)
  })

  it('keeps every tested source and taught function in the catalog', () => {
    const ids = new Set(persianCatalog.map((entry) => entry.id))
    for (const reading of connectedReadings) {
      for (const id of [...reading.introducedEntryIds, ...reading.taughtEntryIds]) {
        expect(ids.has(id), `${reading.id}: ${id}`).toBe(true)
      }
      expect(reading.question.choicesDa).toContain(reading.question.answerDa)
    }
  })

  it('keeps each unit text between three and five sentences', () => {
    for (const text of connectedTexts) {
      const sentences = text.entry.fa.split('.').filter((part) => part.trim())
      expect(sentences.length, text.id).toBeGreaterThanOrEqual(3)
      expect(sentences.length, text.id).toBeLessThanOrEqual(5)
    }
  })

  it('gives every connected text token an ordered reading cue', () => {
    for (const reading of connectedReadings) {
      const written = (reading.entry.readingCues ?? []).filter((cue) => cue.end > cue.start)
      const expected = [...reading.entry.fa]
        .map((glyph, index) => ({ glyph, index }))
        .filter(({ glyph }) => !/[\s.،؟!]/u.test(glyph))
        .map(({ index }) => index)
      expect(written.flatMap((cue) =>
        Array.from({ length: cue.end - cue.start }, (_, offset) => cue.start + offset),
      ), reading.id).toEqual(expected)
    }
  })

  it('teaches function entries with their own contextual cues before use', () => {
    for (const entry of readingFunctionEntries) {
      expect(entry.readingCues?.length, entry.id).toBeGreaterThan(0)
    }
    const schoolText = connectedTexts.find((reading) => reading.unitId === '2')!
    expect(schoolText.taughtEntryIds).toContain(EZAFE.id)
    expect(schoolText.entry.readingCues).toEqual(expect.arrayContaining([
      expect.objectContaining({ display: '◌ِ', role: 'short-vowel' }),
    ]))
  })
})

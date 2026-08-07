import { describe, expect, it } from 'vitest'
import { allVocabWords } from './vocab'
import { letters } from './alphabet'
import { HAMZE_YE_ENTRY } from '../name/forms'

function entry(id: string) {
  const found = allVocabWords.find((word) => word.id === id)?.entry
  if (!found) throw new Error(`missing fixture ${id}`)
  return found
}

describe('contextual Persian reading', () => {
  it('does not claim plain alef has one universal sound', () => {
    const alef = letters.find((letter) => letter.id === 'alef')
    expect(alef?.sound).toEqual({
      da: 'bærer en vokal; se hele ordet',
      ipa: '◌',
    })
  })

  it('reads both alefs in baba as long vowels', () => {
    const alefs = entry('baba').readingCues?.filter((cue) => cue.display === 'ا') ?? []
    expect(alefs).toHaveLength(2)
    expect(alefs.map((cue) => cue.pron?.ipa)).toEqual(['ɒː', 'ɒː'])
  })

  it('reads medial alef in bad as long, without a madde', () => {
    const alef = entry('bad').readingCues?.find((cue) => cue.display === 'ا')
    expect(alef).toMatchObject({ role: 'long-vowel', pron: { ipa: 'ɒː' } })
  })

  it('gives every vocabulary word ordered cues that cover each written code point once', () => {
    for (const word of allVocabWords) {
      const cues = word.entry.readingCues ?? []
      const written = cues.filter((cue) => cue.end > cue.start)
      expect(cues.some((cue) => cue.role === 'whole'), word.id).toBe(false)
      expect(written.flatMap((cue) =>
        Array.from({ length: cue.end - cue.start }, (_, offset) => cue.start + offset),
      ), word.id).toEqual([...word.entry.fa].map((_, index) => index))
      for (const cue of written) {
        expect(cue.display, word.id).toBe([...word.entry.fa].slice(cue.start, cue.end).join(''))
      }
      expect(cues.flatMap((cue) => cue.pron?.ipa ?? []).join(''), word.id).toBe(word.entry.pron.ipa.replaceAll('ˈ', ''))
    }
  })

  it('distinguishes the contextual vowel roles of vav, ye, and final he', () => {
    expect(entry('to').readingCues?.find((cue) => cue.display === 'و')).toMatchObject({ role: 'written-vowel', pron: { ipa: 'o' } })
    const carrier = entry('u').readingCues?.find((cue) => cue.display === 'ا')
    expect(carrier).toMatchObject({ role: 'carrier' })
    expect(carrier?.pron).toBeUndefined()
    expect(entry('u').readingCues?.find((cue) => cue.display === 'و')).toMatchObject({ role: 'long-vowel', pron: { ipa: 'uː' } })
    expect(entry('in').readingCues?.find((cue) => cue.display === 'ی')).toMatchObject({ role: 'long-vowel', pron: { ipa: 'iː' } })
    expect(entry('khane').readingCues?.find((cue) => cue.display === 'ه')).toMatchObject({ role: 'written-vowel', pron: { ipa: 'e' } })
    expect(entry('mah').readingCues?.find((cue) => cue.display === 'ه')).toMatchObject({ role: 'consonant', pron: { ipa: 'h' } })
  })

  it('keeps contextual hamze-over-ye out of one-to-one sound teaching', () => {
    expect(HAMZE_YE_ENTRY).toMatchObject({ pron: { ipa: '∅' } })
    expect(HAMZE_YE_ENTRY.audioId).toBeUndefined()
    expect(HAMZE_YE_ENTRY.audioNotApplicable).toMatch(/ingen egen lyd/)
  })
})

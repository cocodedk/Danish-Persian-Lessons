import { describe, it, expect } from 'vitest'
import { nameLetters } from './forms'

/** Shorthand: the four positions of the letters in a spelling, right to left. */
function positions(spelling: string): string[] {
  return nameLetters(spelling).map((letter) => letter.form)
}

describe('positional forms of a name', () => {
  it('reads بابک as initial, final, initial, final — ا breaks the join', () => {
    expect(positions('بابک')).toEqual(['initial', 'final', 'initial', 'final'])
    expect(nameLetters('بابک').map((letter) => letter.formGlyph)).toEqual([
      'بـ',
      'ـا',
      'بـ',
      'ـک',
    ])
  })

  it('reads مته as a word that joins all the way through', () => {
    expect(positions('مته')).toEqual(['initial', 'medial', 'final'])
    expect(nameLetters('مته').map((letter) => letter.formGlyph)).toEqual(['مـ', 'ـتـ', 'ـه'])
  })

  it('leaves ر and ا standing alone in سارا, because neither joins to the left', () => {
    expect(positions('سارا')).toEqual(['initial', 'final', 'isolated', 'isolated'])
  })

  it('names each letter from the alphabet lesson data', () => {
    const [be, alef] = nameLetters('با')
    expect(be.nameDa).toBe('be')
    expect(be.glyph).toBe('ب')
    expect(be.joinsLeft).toBe(true)
    expect(alef.nameDa).toBe('alef')
    expect(alef.joinsLeft).toBe(false)
  })

  it('knows آ, which is a sign rather than one of the 32 letters', () => {
    const [madde, nun] = nameLetters('آن')
    expect(madde.glyph).toBe('آ')
    expect(madde.form).toBe('isolated')
    expect(madde.nameDa).toBe('alef med madde')
    expect(nun.form).toBe('isolated')
  })

  it('breaks the join at a space, so a compound name is two words', () => {
    const letters = nameLetters('آنه مته')
    expect(letters).toHaveLength(6)
    expect(letters.map((letter) => letter.glyph).join('')).toBe('آنهمته')
    // The ه of آنه ends its word; the م of مته starts a new one.
    expect(letters[2].form).toBe('final')
    expect(letters[3].form).toBe('initial')
  })

  it('numbers the letters in reading order, ignoring the space', () => {
    expect(nameLetters('آنه مته').map((letter) => letter.index)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('handles a letter outside the 32 without losing it', () => {
    // لوئیزه (Louise) carries ئ, which is a form of ی rather than its own letter.
    const letters = nameLetters('لوئیزه')
    expect(letters).toHaveLength(6)
    expect(letters[2].glyph).toBe('ئ')
    expect(letters[2].form).toBe('initial')
  })

  it('returns nothing for an empty spelling', () => {
    expect(nameLetters('')).toEqual([])
    expect(nameLetters('   ')).toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import {
  alphabetBank,
  assemblyBank,
  assembledPrefix,
  nameGlyphs,
  DISTRACTOR_COUNT,
} from './bank'
import { findPersianTextViolations } from '../lessons/textRules'

describe('alphabetBank', () => {
  it('holds the whole alphabet, each tile named in Danish', () => {
    const bank = alphabetBank()
    expect(bank.length).toBe(33)
    expect(bank.map((tile) => tile.glyph)).toContain('ب')
    expect(bank.find((tile) => tile.glyph === 'ب')?.nameDa).toBe('be')
    expect(new Set(bank.map((tile) => tile.key)).size).toBe(bank.length)
  })

  it('offers only Persian code points to tap', () => {
    for (const tile of alphabetBank()) {
      expect(findPersianTextViolations(tile.glyph), tile.nameDa).toEqual([])
    }
  })
})

describe('nameGlyphs', () => {
  it('is the name letter by letter, in reading order', () => {
    expect(nameGlyphs('بابک')).toEqual(['ب', 'ا', 'ب', 'ک'])
    expect(nameGlyphs('سارا')).toEqual(['س', 'ا', 'ر', 'ا'])
  })

  it('counts the letters of a compound name, not its space', () => {
    expect(nameGlyphs('آنه مته')).toEqual(['آ', 'ن', 'ه', 'م', 'ت', 'ه'])
  })
})

describe('assembledPrefix', () => {
  it('grows one letter at a time', () => {
    expect(assembledPrefix('بابک', 0)).toBe('')
    expect(assembledPrefix('بابک', 1)).toBe('ب')
    expect(assembledPrefix('بابک', 3)).toBe('باب')
    expect(assembledPrefix('بابک', 4)).toBe('بابک')
  })

  it('puts the space of a compound name back, but never leaves it dangling', () => {
    expect(assembledPrefix('آنه مته', 3)).toBe('آنه')
    expect(assembledPrefix('آنه مته', 4)).toBe('آنه م')
    expect(assembledPrefix('آنه مته', 6)).toBe('آنه مته')
  })
})

describe('assemblyBank', () => {
  it('holds every letter of the name plus two strangers', () => {
    const bank = assemblyBank('سارا')
    expect(bank).toHaveLength(4 + DISTRACTOR_COUNT)

    const own = [...'سارا']
    for (const glyph of own) {
      expect(bank.filter((tile) => tile.glyph === glyph).length).toBeGreaterThan(0)
    }
    // Two ا in the name means two ا tiles: one per place it has to fill.
    expect(bank.filter((tile) => tile.glyph === 'ا')).toHaveLength(2)
    expect(bank.filter((tile) => !own.includes(tile.glyph))).toHaveLength(DISTRACTOR_COUNT)
  })

  it('gives every tile its own key, so a repeated letter is two tap targets', () => {
    const bank = assemblyBank('بابک')
    expect(new Set(bank.map((tile) => tile.key)).size).toBe(bank.length)
  })

  it('is the same bank every time the same name opens it', () => {
    expect(assemblyBank('مته')).toEqual(assemblyBank('مته'))
    expect(assemblyBank('مته')).not.toEqual(assemblyBank('سورن'))
  })

  it('actually shuffles — the name does not simply lie there in order', () => {
    const inOrder = ['فاطمه', 'سورن', 'بابک', 'سارا', 'لرکه'].filter((spelling) => {
      const bank = assemblyBank(spelling)
      return nameGlyphs(spelling).every((glyph, at) => bank[at]?.glyph === glyph)
    })
    expect(inOrder).toEqual([])
  })

  it('survives a name of one letter and a name with a space in it', () => {
    expect(assemblyBank('و')).toHaveLength(1 + DISTRACTOR_COUNT)
    expect(assemblyBank('آنه مته')).toHaveLength(6 + DISTRACTOR_COUNT)
  })
})

import { describe, it, expect } from 'vitest'
import { compare, markUp, normalizeTyped } from './diff'
import { ZWNJ, SPACE } from './buffer'
import { vocabUnits } from '../lessons/vocab'

describe('comparing what was typed with the word', () => {
  it('matches an exact word', () => {
    expect(compare('بابا', 'بابا')).toEqual({ kind: 'match', index: -1, cellKind: 'letter' })
  })

  it('finds the first wrong letter, and only the first', () => {
    // بابد for بابا: the first three letters are right, the fourth is not.
    expect(compare('بابد', 'بابا')).toEqual({ kind: 'wrong', index: 3, cellKind: 'letter' })
    // نان for بابا: wrong from the very first letter, and that is the only mark.
    expect(compare('نان', 'بابا')).toEqual({ kind: 'wrong', index: 0, cellKind: 'letter' })
  })

  it('finds a missing letter as the slot after what was written', () => {
    expect(compare('باب', 'بابا')).toEqual({ kind: 'missing', index: 3, cellKind: 'letter' })
    expect(compare('', 'بابا')).toEqual({ kind: 'missing', index: 0, cellKind: 'letter' })
  })

  it('finds an extra letter at the first position past the word', () => {
    expect(compare('بابای', 'بابا')).toEqual({ kind: 'extra', index: 4, cellKind: 'letter' })
  })

  it('counts a ZWNJ as a position of its own', () => {
    // The typed side at the divergence ('ه') is a letter, even though the
    // answer wanted a ZWNJ there — see the cellKind tests below for cells
    // that are themselves a space or a ZWNJ.
    expect(compare('کتابها', `کتاب${ZWNJ}ها`)).toEqual({ kind: 'wrong', index: 4, cellKind: 'letter' })
    expect(compare(`کتاب${ZWNJ}ها`, `کتاب${ZWNJ}ها`).kind).toBe('match')
  })
})

describe('naming the kind of cell a divergence points at', () => {
  it('reads the answer\'s side for a missing space or ZWNJ — nothing typed to read yet', () => {
    // «آنه مته» (Anne Mette) joins its two halves with a plain space.
    expect(compare('آنه', 'آنه مته')).toEqual({ kind: 'missing', index: 3, cellKind: 'space' })
    expect(compare('کتاب', `کتاب${ZWNJ}ها`)).toEqual({
      kind: 'missing',
      index: 4,
      cellKind: 'zwnj',
    })
  })

  it('reads the typed side for a stray space or ZWNJ — that is what the red mark shows', () => {
    expect(compare('آنه ', 'آنه')).toEqual({ kind: 'extra', index: 3, cellKind: 'space' })
    expect(compare(`کتاب${ZWNJ}`, 'کتاب')).toEqual({ kind: 'extra', index: 4, cellKind: 'zwnj' })
    expect(compare(SPACE, 'م')).toEqual({ kind: 'wrong', index: 0, cellKind: 'space' })
    expect(compare(ZWNJ, 'م')).toEqual({ kind: 'wrong', index: 0, cellKind: 'zwnj' })
  })
})

describe('normalizing before the comparison', () => {
  it('never asks for اِعراب — the keyboard cannot type it, so it cannot be required', () => {
    // The specimen مَدرِسه wears its vowel marks; the word is مدرسه.
    const { faMarked, fa } = vocabUnits[1].words.find((word) => word.id === 'madrese')!
    expect(faMarked).not.toBe(fa)
    expect(compare(fa, faMarked)).toEqual({ kind: 'match', index: -1, cellKind: 'letter' })
    expect(normalizeTyped(faMarked)).toBe(fa)
  })

  it('strips marks from both sides, so a marked answer in the data cannot fail a right word', () => {
    expect(compare('گل', 'گُل').kind).toBe('match')
    expect(compare('گُل', 'گل').kind).toBe('match')
  })

  it('reads the two spellings of آ as one letter', () => {
    // ا + the combining madde (U+0653) is the same letter as the precomposed آ.
    expect(compare('آب', 'آب').kind).toBe('match')
  })
})

describe('the teacher marks', () => {
  it('marks exactly the first divergence and leaves the rest ink', () => {
    const cells = markUp('بابد', compare('بابد', 'بابا'))
    expect(cells.map((cell) => cell.char)).toEqual(['ب', 'ا', 'ب', 'د'])
    expect(cells.map((cell) => cell.marked)).toEqual([false, false, false, true])
  })

  it('marks an empty slot where a letter is missing', () => {
    const cells = markUp('باب', compare('باب', 'بابا'))
    expect(cells).toHaveLength(4)
    expect(cells[3]).toEqual({ char: '', marked: true })
  })

  it('marks the first letter too many', () => {
    const cells = markUp('بابای', compare('بابای', 'بابا'))
    expect(cells.map((cell) => cell.marked)).toEqual([false, false, false, false, true])
  })

  it('marks nothing when the word is right', () => {
    const cells = markUp('بابا', compare('بابا', 'بابا'))
    expect(cells.every((cell) => !cell.marked)).toBe(true)
  })

  it('keeps a ZWNJ visible as its own cell — an invisible mistake would be unfair', () => {
    const cells = markUp(`کتاب${ZWNJ}`, compare(`کتاب${ZWNJ}`, 'کتاب'))
    expect(cells).toHaveLength(5)
    expect(cells[4]).toEqual({ char: ZWNJ, marked: true })
  })
})

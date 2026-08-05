import { beforeEach, describe, expect, it } from 'vitest'
import { completedPuzzles, payPuzzle } from './puzzles'

beforeEach(() => window.localStorage.clear())

describe('puzzle completion persistence', () => {
  it('stores ids append-only under dpl.v1.puzzles and pays only once', () => {
    expect(payPuzzle('alphabet-1-match')).toBe('item')
    expect(payPuzzle('alphabet-1-match')).toBe('replay')
    expect(payPuzzle('alphabet-2-match')).toBe('item')
    expect(completedPuzzles()).toEqual(['alphabet-1-match', 'alphabet-2-match'])
    expect(window.localStorage.getItem('dpl.v1.puzzles')).toContain('alphabet-1-match')
  })

  it('survives corrupt and denied storage like the other progress stores', () => {
    window.localStorage.setItem('dpl.v1.puzzles', '{bad')
    expect(completedPuzzles()).toEqual([])
    expect(() => payPuzzle('safe')).not.toThrow()
  })
})

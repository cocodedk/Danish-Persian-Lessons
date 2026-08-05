// The marking's note, per cell kind (critic round 1): a space and a نیم‌فاصله
// have no letterform, so the copy must never call either "et andet bogstav".
// Pure function, so tested directly rather than through a rendered screen —
// CLAUDE.md "TDD for logic".
import { describe, it, expect } from 'vitest'
import { noteFor } from './TypeMarks'
import {
  TRY_AGAIN_ENTRY,
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_ZWNJ_ENTRY,
  TYPE_EXTRA_ZWNJ_ENTRY,
} from '../content/faStrings'

describe('an ordinary letter', () => {
  it('keeps the three original lines, «دوباره» carrying the Persian half', () => {
    expect(noteFor({ kind: 'wrong', index: 0, cellKind: 'letter' })).toEqual({
      entry: TRY_AGAIN_ENTRY,
      da: 'Her står et andet bogstav.',
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'letter' })).toEqual({
      entry: TRY_AGAIN_ENTRY,
      da: 'Her mangler et bogstav.',
    })
    expect(noteFor({ kind: 'extra', index: 0, cellKind: 'letter' })).toEqual({
      entry: TRY_AGAIN_ENTRY,
      da: 'Her er et bogstav for meget.',
    })
  })
})

describe('a space or a نیم‌فاصله', () => {
  it('is named as missing, not as a letter', () => {
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'space' })).toEqual({
      entry: TYPE_MISSING_SPACE_ENTRY,
      da: TYPE_MISSING_SPACE_ENTRY.da,
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'zwnj' })).toEqual({
      entry: TYPE_MISSING_ZWNJ_ENTRY,
      da: TYPE_MISSING_ZWNJ_ENTRY.da,
    })
  })

  it('is named as stray, whether the divergence is "wrong" or "extra"', () => {
    for (const kind of ['wrong', 'extra'] as const) {
      expect(noteFor({ kind, index: 0, cellKind: 'space' })).toEqual({
        entry: TYPE_EXTRA_SPACE_ENTRY,
        da: TYPE_EXTRA_SPACE_ENTRY.da,
      })
      expect(noteFor({ kind, index: 0, cellKind: 'zwnj' })).toEqual({
        entry: TYPE_EXTRA_ZWNJ_ENTRY,
        da: TYPE_EXTRA_ZWNJ_ENTRY.da,
      })
    }
  })
})

describe('a match', () => {
  it('says nothing — there is nothing to mark', () => {
    expect(noteFor({ kind: 'match', index: -1, cellKind: 'letter' })).toEqual({ da: '' })
  })
})

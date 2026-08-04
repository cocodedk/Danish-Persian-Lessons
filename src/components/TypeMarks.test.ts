// The marking's note, per cell kind (critic round 1): a space and a نیم‌فاصله
// have no letterform, so the copy must never call either "et andet bogstav".
// Pure function, so tested directly rather than through a rendered screen —
// CLAUDE.md "TDD for logic".
import { describe, it, expect } from 'vitest'
import { noteFor } from './TypeMarks'
import {
  TRY_AGAIN_FA,
  TYPE_MISSING_SPACE_FA,
  TYPE_EXTRA_SPACE_FA,
  TYPE_MISSING_ZWNJ_FA,
  TYPE_EXTRA_ZWNJ_FA,
  TYPE_MISSING_ZWNJ_DA,
  TYPE_EXTRA_ZWNJ_DA,
} from '../content/faStrings'

describe('an ordinary letter', () => {
  it('keeps the three original lines, «دوباره» carrying the Persian half', () => {
    expect(noteFor({ kind: 'wrong', index: 0, cellKind: 'letter' })).toEqual({
      da: 'Her står et andet bogstav.',
      fa: TRY_AGAIN_FA,
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'letter' })).toEqual({
      da: 'Her mangler et bogstav.',
      fa: TRY_AGAIN_FA,
    })
    expect(noteFor({ kind: 'extra', index: 0, cellKind: 'letter' })).toEqual({
      da: 'Her er et bogstav for meget.',
      fa: TRY_AGAIN_FA,
    })
  })
})

describe('a space or a نیم‌فاصله', () => {
  it('is named as missing, not as a letter', () => {
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'space' })).toEqual({
      da: 'Her mangler et mellemrum.',
      fa: TYPE_MISSING_SPACE_FA,
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'zwnj' })).toEqual({
      da: TYPE_MISSING_ZWNJ_DA,
      fa: TYPE_MISSING_ZWNJ_FA,
    })
  })

  it('is named as stray, whether the divergence is "wrong" or "extra"', () => {
    for (const kind of ['wrong', 'extra'] as const) {
      expect(noteFor({ kind, index: 0, cellKind: 'space' })).toEqual({
        da: 'Her står et mellemrum for meget.',
        fa: TYPE_EXTRA_SPACE_FA,
      })
      expect(noteFor({ kind, index: 0, cellKind: 'zwnj' })).toEqual({
        da: TYPE_EXTRA_ZWNJ_DA,
        fa: TYPE_EXTRA_ZWNJ_FA,
      })
    }
  })
})

describe('a match', () => {
  it('says nothing — there is nothing to mark', () => {
    expect(noteFor({ kind: 'match', index: -1, cellKind: 'letter' })).toEqual({ da: '', fa: '' })
  })
})

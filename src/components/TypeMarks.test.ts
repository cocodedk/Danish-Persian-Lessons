// The marking's note, per cell kind (critic round 1): a space and a نیم‌فاصله
// have no letterform, so the copy must never call either "et andet bogstav".
// Pure function, so tested directly rather than through a rendered screen —
// CLAUDE.md "TDD for logic".
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { noteFor, TypeMarks } from './TypeMarks'
import {
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_ZWNJ_ENTRY,
  TYPE_EXTRA_ZWNJ_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
  TYPE_EXTRA_LETTER_ENTRY,
} from '../content/faStrings'

describe('an ordinary letter', () => {
  it('uses one exact bilingual entry for each kind of difference', () => {
    expect(noteFor({ kind: 'wrong', index: 0, cellKind: 'letter' })).toEqual({
      entry: TYPE_WRONG_LETTER_ENTRY,
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'letter' })).toEqual({
      entry: TYPE_MISSING_LETTER_ENTRY,
    })
    expect(noteFor({ kind: 'extra', index: 0, cellKind: 'letter' })).toEqual({
      entry: TYPE_EXTRA_LETTER_ENTRY,
    })
  })

  it('renders no Danish-only sentence after the paired feedback', () => {
    render(TypeMarks({
      attempt: 'ب',
      divergence: { kind: 'wrong', index: 0, cellKind: 'letter' },
    }))

    expect(screen.getByText(TYPE_WRONG_LETTER_ENTRY.fa)).toBeInTheDocument()
    expect(screen.getByText(TYPE_WRONG_LETTER_ENTRY.da)).toBeInTheDocument()
    expect(screen.queryByText(/mister ingenting/i)).not.toBeInTheDocument()
  })
})

describe('a space or a نیم‌فاصله', () => {
  it('is named as missing, not as a letter', () => {
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'space' })).toEqual({
      entry: TYPE_MISSING_SPACE_ENTRY,
    })
    expect(noteFor({ kind: 'missing', index: 0, cellKind: 'zwnj' })).toEqual({
      entry: TYPE_MISSING_ZWNJ_ENTRY,
    })
  })

  it('is named as stray, whether the divergence is "wrong" or "extra"', () => {
    for (const kind of ['wrong', 'extra'] as const) {
      expect(noteFor({ kind, index: 0, cellKind: 'space' })).toEqual({
        entry: TYPE_EXTRA_SPACE_ENTRY,
      })
      expect(noteFor({ kind, index: 0, cellKind: 'zwnj' })).toEqual({
        entry: TYPE_EXTRA_ZWNJ_ENTRY,
      })
    }
  })
})

describe('a match', () => {
  it('says nothing — there is nothing to mark', () => {
    expect(noteFor({ kind: 'match', index: -1, cellKind: 'letter' })).toEqual({})
  })
})

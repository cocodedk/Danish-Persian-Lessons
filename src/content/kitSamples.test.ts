import { describe, it, expect } from 'vitest'
import { findPersianTextViolations } from '../lessons/textRules'
import { KIT_FA_STRINGS } from './kitSamples'

describe('kit gallery sample data', () => {
  it('every Persian string on the gallery obeys the text rules', () => {
    expect(KIT_FA_STRINGS.flatMap(findPersianTextViolations)).toEqual([])
  })
})

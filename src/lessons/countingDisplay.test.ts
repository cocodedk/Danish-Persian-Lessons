import { describe, expect, it } from 'vitest'
import { formatCountingNumber, formatCountingRange } from './countingDisplay'
import { countingCurriculum } from './countingLesson'

describe('Danish counting display', () => {
  it('leaves numbers below a thousand exactly as they are', () => {
    expect(formatCountingNumber(1)).toBe('1')
    expect(formatCountingNumber(21)).toBe('21')
    expect(formatCountingNumber(100)).toBe('100')
    expect(formatCountingNumber(999)).toBe('999')
  })

  it('groups thousands the Danish way', () => {
    expect(formatCountingNumber(1000)).toBe('1.000')
    expect(formatCountingNumber(9999)).toBe('9.999')
    expect(formatCountingNumber(10000)).toBe('10.000')
    expect(formatCountingNumber(1000000)).toBe('1.000.000')
  })

  it('writes a range as the half-sentence a card can open', () => {
    expect(formatCountingRange([21, 99])).toBe('fra 21 til 99')
    expect(formatCountingRange([1000, 9999])).toBe('fra 1.000 til 9.999')
  })

  it('formats every curriculum range without touching the numeric authority', () => {
    for (const entry of countingCurriculum) {
      expect(formatCountingRange(entry.range)).toBe(
        `fra ${formatCountingNumber(entry.range[0])} til ${formatCountingNumber(entry.range[1])}`,
      )
      expect(entry.range.every((bound) => Number.isInteger(bound))).toBe(true)
    }
  })
})

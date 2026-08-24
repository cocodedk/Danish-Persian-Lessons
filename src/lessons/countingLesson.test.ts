import { describe, expect, it } from 'vitest'
import { countingCurriculum, countingLesson } from './countingLesson'
import { counting21to99Lesson } from './counting21to99'
import { counting100to900Lesson } from './counting100to900'
import { countingThousandsLesson } from './countingThousands'
import { countingNumbers } from './numbers'

describe('tællekurvens rækkefølge', () => {
  it('lists the four counting lessons themselves, in teaching order', () => {
    expect(countingCurriculum).toHaveLength(4)
    expect(countingCurriculum[0]).toBe(countingLesson)
    expect(countingCurriculum[1]).toBe(counting21to99Lesson)
    expect(countingCurriculum[2]).toBe(counting100to900Lesson)
    expect(countingCurriculum[3]).toBe(countingThousandsLesson)
    // The descriptors themselves, not look-alikes carrying the same fields:
    // a structural clone of a lesson is not what the array holds.
    const lookAlike = { ...counting100to900Lesson }
    const thousandsLookAlike = { ...countingThousandsLesson }
    expect(countingCurriculum.includes(counting100to900Lesson)).toBe(true)
    expect(countingCurriculum.includes(countingThousandsLesson)).toBe(true)
    expect(countingCurriculum.some((entry) => entry === lookAlike)).toBe(false)
    expect(countingCurriculum.some((entry) => entry === thousandsLookAlike)).toBe(false)
  })

  it('covers 1-20, then 21-99, then 100-999, then 1000-9999, exactly', () => {
    expect(countingLesson.range).toEqual([1, 20])
    expect(counting21to99Lesson.range).toEqual([21, 99])
    // Lesson 3's label says 100-900 — the nine hundreds its rule needs — while
    // the range it covers runs to 999. The descriptor is the only place that
    // pairing is fixed; this test reads it, it does not restate it.
    expect(counting100to900Lesson.range).toEqual([100, 999])
    // Lesson 4 is the last: the number part of the app stops at 9.999, so the
    // curriculum's final endpoint is where the whole range ends.
    expect(countingThousandsLesson.range).toEqual([1000, 9999])
    const last = countingCurriculum[countingCurriculum.length - 1]
    expect(last.range[1]).toBe(9999)
  })

  it('leaves no gap and no overlap between the ranges', () => {
    for (let i = 1; i < countingCurriculum.length; i += 1) {
      const previous = countingCurriculum[i - 1].range
      const current = countingCurriculum[i].range
      expect(current[0]).toBe(previous[1] + 1)
      expect(current[1]).toBeGreaterThan(current[0])
    }
  })

  it('gives every lesson its own route', () => {
    const paths = countingCurriculum.map((lesson) => lesson.path)
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths).toHaveLength(4)
  })

  it('presents no partial 1-10 lesson: the foundation runs all the way to 20', () => {
    expect(countingCurriculum.every((lesson) => lesson.range[1] !== 10)).toBe(true)
    expect(countingLesson.range[1]).toBe(20)
  })

  it('reads the foundation range off its own rows instead of repeating 1 and 20', () => {
    expect(countingLesson.range).toEqual([
      countingNumbers[0].value,
      countingNumbers[countingNumbers.length - 1].value,
    ])
    expect(countingLesson.numbers).toBe(countingNumbers)
  })
})

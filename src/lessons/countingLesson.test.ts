import { describe, expect, it } from 'vitest'
import { countingCurriculum, countingLesson } from './countingLesson'
import { counting21to99Lesson } from './counting21to99'
import { countingNumbers } from './numbers'

describe('tællekurvens rækkefølge', () => {
  it('lists the two counting lessons themselves, in teaching order', () => {
    expect(countingCurriculum).toHaveLength(2)
    expect(countingCurriculum[0]).toBe(countingLesson)
    expect(countingCurriculum[1]).toBe(counting21to99Lesson)
  })

  it('covers 1-20 and then 21-99, exactly', () => {
    expect(countingLesson.range).toEqual([1, 20])
    expect(counting21to99Lesson.range).toEqual([21, 99])
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

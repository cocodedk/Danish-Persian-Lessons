import { describe, it, expect, beforeEach } from 'vitest'
import {
  countingCurriculumProgress,
  countingCurriculumProgressLine,
} from './countingCurriculum'
import { countingLesson, countingCurriculum } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { markCountingDone } from './counting'
import { counting21to99Progress, counting100to900Progress } from './countingRules'

/** The foundation counts *word* ids, so a digit id would tick nothing. */
const foundationWordId = countingLesson.numbers[0].word.id
const ruleId = counting21to99Progress.ids[0]
const hundredsId = counting100to900Progress.ids[0]

/**
 * What every lesson in the curriculum currently reports as done, in order.
 * Reading all three at once is how isolation is proved: a mark that leaked
 * into a neighbouring store would show up as a second non-zero here.
 */
function doneCounts(): number[] {
  return countingCurriculum.map((entry) => countingCurriculumProgress(entry).done)
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('counting curriculum progress — one adapter over all three lessons', () => {
  it('maps the foundation to its own store and its own rows', () => {
    expect(countingCurriculumProgress(countingLesson)).toEqual({
      done: 0,
      total: countingLesson.numbers.length,
      noun: 'tal',
    })
    markCountingDone(foundationWordId)
    expect(countingCurriculumProgress(countingLesson).done).toBe(1)
  })

  it('maps the rule lesson to its own store and its own ids', () => {
    expect(countingCurriculumProgress(counting21to99Lesson)).toEqual({
      done: 0,
      total: counting21to99Progress.ids.length,
      noun: 'dele',
    })
    counting21to99Progress.markDone(ruleId)
    expect(countingCurriculumProgress(counting21to99Lesson).done).toBe(1)
  })

  it('maps the hundreds lesson to its own store and its own ids', () => {
    expect(countingCurriculumProgress(counting100to900Lesson)).toEqual({
      done: 0,
      total: counting100to900Progress.ids.length,
      noun: 'dele',
    })
    counting100to900Progress.markDone(hundredsId)
    expect(countingCurriculumProgress(counting100to900Lesson).done).toBe(1)
  })

  it('reads its totals off the descriptor and the store, not off a literal', () => {
    // Nothing is typed twice: the numbers below are the ones the lesson and
    // the store already hold, so resizing either moves the line with it.
    expect(countingCurriculumProgress(countingLesson).total)
      .toBe(countingLesson.numbers.length)
    expect(countingCurriculumProgress(counting21to99Lesson).total)
      .toBe(counting21to99Progress.ids.length)
    expect(countingCurriculumProgress(counting100to900Lesson).total)
      .toBe(counting100to900Progress.ids.length)
    // And no two lessons are accidentally the same size, so the assertions
    // above could not all pass on one shared total.
    const totals = countingCurriculum.map((e) => countingCurriculumProgress(e).total)
    expect(new Set(totals).size).toBe(totals.length)
  })

  it('writes the honest line every counting screen already uses', () => {
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`0 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`0 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting100to900Lesson))
      .toBe(`0 af ${counting100to900Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps the stores apart: learning the foundation moves only its own line', () => {
    markCountingDone(foundationWordId)
    expect(doneCounts()).toEqual([1, 0, 0])
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
  })

  it('keeps them apart when the rule lesson moves', () => {
    counting21to99Progress.markDone(ruleId)
    expect(doneCounts()).toEqual([0, 1, 0])
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`1 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps them apart when the hundreds lesson moves', () => {
    counting100to900Progress.markDone(hundredsId)
    expect(doneCounts()).toEqual([0, 0, 1])
    expect(countingCurriculumProgressLine(counting100to900Lesson))
      .toBe(`1 af ${counting100to900Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('answers for every entry the curriculum currently lists', () => {
    expect(countingCurriculum).toHaveLength(3)
    for (const entry of countingCurriculum) {
      expect(() => countingCurriculumProgressLine(entry), entry.path).not.toThrow()
    }
  })

  it('resolves on descriptor identity, not on a matching path', () => {
    // A structural clone carries the same path as the real foundation
    // descriptor, but it is not the object the curriculum holds — and a
    // look-alike must not be handed the foundation's store. The path is still
    // named in the error, so the failure says which lesson went unrecognised.
    const lookAlike = { ...countingLesson }
    expect(lookAlike.path).toBe(countingLesson.path)
    expect(lookAlike).not.toBe(countingLesson)
    expect(() => countingCurriculumProgress(lookAlike)).toThrow(countingLesson.path)
    expect(() => countingCurriculumProgressLine(lookAlike)).toThrow(countingLesson.path)
  })

  it('refuses a look-alike of the rule lesson for the same reason', () => {
    const lookAlike = { ...counting21to99Lesson }
    expect(lookAlike.path).toBe(counting21to99Lesson.path)
    expect(lookAlike).not.toBe(counting21to99Lesson)
    expect(() => countingCurriculumProgress(lookAlike))
      .toThrow(counting21to99Lesson.path)
  })

  it('refuses a look-alike of the hundreds lesson, however complete it looks', () => {
    // The riskiest clone of the three: it carries the real route, the real
    // title and the real range, so nothing about it reads as unfinished. It is
    // still not the object the curriculum holds, and it must not be handed the
    // hundreds store — a wired-looking stranger that silently borrowed another
    // lesson's counts would report progress nobody made.
    const lookAlike = { ...counting100to900Lesson }
    expect(lookAlike.path).toBe(counting100to900Lesson.path)
    expect(lookAlike.range).toEqual(counting100to900Lesson.range)
    expect(lookAlike).not.toBe(counting100to900Lesson)
    counting100to900Progress.markDone(hundredsId)
    expect(() => countingCurriculumProgress(lookAlike))
      .toThrow(counting100to900Lesson.path)
    expect(() => countingCurriculumProgressLine(lookAlike))
      .toThrow(counting100to900Lesson.path)
  })

  it('fails loudly for a descriptor no store is wired to', () => {
    const planned = {
      path: '/lesson/taelle/tusinder',
      title: 'Regnereglen for tusinder',
      summary: 'Endnu ikke bygget',
      range: [1000, 9999] as const,
    }
    expect(countingCurriculum.some((e) => e.path === planned.path)).toBe(false)
    expect(() => countingCurriculumProgress(planned)).toThrow(planned.path)
  })
})

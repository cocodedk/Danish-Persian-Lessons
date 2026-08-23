import { describe, it, expect, beforeEach } from 'vitest'
import {
  countingCurriculumProgress,
  countingCurriculumProgressLine,
} from './countingCurriculum'
import { countingLesson, countingCurriculum } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { markCountingDone } from './counting'
import { counting21to99Progress } from './countingRules'

/** The foundation counts *word* ids, so a digit id would tick nothing. */
const foundationWordId = countingLesson.numbers[0].word.id
const ruleId = counting21to99Progress.ids[0]

beforeEach(() => {
  window.localStorage.clear()
})

describe('counting curriculum progress — one adapter over both lessons', () => {
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

  it('reads its totals off the descriptor and the store, not off a literal', () => {
    // Nothing is typed twice: the numbers below are the ones the lesson and
    // the store already hold, so resizing either moves the line with it.
    expect(countingCurriculumProgress(countingLesson).total)
      .toBe(countingLesson.numbers.length)
    expect(countingCurriculumProgress(counting21to99Lesson).total)
      .toBe(counting21to99Progress.ids.length)
    // And the two lessons are not accidentally the same size, so the
    // assertions above could not both pass on one shared total.
    expect(countingLesson.numbers.length).not.toBe(counting21to99Progress.ids.length)
  })

  it('writes the honest line every counting screen already uses', () => {
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`0 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`0 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps the stores apart: learning one lesson moves only its own line', () => {
    markCountingDone(foundationWordId)
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`0 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps them apart the other way round too', () => {
    counting21to99Progress.markDone(ruleId)
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`1 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`0 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
  })

  it('answers for every entry the curriculum currently lists', () => {
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

  it('fails loudly for a descriptor no store is wired to', () => {
    const planned = {
      path: '/lesson/taelle/100-900',
      title: 'Regnereglen 100-900',
      summary: 'Endnu ikke bygget',
      range: [100, 900] as const,
    }
    expect(() => countingCurriculumProgress(planned)).toThrow(planned.path)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import {
  countingCurriculumProgress,
  countingCurriculumProgressLine,
} from './countingCurriculum'
import { countingLesson, countingCurriculum } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { countingThousandsLesson } from '../lessons/countingThousands'
import { markCountingDone } from './counting'
import {
  counting21to99Progress,
  counting100to900Progress,
  countingThousandsProgress,
} from './countingRules'

/** The foundation counts *word* ids, so a digit id would tick nothing. */
const foundationWordId = countingLesson.numbers[0].word.id
const ruleId = counting21to99Progress.ids[0]
const hundredsId = counting100to900Progress.ids[0]
const thousandsId = countingThousandsProgress.ids[0]

/**
 * What every lesson in the curriculum currently reports as done, in order.
 * Reading all four at once is how isolation is proved: a mark that leaked
 * into a neighbouring store would show up as a second non-zero here.
 */
function doneCounts(): number[] {
  return countingCurriculum.map((entry) => countingCurriculumProgress(entry).done)
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('counting curriculum progress — one adapter over all four lessons', () => {
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

  it('maps the thousands lesson to its own store and its own ids', () => {
    expect(countingCurriculumProgress(countingThousandsLesson)).toEqual({
      done: 0,
      total: countingThousandsProgress.ids.length,
      noun: 'dele',
    })
    countingThousandsProgress.markDone(thousandsId)
    expect(countingCurriculumProgress(countingThousandsLesson).done).toBe(1)
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
    expect(countingCurriculumProgress(countingThousandsLesson).total)
      .toBe(countingThousandsProgress.ids.length)
    // Two of the four stores happen to own the same number of ids — the
    // hundreds and the thousands are both 17 parts as currently drafted — so
    // equal totals cannot be ruled out by counting alone. What rules out one
    // shared total is that the id sets behind them are different sets and
    // share no id: an equal size here is a coincidence, not one store read
    // twice. The numbers themselves stay unwritten; only the relation is.
    const totals = countingCurriculum.map((e) => countingCurriculumProgress(e).total)
    expect(new Set(totals).size).toBeGreaterThan(1)
    expect(counting100to900Progress.ids).not.toEqual(countingThousandsProgress.ids)
    const shared = counting100to900Progress.ids
      .filter((id) => countingThousandsProgress.ids.includes(id))
    expect(shared).toEqual([])
  })

  it('writes the honest line every counting screen already uses', () => {
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`0 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`0 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(counting100to900Lesson))
      .toBe(`0 af ${counting100to900Progress.ids.length} dele gennemgået eller øvet`)
    expect(countingCurriculumProgressLine(countingThousandsLesson))
      .toBe(`0 af ${countingThousandsProgress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps the stores apart: learning the foundation moves only its own line', () => {
    markCountingDone(foundationWordId)
    expect(doneCounts()).toEqual([1, 0, 0, 0])
    expect(countingCurriculumProgressLine(countingLesson))
      .toBe(`1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`)
  })

  it('keeps them apart when the rule lesson moves', () => {
    counting21to99Progress.markDone(ruleId)
    expect(doneCounts()).toEqual([0, 1, 0, 0])
    expect(countingCurriculumProgressLine(counting21to99Lesson))
      .toBe(`1 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps them apart when the hundreds lesson moves', () => {
    counting100to900Progress.markDone(hundredsId)
    expect(doneCounts()).toEqual([0, 0, 1, 0])
    expect(countingCurriculumProgressLine(counting100to900Lesson))
      .toBe(`1 af ${counting100to900Progress.ids.length} dele gennemgået eller øvet`)
  })

  it('keeps them apart when the thousands lesson moves', () => {
    countingThousandsProgress.markDone(thousandsId)
    expect(doneCounts()).toEqual([0, 0, 0, 1])
    expect(countingCurriculumProgressLine(countingThousandsLesson))
      .toBe(`1 af ${countingThousandsProgress.ids.length} dele gennemgået eller øvet`)
  })

  it('answers for every one of the four entries the curriculum lists', () => {
    expect(countingCurriculum).toHaveLength(4)
    for (const entry of countingCurriculum) {
      expect(() => countingCurriculumProgressLine(entry), entry.path).not.toThrow()
    }
  })
})

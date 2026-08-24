import { describe, it, expect, beforeEach } from 'vitest'
import {
  countingCurriculumProgress,
  countingCurriculumProgressLine,
} from './countingCurriculum'
import { countingLesson, countingCurriculum } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { countingThousandsLesson } from '../lessons/countingThousands'
import { counting100to900Progress, countingThousandsProgress } from './countingRules'

const hundredsId = counting100to900Progress.ids[0]
const thousandsId = countingThousandsProgress.ids[0]

beforeEach(() => {
  window.localStorage.clear()
})

describe('counting curriculum progress — who the adapter refuses', () => {
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

  it('refuses a look-alike of the thousands lesson, the last and newest one', () => {
    // Lesson 4 is the one a caller is likeliest to rebuild by hand — it is the
    // newest, and a screen that spread its fields into a fresh object would
    // still carry the right route, title and range. Identity is what decides:
    // the clone gets no store, not even after the real lesson has progress.
    const lookAlike = { ...countingThousandsLesson }
    expect(lookAlike.path).toBe(countingThousandsLesson.path)
    expect(lookAlike.range).toEqual(countingThousandsLesson.range)
    expect(lookAlike).not.toBe(countingThousandsLesson)
    countingThousandsProgress.markDone(thousandsId)
    expect(countingCurriculumProgress(countingThousandsLesson).done).toBe(1)
    expect(() => countingCurriculumProgress(lookAlike))
      .toThrow(countingThousandsLesson.path)
    expect(() => countingCurriculumProgressLine(lookAlike))
      .toThrow(countingThousandsLesson.path)
  })

  it('fails loudly for a descriptor no store is wired to', () => {
    // Every lesson the curriculum names now has a store, so the stranger has
    // to be a genuinely fifth one: a ti-tusinder lesson beyond the curriculum's
    // 9.999 ceiling. Reporting zero of zero for it would read on screen as
    // "nothing learned yet" about a lesson that cannot be learned at all.
    const planned = {
      path: '/lesson/taelle/titusinder',
      title: 'Regnereglen ti-tusinder',
      summary: 'Endnu ikke bygget',
      range: [10000, 99999] as const,
    }
    expect(countingCurriculum.every((e) => e.path !== planned.path)).toBe(true)
    expect(() => countingCurriculumProgress(planned)).toThrow(planned.path)
    expect(() => countingCurriculumProgressLine(planned)).toThrow(planned.path)
  })
})

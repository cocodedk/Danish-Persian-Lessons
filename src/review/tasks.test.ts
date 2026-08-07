import { beforeEach, describe, expect, it } from 'vitest'
import { resetMemoryCache } from '../progress/storage'
import { introduceForReview, recordReview } from './scheduler'
import { reviewSessionTasks } from './tasks'
import { dueReviewQuestions } from './tasks'

const at = (day: string) => new Date(`${day}T12:00:00`)

describe('review session composition', () => {
  beforeEach(() => {
    localStorage.clear()
    resetMemoryCache()
  })

  it('models at most four new items in curriculum order', () => {
    const tasks = reviewSessionTasks(at('2026-08-06'))

    expect(tasks).toHaveLength(4)
    expect(tasks.map((task) => task.mode)).toEqual(['new', 'new', 'new', 'new'])
    expect(tasks.map((task) => task.question.entry.id)).toEqual([
      'alphabet-alef-madde',
      'alphabet-letter-alef',
      'alphabet-letter-be',
      'alphabet-letter-dal',
    ])
    expect(tasks.every((task) => task.question.itemId === task.question.entry.id)).toBe(true)
  })

  it('puts eight due items before four new items and stays within twelve tasks', () => {
    const first = reviewSessionTasks(at('2026-08-06'))
    for (const task of first) introduceForReview(task.question.entry.id, at('2026-08-06'))
    const second = reviewSessionTasks(at('2026-08-06'))
    for (const task of second.filter((task) => task.mode === 'new')) {
      introduceForReview(task.question.entry.id, at('2026-08-06'))
    }

    const tasks = reviewSessionTasks(at('2026-08-06'))
    expect(tasks).toHaveLength(12)
    expect(tasks.slice(0, 8).every((task) => task.mode === 'due')).toBe(true)
    expect(tasks.slice(8).every((task) => task.mode === 'new')).toBe(true)
  })

  it('offers a due-only session when the learner chooses only repetition', () => {
    introduceForReview('alphabet-letter-be', at('2026-08-06'))

    const tasks = reviewSessionTasks(at('2026-08-06'), { includeNew: false })
    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({ mode: 'due' })
    expect(tasks[0].question.entry.id).toBe('alphabet-letter-be')
  })

  it('uses an eligible connected reading as transfer instead of the final new item', () => {
    for (const id of ['vocabulary-1-ab', 'vocabulary-1-bad']) {
      introduceForReview(id, at('2026-08-05'))
      recordReview(id, 'correct', at('2026-08-05'))
    }

    const tasks = reviewSessionTasks(at('2026-08-06'))
    expect(tasks.at(-1)).toMatchObject({
      mode: 'transfer',
      question: { entry: { id: 'reading-1-1' } },
    })
    expect(tasks.filter((task) => task.mode === 'new')).toHaveLength(3)
  })

  it('does not transfer text whose source words were only exposed', () => {
    introduceForReview('vocabulary-1-ab', at('2026-08-06'))
    introduceForReview('vocabulary-1-bad', at('2026-08-06'))

    expect(reviewSessionTasks(at('2026-08-06')).some((task) => task.mode === 'transfer')).toBe(false)
  })

  it('alternates letter-form and vocabulary-direction retrieval across stages', () => {
    for (const id of ['alphabet-letter-be', 'vocabulary-1-ab']) {
      introduceForReview(id, at('2026-08-05'))
      recordReview(id, 'correct', at('2026-08-05'))
    }

    const ids = dueReviewQuestions(at('2026-08-06')).map((question) => question.id)
    expect(ids).toContain('match-be')
    expect(ids).toContain('par-1-ab')
  })

  it('interleaves due alphabet and vocabulary work when both are available', () => {
    for (const id of ['alphabet-letter-be', 'alphabet-letter-dal', 'vocabulary-1-ab', 'vocabulary-1-bad']) {
      introduceForReview(id, at('2026-08-06'))
    }

    const types = dueReviewQuestions(at('2026-08-06')).map((question) =>
      question.entry.kind === 'letter' ? 'letter' : 'word',
    )
    expect(types.slice(0, 4)).toEqual(['letter', 'word', 'letter', 'word'])
  })

  it('varies choice position reproducibly by local day', () => {
    introduceForReview('alphabet-letter-be', at('2026-08-06'))
    const slot = (day: string) => {
      const question = dueReviewQuestions(at(day))[0]
      return question.choices.findIndex((choice) => choice.id === question.answerId)
    }

    expect(slot('2026-08-06')).toBe(slot('2026-08-06'))
    expect(slot('2026-08-07')).not.toBe(slot('2026-08-06'))
  })
})

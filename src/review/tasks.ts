import { specimens, teachingOrder } from '../lessons/alphabet'
import { arrange, buildQuestions, type Question } from '../lessons/exercises'
import { connectedReadings, readingFunctionEntries } from '../lessons/connectedReading'
import type { PersianEntry } from '../catalog/types'
import { buildVocabQuestions } from '../lessons/vocabExercises'
import { vocabUnits } from '../lessons/vocab'
import { vowelMarks } from '../lessons/vowelMarks'
import {
  REVIEW_DUE_LIMIT,
  REVIEW_MAX_TASKS,
  dueReviewStates,
  reviewStates,
} from './scheduler'
import { reviewDay } from './days'

export type ReviewTaskMode = 'due' | 'new' | 'transfer'

export interface ReviewTask {
  mode: ReviewTaskMode
  question: Question
  supportEntries?: PersianEntry[]
}

const alefRoleQuestion: Question = {
  id: 'review-role-alef',
  itemId: specimens.alef.entry.id,
  entry: specimens.alef.entry,
  promptDa: 'Hvad gør alef i et ord?',
  showsFa: true,
  showsPron: false,
  choices: [
    { id: 'alef-role-carrier', entry: specimens.alef.entry, glyph: 'Det bærer eller skriver en vokal' },
    { id: 'alef-role-b', entry: specimens.be.entry, glyph: 'Det siger altid b' },
    { id: 'alef-role-d', entry: specimens.dal.entry, glyph: 'Det siger altid d' },
    { id: 'alef-role-madde', entry: specimens['alef-madde'].entry, glyph: 'Det har altid madde over sig' },
  ],
  answerId: 'alef-role-carrier',
  choiceLang: 'da',
}

const findQuestions = buildQuestions('find')
const matchQuestions = buildQuestions('match')
const alphabetQuestions = teachingOrder.map((id) => {
  if (id === 'alef') return alefRoleQuestion
  const entryId = specimens[id].entry.id
  return findQuestions.find((question) => question.entry.id === entryId)!
})

const vowelQuestions: Question[] = vowelMarks.map((mark, index) => {
  const others = [1, 2, 3].map((step) => vowelMarks[(index + step) % vowelMarks.length])
  return {
    id: `review-vowel-${mark.id}`,
    itemId: mark.entry.id,
    entry: mark.entry,
    promptDa: 'Hvilket vokaltegn har denne lyd?',
    choices: arrange(
      { id: mark.entry.id, entry: mark.entry, glyph: mark.entry.fa },
      others.map((other) => ({ id: other.entry.id, entry: other.entry, glyph: other.entry.fa })),
      index,
    ),
    answerId: mark.entry.id,
  }
})

const vocabularyQuestions = vocabUnits.flatMap((unit) => buildVocabQuestions(unit.id, 'ord'))
const vocabularyAlternate = vocabUnits.flatMap((unit) => buildVocabQuestions(unit.id, 'par'))
const learningQuestions = [...alphabetQuestions, ...vowelQuestions, ...vocabularyQuestions].map((question) => ({
  ...question,
  itemId: question.entry.id,
}))
const readingQuestions = connectedReadings.map((reading, index): Question => ({
  id: `review-${reading.id}`,
  itemId: reading.entry.id,
  entry: reading.entry,
  promptDa: reading.question.promptDa,
  showsFa: true,
  choices: arrange(
    { id: reading.question.answerDa, entry: reading.entry, glyph: reading.question.answerDa },
    reading.question.choicesDa
      .filter((choice) => choice !== reading.question.answerDa)
      .map((choice) => ({ id: choice, entry: reading.entry, glyph: choice })),
    index,
  ),
  answerId: reading.question.answerDa,
  choiceLang: 'da',
}))
const questions = [...learningQuestions, ...readingQuestions]
const alternateByEntryId = new Map(
  [...matchQuestions, ...vocabularyAlternate].map((question) => [question.entry.id, question]),
)

export function reviewQuestion(entryId: string, variant = 0): Question | undefined {
  const alternate = variant % 2 === 1 ? alternateByEntryId.get(entryId) : undefined
  const found = alternate ?? questions.find((question) => question.entry.id === entryId)
  return found ? { ...found, itemId: entryId } : undefined
}

function taskCategory(question: Question): 'alphabet' | 'vocabulary' | 'vowel' | 'reading' {
  if (question.entry.id.startsWith('alphabet-mark-')) return 'vowel'
  if (question.entry.id.startsWith('alphabet-')) return 'alphabet'
  if (question.entry.id.startsWith('vocabulary-')) return 'vocabulary'
  return 'reading'
}

function interleave(questions: Question[]): Question[] {
  const order = ['alphabet', 'vocabulary', 'vowel', 'reading'] as const
  const buckets = new Map(order.map((category) => [
    category,
    questions.filter((question) => taskCategory(question) === category),
  ]))
  const result: Question[] = []
  while (result.length < questions.length) {
    for (const category of order) {
      const next = buckets.get(category)!.shift()
      if (next) result.push(next)
    }
  }
  return result
}

function arrangeForDay(question: Question, day: string): Question {
  const offset = [...`${question.entry.id}:${day}`]
    .reduce((sum, glyph) => sum + glyph.codePointAt(0)!, 0) % question.choices.length
  return {
    ...question,
    choices: [...question.choices.slice(offset), ...question.choices.slice(0, offset)],
  }
}

export function dueReviewQuestions(now: Date = new Date()): Question[] {
  const states = dueReviewStates(now)
  const today = reviewDay(now) ?? '1970-01-01'
  const dueDays = [...new Set(states.map((state) => state.dueDay))]
  const questions = dueDays.flatMap((day) => interleave(
    states
      .filter((state) => state.dueDay === day)
      .map((state) => reviewQuestion(state.entryId, state.stage))
      .filter((question): question is Question => Boolean(question))
      .map((question) => arrangeForDay(question, today)),
  ))
  return questions.slice(0, REVIEW_DUE_LIMIT)
}

function eligibleTransfer(now: Date, knownIds: Set<string>): Question | undefined {
  const stateById = new Map(reviewStates(now).map((state) => [state.entryId, state]))
  const reading = connectedReadings.find((candidate) =>
    !knownIds.has(candidate.entry.id) &&
    !stateById.has(candidate.entry.id) &&
    candidate.introducedEntryIds.every((id) => (stateById.get(id)?.successfulRetrievals ?? 0) > 0),
  )
  return reading ? reviewQuestion(reading.entry.id) : undefined
}

export function reviewSessionTasks(
  now: Date = new Date(),
  { includeNew = true }: { includeNew?: boolean } = {},
): ReviewTask[] {
  const due = dueReviewQuestions(now).map((question): ReviewTask => ({ mode: 'due', question }))
  if (!includeNew) return due

  const knownIds = new Set(reviewStates(now).map((state) => state.entryId))
  const capacity = REVIEW_MAX_TASKS - due.length
  const fresh = learningQuestions
    .filter((question) => !knownIds.has(question.entry.id))
    .slice(0, Math.min(4, capacity))
    .map((question): ReviewTask => ({ mode: 'new', question }))
  const transfer = eligibleTransfer(now, knownIds)
  if (transfer && capacity > 0) {
    const reading = connectedReadings.find((candidate) => candidate.entry.id === transfer.entry.id)!
    const supportEntries = reading.taughtEntryIds.map((id) => readingFunctionEntries.find((entry) => entry.id === id)!)
    const transferTask: ReviewTask = { mode: 'transfer', question: transfer, supportEntries }
    if (fresh.length > 0) fresh.splice(fresh.length - 1, 1, transferTask)
    else fresh.push(transferTask)
  }
  return [...due, ...fresh].slice(0, REVIEW_MAX_TASKS)
}

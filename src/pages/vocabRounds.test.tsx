// What finishing a unit pays, and how the two exercise rounds play: Danish
// meanings for "Find betydningen", Persian words for "Find ordet", and the
// same flat per-answer rate a letter's exercise pays on a replay. The
// forside, routing and the word screen itself are vocab.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { getRewards } from '../rewards/engine'
import { getVocabProgress } from '../progress/vocab'
import { buildVocabQuestions } from '../lessons/vocabExercises'
import { freshVocabState, open, clearWholeUnit, praiseOnScreen } from './vocabHarness'

freshVocabState()

describe('finishing a unit', () => {
  it('fills a notebook page — once, no matter how often the unit is finished again', () => {
    clearWholeUnit('1')
    const afterFirst = getRewards()
    expect(getVocabProgress('1').paid).toBe(true)
    expect(afterFirst.points % 20).toBe(0)
    expect(afterFirst.level).toBeGreaterThan(1)

    // A reload, then every word tapped again: the ticks are already there, so
    // there is nothing left to pay for.
    clearWholeUnit('1')
    expect(getRewards().points).toBe(afterFirst.points)
    expect(getRewards().level).toBe(afterFirst.level)
  })

  it('replays the exercise round at one point per answer, not two — never twice the letters\' rate', () => {
    clearWholeUnit('1')
    expect(getVocabProgress('1').paid).toBe(true)

    const questions = buildVocabQuestions('1', 'ord')
    open('#/lesson/ord/1/ovelse/ord')

    for (const [index, question] of questions.entries()) {
      const before = getRewards().points
      const right = question.choices.find((choice) => choice.id === question.answerId)!
      fireEvent.click(
        screen.getAllByRole('button').find((each) => each.textContent === right.glyph)!,
      )
      // Every word here was already learned by clearWholeUnit above, so this
      // replayed tap is worth exactly one point — the flat rate a letter's
      // exercise pays — never the two-point item rate.
      expect(getRewards().points, question.id).toBe(before + 1)
      const isLast = index === questions.length - 1
      fireEvent.click(screen.getByRole('button', { name: isLast ? 'Afslut runden' : 'Næste' }))
    }
    // Whatever the round's own closing page event adds on top, the total
    // never falls — generosity rule 1 holds through a replay too.
    expect(getRewards().points).toBeGreaterThanOrEqual(questions.length)
  })
})

describe('the two rounds', () => {
  it('asks for the Danish meaning, in Danish, and celebrates a right tap', () => {
    const questions = buildVocabQuestions('1', 'ord')
    open('#/lesson/ord/1/ovelse/ord')

    expect(screen.getByRole('heading', { name: 'Find betydningen' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hvad betyder ordet?' })).toBeInTheDocument()
    const right = questions[0].choices.find((choice) => choice.id === questions[0].answerId)!
    const button = screen.getAllByRole('button').find((each) => each.textContent === right.glyph)!
    expect(button.getAttribute('lang')).toBe('da')
    fireEvent.click(button)

    expect(praiseOnScreen()).toBe(true)
    expect(getVocabProgress('1').words).toContain(questions[0].answerId)
  })

  it('asks for the Persian word, right to left, with the meaning in the prompt', () => {
    const questions = buildVocabQuestions('2', 'par')
    open('#/lesson/ord/2/ovelse/par')

    expect(screen.getByRole('heading', { name: questions[0].promptDa })).toBeInTheDocument()
    const right = questions[0].choices.find((choice) => choice.id === questions[0].answerId)!
    const button = screen.getAllByRole('button').find((each) => each.textContent === right.glyph)!
    expect(button.getAttribute('dir')).toBe('rtl')
  })

  it('keeps the gentle wrong-answer copy and takes nothing away', () => {
    const questions = buildVocabQuestions('1', 'ord')
    open('#/lesson/ord/1/ovelse/ord')
    const wrong = questions[0].choices.find((choice) => choice.id !== questions[0].answerId)!
    fireEvent.click(screen.getAllByRole('button').find((each) => each.textContent === wrong.glyph)!)

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(getRewards().points).toBe(0)
  })

  it('sends an unknown round back to the forside', () => {
    open('#/lesson/ord/1/ovelse/hop')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

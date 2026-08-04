import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen } from '../progress/alphabet'
import { getRewards } from '../rewards/engine'
import { getVocabProgress } from '../progress/vocab'
import { vocabUnits, findVocabUnit } from '../lessons/vocab'
import { buildVocabQuestions } from '../lessons/vocabExercises'
import { PRAISE } from '../rewards/copy'

const unit = findVocabUnit('1')!

function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

function praiseOnScreen(): boolean {
  return PRAISE.some((line) => screen.queryAllByText(line.fa).length > 0)
}

/** Walks a unit's word screens and taps "Jeg kan det" on every one of them. */
function clearWholeUnit(unitId: string) {
  for (const word of findVocabUnit(unitId)!.words) {
    const view = open(`#/lesson/ord/${unitId}/${word.id}`)
    const button = screen.queryByRole('button', { name: 'Jeg kan det' })
    if (button) fireEvent.click(button)
    view.unmount()
  }
}

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
  setProfile({})
  markOrientationSeen()
})

describe('the forside lists the word units', () => {
  it('shows all three, with their own progress, and links straight into them', () => {
    open('#/')
    for (const each of vocabUnits) {
      const card = screen.getByRole('link', { name: new RegExp(each.title) })
      expect(card).toHaveAttribute('href', `#/lesson/ord/${each.id}`)
      expect(
        within(card).getByText(`0 af ${each.words.length} ord klaret`),
      ).toBeInTheDocument()
    }
  })

  it('counts a cleared word on the forside', () => {
    const word = open(`#/lesson/ord/1/${unit.words[0].id}`)
    fireEvent.click(screen.getByRole('button', { name: 'Jeg kan det' }))
    word.unmount()

    open('#/')
    const card = screen.getByRole('link', { name: new RegExp(unit.title) })
    expect(within(card).getByText(`1 af ${unit.words.length} ord klaret`)).toBeInTheDocument()
  })
})

describe('any unit, any word, any time', () => {
  it('opens unit ۳ with nothing cleared anywhere — no lesson is ever locked', () => {
    open('#/lesson/ord/3')
    const third = findVocabUnit('3')!
    expect(screen.getByRole('heading', { name: third.title })).toBeInTheDocument()
    expect(screen.getByText(third.titleFa)).toBeInTheDocument()
    for (const word of third.words) {
      expect(screen.getByText(word.fa)).toBeInTheDocument()
    }
  })

  it('sends a URL that names no unit back to the forside instead of erroring', () => {
    open('#/lesson/ord/9')
    expect(screen.getByText('Lektioner')).toBeInTheDocument()
  })
})

describe('a word screen', () => {
  it('is the split card: the vocalized specimen, the sound twice, the Danish meaning', () => {
    const { container } = open('#/lesson/ord/2/madrese')
    const word = findVocabUnit('2')!.words.find((candidate) => candidate.id === 'madrese')!

    const faPane = container.querySelector('.split-card__pane--fa')
    expect(faPane?.textContent).toContain(word.faMarked)
    expect(screen.getByText(`${word.pron.da} · [${word.pron.ipa}]`)).toBeInTheDocument()
    expect(screen.getByText(word.da)).toBeInTheDocument()
    // The specimen is Persian and runs right to left.
    expect(faPane?.getAttribute('dir')).toBe('rtl')
  })

  it('marks the vowel signs with the teacher\'s red pen, on the specimen only', () => {
    const { container } = open('#/lesson/ord/2/madrese')
    // مَدرِسه is marked above AND below: the red layer carries both.
    expect(container.querySelector('.fa-specimen__marks')?.textContent).toBe('مَدرِسه')
    expect(container.querySelector('.fa-specimen__ink')?.textContent).toBe('مدرسه')
    expect(container.querySelectorAll('.pron-line .fa-specimen__marks')).toHaveLength(0)
    expect(container.querySelector('.da-word')?.className).not.toContain('pen-mark')
  })

  it('ticks the word off and celebrates, and says so again on the next visit', () => {
    const first = open(`#/lesson/ord/1/${unit.words[0].id}`)
    fireEvent.click(screen.getByRole('button', { name: 'Jeg kan det' }))
    expect(praiseOnScreen()).toBe(true)
    expect(getRewards().points).toBe(2)
    first.unmount()

    open(`#/lesson/ord/1/${unit.words[0].id}`)
    expect(screen.queryByRole('button', { name: 'Jeg kan det' })).not.toBeInTheDocument()
    expect(screen.getByText('Klaret')).toBeInTheDocument()
  })

  it('says nothing about the learner\'s name when there is no name', () => {
    open('#/lesson/ord/1/baba')
    expect(screen.queryByText(/i dit navn/i)).not.toBeInTheDocument()
  })

  it('notes the letters a word shares with the learner\'s own name, warmly', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/ord/1/baba')
    expect(screen.getByText('حرفی از نامِ تو در این کلمه هست')).toBeInTheDocument()
    expect(screen.getByText(/Ét af bogstaverne her/)).toBeInTheDocument()
  })
})

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

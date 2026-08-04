import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChoiceExercise } from './ChoiceExercise'
import { buildQuestions } from '../lessons/exercises'
import { buildVocabQuestions } from '../lessons/vocabExercises'

const questions = buildQuestions('find').slice(0, 2)
const vocabOrdQuestions = buildVocabQuestions('2', 'ord')

function vocabQuestion(itemId: string) {
  return vocabOrdQuestions.find((q) => q.itemId === itemId)!
}

function renderExercise() {
  const onCorrect = vi.fn()
  const onComplete = vi.fn()
  render(
    <ChoiceExercise questions={questions} onCorrect={onCorrect} onComplete={onComplete} />,
  )
  return { onCorrect, onComplete }
}

function wrongChoice(index: number): string {
  return questions[index].choices.find((c) => c.id !== questions[index].answerId)!.glyph
}

function rightChoice(index: number): string {
  return questions[index].choices.find((c) => c.id === questions[index].answerId)!.glyph
}

describe('ChoiceExercise', () => {
  it('says the prompt twice — dansk lydskrift and IPA — and counts the round', () => {
    renderExercise()
    expect(screen.getByText('Spørgsmål 1 af 2')).toBeInTheDocument()
    const { da, ipa } = questions[0].sound
    expect(screen.getByText(`${da} · [${ipa}]`)).toBeInTheDocument()
  })

  it('answers a wrong tap with «دوباره», keeps every choice open and takes nothing away', () => {
    const { onCorrect } = renderExercise()
    fireEvent.click(screen.getByText(wrongChoice(0)))

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText('— prøv igen. Du mister ingenting.')).toBeInTheDocument()
    expect(onCorrect).not.toHaveBeenCalled()
    // Still question one, and still answerable.
    expect(screen.getByText('Spørgsmål 1 af 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText(rightChoice(0)))
    expect(onCorrect).toHaveBeenCalledWith(questions[0].itemId)
  })

  it('praises a right tap and only then offers the next question', () => {
    renderExercise()
    expect(screen.queryByText('Næste')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText(rightChoice(0)))
    expect(screen.getByText('آفرین')).toBeInTheDocument()
    expect(screen.getByLabelText('Rigtigt')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Næste'))
    expect(screen.getByText('Spørgsmål 2 af 2')).toBeInTheDocument()
  })

  it('grants a letter once, however many taps it took', () => {
    const { onCorrect } = renderExercise()
    fireEvent.click(screen.getByText(rightChoice(0)))
    fireEvent.click(screen.getByText(rightChoice(0)))
    expect(onCorrect).toHaveBeenCalledTimes(1)
  })

  it('leaves plan 007 a plain onComplete seam at the end of the round', () => {
    const { onComplete } = renderExercise()
    fireEvent.click(screen.getByText(rightChoice(0)))
    fireEvent.click(screen.getByText('Næste'))
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText(rightChoice(1)))
    fireEvent.click(screen.getByText('Afslut runden'))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Du kom hele runden igennem/)).toBeInTheDocument()
  })

  it('draws a vocab prompt marked above and below as a two-layer specimen, both marks red', () => {
    // مَدرِسه: a زبر over the م and a زیر under the ر — the single gradient
    // cut can only ever colour one of the two (plan 004's "Note on the red
    // pen"). The exercise prompt must stack them exactly like the word screen.
    const { container } = render(
      <ChoiceExercise
        questions={[vocabQuestion('madrese')]}
        onCorrect={vi.fn()}
        onComplete={vi.fn()}
      />,
    )
    expect(container.querySelector('.fa-specimen--vocalized')).not.toBeNull()
    expect(container.querySelector('.fa-specimen__marks')?.textContent).toBe('مَدرِسه')
    expect(container.querySelector('.fa-specimen__ink')?.textContent).toBe('مدرسه')
  })

  it('stacks a below-only mark too, never falling back to the single-layer pen class', () => {
    // کِتاب carries only a زیر under the ک. FaSpecimen stacks any word whose
    // faMarked is fa plus اِعراب, regardless of which side the marks sit on —
    // so this specimen must never carry a `pen-mark--*` class anywhere.
    const { container } = render(
      <ChoiceExercise
        questions={[vocabQuestion('ketab')]}
        onCorrect={vi.fn()}
        onComplete={vi.fn()}
      />,
    )
    expect(container.querySelector('.fa-specimen--vocalized')).not.toBeNull()
    expect(container.querySelector('.fa-specimen__marks')?.textContent).toBe('کِتاب')
    expect(container.querySelector('.fa-specimen__ink')?.textContent).toBe('کتاب')
    expect(container.querySelector('[class*="pen-mark--"]')).toBeNull()
  })
})

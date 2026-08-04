import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChoiceExercise } from './ChoiceExercise'
import { buildQuestions } from '../lessons/exercises'

const questions = buildQuestions('find').slice(0, 2)

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
})

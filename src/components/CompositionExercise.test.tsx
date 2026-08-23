import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompositionExercise } from './CompositionExercise'
import { buildRuleBuildQuestions } from '../lessons/countingRuleExercises'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { defineEntry, type PersianEntry } from '../catalog/types'
import type { BuildQuestion } from '../lessons/countingRuleTypes'

// The `byg` round as the learner meets it. Every Persian form named here is
// either the lesson's own candidate draft or a test stand-in: these tests
// check the assembly interaction, never whether a form is approved.

const questions = buildRuleBuildQuestions(counting21to99Lesson).slice(0, 2)

function renderExercise(rounds: BuildQuestion[] = questions) {
  const onCorrect = vi.fn()
  const onComplete = vi.fn()
  const view = render(
    <CompositionExercise questions={rounds} onCorrect={onCorrect} onComplete={onComplete} />,
  )
  return { onCorrect, onComplete, ...view }
}

/** Pool buttons render in `tokens` order, so an index is a token. */
function pool(): HTMLElement[] {
  return screen
    .getAllByRole('button')
    .filter((button) => button.classList.contains('choice-exercise__choice'))
}

function tap(...tokenIndexes: number[]) {
  for (const index of tokenIndexes) fireEvent.click(pool()[index])
}

/** The token indexes that spell the answer, one occurrence per part. */
function solutionOf(question: BuildQuestion): number[] {
  const spent = new Set<string>()
  return question.parts.map((part) => {
    const token = question.tokens.find((t) => t.entryId === part.id && !spent.has(t.id))!
    spent.add(token.id)
    return question.tokens.indexOf(token)
  })
}

function assembly(): string[] {
  return [...document.querySelectorAll('ol.choice-exercise__choices > li')].map(
    (item) => item.textContent ?? '',
  )
}

function solve(question: BuildQuestion) {
  tap(...solutionOf(question))
  fireEvent.click(screen.getByText('Tjek tallet'))
}

describe('CompositionExercise', () => {
  it('shows the Danish prompt and the parts, and leaks no answer before a check', () => {
    const { container } = renderExercise()
    const question = questions[0]
    expect(screen.getByRole('heading', { name: question.promptDa })).toBeInTheDocument()
    expect(screen.getByText('Opgave 1 af 2')).toBeInTheDocument()
    expect(screen.queryByText('Se hele tegnet eller ordet')).not.toBeInTheDocument()

    const secrets = [question.entry, ...question.parts]
      .flatMap((row) => [row.fa, row.faMarked, row.pron.da, row.pron.ipa, row.da])
      .filter((secret): secret is string => Boolean(secret))
      // A part's own glyph is what the token prints; only its help is secret.
      .filter((secret) => !question.tokens.some((token) => token.glyph === secret))
    for (const secret of secrets) {
      expect(screen.queryByText(secret), secret).toBeNull()
      expect(screen.queryByLabelText(secret), secret).toBeNull()
    }
    expect(container.querySelector('[data-entry-id]')).toBeNull()
    // Nothing is laid out yet, so no check is offered either.
    expect(screen.queryByText('Tjek tallet')).toBeNull()
  })

  it('lays the chosen parts out in tap order and offers the check only when full', () => {
    renderExercise()
    const [first, second, third] = solutionOf(questions[0])
    tap(third, first)
    expect(assembly()).toEqual([questions[0].tokens[third].glyph, questions[0].tokens[first].glyph])
    expect(screen.queryByText('Tjek tallet')).toBeNull()
    tap(second)
    expect(assembly()).toHaveLength(3)
    expect(screen.getByText('Tjek tallet')).toBeInTheDocument()
  })

  it('lets a part be taken back without cost', () => {
    renderExercise()
    const [first, second] = solutionOf(questions[0])
    tap(first, second)
    expect(pool()[first]).toHaveAttribute('aria-pressed', 'true')
    tap(first)
    expect(assembly()).toEqual([questions[0].tokens[second].glyph])
    expect(pool()[first]).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByText('Se hele tegnet eller ordet')).toBeNull()
  })

  it('reveals the whole number after a wrong build, takes nothing, and clears on retry', async () => {
    const { onCorrect, onComplete } = renderExercise()
    tap(...[...solutionOf(questions[0])].reverse())
    fireEvent.click(screen.getByText('Tjek tallet'))

    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText('Se hele tegnet eller ordet')).toBeInTheDocument()
    expect(onCorrect).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByText('Opgave 1 af 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Prøv én gang til'))
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: questions[0].promptDa })).toHaveFocus(),
    )
    expect(assembly()).toEqual([])
    solve(questions[0])
    expect(onCorrect).toHaveBeenCalledTimes(1)
    expect(onCorrect).toHaveBeenCalledWith(questions[0].itemId)
  })

  it('praises a right build once and only then offers the next number', () => {
    const { onCorrect } = renderExercise()
    solve(questions[0])
    expect(onCorrect).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('img', { name: 'Rigtigt' })).toBeInTheDocument()
    expect(screen.getByText('Se hele tegnet eller ordet')).toBeInTheDocument()
    expect(screen.queryByText('Prøv én gang til')).toBeNull()
    // A further tap after the check cannot change the outcome.
    tap(0)
    expect(onCorrect).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('Næste'))
    expect(screen.getByText('Opgave 2 af 2')).toBeInTheDocument()
    expect(assembly()).toEqual([])
  })

  it('finishes the last number, celebrating and paying the round once', () => {
    const { onComplete } = renderExercise()
    solve(questions[0])
    fireEvent.click(screen.getByText('Næste'))
    solve(questions[1])
    fireEvent.click(screen.getByText('Afslut runden'))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('img', { name: 'Runden er klaret' })).toBeInTheDocument()
  })

  it('spends each occurrence of a repeated part once', () => {
    const { onCorrect } = renderExercise([repeatedQuestion])
    const [joinerA, joinerB] = [3, 4]
    expect(repeatedQuestion.tokens[joinerA].entryId).toBe(repeatedQuestion.tokens[joinerB].entryId)
    tap(joinerA, joinerA)
    expect(assembly()).toEqual([])
    solve(repeatedQuestion)
    expect(onCorrect).toHaveBeenCalledWith(repeatedQuestion.itemId)
  })

  it('says so quietly when there is nothing to build, and pays nothing', () => {
    const { onCorrect, onComplete } = renderExercise([])
    expect(screen.getByText('Der er ingen tal at bygge her lige nu.')).toBeInTheDocument()
    expect(onCorrect).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// A stand-in for the longer chains lessons 3 and 4 compose, where the joining
// element is said twice in one number.
function entry(id: string, fa: string, da: string): PersianEntry {
  return defineEntry({ id, kind: 'word', fa, da, pron: { da, ipa: da } })
}

const hundred = entry('synth-base-100', 'صد', 'hundrede')
const joiner = entry('synth-bindeled', 'و', 'og')
const unit = entry('synth-enter-1', 'یک', 'en')

const repeatedQuestion: BuildQuestion = {
  id: 'byg-synth-111',
  itemId: 'synth-tal-111',
  entry: entry('synth-tal-111', 'صد و یک و یک', 'hundrede og en og en'),
  promptDa: 'Byg tallet 111',
  targetValue: 111,
  parts: [hundred, joiner, unit, joiner, unit],
  tokens: [hundred, unit, unit, joiner, joiner].map((row, occurrence) => ({
    id: `byg-synth-111--${row.id}--${occurrence}`,
    entryId: row.id,
    entry: row,
    glyph: row.fa,
  })),
}

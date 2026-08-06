import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { defineEntry } from '../catalog/types'
import type { Question } from '../lessons/exercises'
import { resetMemoryCache } from '../progress/storage'
import { reviewStates } from '../review/scheduler'
import type { ReviewTask } from '../review/tasks'
import { ReviewSession } from './ReviewSession'

const entry = defineEntry({
  id: 'fixture-review-entry',
  kind: 'word',
  fa: 'آب',
  da: 'vand',
  pron: { da: 'åb', ipa: 'ɒːb' },
})

function question(index: number): Question {
  return {
    id: `q${index}`,
    itemId: `fixture-${index}`,
    entry,
    promptDa: `Opgave ${index}`,
    choices: [
      { id: `right-${index}`, entry, glyph: `Rigtigt ${index}` },
      { id: `wrong-${index}`, entry, glyph: `Forkert ${index}` },
    ],
    answerId: `right-${index}`,
    choiceLang: 'da',
  }
}

function dueTask(index: number): ReviewTask {
  return { mode: 'due', question: question(index) }
}

describe('short review session', () => {
  beforeEach(() => {
    localStorage.clear()
    resetMemoryCache()
  })

  it('requeues an error only after two different tasks', () => {
    render(<ReviewSession initialTasks={[dueTask(1), dueTask(2), dueTask(3)]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Forkert 1' }))
    expect(screen.getByText(/kommer igen efter noget andet/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Fortsæt' }))
    fireEvent.click(screen.getByRole('button', { name: 'Rigtigt 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fortsæt' }))
    fireEvent.click(screen.getByRole('button', { name: 'Rigtigt 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fortsæt' }))
    expect(screen.getByRole('heading', { name: 'Opgave 1' })).toBeInTheDocument()
  })

  it('models and guides a new item before retrieval', () => {
    const newQuestion = { ...question(1), itemId: entry.id }
    render(<ReviewSession initialTasks={[{ mode: 'new', question: newQuestion }]} />)

    expect(screen.getByRole('heading', { name: 'Nyt ord: vand' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Opgave 1' })).not.toBeInTheDocument()
    expect(reviewStates()).toEqual([])

    fireEvent.click(screen.getByRole('button', { name: 'Øv med hjælp' }))
    fireEvent.click(screen.getByRole('button', { name: /Peg på svaret med hjælp/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Prøv uden hjælp' }))

    expect(screen.getByRole('heading', { name: 'Opgave 1' })).toBeInTheDocument()
    expect(reviewStates().map((state) => state.entryId)).toEqual([entry.id])
  })

  it('offers a clear stop after a completed task and reports the session evidence', () => {
    render(<ReviewSession initialTasks={[dueTask(1), dueTask(2)]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Rigtigt 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Stop for i dag' }))

    expect(screen.getByRole('heading', { name: 'Dagens repetition er færdig' })).toBeInTheDocument()
    expect(screen.getByText('1 husket i denne session.')).toBeInTheDocument()
  })

  it('lets a learner retry a wrong answer and returns focus to the prompt', async () => {
    render(<ReviewSession initialTasks={[dueTask(1), dueTask(2), dueTask(3)]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Forkert 1' }))
    expect(screen.getByRole('button', { name: 'Prøv igen nu' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Prøv igen nu' }))
    const prompt = screen.getByRole('heading', { name: 'Opgave 1' })
    await waitFor(() => expect(prompt).toHaveFocus())
    expect(screen.queryByText('Valgt')).not.toBeInTheDocument()
  })
})

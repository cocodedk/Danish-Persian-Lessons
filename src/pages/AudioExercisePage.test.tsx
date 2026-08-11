import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AudioExercisePage from './AudioExercisePage'

vi.mock('../components/AudioControl', () => ({
  AudioControl: ({ source, onPlay }: {
    source: { transcript: string }
    onPlay?: () => void
  }) => (
    <button type="button" aria-label={`Hør ${source.transcript}`} onClick={onPlay}>Hør</button>
  ),
}))

describe('sound exercise', () => {
  beforeEach(() => localStorage.clear())

  it('lets a learner hear, say, save, and filter all 97 checked sounds', () => {
    render(
      <MemoryRouter>
        <AudioExercisePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Øv persisk lyd' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Hør / })).toHaveLength(97)

    fireEvent.click(screen.getAllByRole('button', { name: /^Hør / })[0])
    fireEvent.click(screen.getAllByRole('button', { name: 'Jeg har sagt det' })[0])
    expect(localStorage.getItem('dpl.audio-exercise.v1')).toContain('"done"')

    fireEvent.change(screen.getByLabelText('Vis'), { target: { value: 'done' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Sagt højt ✓' })).toHaveAttribute('aria-pressed', 'true')
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { findPronunciationAudio } from '../audio/manifest'
import { audioReviewRows } from '../audio/review'
import AudioReviewPage from './AudioReviewPage'

vi.mock('../components/AudioControl', () => ({
  AudioControl: ({ source }: { source: { transcript: string } }) => (
    <button type="button" aria-label={`Hør ${source.transcript}`}>Hør</button>
  ),
}))

describe('online audio review', () => {
  beforeEach(() => localStorage.clear())

  it('renders the current review manifest and records answers', () => {
    render(
      <MemoryRouter>
        <AudioReviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Tjek persisk lyd' })).toBeInTheDocument()
    const allReleased = audioReviewRows.every((row) => {
      const audio = findPronunciationAudio(row.clipId)
      return audio?.source === 'piper' && audio.sourceTextHash === row.sourceTextHash
    })
    expect(screen.getByText(allReleased ? 'Lydtjek er færdigt' : 'Ikke klar til elever'))
      .toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Hør / })).toHaveLength(audioReviewRows.length)

    const goodButtons = screen.getAllByRole('button', { name: 'God' })
    fireEvent.click(goodButtons[0])
    expect(goodButtons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('dpl.audio-review.v1')).toContain('"mark":"good"')

    fireEvent.change(screen.getByLabelText('Vis'), { target: { value: 'good' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})

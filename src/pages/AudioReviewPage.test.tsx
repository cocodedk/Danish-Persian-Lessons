import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AudioReviewPage from './AudioReviewPage'

vi.mock('../components/AudioControl', () => ({
  AudioControl: ({ source }: { source: { transcript: string } }) => (
    <button type="button" aria-label={`Hør ${source.transcript}`}>Hør</button>
  ),
}))

describe('online audio review', () => {
  beforeEach(() => localStorage.clear())

  it('keeps the 97-card phone review after the sounds are approved', () => {
    render(
      <MemoryRouter>
        <AudioReviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Tjek persisk lyd' })).toBeInTheDocument()
    expect(screen.getByText('Lydtjek er færdigt')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Hør / })).toHaveLength(97)

    const goodButtons = screen.getAllByRole('button', { name: 'God' })
    fireEvent.click(goodButtons[0])
    expect(goodButtons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('dpl.audio-review.v1')).toContain('"mark":"good"')

    fireEvent.change(screen.getByLabelText('Vis'), { target: { value: 'good' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})

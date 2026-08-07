import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioControl } from './AudioControl'

vi.mock('../audio/manifest', () => ({
  findPronunciationAudio: (id?: string) => id ? {
    entryId: id,
    file: `/audio/${id}.mp3`,
    locale: 'fa-IR',
    transcript: 'آب',
  } : undefined,
}))

describe('pronunciation audio controls', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it('never autoplays and offers replay, stop, both speeds, and mute', async () => {
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!
    expect(audio).toHaveAttribute('preload', 'none')
    expect(audio).not.toHaveAttribute('autoplay')

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))
    fireEvent.click(screen.getByRole('button', { name: 'Afspil udtale af آب' }))
    expect(await screen.findByRole('button', { name: 'Stop udtale af آب' })).toBeEnabled()
    expect(audio.playbackRate).toBe(0.8)

    fireEvent.click(screen.getByRole('button', { name: 'Slå udtalelyd fra' }))
    expect(audio.muted).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Stop udtale af آب' }))
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it('stops the previous clip before another starts', async () => {
    render(<><AudioControl audioId="one" /><AudioControl audioId="two" /></>)
    const play = screen.getAllByRole('button', { name: 'Afspil udtale af آب' })
    fireEvent.click(play[0])
    await screen.findAllByText('Afspiller')
    fireEvent.click(play[1])
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1)
  })

  it('stays usable when playback fails', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('missing'))
    render(<AudioControl audioId="word-ab" />)
    fireEvent.click(screen.getByRole('button', { name: 'Afspil udtale af آب' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Du kan stadig læse hjælpen')
  })
})

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
  pronunciationAudioUrl: (file: string) => `/Danish-Persian-Lessons/app/${file.replace(/^\//, '')}`,
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
    expect(audio).toHaveAttribute('src', '/Danish-Persian-Lessons/app/audio/word-ab.mp3')
    expect(audio).not.toHaveAttribute('autoplay')

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hør آب' }))
    expect(await screen.findByRole('button', { name: 'Stop lyden for آب' })).toBeEnabled()
    expect(audio.playbackRate).toBe(0.8)

    fireEvent.click(screen.getByRole('button', { name: 'Slå udtalelyd fra' }))
    expect(audio.muted).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Stop lyden for آب' }))
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it('plays immediately at the chosen speed', async () => {
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))

    expect(await screen.findByRole('button', { name: 'Stop lyden for آب' })).toBeEnabled()
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
    expect(audio.playbackRate).toBe(0.8)
    expect(audio.defaultPlaybackRate).toBe(0.8)

    fireEvent.click(screen.getByRole('button', { name: 'Normal 1×' }))

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2)
    expect(audio.playbackRate).toBe(1)
    expect(audio.defaultPlaybackRate).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Stop lyden for آب' }))
  })

  it('stops the previous clip before another starts', async () => {
    render(<><AudioControl audioId="one" /><AudioControl audioId="two" /></>)
    const play = screen.getAllByRole('button', { name: 'Hør آب' })
    fireEvent.click(play[0])
    await screen.findAllByText('Afspiller')
    fireEvent.click(play[1])
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1)
  })

  it('stays usable when playback fails', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('missing'))
    render(<AudioControl audioId="word-ab" />)
    fireEvent.click(screen.getByRole('button', { name: 'Hør آب' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Du kan stadig se hjælpen')
  })
})

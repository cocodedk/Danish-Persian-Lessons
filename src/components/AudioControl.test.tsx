import { fireEvent, render, screen, within } from '@testing-library/react'
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

  /** Speeds and mute live behind the disclosure so the default view stays calm. */
  function expand() {
    const toggle = screen.queryByRole('button', { name: 'Flere lydvalg' })
      ?? screen.getByRole('button', { name: 'Luk lydvalg' })
    fireEvent.click(toggle)
  }

  it('hides speed and mute choices until the learner asks for them', () => {
    render(<AudioControl audioId="word-ab" />)
    const more = screen.getByRole('button', { name: 'Flere lydvalg' })

    // The visible label must stay short enough for one 44px tap row at 320px.
    expect(more).toHaveTextContent(/^Lydvalg$/)

    expect(screen.getByRole('button', { name: 'Hør آب' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Stop lyden for آب' })).toBeDisabled()
    expect(more).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Langsom 0,8×' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Slå udtalelyd fra' })).toBeNull()

    fireEvent.click(more)

    expect(screen.getByRole('button', { name: 'Luk lydvalg' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByRole('button', { name: 'Hør آب' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Normal 1×' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Meget langsom 0,5×' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Slå udtalelyd fra' })).toBeVisible()
  })

  /** The three tempos read as one segmented instrument, not three loose chips. */
  it('groups the tempos with short labels and one ink-filled selection', () => {
    render(<AudioControl audioId="word-ab" />)
    expand()
    const tempo = screen.getByRole('group', { name: 'Tempo' })
    const cells = within(tempo).getAllByRole('button')

    expect(cells.map((cell) => cell.textContent)).toEqual(['1×', '0,8×', '0,5×'])
    expect(cells.map((cell) => cell.getAttribute('aria-label')))
      .toEqual(['Normal 1×', 'Langsom 0,8×', 'Meget langsom 0,5×'])
    // `aria-pressed` is the styling hook for the filled cell, so exactly one is set.
    expect(cells.map((cell) => cell.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])

    fireEvent.click(cells[2])

    expect(cells.map((cell) => cell.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true'])
    // Mute stays its own control beside the strip.
    expect(within(tempo).queryByRole('button', { name: 'Slå udtalelyd fra' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Slå udtalelyd fra' })).toBeVisible()
  })

  it('keeps the chosen speed and mute after the choices are folded away', async () => {
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!
    expand()

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))
    fireEvent.click(screen.getByRole('button', { name: 'Slå udtalelyd fra' }))
    expand()
    expect(screen.queryByRole('button', { name: 'Normal 1×' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Hør آب' }))

    expect(await screen.findByRole('button', { name: 'Stop lyden for آب' })).toBeEnabled()
    expect(audio.playbackRate).toBe(0.8)
    expect(audio.muted).toBe(true)
    expand()
    expect(screen.getByRole('button', { name: 'Langsom 0,8×' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('never autoplays and offers replay, stop, three speeds, and mute', async () => {
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!
    expect(audio).toHaveAttribute('preload', 'none')
    expect(audio).not.toHaveAttribute('src')
    expect(audio).not.toHaveAttribute('autoplay')

    expand()
    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))
    expect(audio).toHaveAttribute('src', '/Danish-Persian-Lessons/app/audio/word-ab.mp3')
    expect(screen.getByRole('button', { name: 'Meget langsom 0,5×' })).toBeVisible()
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
    expand()

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))

    expect(await screen.findByRole('button', { name: 'Stop lyden for آب' })).toBeEnabled()
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
    expect(audio.playbackRate).toBe(0.8)
    expect(audio.defaultPlaybackRate).toBe(0.8)

    fireEvent.click(screen.getByRole('button', { name: 'Meget langsom 0,5×' }))

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2)
    expect(audio.playbackRate).toBe(0.5)
    expect(audio.defaultPlaybackRate).toBe(0.5)

    fireEvent.click(screen.getByRole('button', { name: 'Normal 1×' }))

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(3)
    expect(audio.playbackRate).toBe(1)
    expect(audio.defaultPlaybackRate).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Stop lyden for آب' }))
  })

  it('reapplies the chosen rate if playback startup resets it', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(function (this: HTMLMediaElement) {
      this.playbackRate = 1
      this.defaultPlaybackRate = 1
      return Promise.resolve()
    })
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!
    expand()

    fireEvent.click(screen.getByRole('button', { name: 'Langsom 0,8×' }))

    expect(await screen.findByRole('button', { name: 'Stop lyden for آب' })).toBeEnabled()
    expect(audio.playbackRate).toBe(0.8)
    expect(audio.defaultPlaybackRate).toBe(0.8)
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

  /** The transport reserves the longest play label up front, so the row cannot
   *  rewrap — and push the grid under it — when "Hør" grows to "Hør igen". */
  it('keeps one classed transport row through every play label', async () => {
    const { container } = render(<AudioControl audioId="word-ab" />)
    const audio = container.querySelector('audio')!
    const play = screen.getByRole('button', { name: 'Hør آب' })
    const stop = screen.getByRole('button', { name: 'Stop lyden for آب' })
    const more = screen.getByRole('button', { name: 'Flere lydvalg' })

    for (const button of [play, stop, more]) expect(button).toHaveClass('audio-control__transport')
    // Only the play label changes, so only the play button reserves a width.
    expect(play).toHaveClass('audio-control__play')
    expect(stop).not.toHaveClass('audio-control__play')
    expect(more).not.toHaveClass('audio-control__play')
    // The label rides in its own span: the reserved-width ghosts share its cell.
    expect(play.firstElementChild).toHaveTextContent(/^Hør$/)

    fireEvent.click(play)

    expect(await screen.findByText('Afspiller')).toBe(play.firstElementChild)
    fireEvent(audio, new Event('ended'))
    expect(play.firstElementChild).toHaveTextContent(/^Hør igen$/)
    expect(screen.getByRole('button', { name: 'Hør آب' })).toBe(play)
    expect(stop).toBeDisabled()
  })

  it('stays usable when playback fails', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('missing'))
    render(<AudioControl audioId="word-ab" />)
    fireEvent.click(screen.getByRole('button', { name: 'Hør آب' }))
    expect(screen.queryByRole('button', { name: 'Normal 1×' })).toBeNull()
    expect(await screen.findByRole('status')).toHaveTextContent('Du kan stadig se hjælpen')
  })
})

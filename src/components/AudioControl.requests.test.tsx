import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioControl } from './AudioControl'

vi.mock('../audio/manifest', () => ({
  findPronunciationAudio: (id?: string) => id ? {
    entryId: id,
    file: `/audio/${id}.mp3`,
    locale: 'fa-IR',
    transcript: 'آب',
  } : undefined,
  pronunciationAudioUrl: (file: string) => `/app/${file.replace(/^\//, '')}`,
}))

/** A first request the browser accepted but has not settled: native events can
 *  land before the returned settler lets play() continue. With `reason` it
 *  settles as a rejection — what Chromium does when a pause interrupts play(). */
function pendingPlay(reason?: Error): () => void {
  let settle = () => undefined as void
  vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => new Promise<void>((resolve, reject) => {
    settle = () => reason ? reject(reason) : resolve()
  }))
  return () => settle()
}

/** The tile owns the ask; the player only obeys a rising request counter. */
describe('pronunciation playback requests', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it('loads and plays nothing when nobody has asked yet', () => {
    const view = render(<AudioControl audioId="word-ab" />)
    expect(view.container.querySelector('audio')!.getAttribute('src')).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()

    view.rerender(<AudioControl audioId="word-ab" playRequest={0} />)

    expect(view.container.querySelector('audio')!.getAttribute('src')).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  it('plays on the first request and replays on every later one', async () => {
    const view = render(<AudioControl audioId="word-ab" playRequest={0} />)
    const audio = view.container.querySelector('audio')!
    audio.currentTime = 12

    view.rerender(<AudioControl audioId="word-ab" playRequest={1} />)

    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))
    expect(audio.getAttribute('src')).toBe('/app/audio/word-ab.mp3')
    expect(audio.currentTime).toBe(0)

    audio.currentTime = 7
    view.rerender(<AudioControl audioId="word-ab" playRequest={2} />)

    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2))
    expect(audio.currentTime).toBe(0)
  })

  it('ignores re-renders that do not raise the request', async () => {
    const view = render(<AudioControl audioId="word-ab" playRequest={1} onPlay={() => undefined} />)
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    // A fresh `onPlay` identity rebuilds the replay callback but is not an ask.
    view.rerender(<AudioControl audioId="word-ab" playRequest={1} onPlay={() => undefined} />)

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
  })

  /** A replay can supersede a play() the browser has not settled yet. */
  it('shows no error when a superseded request rejects after a newer one plays', async () => {
    let failFirst: (reason: Error) => void = () => undefined
    vi.mocked(HTMLMediaElement.prototype.play)
      .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { failFirst = reject }))
    const view = render(<AudioControl audioId="word-ab" playRequest={1} />)
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    view.rerender(<AudioControl audioId="word-ab" playRequest={2} />)
    await vi.waitFor(() => expect(view.getByLabelText('Hør آب')).toHaveTextContent('Afspiller'))
    failFirst(new Error('superseded'))
    await act(async () => undefined)

    // The learner can hear the clip, so the honest report is silence.
    expect(view.queryByRole('status')).toBeNull()
    expect(view.getByLabelText('Hør آب')).toHaveTextContent('Afspiller')
  })

  /** A stale finish must neither pause the live clip nor claim its own success. */
  it('lets a superseded request resolve without reporting a second play', async () => {
    const startFirst = pendingPlay()
    const onPlay = vi.fn()
    const view = render(<AudioControl audioId="word-ab" playRequest={1} onPlay={onPlay} />)
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    view.rerender(<AudioControl audioId="word-ab" playRequest={2} onPlay={onPlay} />)
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1))
    const pausesBefore = vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length
    startFirst()
    await act(async () => undefined)

    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length).toBe(pausesBefore)
    expect(view.getByLabelText('Hør آب')).toHaveTextContent('Afspiller')
  })

  /** The transport answers the ask, not the browser: no silent "Hør" gap, and
   *  neither witness of a cancelled start may resurrect it afterwards. */
  it('shows a live Stop before the promise settles and lets it cancel the request', async () => {
    const startPlayback = pendingPlay()
    const onPlay = vi.fn()
    const view = render(<AudioControl audioId="word-ab" playRequest={1} onPlay={onPlay} />)
    await vi.waitFor(() => expect(view.getByLabelText('Hør آب')).toHaveTextContent('Afspiller'))
    expect(view.getByLabelText('Stop lyden for آب')).toBeEnabled()

    act(() => view.getByLabelText('Stop lyden for آب').click())
    fireEvent.playing(view.container.querySelector('audio')!)
    startPlayback()
    await act(async () => undefined)

    // The cancelled attempt never played, so the offer is still a first "Hør".
    expect(onPlay).not.toHaveBeenCalled()
    expect(view.getByLabelText('Hør آب')).toHaveTextContent('Hør')
    expect(view.getByLabelText('Stop lyden for آب')).toBeDisabled()
  })

  it('keeps the one preload-free element and reports a failed request honestly', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('missing'))
    const view = render(<AudioControl audioId="word-ab" playRequest={1} />)

    expect(view.container.querySelectorAll('audio')).toHaveLength(1)
    expect(view.container.querySelector('audio')).toHaveAttribute('preload', 'none')
    expect(await view.findByRole('status')).toHaveTextContent('Du kan stadig se hjælpen')
    // The failure is reported, not retried behind the learner's back.
    view.rerender(<AudioControl audioId="word-ab" playRequest={1} />)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
  })

  /** Real Chromium, short clip: both native events beat the play() continuation,
   *  so `playing` — not the promise — is what proves the clip was heard, and the
   *  natural end must not pause, because that is what aborts that very promise. */
  it('finishes a short clip at Hør igen even when its play promise then aborts', async () => {
    const abortPlayback = pendingPlay(new DOMException(
      'The play() request was interrupted by a call to pause().', 'AbortError'))
    const onPlay = vi.fn()
    const view = render(<AudioControl audioId="word-ab" playRequest={1} onPlay={onPlay} />)
    const audio = view.container.querySelector('audio')!
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    fireEvent.playing(audio)
    fireEvent.ended(audio)

    // Heard once and now over: a settled offer to repeat, with nothing to stop.
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled()
    expect(view.getByLabelText('Hør آب').textContent).toBe('Hør igen')
    expect(view.getByLabelText('Stop lyden for آب')).toBeDisabled()

    abortPlayback()
    await act(async () => undefined)

    // The clip sounded, so the late AbortError is bookkeeping, not a failure.
    expect(view.queryByRole('status')).toBeNull()
    expect(view.getByLabelText('Hør آب').textContent).toBe('Hør igen')
    expect(onPlay).toHaveBeenCalledTimes(1)
  })
})

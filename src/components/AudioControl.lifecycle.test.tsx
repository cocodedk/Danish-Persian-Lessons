import { StrictMode } from 'react'
import { act, render } from '@testing-library/react'
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
 *  land before the returned settler lets play() continue. */
function pendingPlay(): () => void {
  let settle = () => undefined as void
  vi.mocked(HTMLMediaElement.prototype.play)
    .mockImplementationOnce(() => new Promise<void>((resolve) => { settle = resolve }))
  return () => settle()
}

/** What a browser really does: play() stays in flight until the clip starts, and
 *  a pause meanwhile settles it as the AbortError Chromium reports. */
function browserPlayback(): () => void {
  let pending: { resolve: () => void; reject: (reason: unknown) => void } | null = null
  vi.mocked(HTMLMediaElement.prototype.play).mockImplementation(() => new Promise<void>(
    (resolve, reject) => { pending = { resolve, reject } }))
  vi.mocked(HTMLMediaElement.prototype.pause).mockImplementation(() => {
    pending?.reject(new DOMException(
      'The play() request was interrupted by a call to pause().', 'AbortError'))
    pending = null
  })
  return () => {
    pending?.resolve()
    pending = null
  }
}

/** Mount and unmount move the player between owners; a request that arrives
 *  across that boundary must be served exactly once, or retired to nobody. */
describe('pronunciation player lifecycle', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it('plays the new clip when a request arrives with a remounted player', async () => {
    const view = render(<AudioControl key="one" audioId="one" playRequest={1} />)
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    view.rerender(<AudioControl key="two" audioId="two" playRequest={2} />)

    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2))
    expect(view.container.querySelector('audio')!.getAttribute('src')).toBe('/app/audio/two.mp3')
  })

  /** Spec 7.1: a play promise that settles after unmount belongs to nobody. */
  it('retires a clip whose play resolves after the player is gone', async () => {
    const startPlayback = pendingPlay()
    const onPlay = vi.fn()
    const view = render(<AudioControl audioId="word-ab" playRequest={1} onPlay={onPlay} />)
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))

    view.unmount()
    const pausesAtUnmount = vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length
    startPlayback()
    await act(async () => undefined)

    // The late node is paused and released, and reports nothing to the lesson.
    expect(vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length).toBeGreaterThan(pausesAtUnmount)
    expect(onPlay).not.toHaveBeenCalled()
  })

  /** An unmount before the ask is delivered leaves the corpus untouched. */
  it('never fetches a clip for a player unmounted before delivery', async () => {
    const view = render(<AudioControl audioId="word-ab" playRequest={1} />)
    view.unmount()
    await act(async () => undefined)

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  /** StrictMode rehearses every mount effect as setup, cleanup, setup. The clip a
   *  newly keyed tile arrives already asking for must survive that rehearsal: with
   *  a browser-accurate double — a pause aborts a play() still in flight — the
   *  cancelled first setup must start nothing to abort, and the surviving setup
   *  must make the one real ask that the learner then hears through to its end. */
  it('starts a newly mounted request once through the StrictMode rehearsal', async () => {
    const settle = browserPlayback()
    const onPlay = vi.fn()
    const view = render(
      <StrictMode><AudioControl audioId="word-ab" playRequest={1} onPlay={onPlay} /></StrictMode>,
    )

    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))
    // Neither a doubled ask from a missed cancel nor a lost one from the guard.
    await act(async () => undefined)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)

    const audio = view.container.querySelector('audio')!
    expect(audio.getAttribute('src')).toBe('/app/audio/word-ab.mp3')

    // Nothing was paused mid-start, so there is no AbortError to mistake for failure.
    await act(async () => settle())
    expect(view.queryByRole('status')).toBeNull()
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(view.getByLabelText('Hør آب')).toHaveTextContent('Afspiller')

    act(() => { audio.dispatchEvent(new Event('ended')) })

    // Heard and finished: the rehearsal cost the learner neither start nor offer.
    expect(view.getByLabelText('Hør آب')).toHaveTextContent('Hør igen')
    expect(view.getByLabelText('Stop lyden for آب')).toBeDisabled()
    expect(view.queryByRole('status')).toBeNull()
  })
})

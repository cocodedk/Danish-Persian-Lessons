import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OptionalAudioControl } from './OptionalAudioControl'

describe('optional pronunciation audio identity', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('starts fresh when the selected clip changes', async () => {
    const view = render(<OptionalAudioControl audioId="number-1-word" />)
    const first = await screen.findByRole('button', { name: 'Hør یِک' })
    fireEvent.click(first)
    // The play promise settles first: only then is the clip "already heard".
    await screen.findByText('Afspiller')
    fireEvent.ended(view.container.querySelector('audio')!)
    expect(first).toHaveTextContent('Hør igen')

    view.rerender(<OptionalAudioControl audioId="number-2-word" />)

    const second = await screen.findByRole('button', { name: 'Hør دو' })
    expect(second).toHaveTextContent(/^Hør$/)
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  /** The wrapper is plumbing: a request made to it must reach the real player. */
  it('forwards a playback request to the lazily loaded player', async () => {
    const view = render(<OptionalAudioControl audioId="number-1-word" playRequest={0} />)
    await screen.findByRole('button', { name: 'Hør یِک' })
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()

    view.rerender(<OptionalAudioControl audioId="number-1-word" playRequest={1} />)

    await vi.waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1))
  })
})

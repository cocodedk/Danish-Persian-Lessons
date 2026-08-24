// Spec 7.1: a counting tile is one deliberate action that both selects the
// number and, when the approved manifest has a clip for it, plays that clip.
// Arriving asks for nothing; tapping the same tile again replays; a tile with
// no approved clip selects and stays silent, with no dead control.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { freshVocabState, open } from './vocabHarness'

// The lesson reads its clips from the approved manifest and nowhere else, so
// the test pins a subset of it rather than the shipping corpus: numbers one and
// two are approved here, seventeen deliberately is not.
const APPROVED: Record<string, string> = {
  'number-1-word': 'یِک',
  'number-2-word': 'دو',
}

vi.mock('../audio/manifest', () => ({
  pronunciationAudio: [],
  findPronunciationAudio: (clipId?: string) =>
    clipId && APPROVED[clipId]
      ? { clipId, entryId: clipId, file: `/audio/${clipId}.mp3`, locale: 'fa-IR', transcript: APPROVED[clipId] }
      : undefined,
  pronunciationAudioUrl: (file: string) => `/app/${file.replace(/^\//, '')}`,
}))

freshVocabState()

function tile(name: string): HTMLElement {
  return screen.getByRole('button', { name: `Vælg tallet ${name}` })
}

/** The transport for `entryId`, once the lazily loaded player has arrived. */
function playButton(clipId: string) {
  return screen.findByRole('button', { name: `Hør ${APPROVED[clipId]}` })
}

function shownEntryId(container: HTMLElement): string | null {
  return container.querySelector('.entry-detail--master')!.getAttribute('data-entry-id')
}

function plays(): number {
  return vi.mocked(HTMLMediaElement.prototype.play).mock.calls.length
}

describe('hearing a number on the counting lesson page', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it('plays nothing just because the learner arrived', async () => {
    const { container } = open('#/lesson/taelle')

    // Wait for the player itself, so "nothing played" is about the contract
    // and not about a transport that had yet to load.
    await playButton('number-1-word')

    expect(container.querySelector('audio')!.getAttribute('src')).toBeNull()
    expect(plays()).toBe(0)
  })

  it('selects the number and plays it in the one tap', async () => {
    const { container } = open('#/lesson/taelle')
    await playButton('number-1-word')

    fireEvent.click(tile('to'))

    expect(shownEntryId(container)).toBe('number-2-word')
    await vi.waitFor(() => expect(plays()).toBe(1))
    expect(container.querySelector('audio')!.getAttribute('src')).toBe('/app/audio/number-2-word.mp3')
    // Selection is presentational only: the count stays where it was.
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
  })

  it('replays when the already selected number is tapped again', async () => {
    open('#/lesson/taelle')
    await playButton('number-1-word')

    fireEvent.click(tile('to'))
    await vi.waitFor(() => expect(plays()).toBe(1))
    fireEvent.click(tile('to'))

    await vi.waitFor(() => expect(plays()).toBe(2))
  })

  it('leaves no transport from the previous number beside the new one', async () => {
    open('#/lesson/taelle')
    await playButton('number-1-word')

    fireEvent.click(tile('to'))

    await playButton('number-2-word')
    expect(screen.queryByRole('button', { name: `Hør ${APPROVED['number-1-word']}` })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Hør / })).toHaveLength(1)
  })

  it('selects a number without an approved clip and stays silent', async () => {
    const { container } = open('#/lesson/taelle')
    await playButton('number-1-word')

    fireEvent.click(tile('to'))
    await vi.waitFor(() => expect(plays()).toBe(1))
    fireEvent.click(tile('sytten'))

    expect(shownEntryId(container)).toBe('number-17-word')
    expect(tile('sytten')).toHaveAttribute('aria-pressed', 'true')
    // No second clip, and no play control that would do nothing.
    expect(screen.queryByRole('button', { name: /^Hør / })).not.toBeInTheDocument()
    expect(container.querySelector('audio')).toBeNull()
    await vi.waitFor(() => expect(plays()).toBe(1))
  })
})

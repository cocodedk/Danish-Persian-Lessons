import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { countingLesson } from '../lessons/countingLesson'
import SpeakingHome from './SpeakingHome'
import SpeakingPage from './SpeakingPage'

vi.mock('../audio/manifest', () => ({
  findPronunciationAudio: (id?: string) => id ? {
    source: 'piper',
    clipId: id,
    entryId: id,
    formId: 'neutral',
    file: `/audio/${id}.000000000000.mp3`,
    locale: 'fa-IR',
    transcript: 'سلام',
    durationMs: 900,
    channels: 1,
    integratedLufs: -20,
    truePeakDbtp: -2,
    loudnessReportRef: 'docs/reviews/audio/test.json',
    reviewedBy: ['native-reviewer'],
    license: 'test',
    engineVersion: 'test',
    voiceModel: 'test',
    modelSha256: '0'.repeat(64),
    synthesisText: 'سلام',
    sourceTextHash: '0'.repeat(64),
  } : undefined,
  pronunciationAudioUrl: (file: string) => file,
}))

describe('speaking-first pages', () => {
  it('opens a short picture-book shelf after the reviewed corpus is complete', () => {
    render(
      <MemoryRouter initialEntries={['/tal']}>
        <Routes><Route path="/tal" element={<SpeakingHome />} /></Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Lær at tale persisk' })).toBeInTheDocument()
    expect(screen.getAllByText(/korte sider/)).toHaveLength(6)
    expect(screen.getByText('Hør. Sig det. Hør dig selv.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Øv alle lyde/ })).toHaveAttribute('href', '/lydovelse')
  })

  it('shows the one counting lesson as a door to the course route', () => {
    render(
      <MemoryRouter initialEntries={['/tal']}>
        <Routes><Route path="/tal" element={<SpeakingHome />} /></Routes>
      </MemoryRouter>,
    )
    const card = screen.getByRole('link', { name: new RegExp(countingLesson.title) })
    expect(card).toHaveAttribute('href', countingLesson.path)
    expect(card).toHaveTextContent(countingLesson.summary)
    expect(card).toHaveTextContent(`${countingLesson.numbers.length} tal fra 1 til 20`)
    // The retired «Tal fra 1 til 10» shelf lesson must not stand beside it.
    expect(screen.queryByText('Tal fra 1 til 10')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link').map((link) => link.getAttribute('href')))
      .not.toContain('/tal/tal/1')
  })

  it('opens one speak-and-replay page without asking the learner to read first', () => {
    render(
      <MemoryRouter initialEntries={['/tal/hils/vocabulary-2-salam']}>
        <Routes><Route path="/tal/:lesson/:page" element={<SpeakingPage />} /></Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Hils på persisk' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hør سلام' })).toHaveTextContent('Hør')
    expect(screen.getByRole('button', { name: 'Optag mig' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jeg har sagt det' })).toBeInTheDocument()
  })
})

describe('the retired talk-shelf counting URLs', () => {
  afterEach(() => { window.location.hash = '' })

  it('lands an old /tal/tal/:page link on the one counting lesson', async () => {
    window.location.hash = '#/tal/tal/3'
    render(<App />)

    expect(await screen.findByRole('heading', { name: countingLesson.title })).toBeInTheDocument()
    expect(window.location.hash).toBe(`#${countingLesson.path}`)
  })
})

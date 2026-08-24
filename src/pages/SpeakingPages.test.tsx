import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { formatCountingNumber, formatCountingRange } from '../lessons/countingDisplay'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
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

  it('shows every counting lesson in curriculum order as a door to its course route', () => {
    render(
      <MemoryRouter initialEntries={['/tal']}>
        <Routes><Route path="/tal" element={<SpeakingHome />} /></Routes>
      </MemoryRouter>,
    )
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    for (const entry of countingCurriculum) {
      const card = screen.getByRole('link', { name: new RegExp(entry.title) })
      expect(card, entry.path).toHaveAttribute('href', entry.path)
      expect(card).toHaveTextContent(entry.summary)
      expect(card).toHaveTextContent(formatCountingRange(entry.range))
      expect(card).toHaveTextContent(countingCurriculumProgressLine(entry))
      // Every card is a live door: none of them is shown as a disabled stub.
      expect(card).not.toHaveAttribute('aria-disabled')
      expect(hrefs).toContain(entry.path)
    }
    // Teaching order on the shelf is the curriculum's order, not the DOM's luck.
    const positions = countingCurriculum.map((entry) => hrefs.indexOf(entry.path))
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('keeps the foundation preview on the foundation card only', () => {
    render(
      <MemoryRouter initialEntries={['/tal']}>
        <Routes><Route path="/tal" element={<SpeakingHome />} /></Routes>
      </MemoryRouter>,
    )
    const card = screen.getByRole('link', { name: new RegExp(countingLesson.title) })
    const first = countingLesson.numbers[0]
    expect(card).toHaveTextContent(first.word.faMarked ?? first.word.fa)
    expect(card).toHaveTextContent(`${countingLesson.numbers.length} tal`)
    // The retired «Tal fra 1 til 10» shelf lesson must not stand beside it.
    expect(screen.queryByText('Tal fra 1 til 10')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link').map((link) => link.getAttribute('href')))
      .not.toContain('/tal/tal/1')
  })

  it('claims no unreviewed Persian or pronunciation on any rule card', () => {
    render(
      <MemoryRouter initialEntries={['/tal']}>
        <Routes><Route path="/tal" element={<SpeakingHome />} /></Routes>
      </MemoryRouter>,
    )
    for (const entry of countingCurriculum.filter((row) => row !== countingLesson)) {
      const card = screen.getByRole('link', { name: new RegExp(entry.title) })
      // Not one letter of Persian script — that covers every candidate form and
      // the joiner alike — and none of the candidate lydskrift or IPA either.
      expect(card.textContent ?? '', entry.path).not.toMatch(/[\u0600-\u06FF]/)
      for (const candidate of ['tjehel', 'pandjåh', 'siː', 'tʃehel']) {
        expect(card.textContent ?? '', candidate).not.toContain(candidate)
      }
      expect(card).toHaveTextContent(`Tal ${formatCountingRange(entry.range)}`)
      // The badge is one fixed-size number, so it carries the range's first
      // number alone, written as Danish writes it; the full range stays in the
      // text meta above.
      const badge = card.querySelector('.speaking-number')
      expect(badge).toHaveTextContent(formatCountingNumber(entry.range[0]))
      expect(badge?.textContent ?? '').not.toContain('\u2013')
    }
    expect(screen.getByRole('link', { name: new RegExp(counting21to99Lesson.title) }))
      .toHaveTextContent('Tal fra 21 til 99')
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

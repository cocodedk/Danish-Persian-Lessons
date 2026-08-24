import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildHome from './ChildHome'
import { AppChrome } from '../components/AppChrome'
import { addCollectedMission } from '../progress/childCollection'
import { getJourneyChoice } from '../progress/journey'
import { formatCountingNumber, formatCountingRange } from '../lessons/countingDisplay'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
import { learnCountingItem } from '../progress/counting'
import { counting21to99Progress } from '../progress/countingRules'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/opdag']}>
      <AppChrome />
      <Routes>
        <Route path="/opdag" element={<ChildHome />} />
        <Route path="/kursus" element={<h1>Hele kurset</h1>} />
        <Route path="/ord-der-ligner" element={<h1>Ordbroer</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => window.localStorage.clear())

describe('ChildHome', () => {
  it('offers thirteen useful starter words and a calm empty collection', () => {
    renderHome()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(13)
    expect(screen.getByRole('link', { name: 'Vælg hej' })).toHaveAttribute('href', '/opdag/ord/salam')
    expect(screen.getByRole('link', { name: 'Vælg jeg' })).toHaveAttribute('href', '/opdag/ord/man')
    expect(screen.getByRole('link', { name: 'Vælg du' })).toHaveAttribute('href', '/opdag/ord/to')
    expect(screen.getByRole('link', { name: 'Vælg vand' })).toHaveAttribute('href', '/opdag/ord/ab')
    expect(screen.getByRole('link', { name: 'Vælg brød' })).toHaveAttribute('href', '/opdag/ord/nan')
    expect(screen.getByRole('link', { name: 'Vælg far' })).toHaveAttribute('href', '/opdag/ord/baba')
    expect(screen.getByRole('link', { name: 'Vælg mor' })).toHaveAttribute('href', '/opdag/ord/madar')
    expect(screen.getByRole('link', { name: 'Vælg hus, hjem' })).toHaveAttribute('href', '/opdag/ord/khane')
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('href', '/ord-der-ligner')
    expect(screen.getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Dit første ord venter ovenfor.')).toBeInTheDocument()
  })

  it('shows and describes every word pronunciation on its card', () => {
    renderHome()
    const water = screen.getByRole('link', { name: 'Vælg vand' })
    const pronunciation = within(water).getByText('åb · [ɒːb]')
    expect(pronunciation).toBeVisible()
    expect(water).toHaveAttribute('aria-describedby', pronunciation.id)
  })

  it('teaches hello, a simple introduction, and goodbye', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Hils og præsenter dig' }).closest('section')!
    expect(within(section).getByText('سَلام')).toBeVisible()
    expect(within(section).getByText('مَن … هَستَم.')).toBeVisible()
    expect(within(section).getByText('خُداحافِظ!')).toBeVisible()
    expect(within(section).getByText('Jeg hedder …')).toBeVisible()
  })

  it('opens exactly the counting curriculum, in curriculum order', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    const links = within(section).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      countingCurriculum.map((entry) => entry.path),
    )
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('aria-disabled')
      expect(link.getAttribute('href')).toBeTruthy()
    })
  })

  it('reads every line on every counting card off the descriptor and the adapter', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    const links = within(section).getAllByRole('link')
    countingCurriculum.forEach((entry, index) => {
      const link = links[index]
      expect(link).toHaveTextContent(entry.title)
      expect(link).toHaveTextContent(entry.summary)
      expect(link).toHaveTextContent(countingCurriculumProgressLine(entry))
      expect(link).toHaveTextContent(
        entry === countingLesson
          ? `${countingLesson.numbers.length} tal ${formatCountingRange(entry.range)}`
          : `Tal ${formatCountingRange(entry.range)}`,
      )
    })
  })

  it('sends counting to the lessons instead of teaching numbers inline', () => {
    renderHome()
    expect(screen.queryByText('Tal fra 1 til 10')).toBeNull()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    expect(within(section).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getAllByRole('link')
      .filter((link) => link.getAttribute('href') === countingLesson.path)).toHaveLength(1)
    expect(section.textContent).not.toMatch(/hør|lyt/i)
  })

  it('previews the foundation first number with its own language marking', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    const preview = within(section).getByText(countingLesson.numbers[0].word.faMarked!)
    expect(preview).toHaveAttribute('lang', 'fa')
    expect(preview).toHaveAttribute('dir', 'rtl')
    const foundation = section.querySelector(`[href="${countingLesson.path}"]`)!
    expect(foundation.querySelector('.child-number__digit')).toHaveAttribute('aria-hidden', 'true')
    expect(foundation.querySelector('.child-number__digit')).toHaveAttribute('lang', 'fa')
  })

  it('claims no Persian or pronunciation for any unreviewed rule lesson', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    for (const entry of countingCurriculum.filter((row) => row !== countingLesson)) {
      const rule = section.querySelector<HTMLAnchorElement>(`[href="${entry.path}"]`)!
      expect(rule.querySelector('[lang="fa"]'), entry.path).toBeNull()
      const text = rule.textContent ?? ''
      expect(text, entry.path).not.toMatch(/[·\[\]]/)
      expect(text, entry.path).not.toMatch(/hør|lyt/i)
      // The badge carries the range's first number as Danish writes it.
      expect(rule.querySelector('.child-number__digit')).toHaveTextContent(
        formatCountingNumber(entry.range[0]),
      )
    }
    const rule = section.querySelector<HTMLAnchorElement>(`[href="${counting21to99Lesson.path}"]`)!
    expect(rule).toHaveTextContent('Tal fra 21 til 99')
  })

  it('keeps the two counting progress stores apart across a remount', () => {
    const { unmount } = renderHome()
    unmount()
    learnCountingItem(countingLesson.numbers[0].word.id)
    const { unmount: unmount2 } = renderHome()
    const section = screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!
    const links = within(section).getAllByRole('link')
    expect(links[0]).toHaveTextContent(
      `1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`,
    )
    expect(links[1]).toHaveTextContent(
      `0 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`,
    )
    unmount2()
    counting21to99Progress.markDone(counting21to99Progress.ids[0])
    renderHome()
    const after = within(
      screen.getByRole('heading', { name: 'Tal på persisk' }).closest('section')!,
    ).getAllByRole('link')
    expect(after[0]).toHaveTextContent(
      `1 af ${countingLesson.numbers.length} tal gennemgået eller øvet`,
    )
    expect(after[1]).toHaveTextContent(
      `1 af ${counting21to99Progress.ids.length} dele gennemgået eller øvet`,
    )
  })

  it('opens a separate animal lesson with clear photo choices', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: 'Dyr' }).closest('section')!
    const link = within(section).getByRole('link', { name: /Lær otte dyr/ })
    expect(link).toHaveAttribute('href', '/lesson/ord/5')
    expect(link.querySelectorAll('.lesson-image--thumbnail')).toHaveLength(4)
    expect(within(link).getByText('حیوان‌ها')).toBeVisible()
  })

  it('opens the word bridges directly from the workshop', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Ordbroer' }))
    expect(screen.getByRole('heading', { name: 'Ordbroer' })).toBeInTheDocument()
  })

  it('marks a collected mission in text without locking the others', () => {
    addCollectedMission('ab')
    renderHome()
    expect(within(screen.getByRole('link', { name: 'Vælg vand' })).getByText('I din samling')).toBeVisible()
    expect(screen.getAllByRole('link', { name: /^Vælg / })).toHaveLength(13)
  })

  it('switches deliberately to the grown-up course', () => {
    renderHome()
    fireEvent.click(screen.getByRole('link', { name: 'Skrift' }))
    expect(screen.getByRole('heading', { name: 'Hele kurset' })).toBeInTheDocument()
    expect(getJourneyChoice()).toBe('script')
  })
})

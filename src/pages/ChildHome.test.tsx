import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChildHome from './ChildHome'
import { AppChrome } from '../components/AppChrome'
import { addCollectedMission } from '../progress/childCollection'
import { getJourneyChoice } from '../progress/journey'
import { countingLesson } from '../lessons/countingLesson'

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

  it('sends counting to the one lesson instead of teaching ten numbers inline', () => {
    renderHome()
    expect(screen.queryByText('Tal fra 1 til 10')).toBeNull()
    const section = screen.getByRole('heading', { name: countingLesson.title }).closest('section')!
    const links = screen.getAllByRole('link')
      .filter((link) => link.getAttribute('href') === countingLesson.path)
    expect(links).toHaveLength(1)
    expect(section).toContainElement(links[0])
    expect(links[0]).toHaveTextContent(countingLesson.summary)
    expect(links[0]).toHaveTextContent(`${countingLesson.numbers.length} tal fra 1 til 20`)
    expect(within(section).queryAllByRole('listitem')).toHaveLength(0)
    expect(section.textContent).not.toMatch(/hør|lyt/i)
  })

  it('previews the first Persian number with its own language marking', () => {
    renderHome()
    const section = screen.getByRole('heading', { name: countingLesson.title }).closest('section')!
    const preview = within(section).getByText(countingLesson.numbers[0].word.faMarked!)
    expect(preview).toHaveAttribute('lang', 'fa')
    expect(preview).toHaveAttribute('dir', 'rtl')
    expect(section.querySelector('.child-number__digit')).toHaveAttribute('aria-hidden', 'true')
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

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import WordBridgesScreen from './WordBridgesScreen'
import { AppChrome } from '../components/AppChrome'

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/ord-der-ligner']}>
      <AppChrome />
      <WordBridgesScreen />
    </MemoryRouter>,
  )
}

describe('the word-bridge lesson', () => {
  it('opens with a compact, grouped overview of all twenty-three bridges', () => {
    const { container } = renderScreen()

    expect(screen.getByRole('heading', { name: 'Ord, der ligner' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Hovedområder' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Til ordværkstedet' })).toHaveAttribute('href', '/opdag')
    expect(screen.getByText('23 ordbroer')).toBeInTheDocument()
    for (const heading of ['Familien', 'I hverdagen', 'Tre tal', 'Krop og himmel', 'Lydlige huskebroer']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    expect(container.querySelectorAll('details')).toHaveLength(23)
    expect(container.querySelectorAll('details[open]')).toHaveLength(1)
    expect(container.querySelector('.entry-card')).not.toBeInTheDocument()
  })

  it('shows every supplied Persian word and keeps both IPA columns available', () => {
    renderScreen()

    const expected = [
      ['پدر', 'pedar'], ['مادر', 'mådar'], ['برادر', 'barådar'], ['دختر', 'dokhtar'],
      ['در', 'dar'], ['نام', 'nåm'], ['موش', 'mush'], ['گرم', 'garm'], ['نو', 'now'],
      ['دو', 'do'], ['شش', 'shesh'], ['نه', 'noh'], ['دندان', 'dandån'], ['ناف', 'nåf'],
      ['ماه', 'måh'], ['ستاره', 'setåre'], ['بند', 'band'],
      ['دوست', 'dust'], ['پاس', 'pås'], ['مرد', 'mord'], ['لنگ', 'leng'],
    ]

    for (const [persian, persianPron] of expected) {
      expect(screen.getByText(persian)).toBeInTheDocument()
      expect(screen.getAllByText(persianPron).length).toBeGreaterThan(0)
    }
    expect(screen.getByText(/Persisk \[peˈdæɾ\].*dansk \[ˈfæːðʌ\]/)).toBeInTheDocument()
    expect(screen.getByText(/Persisk \[bænd\].*dansk \[ˈbɔnˀ\]/)).toBeInTheDocument()
  })

  it('does not turn a resemblance into a general sound rule', () => {
    renderScreen()

    expect(screen.getByText(/ikke en regel for alle ord/)).toBeInTheDocument()
    expect(screen.getByText(
      'De betyder ikke det samme i dag: det persiske ord betyder hovedkontor.',
    )).toBeInTheDocument()
    expect(screen.getByText(/persiske ord betyder hovedkontor/)).toBeInTheDocument()
    expect(screen.getByText(/بند kan også være en mur, der holder vand/)).toBeInTheDocument()
    expect(screen.getByText(/De er ikke i samme gamle familie/)).toBeInTheDocument()
    expect(screen.getByText(/kun en lydlig huskebro/)).toBeInTheDocument()
    expect(screen.getByText(/ikke dokumenteret som et historisk dansk længdemål/)).toBeInTheDocument()
  })
})

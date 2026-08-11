import { Link, useLocation } from 'react-router-dom'
import { setJourneyChoice, type JourneyChoice } from '../progress/journey'
import { talkAudioReady } from '../speaking/lessons'
import './AreaNav.css'

type Area = {
  to: string
  label: string
  choice?: JourneyChoice
  current: (pathname: string) => boolean
}

const legacyAreas: readonly Area[] = [
  {
    to: '/opdag', label: 'Ord', choice: 'words',
    current: (path) => path === '/opdag' || path.startsWith('/opdag/'),
  },
  {
    to: '/ord-der-ligner', label: 'Ordbroer',
    current: (path) => path === '/ord-der-ligner',
  },
  {
    to: '/kursus', label: 'Lektioner', choice: 'script',
    current: (path) => path === '/kursus' || path.startsWith('/lesson/')
      || path === '/repetition' || path.startsWith('/puslespil/') || path === '/dit-navn',
  },
]

const speakingAreas: readonly Area[] = [
  {
    to: '/tal', label: 'Tal', choice: 'speak',
    current: (path) => path === '/tal' || path.startsWith('/tal/') || path === '/lydovelse',
  },
  {
    to: '/opdag', label: 'Ord', choice: 'words',
    current: (path) => path === '/opdag' || path.startsWith('/opdag/'),
  },
  {
    to: '/ord-der-ligner', label: 'Ordbroer',
    current: (path) => path === '/ord-der-ligner',
  },
  {
    to: '/kursus', label: 'Skrift', choice: 'script',
    current: (path) => path === '/kursus' || path.startsWith('/lesson/')
      || path === '/repetition' || path.startsWith('/puslespil/') || path === '/dit-navn',
  },
]

/** The stable navigation between the app's three learner-facing hubs. */
export function AreaNav() {
  const { pathname } = useLocation()
  const areas = talkAudioReady() ? speakingAreas : legacyAreas
  return (
    <nav className="area-nav" aria-label="Hovedområder">
      <ul>
        {areas.map((area) => (
          <li key={area.to}>
            <Link
              to={area.to}
              aria-current={area.current(pathname) ? 'page' : undefined}
              onClick={area.choice ? () => setJourneyChoice(area.choice!) : undefined}
            >
              {area.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

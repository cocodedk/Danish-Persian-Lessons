import { Link, useLocation } from 'react-router-dom'
import { setJourneyChoice, type JourneyChoice } from '../progress/journey'
import './AreaNav.css'

const areas: readonly {
  to: string
  label: string
  choice?: JourneyChoice
  current: (pathname: string) => boolean
}[] = [
  {
    to: '/opdag', label: 'Ord', choice: 'child',
    current: (path) => path === '/opdag' || path.startsWith('/opdag/'),
  },
  {
    to: '/ord-der-ligner', label: 'Ordbroer',
    current: (path) => path === '/ord-der-ligner',
  },
  {
    to: '/kursus', label: 'Lektioner', choice: 'course',
    current: (path) => path === '/kursus' || path.startsWith('/lesson/')
      || path === '/repetition' || path.startsWith('/puslespil/') || path === '/dit-navn',
  },
]

/** The stable navigation between the app's three learner-facing hubs. */
export function AreaNav() {
  const { pathname } = useLocation()
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

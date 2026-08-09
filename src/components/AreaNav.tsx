import { NavLink } from 'react-router-dom'
import { setJourneyChoice, type JourneyChoice } from '../progress/journey'
import './AreaNav.css'

const areas: readonly {
  to: string
  label: string
  accessibleLabel?: string
  choice?: JourneyChoice
}[] = [
  { to: '/opdag', label: 'Byg ord', accessibleLabel: 'Byg ord i ordværkstedet', choice: 'child' },
  { to: '/ord-der-ligner', label: 'Ordbroer' },
  { to: '/kursus', label: 'Kursus', accessibleLabel: 'Kursus og noter', choice: 'course' },
]

/** The stable navigation between the app's three learner-facing hubs. */
export function AreaNav() {
  return (
    <nav className="area-nav" aria-label="Hovedområder">
      <ul>
        {areas.map((area) => (
          <li key={area.to}>
            <NavLink
              end
              to={area.to}
              aria-label={area.accessibleLabel}
              onClick={area.choice ? () => setJourneyChoice(area.choice!) : undefined}
            >
              {area.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

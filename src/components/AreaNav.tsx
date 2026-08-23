import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { countingLesson } from '../lessons/countingLesson'
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

/**
 * The counting lesson sits on a `/lesson/*` path but belongs to Tal. It is
 * claimed by Tal and subtracted from Skrift, so exactly one hub is current.
 */
const isCounting = (path: string) =>
  path === countingLesson.path || path.startsWith(`${countingLesson.path}/`)

const speakingAreas: readonly Area[] = [
  {
    to: '/tal', label: 'Tal', choice: 'speak',
    current: (path) => path === '/tal' || path.startsWith('/tal/')
      || path === '/lydovelse' || isCounting(path),
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
    current: (path) => !isCounting(path)
      && (path === '/kursus' || path.startsWith('/lesson/')
        || path === '/repetition' || path.startsWith('/puslespil/') || path === '/dit-navn'),
  },
]

/**
 * Publishes the rendered height of the fixed nav as `--area-nav-block-size`,
 * so page content reserves exactly the clearance the nav occupies instead of
 * a guessed constant. The measured value is the border box, which already
 * includes the safe-area padding — callers must not add `env()` on top.
 *
 * Nothing is published when the height is unknown (0, or no ResizeObserver as
 * in jsdom); the CSS fallback then over-reserves, which is the safe direction.
 */
function useNavBlockSize(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const nav = ref.current
    if (!nav || typeof ResizeObserver === 'undefined') return

    const publish = () => {
      const height = nav.getBoundingClientRect().height
      if (height > 0) {
        document.documentElement.style.setProperty('--area-nav-block-size', `${height}px`)
      } else {
        document.documentElement.style.removeProperty('--area-nav-block-size')
      }
    }

    const observer = new ResizeObserver(publish)
    observer.observe(nav)
    publish()
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--area-nav-block-size')
    }
  }, [ref])
}

/** The stable navigation between the app's learner-facing hubs. */
export function AreaNav() {
  const { pathname } = useLocation()
  const areas = talkAudioReady() ? speakingAreas : legacyAreas
  const navRef = useRef<HTMLElement>(null)
  useNavBlockSize(navRef)
  return (
    <nav className="area-nav" aria-label="Hovedområder" ref={navRef}>
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

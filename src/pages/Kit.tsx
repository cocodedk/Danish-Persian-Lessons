import { Link } from 'react-router-dom'
import { KitSamples } from './KitSamples'
import './Kit.css'

interface Frame {
  scheme: 'light' | 'dark'
  dir: 'ltr' | 'rtl'
  title: string
}

const FRAMES: Frame[] = [
  { scheme: 'light', dir: 'ltr', title: 'Papir · venstre mod højre' },
  { scheme: 'light', dir: 'rtl', title: 'Papir · højre mod venstre' },
  { scheme: 'dark', dir: 'ltr', title: 'Tavle · venstre mod højre' },
  { scheme: 'dark', dir: 'rtl', title: 'Tavle · højre mod venstre' },
]

/**
 * The kit gallery at #/kit: every component in both farveskemaer and both
 * reading directions, so the margin line can be seen mirroring. Reached by
 * direct URL only — nothing on the forside links here.
 */
export default function Kit() {
  return (
    <main className="kit" lang="da">
      <header>
        <h1 className="kit__title">Notesbogs-kittet</h1>
        <p className="kit__intro">
          Hver komponent vist på papir og på tavlen, begge læseretninger. Den røde margenstreg
          skifter side af sig selv.
        </p>
        <Link className="kit__back" to="/">
          Til forsiden
        </Link>
      </header>

      <div className="kit__grid">
        {FRAMES.map((frame) => (
          <section
            key={`${frame.scheme}-${frame.dir}`}
            className={`kit__frame scheme-${frame.scheme}`}
            data-testid={`kit-frame-${frame.scheme}-${frame.dir}`}
          >
            <h2 className="kit__frame-title">{frame.title}</h2>
            <div className="kit__frame-body" dir={frame.dir}>
              <KitSamples dir={frame.dir} />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

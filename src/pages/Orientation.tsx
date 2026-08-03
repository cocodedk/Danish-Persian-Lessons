import { useEffect } from 'react'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { RuleDivider } from '../components/RuleDivider'
import { FaSpecimen } from '../components/FaSpecimen'
import { PronLine } from '../components/PronLine'
import { DaWord } from '../components/DaWord'
import { markOrientationSeen } from '../progress/alphabet'
import { MIRROR_DEMO, ORIENTATION_POINTS } from '../content/orientation'
import type { OrientationPoint } from '../content/orientation'
import './Orientation.css'

/** The flip, felt: a Danish word turned around, with the sweep that turns it. */
function Flip() {
  return (
    <section className="orient__flip">
      <p className="orient__turned">{MIRROR_DEMO.turned}</p>
      <svg
        className="orient__sweep"
        viewBox="0 0 200 24"
        role="img"
        aria-label="Læseretningen går fra højre mod venstre"
      >
        <circle className="orient__sweep-start" cx="193" cy="12" r="4" />
        <path className="orient__sweep-line" d="M 189 12 L 16 12" pathLength={1} />
        <path className="orient__sweep-head" d="M 24 5 L 9 12 L 24 19" />
      </svg>
      <p className="orient__body">
        Du læste lige D-N-A-V, og det betyder ingenting. Start i højre side i stedet, så står der{' '}
        {MIRROR_DEMO.da}.
      </p>
    </section>
  )
}

function Point({ point }: { point: OrientationPoint }) {
  return (
    <section className="orient__point">
      <h2 className="orient__heading">{point.heading}</h2>
      <ul className="orient__row" lang="fa" dir="rtl">
        {point.fa.map((item, index) => (
          <li key={`${item}-${index}`} className="orient__chip">
            {item}
          </li>
        ))}
      </ul>
      {point.result && <FaSpecimen fa={point.result} />}
      {point.pron && <PronLine da={point.pron.da} ipa={point.pron.ipa} />}
      <p className="orient__body">{point.body}</p>
    </section>
  )
}

/**
 * Lektion 0 — how Persian writing works, shown before it is told. Opens the
 * alphabet lesson once; after that it lives at #/lesson/alphabet/intro and can
 * be read again whenever. See docs/plans/003-alphabet-lesson.md step 6.
 */
export default function Orientation() {
  useEffect(() => {
    markOrientationSeen()
  }, [])

  return (
    <LessonSheet
      title="Sådan virker persisk skrift"
      bar={
        <>
          <BarLink to="/">Til forsiden</BarLink>
          <BarLink to="/lesson/alphabet">Videre til bogstaverne</BarLink>
        </>
      }
    >
      <p className="orient__intro">
        Fem ting overrasker de fleste. Du kan gå videre når som helst — og læse det her igen senere.
      </p>

      <section className="orient__point">
        <h2 className="orient__heading">Persisk læses fra højre mod venstre</h2>
        <Flip />
        <RuleDivider />
        <FaSpecimen fa={MIRROR_DEMO.fa} />
        <PronLine da={MIRROR_DEMO.pron.da} ipa={MIRROR_DEMO.pron.ipa} />
        <DaWord>{MIRROR_DEMO.da.toLowerCase()}</DaWord>
        <p className="orient__body">
          Persisk gør det hver eneste gang: første bogstav yderst til højre, sidste bogstav yderst
          til venstre.
        </p>
      </section>

      {ORIENTATION_POINTS.map((point) => (
        <Point key={point.id} point={point} />
      ))}
    </LessonSheet>
  )
}

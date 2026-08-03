import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Stroke } from '../lessons/types'
import { toPersianDigits } from '../lessons/digits'
import { drawTimings } from './letterDrawTiming'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { Button } from './Button'
import './LetterDraw.css'

export interface LetterDrawProps {
  strokes: Stroke[]
  /** The letter's Danish name — this is what the drawing is announced as. */
  name: string
}

function pathClass(kind: Stroke['kind']): string {
  return `letter-draw__path letter-draw__path--${kind}`
}

/** The pen moving: every path in order, the live one in the teacher's red. */
function Animated({ strokes, name }: LetterDrawProps) {
  const [take, setTake] = useState(0)
  const timings = drawTimings(strokes)

  return (
    <>
      <svg
        key={take}
        className="letter-draw__sheet letter-draw__sheet--live"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Stregrækkefølge for ${name}`}
      >
        {strokes.map((stroke, index) => (
          <path
            key={index}
            d={stroke.d}
            pathLength={1}
            className={pathClass(stroke.kind)}
            style={
              {
                '--draw-delay': `${timings[index].start}ms`,
                '--draw-dur': `${timings[index].duration}ms`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
      <Button variant="quiet" onClick={() => setTake((previous) => previous + 1)}>
        Tegn igen
      </Button>
    </>
  )
}

/** The same order, standing still: one small sheet per step, newest in red. */
function Steps({ strokes, name }: LetterDrawProps) {
  return (
    <ol className="letter-draw__steps" aria-label={`Stregrækkefølge for ${name}, trin for trin`}>
      {strokes.map((_, step) => (
        <li key={step} className="letter-draw__step">
          <svg className="letter-draw__sheet" viewBox="0 0 100 100" aria-hidden="true">
            {strokes.slice(0, step + 1).map((stroke, index) => (
              <path
                key={index}
                d={stroke.d}
                className={`${pathClass(stroke.kind)} ${
                  index === step ? 'letter-draw__path--live' : 'letter-draw__path--done'
                }`}
              />
            ))}
          </svg>
          <span className="letter-draw__step-number" lang="fa" dir="rtl">
            {toPersianDigits(step + 1)}
          </span>
        </li>
      ))}
    </ol>
  )
}

/**
 * How the letter is written: the pen enters on the right, the body first, the
 * dots last. Animated by default; under prefers-reduced-motion the same
 * sequence stands still as numbered steps — the lesson is never withheld.
 * See docs/design/ART-DIRECTION.md "Motion".
 */
export function LetterDraw({ strokes, name }: LetterDrawProps) {
  const stillPlease = usePrefersReducedMotion()

  return (
    <figure className="letter-draw">
      {stillPlease ? <Steps strokes={strokes} name={name} /> : <Animated strokes={strokes} name={name} />}
      <figcaption className="letter-draw__caption" lang="da">
        Sådan bevæger pennen sig: fra højre, kroppen først, prikkerne til sidst.
      </figcaption>
    </figure>
  )
}

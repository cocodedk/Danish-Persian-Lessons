import { useEffect, useState } from 'react'
import { levelLine } from '../rewards/copy'
import './PageFlip.css'

export interface PageFlipProps {
  /** The page that just filled up. */
  level: number
  /** Fires when the overlay has said its piece. */
  onDone: () => void
}

const SHOWN_MS = 1400

/**
 * The level-up: a fresh notebook page turns over. It never blocks — no pointer
 * events, no button to dismiss, gone in well under 1.5s. Under reduced motion
 * the page does not turn; the line still appears, because the level is real
 * either way (ART-DIRECTION "Motion").
 */
export function PageFlip({ level, onDone }: PageFlipProps) {
  const [line] = useState(() => levelLine(level))

  useEffect(() => {
    const timer = window.setTimeout(onDone, SHOWN_MS)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <div className="page-flip" role="status">
      <div className="page-flip__sheet">
        <p className="page-flip__fa" lang="fa" dir="rtl">
          {line.fa}
        </p>
        <p className="page-flip__da" lang="da">
          {line.da}
        </p>
      </div>
    </div>
  )
}

import './ProgressTick.css'

export interface ProgressTickProps {
  /** True once the item is done — the tick is drawn and never taken away. */
  granted: boolean
  /** What the tick says out loud. Danish, du-form. */
  label?: string
}

/**
 * The red margin tick a teacher puts beside finished مشق. Granted ticks stamp
 * in briefly; under prefers-reduced-motion they simply appear — a reward is
 * never skipped, only ever un-animated. See docs/design/ART-DIRECTION.md "Motion".
 */
export function ProgressTick({ granted, label = 'Klaret' }: ProgressTickProps) {
  if (!granted) {
    return <span className="progress-tick" aria-hidden="true" />
  }

  return (
    <span className="progress-tick progress-tick--granted" role="img" aria-label={label}>
      <svg className="progress-tick__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 12.6 L9 18.5 L20.5 4.5" />
      </svg>
    </span>
  )
}

import { Button } from './Button'

export interface RetryActionsProps {
  /** Already right: no retry to offer, and advancing is the primary move. */
  solved: boolean
  onRetry: () => void
  onAdvance: () => void
  /** «Næste», or the round's own closing word on the last task. */
  advanceLabel: string
  className?: string
}

/**
 * The pair every exercise ends an attempt on (plan 010): another try that
 * costs nothing, and a quiet way forward that never blocks. One component,
 * so the retry contract reads the same on every screen.
 */
export function RetryActions({ solved, onRetry, onAdvance, advanceLabel, className }: RetryActionsProps) {
  return (
    <div className={className}>
      {!solved && <Button onClick={onRetry}>Prøv én gang til</Button>}
      <Button variant={solved ? 'primary' : 'quiet'} onClick={onAdvance}>
        {advanceLabel}
      </Button>
    </div>
  )
}

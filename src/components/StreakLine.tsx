import { streakLine } from '../rewards/copy'
import { ProgressTick } from './ProgressTick'
import type { StreakState } from '../rewards/types'
import './StreakLine.css'

export interface StreakLineProps {
  streak: StreakState
}

/**
 * How many days the learner has practised, and where the streak stands. Before
 * the first day there is nothing to say, so nothing is said — an empty counter
 * would only be a reproach. A resting streak is described as resting, never as
 * broken or lost.
 */
export function StreakLine({ streak }: StreakLineProps) {
  if (streak.value < 1) return null

  const line = streakLine(streak)
  return (
    <p className={`streak-line ${streak.resting ? 'streak-line--resting' : ''}`}>
      <ProgressTick granted={streak.today} label="Øvet i dag" />
      <span className="streak-line__fa" lang="fa" dir="rtl">
        {line.fa}
      </span>
      <span className="streak-line__da" lang="da">
        {line.da}
      </span>
    </p>
  )
}

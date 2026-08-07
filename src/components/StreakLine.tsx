import { streakLine } from '../rewards/copy'
import { ProgressTick } from './ProgressTick'
import type { StreakState } from '../rewards/types'
import './StreakLine.css'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'

export interface StreakLineProps {
  streak: StreakState
}

/**
 * How many days the learner has practised, and where the streak stands. Before
 * the first day there is nothing to say, so nothing is said — an empty counter
 * would only be a reproach. Both language lines say that practice continues;
 * neither introduces a sleeping or broken-streak metaphor.
 */
export function StreakLine({ streak }: StreakLineProps) {
  if (streak.value < 1) return null

  const line = streakLine(streak)
  return (
    <div className={`streak-line ${streak.resting ? 'streak-line--resting' : ''}`}>
      <ProgressTick granted={streak.today} label="Øvet i dag" />
      <PersianText entry={line} className="streak-line__fa" />
      <PronLine {...line.pron} />
      <span className="streak-line__da" lang="da">
        {line.da}
      </span>
    </div>
  )
}

import { Link } from 'react-router-dom'
import './LessonCard.css'

export interface LessonCardProps {
  /** Where the lesson sits in the curriculum. */
  number: number
  title: string
  /** What is in it, in one Danish line. */
  summary: string
  /** How far the learner got, in one Danish line. */
  progress: string
  to: string
}

/**
 * One lesson on the forside. Counters stay Latin until Persian numerals are
 * deliberately taught with their own catalog companions.
 */
export function LessonCard({ number, title, summary, progress, to }: LessonCardProps) {
  return (
    <Link className="lesson-card" to={to}>
      <span className="lesson-card__number" aria-hidden="true">{number}</span>
      <span className="lesson-card__text">
        <span className="lesson-card__title">{title}</span>
        <span className="lesson-card__summary">{summary}</span>
        <span className="lesson-card__progress">{progress}</span>
      </span>
    </Link>
  )
}

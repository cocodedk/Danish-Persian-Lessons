import { Link } from 'react-router-dom'
import { toPersianDigits } from '../lessons/digits'
import './LessonCard.css'

export interface LessonCardProps {
  /** Where the lesson sits in the curriculum. Shown in Persian digits. */
  number: number
  title: string
  /** What is in it, in one Danish line. */
  summary: string
  /** How far the learner got, in one Danish line. */
  progress: string
  to: string
}

/**
 * One lesson on the forside. The number is written ۰ ۱ ۲ — the learner will
 * need Persian digits anyway, and this is the cheapest place to meet them.
 */
export function LessonCard({ number, title, summary, progress, to }: LessonCardProps) {
  return (
    <Link className="lesson-card" to={to}>
      <span className="lesson-card__number" lang="fa" dir="rtl" aria-hidden="true">
        {toPersianDigits(number)}
      </span>
      <span className="lesson-card__text">
        <span className="lesson-card__title">{title}</span>
        <span className="lesson-card__summary">{summary}</span>
        <span className="lesson-card__progress">{progress}</span>
      </span>
    </Link>
  )
}

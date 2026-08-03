import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { RuledSection } from './RuledSection'
import './LessonSheet.css'

export interface LessonSheetProps {
  /** Danish heading for the screen. */
  title: string
  children: ReactNode
  /** The bottom bar: where the learner goes next, within thumb reach. */
  bar: ReactNode
}

/** A link in the bottom bar. Says where it goes, never "Learn more". */
export function BarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="lesson-bar__link" to={to}>
      {children}
    </Link>
  )
}

/**
 * Every lesson screen: one sheet of ruled paper with a single red margin line
 * (RuledSection owns it — nothing inside draws a second one), and a bar pinned
 * to the bottom of the viewport where a thumb can reach it.
 */
export function LessonSheet({ title, children, bar }: LessonSheetProps) {
  return (
    <main className="lesson" lang="da">
      <RuledSection>
        <h1 className="lesson__title">{title}</h1>
        {children}
      </RuledSection>
      <nav className="lesson-bar" aria-label="Lektionsnavigation">
        {bar}
      </nav>
    </main>
  )
}

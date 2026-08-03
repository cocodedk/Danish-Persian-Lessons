import type { ReactNode } from 'react'
import './RuledSection.css'

export interface RuledSectionProps {
  children: ReactNode
  /** Set "rtl" for Persian content — the red margin line mirrors to the right. */
  dir?: 'ltr' | 'rtl'
  lang?: string
}

/**
 * A sheet of ruled exercise paper: light-blue rules on the line rhythm and one
 * red margin line down the inline-start edge. Everything is a logical property,
 * so a Persian (rtl) sheet mirrors the margin line to the right on its own —
 * which is where real Persian notebooks put it.
 * See docs/design/ART-DIRECTION.md "Concept" (the signature element).
 */
export function RuledSection({ children, dir, lang }: RuledSectionProps) {
  return (
    <section className="ruled-section" dir={dir} lang={lang}>
      {children}
    </section>
  )
}

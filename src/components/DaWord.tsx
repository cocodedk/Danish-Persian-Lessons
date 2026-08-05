import type { ReactNode } from 'react'
import './DaWord.css'

export interface DaWordProps {
  children: ReactNode
}

/**
 * The Danish half of a pair: Andika (the SIL literacy face), calm and smaller
 * than the Persian specimen. See docs/design/ART-DIRECTION.md "The specimen".
 */
export function DaWord({ children }: DaWordProps) {
  return (
    <p className="da-word" lang="da" dir="ltr">
      {children}
    </p>
  )
}

import type { ReactNode } from 'react'
import './Button.css'

export interface ButtonProps {
  children: ReactNode
  /** "primary" is the filled pen-blue button; "quiet" is the text button. */
  variant?: 'primary' | 'quiet'
  type?: 'button' | 'submit'
  onClick?: () => void
}

/**
 * A pen-blue button. Labels say what happens ("Gem", "Åbn appen") — never
 * "Learn more". 44×44 minimum and a visible focus ring, per the accessibility
 * floor in docs/design/ART-DIRECTION.md.
 */
export function Button({ children, variant = 'primary', type = 'button', onClick }: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}

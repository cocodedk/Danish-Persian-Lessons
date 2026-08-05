import type { ElementType, ReactNode } from 'react'

/** Approved dynamic path: learner-owned Persian, never catalog copy. */
export function LearnerPersianInput({
  as = 'span',
  className,
  ariaHidden,
  children,
}: {
  as?: 'span' | 'p' | 'ul'
  className?: string
  ariaHidden?: boolean
  children: ReactNode
}) {
  const Tag = as as ElementType
  return (
    <Tag className={className} lang="fa" dir="rtl" aria-hidden={ariaHidden}>
      {children}
    </Tag>
  )
}

import type { ElementType } from 'react'
import type { PersianEntry } from '../catalog/types'
import { penMarkClass } from './penMark'
import '../styles/pen.css'

export interface PersianTextProps {
  entry: PersianEntry
  as?: 'span' | 'p' | 'div'
  className?: string
  /** Positional form derived from this entry's letter. */
  display?: string
  marked?: boolean
  ariaHidden?: boolean
}

/** The approved path for catalogued Persian text outside a full specimen. */
export function PersianText({
  entry,
  as = 'span',
  className = '',
  display,
  marked = false,
  ariaHidden,
}: PersianTextProps) {
  const Tag = as as ElementType
  const text = display ?? (marked ? entry.faMarked ?? entry.fa : entry.fa)
  const classes = marked ? penMarkClass(className, text) : className
  return (
    <Tag className={classes || undefined} lang="fa" dir="rtl" aria-hidden={ariaHidden}>
      {text}
    </Tag>
  )
}

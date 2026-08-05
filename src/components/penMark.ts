import { markSide } from '../lessons/marks'

/**
 * The className for a Persian string rendered with the teacher's red pen:
 * the caller's own class, plus the pen class for the side its marks sit on.
 * Unmarked text gets no pen class at all. See src/styles/pen.css.
 */
export function penMarkClass(base: string, text: string): string {
  const side = markSide(text)
  return side === 'none' ? base : `${base} pen-mark--${side}`
}

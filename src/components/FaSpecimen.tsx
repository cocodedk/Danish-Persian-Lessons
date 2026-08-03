import { penMarkClass } from './penMark'
import '../styles/pen.css'
import './FaSpecimen.css'

export interface FaSpecimenProps {
  /** The plain Persian word or letter. */
  fa: string
  /** The diacriticized variant to render instead, when the lesson supplies one. */
  faMarked?: string
}

/**
 * A Persian teaching specimen: schoolbook Naskh, huge, with air for the
 * diacritics and the marks in the teacher's red. Renders `faMarked ?? fa`.
 * See docs/design/ART-DIRECTION.md "Typography" and "The specimen".
 */
export function FaSpecimen({ fa, faMarked }: FaSpecimenProps) {
  const rendered = faMarked ?? fa
  return (
    <p className={penMarkClass('fa-specimen', rendered)} lang="fa" dir="rtl">
      {rendered}
    </p>
  )
}

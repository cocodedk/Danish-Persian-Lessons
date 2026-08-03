import { useParams, Link } from 'react-router-dom'
import { LESSON_PLACEHOLDER_TEXT } from '../content/faStrings'

/** Placeholder for #/lesson/:id — real lesson content arrives with plans 003/004. */
export default function LessonPlaceholder() {
  const { id } = useParams()

  return (
    <main className="lesson-placeholder">
      <p lang="fa" dir="rtl">
        {LESSON_PLACEHOLDER_TEXT}
      </p>
      <p lang="da">Lektion {id} er her snart.</p>
      <Link to="/">Til forsiden</Link>
    </main>
  )
}

import { useParams, Link } from 'react-router-dom'

/** Placeholder for #/lesson/:id — real lesson content arrives with plans 003/004. */
export default function LessonPlaceholder() {
  const { id } = useParams()

  return (
    <main className="lesson-placeholder">
      <p lang="fa" dir="rtl">
        این درس هنوز آماده نیست.
      </p>
      <p lang="da">Lektion {id} er her snart.</p>
      <Link to="/">Til forsiden</Link>
    </main>
  )
}

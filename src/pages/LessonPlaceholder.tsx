import { useParams, Link } from 'react-router-dom'
import { LESSON_PLACEHOLDER_ENTRY } from '../content/faStrings'
import { CompactPhraseRow } from '../components/EntryRenderers'

/** Placeholder for #/lesson/:id — real lesson content arrives with plans 003/004. */
export default function LessonPlaceholder() {
  const { id } = useParams()

  return (
    <main className="lesson-placeholder">
      <CompactPhraseRow entry={LESSON_PLACEHOLDER_ENTRY} />
      <p lang="da">Lektion {id} er her snart.</p>
      <Link to="/">Til forsiden</Link>
    </main>
  )
}

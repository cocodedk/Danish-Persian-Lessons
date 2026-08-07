import { lazy, Suspense } from 'react'
import './LessonImage.css'

const LessonImageRenderer = lazy(() => import('./LessonImageRenderer'))
const PILOT_ENTRY = /^vocabulary-(1-(ab|nan)|2-(medad|ketab|miz|dar)|3-(khane|gol))$/

export function LessonImage({
  entryId,
  eager = false,
}: {
  entryId: string
  eager?: boolean
}) {
  if (!PILOT_ENTRY.test(entryId)) return null
  return (
    <Suspense fallback={<div className="lesson-image lesson-image--loading" aria-hidden="true" />}>
      <LessonImageRenderer entryId={entryId} eager={eager} />
    </Suspense>
  )
}

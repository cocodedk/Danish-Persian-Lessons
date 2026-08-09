import { lazy, Suspense } from 'react'
import { lessonImageForEntry } from '../images/catalog'
import './LessonImage.css'

const LessonImageRenderer = lazy(() => import('./LessonImageRenderer'))

export function LessonImage({
  entryId,
  eager = false,
}: {
  entryId: string
  eager?: boolean
}) {
  if (!lessonImageForEntry(entryId)) return null
  return (
    <Suspense fallback={<div className="lesson-image lesson-image--loading" aria-hidden="true" />}>
      <LessonImageRenderer entryId={entryId} eager={eager} />
    </Suspense>
  )
}

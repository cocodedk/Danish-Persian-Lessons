import { lazy, Suspense } from 'react'
import { lessonImageForEntry } from '../images/catalog'
import './LessonImage.css'

const LessonImageRenderer = lazy(() => import('./LessonImageRenderer'))

export function LessonImage({
  entryId,
  eager = false,
  size = 'teaching',
}: {
  entryId: string
  eager?: boolean
  size?: 'teaching' | 'thumbnail'
}) {
  if (!lessonImageForEntry(entryId)) return null
  return (
    <Suspense fallback={<div className={`lesson-image lesson-image--${size} lesson-image--loading`} aria-hidden="true" />}>
      <LessonImageRenderer entryId={entryId} eager={eager} size={size} />
    </Suspense>
  )
}

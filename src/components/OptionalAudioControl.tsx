import { lazy, Suspense } from 'react'
import { findPronunciationAudio } from '../audio/manifest'

const LazyAudioControl = lazy(async () => {
  const module = await import('./AudioControl')
  return { default: module.AudioControl }
})

/** Loads player code only when a reviewed local recording actually exists. */
export function OptionalAudioControl({ audioId }: { audioId?: string }) {
  if (!findPronunciationAudio(audioId)) return null
  return <Suspense fallback={null}><LazyAudioControl audioId={audioId} /></Suspense>
}

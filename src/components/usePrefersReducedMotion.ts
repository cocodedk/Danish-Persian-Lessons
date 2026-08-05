import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function media(): MediaQueryList | undefined {
  return typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : undefined
}

function subscribe(onChange: () => void): () => void {
  const list = media()
  list?.addEventListener('change', onChange)
  return () => list?.removeEventListener('change', onChange)
}

/**
 * True when the learner has asked their device for less motion. Teaching
 * animations then fall back to numbered step diagrams — the lesson is never
 * withheld, only un-animated. See docs/design/ART-DIRECTION.md "Motion".
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => media()?.matches ?? false,
    () => false,
  )
}

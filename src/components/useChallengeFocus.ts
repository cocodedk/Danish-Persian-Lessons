import { useRef } from 'react'

/** Restores the learner's point of regard after a Retry action changes the UI. */
export function useChallengeFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const focus = () => window.requestAnimationFrame(() => ref.current?.focus())
  return [ref, focus] as const
}

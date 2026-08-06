import { useLayoutEffect, useRef } from 'react'

/** Keeps post-attempt teaching feedback in the learner's current point of view. */
export function useRevealInView(visible: boolean | string | number) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!visible) return
    const frame = window.requestAnimationFrame(() => {
      const reveal = ref.current
      if (!reveal) return
      const rect = reveal.getBoundingClientRect()
      const foot = document.querySelector<HTMLElement>('.lesson-foot')
      const viewportBottom = foot?.getBoundingClientRect().top ?? window.innerHeight
      const visibleHeight = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, 0)
      const usefulHeight = Math.min(rect.height, 160)
      if (rect.top < 0 || visibleHeight < usefulHeight) {
        reveal.scrollIntoView?.({ block: 'start', inline: 'nearest', behavior: 'auto' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [visible])

  return ref
}

import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const scrollPositions = new Map<string, number>()

/**
 * HashRouter does not provide document navigation semantics on its own. This
 * restores them: forward routes start at their heading, while browser history
 * returns to the prior reading position.
 */
export function RouteEffects() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const activeKey = useRef(location.key)

  useLayoutEffect(() => {
    activeKey.current = location.key
    const top = navigationType === 'POP' ? (scrollPositions.get(location.key) ?? 0) : 0
    window.scrollTo({ top, left: 0, behavior: 'auto' })

    let observer: MutationObserver | undefined
    const focusRoute = () => {
      const heading = document.querySelector<HTMLElement>('main h1')
      const main = document.querySelector<HTMLElement>('main')
      const target = heading ?? main
      const title = heading?.textContent?.trim() || 'Lær persisk skrift'
      document.title = `${title} · Lær persisk`
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
      return Boolean(heading)
    }

    const frame = window.requestAnimationFrame(() => {
      if (focusRoute()) return

      observer = new MutationObserver(() => {
        if (focusRoute()) observer?.disconnect()
      })
      observer.observe(document.body, { childList: true, subtree: true })
    })

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      scrollPositions.set(activeKey.current, window.scrollY)
    }
  }, [location.key, navigationType])

  return null
}

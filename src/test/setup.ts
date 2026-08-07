import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { resetMemoryCache } from '../progress/storage'

// storage.ts keeps a write-through memory cache (round 4) so a throwing write
// never lets a stale localStorage value resurface. No app code ever calls
// `localStorage.clear()` — only tests do, to start each case from a blank
// slate — so that is wired here, once, to also drop the cache; otherwise a
// case would keep reading back a previous case's write regardless of the
// clear. Real sessions never clear storage, so this changes nothing at runtime.
const nativeClear = Storage.prototype.clear
Storage.prototype.clear = function clear(this: Storage) {
  resetMemoryCache()
  return nativeClear.call(this)
}

// jsdom has no layout viewport. Route semantics are tested through the calls,
// while browser geometry belongs to Playwright.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'scrollY', { value: 0, writable: true })

afterEach(() => {
  cleanup()
})

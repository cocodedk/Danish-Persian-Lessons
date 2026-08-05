// The moves both halves of the name-lesson suite make: open the route on a
// fresh App, tap a tile, play the exercise through. Test-only — the file is not
// named *.test.tsx, so vitest collects nothing from it and nothing in the app
// imports it. It exists so the two suites can stay under the line cap without
// keeping two copies of the same four helpers.
import { beforeEach, afterEach, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { nameGlyphs } from '../name/bank'

let unmountLast: (() => void) | null = null

/** Registers the per-test reset: empty storage, no hash, no stubbed globals. */
export function freshAppPerTest(): void {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
    unmountLast = null
  })

  afterEach(() => {
    unmountLast = null
    vi.unstubAllGlobals()
  })
}

/** A fresh App at `hash`, with whatever was on screen before torn down first. */
export function open(hash: string): void {
  unmountLast?.()
  window.location.hash = hash
  unmountLast = render(<App />).unmount
}

/** Taps the next free tile carrying `glyph`. */
export function tapTile(glyph: string): void {
  const tile = screen
    .getAllByText(glyph)
    .map((element) => element.closest('button'))
    .find((button): button is HTMLButtonElement => button !== null && !button.disabled)
  expect(tile, `no free tile for ${glyph}`).toBeTruthy()
  fireEvent.click(tile as HTMLButtonElement)
}

/** Plays the whole exercise correctly, letter by letter. */
export function assemble(spelling: string): void {
  for (const glyph of nameGlyphs(spelling)) tapTile(glyph)
}

/** Answers every media query about motion the way a learner who wants less would. */
export function wantsLessMotion(): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

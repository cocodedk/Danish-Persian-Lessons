// When each pen path starts and how long it takes. Kept out of the component
// so the "<1.5s per teaching animation" rule in ART-DIRECTION.md is a number a
// test can read, not a promise buried in CSS.
import type { Stroke } from '../lessons/types'

const BODY_MS = 560
const DOT_MS = 170
const GAP_MS = 60

export interface Timing {
  start: number
  duration: number
}

export function drawTimings(strokes: Stroke[]): Timing[] {
  let at = 0
  return strokes.map((stroke) => {
    const duration = stroke.kind === 'dot' ? DOT_MS : BODY_MS
    const timing = { start: at, duration }
    at += duration + GAP_MS
    return timing
  })
}

/** How long the whole letter takes to draw, in ms. */
export function drawDuration(strokes: Stroke[]): number {
  const timings = drawTimings(strokes)
  const last = timings.at(-1)
  return last ? last.start + last.duration : 0
}

import { describe, it, expect } from 'vitest'
import { STROKES, BODY_GROUPS, sameBodyAs } from './index'
import { teachingOrder, specimens } from '../alphabet'
import type { Stroke } from '../types'

/** How many dots each letter really carries. A teacher would mark any change here. */
const DOT_COUNT: Record<string, number> = {
  alef: 0,
  'alef-madde': 0,
  be: 1,
  pe: 3,
  te: 2,
  se: 3,
  jim: 1,
  che: 3,
  'he-jimi': 0,
  khe: 1,
  dal: 0,
  zal: 1,
  re: 0,
  ze: 1,
  zhe: 3,
  sin: 0,
  shin: 3,
  sad: 0,
  zad: 1,
  ta: 0,
  za: 1,
  eyn: 0,
  gheyn: 1,
  fe: 1,
  ghaf: 2,
  kaf: 0,
  gaf: 0,
  lam: 0,
  mim: 0,
  nun: 1,
  vav: 0,
  he: 0,
  ye: 0,
}

/** Every number in a path, in order. */
function numbers(d: string): number[] {
  return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
}

function firstPoint(d: string): { x: number; y: number } {
  const [x, y] = numbers(d)
  return { x, y }
}

const all = teachingOrder.map((id) => ({ id, strokes: STROKES[id] as Stroke[] }))

describe('stroke-order data', () => {
  it('draws every one of the 33 specimens', () => {
    for (const { id, strokes } of all) {
      expect(strokes, id).toBeDefined()
      expect(strokes.filter((s) => s.kind === 'stroke').length, id).toBeGreaterThan(0)
    }
    for (const id of teachingOrder) {
      expect(specimens[id].strokes).toBe(STROKES[id])
    }
  })

  it('puts every dot after every stroke — the pen finishes the letter first', () => {
    for (const { id, strokes } of all) {
      const lastStroke = strokes.map((s) => s.kind).lastIndexOf('stroke')
      const firstDot = strokes.map((s) => s.kind).indexOf('dot')
      if (firstDot !== -1) {
        expect(firstDot, `${id}: a dot is drawn before a stroke`).toBeGreaterThan(lastStroke)
      }
    }
  })

  it('carries the right number of dots for every letter', () => {
    for (const { id, strokes } of all) {
      expect(strokes.filter((s) => s.kind === 'dot').length, id).toBe(DOT_COUNT[id])
    }
  })

  it('enters every stroke on the right half — where Persian starts', () => {
    // ط ظ are the one real exception: the upright genuinely sits left of
    // centre in the isolated glyph (verified against the font's own outline
    // — its ink never crosses x≈40), so TA_BAR, the second stroke of both,
    // cannot honestly start on the right half. The loop (their first stroke)
    // still does.
    const LEFT_UPRIGHT_SECOND_STROKE = new Set(['ta', 'za'])
    for (const { id, strokes } of all) {
      for (const [index, path] of strokes.entries()) {
        if (path.kind !== 'stroke') continue
        if (LEFT_UPRIGHT_SECOND_STROKE.has(id) && index === 1) continue
        expect(firstPoint(path.d).x, `${id} path ${index}`).toBeGreaterThanOrEqual(50)
      }
    }
  })

  it('lays the dots of a group down right to left', () => {
    for (const { id, strokes } of all) {
      const dots = strokes.filter((s) => s.kind === 'dot').map((s) => firstPoint(s.d).x)
      if (dots.length > 1) {
        expect(Math.max(...dots), id).toBe(dots[0])
      }
    }
  })

  it('keeps every path inside the 100×100 sheet', () => {
    for (const { id, strokes } of all) {
      for (const value of strokes.flatMap((s) => numbers(s.d))) {
        expect(value, id).toBeGreaterThanOrEqual(0)
        expect(value, id).toBeLessThanOrEqual(100)
      }
    }
  })

  it('opens every path with a move — no path continues from the last one', () => {
    for (const { id, strokes } of all) {
      for (const path of strokes) {
        expect(path.d.startsWith('M '), `${id}: ${path.d.slice(0, 12)}`).toBe(true)
      }
    }
  })
})

describe('shared bodies', () => {
  it('really shares one body across each family — same path, different dots', () => {
    for (const group of BODY_GROUPS) {
      const bodies = group.map((id) => STROKES[id].filter((s) => s.kind === 'stroke'))
      const first = bodies[0][0].d
      for (const [index, body] of bodies.entries()) {
        expect(body[0].d, `${group[index]} vs ${group[0]}`).toBe(first)
      }
      const sequences = group.map((id) => STROKES[id].map((s) => s.d).join('|'))
      expect(new Set(sequences).size, group.join('/')).toBe(group.length)
    }
  })

  it('never claims two families share a shape', () => {
    const firstBodies = BODY_GROUPS.map((group) => STROKES[group[0]][0].d)
    expect(new Set(firstBodies).size).toBe(BODY_GROUPS.length)
  })

  it('adds a second stroke — not a dot — for ک and گ', () => {
    for (const id of ['kaf', 'gaf']) {
      const strokes = STROKES[id]
      expect(strokes, id).toHaveLength(2)
      expect(strokes.every((s) => s.kind === 'stroke'), id).toBe(true)
    }
    expect(STROKES.kaf[1].d).not.toBe(STROKES.gaf[1].d)
  })

  it('draws آ as the alef plus the madde, madde last', () => {
    expect(STROKES['alef-madde'][0].d).toBe(STROKES.alef[0].d)
    expect(STROKES['alef-madde']).toHaveLength(2)
  })

  it('offers the confusable letters as each others neighbours', () => {
    expect(sameBodyAs('be').sort()).toEqual(['pe', 'se', 'te'])
    expect(sameBodyAs('gaf')).toEqual(['kaf'])
    expect(sameBodyAs('lam')).toEqual([])
  })
})

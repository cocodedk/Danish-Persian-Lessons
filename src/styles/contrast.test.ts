import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8')

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!match) throw new Error(`Missing colour token ${name}`)
  return match[1]
}

function luminance(hex: string): number {
  const values = hex.match(/[0-9a-f]{2}/gi)!.map((pair) => Number.parseInt(pair, 16) / 255)
  const linear = values.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

function composite(foreground: string, background: string, alpha: number): string {
  const channels = (hex: string) => hex.match(/[0-9a-f]{2}/gi)!.map((pair) => Number.parseInt(pair, 16))
  const front = channels(foreground)
  const back = channels(background)
  return `#${front.map((value, index) =>
    Math.round(value * alpha + back[index] * (1 - alpha)).toString(16).padStart(2, '0'),
  ).join('')}`
}

describe('selected AAA colour contrast', () => {
  it.each(['light', 'dark'])('keeps every semantic text colour at 7:1 in %s mode', (scheme) => {
    for (const foreground of ['ink', 'blue', 'red', 'orange']) {
      for (const background of ['paper', 'card']) {
        expect(
          contrast(token(`${foreground}-${scheme}`), token(`${background}-${scheme}`)),
          `${foreground}-${scheme} on ${background}-${scheme}`,
        ).toBeGreaterThanOrEqual(7)
      }
    }
  })

  it.each(['light', 'dark'])('keeps quiet ink at 7:1 in %s mode', (scheme) => {
    for (const background of ['paper', 'card']) {
      const surface = token(`${background}-${scheme}`)
      expect(contrast(composite(token(`ink-${scheme}`), surface, 0.8), surface)).toBeGreaterThanOrEqual(7)
    }
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LetterDraw } from './LetterDraw'
import { drawDuration } from './letterDrawTiming'
import { specimens, teachingOrder } from '../lessons/alphabet'

/** Answers the reduced-motion media query the way a device would. */
function setReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))
}

const pe = specimens.pe // one body plus three dots — the busiest letter

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LetterDraw', () => {
  it('animates the sequence when motion is welcome, and can be replayed', () => {
    setReducedMotion(false)
    const { container } = render(<LetterDraw strokes={pe.strokes} name={pe.name.da} />)

    const sheet = container.querySelector('.letter-draw__sheet--live')
    expect(sheet).not.toBeNull()
    expect(sheet?.querySelectorAll('path')).toHaveLength(pe.strokes.length)
    expect(screen.getByRole('img', { name: 'Stregrækkefølge for pe' })).toBeInTheDocument()

    fireEvent.click(screen.getByText('Tegn igen'))
    expect(container.querySelectorAll('.letter-draw__sheet--live')).toHaveLength(1)
  })

  it('shows the numbered step diagram instead when the device asks for less motion', () => {
    setReducedMotion(true)
    const { container } = render(<LetterDraw strokes={pe.strokes} name={pe.name.da} />)

    expect(container.querySelector('.letter-draw__sheet--live')).toBeNull()
    expect(screen.queryByText('Tegn igen')).not.toBeInTheDocument()

    const steps = screen.getByRole('list', { name: 'Stregrækkefølge for pe, trin for trin' })
    expect(steps.children).toHaveLength(pe.strokes.length)
    // Numbered in Persian digits, and each step shows one more path than the last.
    expect(screen.getByText('۱')).toBeInTheDocument()
    expect(screen.getByText('۴')).toBeInTheDocument()
    const counts = [...steps.children].map((step) => step.querySelectorAll('path').length)
    expect(counts).toEqual([1, 2, 3, 4])
  })

  it('marks exactly the newest stroke of each step in the teachers red', () => {
    setReducedMotion(true)
    const { container } = render(<LetterDraw strokes={pe.strokes} name={pe.name.da} />)
    for (const step of container.querySelectorAll('.letter-draw__step')) {
      expect(step.querySelectorAll('.letter-draw__path--live')).toHaveLength(1)
    }
  })

  it('draws every letter in under the 1.5s a teaching animation is allowed', () => {
    for (const id of teachingOrder) {
      expect(drawDuration(specimens[id].strokes), id).toBeLessThan(1500)
      expect(drawDuration(specimens[id].strokes), id).toBeGreaterThan(0)
    }
  })
})

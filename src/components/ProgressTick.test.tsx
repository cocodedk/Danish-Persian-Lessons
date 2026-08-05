import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressTick } from './ProgressTick'
import css from './ProgressTick.css?raw'

/** Just the reduced-motion at-rule, up to the next one. */
const reducedMotionBlock =
  css.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\n}\n/)?.[0] ?? ''

describe('ProgressTick', () => {
  it('draws the tick once it is granted', () => {
    render(<ProgressTick granted />)
    expect(screen.getByRole('img', { name: 'Klaret' })).toBeInTheDocument()
  })

  it('says what the tick is for, in the caller words when given', () => {
    render(<ProgressTick granted label="Bogstavet er klaret" />)
    expect(screen.getByRole('img', { name: 'Bogstavet er klaret' })).toBeInTheDocument()
  })

  it('holds a silent, unannounced slot until it is granted', () => {
    const { container } = render(<ProgressTick granted={false} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(container.querySelector('.progress-tick')).not.toBeNull()
    expect(container.querySelector('.progress-tick--granted')).toBeNull()
  })

  it('is granted instantly under reduced motion — only the stamp is dropped', () => {
    expect(reducedMotionBlock).not.toBe('')
    expect(reducedMotionBlock).not.toContain('forced-colors')
    expect(reducedMotionBlock).toContain('animation: none')
    // A reward is never withheld: the reduced-motion branch must not hide it.
    expect(reducedMotionBlock).not.toContain('display: none')
    expect(reducedMotionBlock).not.toContain('visibility: hidden')
    expect(reducedMotionBlock).not.toContain('opacity: 0')
  })

  it('stamps in well under the 1.5s ceiling for celebration motion', () => {
    const duration = css.match(/animation: progress-tick-stamp (\d+)ms/)
    expect(duration).not.toBeNull()
    expect(Number(duration?.[1])).toBeLessThan(1500)
  })
})

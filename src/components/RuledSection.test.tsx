import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RuledSection } from './RuledSection'
import css from './RuledSection.css?raw'

describe('RuledSection', () => {
  it('renders its content on the sheet', () => {
    render(<RuledSection>Skriv dit navn på linjen.</RuledSection>)
    expect(screen.getByText('Skriv dit navn på linjen.')).toBeInTheDocument()
  })

  it('carries the reading direction and language it is given', () => {
    const { container } = render(
      <RuledSection dir="rtl" lang="fa">
        روی خط بنویس.
      </RuledSection>,
    )
    const sheet = container.querySelector('.ruled-section')
    expect(sheet).toHaveAttribute('dir', 'rtl')
    expect(sheet).toHaveAttribute('lang', 'fa')
  })

  it('draws exactly one red margin line', () => {
    const redRules = css.match(/var\(--red\)/g) ?? []
    expect(redRules).toHaveLength(1)
    expect(css).toContain('.ruled-section::before')
  })

  it('places that margin line with a logical inset, so dir="rtl" mirrors it to the right', () => {
    expect(css).toContain('inset-inline-start')
    // A physical left/right anywhere in this file would pin the margin line to
    // one side and break the mirroring the whole concept rests on.
    const physical = css.match(/^\s*(left|right)\s*:/gm) ?? []
    expect(physical).toEqual([])
    expect(css).not.toContain('padding-left')
    expect(css).not.toContain('padding-right')
  })

  it('rules the sheet on the --rule-step rhythm from the tokens', () => {
    expect(css).toContain('var(--rule-step)')
    expect(css).toContain('var(--rule)')
  })
})

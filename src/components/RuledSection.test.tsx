import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RuledSection } from './RuledSection'
import css from './RuledSection.css?raw'

/** Every .css file in src, keyed by path. */
const stylesheets = import.meta.glob('../**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

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

  it('owns that line alone — nothing else in the app draws a margin line', () => {
    // Plan 003 step 1: SplitCard sits ON a sheet, it is not a sheet itself.
    // A red inline-start edge anywhere else is a second margin line.
    const offenders = Object.entries(stylesheets)
      .filter(([path]) => !path.endsWith('RuledSection.css'))
      .filter(([, sheet]) => /border-inline-start:[^;]*var\(--red\)/.test(sheet))
      .map(([path]) => path)
    expect(offenders).toEqual([])
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

  it('gives a lang="fa" sheet the Persian UI face at the body-text floor, cascade-resolved', () => {
    // Load the component's own stylesheet for real, so this checks what the
    // cascade actually does for a lang="fa" element — not just that the right
    // text appears somewhere in the file. (jsdom resolves selector cascade and
    // specificity for computed style; it does not substitute custom properties,
    // so the Persian token surfaces as the literal `var(--font-fa)` reference
    // rather than the resolved 'Vazirmatn, ...' stack.)
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    try {
      const { container } = render(
        <RuledSection dir="rtl" lang="fa">
          روی خط بنویس.
        </RuledSection>,
      )
      const sheet = container.querySelector('.ruled-section')!
      const computed = getComputedStyle(sheet)

      expect(computed.fontFamily).toContain('var(--font-fa)')
      expect(parseFloat(computed.fontSize)).toBeGreaterThanOrEqual(18)
    } finally {
      style.remove()
    }
  })
})

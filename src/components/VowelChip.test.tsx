import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VowelChip } from './VowelChip'

describe('VowelChip', () => {
  it('renders the letter as Persian, right to left', () => {
    const { container } = render(<VowelChip glyph="اَ" />)
    const glyph = container.querySelector('.vowel-chip__glyph')
    expect(glyph).toHaveAttribute('lang', 'fa')
    expect(glyph).toHaveAttribute('dir', 'rtl')
    expect(glyph?.textContent).toBe('اَ')
  })

  it('paints زبر above the letter and زیر below it', () => {
    const { container: above } = render(<VowelChip glyph="اَ" />)
    expect(above.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--above')

    const { container: below } = render(<VowelChip glyph="اِ" />)
    expect(below.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--below')
  })

  it('shows the pronunciation caption from lesson data, in Danish and left to right', () => {
    render(<VowelChip glyph="اَ" caption={{ da: 'a', ipa: 'æ' }} />)
    const caption = screen.getByText('a · [æ]')
    expect(caption).toHaveAttribute('lang', 'da')
    expect(caption).toHaveAttribute('dir', 'ltr')
  })

  it('leaves the caption out when the lesson has none', () => {
    const { container } = render(<VowelChip glyph="اَ" />)
    expect(container.querySelector('.pron-line')).toBeNull()
  })
})

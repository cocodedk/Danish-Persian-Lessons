import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VowelChip } from './VowelChip'
import { vowelMarks } from '../lessons/vowelMarks'

const [zebar, zir] = vowelMarks

describe('VowelChip', () => {
  it('renders the letter as Persian, right to left', () => {
    const { container } = render(<VowelChip entry={zebar.entry} />)
    const glyph = container.querySelector('.vowel-chip__glyph')
    expect(glyph).toHaveAttribute('lang', 'fa')
    expect(glyph).toHaveAttribute('dir', 'rtl')
    expect(glyph?.textContent).toBe('اَ')
  })

  it('paints زبر above the letter and زیر below it', () => {
    const { container: above } = render(<VowelChip entry={zebar.entry} />)
    expect(above.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--above')

    const { container: below } = render(<VowelChip entry={zir.entry} />)
    expect(below.querySelector('.vowel-chip__glyph')?.className).toContain('pen-mark--below')
  })

  it('shows the pronunciation caption from lesson data, in Danish and left to right', () => {
    render(<VowelChip entry={zebar.entry} />)
    const caption = screen.getByText('a i "kat" · [æ]')
    expect(caption).toHaveAttribute('lang', 'da')
    expect(caption).toHaveAttribute('dir', 'ltr')
  })

  it('never leaves a teaching mark without pronunciation help', () => {
    const { container } = render(<VowelChip entry={zebar.entry} />)
    expect(container.querySelectorAll('.pron-line')).toHaveLength(1)
  })
})

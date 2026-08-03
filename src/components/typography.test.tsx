import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import faCss from './FaSpecimen.css?raw'

describe('FaSpecimen', () => {
  it('renders the diacriticized spelling when the lesson supplies one', () => {
    render(<FaSpecimen fa="اب" faMarked="آب" />)
    expect(screen.getByText('آب')).toBeInTheDocument()
    expect(screen.queryByText('اب')).toBeNull()
  })

  it('falls back to the plain spelling', () => {
    render(<FaSpecimen fa="کتاب" />)
    expect(screen.getByText('کتاب')).toBeInTheDocument()
  })

  it('is Persian, right to left', () => {
    const { container } = render(<FaSpecimen fa="آب" />)
    const specimen = container.querySelector('.fa-specimen')
    expect(specimen).toHaveAttribute('lang', 'fa')
    expect(specimen).toHaveAttribute('dir', 'rtl')
  })

  it('puts the madde in the teacher red, and nothing on an unmarked word', () => {
    const { container: marked } = render(<FaSpecimen fa="آب" />)
    expect(marked.querySelector('.fa-specimen')?.className).toContain('pen-mark--above')

    const { container: plain } = render(<FaSpecimen fa="کتاب" />)
    expect(plain.querySelector('.fa-specimen')?.className).toBe('fa-specimen')
  })

  it('gives the diacritics air: line-height 2 at the clamp scale', () => {
    expect(faCss).toContain('line-height: 2')
    expect(faCss).toContain('clamp(4.5rem, 20vw, 9rem)')
  })
})

describe('PronLine', () => {
  it('says the pronunciation twice: dansk lydskrift, then IPA', () => {
    render(<PronLine da="åb" ipa="ɒːb" />)
    expect(screen.getByText('åb · [ɒːb]')).toBeInTheDocument()
  })

  it('is Danish text left to right, even inside the Persian pane', () => {
    render(<PronLine da="åb" ipa="ɒːb" />)
    const line = screen.getByText('åb · [ɒːb]')
    expect(line).toHaveAttribute('lang', 'da')
    expect(line).toHaveAttribute('dir', 'ltr')
  })
})

describe('DaWord', () => {
  it('renders the Danish word, marked as Danish', () => {
    render(<DaWord>vand</DaWord>)
    const word = screen.getByText('vand')
    expect(word).toHaveAttribute('lang', 'da')
    expect(word).toHaveAttribute('dir', 'ltr')
  })
})

describe('RuleDivider', () => {
  it('is one notebook rule', () => {
    const { container } = render(<RuleDivider />)
    const rules = container.querySelectorAll('hr.rule-divider')
    expect(rules).toHaveLength(1)
  })
})

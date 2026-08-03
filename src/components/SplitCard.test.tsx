import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SplitCard } from './SplitCard'
import { DEMO_WORD } from '../content/demoWord'

function renderCard() {
  return render(<SplitCard word={DEMO_WORD} faGreeting="سلام!" daGreeting="Hej Sara!" />)
}

describe('SplitCard after the kit refactor', () => {
  it('is a composition of the kit: specimen, pronunciation, one rule, Danish word', () => {
    const { container } = renderCard()
    expect(container.querySelectorAll('.fa-specimen')).toHaveLength(1)
    expect(container.querySelectorAll('.pron-line')).toHaveLength(1)
    expect(container.querySelectorAll('hr.rule-divider')).toHaveLength(1)
    expect(container.querySelectorAll('.da-word')).toHaveLength(1)
  })

  it('keeps the specimen and its pronunciation inside the Persian pane', () => {
    const { container } = renderCard()
    const faPane = container.querySelector('.split-card__pane--fa')
    expect(faPane?.querySelector('.fa-specimen')).not.toBeNull()
    expect(faPane?.querySelector('.pron-line')).not.toBeNull()
    expect(faPane?.querySelector('.da-word')).toBeNull()
  })

  it('still renders exactly what plan 001 shipped', () => {
    renderCard()
    expect(screen.getByText('سلام!')).toBeInTheDocument()
    expect(screen.getByText('آب')).toBeInTheDocument()
    expect(screen.getByText('åb · [ɒːb]')).toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
    expect(screen.getByText('vand')).toBeInTheDocument()
  })
})

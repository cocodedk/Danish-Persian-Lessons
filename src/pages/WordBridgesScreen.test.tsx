import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import WordBridgesScreen from './WordBridgesScreen'

describe('the word-bridge lesson', () => {
  it('shows all proposed pairs without turning the clue into a rule', () => {
    render(<MemoryRouter><WordBridgesScreen /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Ord, der ligner' })).toBeInTheDocument()
    expect(screen.getByText(/Nogle persiske og danske ord ligner hinanden/)).toBeInTheDocument()
    expect(screen.getByText('دندان')).toBeInTheDocument()
    expect(screen.getByText('dandån · [dænˈdɒːn]')).toBeInTheDocument()
    expect(screen.getByText('ستاد')).toBeInTheDocument()
    expect(screen.getByText('setåd · [seˈtɒːd]')).toBeInTheDocument()
    expect(screen.getAllByText('بند')).toHaveLength(1)
    expect(screen.getByText('band · [bænd]')).toBeInTheDocument()
    expect(screen.getAllByText('bånd')).toHaveLength(1)
    expect(screen.getAllByText('سیل')).toHaveLength(1)
    expect(screen.getByText('seyl · [sejl]')).toBeInTheDocument()
    expect(screen.getAllByText('sejle')).toHaveLength(1)
    expect(screen.getByText(/ikke en regel for alle ord/)).toBeInTheDocument()
    expect(screen.queryByText('Læs trin for trin')).not.toBeInTheDocument()
  })

  it('keeps changed meanings and the water memory clue clear', () => {
    render(<MemoryRouter><WordBridgesScreen /></MemoryRouter>)

    expect(screen.getByText('De betyder det samme i dag: tand.')).toBeInTheDocument()
    expect(screen.getByText(/De betyder ikke det samme i dag/)).toBeInTheDocument()
    expect(screen.getByText(/persiske ord betyder hovedkontor/)).toBeInTheDocument()
    expect(screen.getByText(/En بند kan også være en mur, der holder vand/)).toBeInTheDocument()
    expect(screen.getByText(/بند betyder ikke vand eller flod/)).toBeInTheDocument()
    expect(screen.getByText(/De er ikke i samme gamle familie/)).toBeInTheDocument()
    expect(screen.getByText(/Byen sejlede i vand/)).toBeInTheDocument()
  })
})

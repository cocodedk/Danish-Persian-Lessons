import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PuzzleScreen from './PuzzleScreen'
import { alphabetGroups, puzzles } from '../puzzles/catalog'
import { completedPuzzles } from '../progress/puzzles'
import { getRewards } from '../rewards/engine'

function open(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/puslespil/${id}`]}>
      <Routes>
        <Route path="/puslespil/:id" element={<PuzzleScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function matchChoiceName(choice: { da: string; pron: { da: string; ipa: string } }) {
  return `${choice.da}${choice.pron.da} · [${choice.pron.ipa}]`
}

beforeEach(() => window.localStorage.clear())

describe('a simple puzzle route', () => {
  it('is skippable and hides the complete companion until an attempt', () => {
    const puzzle = alphabetGroups[0].puzzle
    const task = puzzle.tasks[0]
    open(puzzle.id)

    expect(screen.getByRole('link', { name: 'Spring over' })).toHaveAttribute('href', puzzle.backTo)
    expect(screen.queryByText('Se hele tegnet eller ordet')).not.toBeInTheDocument()

    if (task.kind !== 'match') throw new Error('first alphabet task must match')
    const wrong = task.choices.find((choice) => choice.id !== task.entry.id)!
    fireEvent.click(screen.getByRole('button', { name: matchChoiceName(wrong) }))

    expect(screen.getByText('Se hele tegnet eller ordet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prøv én gang til' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Næste' })).toBeInTheDocument()
  })

  it('renders ordering tiles RTL and keeps repeated glyph tiles independently tappable', () => {
    const puzzle = puzzles.find((item) =>
      item.tasks.some(
        (task) => task.kind === 'order' && new Set(task.entry.fa).size < [...task.entry.fa].length,
      ),
    )!
    const task = puzzle.tasks.find(
      (item) => item.kind === 'order' && new Set(item.entry.fa).size < [...item.entry.fa].length,
    )!
    if (task.kind !== 'order') throw new Error('duplicate order task required')
    const { container } = open(puzzle.id)

    const tiles = container.querySelector('.puzzle__tiles')
    expect(tiles).toHaveAttribute('dir', 'rtl')
    const duplicate = task.tiles.find((tile, at) =>
      task.tiles.some((other, otherAt) => otherAt !== at && other.glyph === tile.glyph),
    )!
    const buttons = screen.getAllByRole('button', { name: duplicate.entry.da })
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false')
    // A second tap on a placed tile does nothing — and steals no focus.
    fireEvent.click(buttons[0])
    expect(screen.getAllByRole('button', { name: duplicate.entry.da })[1]).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('pays the first completion once and makes the same break replayable', () => {
    const puzzle = alphabetGroups[0].puzzle
    open(puzzle.id)

    function finish() {
      for (let index = 0; index < puzzle.tasks.length; index += 1) {
        const task = puzzle.tasks[index]
        if (task.kind !== 'match') throw new Error('alphabet puzzles only match')
        fireEvent.click(screen.getByRole('button', { name: matchChoiceName(task.entry) }))
        fireEvent.click(
          screen.getByRole('button', {
            name: index === puzzle.tasks.length - 1 ? 'Afslut pausen' : 'Næste',
          }),
        )
      }
    }

    finish()
    const firstPoints = getRewards().points
    expect(firstPoints).toBeGreaterThan(0)
    expect(completedPuzzles()).toEqual([puzzle.id])

    fireEvent.click(screen.getByRole('button', { name: 'Spil igen' }))
    finish()
    expect(getRewards().points).toBe(firstPoints)
    expect(completedPuzzles()).toEqual([puzzle.id])
  })
})

describe('a partial round', () => {
  it('pays nothing, and a clean replay after it still pays once', () => {
    const puzzle = alphabetGroups[0].puzzle
    open(puzzle.id)

    function play(missFirst: boolean) {
      for (let index = 0; index < puzzle.tasks.length; index += 1) {
        const task = puzzle.tasks[index]
        if (task.kind !== 'match') throw new Error('alphabet puzzles only match')
        const choice =
          missFirst && index === 0
            ? task.choices.find((item) => item.id !== task.entry.id)!
            : task.entry
        fireEvent.click(screen.getByRole('button', { name: matchChoiceName(choice) }))
        fireEvent.click(
          screen.getByRole('button', {
            name: index === puzzle.tasks.length - 1 ? 'Afslut pausen' : 'Næste',
          }),
        )
      }
    }

    play(true)
    expect(screen.getByText(/God pause/)).toBeInTheDocument()
    expect(completedPuzzles()).toEqual([])
    expect(getRewards().points).toBe(0)

    fireEvent.click(screen.getByRole('button', { name: 'Spil igen' }))
    play(false)
    expect(completedPuzzles()).toEqual([puzzle.id])
    expect(getRewards().points).toBeGreaterThan(0)
  })
})

describe('a missing-letter puzzle', () => {
  it('shows the gap and the right letter solves every task', () => {
    const puzzle = puzzles.find((item) => item.tasks[0]?.kind === 'missing')!
    open(puzzle.id)

    puzzle.tasks.forEach((task, index) => {
      if (task.kind !== 'missing') throw new Error('missing puzzle only')
      const shown = [...task.entry.fa]
      shown[task.missingAt] = '□'
      expect(screen.getByText(shown.join(''))).toBeInTheDocument()

      const answer = [...task.entry.fa][task.missingAt]
      const right = task.choices.find((choice) => choice.fa === answer)!
      fireEvent.click(screen.getByRole('button', { name: right.da }))
      expect(screen.queryByRole('button', { name: 'Prøv én gang til' })).not.toBeInTheDocument()
      fireEvent.click(
        screen.getByRole('button', {
          name: index === puzzle.tasks.length - 1 ? 'Afslut pausen' : 'Næste',
        }),
      )
    })
    expect(completedPuzzles()).toContain(puzzle.id)
  })
})

describe('an ordering puzzle', () => {
  it('retry clears the tiles, and the original order completes the task', () => {
    const puzzle = puzzles.find((item) => item.tasks[0]?.kind === 'order')!
    const { container } = open(puzzle.id)
    const tileButtons = () =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('.puzzle__tiles button'))

    for (let index = 0; index < puzzle.tasks.length; index += 1) {
      const task = puzzle.tasks[index]
      if (task.kind !== 'order') throw new Error('order puzzle only')

      // Tray order is rotated, so tapping it left to right is always wrong.
      tileButtons().forEach((button) => fireEvent.click(button))
      fireEvent.click(screen.getByRole('button', { name: 'Se efter' }))
      expect(screen.getByText('Se hele tegnet eller ordet')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: 'Prøv én gang til' }))
      expect(container.querySelector('.puzzle__assembled')?.textContent).toBe('')
      tileButtons().forEach((button) => expect(button).toHaveAttribute('aria-pressed', 'false'))

      // The word's own order, recovered from the tile ids' original indexes.
      const inOrder = [...task.tiles].sort(
        (a, b) => Number(a.id.split('-tile-')[1]) - Number(b.id.split('-tile-')[1]),
      )
      for (const tile of inOrder) fireEvent.click(tileButtons()[task.tiles.indexOf(tile)])
      fireEvent.click(screen.getByRole('button', { name: 'Se efter' }))
      fireEvent.click(
        screen.getByRole('button', {
          name: index === puzzle.tasks.length - 1 ? 'Afslut pausen' : 'Næste',
        }),
      )
    }
    expect(completedPuzzles()).toContain(puzzle.id)
  })
})

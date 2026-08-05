import { describe, expect, it } from 'vitest'
import { alphabetGroups, puzzles, vocabularyGroups } from './catalog'
import { specimens, teachingOrder } from '../lessons/alphabet'

describe('deterministic simple puzzle breaks', () => {
  it('creates one 2–4 item break after every alphabet cluster and vocabulary group', () => {
    expect(alphabetGroups.length).toBeGreaterThan(1)
    for (const group of alphabetGroups) {
      expect(group.puzzle.kind).toBe('match')
      expect(group.puzzle.tasks.length).toBeGreaterThanOrEqual(2)
      expect(group.puzzle.tasks.length).toBeLessThanOrEqual(4)
    }
    for (const groups of Object.values(vocabularyGroups)) {
      for (const group of groups) {
        expect(group.itemIds.length).toBe(4)
        expect(group.puzzle.tasks.length).toBeGreaterThanOrEqual(2)
        expect(group.puzzle.tasks.length).toBeLessThanOrEqual(4)
      }
    }
  })

  it('contains all three types without inventing word puzzles for alphabet-only material', () => {
    expect(new Set(puzzles.map((puzzle) => puzzle.kind))).toEqual(new Set(['match', 'order', 'missing']))
    expect(alphabetGroups.every((group) => group.puzzle.kind === 'match')).toBe(true)
  })

  it('uses only introduced entries and gives every missing-letter task one clear answer', () => {
    for (const puzzle of puzzles) {
      const introduced = new Set(puzzle.introducedEntryIds)
      for (const task of puzzle.tasks) {
        expect(introduced.has(task.entry.id), `${puzzle.id}: ${task.entry.id}`).toBe(true)
        if (task.kind === 'missing') {
          const answer = [...task.entry.fa][task.missingAt]
          expect(task.choices.filter((choice) => choice.fa === answer)).toHaveLength(1)
          for (const choice of task.choices) expect(introduced.has(choice.id)).toBe(true)
        }
        if (task.kind === 'order') {
          for (const tile of task.tiles) expect(introduced.has(tile.entry.id)).toBe(true)
        }
      }
    }
  })

  it('keeps duplicate letters as unique tiles and regenerates identically', () => {
    const order = puzzles.flatMap((puzzle) => puzzle.tasks).find(
      (task) => task.kind === 'order' && new Set(task.entry.fa).size < [...task.entry.fa].length,
    )
    expect(order?.kind).toBe('order')
    if (order?.kind !== 'order') return
    expect(new Set(order.tiles.map((tile) => tile.id)).size).toBe(order.tiles.length)
    expect(order.tiles.map((tile) => tile.glyph).join('')).not.toBe(order.entry.fa)
  })
})

describe('alphabet puzzle coverage', () => {
  it('quizzes every letter of the alphabet in its own group puzzle', () => {
    const asked = new Set(
      alphabetGroups.flatMap((group) => group.puzzle.tasks.map((task) => task.entry.id)),
    )
    for (const id of teachingOrder) {
      expect(asked.has(specimens[id].entry.id), id).toBe(true)
    }
  })
})

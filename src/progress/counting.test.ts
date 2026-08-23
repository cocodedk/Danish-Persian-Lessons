import { describe, it, expect, beforeEach } from 'vitest'
import { getCountingProgress, markCountingDone, learnCountingItem, countingDoneCount } from './counting'
import { countingNumbers } from '../lessons/numbers'

beforeEach(() => {
  window.localStorage.clear()
})

describe('counting progress', () => {
  it('starts empty and reads back what was learned', () => {
    expect(getCountingProgress()).toEqual({ words: [], paid: false })
    markCountingDone('number-1-word')
    expect(getCountingProgress().words).toEqual(['number-1-word'])
  })

  it('is add-only: learning the same item twice changes nothing', () => {
    markCountingDone('number-1-word')
    markCountingDone('number-1-word')
    expect(getCountingProgress().words).toEqual(['number-1-word'])
  })

  it('ignores ids that are not counting entries', () => {
    markCountingDone('not-a-number')
    expect(getCountingProgress().words).toEqual([])
  })

  it('pays items as answer/item, and the last one as the page — once', () => {
    const items = countingNumbers.map(({ word }) => word.id)
    for (const id of items.slice(0, -1)) {
      expect(learnCountingItem(id), id).toBe('item')
    }
    expect(learnCountingItem(items[items.length - 1])).toBe('page')
    // Replaying the round never pays the page — or a stale item — twice.
    expect(learnCountingItem(items[0])).toBe('answer')
    expect(learnCountingItem(items[items.length - 1])).toBe('answer')
  })

  it('counts only entries that belong to the lesson', () => {
    markCountingDone('number-1-word')
    markCountingDone('vocabulary-1-ab')
    expect(countingDoneCount()).toBe(1)
  })
})

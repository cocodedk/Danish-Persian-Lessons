import { describe, it, expect, beforeEach } from 'vitest'
import {
  getVocabProgress,
  markWordDone,
  unitDoneCount,
  isUnitDone,
  learnWord,
} from './vocab'
import { vocabUnits, findVocabUnit } from '../lessons/vocab'

const unit = findVocabUnit('1')!

/** Clears every word in the unit but the last one. */
function allButLast(): string {
  const last = unit.words[unit.words.length - 1]
  for (const word of unit.words) {
    if (word.id !== last.id) markWordDone(unit.id, word.id)
  }
  return last.id
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('vocabulary progress', () => {
  it('starts empty and reads back what was cleared, per unit', () => {
    expect(getVocabProgress(unit.id)).toEqual({ words: [], paid: false })

    markWordDone('1', 'ab')
    expect(getVocabProgress('1').words).toEqual(['ab'])
    // Units keep their own key — `dpl.v1.vocab.<unit>`.
    expect(getVocabProgress('2').words).toEqual([])
  })

  it('is add-only: clearing the same word twice changes nothing', () => {
    markWordDone(unit.id, 'ab')
    markWordDone(unit.id, 'ab')
    expect(getVocabProgress(unit.id).words).toEqual(['ab'])
  })

  it('counts only the words that belong to the unit', () => {
    markWordDone(unit.id, 'ab')
    markWordDone(unit.id, 'not-a-word')
    expect(unitDoneCount(unit)).toBe(1)
    expect(isUnitDone(unit)).toBe(false)
  })

  it('pays a word as an item, and the last one as the unit\'s page', () => {
    for (const word of unit.words.slice(0, -1)) {
      expect(learnWord(unit, word.id), word.id).toBe('item')
    }
    expect(learnWord(unit, unit.words[unit.words.length - 1].id)).toBe('page')
    expect(isUnitDone(unit)).toBe(true)
  })

  it('pays the page once — a second run through the finished unit is practice, not wages', () => {
    const last = allButLast()
    expect(learnWord(unit, last)).toBe('page')
    // Every word again, in any order: never a second page.
    for (const word of unit.words) {
      expect(learnWord(unit, word.id), word.id).toBe('item')
    }
  })

  it('survives a reload: the claim lives on disk, not in a component', () => {
    const last = allButLast()
    expect(learnWord(unit, last)).toBe('page')
    expect(getVocabProgress(unit.id).paid).toBe(true)

    // A reload is a fresh read of the same storage.
    const afterReload = getVocabProgress(unit.id)
    expect(afterReload.paid).toBe(true)
    expect(learnWord(unit, last)).toBe('item')
  })

  it('ignores corrupt storage rather than crashing on it', () => {
    window.localStorage.setItem('dpl.v1.vocab.1', 'not json')
    expect(getVocabProgress('1')).toEqual({ words: [], paid: false })
  })

  it('gives every unit its own page to claim', () => {
    for (const each of vocabUnits) {
      for (const word of each.words.slice(0, -1)) learnWord(each, word.id)
      expect(learnWord(each, each.words[each.words.length - 1].id), each.id).toBe('page')
    }
  })
})

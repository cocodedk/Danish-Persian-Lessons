import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createCountingRuleProgress, counting21to99Progress } from './countingRules'
import { getCountingProgress, learnCountingItem } from './counting'

const KEY = 'dpl.v1.counting.21-99'
const store = counting21to99Progress

beforeEach(() => {
  window.localStorage.clear()
})

/** Clears every id but the last, asserting each pays an `item`. */
function learnAllButLast(): string {
  const ids = store.ids
  for (const id of ids.slice(0, -1)) expect(store.learn(id), id).toBe('item')
  return ids[ids.length - 1]
}

describe('counting rule progress — the 21-99 store', () => {
  it('owns only this lesson\'s ids, on this lesson\'s key', () => {
    expect(store.key).toBe('counting.21-99')
    expect(store.ids.length).toBeGreaterThan(0)
    expect(store.ids.every((id) => id.startsWith('counting-2199-'))).toBe(true)
    // Pins the descriptor derivation: the joiner is taught here, the
    // foundation's own twenty is referenced but never owned.
    expect(store.ids).toContain('counting-2199-bindeled')
    expect(store.ids).not.toContain('number-20-word')
  })

  it('starts empty and reads back what was learned', () => {
    expect(store.get()).toEqual({ words: [], paid: false })
    const id = store.ids[0]
    store.markDone(id)
    expect(store.get().words).toEqual([id])
    expect(store.doneCount()).toBe(1)
  })

  it('is add-only: learning the same item twice changes nothing', () => {
    const id = store.ids[0]
    store.markDone(id)
    store.markDone(id)
    expect(store.get().words).toEqual([id])
  })

  it('pays items as answer/item, and the last one as the page — once', () => {
    const last = learnAllButLast()
    expect(store.learn(last)).toBe('page')
    expect(store.get().paid).toBe(true)
    // Replaying the round never pays the page — or a stale item — twice.
    expect(store.learn(store.ids[0])).toBe('answer')
    expect(store.learn(last)).toBe('answer')
    expect(store.doneCount()).toBe(store.ids.length)
  })

  it('persists the paid flag, so a reload cannot pay the page again', () => {
    const last = learnAllButLast()
    expect(store.learn(last)).toBe('page')
    const stored = JSON.parse(window.localStorage.getItem(KEY) ?? '{}')
    expect(stored.value.paid).toBe(true)
  })

  it('rejects ids from other lessons, and earns them no reward at all', () => {
    // `number-20-word` is the trap: the descriptor references the foundation's
    // own twenty as a base form, and that row stays the foundation's.
    for (const foreign of ['number-20-word', 'number-1-word', 'counting-100900-ti-300', 'nonsense']) {
      expect(store.learn(foreign), foreign).toBeNull()
      expect(store.markDone(foreign).words, foreign).toEqual([])
    }
    expect(store.get()).toEqual({ words: [], paid: false })
  })

  it('normalizes missing and corrupt storage instead of throwing', () => {
    expect(store.get()).toEqual({ words: [], paid: false })

    window.localStorage.setItem(KEY, '{not valid json')
    expect(store.get()).toEqual({ words: [], paid: false })

    // Stored shapes: the first three are corruption, the last one is a valid
    // record proving `paid` survives a round trip.
    const storedShapes = [
      { words: 'number-1-word', paid: 'yes' },
      { words: [42, null, { id: store.ids[0] }, store.ids[0], store.ids[0]], paid: 1 },
      {},
      { words: [], paid: true },
    ]
    const expected = [
      { words: [], paid: false },
      { words: [store.ids[0]], paid: false },
      { words: [], paid: false },
      { words: [], paid: true },
    ]
    storedShapes.forEach((value, index) => {
      window.localStorage.clear()
      window.localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, value }))
      expect(store.get(), JSON.stringify(value)).toEqual(expected[index])
    })
  })

  it('drops foreign ids that were somehow written into its own record', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ schemaVersion: 1, value: { words: ['number-20-word', store.ids[0]], paid: false } }),
    )
    expect(store.get().words).toEqual([store.ids[0]])
  })

  it('survives denied storage: the session still keeps what it learned', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied')
    })
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied')
    })

    const id = store.ids[0]
    expect(() => store.learn(id)).not.toThrow()
    expect(store.get().words).toEqual([id])
    expect(store.learn(id)).toBe('answer')

    setSpy.mockRestore()
    getSpy.mockRestore()
  })
})

describe('counting rule progress — isolation from the 1-20 foundation', () => {
  it('finishing 21-99 leaves the foundation untouched, and its key unwritten', () => {
    const last = learnAllButLast()
    expect(store.learn(last)).toBe('page')
    expect(getCountingProgress()).toEqual({ words: [], paid: false })
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
  })

  it('foundation progress never appears in the rule lesson', () => {
    expect(learnCountingItem('number-1-word')).toBe('item')
    expect(getCountingProgress().words).toEqual(['number-1-word'])
    expect(store.get()).toEqual({ words: [], paid: false })
    expect(store.doneCount()).toBe(0)
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})

describe('createCountingRuleProgress', () => {
  it('keeps two rule lessons apart, in both directions', () => {
    const a = createCountingRuleProgress('counting.100-900', ['counting-100900-a', 'counting-100900-b'])
    const b = createCountingRuleProgress('counting.tusinder', ['counting-tusinder-a'])

    expect(a.learn('counting-100900-a')).toBe('item')
    expect(a.learn('counting-tusinder-a')).toBeNull()
    expect(b.get()).toEqual({ words: [], paid: false })

    expect(b.learn('counting-tusinder-a')).toBe('page')
    expect(a.get()).toEqual({ words: ['counting-100900-a'], paid: false })
    expect(a.learn('counting-100900-b')).toBe('page')
  })

  it('refuses the foundation key and an empty id set', () => {
    expect(() => createCountingRuleProgress('counting', ['counting-2199-x'])).toThrow()
    expect(() => createCountingRuleProgress('vocab', ['counting-2199-x'])).toThrow()
    expect(() => createCountingRuleProgress('counting.21-99', [])).toThrow()
  })

  it('ignores duplicate ids in its own set', () => {
    const dup = createCountingRuleProgress('counting.dup', ['x-1', 'x-1'])
    expect(dup.ids).toEqual(['x-1'])
    expect(dup.learn('x-1')).toBe('page')
  })
})

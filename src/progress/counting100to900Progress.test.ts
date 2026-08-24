// The 100-900 store (plan 017, fixpoint B). Kept apart from
// `countingRules.test.ts`, which pins the factory and the 21-99 store, so
// neither file grows past the size bar.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { counting21to99Progress, counting100to900Progress } from './countingRules'
import { getCountingProgress, learnCountingItem } from './counting'

const KEY = 'dpl.v1.counting.100-900'
const KEY_2199 = 'dpl.v1.counting.21-99'
const store = counting100to900Progress

/**
 * Exactly what the descriptor teaches, in descriptor order: the nine hundreds,
 * then the composed examples, then the composed targets. 500 is a round
 * hundred spoken alone, so its example *is* its base row and it appears once,
 * among the hundreds. Lesson 2's joiner and tens and the foundation's 1-20
 * rows are referenced by the lesson and owned by none of it.
 */
const EXPECTED_IDS = [
  'counting-100900-hundrede-100',
  'counting-100900-hundrede-200',
  'counting-100900-hundrede-300',
  'counting-100900-hundrede-400',
  'counting-100900-hundrede-500',
  'counting-100900-hundrede-600',
  'counting-100900-hundrede-700',
  'counting-100900-hundrede-800',
  'counting-100900-hundrede-900',
  'counting-100900-tal-107',
  'counting-100900-tal-315',
  'counting-100900-tal-642',
  'counting-100900-tal-999',
  'counting-100900-tal-208',
  'counting-100900-tal-350',
  'counting-100900-tal-416',
  'counting-100900-tal-861',
]

beforeEach(() => {
  window.localStorage.clear()
})

/** Clears every id but the last, asserting each pays an `item`. */
function learnAllButLast(): string {
  for (const id of store.ids.slice(0, -1)) expect(store.learn(id), id).toBe('item')
  return store.ids[store.ids.length - 1]
}

describe('counting 100-900 progress — what the store owns', () => {
  it('derives exactly the descriptor\'s ids, in the descriptor\'s order', () => {
    expect(store.key).toBe('counting.100-900')
    expect([...store.ids]).toEqual(EXPECTED_IDS)
  })

  it('owns no part it merely reuses from a lower stage', () => {
    // The joiner is lesson 2's, and so are the tens the remainders are built
    // from; the units and teens are the foundation's. Clearing one counts
    // where it is taught — never a second time here.
    const reused = [
      'counting-2199-bindeled',
      'counting-2199-ti-40',
      'counting-2199-ti-60',
      'number-7-word',
      'number-15-word',
    ]
    for (const id of reused) {
      expect(store.ids, id).not.toContain(id)
      expect(store.learn(id), id).toBeNull()
      expect(store.markDone(id).words, id).toEqual([])
    }
    expect(store.get()).toEqual({ words: [], paid: false })
  })

  it('earns nothing at all for an id it does not own', () => {
    for (const foreign of ['counting-tusinder-tal-1000', 'nonsense', '']) {
      expect(store.learn(foreign), foreign).toBeNull()
    }
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})

describe('counting 100-900 progress — add-only and once-only', () => {
  it('is add-only: learning the same item twice changes nothing', () => {
    const id = store.ids[0]
    store.markDone(id)
    store.markDone(id)
    expect(store.get().words).toEqual([id])
    expect(store.doneCount()).toBe(1)
  })

  it('pays the last item as the page, exactly once', () => {
    const last = learnAllButLast()
    expect(store.learn(last)).toBe('page')
    expect(store.get().paid).toBe(true)
    expect(store.doneCount()).toBe(store.ids.length)
    // Replaying the round pays a replay's `answer`, never a second page.
    expect(store.learn(last)).toBe('answer')
    expect(store.learn(store.ids[0])).toBe('answer')
    const stored = JSON.parse(window.localStorage.getItem(KEY) ?? '{}')
    expect(stored.value.paid).toBe(true)
  })
})

describe('counting 100-900 progress — damaged and denied storage', () => {
  it('normalizes missing, unparseable and corrupt records', () => {
    expect(store.get()).toEqual({ words: [], paid: false })

    window.localStorage.setItem(KEY, '{not valid json')
    expect(store.get()).toEqual({ words: [], paid: false })

    const shapes = [
      { words: store.ids[0], paid: 'yes' },
      { words: [7, null, { id: store.ids[0] }, store.ids[0], store.ids[0]], paid: 1 },
      {},
      { words: [], paid: true },
    ]
    const expected = [
      { words: [], paid: false },
      { words: [store.ids[0]], paid: false },
      { words: [], paid: false },
      { words: [], paid: true },
    ]
    shapes.forEach((value, index) => {
      window.localStorage.clear()
      window.localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, value }))
      expect(store.get(), JSON.stringify(value)).toEqual(expected[index])
    })
  })

  it('drops reused and foreign ids written into its own record', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        schemaVersion: 1,
        value: { words: ['counting-2199-bindeled', 'number-7-word', store.ids[0]], paid: false },
      }),
    )
    expect(store.get().words).toEqual([store.ids[0]])
    expect(store.doneCount()).toBe(1)
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

describe('counting 100-900 progress — isolation among the three lessons', () => {
  it('finishing 100-900 leaves the foundation and 21-99 untouched', () => {
    expect(store.learn(learnAllButLast())).toBe('page')
    expect(getCountingProgress()).toEqual({ words: [], paid: false })
    expect(counting21to99Progress.get()).toEqual({ words: [], paid: false })
    expect(counting21to99Progress.doneCount()).toBe(0)
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
    expect(window.localStorage.getItem(KEY_2199)).toBeNull()
  })

  it('lower-stage progress never appears in 100-900', () => {
    expect(learnCountingItem('number-7-word')).toBe('item')
    expect(counting21to99Progress.learn('counting-2199-bindeled')).toBe('item')
    expect(counting21to99Progress.learn('counting-2199-ti-40')).toBe('item')

    expect(store.get()).toEqual({ words: [], paid: false })
    expect(store.doneCount()).toBe(0)
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})

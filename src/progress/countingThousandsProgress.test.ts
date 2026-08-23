// The tusinder store (plan 017, fixpoint C). Kept apart from
// `countingRules.test.ts` and `counting100to900Progress.test.ts`, which pin the
// factory and the two lower rule stores, so no file grows past the size bar.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  counting21to99Progress,
  counting100to900Progress,
  countingThousandsProgress,
} from './countingRules'
import { getCountingProgress, learnCountingItem } from './counting'
import { countingThousandsLesson } from '../lessons/countingThousands'

const KEY = 'dpl.v1.counting.tusinder'
const KEY_2199 = 'dpl.v1.counting.21-99'
const KEY_100900 = 'dpl.v1.counting.100-900'
const store = countingThousandsProgress

/**
 * Exactly what the descriptor teaches, in descriptor order: the thousand word,
 * the eight derived multipliers, then the composed examples, then the composed
 * targets. 1.000 and 5.000 are round thousands spoken alone, so their examples
 * *are* their base rows and each appears once, among the thousands. Lesson 2's
 * joiner and tens, lesson 3's hundreds and the foundation's 1-20 rows are
 * referenced by the lesson and owned by none of it.
 */
const EXPECTED_IDS = [
  'counting-tusinder-tusind',
  'counting-tusinder-tusinde-2000',
  'counting-tusinder-tusinde-3000',
  'counting-tusinder-tusinde-4000',
  'counting-tusinder-tusinde-5000',
  'counting-tusinder-tusinde-6000',
  'counting-tusinder-tusinde-7000',
  'counting-tusinder-tusinde-8000',
  'counting-tusinder-tusinde-9000',
  'counting-tusinder-tal-1300',
  'counting-tusinder-tal-1042',
  'counting-tusinder-tal-1007',
  'counting-tusinder-tal-9999',
  'counting-tusinder-tal-2088',
  'counting-tusinder-tal-3105',
  'counting-tusinder-tal-5642',
  'counting-tusinder-tal-8371',
]

beforeEach(() => {
  window.localStorage.clear()
})

/** Clears every id but the last, asserting each pays an `item`. */
function learnAllButLast(): string {
  for (const id of store.ids.slice(0, -1)) expect(store.learn(id), id).toBe('item')
  return store.ids[store.ids.length - 1]
}

describe('counting tusinder progress — what the store owns', () => {
  it('derives exactly the descriptor\'s ids, in the descriptor\'s order', () => {
    expect(store.key).toBe('counting.tusinder')
    expect([...store.ids]).toEqual(EXPECTED_IDS)
    expect(store.ids.length).toBe(17)
  })

  it('counts a round thousand once, though it is both a base and an example', () => {
    // 1.000 and 5.000 are said alone, so each example reuses its base row's
    // entry; the store's deduplication keeps one id, at its base's position.
    const rounds = [countingThousandsLesson.examples[0], countingThousandsLesson.examples[1]]
    expect(rounds.map((round) => round.entry.id)).toEqual([store.ids[0], store.ids[4]])
    expect(new Set(store.ids).size).toBe(store.ids.length)
  })

  it('owns no part it merely reuses from a lower stage', () => {
    // The joiner and the tens are lesson 2's, the hundreds lesson 3's, the
    // units and teens the foundation's. Clearing one counts where it is
    // taught — never a second time here.
    const reused = [
      'counting-2199-bindeled',
      'counting-2199-ti-40',
      'counting-100900-hundrede-300',
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
    for (const foreign of ['counting-100900-tal-999', 'nonsense', '']) {
      expect(store.learn(foreign), foreign).toBeNull()
    }
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})

describe('counting tusinder progress — add-only and once-only', () => {
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

describe('counting tusinder progress — damaged and denied storage', () => {
  it('normalizes missing, unparseable and corrupt records', () => {
    expect(store.get()).toEqual({ words: [], paid: false })

    window.localStorage.setItem(KEY, '{not valid json')
    expect(store.get()).toEqual({ words: [], paid: false })

    const shapes = [
      { words: store.ids[0], paid: 'yes' },
      { words: [7, null, { id: store.ids[0] }, store.ids[0], store.ids[0]], paid: 1 },
      { words: [], paid: true },
    ]
    const expected = [
      { words: [], paid: false },
      { words: [store.ids[0]], paid: false },
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
        value: {
          words: ['counting-2199-bindeled', 'counting-100900-hundrede-300', store.ids[0]],
          paid: false,
        },
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

describe('counting tusinder progress — isolation among the four lessons', () => {
  it('finishing tusinder leaves the three lessons below untouched', () => {
    expect(store.learn(learnAllButLast())).toBe('page')
    expect(getCountingProgress()).toEqual({ words: [], paid: false })
    expect(counting21to99Progress.get()).toEqual({ words: [], paid: false })
    expect(counting100to900Progress.get()).toEqual({ words: [], paid: false })
    expect(counting21to99Progress.doneCount()).toBe(0)
    expect(counting100to900Progress.doneCount()).toBe(0)
    expect(window.localStorage.getItem('dpl.v1.counting')).toBeNull()
    expect(window.localStorage.getItem(KEY_2199)).toBeNull()
    expect(window.localStorage.getItem(KEY_100900)).toBeNull()
  })

  it('lower-stage progress never appears in tusinder', () => {
    expect(learnCountingItem('number-7-word')).toBe('item')
    expect(counting21to99Progress.learn('counting-2199-bindeled')).toBe('item')
    expect(counting100to900Progress.learn('counting-100900-hundrede-300')).toBe('item')

    expect(store.get()).toEqual({ words: [], paid: false })
    expect(store.doneCount()).toBe(0)
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStorageWarning,
  keyExists,
  readJSON,
  subscribeStorageWarning,
  writeJSON,
} from './storage'

beforeEach(() => {
  window.localStorage.clear()
})

describe('storage', () => {
  it('round-trips a value', () => {
    writeJSON('thing', { a: 1 })
    expect(readJSON('thing', null)).toEqual({ a: 1 })
  })

  it('returns the fallback when the key is absent', () => {
    expect(readJSON('missing', 'fallback')).toBe('fallback')
  })

  it('recovers from corrupt JSON instead of throwing', () => {
    window.localStorage.setItem('dpl.v1.broken', '{not valid json')
    expect(() => readJSON('broken', 'fallback')).not.toThrow()
    expect(readJSON('broken', 'fallback')).toBe('fallback')
    expect(getStorageWarning()).toBe('corrupt')
  })

  it('treats a mismatched schema version as absent', () => {
    window.localStorage.setItem('dpl.v1.old', JSON.stringify({ schemaVersion: 999, value: 'x' }))
    expect(readJSON('old', 'fallback')).toBe('fallback')
  })

  it('treats a null envelope value as absent rather than handing null to the caller', () => {
    window.localStorage.setItem(
      'dpl.v1.nullish',
      JSON.stringify({ schemaVersion: 1, value: null }),
    )
    expect(readJSON('nullish', 'fallback')).toBe('fallback')
  })

  it('reads a stored primitive back as the fallback — the store keeps records, not scalars', () => {
    // The narrowing in readJSON is a contract, not an accident: a bare 'Sara'
    // where a profile record belongs is corruption, and comes back as absent.
    for (const value of ['Sara', 7, true]) {
      writeJSON('scalar', value)
      expect(readJSON('scalar', 'fallback')).toBe('fallback')
    }
  })

  it('still accepts an array value — only null is rejected, not every non-plain-object', () => {
    writeJSON('list', [1, 2, 3])
    expect(readJSON<number[]>('list', [])).toEqual([1, 2, 3])
  })

  it('reports key existence, including an explicitly empty value', () => {
    expect(keyExists('thing')).toBe(false)
    writeJSON('thing', {})
    expect(keyExists('thing')).toBe(true)
  })

  it('falls back to in-memory storage when localStorage is denied', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied')
    })
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied')
    })

    expect(() => writeJSON('thing', { a: 1 })).not.toThrow()
    expect(readJSON('thing', null)).toEqual({ a: 1 })
    expect(getStorageWarning()).toBe('memory')

    setSpy.mockRestore()
    getSpy.mockRestore()
  })

  it('never surfaces an older value once localStorage starts throwing on write (round 4)', () => {
    writeJSON('thing', { a: 1 })
    expect(readJSON('thing', null)).toEqual({ a: 1 })

    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    // A storm of writes that never once reach disk: localStorage is stuck at
    // `{ a: 1 }` for the rest of this test, yet every read must still see the
    // latest write — never `{ a: 1 }`, never any earlier value in the storm.
    for (let a = 2; a <= 6; a += 1) {
      expect(() => writeJSON('thing', { a })).not.toThrow()
      expect(readJSON('thing', null)).toEqual({ a })
    }

    setSpy.mockRestore()
    expect(readJSON('thing', null)).toEqual({ a: 6 })
  })

  it('notifies the interface once when persistence becomes limited', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeStorageWarning(listener)
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    writeJSON('thing', { a: 1 })
    writeJSON('thing', { a: 2 })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(getStorageWarning()).toBe('memory')
    unsubscribe()
    setSpy.mockRestore()
  })
})

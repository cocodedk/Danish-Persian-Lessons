import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readJSON, writeJSON, keyExists } from './storage'

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
  })

  it('treats a mismatched schema version as absent', () => {
    window.localStorage.setItem('dpl.v1.old', JSON.stringify({ schemaVersion: 999, value: 'x' }))
    expect(readJSON('old', 'fallback')).toBe('fallback')
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

    setSpy.mockRestore()
    getSpy.mockRestore()
  })
})

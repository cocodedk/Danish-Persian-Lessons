import { describe, it, expect, beforeEach } from 'vitest'
import { getProfile, setProfile, hasProfileRecord, clearName } from './profile'

beforeEach(() => {
  window.localStorage.clear()
})

describe('profile', () => {
  it('has no record before the first save', () => {
    expect(hasProfileRecord()).toBe(false)
    expect(getProfile()).toEqual({})
  })

  it('round-trips a name and survives a fresh read (simulated reload)', () => {
    setProfile({ name: 'Sara' })
    expect(getProfile()).toEqual({ name: 'Sara' })
    expect(hasProfileRecord()).toBe(true)
  })

  it('skip path: saving an empty profile still creates a permanent record', () => {
    setProfile({})
    expect(hasProfileRecord()).toBe(true)
    expect(getProfile()).toEqual({})
  })

  it('clearName removes the name and its spelling, keeping the record intact', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    clearName()
    expect(getProfile()).toEqual({})
    expect(hasProfileRecord()).toBe(true)
  })

  it('corrupt storage recovers to an empty profile instead of crashing', () => {
    window.localStorage.setItem('dpl.v1.profile', 'not json at all')
    expect(() => getProfile()).not.toThrow()
    expect(getProfile()).toEqual({})
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { getSettings, setSoundOn } from './settings'

beforeEach(() => {
  window.localStorage.clear()
})

describe('settings', () => {
  it('has sound on by default', () => {
    expect(getSettings().sound).toBe(true)
  })

  it('remembers a mute across a reload', () => {
    setSoundOn(false)
    expect(getSettings().sound).toBe(false)
    // A fresh read is what a reload does.
    expect(getSettings()).toEqual({ sound: false })
  })

  it('unmutes again', () => {
    setSoundOn(false)
    setSoundOn(true)
    expect(getSettings().sound).toBe(true)
  })

  it('treats a damaged record as the default rather than crashing', () => {
    window.localStorage.setItem(
      'dpl.v1.settings',
      JSON.stringify({ schemaVersion: 1, value: { sound: 'maybe' } }),
    )
    expect(getSettings().sound).toBe(true)
  })
})

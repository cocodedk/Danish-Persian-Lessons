import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyColorMode, getColorMode, saveColorMode } from './colorMode'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  document.documentElement.classList.remove('scheme-light', 'scheme-dark')
})

describe('colour mode', () => {
  it('follows the device by default and remembers a choice', () => {
    expect(getColorMode()).toBe('system')
    saveColorMode('light')
    expect(getColorMode()).toBe('light')
  })

  it('uses one explicit scheme at a time and returns to the device setting', () => {
    applyColorMode('dark')
    expect(document.documentElement).toHaveClass('scheme-dark')
    expect(document.documentElement).not.toHaveClass('scheme-light')

    applyColorMode('light')
    expect(document.documentElement).toHaveClass('scheme-light')
    expect(document.documentElement).not.toHaveClass('scheme-dark')

    applyColorMode('system')
    expect(document.documentElement).not.toHaveClass('scheme-light', 'scheme-dark')
  })
})

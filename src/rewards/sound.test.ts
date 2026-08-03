import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setSoundOn } from '../progress/settings'

/**
 * jsdom has no WebAudio, so the test supplies one and watches whether it is
 * ever built. "No AudioContext constructed" is the strongest possible proof
 * that nothing sounded.
 */
function fakeAudio() {
  const built = vi.fn()
  const param = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  })
  const node = () => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: '',
    frequency: param(),
    detune: param(),
    gain: param(),
  })
  class FakeContext {
    currentTime = 0
    destination = {}
    state = 'running'
    constructor() {
      built()
    }
    createOscillator() {
      return node()
    }
    createGain() {
      return node()
    }
    resume() {
      return Promise.resolve()
    }
  }
  Reflect.set(window, 'AudioContext', FakeContext)
  return built
}

/** A fresh copy of the module, so the "first gesture" really is the first. */
async function freshSound() {
  vi.resetModules()
  return import('./sound')
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('reward jingles', () => {
  it('makes no sound at all before the first user gesture', async () => {
    const built = fakeAudio()
    const sound = await freshSound()
    sound.armSound()

    sound.playCue('tick')
    sound.playCues(['tick', 'chime', 'fanfare'])

    expect(built).not.toHaveBeenCalled()
    expect(sound.soundIsUnlocked()).toBe(false)
  })

  it('wakes on the first tap and then plays', async () => {
    const built = fakeAudio()
    const sound = await freshSound()
    sound.armSound()

    window.dispatchEvent(new Event('pointerdown'))
    expect(sound.soundIsUnlocked()).toBe(true)

    sound.playCue('tick')
    expect(built).toHaveBeenCalledTimes(1)
  })

  it('stays silent when muted, however many gestures have happened', async () => {
    const built = fakeAudio()
    const sound = await freshSound()
    sound.armSound()
    window.dispatchEvent(new Event('pointerdown'))

    setSoundOn(false)
    sound.playCues(['tick', 'chime', 'fanfare'])
    expect(built).not.toHaveBeenCalled()

    setSoundOn(true)
    sound.playCue('fanfare')
    expect(built).toHaveBeenCalledTimes(1)
  })

  it('survives a browser with no WebAudio at all', async () => {
    Reflect.deleteProperty(window, 'AudioContext')
    const sound = await freshSound()
    sound.armSound()
    window.dispatchEvent(new Event('keydown'))
    expect(() => sound.playCues(['tick', 'chime', 'fanfare'])).not.toThrow()
  })
})

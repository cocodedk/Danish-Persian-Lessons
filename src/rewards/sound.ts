// Jingles, synthesized on the spot: no audio files, no dependencies, no
// network. A santur is struck metal strings in near-unison courses, so each
// note here is two slightly detuned oscillators under one fast-attack,
// long-decay envelope — bright at the strike, ringing after it.
//
// Nothing sounds until the learner has touched the page: browsers forbid it,
// and so does the plan. `armSound` waits for the first gesture; before that
// `playCue` does not even build an AudioContext.
import { getSettings } from '../progress/settings'
import type { SoundCue } from './types'

type ContextCtor = typeof AudioContext

let context: AudioContext | null = null
let gestureSeen = false
let armed = false

/** Notes per cue, in Hz. The fanfare climbs a Shur-flavoured tetrachord. */
const CUES: Record<SoundCue, { hz: number; at: number; len: number }[]> = {
  tick: [{ hz: 880, at: 0, len: 0.22 }],
  chime: [
    { hz: 784, at: 0, len: 0.3 },
    { hz: 1046.5, at: 0.11, len: 0.45 },
  ],
  fanfare: [
    { hz: 523.25, at: 0, len: 0.3 },
    { hz: 587.33, at: 0.11, len: 0.3 },
    { hz: 698.46, at: 0.22, len: 0.34 },
    { hz: 1046.5, at: 0.34, len: 0.72 },
  ],
}

function ctor(): ContextCtor | undefined {
  const scope = window as typeof window & { webkitAudioContext?: ContextCtor }
  return window.AudioContext ?? scope.webkitAudioContext
}

function audio(): AudioContext | null {
  if (context) return context
  const Ctor = ctor()
  if (!Ctor) return null
  context = new Ctor()
  return context
}

/** One struck string: two detuned partials, hard attack, exponential ring-out. */
function strike(target: AudioContext, hz: number, at: number, len: number, level: number): void {
  const start = target.currentTime + at
  const envelope = target.createGain()
  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(level, start + 0.008)
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + len)
  envelope.connect(target.destination)

  for (const detune of [-6, 6]) {
    const osc = target.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(hz, start)
    osc.detune.setValueAtTime(detune, start)
    osc.connect(envelope)
    osc.start(start)
    osc.stop(start + len + 0.05)
  }
}

/**
 * Listens once for the first tap, click or key. Idempotent — calling it twice
 * costs nothing. Until it fires, the app is silent by construction.
 */
export function armSound(): void {
  if (armed) return
  armed = true
  const wake = () => {
    gestureSeen = true
  }
  for (const event of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(event, wake, { once: true, passive: true })
  }
}

/** True once a user gesture has happened. Read by tests and by the mute label. */
export function soundIsUnlocked(): boolean {
  return gestureSeen
}

export function playCue(cue: SoundCue): void {
  if (!gestureSeen || !getSettings().sound) return
  const target = audio()
  if (!target) return
  if (target.state === 'suspended') void target.resume()

  const notes = CUES[cue]
  notes.forEach((note, index) => {
    strike(target, note.hz, note.at, note.len, index === notes.length - 1 ? 0.22 : 0.16)
  })
}

/** Plays a whole reward's worth of cues, in order. */
export function playCues(cues: SoundCue[]): void {
  for (const cue of cues) playCue(cue)
}

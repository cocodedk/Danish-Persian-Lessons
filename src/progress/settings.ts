// App settings: `dpl.v1.settings`. Sound is on by default and independent of
// the motion preference — a learner who wants no animation may still want the
// jingle (docs/design/ART-DIRECTION.md, "Celebration & sound").
import { readJSON, writeJSON } from './storage'

export interface Settings {
  /** Jingles on. Default true; only an explicit `false` mutes. */
  sound: boolean
}

const KEY = 'settings'

export function getSettings(): Settings {
  const raw = readJSON<Partial<Settings>>(KEY, {})
  return { sound: raw.sound !== false }
}

export function setSoundOn(on: boolean): Settings {
  const next: Settings = { sound: on }
  writeJSON<Settings>(KEY, next)
  return next
}

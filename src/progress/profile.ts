// The learner's profile: `dpl.v1.profile`. `faSpelling` arrives with plan 006;
// kept optional here so the field name is stable from day one.
import { readJSON, writeJSON, keyExists } from './storage'

export interface Profile {
  name?: string
  faSpelling?: string
}

const KEY = 'profile'
const EMPTY_PROFILE: Profile = {}

export function getProfile(): Profile {
  return readJSON<Profile>(KEY, EMPTY_PROFILE)
}

export function setProfile(profile: Profile): void {
  writeJSON<Profile>(KEY, profile)
}

/**
 * True once a profile record has been saved at all — including an empty one
 * written after the learner skips the name capture. This is what makes
 * skipping permanent-quiet: the app never re-asks once this is true.
 */
export function hasProfileRecord(): boolean {
  return keyExists(KEY)
}

/**
 * Removes the name and its Persian spelling, keeping the rest of the profile
 * (and its "seen" record) intact. The two always go together: `faSpelling` is
 * the spelling OF the name, so a name that is gone cannot still have one —
 * that is what keeps the greeting, the badges and the mini-lesson agreeing.
 */
export function clearName(): void {
  const next: Profile = { ...getProfile() }
  delete next.name
  delete next.faSpelling
  setProfile(next)
}

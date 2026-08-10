import type { PronunciationAudio } from './types'
import approvedRows from './approved.generated.json'

/** Only the approval script writes this release corpus. Generated clips carry
 * their model provenance; human clips carry speaker consent. Both require a
 * named native Persian reviewer. */
export const pronunciationAudio = approvedRows as PronunciationAudio[]

const byClip = new Map(pronunciationAudio.map((row) => [row.clipId, row]))

export function findPronunciationAudio(clipId: string | undefined) {
  return clipId ? byClip.get(clipId) : undefined
}

export function pronunciationAudioUrl(file: string, base = import.meta.env.BASE_URL): string {
  return `${base}${file.replace(/^\//, '')}`
}

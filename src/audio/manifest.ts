import type { PronunciationAudio } from './types'

/** Reviewed human recordings land here. This intentionally remains empty
 * until speaker consent and native review evidence exist; generated or browser
 * speech must never masquerade as the release corpus. */
export const pronunciationAudio: PronunciationAudio[] = []

const byEntry = new Map(pronunciationAudio.map((row) => [row.entryId, row]))

export function findPronunciationAudio(entryId: string | undefined) {
  return entryId ? byEntry.get(entryId) : undefined
}

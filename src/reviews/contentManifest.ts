import { findPronunciationAudio } from '../audio/manifest'
import { catalogDomains, persianCatalog } from '../catalog/registry'
import type { PersianEntry } from '../catalog/types'

export type CueCoverage = 'none' | 'whole-word' | 'token' | 'contextual'
export type AudioReviewStatus = 'missing' | 'not-applicable' | 'reviewed'

function domainFor(entryId: string): keyof typeof catalogDomains {
  const found = Object.entries(catalogDomains).find(([, entries]) =>
    entries.some((entry) => entry.id === entryId),
  )
  if (!found) throw new Error(`No catalog domain for ${entryId}`)
  return found[0] as keyof typeof catalogDomains
}

function cueCoverage(entry: PersianEntry): CueCoverage {
  if (!entry.readingCues?.length) return 'none'
  if (entry.readingCues.some((cue) => cue.role !== 'whole')) return 'contextual'
  return entry.readingCues.length > 1 ? 'token' : 'whole-word'
}

function audioStatus(entry: PersianEntry): AudioReviewStatus {
  if (entry.audioNotApplicable) return 'not-applicable'
  return findPronunciationAudio(entry.audioId) ? 'reviewed' : 'missing'
}

function syllableNuclei(ipa: string): number {
  return ipa.match(/[aeiouæɒ]+(?::)?/g)?.length ?? 0
}

const ROLE_SENSITIVE = new Set([...'اآویهعءئؤ'])

export const contentReviewManifest = {
  schemaVersion: 1,
  source: 'src/catalog/registry.ts',
  rows: persianCatalog.map((entry) => ({
    id: entry.id,
    domain: domainFor(entry.id),
    kind: entry.kind,
    fa: entry.fa,
    ...(entry.faMarked ? { faMarked: entry.faMarked } : {}),
    da: entry.da,
    soundDa: entry.pron.da,
    ipa: entry.pron.ipa,
    stressReviewRequired: syllableNuclei(entry.pron.ipa) > 1,
    stressMarked: entry.pron.ipa.includes('ˈ'),
    readingCues: entry.readingCues ?? [],
    cueCoverage: cueCoverage(entry),
    roleSensitive: [...entry.fa].some((glyph) => ROLE_SENSITIVE.has(glyph)),
    audioId: entry.audioId ?? null,
    audioNotApplicable: entry.audioNotApplicable ?? null,
    audioStatus: audioStatus(entry),
    requiredReviews: ['iranian-persian-1', 'iranian-persian-2', 'phonetics', 'danish'],
  })),
}

import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'

/**
 * Words other apps (Persia, the arcade game) say but no lesson teaches. Like
 * `extraNumbers` in counting21to99.ts they are registered in the catalog only,
 * so they are recorded and reviewed like every clip, and they stay out of
 * `vocabUnits`: no unit's words, exercises or review change. The id keeps the
 * family prefix of the unit the word belongs with (5, the animals). Candidate
 * draft until a native reviewer approves it.
 */
export const extraVocabulary: PersianEntry[] = [
  defineEntry({
    id: 'vocabulary-5-shir',
    kind: 'word',
    fa: 'شیر',
    faMarked: 'شیر',
    da: 'løve',
    pron: { da: 'sjir', ipa: 'ʃiːɾ' },
  }),
]

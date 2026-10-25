import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'

/**
 * Words other apps (Persia, the arcade game) say but no lesson teaches. Like
 * `extraNumbers` in counting21to99.ts they are registered in the catalog only,
 * so they are recorded and reviewed like every clip, and they stay out of
 * `vocabUnits`: no unit's words, exercises or review change. The id keeps the
 * family prefix of the unit the word belongs with (5, the animals; 3, home and sky). Candidate
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
  defineEntry({
    id: 'vocabulary-5-shotor',
    kind: 'word',
    fa: 'شتر',
    faMarked: 'شُتُر',
    // Piper stresses شتر on its first syllable and draws it out; its raw phonemes put the stress on
    // the second, as the IPA has it.
    synthesisText: '[[ ʃotˈor ]]',
    da: 'kamel',
    pron: { da: 'sjotor', ipa: 'ʃoˈtoɾ' },
  }),
  defineEntry({
    id: 'vocabulary-3-khorshid',
    kind: 'word',
    fa: 'خورشید',
    faMarked: 'خورشید',
    da: 'sol',
    pron: { da: 'khorsjid', ipa: 'xoɾˈʃiːd' },
  }),
]

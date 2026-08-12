import { findPronunciationAudio } from '../audio/manifest'
import { catalogDomains, persianCatalog } from '../catalog/registry'
import type { PersianEntry } from '../catalog/types'
import { spokenFormsFor } from '../catalog/types'
import { launchTalkClipIds } from '../speaking/launchCorpus'

const LAUNCH_TALK_CLIPS = new Set<string>(launchTalkClipIds)

type Domain = keyof typeof catalogDomains

function domainFor(entryId: string): Domain {
  const found = Object.entries(catalogDomains).find(([, entries]) =>
    entries.some((entry) => entry.id === entryId),
  )
  if (!found) throw new Error(`No catalog domain for ${entryId}`)
  return found[0] as Domain
}

export const audioRecordingQueue = {
  schemaVersion: 2,
  status: 'draft-awaiting-native-review',
  source: 'src/catalog/registry.ts',
  instructions: 'Generate locally. Publish only after one named native Persian reviewer approves the clip.',
  rows: persianCatalog.flatMap((entry: PersianEntry) => {
    const domain = domainFor(entry.id)
    return spokenFormsFor(entry)
      .filter((form) => !findPronunciationAudio(form.audioId))
      .map((form) => ({
        clipId: form.audioId,
        entryId: entry.id,
        formId: form.id,
        register: form.register,
        scope: LAUNCH_TALK_CLIPS.has(form.audioId) ? 'talk' : 'writing',
        domain,
        transcript: form.faMarked ?? form.fa,
        synthesisText: form.faMarked ?? form.fa,
        plainPersian: form.fa,
        danishMeaning: form.da,
        soundDa: form.pron.da,
        ipa: form.pron.ipa,
        stressMarked: form.pron.ipa.includes('ˈ'),
        expectedDraft: `.audio/work/${form.audioId}.mp3`,
        requiredBeforeGeneration: ['native-content'],
        requiredTakeReview: ['native-persian'],
      }))
  }),
}

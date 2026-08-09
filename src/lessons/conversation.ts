import { defineEntry } from '../catalog/types'
import { findVocabUnit } from './vocab'

const greetingWord = findVocabUnit('2')?.words.find(({ id }) => id === 'salam')
if (!greetingWord) throw new Error('Missing conversation greeting: vocabulary-2-salam')

export const INTRODUCTION_ENTRY = defineEntry({
  id: 'conversation-introduction',
  kind: 'phrase',
  fa: 'من … هستم.',
  faMarked: 'مَن … هَستَم.',
  da: 'Jeg hedder …',
  pron: { da: 'man … hastam', ipa: 'mæn … ˈhæstæm' },
})

export const GOODBYE_ENTRY = defineEntry({
  id: 'conversation-goodbye',
  kind: 'word',
  fa: 'خداحافظ!',
  faMarked: 'خُداحافِظ!',
  da: 'farvel',
  pron: { da: 'khodåfez', ipa: 'xodɒːˈfez' },
})

export const conversationCatalog = [INTRODUCTION_ENTRY, GOODBYE_ENTRY]

export const conversationBasics = [
  greetingWord.entry,
  INTRODUCTION_ENTRY,
  GOODBYE_ENTRY,
]

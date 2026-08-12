import { findPronunciationAudio } from '../audio/manifest'
import type { PersianEntry } from '../catalog/types'
import { lessonImageForEntry } from '../images/catalog'
import { conversationBasics } from '../lessons/conversation'
import { beginnerNumbers } from '../lessons/numbers'
import { findVocabUnit, type ColorSwatchId } from '../lessons/vocab'
import { launchTalkClipIds } from './launchCorpus'

export interface SpeakingPage {
  id: string
  entry: PersianEntry
  imageEntryId?: string
  swatch?: ColorSwatchId
  number?: number
}

export interface SpeakingLesson {
  id: string
  title: string
  summary: string
  pages: SpeakingPage[]
}

function vocabLesson(unitId: string, summary: string): SpeakingLesson {
  const unit = findVocabUnit(unitId)
  if (!unit) throw new Error(`Missing speaking vocabulary unit ${unitId}`)
  return {
    id: `ord-${unit.id}`,
    title: unit.title,
    summary,
    pages: unit.words.filter((word) => word.swatch || lessonImageForEntry(word.entry.id)).map((word) => ({
      id: word.id,
      entry: word.entry,
      imageEntryId: word.entry.id,
      ...(word.swatch ? { swatch: word.swatch } : {}),
    })),
  }
}

export const speakingLessons: SpeakingLesson[] = [
  {
    id: 'hils',
    title: 'Hils på persisk',
    summary: 'Sig hej, fortæl hvem du er, og sig farvel.',
    pages: conversationBasics.map((entry) => ({
      id: entry.id,
      entry,
      imageEntryId: entry.id === 'conversation-introduction'
        ? 'vocabulary-1-man' : 'vocabulary-2-salam',
    })),
  },
  vocabLesson('5', 'Hør og sig otte dyr.'),
  vocabLesson('1', 'Hør og sig de første små ord.'),
  vocabLesson('2', 'Ord du kan bruge i skolen.'),
  vocabLesson('3', 'Sig hus og blomst.'),
  vocabLesson('4', 'Hør og sig otte farver.'),
  {
    id: 'tal',
    title: 'Tal fra 1 til 10',
    summary: 'Hør og sig de første ti tal.',
    pages: beginnerNumbers.map(({ value, word }) => ({
      id: String(value),
      entry: word,
      number: value,
    })),
  },
]

export function findSpeakingLesson(id: string): SpeakingLesson | undefined {
  return speakingLessons.find((lesson) => lesson.id === id)
}

export function findSpeakingPage(lessonId: string, pageId: string) {
  const lesson = findSpeakingLesson(lessonId)
  if (!lesson) return undefined
  const index = lesson.pages.findIndex((page) => page.id === pageId)
  return index < 0 ? undefined : { lesson, page: lesson.pages[index], index }
}

export const requiredTalkClipIds: readonly string[] = launchTalkClipIds

export function talkAudioReady(): boolean {
  return requiredTalkClipIds.length > 0
    && requiredTalkClipIds.every((clipId) => findPronunciationAudio(clipId))
}

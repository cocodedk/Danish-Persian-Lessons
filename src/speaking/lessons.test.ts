import { describe, expect, it } from 'vitest'
import { lessonImageForEntry } from '../images/catalog'
import { requiredTalkClipIds, speakingLessons, talkAudioReady } from './lessons'

describe('speaking lessons', () => {
  it('opens when the complete first talk corpus is approved', () => {
    expect(requiredTalkClipIds).toHaveLength(97)
    expect(new Set(requiredTalkClipIds).size).toBe(requiredTalkClipIds.length)
    expect(talkAudioReady()).toBe(true)
    for (const optionalBridge of ['word-bridge-pas', 'word-bridge-mord', 'word-bridge-leng']) {
      expect(requiredTalkClipIds).not.toContain(optionalBridge)
    }
  })

  it('gives every picture-book page a clear visual', () => {
    for (const lesson of speakingLessons) {
      expect(lesson.pages.length, lesson.id).toBeGreaterThan(0)
      for (const page of lesson.pages) {
        const hasImage = page.imageEntryId
          ? Boolean(lessonImageForEntry(page.imageEntryId))
          : false
        expect(Boolean(page.swatch || page.number || hasImage), `${lesson.id}/${page.id}`).toBe(true)
      }
    }
  })
})

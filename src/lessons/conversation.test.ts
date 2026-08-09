import { describe, expect, it } from 'vitest'
import { conversationBasics, conversationCatalog } from './conversation'

describe('beginner conversation basics', () => {
  it('teaches a short greeting, introduction, and goodbye in order', () => {
    expect(conversationBasics.map(({ fa, da }) => ({ fa, da }))).toEqual([
      { fa: 'سلام', da: 'hej' },
      { fa: 'من … هستم.', da: 'Jeg hedder …' },
      { fa: 'خداحافظ!', da: 'farvel' },
    ])
  })

  it('registers each new phrase once while reusing the vocabulary greeting', () => {
    expect(conversationCatalog.map(({ id }) => id)).toEqual([
      'conversation-introduction',
      'conversation-goodbye',
    ])
  })
})

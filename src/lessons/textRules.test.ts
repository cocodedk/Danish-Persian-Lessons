import { describe, it, expect } from 'vitest'
import { isValidPersianText, findPersianTextViolations } from './textRules'
import { lessons } from './registry'
import { DEMO_WORD } from '../content/demoWord'
import { FA_GREETING } from '../content/greetings'
import { PERSIAN_UI_STRINGS } from '../content/faStrings'
import type { Lesson, Letter, VowelMark, WordCard } from './types'

function isWordCard(item: Letter | VowelMark | WordCard): item is WordCard {
  return 'fa' in item
}

function isLetter(item: Letter | VowelMark | WordCard): item is Letter {
  return 'forms' in item
}

/** Every fa-bearing string a Lesson carries, regardless of item kind. */
function collectFaStrings(lesson: Lesson): string[] {
  const strings: string[] = []
  for (const item of lesson.items) {
    if (isWordCard(item)) {
      strings.push(item.fa)
    } else if (isLetter(item)) {
      strings.push(item.glyph, item.name.fa, ...Object.values(item.forms))
      if (item.madde) strings.push(item.madde.glyph, item.madde.name.fa)
    } else {
      strings.push(item.glyph, item.name.fa)
    }
  }
  return strings
}

describe('Persian text-rule guard', () => {
  it('accepts correct Persian code points, ZWNJ, and Persian digits', () => {
    expect(isValidPersianText('کتاب')).toBe(true)
    expect(isValidPersianText('می‌روم')).toBe(true)
    expect(isValidPersianText('۱۲۳')).toBe(true)
  })

  it('rejects the Arabic kaf ك (U+0643)', () => {
    expect(isValidPersianText('كتاب')).toBe(false)
  })

  it('rejects the Arabic yeh ي (U+064A)', () => {
    // Built from explicit escapes, not pasted glyphs: U+064A (Arabic yeh) is
    // easy to mistake for the visually similar U+0649 (alef maksura) or
    // U+06CC (Persian yeh) when typed by hand.
    const arabicFormAli = 'علي' // ع ل ي (ي = U+064A)
    expect(isValidPersianText(arabicFormAli)).toBe(false)
  })

  it('rejects ASCII digits', () => {
    expect(isValidPersianText('سال 2026')).toBe(false)
  })

  it('fails on a deliberately bad fixture, then passes once the fixture is fixed', () => {
    const badFixture: Lesson = {
      id: 'fixture-bad',
      kind: 'vocab',
      items: [{ fa: 'كتاب', da: 'bog', pron: { da: 'ketab', ipa: 'ketæːb' } }],
    }
    const badViolations = collectFaStrings(badFixture).flatMap(findPersianTextViolations)
    expect(badViolations.length).toBeGreaterThan(0)

    const fixedFixture: Lesson = {
      ...badFixture,
      id: 'fixture-fixed',
      items: [{ fa: 'کتاب', da: 'bog', pron: { da: 'ketab', ipa: 'ketæːb' } }],
    }
    const fixedViolations = collectFaStrings(fixedFixture).flatMap(findPersianTextViolations)
    expect(fixedViolations).toEqual([])
  })

  it('also walks the Letter item shape correctly (glyph, name.fa, and all four forms) — proven now, ahead of plan 003', () => {
    const badLetter: Letter = {
      id: 'kaf-fixture',
      glyph: 'ك', // deliberately bad: Arabic kaf, should be ک
      name: { fa: 'کاف', da: 'kaf' },
      forms: { isolated: 'ک', initial: 'کـ', medial: 'ـکـ', final: 'ـک' },
      joinsLeft: true,
      sound: { da: 'k i "kat"', ipa: 'k' },
      strokes: [{ d: 'M 82 14 L 18 44', kind: 'stroke' }],
    }
    const badLesson: Lesson = { id: 'fixture-letter-bad', kind: 'alphabet', items: [badLetter] }
    const badViolations = collectFaStrings(badLesson).flatMap(findPersianTextViolations)
    expect(badViolations.length).toBeGreaterThan(0)

    const fixedLesson: Lesson = {
      ...badLesson,
      id: 'fixture-letter-fixed',
      items: [{ ...badLetter, glyph: 'ک' }],
    }
    const fixedViolations = collectFaStrings(fixedLesson).flatMap(findPersianTextViolations)
    expect(fixedViolations).toEqual([])
  })

  it('walks every lesson currently in the registry with zero violations', () => {
    const allViolations = lessons.flatMap((lesson) =>
      collectFaStrings(lesson).flatMap(findPersianTextViolations),
    )
    expect(allViolations).toEqual([])
  })

  it('the home screen demo word and greeting are themselves valid Persian text', () => {
    expect(findPersianTextViolations(DEMO_WORD.fa)).toEqual([])
    expect(findPersianTextViolations(FA_GREETING)).toEqual([])
  })

  it('walks every exported Persian UI string (capture prompt, lesson placeholder, greeting) with zero violations — a future ك/ي edit to src/content/faStrings.ts fails this test', () => {
    const allViolations = PERSIAN_UI_STRINGS.flatMap(findPersianTextViolations)
    expect(allViolations).toEqual([])
  })
})

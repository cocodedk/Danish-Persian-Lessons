import { describe, it, expect } from 'vitest'
import { isValidPersianText, findPersianTextViolations } from './textRules'
import { lessons } from './registry'
import { DEMO_WORD } from '../content/demoWord'
import { FA_GREETING } from '../content/greetings'
import { PERSIAN_UI_STRINGS } from '../content/faStrings'
import { ORIENTATION_POINTS } from '../content/orientation'
import { NAME_OVERRIDE_FA_STRINGS } from '../name/overrides'
import { GUARD_FIXTURE_NAMES } from '../name/guardFixtures'
import { suggestSpellings } from '../name/transliterate'
import type { Lesson, Letter, VowelMark, WordCard } from './types'

function isWordCard(item: Letter | VowelMark | WordCard): item is WordCard {
  return 'fa' in item
}

function isLetter(item: Letter | VowelMark | WordCard): item is Letter {
  return 'forms' in item
}

/** The Arabic block (U+0600–U+06FF): a Danish line that prints one is fa too. */
const PERSIAN = /[\u0600-\u06FF]/

/**
 * The Danish lines that print Persian inline: a letter's or mark's hint («ی
 * står uden prikker»), a sound anchor («ens for ق og غ»). They are Danish copy,
 * so they are walked only when they actually carry a Persian glyph.
 */
function daLinesWithPersian(item: Letter | VowelMark | WordCard): string[] {
  const lines: Array<string | undefined> = 'hint' in item ? [item.hint] : []
  if ('sound' in item) lines.push(item.sound.da)
  return lines.filter((line): line is string => !!line && PERSIAN.test(line))
}

/** Every fa-bearing string a Lesson carries, regardless of item kind. */
function collectFaStrings(lesson: Lesson): string[] {
  const strings: string[] = []
  for (const item of lesson.items) {
    strings.push(...daLinesWithPersian(item))
    if (isWordCard(item)) {
      // Both spellings: the plain word AND the vocalized specimen. A ك or a ي
      // is just as wrong under an اِعراب as it is bare (plan 004, step 6).
      strings.push(item.fa)
      if (item.faMarked) strings.push(item.faMarked)
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

  it('tolerates اِعراب — a vocalized specimen is correct Persian, not a violation', () => {
    // زبر، زیر، پیش، تشدید، ساکن are combining marks in U+064B–U+0652, right
    // after the forbidden Arabic yeh (U+064A). The guard must not confuse them.
    for (const marked of ['مَدرِسه', 'مِداد', 'گُل', 'آسِمان', 'مادَر', 'بَچّه', 'دَسْت']) {
      expect(findPersianTextViolations(marked), marked).toEqual([])
    }
  })

  it('still catches a ك or a ي hiding under the vowel marks of a specimen', () => {
    const card = (faMarked: string): Lesson => ({
      id: 'fixture-marked',
      kind: 'vocab',
      items: [{ fa: 'کتاب', faMarked, da: 'bog', pron: { da: 'ketåb', ipa: 'ketɒːb' } }],
    })
    // ك (U+0643) wearing a زیر, where a Persian ک belongs.
    expect(collectFaStrings(card('كِتاب')).flatMap(findPersianTextViolations)).not.toEqual([])
    expect(collectFaStrings(card('کِتاب')).flatMap(findPersianTextViolations)).toEqual([])
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
      latinHint: 'k',
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

  it('walks the Danish hint on a letter — a ي hidden in Danish copy is still a violation', () => {
    const withHint: Letter = {
      id: 'ye-fixture',
      glyph: 'ی',
      name: { fa: 'یِ', da: 'ye' },
      forms: { isolated: 'ی', initial: 'یـ', medial: 'ـیـ', final: 'ـی' },
      joinsLeft: true,
      sound: { da: 'j i "ja"', ipa: 'j' },
      strokes: [{ d: 'M 82 14 L 18 44', kind: 'stroke' }],
      latinHint: 'j',
      hint: 'Alene står ي uden prikker.', // deliberately bad: Arabic yeh, should be ی
    }
    const badLesson: Lesson = { id: 'fixture-hint-bad', kind: 'alphabet', items: [withHint] }
    expect(collectFaStrings(badLesson).flatMap(findPersianTextViolations).length).toBeGreaterThan(0)

    const fixed: Lesson = {
      ...badLesson,
      id: 'fixture-hint-fixed',
      items: [{ ...withHint, hint: 'Alene står ی uden prikker.' }],
    }
    expect(collectFaStrings(fixed).flatMap(findPersianTextViolations)).toEqual([])
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

  it('walks the orientation bodies too — they print Persian inside Danish sentences', () => {
    for (const point of ORIENTATION_POINTS) {
      expect(PERSIAN_UI_STRINGS, point.id).toContain(point.body)
    }
    expect(ORIENTATION_POINTS.some((point) => PERSIAN.test(point.body))).toBe(true)
  })

  it('walks the name override table — a mistyped ك or ي in a name fails here', () => {
    expect(NAME_OVERRIDE_FA_STRINGS.length).toBeGreaterThan(80)
    for (const spelling of NAME_OVERRIDE_FA_STRINGS) {
      expect(findPersianTextViolations(spelling), spelling).toEqual([])
    }
  })

  it('walks every spelling the engine generates for the fixture names', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      for (const spelling of suggestSpellings(name)) {
        expect(findPersianTextViolations(spelling), `${name} → ${spelling}`).toEqual([])
      }
    }
  })
})

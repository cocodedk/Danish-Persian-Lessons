import { describe, it, expect } from 'vitest'
import { KEYBOARD_ROWS, KEYBOARD_KEYS, canType } from './layout'
import { ZWNJ, SPACE } from './buffer'
import { letters, specimens } from '../lessons/alphabet'
import { findPersianTextViolations } from '../lessons/textRules'
import { allVocabWords } from '../lessons/vocab'

const ids = KEYBOARD_KEYS.map((key) => key.id)

const stylesheets = import.meta.glob('../components/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

describe('the key map', () => {
  it('carries all 32 letters, each exactly once', () => {
    for (const letter of letters) {
      expect(ids.filter((id) => id === letter.id), letter.id).toHaveLength(1)
    }
    expect(KEYBOARD_KEYS.filter((key) => key.kind === 'letter')).toHaveLength(33)
  })

  it('carries آ too — the primer opens on آب, so the board has to write it', () => {
    expect(ids.filter((id) => id === 'alef-madde')).toHaveLength(1)
  })

  it('carries the ZWNJ, the space and the backspace, each exactly once', () => {
    for (const id of ['zwnj', 'space', 'backspace']) {
      expect(ids.filter((each) => each === id), id).toHaveLength(1)
    }
  })

  it('has no key twice — not by id, and not by what it writes', () => {
    expect(new Set(ids).size).toBe(ids.length)
    const written = KEYBOARD_KEYS.map((key) => key.glyph).filter(Boolean)
    expect(new Set(written).size).toBe(written.length)
  })

  it('names every letter key the way the alphabet lesson names it — one source', () => {
    for (const key of KEYBOARD_KEYS.filter((each) => each.kind === 'letter')) {
      expect(key.label, key.id).toBe(specimens[key.id].name.da)
      expect(key.glyph, key.id).toBe(specimens[key.id].glyph)
    }
  })

  it('gives every letter key the same Danish sound hint the alphabet data carries', () => {
    const letterKeys = KEYBOARD_KEYS.filter((each) => each.kind === 'letter')
    for (const key of letterKeys) {
      expect(key.hint, key.id).toBe(specimens[key.id].latinHint)
      expect(key.hint, key.id).toBeTruthy()
    }
  })

  it('labels the three sign keys in plain Danish, so no key is a mystery', () => {
    const signs = KEYBOARD_KEYS.filter((key) => key.kind !== 'letter')
    expect(signs.map((key) => key.label)).toEqual([
      'mellemrum',
      'halvt mellemrum',
      'slet sidste tegn',
    ])
    expect(signs.map((key) => key.glyph)).toEqual([SPACE, ZWNJ, ''])
  })

  it('gives the three sign keys no Latin hint — they keep their own caption', () => {
    const signs = KEYBOARD_KEYS.filter((key) => key.kind !== 'letter')
    for (const key of signs) {
      expect(key.hint, key.id).toBeUndefined()
    }
  })

  it('lays out six rows of six — the widest grid that keeps every key ≥44px at 360px', () => {
    expect(KEYBOARD_ROWS).toHaveLength(6)
    for (const row of KEYBOARD_ROWS) expect(row).toHaveLength(6)
  })

  it('writes Persian code points only — no Arabic ك or ي on any key', () => {
    for (const key of KEYBOARD_KEYS) {
      expect(findPersianTextViolations(key.glyph), key.id).toEqual([])
    }
  })
})

describe('how the board is drawn', () => {
  const keyboardCss = stylesheets['../components/PersianKeyboard.css']
  const typeCss = stylesheets['../components/TypeExercise.css']

  it('gives every key the 44px floor in both directions, in a six-column grid', () => {
    expect(keyboardCss).toContain('grid-template-columns: repeat(6, 1fr)')
    expect(keyboardCss).toContain('min-block-size: var(--tap-min)')
    expect(keyboardCss).toContain('min-inline-size: var(--tap-min)')
  })

  it('shows keyboard focus, the way the accessibility floor requires', () => {
    expect(keyboardCss).toMatch(/:focus-visible\s*\{[^}]*outline: 2px solid var\(--blue\)/)
  })

  it('draws the Danish sound hint in the orange token, in the Latin face', () => {
    expect(keyboardCss).toMatch(/\.keyboard__hint\s*\{[^}]*color: var\(--orange\)/)
    expect(keyboardCss).toMatch(/\.keyboard__hint\s*\{[^}]*font-family: var\(--font-latin\)/)
  })

  it('animates nothing — there is no motion here for reduced motion to take away', () => {
    for (const css of [keyboardCss, typeCss]) {
      expect(css).not.toMatch(/animation|@keyframes|transition/)
    }
  })

  it('marks the divergence in the red pen, and leaves every other cell in ink', () => {
    expect(typeCss).toMatch(/\.type__cell--mark \{[^}]*var\(--red\)/)
    // The ink cells stay ink: only the marked one is red.
    expect(typeCss).toMatch(/\.type__cell \{[^}]*color: var\(--ink\)/)
  })
})

describe('what the board can write', () => {
  it('can write every word in every unit — the typing rounds are all reachable', () => {
    for (const word of allVocabWords) {
      expect(canType(word.fa), word.fa).toBe(true)
    }
  })

  it('can write a compound name, which needs the space key', () => {
    expect(canType('آنه مته')).toBe(true)
  })

  it('cannot write a name spelled with a sign outside the 32 — لوئیزه has ئ', () => {
    expect(canType('لوئیزه')).toBe(false)
  })
})

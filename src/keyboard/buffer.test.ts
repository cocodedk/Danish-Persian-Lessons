import { describe, it, expect } from 'vitest'
import { ZWNJ, appendLetter, appendSeparator, backspace, press } from './buffer'

describe('the typing buffer', () => {
  it('appends a letter to an empty buffer', () => {
    expect(appendLetter('', 'ب')).toBe('ب')
  })

  it('is the string itself — letters land in typing order and nothing joins them', () => {
    // بابا typed left to right in code-point order: ب ا ب ا. The browser does
    // the shaping; there is no joining logic here to get wrong.
    const typed = ['ب', 'ا', 'ب', 'ا'].reduce(appendLetter, '')
    expect(typed).toBe('بابا')
    expect([...typed]).toHaveLength(4)
  })

  it('takes آ as the single code point it is', () => {
    expect([...appendLetter('', 'آ')]).toHaveLength(1)
  })
})

describe('backspace', () => {
  it('removes the last code point', () => {
    expect(backspace('بابا')).toBe('باب')
  })

  it('on an empty buffer leaves it empty', () => {
    expect(backspace('')).toBe('')
  })

  it('removes a lone ZWNJ — one press, one code point', () => {
    expect(backspace(`می${ZWNJ}`)).toBe('می')
    expect(backspace(`می${ZWNJ}ر`)).toBe(`می${ZWNJ}`)
  })

  it('never splits a code point into halves', () => {
    // Nothing in Persian sits outside the BMP, but the rule is code points, and
    // a `slice(0, -1)` would hand back half a surrogate pair.
    expect(backspace('ب😀')).toBe('ب')
  })
})

describe('ZWNJ', () => {
  it('never starts the buffer — a نیم‌فاصله needs a letter to its right', () => {
    expect(appendSeparator('', ZWNJ)).toBe('')
  })

  it('appends after a letter', () => {
    expect(appendSeparator('می', ZWNJ)).toBe(`می${ZWNJ}`)
  })

  it('never doubles — a second press collapses into the first', () => {
    const once = appendSeparator('می', ZWNJ)
    expect(appendSeparator(once, ZWNJ)).toBe(once)
  })

  it('writes a joined word the way Persian spells it', () => {
    expect(appendLetter(appendSeparator('کتاب', ZWNJ), 'ه')).toBe(`کتاب${ZWNJ}ه`)
  })
})

describe('space', () => {
  it('never starts the buffer and never doubles', () => {
    expect(appendSeparator('', ' ')).toBe('')
    expect(appendSeparator('آنه ', ' ')).toBe('آنه ')
  })

  it('separates the two parts of a compound name', () => {
    expect(appendSeparator('آنه', ' ')).toBe('آنه ')
  })

  it('cannot follow a ZWNJ, and a ZWNJ cannot follow it — one separator at a time', () => {
    expect(appendSeparator(`می${ZWNJ}`, ' ')).toBe(`می${ZWNJ}`)
    expect(appendSeparator('آنه ', ZWNJ)).toBe('آنه ')
  })
})

describe('press', () => {
  it('routes every key kind to its rule', () => {
    expect(press('با', 'letter', 'ب')).toBe('باب')
    expect(press('با', 'separator', ZWNJ)).toBe(`با${ZWNJ}`)
    expect(press('', 'separator', ZWNJ)).toBe('')
    expect(press('باب', 'backspace', '')).toBe('با')
  })
})

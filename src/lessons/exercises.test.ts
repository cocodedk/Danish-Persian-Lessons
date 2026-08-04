import { describe, it, expect } from 'vitest'
import { buildQuestions } from './exercises'
import { letters, teachingOrder, specimens } from './alphabet'

const find = buildQuestions('find')
const match = buildQuestions('match')

describe('exercise questions', () => {
  it('asks about every specimen once, in teaching order', () => {
    expect(find.map((q) => q.itemId)).toEqual(teachingOrder)
    expect(match.map((q) => q.itemId)).toEqual(letters.map((l) => l.id))
  })

  it('gives every question four distinct choices, one of them right', () => {
    for (const question of [...find, ...match]) {
      expect(question.choices, question.id).toHaveLength(4)
      expect(new Set(question.choices.map((c) => c.id)).size, question.id).toBe(4)
      expect(new Set(question.choices.map((c) => c.glyph)).size, question.id).toBe(4)
      expect(question.choices.some((c) => c.id === question.answerId), question.id).toBe(true)
    }
  })

  it('says every prompt twice — dansk lydskrift and IPA — from the letter data', () => {
    for (const question of [...find, ...match]) {
      expect(question.sound, question.id).toEqual(specimens[question.itemId].sound)
      expect(question.sound.da.length).toBeGreaterThan(0)
      expect(question.sound.ipa.length).toBeGreaterThan(0)
    }
  })

  it('does not park the answer in the same slot every time', () => {
    const slots = find.map((q) => q.choices.findIndex((c) => c.id === q.answerId))
    expect(new Set(slots).size).toBe(4)
  })

  it('offers exactly one choice that matches the prompt sound — every question, both rounds', () => {
    for (const question of [...find, ...match]) {
      const matches = question.choices.filter(
        (choice) =>
          specimens[choice.id].sound.ipa === question.sound.ipa ||
          specimens[choice.id].sound.da === question.sound.da,
      )
      expect(matches.map((choice) => choice.id), question.id).toEqual([question.answerId])
    }
  })

  it('never offers a homophone as a distractor — ذ ز ض ظ · ث س ص · ت ط · ح ه · ق غ', () => {
    const groups = [
      ['zal', 'ze', 'zad', 'za'],
      ['se', 'sin', 'sad'],
      ['te', 'ta'],
      ['he-jimi', 'he'],
      ['ghaf', 'gheyn'],
    ]
    for (const group of groups) {
      const sounds = new Set(group.map((id) => specimens[id].sound.ipa))
      expect(sounds.size, group.join(' ')).toBe(1)
    }
    for (const question of [...find, ...match]) {
      const group = groups.find((ids) => ids.includes(question.answerId)) ?? []
      const offered = question.choices.map((choice) => choice.id).filter((id) => group.includes(id))
      expect(offered, question.id).toEqual(group.length ? [question.answerId] : [])
    }
  })

  it('picks distractors a learner could actually confuse — same body, other dots', () => {
    const be = find.find((q) => q.itemId === 'be')
    expect(be?.choices.map((c) => c.id).sort()).toEqual(['be', 'pe', 'se', 'te'])
  })

  it('asks non-joiners about their final form, since they have no medial one', () => {
    const alef = match.find((q) => q.itemId === 'alef')
    expect(alef?.promptDa).toContain('sidst i et ord')
    expect(alef?.choices.find((c) => c.id === 'alef')?.glyph).toBe('ـا')
  })

  it('shows real positional forms, never a bare glyph, in "Match formerne"', () => {
    for (const question of match) {
      for (const choice of question.choices) {
        const letter = letters.find((l) => l.id === choice.id)
        expect(Object.values(letter!.forms), question.id).toContain(choice.glyph)
      }
      expect(question.promptFa).toBe(specimens[question.itemId].glyph)
    }
  })

  it('is deterministic — the same round every time', () => {
    expect(buildQuestions('find')).toEqual(find)
    expect(buildQuestions('match')).toEqual(match)
  })
})

// Which form every letter of a name takes, derived — never typed out. The
// alphabet lesson already owns the letters and whether each joins to the left
// (src/lessons/alphabet.ts); this reads that data one position at a time.
import { letters, specimens } from '../lessons/alphabet'
import type { Letter } from '../lessons/types'

export type FormKey = keyof Letter['forms']

const TATWEEL = 'ـ'

export interface NameLetter {
  /** Position among the letters of the name, counting from the right. */
  index: number
  glyph: string
  form: FormKey
  /** The form as the pen writes it, joining strokes included: بـ ـتـ ـک ر */
  formGlyph: string
  /** All four, so a screen can show where this one sits among them. */
  forms: Letter['forms']
  nameDa: string
  nameFa: string
  joinsLeft: boolean
}

interface Shape {
  forms: Letter['forms']
  joinsLeft: boolean
  nameDa: string
  nameFa: string
}

function derive(glyph: string, joinsLeft: boolean, nameDa: string, nameFa: string): Shape {
  return {
    forms: {
      isolated: glyph,
      initial: joinsLeft ? glyph + TATWEEL : glyph,
      medial: joinsLeft ? TATWEEL + glyph + TATWEEL : TATWEEL + glyph,
      final: TATWEEL + glyph,
    },
    joinsLeft,
    nameDa,
    nameFa,
  }
}

const MADDE = specimens['alef-madde']

const SHAPES = new Map<string, Shape>([
  ...letters.map((letter): [string, Shape] => [
    letter.glyph,
    {
      forms: letter.forms,
      joinsLeft: letter.joinsLeft,
      nameDa: letter.name.da,
      nameFa: letter.name.fa,
    },
  ]),
  // آ is a sign on an alef, not the 33rd letter, so it carries no forms of its
  // own — and like alef it never joins to the left.
  [MADDE.glyph, derive(MADDE.glyph, false, MADDE.name.da, MADDE.name.fa)],
])

/**
 * A Persian letter that is not one of the 32 — ئ in لوئیزه, say. It joins on
 * both sides, which is true of every such form, and it is named after itself.
 */
// Written as code-point escapes on purpose: the ranges cover the letters of the
// Arabic block, and spelling them out would print the two forbidden glyphs
// (U+0643, U+064A) in the source. U+0640, the tatweel, is left out: it is a
// joining stroke, not a letter.
const PERSIAN_LETTER = /[\u0620-\u063F\u0641-\u064A\u066E-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FF]/

function shapeOf(char: string | undefined): Shape | undefined {
  if (char === undefined) return undefined
  const known = SHAPES.get(char)
  if (known) return known
  return PERSIAN_LETTER.test(char) ? derive(char, true, char, char) : undefined
}

/**
 * Every letter of `spelling`, in reading order, with the form it takes there.
 * A space breaks the join: a compound name is two words, not one.
 */
export function nameLetters(spelling: string): NameLetter[] {
  const chars = [...spelling]
  const result: NameLetter[] = []

  chars.forEach((char, at) => {
    const shape = shapeOf(char)
    if (!shape) return

    const joinsBefore = shapeOf(chars[at - 1])?.joinsLeft ?? false
    const joinsAfter = shape.joinsLeft && shapeOf(chars[at + 1]) !== undefined
    const form: FormKey = joinsBefore
      ? joinsAfter
        ? 'medial'
        : 'final'
      : joinsAfter
        ? 'initial'
        : 'isolated'

    result.push({
      index: result.length,
      glyph: char,
      form,
      formGlyph: shape.forms[form],
      forms: shape.forms,
      nameDa: shape.nameDa,
      nameFa: shape.nameFa,
      joinsLeft: shape.joinsLeft,
    })
  })

  return result
}

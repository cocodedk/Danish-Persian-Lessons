// The letters a learner taps: the whole alphabet when they spell their name by
// hand, and the name's own letters (plus two strangers) when they put it back
// together. Pure, and deliberately without Math.random — a bank opens the same
// way every time, so the exercise a test plays is the exercise the learner
// plays. See docs/plans/006-your-name.md steps 2 and 5.
import { teachingOrder, specimens } from '../lessons/alphabet'
import { nameLetters } from './forms'

export interface Tile {
  /** Unique per tile, so the two ا of سارا are two tiles and not one. */
  key: string
  glyph: string
  /** The letter's Danish name — what the tap target says out loud. */
  nameDa: string
}

/** Letters from outside the name, mixed into the assembly bank. */
export const DISTRACTOR_COUNT = 2

/** Every letter of the alphabet, in teaching order: the bank for spelling by hand. */
export function alphabetBank(): Tile[] {
  return teachingOrder.map((id) => ({
    key: id,
    glyph: specimens[id].glyph,
    nameDa: specimens[id].name.da,
  }))
}

/** The glyphs of `spelling`, in reading order — what the learner has to place. */
export function nameGlyphs(spelling: string): string[] {
  return nameLetters(spelling).map((letter) => letter.glyph)
}

/**
 * The first `placed` letters of `spelling`, carrying the spaces that belong
 * between them. The browser shapes this exactly as it shapes the finished
 * name, so a half-built name already joins the way it will when it is done.
 */
export function assembledPrefix(spelling: string, placed: number): string {
  const isLetter = new Set(nameGlyphs(spelling))
  let written = 0
  let out = ''
  for (const char of spelling) {
    if (written >= placed) break
    if (isLetter.has(char)) written += 1
    out += char
  }
  return out.trimEnd()
}

/** One number per spelling, so every draw below is a function of the name. */
function seedOf(spelling: string): number {
  let seed = 7
  for (const char of spelling) seed = (seed * 31 + (char.codePointAt(0) ?? 0)) % 2147483647
  return seed || 7
}

/** Fisher-Yates, walked by a seeded generator: same name, same order, always. */
function shuffled(tiles: Tile[], seed: number): Tile[] {
  const out = [...tiles]
  let state = seed
  for (let at = out.length - 1; at > 0; at -= 1) {
    state = (state * 48271) % 2147483647
    const pick = state % (at + 1)
    ;[out[at], out[pick]] = [out[pick], out[at]]
  }
  return out
}

/** Two letters the name does not use — near enough to be worth looking twice at. */
function distractors(spelling: string, used: Set<string>): Tile[] {
  const strangers = alphabetBank().filter((tile) => !used.has(tile.glyph))
  const start = seedOf(spelling) % Math.max(strangers.length, 1)
  return strangers
    .slice(start)
    .concat(strangers.slice(0, start))
    .slice(0, DISTRACTOR_COUNT)
    .map((tile, at) => ({ ...tile, key: `x${at}` }))
}

/**
 * The tray for the re-assembly exercise: every letter of the name, one tile per
 * occurrence, plus two letters from outside it — shuffled.
 */
export function assemblyBank(spelling: string): Tile[] {
  const own: Tile[] = nameLetters(spelling).map((letter) => ({
    key: `n${letter.index}`,
    glyph: letter.glyph,
    nameDa: letter.nameDa,
  }))
  const used = new Set(own.map((tile) => tile.glyph))
  return shuffled([...own, ...distractors(spelling, used)], seedOf(spelling))
}

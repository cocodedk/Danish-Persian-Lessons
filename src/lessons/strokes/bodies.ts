// Pen paths for the stroke-order drawings, in one shared coordinate system:
//
//   viewBox 0 0 100 100 · baseline y = 62 · ascender top y ≈ 12 · descender y ≈ 90
//   the pen enters on the RIGHT (high x) and travels LEFT — that is the motion
//   the drawing exists to teach.
//
// These are pen skeletons, not letterforms: how the hand moves, shown beside
// the real glyph. Letters that share a body share the same constant here — ب پ
// ت ث really are one shape with four different dot sets, and the data says so.
// src/lessons/strokes/strokes.test.ts proves the sharing is not a coincidence.
import type { Stroke } from '../types'

const stroke = (d: string): Stroke => ({ d, kind: 'stroke' })

/** One pen dot: a short right-to-left tick that reads as a dot under a round cap. */
export function dot(x: number, y: number): Stroke {
  return { d: `M ${x + 1} ${y} L ${x - 1} ${y}`, kind: 'dot' }
}

/** Two dots side by side — the right one first, because the pen starts right. */
export function twoDots(x: number, y: number): Stroke[] {
  return [dot(x + 8, y), dot(x - 8, y)]
}

/**
 * Three dots as the caret a teacher actually draws: right, left, then the apex.
 * `apexOffset` is negative for a caret above the letter, positive for one below.
 */
export function threeDots(x: number, y: number, apexOffset: number): Stroke[] {
  return [dot(x + 8, y), dot(x - 8, y), dot(x, y + apexOffset)]
}

/** ا — one downstroke, top to bottom. */
export const ALEF = stroke('M 50 14 L 50 62')

/** The madde of آ: a wave laid over the alef, right to left, drawn last. */
export const MADDE = stroke('M 68 12 C 60 4 54 16 46 10 C 42 7 38 8 34 13')

/** ب پ ت ث — one boat: down at the right, along the bowl, up at the left. */
export const BE = stroke('M 84 38 C 84 56 82 66 60 66 C 38 66 20 62 16 46')

/** ج چ ح خ — the top stroke leftwards, then the bowl down and back right. */
export const JIM = stroke('M 80 32 C 64 34 48 34 36 38 C 18 44 18 72 40 80 C 56 86 72 80 82 70')

/** د ذ — in from the top right, down to the corner, out along the line. */
export const DAL = stroke('M 68 26 C 54 28 42 42 46 52 C 50 60 62 62 78 62')

/** ر ز ژ — one falling stroke that leaves the line to the lower left. */
export const RE = stroke('M 68 30 C 66 44 58 58 36 74')

/** س ش — three teeth, right to left, then the long bowl. */
export const SIN = stroke(
  'M 86 44 C 86 58 82 62 78 62 C 74 62 74 46 71 44 C 68 46 68 62 63 62' +
    ' C 58 62 58 46 55 44 C 52 46 52 62 46 64 C 32 70 18 62 16 48',
)

/** ص ض — the eye on the right, then the bowl out to the left and back. */
export const SAD = stroke(
  'M 82 50 C 70 42 54 46 54 55 C 54 63 72 65 82 58 C 62 64 34 62 26 70 C 36 80 66 76 82 66',
)

/** ط ظ — the bowl's right rim first, over the top, down past the upright's
 * foot, then the tail out to the lower left; the upright is a second stroke
 * standing on the left, where the bowl closes. */
export const TA = stroke('M 88 48 C 88 36 76 30 67 33 C 56 33 40 40 34 48 C 26 56 10 58 2 60')
export const TA_BAR = stroke('M 30 14 L 30 62')

/** ع غ — the head, then the deep bowl below the line. */
export const EYN = stroke(
  'M 66 32 C 54 24 40 30 42 42 C 44 50 58 52 68 46 C 50 54 34 62 32 72 C 30 84 50 90 68 82',
)

/** ف — the head, then a tail that stays on the line. */
export const FE = stroke(
  'M 76 40 C 64 32 50 38 52 48 C 54 56 70 58 78 50 C 74 58 66 62 52 62 C 36 62 24 60 20 50',
)

/** ق — the same head over a bowl that drops below the line. */
export const QAF = stroke(
  'M 74 40 C 62 32 48 38 50 48 C 52 56 68 58 76 50 C 72 60 62 68 48 70 C 32 72 24 62 26 52',
)

/** ک گ — one long stroke from the top of the upright down and out to the left. */
export const KAF = stroke('M 82 14 C 76 32 68 50 62 60 C 54 65 38 65 28 62 C 20 59 16 52 18 44')

/** The small mark inside ک. A stroke, not a dot — the pen never lifts twice. */
export const KAF_SERIF = stroke('M 58 38 L 46 41 L 54 49')

/** سرکش — the second bar that turns ک into گ, parallel to the upright. */
export const SARKASH = stroke('M 72 10 C 66 28 58 44 52 54')

/** ل — down the upright, then the bowl out to the left. */
export const LAM = stroke('M 74 14 L 74 50 C 74 60 66 64 52 64 C 36 64 26 58 26 46')

/** م — the small round head on the line, then the tail straight down. */
export const MIM = stroke('M 66 50 C 56 44 44 48 46 56 C 48 63 60 65 66 59 C 64 70 62 82 56 90')

/** ن — one deep bowl, right rim to left rim. */
export const NUN = stroke('M 76 40 C 76 58 68 70 50 70 C 32 70 24 58 24 40')

/** و — the little head, then away to the lower left. */
export const VAV = stroke('M 64 40 C 54 34 44 40 46 48 C 48 55 60 57 66 51 C 64 62 56 74 40 82')

/** ه — one closed loop. */
export const HE = stroke('M 58 36 C 44 34 34 42 38 52 C 42 62 58 66 66 58 C 72 51 68 40 58 36')

/** ی — the wide bowl below the line, hooking back to the right at the end. */
export const YE = stroke('M 78 38 C 78 56 66 68 48 68 C 30 68 22 58 28 50 C 32 46 38 46 42 50')

// Orientation — "lektion 0". Four surprises, after the one that matters most:
// Persian runs right to left. Shown, not told (docs/plans/003 step 6).
import type { Pron } from '../lessons/types'

/**
 * The flip, felt rather than explained: the learner reads a Danish word that
 * has been turned around, notices it is nonsense, and reads it again from the
 * right. Then the same move on the Persian word the app opens with.
 */
export const MIRROR_DEMO = {
  da: 'VAND',
  turned: 'DNAV',
  fa: 'آب',
  pron: { da: 'åb', ipa: 'ɒːb' } satisfies Pron,
}

export interface OrientationPoint {
  id: string
  /** Danish heading — short, du-form. */
  heading: string
  /** One or two Danish sentences. */
  body: string
  /** The row of specimens, read right to left. */
  fa: string[]
  /** What the row adds up to, when it adds up to something. */
  result?: string
  pron?: Pron
}

export const ORIENTATION_POINTS: OrientationPoint[] = [
  {
    id: 'join',
    heading: 'Bogstaverne holder i hånd',
    body: 'Fire bogstaver, ét ord. Persisk bindes sammen — næsten som når du selv skriver i hånden.',
    fa: ['ب', 'ا', 'ب', 'ا'],
    result: 'بابا',
    pron: { da: 'båbå', ipa: 'bɒːbɒː' },
  },
  {
    id: 'shapes',
    heading: 'Samme bogstav, ny form',
    body: 'ب skifter udseende efter, hvor i ordet den står. Lyden er den samme hele vejen.',
    fa: ['ب', 'بـ', 'ـبـ', 'ـب'],
  },
  {
    id: 'no-capitals',
    heading: 'Ingen store bogstaver',
    body: 'Persisk har hverken store eller små bogstaver. Et bynavn ser ud som ethvert andet ord.',
    fa: ['تهران'],
    pron: { da: 'tehrån', ipa: 'tehˈɾɒːn' },
  },
  {
    id: 'dots',
    heading: 'Prikkerne er en del af bogstavet',
    body: 'Samme krop, forskellige prikker — og så er det fire forskellige bogstaver. Tæl dem altid.',
    fa: ['ب', 'پ', 'ت', 'ث'],
  },
]

/**
 * Walked by the Persian text-rule guard (src/content/faStrings.ts). The Danish
 * bodies come along because they print Persian inline — «ب skifter udseende» is
 * as much fa content as the specimen row above it.
 */
export const ORIENTATION_FA_STRINGS: string[] = [
  MIRROR_DEMO.fa,
  ...ORIENTATION_POINTS.flatMap((point) => [...point.fa, point.result ?? '', point.body]),
]

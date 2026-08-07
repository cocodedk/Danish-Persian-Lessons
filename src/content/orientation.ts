// Orientation — "lektion 0". Four surprises, after the one that matters most:
// Persian runs right to left. Shown, not told (docs/plans/003 step 6).
import type { PersianEntry } from '../catalog/types'
import { defineEntry } from '../catalog/types'
import { letters, specimens } from '../lessons/alphabet'
import { allVocabWords } from '../lessons/vocab'

// Loud at module load: the orientation is the first screen a new learner
// sees, so a renamed vocab id must fail the build (the test suite imports
// this module), never white-screen the entry point.
function word(id: string): PersianEntry {
  const found = allVocabWords.find((item) => item.id === id)?.entry
  if (!found) throw new Error(`orientation: vocab word '${id}' is missing`)
  return found
}
const letter = (id: string) => specimens[id].entry
const be = letters.find((item) => item.id === 'be')!

const TEHRAN_ENTRY = defineEntry({
  id: 'interface-orientation-tehran',
  kind: 'word',
  fa: 'تهران',
  da: 'Teheran',
  pron: { da: 'tehrån', ipa: 'tehˈɾɒːn' },
})

/**
 * The flip, felt rather than explained: the learner reads a Danish word that
 * has been turned around, notices it is nonsense, and reads it again from the
 * right. Then the same move on the Persian word the app opens with.
 */
export const MIRROR_DEMO = {
  da: 'VAND',
  turned: 'DNAV',
  entry: word('ab'),
}

export interface OrientationToken {
  entry: PersianEntry
  /** A positional form derived from the parent letter. */
  form?: string
  /** Context inside this word; overrides the isolated letter companion. */
  contextualPron?: PersianEntry['pron']
  contextualHelpDa?: string
}

export interface OrientationPoint {
  id: string
  /** Danish heading — short, du-form. */
  heading: string
  /** One or two Danish sentences. */
  body: string
  /** The row of specimens, read right to left. */
  fa: OrientationToken[]
  /** What the row adds up to, when it adds up to something. */
  result?: PersianEntry
}

export const ORIENTATION_POINTS: OrientationPoint[] = [
  {
    id: 'join',
    heading: 'Bogstaverne holder i hånd',
    body: 'Fire bogstaver, ét ord. Persisk bindes sammen — næsten som når du selv skriver i hånden.',
    fa: [
      { entry: letter('be') },
      { entry: letter('alef'), contextualPron: { da: 'å i “år”', ipa: 'ɒː' }, contextualHelpDa: 'lang vokal her' },
      { entry: letter('be') },
      { entry: letter('alef'), contextualPron: { da: 'å i “år”', ipa: 'ɒː' }, contextualHelpDa: 'lang vokal her' },
    ],
    result: word('baba'),
  },
  {
    id: 'shapes',
    heading: 'Samme bogstav, ny form',
    body: 'Be skifter udseende efter, hvor i ordet det står. Lyden er den samme hele vejen.',
    fa: ['isolated', 'initial', 'medial', 'final'].map((key) => ({
      entry: letter('be'),
      form: be.forms[key as keyof typeof be.forms],
    })),
  },
  {
    id: 'no-capitals',
    heading: 'Ingen store bogstaver',
    body: 'Persisk har hverken store eller små bogstaver. Et bynavn ser ud som ethvert andet ord.',
    fa: [{ entry: TEHRAN_ENTRY }],
  },
  {
    id: 'dots',
    heading: 'Prikkerne er en del af bogstavet',
    body: 'Samme krop, forskellige prikker — og så er det fire forskellige bogstaver. Tæl dem altid.',
    fa: ['be', 'pe', 'te', 'se'].map((id) => ({ entry: letter(id) })),
  },
]

export const ORIENTATION_ENTRIES: PersianEntry[] = [TEHRAN_ENTRY]

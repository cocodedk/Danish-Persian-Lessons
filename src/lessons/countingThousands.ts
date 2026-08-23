import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'
import { countingNumbers } from './numbers'
import { joiner, tens } from './counting21to99'
import { hundreds } from './counting100to900'
import type {
  RuleBaseForm,
  RuleComposition,
  RuleLessonDescriptor,
} from './countingRuleTypes'

/**
 * "Regnereglen tusinder" — lesson 4 of the counting curriculum
 * (docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.1 and § 3.3, plan 017
 * fixpoint C). Scope stops at 9.999; 10.000 and up are out of the curriculum.
 *
 * CANDIDATE CONTENT. Every Persian form, marked teaching form, dansk lydskrift
 * and IPA below is a candidate draft. None of it is reviewed or approved, and
 * none of it may be released, described as reviewed, or used as evidence until
 * AAA-QUALITY-BAR.md Gate A is satisfied in full with human evidence.
 */

const ID_PREFIX = 'counting-tusinder-'

/** The foundation's own row for `value`, referenced rather than copied. */
function foundationWord(value: number): PersianEntry {
  const row = countingNumbers.find((number) => number.value === value)
  if (!row) throw new Error(`Regnereglen tusinder mangler grundrækken for ${value}`)
  return row.word
}

/** Lesson 2's own ten, referenced rather than copied. */
function tenEntry(value: number): PersianEntry {
  const row = tens.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen tusinder mangler tieren ${value}`)
  return row.entry
}

/** Lesson 3's own hundred, referenced rather than copied. */
function hundredEntry(value: number): PersianEntry {
  const row = hundreds.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen tusinder mangler hundrederækken ${value}`)
  return row.entry
}

/** A base form plus the rows its four language fields are read off, so a
 *  multiplier can never drift from the units and the tusind it is said with. */
export interface ThousandBase extends RuleBaseForm {
  readonly sources: readonly PersianEntry[]
}

/** The thousand word itself, this lesson's one new stem. Candidate draft. */
export const thousand: PersianEntry = defineEntry({
  id: `${ID_PREFIX}tusind`,
  kind: 'word',
  fa: 'هزار',
  faMarked: 'هِزار',
  da: 'tusind',
  pron: { da: 'hezår', ipa: 'hezɒːɾ' },
})

/** Every field of a multi-part row is spelled out by its ordered parts. */
function joined(parts: readonly PersianEntry[]) {
  return {
    fa: parts.map((part) => part.fa).join(' '),
    faMarked: parts.map((part) => part.faMarked ?? part.fa).join(' '),
    da: parts.map((part) => part.da).join(' '),
    pron: {
      da: parts.map((part) => part.pron.da).join(' '),
      ipa: parts.map((part) => part.pron.ipa).join(' '),
    },
  }
}

/** A thousand multiplier 2-9: the foundation's unit said in front of the
 *  thousand word. Nothing is copied from a lower stage — the two source rows
 *  are referenced and every field is derived from them. */
function multiplier(unitValue: number): ThousandBase {
  const sources = [foundationWord(unitValue), thousand] as const
  return {
    value: unitValue * 1000,
    sources,
    entry: defineEntry({
      id: `${ID_PREFIX}tusinde-${unitValue * 1000}`,
      kind: 'phrase',
      ...joined(sources),
    }),
  }
}

/** The nine base forms the rule needs. One thousand is the thousand word said
 *  alone — no unit in front of it — so it is that row, never a second copy. */
export const thousands: ThousandBase[] = [
  { value: 1000, entry: thousand, sources: [thousand] },
  ...[2, 3, 4, 5, 6, 7, 8, 9].map(multiplier),
]

function thousandEntry(value: number): PersianEntry {
  const row = thousands.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen tusinder mangler tusindrækken ${value}`)
  return row.entry
}

/**
 * The remainder after the thousand, in spoken order and made only of rows the
 * lessons below already own: a hundred from lesson 3, a round ten or a
 * ten-bindeled-enter chain from lesson 2, or a 1-20 form from the foundation.
 */
function remainderParts(remainder: number): PersianEntry[] {
  if (remainder === 0) return []
  if (remainder >= 100) {
    const hundred = hundredEntry(Math.floor(remainder / 100) * 100)
    const rest = remainderParts(remainder % 100)
    return rest.length === 0 ? [hundred] : [hundred, joiner, ...rest]
  }
  if (remainder <= 20) return [foundationWord(remainder)]
  const ten = tenEntry(Math.floor(remainder / 10) * 10)
  const unit = remainder % 10
  return unit === 0 ? [ten] : [ten, joiner, foundationWord(unit)]
}

/** One number the rule builds: the thousand row, and — when there is a
 *  remainder — the bindeled and the remainder's parts, in spoken order. A round
 *  thousand is spoken alone, so it *is* its base row and `da` goes unused. */
function composed(value: number, da: string): RuleComposition {
  const base = thousandEntry(Math.floor(value / 1000) * 1000)
  const rest = remainderParts(value % 1000)
  if (rest.length === 0) return { value, entry: base, parts: [base] }
  const parts: readonly PersianEntry[] = [base, joiner, ...rest]
  return {
    value,
    entry: defineEntry({ id: `${ID_PREFIX}tal-${value}`, kind: 'phrase', ...joined(parts), da }),
    parts,
  }
}

/** The worked examples, one per coverage bullet in § 3.1: the thousand word
 *  alone, a multiplier from 2 to 9, a hundreds remainder from lesson 3, a 21-99
 *  remainder from lesson 2, a 1-20 remainder from the foundation, and 9.999. */
export const examples: RuleComposition[] = [
  composed(1000, 'tusind'),
  composed(5000, 'fem tusind'),
  composed(1300, 'et tusind tre hundrede'),
  composed(1042, 'et tusind og toogfyrre'),
  composed(1007, 'et tusind og syv'),
  composed(9999, 'ni tusind ni hundrede og nioghalvfems'),
]

/** Numbers the lesson never shows, kept for the build-it-yourself round. */
export const targets: RuleComposition[] = [
  composed(2088, 'to tusind og otteogfirs'),
  composed(3105, 'tre tusind et hundrede og fem'),
  composed(5642, 'fem tusind seks hundrede og toogfyrre'),
  composed(8371, 'otte tusind tre hundrede og enoghalvfjerds'),
]

export const countingThousandsLesson: RuleLessonDescriptor = {
  path: '/lesson/taelle/tusinder',
  title: 'Regnereglen tusinder',
  summary: 'Byg alle tal fra 1.000 til 9.999 af et tusind og en rest',
  // The scope fixed by docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.3.
  range: [1000, 9999],
  idPrefix: ID_PREFIX,
  storageKey: 'counting.tusinder',
  rule:
    'Sig tusindtallet først, så bindeleddet i listen herunder, og til sidst resten. '
    + 'Resten kender du: den er et hundredetal fra reglen 100-900, et tal fra reglen '
    + '21-99 eller et tal fra lektionen 1-20. Et rundt tusind siges alene, uden rest.',
  buildsOn: { labelDa: 'regnereglen 100-900', path: '/lesson/taelle/100-900' },
  boundaryNotes: [
    'Nedad slutter reglen ved 1.000: 999 er det sidste tal, du bygger med reglen '
    + '100-900, og 1.000 er det første runde tusind, du siger alene her.',
    'Opad slutter reglen ved 9.999: 9.999 er det sidste tal, du bygger her, og det '
    + 'er også det sidste tal i hele taldelen — 10.000 og opefter lærer du ikke her.',
  ],
  // Lesson 2's joining element, referenced: there is only one of it.
  joiner,
  baseForms: thousands,
  examples,
  targets,
}

/** Everything this lesson adds to the catalog: the thousand word, the eight
 *  derived multipliers and one entry per composed whole. The reused joiner,
 *  hundreds, tens and 1-20 rows are deliberately absent — other modules
 *  already register them. */
export const countingThousandsCatalog: PersianEntry[] = [
  ...thousands.map((base) => base.entry),
  ...[...examples, ...targets]
    .filter((composition) => composition.parts.length > 1)
    .map((composition) => composition.entry),
]

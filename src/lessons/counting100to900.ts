import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'
import { countingNumbers } from './numbers'
import { joiner, tens } from './counting21to99'
import type {
  RuleBaseForm,
  RuleComposition,
  RuleLessonDescriptor,
} from './countingRuleTypes'

/**
 * "Regnereglen 100-900" — lesson 3 of the counting curriculum
 * (docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.2, plan 017 fixpoint B).
 *
 * CANDIDATE CONTENT. Every Persian form, marked teaching form, dansk lydskrift
 * and IPA below is a candidate draft. None of it is reviewed or approved, and
 * none of it may be released, described as reviewed, or used as evidence until
 * AAA-QUALITY-BAR.md Gate A is satisfied in full with human evidence.
 *
 * The lesson teaches a rule: nine hundred multipliers, five worked examples and
 * four unseen build targets — never the 900 numbers the rule covers.
 */

const ID_PREFIX = 'counting-100900-'

/** The foundation's own row for `value`, referenced rather than copied. */
function foundationWord(value: number): PersianEntry {
  const row = countingNumbers.find((number) => number.value === value)
  if (!row) throw new Error(`Regnereglen 100-900 mangler grundrækken for ${value}`)
  return row.word
}

/** Lesson 2's own ten, referenced rather than copied. */
function tenEntry(value: number): PersianEntry {
  const row = tens.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen 100-900 mangler tieren ${value}`)
  return row.entry
}

type HundredRow = [fa: string, faMarked: string, da: string, pronDa: string, ipa: string]

function hundred(value: number, [fa, faMarked, da, pronDa, ipa]: HundredRow): RuleBaseForm {
  return {
    value,
    entry: defineEntry({
      id: `${ID_PREFIX}hundrede-${value}`,
      kind: 'word',
      fa,
      faMarked,
      da,
      pron: { da: pronDa, ipa },
    }),
  }
}

/**
 * Every hundred multiplier from 100 to 900, each once. All nine are new
 * candidate rows: several of them — 200, 300 and 500 — are not predictable
 * from the matching enter, so the rule needs them stated, not derived.
 */
export const hundreds: RuleBaseForm[] = [
  hundred(100, ['صد', 'صَد', 'hundrede', 'sad', 'sæd']),
  hundred(200, ['دویست', 'دِویست', 'to hundrede', 'devist', 'devist']),
  hundred(300, ['سیصد', 'سیصَد', 'tre hundrede', 'sisad', 'siːsæd']),
  hundred(400, ['چهارصد', 'چَهارصَد', 'fire hundrede', 'tjahårsad', 'tʃæhɒːrsæd']),
  hundred(500, ['پانصد', 'پانصَد', 'fem hundrede', 'pånsad', 'pɒːnsæd']),
  hundred(600, ['ششصد', 'شِشصَد', 'seks hundrede', 'sjesjsad', 'ʃeʃsæd']),
  hundred(700, ['هفتصد', 'هَفتصَد', 'syv hundrede', 'haftsad', 'hæftsæd']),
  hundred(800, ['هشتصد', 'هَشتصَد', 'otte hundrede', 'hasjtsad', 'hæʃtsæd']),
  hundred(900, ['نهصد', 'نُهصَد', 'ni hundrede', 'nohsad', 'nohsæd']),
]

function hundredEntry(value: number): PersianEntry {
  const row = hundreds.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen 100-900 mangler hundrederækken ${value}`)
  return row.entry
}

/**
 * The remainder after the hundred, in spoken order and made only of rows other
 * lessons already own: a 1-20 form from the foundation, a round ten from
 * lesson 2, or lesson 2's own ten-joiner-unit chain.
 */
function remainderParts(remainder: number): PersianEntry[] {
  if (remainder === 0) return []
  if (remainder <= 20) return [foundationWord(remainder)]
  const ten = Math.floor(remainder / 10) * 10
  const unit = remainder % 10
  if (unit === 0) return [tenEntry(ten)]
  return [tenEntry(ten), joiner, foundationWord(unit)]
}

/**
 * One number the rule builds: the hundred, and — when there is a remainder —
 * the bindeled and the remainder's own parts, in spoken order. A round hundred
 * is spoken alone, so it *is* its base row: the same object, never a second
 * copy of it. Everything longer gets one derived entry whose Persian, marked
 * form and both pronunciation aids are spelled out by its parts.
 */
function composed(value: number, da: string): RuleComposition {
  const base = hundredEntry(Math.floor(value / 100) * 100)
  const rest = remainderParts(value % 100)
  if (rest.length === 0) return { value, entry: base, parts: [base] }
  const parts: readonly PersianEntry[] = [base, joiner, ...rest]
  return {
    value,
    entry: defineEntry({
      id: `${ID_PREFIX}tal-${value}`,
      kind: 'phrase',
      fa: parts.map((part) => part.fa).join(' '),
      faMarked: parts.map((part) => part.faMarked ?? part.fa).join(' '),
      da,
      pron: {
        da: parts.map((part) => part.pron.da).join(' '),
        ipa: parts.map((part) => part.pron.ipa).join(' '),
      },
    }),
    parts,
  }
}

/**
 * The worked examples: a round hundred said alone, a hundred with an enter from
 * lektionen 1-20, a hundred with a teen from the same lesson, a hundred with
 * a number built by lesson 2's rule, and 999 — the last number this rule
 * builds, held against the 1,000 that belongs to lesson 4.
 */
export const examples: RuleComposition[] = [
  composed(500, 'fem hundrede'),
  composed(107, 'et hundrede og syv'),
  composed(315, 'tre hundrede og femten'),
  composed(642, 'seks hundrede og toogfyrre'),
  composed(999, 'ni hundrede og nioghalvfems'),
]

/** Numbers the lesson never shows, kept for the build-it-yourself round. */
export const targets: RuleComposition[] = [
  composed(208, 'to hundrede og otte'),
  composed(350, 'tre hundrede og halvtreds'),
  composed(416, 'fire hundrede og seksten'),
  composed(861, 'otte hundrede og enogtres'),
]

export const counting100to900Lesson: RuleLessonDescriptor = {
  path: '/lesson/taelle/100-900',
  title: 'Regnereglen 100-900',
  summary: 'Byg alle tal fra 100 til 999 af et hundrede og en rest',
  // Route and label say 100-900 — the nine hundreds the rule requires — while
  // the rule covers every whole number 100 through 999. The pairing is
  // intentional and is fixed in one place only:
  // docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.2 "Lesson 3 range: label
  // versus coverage". Nothing here re-derives it.
  range: [100, 999],
  // This lesson's two identities, stated once and read everywhere else: the
  // prefix its own rows carry (no reused remainder row does), and the storage
  // suffix its progress lives under.
  idPrefix: ID_PREFIX,
  storageKey: 'counting.100-900',
  rule:
    'Sig hundrederet først, så bindeleddet i listen herunder, og til sidst resten. '
    + 'Resten kender du: den er et tal fra lektionen 1-20 eller et tal, du bygger '
    + 'med reglen 21-99. Et rundt hundrede siges alene, helt uden rest.',
  buildsOn: { labelDa: 'regnereglen 21-99', path: '/lesson/taelle/21-99' },
  boundaryNotes: [
    'Nedad slutter reglen ved 100: 99 er det sidste tal fra lektionen 21-99, og '
    + '100 er det første runde hundrede, du siger alene her.',
    'Opad slutter reglen ved 999: 999 er det sidste tal, du bygger her, og 1.000 '
    + 'hører til næste lektion — du lærer det ikke i denne.',
  ],
  // Lesson 2's joining element, referenced: there is only one of it.
  joiner,
  baseForms: hundreds,
  examples,
  targets,
}

/** Everything this lesson adds to the catalog: the nine hundreds and the
 *  derived whole numbers. The reused joiner, tens and 1-20 rows are
 *  deliberately absent — other modules already register them. A round hundred
 *  is its own base row, so it appears once, as a base form. */
export const counting100to900Catalog: PersianEntry[] = [
  ...hundreds.map((base) => base.entry),
  ...[...examples, ...targets]
    .filter((composition) => composition.parts.length > 1)
    .map((composition) => composition.entry),
]

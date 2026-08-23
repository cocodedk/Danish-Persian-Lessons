import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'
import { countingNumbers } from './numbers'
import type {
  RuleBaseForm,
  RuleComposition,
  RuleLessonDescriptor,
} from './countingRuleTypes'

/**
 * "Regnereglen 21-99" — lesson 2 of the counting curriculum
 * (docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 1, plan 017 fixpoint A).
 *
 * CANDIDATE CONTENT. Every Persian form, marked teaching form, Danish meaning,
 * dansk lydskrift and IPA below is a candidate draft. None of it is reviewed or
 * approved, and none of it may be released, described as reviewed, or used as
 * evidence until AAA-QUALITY-BAR.md Gate A is satisfied in full with human
 * evidence. The UT Austin, MSU and dastur.info pages recorded in the counting
 * specification § 3.3 were consulted while drafting; consulting them approves
 * nothing.
 *
 * The lesson teaches a rule, not a list: eight base forms, four worked
 * examples and four unseen build targets — never the 79 numbers in range.
 */

const ID_PREFIX = 'counting-2199-'

/** The foundation's own row for `value`, referenced rather than copied. */
function foundationWord(value: number): PersianEntry {
  const row = countingNumbers.find((number) => number.value === value)
  if (!row) throw new Error(`Regnereglen 21-99 mangler grundrækken for ${value}`)
  return row.word
}

type TenRow = [fa: string, faMarked: string, da: string, pronDa: string, ipa: string]

function ten(value: number, [fa, faMarked, da, pronDa, ipa]: TenRow): RuleBaseForm {
  return {
    value,
    entry: defineEntry({
      id: `${ID_PREFIX}ti-${value}`,
      kind: 'word',
      fa,
      faMarked,
      da,
      pron: { da: pronDa, ipa },
    }),
  }
}

/**
 * The joining element between a ten and a unit. Candidate draft: said as a
 * short vowel that leans on the ten in front of it.
 */
export const joiner: PersianEntry = defineEntry({
  id: `${ID_PREFIX}bindeled`,
  kind: 'word',
  fa: 'و',
  da: 'og — bindeleddet mellem tieren og enteren',
  pron: { da: 'o', ipa: 'o' },
})

/**
 * Every ten from 20 to 90, each once. Twenty is the foundation's own row: the
 * lesson references it so the boundary against lesson 1 is literally the same
 * twenty, never a second copy of it. Thirty through ninety are new candidate
 * rows, and thirty doubles as the round ten that is spoken with no unit.
 */
export const tens: RuleBaseForm[] = [
  { value: 20, entry: foundationWord(20) },
  ten(30, ['سی', 'سی', 'tredive', 'si', 'siː']),
  ten(40, ['چهل', 'چِهِل', 'fyrre', 'tjehel', 'tʃehel']),
  ten(50, ['پنجاه', 'پَنجاه', 'halvtreds', 'pandjåh', 'pændʒɒːh']),
  ten(60, ['شصت', 'شَصت', 'tres', 'sjast', 'ʃæst']),
  ten(70, ['هفتاد', 'هَفتاد', 'halvfjerds', 'haftåd', 'hæftɒːd']),
  ten(80, ['هشتاد', 'هَشتاد', 'firs', 'hasjtåd', 'hæʃtɒːd']),
  ten(90, ['نود', 'نَوَد', 'halvfems', 'navad', 'nævæd']),
]

function tenEntry(value: number): PersianEntry {
  const row = tens.find((base) => base.value === value)
  if (!row) throw new Error(`Regnereglen 21-99 mangler tieren ${value}`)
  return row.entry
}

/**
 * One composite number: the ten, the joiner and the foundation's unit row, in
 * spoken order, plus the single catalog entry the three parts spell out. The
 * entry's Persian, marked form and both pronunciation aids are derived from
 * the parts, so a row can never disagree with the assembly that builds it.
 */
function composed(value: number, da: string): RuleComposition {
  const parts: readonly PersianEntry[] = [
    tenEntry(Math.floor(value / 10) * 10),
    joiner,
    foundationWord(value % 10),
  ]
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
 * The worked examples. Twenty-one sits on the boundary against lesson 1 and
 * reuses the foundation's "en"; thirty-one repeats the joiner with the same
 * unit on a different ten; forty-eight repeats it with a different unit;
 * ninety-nine is the boundary against lesson 3.
 */
export const examples: RuleComposition[] = [
  composed(21, 'enogtyve'),
  composed(31, 'enogtredive'),
  composed(48, 'otteogfyrre'),
  composed(99, 'nioghalvfems'),
]

/** Numbers the lesson never shows, kept for the build-it-yourself round. */
export const targets: RuleComposition[] = [
  composed(42, 'toogfyrre'),
  composed(57, 'syvoghalvtreds'),
  composed(68, 'otteogtres'),
  composed(73, 'treoghalvfjerds'),
]

export const counting21to99Lesson: RuleLessonDescriptor = {
  path: '/lesson/taelle/21-99',
  title: 'Regnereglen 21-99',
  summary: 'Byg alle tal fra 21 til 99 af en tier og en enter',
  // The range this lesson owns outright, written here and nowhere else: it
  // starts one above where the foundation stops and ends where lesson 3 takes
  // over. Twenty is referenced as a base form, never claimed as this range.
  range: [21, 99],
  // This lesson's two identities, stated once and read everywhere else: the
  // prefix its own rows carry (the foundation's twenty does not), and the
  // storage suffix its progress lives under.
  idPrefix: ID_PREFIX,
  storageKey: 'counting.21-99',
  rule:
    'Sig tieren først, så bindeleddet i listen herunder, og til sidst enteren. '
    + 'Tieren og enteren kender du: enterne er tallene fra lektionen 1-20. '
    + 'En rund tier siges alene, helt uden enter.',
  buildsOn: { labelDa: 'tallene 1-20', path: '/lesson/taelle' },
  boundaryNotes: [
    'Nedad slutter reglen ved 20: 20 er en rund tier fra lektionen 1-20 og '
    + 'siges alene, mens 21 er det første tal, du selv bygger af en tier og en enter.',
    'Opad slutter reglen ved 99: 99 er det sidste tal, du bygger her, og 100 '
    + 'hører til næste lektion — du lærer det ikke i denne.',
  ],
  joiner,
  baseForms: tens,
  examples,
  targets,
}

/** Everything this lesson adds to the catalog. The referenced foundation rows
 *  are deliberately absent: they are already registered by numbers.ts. */
export const counting21to99Catalog: PersianEntry[] = [
  joiner,
  ...tens.filter((base) => base.entry.id.startsWith(ID_PREFIX)).map((base) => base.entry),
  ...[...examples, ...targets].map((composition) => composition.entry),
]

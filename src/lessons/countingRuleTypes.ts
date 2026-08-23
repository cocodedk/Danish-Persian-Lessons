import type { PersianEntry } from '../catalog/types'

/**
 * The shapes shared by the three counting rule lessons (21-99, 100-900 and
 * tusinder — docs/plans/017-counting-rules.md, fixpoint A item 1). Only what
 * all three genuinely need lives here; anything one lesson alone needs stays
 * in that lesson's module.
 *
 * Nothing in this file asserts that any Persian form, IPA transcription or
 * dansk lydskrift reaching it is approved. Every rule lesson's rows are
 * candidate drafts, release-blocked until AAA-QUALITY-BAR.md Gate A is
 * satisfied with human evidence.
 */

/** One base form the rule needs: a ten, a hundred, or a thousand multiplier. */
export interface RuleBaseForm {
  /** The number this row says on its own — 30, 300, 3000. */
  value: number
  /** Referenced, never copied: a foundation row where one already exists. */
  entry: PersianEntry
}

/**
 * A number built by the lesson's rule, kept as one catalog entry plus the
 * ordered parts it is assembled from. The order is the spoken order, so the
 * `byg` token builder can offer the parts and check the sequence without
 * knowing which range it is teaching: [ten, joiner, unit] for 21-99, and the
 * longer chains lesson 3 and 4 compose. Parts are referenced entries, so an
 * assembly and the row it builds can never drift apart.
 */
export interface RuleComposition {
  value: number
  entry: PersianEntry
  parts: readonly PersianEntry[]
}

/** A composition the lesson shows and explains. */
export type WorkedExample = RuleComposition

/** A composition the lesson never shows, reserved for the `byg` round. */
export type CompositionTarget = RuleComposition

/** The lesson this one builds on, named in Danish and linked, never gated. */
export interface BuildsOn {
  /** Plain-Danish range name, e.g. "tallene 1-20". */
  labelDa: string
  /** Route of the lesson that teaches it. */
  path: string
}

/** One rule lesson as the app knows it: route, Danish copy, rows, examples. */
export interface RuleLessonDescriptor {
  path: string
  title: string
  summary: string
  /** The first and last number this lesson covers, stated once so the order
   *  of the counting lessons can be read off the descriptors instead of being
   *  retyped anywhere a screen needs to say where a range starts or stops.
   *  A boundary the rule names in Danish and this pair must agree. */
  readonly range: readonly [start: number, end: number]
  /** The id prefix every row this lesson authors carries, and no row it merely
   *  references does. Stated, never derived from one row's id: ownership is a
   *  contract of the lesson, not an accident of how its joiner was named. */
  idPrefix: string
  /** This lesson's storage suffix, i.e. everything after `dpl.v1.`. Stated
   *  here so the progress store and the lesson can never point apart. */
  storageKey: string
  /** The composition rule in plain Danish. Holds no Persian of its own; it
   *  points at the cataloged joining element instead. */
  rule: string
  buildsOn: BuildsOn
  /** Where this lesson's range stops in both directions, in plain Danish, so a
   *  generic screen can state the boundaries without hard-coding which numbers
   *  any one lesson covers. Danish only: these notes carry no Persian, and a
   *  note naming a number from outside the range says only that it is taught
   *  elsewhere — never that its form is available or approved here. */
  boundaryNotes: readonly string[]
  /** The joining element between the parts, as a catalog entry. */
  joiner: PersianEntry
  baseForms: RuleBaseForm[]
  examples: WorkedExample[]
  /** Unseen numbers for the build-it-yourself round; never shown as examples. */
  targets: CompositionTarget[]
}

/**
 * One part as it is *offered* in a `byg` round — an occurrence, not an entry.
 * The longer chains lesson 3 and 4 compose repeat the same joining element
 * more than once, so the same entry may be offered twice; each occurrence
 * still gets its own deterministic id, unique within the question, which the
 * builder can use as a React key without ever colliding.
 */
export interface BuildToken {
  /** This occurrence's own id. Unique in the question, stable across builds. */
  id: string
  /** The catalog entry offered here. Two occurrences may share it. */
  entryId: string
  entry: PersianEntry
  /** What is printed on the token. */
  glyph: string
}

/**
 * One assembly task: the number to build, the parts that build it in spoken
 * order, and the pool the learner picks from. `parts` is the answer — a
 * sequence of *entries*, so two occurrences of one entry are interchangeable —
 * and is kept for checking and for the reveal; `tokens` is what may be
 * rendered, and its order is fixed by id so nothing in the layout discloses
 * the sequence.
 */
export interface BuildQuestion {
  id: string
  /** The target's own catalog entry id — this lesson's prefix, its progress. */
  itemId: string
  /** The whole number, carrying the Persian and both pronunciations. Reveal
   *  data: it belongs after the attempt, never in the prompt or on a token. */
  entry: PersianEntry
  /** Danish only, and the number as digits. Says nothing the answer says. */
  promptDa: string
  targetValue: number
  /** The correct parts, in spoken order. */
  parts: readonly PersianEntry[]
  /** Every correct part occurrence plus plausible distractors, in a fixed,
   *  answer-blind order. */
  tokens: BuildToken[]
}

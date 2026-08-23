// The rule lessons' exercise model (plan 017, fixpoint A item 6), built from a
// `RuleLessonDescriptor` alone, so 21-99, 100-900 and tusinder share one
// implementation and no lesson writes a question by hand.
//
// Two round kinds reuse the choice machinery of ./exercises exactly as the
// foundation's rounds do (./countingExercises): four choices, one right, the
// answer in a different slot each question, nothing shuffled. The third kind,
// `byg`, is an assembly: it hands out the parts of an unseen number mixed with
// plausible distractors, and never puts the answer in the prompt.
//
// CANDIDATE CONTENT. Everything these rounds display comes from candidate
// draft rows, release-blocked until AAA-QUALITY-BAR.md Gate A is satisfied.
import { arrange, CHOICE_COUNT } from './exercises'
import type { Choice, Question } from './exercises'
import type { PersianEntry } from '../catalog/types'
import type { BuildQuestion, BuildToken, RuleLessonDescriptor } from './countingRuleTypes'

export type RuleRecognitionKind = 'betydning' | 'tal'

export const RULE_RECOGNITION_TITLES: Record<RuleRecognitionKind, string> = {
  betydning: 'Find betydningen',
  tal: 'Find tallet',
}

export const RULE_BUILD_TITLE = 'Byg tallet'

export function isRuleRecognitionKind(value: string): value is RuleRecognitionKind {
  return value === 'betydning' || value === 'tal'
}

/** A row this lesson authored, rather than one it merely references. */
function owns(descriptor: RuleLessonDescriptor, entry: PersianEntry): boolean {
  return entry.id.startsWith(descriptor.idPrefix)
}

/**
 * Code-point order over ids, spelled out rather than left to `localeCompare`,
 * whose result depends on the runtime's locale data. Ids are ASCII by
 * construction, so this order reads the same on every machine.
 */
function byId(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

/** Everything a recognition round may print: the lesson's base forms and its
 *  worked examples. The joining element is left out — a piece of a number, not
 *  a number — and so are the build targets, which `byg` needs unseen. */
function recognitionPool(descriptor: RuleLessonDescriptor): PersianEntry[] {
  return [
    ...descriptor.baseForms.map((base) => base.entry),
    ...descriptor.examples.map((example) => example.entry),
  ]
}

/** Two rows never share a question when either could answer the other. */
function alike(a: PersianEntry, b: PersianEntry): boolean {
  return a.da === b.da || a.pron.ipa === b.pron.ipa || a.pron.da === b.pron.da
}

/** Three neighbours from the pool, wrapping around; sound-safe, never itself. */
function distractors(pool: PersianEntry[], index: number): PersianEntry[] {
  const row = pool[index]
  const picked: PersianEntry[] = []
  for (let step = 1; step < pool.length && picked.length < CHOICE_COUNT - 1; step += 1) {
    const other = pool[(index + step) % pool.length]
    if (!alike(other, row)) picked.push(other)
  }
  if (picked.length < CHOICE_COUNT - 1) {
    throw new Error(`countingRuleExercises: "${row.id}" har for få lydsikre distraktorer.`)
  }
  return picked
}

/** What a choice is printed with: the Danish meaning, or the Persian form. */
function choiceOf(entry: PersianEntry, kind: RuleRecognitionKind): Choice {
  return { id: entry.id, entry, glyph: kind === 'betydning' ? entry.da : entry.fa }
}

/**
 * One question per row this lesson owns. A row it merely references (the
 * foundation's twenty) is a choice to think against, never a question: the
 * foundation already teaches it and owns its progress.
 */
export function buildRuleRecognitionQuestions(
  descriptor: RuleLessonDescriptor,
  kind: RuleRecognitionKind,
): Question[] {
  const pool = recognitionPool(descriptor)
  const questions: Question[] = []
  pool.forEach((entry, index) => {
    if (!owns(descriptor, entry)) return
    questions.push({
      id: `${kind}-${entry.id}`,
      itemId: entry.id,
      entry,
      promptDa:
        kind === 'betydning' ? 'Hvilket tal er det?' : `Hvilket ord betyder »${entry.da}«?`,
      // `betydning` shows the vocalized specimen and hides the pronunciation,
      // which would spell the answer; `tal` hides the specimen while the
      // attempt is live. The reveal afterwards always carries everything.
      ...(kind === 'betydning' ? { showsFa: true, showsPron: false } : {}),
      choices: arrange(
        choiceOf(entry, kind),
        distractors(pool, index).map((other) => choiceOf(other, kind)),
        questions.length,
      ),
      answerId: entry.id,
      choiceLang: kind === 'betydning' ? ('da' as const) : ('fa' as const),
    })
  })
  return questions
}

/** How many wrong parts share the pool with the right ones. */
const BUILD_DISTRACTOR_COUNT = 2

function dedupe(entries: PersianEntry[]): PersianEntry[] {
  const seen = new Set<string>()
  return entries.filter((entry) => !seen.has(entry.id) && seen.add(entry.id))
}

/**
 * Two wrong parts of the kinds this rule actually joins: one base form and one
 * unit the worked examples already introduced. Both come from the descriptor,
 * and never repeat a correct part's id or writing, which would make a second
 * assembly right.
 */
function buildDistractors(
  descriptor: RuleLessonDescriptor,
  parts: readonly PersianEntry[],
): PersianEntry[] {
  const usedIds = new Set(parts.map((part) => part.id))
  const usedFa = new Set(parts.map((part) => part.fa))
  const free = (entry: PersianEntry) => !usedIds.has(entry.id) && !usedFa.has(entry.fa)
  const bases = descriptor.baseForms.map((base) => base.entry)
  const baseIds = new Set(bases.map((entry) => entry.id))
  const units = dedupe(descriptor.examples.flatMap((example) => [...example.parts])).filter(
    (entry) => entry.id !== descriptor.joiner.id && !baseIds.has(entry.id),
  )
  const picked = [bases.find(free), units.find(free)].filter(
    (entry): entry is PersianEntry => entry !== undefined,
  )
  if (picked.length < BUILD_DISTRACTOR_COUNT) {
    throw new Error(
      `countingRuleExercises: byg-runden mangler distraktorer til ${parts.map((p) => p.id).join('+')}.`,
    )
  }
  return picked
}

/**
 * The pool, one token per *occurrence*: a part the answer needs twice is
 * offered twice, so a longer chain repeating the joining element can be laid
 * out in full. Occurrences are numbered in the (deterministic) order offered,
 * and that number rides in the token id — unique inside the question, stable
 * between builds, and disclosing no slot once the ids are sorted.
 */
function poolOf(questionId: string, offered: readonly PersianEntry[]): BuildToken[] {
  const counted = new Map<string, number>()
  return offered
    .map((entry) => {
      const occurrence = counted.get(entry.id) ?? 0
      counted.set(entry.id, occurrence + 1)
      const id = `${questionId}--${entry.id}--${occurrence}`
      return { id, entryId: entry.id, entry, glyph: entry.fa }
    })
    .sort((a, b) => byId(a.id, b.id))
}

/**
 * Whether a laid-out sequence of tokens spells the target. The answer is a
 * sequence of entries, so which *occurrence* of a repeated part fills which
 * slot is not part of it: two identical joining elements swapped is the same
 * number, and is accepted. A token is still spent only once.
 */
export function isBuildSolved(question: BuildQuestion, tokenIds: readonly string[]): boolean {
  if (tokenIds.length !== question.parts.length) return false
  if (new Set(tokenIds).size !== tokenIds.length) return false
  const entryOf = new Map(question.tokens.map((token) => [token.id, token.entryId]))
  return question.parts.every((part, index) => entryOf.get(tokenIds[index]) === part.id)
}

/** One build question per unseen target the lesson reserved. */
export function buildRuleBuildQuestions(descriptor: RuleLessonDescriptor): BuildQuestion[] {
  return descriptor.targets.map((target) => {
    const id = `byg-${target.entry.id}`
    return {
      id,
      itemId: target.entry.id,
      entry: target.entry,
      promptDa: `Byg tallet ${target.value}`,
      targetValue: target.value,
      parts: target.parts,
      tokens: poolOf(id, [...target.parts, ...buildDistractors(descriptor, target.parts)]),
    }
  })
}

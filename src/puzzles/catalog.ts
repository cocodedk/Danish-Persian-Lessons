import { specimens, teachingOrder } from '../lessons/alphabet'
import { arrange } from '../lessons/exercises'
import { vocabUnits, type VocabWord } from '../lessons/vocab'
import type { PersianEntry } from '../catalog/types'
import type { MissingTask, PuzzleDefinition, PuzzleGroup, PuzzleTask } from './types'

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let at = 0; at < items.length; at += size) result.push(items.slice(at, at + size))
  return result
}

function alphabetChunks(items: string[]): string[][] {
  const groups = chunks(items, 4)
  const tail = groups.at(-1)
  // A lone leftover borrows a neighbour instead of joining a group of five:
  // every group stays within the 2–4 tasks a puzzle break promises, so no
  // letter is ever silently left out of its own group's puzzle.
  if (tail && tail.length < 2 && groups.length > 1) {
    tail.unshift(groups[groups.length - 2].pop()!)
  }
  return groups
}

function matchTasks(entries: PersianEntry[]): PuzzleTask[] {
  const choices = entries.slice(0, 4)
  return choices.map((entry) => ({ id: `match-${entry.id}`, kind: 'match', entry, choices }))
}

const byGlyph = new Map(Object.values(specimens).map((item) => [item.entry.fa, item.entry]))

function wordTiles(word: VocabWord) {
  const tiles = [...word.fa].map((glyph, at) => {
    const entry = byGlyph.get(glyph)
    // Loud at module load — the test suite imports this catalog, so a word
    // whose letter has no specimen fails the build instead of shipping a tile
    // that announces the whole word's meaning as a letter's name.
    if (!entry) throw new Error(`order puzzle: no alphabet entry for a letter of ${word.entry.id}`)
    return { id: `${word.entry.id}-tile-${at}`, entry, glyph }
  })
  return tiles.slice(1).concat(tiles.slice(0, 1))
}

function shortWords(words: VocabWord[]): VocabWord[] {
  return words.filter((word) => [...word.fa].length >= 2 && [...word.fa].length <= 4)
}

function orderTasks(introduced: VocabWord[]): PuzzleTask[] {
  const eligible = shortWords(introduced)
  const duplicate = eligible.find((word) => new Set(word.fa).size < [...word.fa].length)
  const picked = [duplicate, ...eligible].filter(
    (word, at, all): word is VocabWord => word !== undefined && all.indexOf(word) === at,
  ).slice(0, 2)
  return picked.map((entry) => ({
    id: `order-${entry.entry.id}`,
    kind: 'order',
    entry: entry.entry,
    tiles: wordTiles(entry),
  }))
}

function missingChoices(answer: PersianEntry, seed: number): PersianEntry[] {
  const letters = Object.values(specimens).map((item) => item.entry)
  const distractors: PersianEntry[] = []
  for (let step = 1; distractors.length < 2; step += 1) {
    const candidate = letters[(seed + step) % letters.length]
    if (candidate.fa !== answer.fa && !distractors.some((item) => item.fa === candidate.fa)) {
      distractors.push(candidate)
    }
  }
  return arrange(answer, distractors, seed)
}

function missingTasks(introduced: VocabWord[]): MissingTask[] {
  return shortWords(introduced).slice(-2).map((word, index) => {
    const chars = [...word.fa]
    const missingAt = index % chars.length
    const answer = byGlyph.get(chars[missingAt])
    if (!answer) throw new Error(`missing puzzle: no alphabet entry for ${chars[missingAt]}`)
    return {
      id: `missing-${word.entry.id}`,
      kind: 'missing',
      entry: word.entry,
      missingAt,
      choices: missingChoices(answer, index + chars.length),
    }
  })
}

export const alphabetGroups: PuzzleGroup[] = alphabetChunks(teachingOrder).map((itemIds, index, groups) => {
  const entries = itemIds.map((id) => specimens[id].entry)
  const introducedIds = groups.slice(0, index + 1).flat()
  return {
    id: `alphabet-cluster-${index + 1}`,
    title: `Bogstavgruppe ${index + 1}`,
    itemIds,
    puzzle: {
      id: `alphabet-${index + 1}-match`,
      kind: 'match',
      title: 'Match tegn og lydhjælp',
      backTo: '/lesson/alphabet',
      introducedEntryIds: introducedIds.map((id) => specimens[id].entry.id),
      tasks: matchTasks(entries),
    },
  }
})

export const vocabularyGroups: Record<string, PuzzleGroup[]> = Object.fromEntries(
  vocabUnits.map((unit) => {
    const groups = chunks(unit.words, 4).map((words, index): PuzzleGroup => {
      const introduced = unit.words.slice(0, (index + 1) * 4)
      const kind = (['match', 'order', 'missing'] as const)[index % 3]
      const tasks =
        kind === 'match'
          ? matchTasks(words.map((word) => word.entry))
          : kind === 'order'
            ? orderTasks(introduced)
            : missingTasks(introduced)
      const puzzle: PuzzleDefinition = {
        id: `vocabulary-${unit.id}-${index + 1}-${kind}`,
        kind,
        title:
          kind === 'match' ? 'Match ord og betydning' : kind === 'order' ? 'Sæt ordet sammen' : 'Find det manglende bogstav',
        backTo: `/lesson/ord/${unit.id}`,
        introducedEntryIds: [
          ...teachingOrder.map((id) => specimens[id].entry.id),
          ...introduced.map((word) => word.entry.id),
        ],
        tasks,
      }
      return {
        id: `vocabulary-${unit.id}-group-${index + 1}`,
        title: `Ordgruppe ${index + 1}`,
        itemIds: words.map((word) => word.id),
        puzzle,
      }
    })
    return [unit.id, groups]
  }),
)

export const puzzles: PuzzleDefinition[] = [
  ...alphabetGroups.map((group) => group.puzzle),
  ...Object.values(vocabularyGroups).flat().map((group) => group.puzzle),
]

export function findPuzzle(id: string): PuzzleDefinition | undefined {
  return puzzles.find((puzzle) => puzzle.id === id)
}

import { describe, expect, it } from 'vitest'
import { childMissions, findChildMission, tilesForMission } from './missions'

describe('child word missions', () => {
  it('uses exactly the three canonical image-backed vocabulary entries', () => {
    expect(childMissions.map(({ id, word, imageEntryId }) => ({
      id,
      entryId: word.entry.id,
      imageEntryId,
    }))).toEqual([
      { id: 'ab', entryId: 'vocabulary-1-ab', imageEntryId: 'vocabulary-1-ab' },
      { id: 'nan', entryId: 'vocabulary-1-nan', imageEntryId: 'vocabulary-1-nan' },
      { id: 'gol', entryId: 'vocabulary-3-gol', imageEntryId: 'vocabulary-3-gol' },
    ])
  })

  it('finds only known mission ids', () => {
    expect(findChildMission('nan')?.word.da).toBe('brød')
    expect(findChildMission('unknown')).toBeUndefined()
  })

  it('gives every source letter a stable id and target position', () => {
    const nan = findChildMission('nan')!
    const tiles = tilesForMission(nan)

    expect(tiles.map((tile) => tile.glyph)).not.toEqual(Array.from(nan.word.fa))
    expect(tiles.map((tile) => tile.targetIndex).sort()).toEqual([0, 1, 2])
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(3)
  })
})

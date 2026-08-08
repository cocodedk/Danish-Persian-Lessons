import { childMissions, findChildMission } from '../child/missions'
import { readJSON, writeJSON } from './storage'

interface ChildCollectionRecord {
  completedMissionIds?: unknown
}

const KEY = 'child-collection'

export function getChildCollection(): string[] {
  const { completedMissionIds } = readJSON<ChildCollectionRecord>(KEY, {})
  if (!Array.isArray(completedMissionIds)) return []
  const stored = new Set(completedMissionIds.filter((id): id is string => typeof id === 'string'))
  return childMissions.map(({ id }) => id).filter((id) => stored.has(id))
}

export function addCollectedMission(id: string): boolean {
  if (!findChildMission(id)) return false
  const current = getChildCollection()
  if (current.includes(id)) return false
  const completedMissionIds = childMissions
    .map(({ id: missionId }) => missionId)
    .filter((missionId) => missionId === id || current.includes(missionId))
  writeJSON<ChildCollectionRecord>(KEY, { completedMissionIds })
  return true
}

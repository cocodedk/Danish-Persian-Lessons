import { readJSON, writeJSON } from './storage'

export interface SpeakingPractice {
  entryId: string
  heard: number
  spoken: number
  lastHeardAt?: string
  lastSpokenAt?: string
}

interface SpeakingStore {
  version: 1
  items: Record<string, SpeakingPractice>
}

const KEY = 'speaking'

function readStore(): SpeakingStore {
  const raw = readJSON<Partial<SpeakingStore>>(KEY, {})
  const items = raw.items && typeof raw.items === 'object' ? raw.items : {}
  return { version: 1, items }
}

function normalized(entryId: string, value?: Partial<SpeakingPractice>): SpeakingPractice {
  return {
    entryId,
    heard: Math.max(0, Math.floor(Number(value?.heard) || 0)),
    spoken: Math.max(0, Math.floor(Number(value?.spoken) || 0)),
    ...(typeof value?.lastHeardAt === 'string' ? { lastHeardAt: value.lastHeardAt } : {}),
    ...(typeof value?.lastSpokenAt === 'string' ? { lastSpokenAt: value.lastSpokenAt } : {}),
  }
}

function update(entryId: string, kind: 'heard' | 'spoken', now = new Date()): SpeakingPractice {
  const store = readStore()
  const current = normalized(entryId, store.items[entryId])
  const next: SpeakingPractice = kind === 'heard'
    ? { ...current, heard: current.heard + 1, lastHeardAt: now.toISOString() }
    : { ...current, spoken: current.spoken + 1, lastSpokenAt: now.toISOString() }
  store.items[entryId] = next
  writeJSON<SpeakingStore>(KEY, store)
  return next
}

export function markHeard(entryId: string, now?: Date): SpeakingPractice {
  return update(entryId, 'heard', now)
}

export function markSpoken(entryId: string, now?: Date): SpeakingPractice {
  return update(entryId, 'spoken', now)
}

export function speakingPractice(entryId: string): SpeakingPractice {
  return normalized(entryId, readStore().items[entryId])
}

export function allSpeakingPractice(): SpeakingPractice[] {
  const store = readStore()
  return Object.entries(store.items).map(([entryId, value]) => normalized(entryId, value))
}

// Generic, JSON-safe localStorage wrapper. Keys are namespaced `dpl.v1.<key>`.
// Falls back to an in-memory store when localStorage throws (private-mode
// denial, quota exceeded, etc.) so the app stays fully usable either way.
// Every stored value is wrapped with a schema version for future migrations;
// an unreadable or version-mismatched envelope is treated as absent.

const PREFIX = 'dpl.v1.'
const SCHEMA_VERSION = 1

interface Envelope<T> {
  schemaVersion: number
  value: T
}

const memory = new Map<string, string>()

function rawGet(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key)
    if (value !== null) return value
  } catch {
    // localStorage denied — fall through to the in-memory store.
  }
  return memory.get(key) ?? null
}

function rawSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
    return
  } catch {
    // localStorage denied or full — fall through to the in-memory store.
  }
  memory.set(key, value)
}

/** Reads and parses `key`, returning `fallback` if absent, corrupt, or on a schema mismatch. */
export function readJSON<T>(key: string, fallback: T): T {
  const raw = rawGet(PREFIX + key)
  if (raw === null) return fallback

  try {
    const parsed = JSON.parse(raw) as Partial<Envelope<T>>
    if (!parsed || typeof parsed !== 'object' || parsed.schemaVersion !== SCHEMA_VERSION) {
      return fallback
    }
    return parsed.value as T
  } catch {
    return fallback
  }
}

/** Serializes `value` under `key`, wrapped with the current schema version. */
export function writeJSON<T>(key: string, value: T): void {
  const envelope: Envelope<T> = { schemaVersion: SCHEMA_VERSION, value }
  rawSet(PREFIX + key, JSON.stringify(envelope))
}

/** True once anything has ever been written to `key` (even an empty object). */
export function keyExists(key: string): boolean {
  return rawGet(PREFIX + key) !== null
}

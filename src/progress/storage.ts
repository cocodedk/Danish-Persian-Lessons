// Generic, JSON-safe localStorage wrapper. Keys are namespaced `dpl.v1.<key>`.
// Every stored value is wrapped with a schema version for future migrations;
// an unreadable or version-mismatched envelope is treated as absent.
//
// `memory` is a write-through cache, not just a denial fallback: every write
// lands there first, unconditionally, before localStorage is even tried. A
// read prefers memory whenever the key is there. That ordering is what makes
// generosity rule 1 (nothing ever shows a lower number) hold through a quota
// error or private-mode denial: a write that fails to persist to disk still
// wins the very next read, because the read never has to trust a localStorage
// that may be silently behind. A write that succeeds keeps both copies equal,
// so which one answers a read is invisible the rest of the time.

const PREFIX = 'dpl.v1.'
const SCHEMA_VERSION = 1

interface Envelope<T> {
  schemaVersion: number
  value: T
}

const memory = new Map<string, string>()

function rawGet(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null
  try {
    return window.localStorage.getItem(key)
  } catch {
    // localStorage denied — no memory entry either, so there is nothing to read.
    return null
  }
}

function rawSet(key: string, value: string): void {
  // Always first: whatever happens to localStorage below, the very next read
  // (in this session) sees this value, never an older one still on disk.
  memory.set(key, value)
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // localStorage denied or full — memory already holds the write.
  }
}

/**
 * Test-only escape hatch: clears the write-through cache. Production code
 * never calls this — nothing in the app's own code ever calls
 * `localStorage.clear()` either, so the cache never needs to forget on
 * purpose. Tests that do call `localStorage.clear()` to start a case from a
 * blank slate need this too (wired once, globally, in `src/test/setup.ts`),
 * or a later case would still read back an earlier case's write.
 */
export function resetMemoryCache(): void {
  memory.clear()
}

/**
 * Reads and parses `key`, returning `fallback` if absent, corrupt, or on a
 * schema mismatch.
 *
 * Contract — objects and arrays only. Every store in this app keeps a record or
 * a list, so a stored primitive (a string, a number, a boolean) is corruption
 * rather than content and reads back as `fallback`; `null` is rejected for the
 * same reason, since it would crash the first field access downstream. Writing
 * a primitive is therefore a one-way trip: `writeJSON` stores it, `readJSON`
 * will not hand it back. Wrap scalars in a record — `{ name }`, not `name`.
 */
export function readJSON<T>(key: string, fallback: T): T {
  const raw = rawGet(PREFIX + key)
  if (raw === null) return fallback

  try {
    const parsed = JSON.parse(raw) as Partial<Envelope<T>>
    if (!parsed || typeof parsed !== 'object' || parsed.schemaVersion !== SCHEMA_VERSION) {
      return fallback
    }
    // A `null` value is a corrupt envelope, not legitimate content — an array
    // is still welcome (callers that store one already treat it as such).
    if (parsed.value === null || typeof parsed.value !== 'object') {
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

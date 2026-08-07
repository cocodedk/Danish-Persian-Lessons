import { dayKey, isValidDayKey } from '../rewards/days'

export function validReviewDay(value: unknown): value is string {
  if (typeof value !== 'string' || !isValidDayKey(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString().slice(0, 10) === value
}

export function reviewDay(now: Date): string | null {
  const key = dayKey(now)
  return validReviewDay(key) ? key : null
}

export function addLocalDays(key: string, amount: number): string {
  if (!validReviewDay(key)) return key
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + amount))
  return date.toISOString().slice(0, 10)
}

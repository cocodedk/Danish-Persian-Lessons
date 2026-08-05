import { useState } from 'react'

/**
 * Plan 010's round rule, owned once: every success is counted, and only a
 * fully successful round (`completed`) pays the completion reward — a partial
 * round keeps what it earned and costs nothing.
 */
export function useRoundOutcome(total: number) {
  const [successes, setSuccesses] = useState(0)
  const [finished, setFinished] = useState(false)
  return {
    finished,
    completed: successes === total,
    recordSuccess: () => setSuccesses((value) => value + 1),
    /** Closes the round and answers whether it completed — so the payout gate
     * cannot read stale state. */
    finish: () => {
      setFinished(true)
      return successes === total
    },
    reset: () => {
      setSuccesses(0)
      setFinished(false)
    },
  }
}

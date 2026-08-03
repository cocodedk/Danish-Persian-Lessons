import { useCallback, useState } from 'react'
import { celebrate } from './engine'
import { playCues } from './sound'
import type { Gift, Reward, RewardEventKind } from './types'

/**
 * Ties a screen to the reward engine: one call per completion, and the screen
 * gets back everything it needs to celebrate — the reward to show, a level-up
 * to flip the page on, and a gift to offer. Sound rides along, and stays quiet
 * until the learner has touched the page.
 */
export function useCelebration() {
  const [reward, setReward] = useState<Reward | null>(null)
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const [gift, setGift] = useState<Gift | null>(null)

  const cheer = useCallback((kind: RewardEventKind, giftId?: string): Reward => {
    const next = celebrate(kind, undefined, giftId)
    playCues(next.sounds)
    setReward(next)
    if (next.levelUp !== null) setLevelUp(next.levelUp)
    if (next.gift !== null) setGift(next.gift)
    return next
  }, [])

  /** The page-flip has finished showing. */
  const levelSeen = useCallback(() => setLevelUp(null), [])

  /** The gift was put away for later. Nothing happens to anything else. */
  const giftSaved = useCallback(() => setGift(null), [])

  return { reward, levelUp, gift, cheer, levelSeen, giftSaved }
}

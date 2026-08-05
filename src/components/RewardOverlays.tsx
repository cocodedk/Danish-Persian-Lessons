import { PageFlip } from './PageFlip'
import { GiftCard } from './GiftCard'
import type { useCelebration } from '../rewards/useCelebration'

export interface RewardOverlaysProps {
  celebration: ReturnType<typeof useCelebration>
}

/**
 * The two rewards that outlive the moment they were earned in: the page-flip
 * when a level fills, and the bonus exercise offered as a gift. One line per
 * screen, so every screen that celebrates gets both without repeating itself.
 */
export function RewardOverlays({ celebration }: RewardOverlaysProps) {
  const { levelUp, gift, levelSeen, giftSaved } = celebration
  return (
    <>
      {gift !== null && <GiftCard gift={gift} onSkip={giftSaved} />}
      {/* Reaching level N means page N-1 is the one that just filled up. */}
      {levelUp !== null && <PageFlip page={levelUp - 1} onDone={levelSeen} />}
    </>
  )
}

import { PRAISE, WELCOME_BACK } from '../rewards/copy'
import { ProgressTick } from './ProgressTick'
import { StickerStamp } from './StickerStamp'
import { InkConfetti } from './InkConfetti'
import type { Reward } from '../rewards/types'
import './Celebration.css'

export interface CelebrationProps {
  /** What the engine just granted. Null only where no engine is wired in. */
  reward: Reward | null
  /** What the red tick says out loud. */
  tickLabel?: string
}

/**
 * What a completion looks like: the teacher's red tick, a warm line in both
 * languages, whatever stickers just landed, and — when there is something to
 * celebrate — a flick of ink across the paper. Never a score, never a streak
 * warning, never a countdown.
 */
export function Celebration({ reward, tickLabel = 'Rigtigt' }: CelebrationProps) {
  const praise = reward?.praise ?? PRAISE[0]
  const stickers = reward?.stickers ?? []
  const loud = stickers.length > 0 || reward?.levelUp !== null

  return (
    <div className="celebration">
      {loud && <InkConfetti />}

      <p className="celebration__praise">
        <ProgressTick granted label={tickLabel} />
        <span className="celebration__fa" lang="fa" dir="rtl">
          {praise.fa}
        </span>
        <span className="celebration__da" lang="da">
          {praise.da}
        </span>
      </p>

      {reward?.wokeUp && (
        <p className="celebration__welcome">
          <span className="celebration__fa" lang="fa" dir="rtl">
            {WELCOME_BACK.fa}
          </span>
          <span lang="da">
            {WELCOME_BACK.da} Stimen er vågen igen, nu {reward.streak.value} dage.
          </span>
        </p>
      )}

      {stickers.length > 0 && (
        <p className="celebration__stickers">
          {stickers.map((sticker) => (
            <StickerStamp key={sticker.id} kind={sticker.kind} />
          ))}
        </p>
      )}
    </div>
  )
}
